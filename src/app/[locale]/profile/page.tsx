'use client'

import { useAuth } from '@/context/AuthContext'
import { DEMO_LIMITS, CREDIT_COSTS } from '@/lib/credits'
import { Link } from '@/i18n/navigation'
import { Coins, Zap, User, LogOut, ShieldCheck } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'

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
  const name = user.user_metadata?.full_name ?? user.email ?? 'Пользователь'
  const email = user.email ?? ''

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <h1 className="text-2xl font-bold text-[#F5F5F5] mb-8">Профиль</h1>

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
          Выйти
        </button>
      </div>

      {/* Subscription / Demo status */}
      {isAdmin ? (
        <div className="rounded-xl border border-[#8B5CF6]/30 bg-[#8B5CF6]/5 p-4 mb-6 flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-[#8B5CF6] shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[#8B5CF6]">Администратор</p>
            <p className="text-xs text-[#5A5A5E]">Все лимиты сняты</p>
          </div>
        </div>
      ) : hasActiveSubscription ? (
        <div className="rounded-xl border border-[#00D4FF]/30 bg-[#00D4FF]/5 p-4 mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-[#00D4FF] shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[#00D4FF]">Хукси Pro активна</p>
              <p className="text-xs text-[#5A5A5E]">990 ₽/мес</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141416] border border-[#2A2A2E]">
            <Coins className="h-4 w-4 text-[#00D4FF]" />
            <span className="text-sm font-semibold text-[#F5F5F5]">{credits}</span>
            <span className="text-xs text-[#5A5A5E]">кр</span>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-[#2A2A2E] bg-[#141416] p-4 mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-[#8A8A8E] shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[#F5F5F5]">Демо-режим</p>
              <p className="text-xs text-[#5A5A5E]">Бесплатный доступ с ограничениями</p>
            </div>
          </div>
          <Link
            href="/pricing"
            className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)' }}
          >
            Upgrade
          </Link>
        </div>
      )}

      {/* Stats */}
      {!hasActiveSubscription && !isAdmin && demoUsage && (
        <div className="mb-6">
          <p className="text-xs text-[#5A5A5E] mb-3 uppercase tracking-wide">Использовано в демо</p>
          <div className="grid grid-cols-3 gap-3">
            <StatCard
              label="Хуки"
              value={`${demoUsage.hooks_used}/${DEMO_LIMITS.hooks}`}
              sub={`осталось ${DEMO_LIMITS.hooks - demoUsage.hooks_used}`}
            />
            <StatCard
              label="Объявления"
              value={`${demoUsage.ads_used}/${DEMO_LIMITS.ads}`}
              sub={`осталось ${DEMO_LIMITS.ads - demoUsage.ads_used}`}
            />
            <StatCard
              label="Креативы"
              value={`${demoUsage.images_used}/${DEMO_LIMITS.images}`}
              sub={`осталось ${DEMO_LIMITS.images - demoUsage.images_used}`}
            />
          </div>
        </div>
      )}

      {/* Credit costs reference */}
      <div className="rounded-xl border border-[#2A2A2E] bg-[#141416] p-4">
        <p className="text-xs text-[#5A5A5E] mb-3 uppercase tracking-wide">Стоимость генераций</p>
        <div className="flex flex-col gap-2">
          {[
            { label: 'Хуки', cost: CREDIT_COSTS.hooks, unit: 'кр/генерация' },
            { label: 'Рекламный текст', cost: CREDIT_COSTS.ad_text, unit: 'кр/текст' },
            { label: 'Изображение-креатив', cost: CREDIT_COSTS.image, unit: 'кр/изображение' },
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
    </div>
  )
}
