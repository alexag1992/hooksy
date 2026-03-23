'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Link } from '@/i18n/navigation'
import { useLocale } from 'next-intl'
import { CheckCircle, Coins, Loader2 } from 'lucide-react'

const i18n = {
  ru: {
    titleSub: 'Оплата прошла успешно!',
    titleCredits: 'Кредиты зачислены!',
    sub1Sub: 'Подписка Хукси База активирована на 30 дней.',
    sub1Credits: '100 дополнительных кредитов добавлено на счёт.',
    balanceLabel: 'Текущий баланс',
    hint: 'Кредиты начисляются в течение нескольких секунд. Если баланс ещё не обновился — нажмите «Обновить».',
    cta: 'Начать генерацию',
    refresh: 'Обновить баланс',
  },
  en: {
    titleSub: 'Payment successful!',
    titleCredits: 'Credits added!',
    sub1Sub: 'Hooksy Base subscription activated for 30 days.',
    sub1Credits: '100 additional credits have been added to your account.',
    balanceLabel: 'Current balance',
    hint: 'Credits are added within a few seconds. If your balance hasn\'t updated yet — click Refresh.',
    cta: 'Start generating',
    refresh: 'Refresh balance',
  },
}

function SuccessContent() {
  const { user, loading, credits, refreshUserData } = useAuth()
  const locale = useLocale() as 'ru' | 'en'
  const c = i18n[locale]
  const searchParams = useSearchParams()
  const isCredits = searchParams.get('type') === 'credits'
  const [refreshing, setRefreshing] = useState(false)

  // Auto-refresh once after 3 seconds to pick up new subscription/credits
  useEffect(() => {
    const timer = setTimeout(() => {
      refreshUserData()
    }, 3000)
    return () => clearTimeout(timer)
  }, [refreshUserData])

  const handleRefresh = async () => {
    setRefreshing(true)
    await refreshUserData()
    setRefreshing(false)
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#5A5A5E]" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <div className="flex justify-center mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/20">
          <CheckCircle className="h-10 w-10 text-[#00D4FF]" />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-[#F5F5F5] mb-3">
        {isCredits ? c.titleCredits : c.titleSub}
      </h1>
      <p className="text-[#8A8A8E] mb-6">
        {isCredits ? c.sub1Credits : c.sub1Sub}
      </p>

      {/* Credits display */}
      {user && (
        <div className="inline-flex flex-col items-center gap-1 px-6 py-3 rounded-xl border border-[#2A2A2E] bg-[#141416] mb-6">
          <span className="text-xs text-[#5A5A5E]">{c.balanceLabel}</span>
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-[#00D4FF]" />
            <span className="text-xl font-bold text-[#F5F5F5]">{credits ?? '...'}</span>
            <span className="text-sm text-[#5A5A5E]">{locale === 'ru' ? 'кредитов' : 'credits'}</span>
          </div>
        </div>
      )}

      <p className="text-xs text-[#5A5A5E] mb-8 mx-auto max-w-xs">{c.hint}</p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/"
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)' }}
        >
          {c.cta}
        </Link>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm text-[#8A8A8E] border border-[#2A2A2E] hover:text-[#F5F5F5] hover:border-[#3A3A3E] transition-colors disabled:opacity-50"
        >
          {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {c.refresh}
        </button>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
