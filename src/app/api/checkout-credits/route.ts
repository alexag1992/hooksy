import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUser } from '@/lib/supabase/getUser'

const CREDITS_AMOUNT = 100
const CREDITS_PRICE = 290 // RUB

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Only for active subscribers
  const admin = createAdminClient()
  const { data: sub } = await admin
    .from('subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle()

  if (!sub) {
    return NextResponse.json({ error: 'No active subscription' }, { status: 403 })
  }

  const shopId = process.env.YUKASSA_SHOP_ID
  const secretKey = process.env.YUKASSA_SECRET_KEY
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hooksy.ru'

  if (!shopId || !secretKey) {
    return NextResponse.json({ error: 'Payment not configured' }, { status: 503 })
  }

  const description = `Хукси — ${CREDITS_AMOUNT} дополнительных кредитов`

  const paymentBody = {
    amount: {
      value: CREDITS_PRICE.toFixed(2),
      currency: 'RUB',
    },
    confirmation: {
      type: 'redirect',
      return_url: `${siteUrl}/success?type=credits`,
    },
    capture: true,
    description,
    receipt: {
      customer: { email: user.email },
      items: [
        {
          description,
          quantity: '1.00',
          amount: {
            value: CREDITS_PRICE.toFixed(2),
            currency: 'RUB',
          },
          vat_code: 1,
          payment_subject: 'service',
          payment_mode: 'full_payment',
        },
      ],
    },
    metadata: {
      user_id: user.id,
      plan: 'credits_100',
    },
  }

  const res = await fetch('https://api.yookassa.ru/v3/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotence-Key': `credits-${user.id}-${Date.now()}`,
      Authorization: `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString('base64')}`,
    },
    body: JSON.stringify(paymentBody),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('YuKassa credits error:', err)
    return NextResponse.json({ error: 'Payment creation failed' }, { status: 500 })
  }

  const payment = await res.json()
  return NextResponse.json({ confirmation_url: payment.confirmation.confirmation_url })
}
