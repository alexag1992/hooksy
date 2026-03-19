import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    try {
      const redirectResponse = NextResponse.redirect(`${origin}/ru`)

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      console.log('[auth/callback] supabaseUrl:', supabaseUrl)

      if (!supabaseUrl || !supabaseKey) {
        console.error('[auth/callback] Missing Supabase env vars')
        return NextResponse.redirect(`${origin}/ru?error=config`)
      }

      const supabase = createServerClient(supabaseUrl, supabaseKey, {
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
      })

      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) console.error('[auth/callback] exchange error:', error.message)
      else return redirectResponse
    } catch (e) {
      console.error('[auth/callback] exception:', e)
    }
  }

  return NextResponse.redirect(`${origin}/ru`)
}
