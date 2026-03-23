import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUser } from '@/lib/supabase/getUser'

const FROM = 'Хукси <noreply@hooksy.ru>'
const RESEND_API = 'https://api.resend.com/emails'

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

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY not set in environment' }, { status: 500 })
  }

  const { type, email } = await req.json()
  const to = email ?? user.email!

  const subjects: Record<string, string> = {
    welcome: 'Добро пожаловать в Хукси! ⚡ [TEST]',
    subscription: 'Подписка Хукси активирована ✅ [TEST]',
    credits: '+100 кредитов на счёт Хукси [TEST]',
  }

  if (!subjects[type]) {
    return NextResponse.json({ error: 'Unknown type' }, { status: 400 })
  }

  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: [to],
      subject: subjects[type],
      html: `<p>Тестовое письмо типа <strong>${type}</strong> отправлено успешно.</p><p>Если вы видите это — Resend работает корректно.</p>`,
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    return NextResponse.json({ error: 'Resend API error', details: data }, { status: 500 })
  }

  return NextResponse.json({ ok: true, sent_to: to, type, resend_id: data.id })
}
