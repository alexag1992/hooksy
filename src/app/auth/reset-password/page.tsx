'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, KeyRound, CheckCircle } from 'lucide-react'

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()

  const [stage, setStage] = useState<'loading' | 'form' | 'success' | 'error'>('loading')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const code = searchParams.get('code')
    if (!code) {
      setStage('error')
      return
    }
    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) setStage('error')
      else setStage('form')
    })
  }, [searchParams, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) { setError('Пароли не совпадают'); return }
    if (password.length < 6) { setError('Пароль минимум 6 символов'); return }
    setSubmitting(true)
    const { error } = await supabase.auth.updateUser({ password })
    setSubmitting(false)
    if (error) setError('Не удалось обновить пароль. Попробуйте снова.')
    else {
      setStage('success')
      setTimeout(() => router.push('/ru'), 2500)
    }
  }

  const inputStyle: React.CSSProperties = {
    background: '#1A1A1E',
    border: '1px solid #2A2A2E',
    borderRadius: 8,
    padding: '10px 12px',
    fontSize: 14,
    color: '#F5F5F5',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0B', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: '#141416', border: '1px solid #2A2A2E', borderRadius: '16px', padding: '40px' }}>

        {stage === 'loading' && (
          <div style={{ textAlign: 'center' }}>
            <Loader2 style={{ width: 32, height: 32, color: '#5A5A5E', margin: '0 auto 16px' }} className="animate-spin" />
            <p style={{ color: '#8A8A8E', margin: 0 }}>Проверяем ссылку...</p>
          </div>
        )}

        {stage === 'error' && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#F5F5F5', fontWeight: 600, marginBottom: 8 }}>Ссылка недействительна</p>
            <p style={{ color: '#8A8A8E', fontSize: 14, marginBottom: 24 }}>Запросите новую ссылку для сброса пароля.</p>
            <a href="/ru" style={{ color: '#00D4FF', fontSize: 14, textDecoration: 'none' }}>← На главную</a>
          </div>
        )}

        {stage === 'success' && (
          <div style={{ textAlign: 'center' }}>
            <CheckCircle style={{ width: 48, height: 48, color: '#00D4FF', margin: '0 auto 16px' }} />
            <p style={{ color: '#F5F5F5', fontWeight: 600, marginBottom: 8 }}>Пароль обновлён!</p>
            <p style={{ color: '#8A8A8E', fontSize: 14 }}>Перенаправляем вас...</p>
          </div>
        )}

        {stage === 'form' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#1E1E22', border: '1px solid #2A2A2E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <KeyRound style={{ width: 24, height: 24, color: '#00D4FF' }} />
              </div>
              <h1 style={{ color: '#F5F5F5', fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>Новый пароль</h1>
              <p style={{ color: '#8A8A8E', fontSize: 14, margin: 0 }}>Придумайте надёжный пароль для вашего аккаунта</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input type="password" placeholder="Новый пароль" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />
              <input type="password" placeholder="Повторите пароль" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={inputStyle} />
              {error && <p style={{ color: '#f87171', fontSize: 12, margin: 0 }}>{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                style={{ background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)', color: 'white', border: 'none', borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.6 : 1 }}
              >
                {submitting ? 'Сохраняем...' : 'Сохранить пароль'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  )
}
