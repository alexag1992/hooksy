import { createServerClient } from '@supabase/ssr'
import createIntlMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from '@/i18n/routing'
import { verifyStaffToken } from '@/lib/staffAuth'

const handleI18nRouting = createIntlMiddleware(routing)

export async function proxy(request: NextRequest) {
  // Staff portal bypass: set cookie and redirect to clean URL
  const staffToken = request.nextUrl.searchParams.get('staff_token')
  if (staffToken && verifyStaffToken(staffToken)) {
    const url = request.nextUrl.clone()
    url.searchParams.delete('staff_token')
    const res = NextResponse.redirect(url)
    res.cookies.set('hooksy_staff', 'true', {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 8 * 3600, // 8 часов (рабочий день)
      path: '/',
    })
    return res
  }

  // Run next-intl routing first (handles locale redirects/rewrites)
  const intlResponse = handleI18nRouting(request)

  // Refresh Supabase session and write cookies onto the intl response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            intlResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: do not remove — keeps the session alive
  await supabase.auth.getUser()

  return intlResponse
}

export const config = {
  matcher: [
    // Skip Next.js internals, static files, API routes, and auth callback
    '/((?!api|auth|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
