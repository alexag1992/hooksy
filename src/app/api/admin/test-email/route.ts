import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUser } from '@/lib/supabase/getUser'
import { sendWelcomeEmail, sendSubscriptionEmail, sendCreditsEmail } from '@/lib/email'

// POST /api/admin/test-email
// Body: { type: 'welcome' | 'subscription' | 'credits', email?: string }
export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile?.is_admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'RESEND_API_KEY not set in environment' }, { status: 500 })
  }

  const { type, email } = await req.json()
  const to = email ?? user.email!

  try {
    if (type === 'welcome') {
      await sendWelcomeEmail(to)
    } else if (type === 'subscription') {
      await sendSubscriptionEmail(to, 300)
    } else if (type === 'credits') {
      await sendCreditsEmail(to, 100)
    } else {
      return NextResponse.json({ error: 'Unknown type' }, { status: 400 })
    }
  } catch (e) {
    return NextResponse.json({ error: 'Failed to send email', details: String(e) }, { status: 500 })
  }

  return NextResponse.json({ ok: true, sent_to: to, type })
}
