'use client'

import { useAuth } from '@/context/AuthContext'
import { DEMO_LIMITS } from '@/lib/credits'
import { AlertCircle } from 'lucide-react'

export function DemoBanner() {
  const { user, loading, demoUsage, hasActiveSubscription, openGate } = useAuth()

  if (
    loading ||
    !user ||
    hasActiveSubscription ||
    !demoUsage ||
    demoUsage.hooks_used < DEMO_LIMITS.hooks
  ) {
    return null
  }

  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#FF6B6B]/30 bg-[#FF6B6B]/5 px-4 py-3">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#FF6B6B]" />
      <div className="flex-1 text-sm text-[#FF6B6B]">
        Демо-режим исчерпан — вы использовали все 3 бесплатные цепочки.{' '}
        <button
          onClick={() => openGate('demo_exhausted')}
          className="font-medium underline hover:no-underline"
        >
          Оформить подписку
        </button>
      </div>
    </div>
  )
}
