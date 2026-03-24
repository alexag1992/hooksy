'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')

    if (code) {
      supabase.auth.exchangeCodeForSession(code)
        .then(({ error }) => {
          if (error) console.error('[auth/callback] error:', error.message)
        })
        .finally(() => router.replace('/ru'))
    } else {
      router.replace('/ru')
    }
  }, [router])

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#0A0A0B',
      color: '#fff',
      fontSize: '18px',
    }}>
      Авторизация...
    </div>
  )
}
