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
  const admin = createAdminClient()

  // Admins bypass all limits
  const { data: profile } = await admin
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .maybeSingle()

  if (profile?.is_admin) {
    return { allowed: true }
  }

  // Check active subscription
  const { data: sub } = await admin
    .from('subscriptions')
    .select('status')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle()

  if (sub) {
    // Paid user — deduct credits
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
