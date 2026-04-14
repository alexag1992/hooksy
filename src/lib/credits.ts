import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'

export const CREDIT_COSTS = {
  hooks: 1,
  ad_text: 2,
  image: 15,
} as const

export const DEMO_LIMITS = {
  hooks: 3,
  ads: 3,
  images: 3,
} as const

export type CreditAction = keyof typeof CREDIT_COSTS

type CheckResult =
  | { allowed: true }
  | { allowed: false; reason: 'not_authenticated' | 'demo_exhausted' | 'insufficient_credits' }

/**
 * Checks whether the user can perform an action, then consumes the credit/demo slot.
 * Uses the service-role admin client (bypasses RLS).
 */
export async function checkAndConsume(userId: string, action: CreditAction): Promise<CheckResult> {
  // Staff portal bypass — сотрудники без ограничений
  const cookieStore = await cookies()
  if (cookieStore.get('hooksy_staff')?.value === 'true') {
    return { allowed: true }
  }

  const admin = createAdminClient()

  // Admins bypass all limits
  const { data: profile } = await admin
    .from('profiles')
    .select('is_admin, is_tester')
    .eq('id', userId)
    .maybeSingle()

  if (profile?.is_admin) {
    return { allowed: true }
  }

  const isTester = !!profile?.is_tester

  // Check active subscription
  const { data: sub } = await admin
    .from('subscriptions')
    .select('status')
    .eq('user_id', userId)
    .eq('status', 'active')
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  if (sub || isTester) {
    // Paid user or tester — deduct credits
    const cost = CREDIT_COSTS[action]

    const { data: row } = await admin
      .from('user_credits')
      .select('balance')
      .eq('user_id', userId)
      .single()

    if (!row || row.balance < cost) {
      return { allowed: false, reason: 'insufficient_credits' }
    }

    await admin
      .from('user_credits')
      .update({ balance: row.balance - cost, updated_at: new Date().toISOString() })
      .eq('user_id', userId)

    await admin
      .from('credit_transactions')
      .insert({ user_id: userId, amount: -cost, action })

    return { allowed: true }
  }

  // Demo mode — check limits
  const { data: demo } = await admin
    .from('demo_usage')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (!demo) {
    // No demo row yet (shouldn't happen with trigger, but just in case)
    await admin.from('demo_usage').insert({ user_id: userId })
    return { allowed: true }
  }

  if (action === 'hooks' && demo.hooks_used >= DEMO_LIMITS.hooks) {
    return { allowed: false, reason: 'demo_exhausted' }
  }
  if (action === 'ad_text' && demo.ads_used >= DEMO_LIMITS.ads) {
    return { allowed: false, reason: 'demo_exhausted' }
  }
  if (action === 'image' && demo.images_used >= DEMO_LIMITS.images) {
    return { allowed: false, reason: 'demo_exhausted' }
  }

  // Increment the right counter
  const field =
    action === 'hooks' ? 'hooks_used' : action === 'ad_text' ? 'ads_used' : 'images_used'

  await admin
    .from('demo_usage')
    .update({ [field]: (demo[field] as number) + 1, updated_at: new Date().toISOString() })
    .eq('user_id', userId)

  return { allowed: true }
}

/**
 * Refunds a credit/demo slot when the action failed server-side (e.g. API timeout).
 */
export async function refundCredit(userId: string, action: CreditAction): Promise<void> {
  const admin = createAdminClient()

  const { data: profile } = await admin
    .from('profiles')
    .select('is_tester')
    .eq('id', userId)
    .maybeSingle()

  const { data: sub } = await admin
    .from('subscriptions')
    .select('status')
    .eq('user_id', userId)
    .eq('status', 'active')
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  if (sub || profile?.is_tester) {
    const cost = CREDIT_COSTS[action]
    const { data: row } = await admin
      .from('user_credits')
      .select('balance')
      .eq('user_id', userId)
      .maybeSingle()
    if (row) {
      await admin
        .from('user_credits')
        .update({ balance: row.balance + cost, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
    }
  } else {
    const field =
      action === 'hooks' ? 'hooks_used' : action === 'ad_text' ? 'ads_used' : 'images_used'
    const { data: demo } = await admin
      .from('demo_usage')
      .select('hooks_used, ads_used, images_used')
      .eq('user_id', userId)
      .maybeSingle()
    if (demo && (demo as Record<string, number>)[field] > 0) {
      await admin
        .from('demo_usage')
        .update({ [field]: (demo as Record<string, number>)[field] - 1, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
    }
  }
}
