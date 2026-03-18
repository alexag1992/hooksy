'use client'

import { useAuth } from '@/context/AuthContext'
import { LogOut, Coins } from 'lucide-react'
import { DEMO_LIMITS } from '@/lib/credits'

export function AuthButton() {
  const { user, loading, credits, demoUsage, hasActiveSubscription, signInWithGoogle, signOut, openGate } =
    useAuth()

  if (loading) {
    return <div className="h-8 w-20 animate-pulse rounded-lg bg-[#1E1E22]" />
  }

  if (!user) {
    return (
      <button
        onClick={() => openGate('not_authenticated')}
        className="rounded-lg px-4 py-1.5 text-sm font-medium text-white transition"
        style={{ background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)' }}
      >
        Войти
      </button>
    )
  }

  const demoLeft = demoUsage ? DEMO_LIMITS.hooks - demoUsage.hooks_used : 0

  return (
    <div className="flex items-center gap-2">
      {/* Credits / demo badge */}
      {hasActiveSubscription ? (
        <div className="flex items-center gap-1 rounded-lg bg-[#1E1E22] px-3 py-1.5 text-sm text-[#F5F5F5]">
          <Coins size={14} className="text-[#00D4FF]" />
          <span>{credits} кр</span>
        </div>
      ) : (
        <div
          className="rounded-lg px-3 py-1.5 text-xs font-medium"
          style={{
            background: demoLeft > 0 ? '#1E1E22' : '#2A1A1A',
            color: demoLeft > 0 ? '#8A8A8E' : '#FF6B6B',
          }}
        >
          {demoLeft > 0 ? `Демо: ${demoLeft} из ${DEMO_LIMITS.hooks}` : 'Демо исчерпано'}
        </div>
      )}

      {/* Avatar */}
      {user.user_metadata?.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.user_metadata.avatar_url}
          alt="avatar"
          className="h-8 w-8 rounded-full border border-[#2A2A2E]"
        />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E1E22] text-sm font-bold text-[#00D4FF] border border-[#2A2A2E]">
          {user.email?.[0]?.toUpperCase() ?? '?'}
        </div>
      )}

      {/* Sign out */}
      <button
        onClick={signOut}
        title="Выйти"
        className="text-[#5A5A5E] hover:text-[#F5F5F5] transition-colors"
      >
        <LogOut size={16} />
      </button>
    </div>
  )
}
