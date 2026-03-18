import { createServerClient } from '@supabase/ssr'
import createIntlMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { routing } from '@/i18n/routing'

const handleI18nRouting = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
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
