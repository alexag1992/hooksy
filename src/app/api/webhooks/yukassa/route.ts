import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const CREDITS_FOR_BASE_PLAN = 200

// POST /api/webhooks/yukassa?secret=<YUKASSA_WEBHOOK_SECRET>
export async function POST(req: NextRequest) {
  // Verify webhook secret
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret')
  if (!secret || secret !== process.env.YUKASSA_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const { event, object: payment } = body

  // Only handle succeeded payments
  if (event !== 'payment.succeeded') {
    return NextResponse.json({ ok: true })
  }

  const { user_id, plan, promo_id } = payment.metadata ?? {}
  if (!user_id || !plan) {
    console.error('YuKassa webhook: missing metadata', payment.metadata)
    return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Activate subscription (30 days)
  const now = new Date().toISOString()
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

  const { data: existingSub } = await admin
    .from('subscriptions')
    .select('id')
    .eq('user_id', user_id)
    .maybeSingle()

  if (existingSub) {
    await admin.from('subscriptions').update({
      status: 'active',
      plan,
      payment_id: payment.id,
      activated_at: now,
      expires_at: expiresAt,
    }).eq('user_id', user_id)
  } else {
    await admin.from('subscriptions').insert({
      user_id,
      status: 'active',
      plan,
      payment_id: payment.id,
      activated_at: now,
      expires_at: expiresAt,
    })
  }

  // Add credits
  const { data: existingCredits } = await admin
    .from('user_credits')
    .select('balance')
    .eq('user_id', user_id)
    .maybeSingle()

  const newBalance = (existingCredits?.balance ?? 0) + CREDITS_FOR_BASE_PLAN

  if (existingCredits) {
    await admin.from('user_credits')
      .update({ balance: newBalance, updated_at: now })
      .eq('user_id', user_id)
  } else {
    await admin.from('user_credits').insert({ user_id, balance: newBalance })
  }

  await admin.from('credit_transactions').insert({
    user_id,
    amount: CREDITS_FOR_BASE_PLAN,
    action: 'purchase',
  })

  // Record promo code usage
  if (promo_id) {
    const { data: promo } = await admin
      .from('promo_codes')
      .select('uses_count')
      .eq('id', promo_id)
      .maybeSingle()

    if (promo) {
      await admin.from('promo_codes')
        .update({ uses_count: promo.uses_count + 1 })
        .eq('id', promo_id)

      // Record per-user usage (ignore duplicate)
      await admin.from('promo_code_uses')
        .upsert({ code_id: promo_id, user_id }, { ignoreDuplicates: true })
    }
  }

  return NextResponse.json({ ok: true })
}
