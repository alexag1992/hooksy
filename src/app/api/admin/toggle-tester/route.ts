import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUser } from '@/lib/supabase/getUser'

export async function PATCH(req: Request) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()

  const { data: profile } = await admin.from('profiles').select('is_admin').eq('id', user.id).maybeSingle()
  if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { userId } = await req.json()
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  // Get current tester status
  const { data: target } = await admin.from('profiles').select('is_tester').eq('id', userId).maybeSingle()
  if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const newValue = !target.is_tester

  await admin.from('profiles').update({ is_tester: newValue }).eq('id', userId)

  // Auto-grant 100 credits when enabling tester
  if (newValue) {
    const { data: credits } = await admin.from('user_credits').select('balance').eq('user_id', userId).maybeSingle()
    const current = credits?.balance ?? 0
    await admin.from('user_credits').upsert(
      { user_id: userId, balance: current + 100, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    )
    await admin.from('credit_transactions').insert({ user_id: userId, amount: 100, action: 'admin_grant' })
  }

  return NextResponse.json({ is_tester: newValue })
}
