import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Handles /ru/auth/callback and /en/auth/callback
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const locale = request.nextUrl.pathname.split('/')[1] ?? 'ru'

  console.log('[locale/auth/callback] hit, locale:', locale, 'code:', !!code)
  console.log('[locale/auth/callback] supabaseUrl:', process.env.NEXT_PUBLIC_SUPABASE_URL)

  if (code) {
    const redirectResponse = NextResponse.redirect(`${origin}/${locale}`)

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('[locale/auth/callback] Missing Supabase env vars!')
      return NextResponse.redirect(`${origin}/${locale}?error=config`)
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              redirectResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) {
        console.error('[locale/auth/callback] exchange error:', error.message)
        return NextResponse.redirect(`${origin}/${locale}?error=auth`)
      }
      return redirectResponse
    } catch (e) {
      console.error('[locale/auth/callback] exception:', e)
      return NextResponse.redirect(`${origin}/${locale}?error=exception`)
    }
  }

  return NextResponse.redirect(`${origin}/${locale}`)
}
