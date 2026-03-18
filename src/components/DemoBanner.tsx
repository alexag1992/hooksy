'use client'

import { useAuth } from '@/context/AuthContext'
import { DEMO_LIMITS } from '@/lib/credits'
import { Sparkles } from 'lucide-react'

function ProgressRow({ label, used, max }: { label: string; used: number; max: number }) {
  const pct = Math.min((used / max) * 100, 100)
  const exhausted = used >= max

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[#5A5A5E] w-24 shrink-0">{label}</span>
      <div className="flex-1 h-1 rounded-full bg-[#2A2A2E]">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: exhausted ? '#FF6B6B' : '#00D4FF' }}
        />
      </div>
      <span className={`text-xs w-8 text-right shrink-0 tabular-nums ${exhausted ? 'text-[#FF6B6B]' : 'text-[#5A5A5E]'}`}>
        {used}/{max}
      </span>
    </div>
  )
}

export function DemoBanner() {
  const { user, loading, demoUsage, hasActiveSubscription, isAdmin, openGate } = useAuth()

  if (loading || !user || isAdmin || hasActiveSubscription || !demoUsage) return null

  const allExhausted =
    demoUsage.hooks_used >= DEMO_LIMITS.hooks &&
    demoUsage.ads_used >= DEMO_LIMITS.ads &&
    demoUsage.images_used >= DEMO_LIMITS.images

  return (
    <div
      className={`mb-6 rounded-xl border px-4 py-3 ${
        allExhausted ? 'border-[#FF6B6B]/30 bg-[#FF6B6B]/5' : 'border-[#2A2A2E] bg-[#141416]'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className={`h-3.5 w-3.5 ${allExhausted ? 'text-[#FF6B6B]' : 'text-[#00D4FF]'}`} />
          <span className={`text-xs font-medium ${allExhausted ? 'text-[#FF6B6B]' : 'text-[#8A8A8E]'}`}>
            {allExhausted ? 'Демо-режим исчерпан' : 'Демо-режим'}
          </span>
        </div>
        <button
          onClick={() => openGate(allExhausted ? 'demo_exhausted' : 'upgrade')}
          className="text-xs text-[#8B5CF6] hover:text-[#A78BFA] transition-colors"
        >
          Получить полный доступ →
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <ProgressRow label="Хуки" used={demoUsage.hooks_used} max={DEMO_LIMITS.hooks} />
        <ProgressRow label="Объявления" used={demoUsage.ads_used} max={DEMO_LIMITS.ads} />
        <ProgressRow label="Креативы" used={demoUsage.images_used} max={DEMO_LIMITS.images} />
      </div>
    </div>
  )
}
