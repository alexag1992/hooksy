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

export type GateReason = 'not_authenticated' | 'demo_exhausted' | 'demo_image_exhausted' | 'insufficient_credits' | 'upgrade'

interface AuthContextType {
  user: User | null
  loading: boolean
  credits: number
  demoUsage: DemoUsage | null
  hasActiveSubscription: boolean
  isAdmin: boolean
  gateReason: GateReason | null
  openGate: (reason: GateReason) => void
  closeGate: () => void
  signInWithGoogle: () => void
  signInWithEmail: (email: string, password: string) => Promise<string | null>
  signOut: () => void
  refreshUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  credits: 0,
  demoUsage: null,
  hasActiveSubscription: false,
  isAdmin: false,
  gateReason: null,
  openGate: () => {},
  closeGate: () => {},
  signInWithGoogle: () => {},
  signInWithEmail: async () => null,
  signOut: () => {},
  refreshUserData: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [credits, setCredits] = useState(0)
  const [demoUsage, setDemoUsage] = useState<DemoUsage | null>(null)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [gateReason, setGateReason] = useState<GateReason | null>(null)

  const supabase = createClient()

  const fetchUserData = useCallback(
    async (userId: string) => {
      try {
        const [creditsRes, demoRes, subRes, profileRes] = await Promise.all([
          supabase.from('user_credits').select('balance').eq('user_id', userId).maybeSingle(),
          supabase.from('demo_usage').select('*').eq('user_id', userId).maybeSingle(),
          supabase
            .from('subscriptions')
            .select('status')
            .eq('user_id', userId)
            .eq('status', 'active')
            .maybeSingle(),
          supabase.from('profiles').select('is_admin').eq('id', userId).maybeSingle(),
        ])
        setCredits(creditsRes.data?.balance ?? 0)
        setDemoUsage(demoRes.data ?? null)
        setHasActiveSubscription(!!subRes.data)
        setIsAdmin(!!profileRes.data?.is_admin)
      } catch {
        // Non-critical — leave defaults
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(() => {
    // Get initial session immediately (doesn't wait for onAuthStateChange)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
      if (session?.user) {
        fetchUserData(session.user.id)
      }
    }).catch(() => setLoading(false))

    // Listen for future auth changes (sign in / sign out)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      if (session?.user) {
        fetchUserData(session.user.id)
      } else {
        setCredits(0)
        setDemoUsage(null)
        setHasActiveSubscription(false)
        setIsAdmin(false)
      }
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

  const signInWithEmail = useCallback(async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error ? error.message : null
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
        isAdmin,
        gateReason,
        openGate,
        closeGate,
        signInWithGoogle,
        signInWithEmail,
        signOut,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
