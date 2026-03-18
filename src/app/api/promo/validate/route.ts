import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUser } from '@/lib/supabase/getUser'

// POST /api/promo/validate — validate a promo code before payment
export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { code } = await req.json()
  if (!code) return NextResponse.json({ error: 'No code' }, { status: 400 })

  const admin = createAdminClient()
  const { data: promo } = await admin
    .from('promo_codes')
    .select('*')
    .eq('code', code.trim().toUpperCase())
    .eq('is_active', true)
    .maybeSingle()

  if (!promo) return NextResponse.json({ valid: false, reason: 'not_found' })

  // Check expiry
  if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
    return NextResponse.json({ valid: false, reason: 'expired' })
  }

  // Check max uses
  if (promo.max_uses !== null && promo.uses_count >= promo.max_uses) {
    return NextResponse.json({ valid: false, reason: 'limit_reached' })
  }

  // Check single-use per user
  if (promo.is_single_use) {
    const { data: existing } = await admin
      .from('promo_code_uses')
      .select('id')
      .eq('code_id', promo.id)
      .eq('user_id', user.id)
      .maybeSingle()
    if (existing) return NextResponse.json({ valid: false, reason: 'already_used' })
  }

  return NextResponse.json({
    valid: true,
    discountPercent: promo.discount_percent,
    promoId: promo.id,
  })
}
