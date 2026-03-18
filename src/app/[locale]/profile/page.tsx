'use client'

import { useAuth } from '@/context/AuthContext'
import { DEMO_LIMITS, CREDIT_COSTS } from '@/lib/credits'
import { Link, useRouter } from '@/i18n/navigation'
import { Coins, Zap, User, LogOut, ShieldCheck, TrendingUp, TrendingDown } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useEffect, useState } from 'react'

interface TxRow {
  id: string
  amount: number
  action: string
  created_at: string
}

const ACTION_LABEL: Record<string, { ru: string; en: string }> = {
  hooks:        { ru: 'Генерация хуков',         en: 'Hook generation' },
  ad_text:      { ru: 'Рекламный текст',          en: 'Ad text' },
  image:        { ru: 'Генерация изображения',    en: 'Image generation' },
  purchase:     { ru: 'Пополнение (оплата)',       en: 'Top-up (purchase)' },
  admin_grant:  { ru: 'Начисление администратором', en: 'Admin grant' },
}

const i18n = {
  ru: {
    title: 'Профиль',
    signOut: 'Выйти',
    admin: 'Администратор',
    adminSub: 'Все лимиты сняты',
    proPlan: 'Хукси Pro активна',
    proSub: '990 ₽/мес',
    demoMode: 'Демо-режим',
    demoSub: 'Бесплатный доступ с ограничениями',
    upgrade: 'Upgrade',
    usedInDemo: 'Использовано в демо',
    hooks: 'Хуки',
    ads: 'Объявления',
    creatives: 'Креативы',
    left: (n: number) => `осталось ${n}`,
    costTitle: 'Стоимость генераций',
    costHooks: 'Хуки',
    costAds: 'Рекламный текст',
    costImage: 'Изображение-креатив',
    costUnit: (u: string) => u === 'hooks' ? 'кр/генерация' : u === 'ad_text' ? 'кр/текст' : 'кр/изображение',
    txTitle: 'История транзакций',
    txEmpty: 'Транзакций пока нет',
    txLoading: 'Загрузка...',
  },
  en: {
    title: 'Profile',
    signOut: 'Sign out',
    admin: 'Administrator',
    adminSub: 'All limits removed',
    proPlan: 'Hooksy Pro active',
    proSub: '990 ₽/mo',
    demoMode: 'Demo mode',
    demoSub: 'Free access with limitations',
    upgrade: 'Upgrade',
    usedInDemo: 'Demo usage',
    hooks: 'Hooks',
    ads: 'Ad texts',
    creatives: 'Creatives',
    left: (n: number) => `${n} left`,
    costTitle: 'Generation costs',
    costHooks: 'Hooks',
    costAds: 'Ad text',
    costImage: 'Creative image',
    costUnit: (u: string) => u === 'hooks' ? 'cr/generation' : u === 'ad_text' ? 'cr/text' : 'cr/image',
    txTitle: 'Transaction history',
    txEmpty: 'No transactions yet',
    txLoading: 'Loading...',
  },
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-[#2A2A2E] bg-[#141416] p-4">
      <p className="text-xs text-[#5A5A5E] mb-1">{label}</p>
      <p className="text-2xl font-bold text-[#F5F5F5]">{value}</p>
      {sub && <p className="text-xs text-[#3A3A3E] mt-0.5">{sub}</p>}
    </div>
  )
}

export default function ProfilePage() {
  const { user, loading, credits, demoUsage, hasActiveSubscription, isAdmin, signOut } = useAuth()
  const router = useRouter()
  const locale = useLocale() as 'ru' | 'en'
  const c = locale === 'ru' ? i18n.ru : i18n.en

  const [transactions, setTransactions] = useState<TxRow[]>([])
  const [txLoading, setTxLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    setTxLoading(true)
    fetch('/api/user/transactions')
      .then((r) => r.json())
      .then((data) => setTransactions(Array.isArray(data) ? data : []))
      .finally(() => setTxLoading(false))
  }, [user])

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14">
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-[#141416] animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!user) {
    router.push('/')
    return null
  }

  const avatar = user.user_metadata?.avatar_url
  const name = user.user_metadata?.full_name ?? user.email ?? 'User'
  const email = user.email ?? ''

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#F5F5F5]">{c.title}</h1>
        {isAdmin && (
          <Link href="/admin" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20 hover:bg-[#8B5CF6]/20 transition-colors">
            Админ-панель →
          </Link>
        )}
      </div>

      {/* User card */}
      <div className="rounded-2xl border border-[#2A2A2E] bg-[#141416] p-5 flex items-center gap-4 mb-6">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt="avatar" className="h-14 w-14 rounded-full border border-[#2A2A2E]" />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1E1E22] text-xl font-bold text-[#00D4FF] border border-[#2A2A2E]">
            {name[0]?.toUpperCase() ?? '?'}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-[#F5F5F5] truncate">{name}</p>
            {isAdmin && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20">
                <ShieldCheck className="h-3 w-3" /> Admin
              </span>
            )}
          </div>
          <p className="text-sm text-[#5A5A5E] truncate">{email}</p>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-[#5A5A5E] border border-[#2A2A2E] hover:text-[#F5F5F5] hover:border-[#3A3A3E] transition-all shrink-0"
        >
          <LogOut className="h-3.5 w-3.5" />
          {c.signOut}
        </button>
      </div>

      {/* Subscription / Demo status */}
      {isAdmin ? (
        <div className="rounded-xl border border-[#8B5CF6]/30 bg-[#8B5CF6]/5 p-4 mb-6 flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-[#8B5CF6] shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[#8B5CF6]">{c.admin}</p>
            <p className="text-xs text-[#5A5A5E]">{c.adminSub}</p>
          </div>
        </div>
      ) : hasActiveSubscription ? (
        <div className="rounded-xl border border-[#00D4FF]/30 bg-[#00D4FF]/5 p-4 mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-[#00D4FF] shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[#00D4FF]">{c.proPlan}</p>
              <p className="text-xs text-[#5A5A5E]">{c.proSub}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141416] border border-[#2A2A2E]">
            <Coins className="h-4 w-4 text-[#00D4FF]" />
            <span className="text-sm font-semibold text-[#F5F5F5]">{credits}</span>
            <span className="text-xs text-[#5A5A5E]">cr</span>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-[#2A2A2E] bg-[#141416] p-4 mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-[#8A8A8E] shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[#F5F5F5]">{c.demoMode}</p>
              <p className="text-xs text-[#5A5A5E]">{c.demoSub}</p>
            </div>
          </div>
          <Link
            href="/pricing"
            className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)' }}
          >
            {c.upgrade}
          </Link>
        </div>
      )}

      {/* Stats */}
      {!hasActiveSubscription && !isAdmin && demoUsage && (
        <div className="mb-6">
          <p className="text-xs text-[#5A5A5E] mb-3 uppercase tracking-wide">{c.usedInDemo}</p>
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-3">
            <StatCard
              label={c.hooks}
              value={`${demoUsage.hooks_used}/${DEMO_LIMITS.hooks}`}
              sub={c.left(DEMO_LIMITS.hooks - demoUsage.hooks_used)}
            />
            <StatCard
              label={c.ads}
              value={`${demoUsage.ads_used}/${DEMO_LIMITS.ads}`}
              sub={c.left(DEMO_LIMITS.ads - demoUsage.ads_used)}
            />
            <StatCard
              label={c.creatives}
              value={`${demoUsage.images_used}/${DEMO_LIMITS.images}`}
              sub={c.left(DEMO_LIMITS.images - demoUsage.images_used)}
            />
          </div>
        </div>
      )}

      {/* Credit costs reference */}
      <div className="rounded-xl border border-[#2A2A2E] bg-[#141416] p-4 mb-6">
        <p className="text-xs text-[#5A5A5E] mb-3 uppercase tracking-wide">{c.costTitle}</p>
        <div className="flex flex-col gap-2">
          {[
            { label: c.costHooks, cost: CREDIT_COSTS.hooks, unit: c.costUnit('hooks') },
            { label: c.costAds, cost: CREDIT_COSTS.ad_text, unit: c.costUnit('ad_text') },
            { label: c.costImage, cost: CREDIT_COSTS.image, unit: c.costUnit('image') },
          ].map(({ label, cost, unit }) => (
            <div key={label} className="flex items-center justify-between text-sm">
              <span className="text-[#8A8A8E]">{label}</span>
              <span className="text-[#F5F5F5] font-medium tabular-nums">
                {cost} <span className="text-[#5A5A5E] font-normal">{unit}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction history */}
      <div className="rounded-xl border border-[#2A2A2E] bg-[#141416] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#2A2A2E]">
          <p className="text-xs text-[#5A5A5E] uppercase tracking-wide">{c.txTitle}</p>
        </div>
        {txLoading ? (
          <p className="px-4 py-6 text-xs text-[#5A5A5E] text-center">{c.txLoading}</p>
        ) : transactions.length === 0 ? (
          <p className="px-4 py-6 text-xs text-[#5A5A5E] text-center">{c.txEmpty}</p>
        ) : (
          <ul className="divide-y divide-[#1E1E22]">
            {transactions.map((tx) => {
              const isIncome = tx.amount > 0
              const label = ACTION_LABEL[tx.action]?.[locale] ?? tx.action
              const date = new Date(tx.created_at).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'short' })
              return (
                <li key={tx.id} className="flex items-center justify-between px-4 py-3 gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {isIncome
                      ? <TrendingUp className="h-4 w-4 text-[#00D4FF] shrink-0" />
                      : <TrendingDown className="h-4 w-4 text-[#5A5A5E] shrink-0" />
                    }
                    <div className="min-w-0">
                      <p className="text-sm text-[#F5F5F5] truncate">{label}</p>
                      <p className="text-xs text-[#5A5A5E]">{date}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold tabular-nums shrink-0 ${isIncome ? 'text-[#00D4FF]' : 'text-[#8A8A8E]'}`}>
                    {isIncome ? '+' : ''}{tx.amount}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
