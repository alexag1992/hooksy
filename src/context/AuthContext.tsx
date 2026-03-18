'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export interface DemoUsage {
  hooks_used: number
  ads_used: number
  images_used: number
}

export type GateReason = 'not_authenticated' | 'demo_exhausted' | 'insufficient_credits'

interface AuthContextType {
  user: User | null
  loading: boolean
  credits: number
  demoUsage: DemoUsage | null
  hasActiveSubscription: boolean
  gateReason: GateReason | null
  openGate: (reason: GateReason) => void
  closeGate: () => void
  signInWithGoogle: () => void
  signOut: () => void
  refreshUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  credits: 0,
  demoUsage: null,
  hasActiveSubscription: false,
  gateReason: null,
  openGate: () => {},
  closeGate: () => {},
  signInWithGoogle: () => {},
  signOut: () => {},
  refreshUserData: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [credits, setCredits] = useState(0)
  const [demoUsage, setDemoUsage] = useState<DemoUsage | null>(null)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const [gateReason, setGateReason] = useState<GateReason | null>(null)

  const supabase = createClient()

  const fetchUserData = useCallback(
    async (userId: string) => {
      const [creditsRes, demoRes, subRes] = await Promise.all([
        supabase.from('user_credits').select('balance').eq('user_id', userId).single(),
        supabase.from('demo_usage').select('*').eq('user_id', userId).single(),
        supabase
          .from('subscriptions')
          .select('status')
          .eq('user_id', userId)
          .eq('status', 'active')
          .maybeSingle(),
      ])
      setCredits(creditsRes.data?.balance ?? 0)
      setDemoUsage(demoRes.data ?? null)
      setHasActiveSubscription(!!subRes.data)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchUserData(session.user.id)
      } else {
        setCredits(0)
        setDemoUsage(null)
        setHasActiveSubscription(false)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const signInWithGoogle = useCallback(() => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }, [supabase])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [supabase])

  const refreshUserData = useCallback(async () => {
    if (user) await fetchUserData(user.id)
  }, [user, fetchUserData])

  const openGate = useCallback((reason: GateReason) => setGateReason(reason), [])
  const closeGate = useCallback(() => setGateReason(null), [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        credits,
        demoUsage,
        hasActiveSubscription,
        gateReason,
        openGate,
        closeGate,
        signInWithGoogle,
        signOut,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
