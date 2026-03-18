import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUser } from '@/lib/supabase/getUser'

const BASE_PRICE = 990 // RUB

// POST /api/checkout — creates a YuKassa payment, returns confirmation_url
export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { promoCode } = await req.json()

  let discountPercent = 0
  let promoId: string | null = null

  // Validate promo code
  if (promoCode) {
    const admin = createAdminClient()
    const { data: promo } = await admin
      .from('promo_codes')
      .select('*')
      .eq('code', promoCode.trim().toUpperCase())
      .eq('is_active', true)
      .maybeSingle()

    if (promo) {
      const isExpired = promo.expires_at && new Date(promo.expires_at) < new Date()
      const isLimitReached = promo.max_uses !== null && promo.uses_count >= promo.max_uses

      if (!isExpired && !isLimitReached) {
        let canUse = true
        if (promo.is_single_use) {
          const { data: existing } = await admin
            .from('promo_code_uses')
            .select('id')
            .eq('code_id', promo.id)
            .eq('user_id', user.id)
            .maybeSingle()
          if (existing) canUse = false
        }
        if (canUse) {
          discountPercent = promo.discount_percent
          promoId = promo.id
        }
      }
    }
  }

  const finalPrice = Math.max(1, Math.round(BASE_PRICE * (1 - discountPercent / 100)))

  const shopId = process.env.YUKASSA_SHOP_ID
  const secretKey = process.env.YUKASSA_SECRET_KEY
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hooksy.ru'

  if (!shopId || !secretKey) {
    return NextResponse.json({ error: 'Payment not configured' }, { status: 503 })
  }

  const idempotenceKey = `${user.id}-${Date.now()}`
  const returnUrl = `${siteUrl}/success`

  const paymentBody = {
    amount: {
      value: finalPrice.toFixed(2),
      currency: 'RUB',
    },
    confirmation: {
      type: 'redirect',
      return_url: returnUrl,
    },
    capture: true,
    description: `Хукси База — 1 месяц${discountPercent > 0 ? ` (скидка ${discountPercent}%)` : ''}`,
    metadata: {
      user_id: user.id,
      plan: 'base',
      promo_id: promoId ?? '',
    },
  }

  const res = await fetch('https://api.yookassa.ru/v3/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotence-Key': idempotenceKey,
      Authorization: `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString('base64')}`,
    },
    body: JSON.stringify(paymentBody),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('YuKassa error:', err)
    return NextResponse.json({ error: 'Payment creation failed' }, { status: 500 })
  }

  const payment = await res.json()
  return NextResponse.json({
    confirmation_url: payment.confirmation.confirmation_url,
    payment_id: payment.id,
    final_price: finalPrice,
    discount_percent: discountPercent,
  })
}
