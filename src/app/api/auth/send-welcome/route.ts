import { NextResponse } from 'next/server'
import { getUser } from '@/lib/supabase/getUser'
import { sendWelcomeEmail } from '@/lib/email'

// POST /api/auth/send-welcome — called client-side after email signup
export async function POST() {
  const user = await getUser()
  if (!user?.email) return NextResponse.json({ ok: false })

  try {
    await sendWelcomeEmail(user.email)
  } catch {
    // Non-critical — don't fail the request
  }

  return NextResponse.json({ ok: true })
}
