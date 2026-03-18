import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUser } from '@/lib/supabase/getUser'

export async function GET() {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()

  // Verify requester is admin
  const { data: profile } = await admin.from('profiles').select('is_admin').eq('id', user.id).maybeSingle()
  if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Fetch all profiles
  const { data: profiles } = await admin
    .from('profiles')
    .select('id, email, name, created_at, is_admin')
    .order('created_at', { ascending: false })

  if (!profiles) return NextResponse.json([])

  // Fetch demo usage, credits, subscriptions in parallel
  const ids = profiles.map((p) => p.id)
  const [{ data: demos }, { data: credits }, { data: subs }] = await Promise.all([
    admin.from('demo_usage').select('user_id, hooks_used, ads_used, images_used').in('user_id', ids),
    admin.from('user_credits').select('user_id, balance').in('user_id', ids),
    admin.from('subscriptions').select('user_id').eq('status', 'active').in('user_id', ids),
  ])

  const demoMap = Object.fromEntries((demos ?? []).map((d) => [d.user_id, d]))
  const creditsMap = Object.fromEntries((credits ?? []).map((c) => [c.user_id, c.balance]))
  const subSet = new Set((subs ?? []).map((s) => s.user_id))

  const rows = profiles.map((p) => ({
    id: p.id,
    email: p.email ?? '',
    full_name: p.name ?? null,
    created_at: p.created_at,
    is_admin: p.is_admin ?? false,
    hooks_used: demoMap[p.id]?.hooks_used ?? 0,
    ads_used: demoMap[p.id]?.ads_used ?? 0,
    images_used: demoMap[p.id]?.images_used ?? 0,
    credits: creditsMap[p.id] ?? 0,
    has_sub: subSet.has(p.id),
  }))

  return NextResponse.json(rows)
}
