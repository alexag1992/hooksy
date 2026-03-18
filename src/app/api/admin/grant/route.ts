import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUser } from '@/lib/supabase/getUser'

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()

  const { data: profile } = await admin.from('profiles').select('is_admin').eq('id', user.id).maybeSingle()
  if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { userId, amount } = await req.json()
  if (!userId || !amount || typeof amount !== 'number' || amount <= 0) {
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 })
  }

  // Upsert user_credits
  const { data: existing } = await admin.from('user_credits').select('balance').eq('user_id', userId).maybeSingle()

  if (existing) {
    await admin
      .from('user_credits')
      .update({ balance: existing.balance + amount, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
  } else {
    await admin.from('user_credits').insert({ user_id: userId, balance: amount })
  }

  await admin.from('credit_transactions').insert({
    user_id: userId,
    amount,
    action: 'admin_grant',
  })

  return NextResponse.json({ ok: true })
}
