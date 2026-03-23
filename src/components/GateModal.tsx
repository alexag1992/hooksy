'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { X, Zap, Lock, CreditCard, Loader2 } from 'lucide-react'

export function GateModal() {
  const { gateReason, closeGate, signInWithGoogle, signInWithEmail, signUp, resetPasswordForEmail, hasActiveSubscription } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname.split('/')[1] ?? 'ru'
  const [buyingCredits, setBuyingCredits] = useState(false)
  const [creditsError, setCreditsError] = useState('')

  const goToCheckout = () => {
    closeGate()
    router.push(`/${locale}/checkout`)
  }

  const buyCredits = async () => {
    setBuyingCredits(true)
    setCreditsError('')
    const res = await fetch('/api/checkout-credits', { method: 'POST' })
    if (!res.ok) {
      setBuyingCredits(false)
      setCreditsError('Ошибка. Попробуйте ещё раз.')
      return
    }
    const { confirmation_url } = await res.json()
    window.location.href = confirmation_url
  }
  const [emailMode, setEmailMode] = useState<null | 'signin' | 'signup' | 'forgot'>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [emailSuccess, setEmailSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError('')
    setIsSubmitting(true)
    const error = await signInWithEmail(email, password)
    setIsSubmitting(false)
    if (error) setEmailError('Неверный email или пароль')
    else closeGate()
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError('')
    if (password !== confirmPassword) {
      setEmailError('Пароли не совпадают')
      return
    }
    if (password.length < 6) {
      setEmailError('Пароль минимум 6 символов')
      return
    }
    setIsSubmitting(true)
    const error = await signUp(email, password)
    setIsSubmitting(false)
    if (error) setEmailError('Ошибка регистрации. Попробуйте другой email.')
    else closeGate()
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError('')
    setIsSubmitting(true)
    const error = await resetPasswordForEmail(email)
    setIsSubmitting(false)
    if (error) setEmailError('Не удалось отправить письмо. Проверьте email.')
    else setEmailSuccess('Ссылка отправлена! Проверьте почту.')
  }

  if (!gateReason) return null

  const isAuth = gateReason === 'not_authenticated'
  const isDemo = gateReason === 'demo_exhausted'
  const isDemoImage = gateReason === 'demo_image_exhausted'
  const isUpgrade = gateReason === 'upgrade'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={closeGate}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-[#2A2A2E] bg-[#141416] p-5 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={closeGate}
          className="absolute right-4 top-4 text-[#5A5A5E] hover:text-[#F5F5F5] transition-colors"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="mb-5 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1E1E22] border border-[#2A2A2E]">
            {isAuth ? (
              <Lock size={24} className="text-[#00D4FF]" />
            ) : (
              <Zap size={24} className="text-[#8B5CF6]" />
            )}
          </div>
        </div>

        {/* Content */}
        {isAuth && (
          <>
            <h2 className="mb-2 text-center text-xl font-bold text-[#F5F5F5]">
              Войдите, чтобы продолжить
            </h2>
            <p className="mb-6 text-center text-sm text-[#8A8A8E]">
              Вам доступно 3 бесплатные цепочки: хук → текст объявления → 1 креатив
            </p>
            <button
              onClick={signInWithGoogle}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#2A2A2E] bg-white py-3 font-medium text-gray-800 transition hover:bg-gray-100"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Войти через Google
            </button>

            <div className="flex items-center gap-2 my-3">
              <div className="flex-1 h-px bg-[#2A2A2E]" />
              <span className="text-xs text-[#5A5A5E]">или</span>
              <div className="flex-1 h-px bg-[#2A2A2E]" />
            </div>

            {/* Mode selector buttons */}
            {emailMode === null && (
              <div className="flex gap-2">
                <button
                  onClick={() => setEmailMode('signin')}
                  className="flex-1 text-xs text-[#5A5A5E] hover:text-[#8A8A8E] py-1.5 border border-[#2A2A2E] rounded-lg transition-colors"
                >
                  Войти по email
                </button>
                <button
                  onClick={() => setEmailMode('signup')}
                  className="flex-1 text-xs text-[#5A5A5E] hover:text-[#8A8A8E] py-1.5 border border-[#2A2A2E] rounded-lg transition-colors"
                >
                  Зарегистрироваться
                </button>
              </div>
            )}

            {/* Sign In form */}
            {emailMode === 'signin' && (
              <form onSubmit={handleEmailSignIn} className="flex flex-col gap-2">
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="bg-[#1A1A1E] border border-[#2A2A2E] rounded-lg px-3 py-2 text-sm text-[#F5F5F5] w-full focus:border-[#00D4FF] outline-none" />
                <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required className="bg-[#1A1A1E] border border-[#2A2A2E] rounded-lg px-3 py-2 text-sm text-[#F5F5F5] w-full focus:border-[#00D4FF] outline-none" />
                {emailError && <p className="text-xs text-red-400">{emailError}</p>}
                <button type="submit" disabled={isSubmitting} className="w-full rounded-lg py-2 text-sm font-medium text-white transition disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)' }}>
                  {isSubmitting ? 'Входим...' : 'Войти'}
                </button>
                <div className="flex justify-between">
                  <button type="button" onClick={() => { setEmailMode('signup'); setEmailError('') }} className="text-xs text-[#5A5A5E] hover:text-[#8A8A8E] transition-colors">
                    Нет аккаунта? Зарегистрироваться
                  </button>
                  <button type="button" onClick={() => { setEmailMode('forgot'); setEmailError('') }} className="text-xs text-[#5A5A5E] hover:text-[#8A8A8E] transition-colors">
                    Забыли пароль?
                  </button>
                </div>
              </form>
            )}

            {/* Sign Up form */}
            {emailMode === 'signup' && (
              <form onSubmit={handleEmailSignUp} className="flex flex-col gap-2">
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="bg-[#1A1A1E] border border-[#2A2A2E] rounded-lg px-3 py-2 text-sm text-[#F5F5F5] w-full focus:border-[#00D4FF] outline-none" />
                <input type="password" placeholder="Пароль (минимум 6 символов)" value={password} onChange={e => setPassword(e.target.value)} required className="bg-[#1A1A1E] border border-[#2A2A2E] rounded-lg px-3 py-2 text-sm text-[#F5F5F5] w-full focus:border-[#00D4FF] outline-none" />
                <input type="password" placeholder="Повторите пароль" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="bg-[#1A1A1E] border border-[#2A2A2E] rounded-lg px-3 py-2 text-sm text-[#F5F5F5] w-full focus:border-[#00D4FF] outline-none" />
                {emailError && <p className="text-xs text-red-400">{emailError}</p>}
                <button type="submit" disabled={isSubmitting} className="w-full rounded-lg py-2 text-sm font-medium text-white transition disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)' }}>
                  {isSubmitting ? 'Создаём аккаунт...' : 'Создать аккаунт'}
                </button>
                <button type="button" onClick={() => { setEmailMode('signin'); setEmailError('') }} className="text-xs text-[#5A5A5E] hover:text-[#8A8A8E] transition-colors text-center">
                  Уже есть аккаунт? Войти
                </button>
              </form>
            )}

            {/* Forgot password form */}
            {emailMode === 'forgot' && (
              <form onSubmit={handleForgotPassword} className="flex flex-col gap-2">
                {emailSuccess ? (
                  <p className="text-xs text-[#00D4FF] text-center py-2">{emailSuccess}</p>
                ) : (
                  <>
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="bg-[#1A1A1E] border border-[#2A2A2E] rounded-lg px-3 py-2 text-sm text-[#F5F5F5] w-full focus:border-[#00D4FF] outline-none" />
                    {emailError && <p className="text-xs text-red-400">{emailError}</p>}
                    <button type="submit" disabled={isSubmitting} className="w-full rounded-lg py-2 text-sm font-medium text-white transition disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)' }}>
                      {isSubmitting ? 'Отправляем...' : 'Отправить ссылку для сброса'}
                    </button>
                  </>
                )}
                <button type="button" onClick={() => { setEmailMode('signin'); setEmailError(''); setEmailSuccess('') }} className="text-xs text-[#5A5A5E] hover:text-[#8A8A8E] transition-colors text-center">
                  ← Назад
                </button>
              </form>
            )}
          </>
        )}

        {(isUpgrade || isDemo || isDemoImage || gateReason === 'insufficient_credits') && (
          <>
            <h2 className="mb-2 text-center text-xl font-bold text-[#F5F5F5]">
              {isUpgrade
                ? 'Хукси Pro'
                : isDemoImage
                ? 'Лимит креативов в демо'
                : isDemo
                ? 'Демо-режим исчерпан'
                : 'Недостаточно кредитов'}
            </h2>
            <p className="mb-6 text-center text-sm text-[#8A8A8E]">
              {isUpgrade
                ? 'Снимите ограничения демо-режима — генерируйте хуки, тексты и креативы без лимитов.'
                : isDemoImage
                ? 'В демо-режиме доступен 1 креатив на цепочку (всего 3). Оформите подписку, чтобы генерировать неограниченно.'
                : isDemo
                ? 'Вы использовали все 3 бесплатные цепочки. Оформите подписку для продолжения.'
                : hasActiveSubscription
                ? 'Ваши кредиты закончились. Докупите дополнительные кредиты или дождитесь следующего месяца.'
                : 'На вашем балансе недостаточно кредитов. Продлите подписку.'}
            </p>

            {/* Credits top-up (only for active subscribers with insufficient credits) */}
            {gateReason === 'insufficient_credits' && hasActiveSubscription ? (
              <>
                <div className="mb-6 rounded-xl border border-[#00D4FF]/30 bg-[#0A1A1E] p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-[#F5F5F5]">Пакет кредитов</span>
                    <span className="text-lg font-bold text-[#00D4FF]">290 ₽</span>
                  </div>
                  <ul className="space-y-1 text-sm text-[#8A8A8E]">
                    <li className="flex items-center gap-2">
                      <span className="text-[#00D4FF]">✓</span> 100 кредитов сразу после оплаты
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#00D4FF]">✓</span> Не сгорают — переходят на следующий месяц
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#00D4FF]">✓</span> ~6 изображений или 100 хуков
                    </li>
                  </ul>
                </div>

                {creditsError && <p className="text-xs text-red-400 mb-3 text-center">{creditsError}</p>}

                <button
                  onClick={buyCredits}
                  disabled={buyingCredits}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)' }}
                >
                  {buyingCredits ? (
                    <><Loader2 size={18} className="animate-spin" /> Переходим к оплате...</>
                  ) : (
                    <><CreditCard size={18} /> Купить 100 кредитов — 290 ₽</>
                  )}
                </button>
              </>
            ) : (
              <>
                {/* Plan card */}
                <div className="mb-6 rounded-xl border border-[#8B5CF6]/40 bg-[#1A1A22] p-5">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-semibold text-[#F5F5F5]">Хукси Pro</span>
                    <span className="text-lg font-bold text-[#8B5CF6]">990 ₽/мес</span>
                  </div>
                  <ul className="space-y-1 text-sm text-[#8A8A8E]">
                    <li className="flex items-center gap-2">
                      <span className="text-[#00D4FF]">✓</span> 300 кредитов в месяц
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#00D4FF]">✓</span> Неиспользованные кредиты переходят
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#00D4FF]">✓</span> До 20 изображений/мес (15 кр/шт)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#00D4FF]">✓</span> Приоритетная генерация
                    </li>
                  </ul>
                </div>

                <button
                  onClick={goToCheckout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white transition hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)' }}
                >
                  <CreditCard size={18} />
                  Оформить подписку
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
