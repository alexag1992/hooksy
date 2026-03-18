'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from '@/i18n/navigation'
import { useLocale } from 'next-intl'
import { Check, Tag, Zap, Loader2 } from 'lucide-react'

const BASE_PRICE = 990

const FEATURES = {
  ru: [
    '200 кредитов сразу после оплаты',
    'Безлимитная генерация хуков',
    'Генерация рекламных текстов',
    'Генерация изображений-креативов',
    'Доступ на 30 дней',
  ],
  en: [
    '200 credits immediately after payment',
    'Unlimited hook generation',
    'Ad text generation',
    'Creative image generation',
    '30-day access',
  ],
}

const i18n = {
  ru: {
    title: 'Оформить подписку',
    plan: 'Хукси База',
    perMonth: '/мес',
    promoLabel: 'Промокод',
    promoPlaceholder: 'Введите промокод',
    promoApply: 'Применить',
    promoApplied: (pct: number) => `Скидка ${pct}% применена`,
    promoInvalid: 'Промокод не найден или уже использован',
    promoChecking: 'Проверяем...',
    total: 'Итого',
    pay: 'Оплатить',
    paying: 'Переходим к оплате...',
    loginRequired: 'Войдите, чтобы оформить подписку',
    alreadySub: 'У вас уже есть активная подписка',
    included: 'Что входит:',
  },
  en: {
    title: 'Subscribe',
    plan: 'Hooksy Base',
    perMonth: '/mo',
    promoLabel: 'Promo code',
    promoPlaceholder: 'Enter promo code',
    promoApply: 'Apply',
    promoApplied: (pct: number) => `${pct}% discount applied`,
    promoInvalid: 'Promo code not found or already used',
    promoChecking: 'Checking...',
    total: 'Total',
    pay: 'Pay now',
    paying: 'Redirecting to payment...',
    loginRequired: 'Sign in to subscribe',
    alreadySub: 'You already have an active subscription',
    included: "What's included:",
  },
}

export default function CheckoutPage() {
  const { user, loading, hasActiveSubscription } = useAuth()
  const router = useRouter()
  const locale = useLocale() as 'ru' | 'en'
  const c = i18n[locale]
  const features = FEATURES[locale]

  const [promoCode, setPromoCode] = useState('')
  const [promoStatus, setPromoStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')

  const finalPrice = Math.round(BASE_PRICE * (1 - discountPercent / 100))

  const applyPromo = async () => {
    if (!promoCode.trim()) return
    setPromoStatus('checking')
    const res = await fetch('/api/promo/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: promoCode }),
    })
    const data = await res.json()
    if (data.valid) {
      setDiscountPercent(data.discountPercent)
      setPromoStatus('valid')
    } else {
      setDiscountPercent(0)
      setPromoStatus('invalid')
    }
  }

  const pay = async () => {
    setPaying(true)
    setError('')
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ promoCode: promoStatus === 'valid' ? promoCode : '' }),
    })
    if (!res.ok) {
      const err = await res.json()
      setError(err.error ?? 'Error')
      setPaying(false)
      return
    }
    const { confirmation_url } = await res.json()
    window.location.href = confirmation_url
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#5A5A5E]" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-[#8A8A8E] mb-4">{c.loginRequired}</p>
        <button
          onClick={() => router.push('/')}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-white"
          style={{ background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)' }}
        >
          {locale === 'ru' ? 'На главную' : 'Go home'}
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="text-2xl font-bold text-[#F5F5F5] mb-8">{c.title}</h1>

      {/* Plan card */}
      <div className="rounded-2xl border border-[#2A2A2E] bg-[#141416] p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#00D4FF]" />
            <span className="font-semibold text-[#F5F5F5]">{c.plan}</span>
          </div>
          <div className="flex items-baseline gap-1">
            {discountPercent > 0 && (
              <span className="text-sm text-[#5A5A5E] line-through">{BASE_PRICE} ₽</span>
            )}
            <span className="text-2xl font-bold text-[#F5F5F5]">{finalPrice} ₽</span>
            <span className="text-sm text-[#5A5A5E]">{c.perMonth}</span>
          </div>
        </div>

        <p className="text-xs text-[#5A5A5E] mb-3 uppercase tracking-wide">{c.included}</p>
        <ul className="flex flex-col gap-2 mb-0">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-[#8A8A8E]">
              <Check className="h-4 w-4 text-[#00D4FF] mt-0.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Promo code */}
      {!hasActiveSubscription && (
        <div className="rounded-xl border border-[#2A2A2E] bg-[#141416] p-4 mb-4">
          <p className="text-xs text-[#5A5A5E] mb-2 flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5" /> {c.promoLabel}
          </p>
          <div className="flex gap-2">
            <input
              value={promoCode}
              onChange={(e) => {
                setPromoCode(e.target.value.toUpperCase())
                setPromoStatus('idle')
                setDiscountPercent(0)
              }}
              onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
              placeholder={c.promoPlaceholder}
              className="flex-1 rounded-lg border border-[#2A2A2E] bg-[#0A0A0B] px-3 py-2 text-sm font-mono text-[#F5F5F5] placeholder-[#3A3A3E] focus:border-[#00D4FF] focus:outline-none uppercase"
            />
            <button
              onClick={applyPromo}
              disabled={!promoCode.trim() || promoStatus === 'checking'}
              className="px-3 py-2 rounded-lg border border-[#2A2A2E] text-xs text-[#8A8A8E] hover:text-[#F5F5F5] hover:border-[#3A3A3E] transition-colors disabled:opacity-40"
            >
              {promoStatus === 'checking' ? '...' : c.promoApply}
            </button>
          </div>
          {promoStatus === 'valid' && (
            <p className="text-xs text-[#00D4FF] mt-2">{c.promoApplied(discountPercent)}</p>
          )}
          {promoStatus === 'invalid' && (
            <p className="text-xs text-red-400 mt-2">{c.promoInvalid}</p>
          )}
        </div>
      )}

      {hasActiveSubscription ? (
        <div className="rounded-xl border border-[#00D4FF]/20 bg-[#00D4FF]/5 p-4 text-sm text-[#00D4FF] text-center">
          {c.alreadySub}
        </div>
      ) : (
        <>
          {/* Total */}
          <div className="flex items-center justify-between px-1 mb-4">
            <span className="text-sm text-[#5A5A5E]">{c.total}</span>
            <span className="text-lg font-bold text-[#F5F5F5]">{finalPrice} ₽</span>
          </div>

          {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

          <button
            onClick={pay}
            disabled={paying}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)' }}
          >
            {paying ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> {c.paying}</>
            ) : (
              <>{c.pay} — {finalPrice} ₽</>
            )}
          </button>
        </>
      )}
    </div>
  )
}
