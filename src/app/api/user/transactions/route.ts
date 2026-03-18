import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUser } from '@/lib/supabase/getUser'

// GET /api/user/transactions — last 20 transactions for current user
export async function GET() {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data } = await admin
    .from('credit_transactions')
    .select('id, amount, action, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  return NextResponse.json(data ?? [])
}
