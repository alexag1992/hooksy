'use client'

import { useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import type { AdGenerateRequest, AdGenerateResponse, GenerateStatus } from '@/types'

interface UseGenerateAdReturn {
  adText: string | null
  variants: [string, string, string] | null
  status: GenerateStatus
  error: string | null
  generateSingle: (params: AdGenerateRequest) => Promise<void>
  generateVariants: (params: AdGenerateRequest) => Promise<void>
  reset: () => void
}

export function useGenerateAd(): UseGenerateAdReturn {
  const [adText, setAdText] = useState<string | null>(null)
  const [variants, setVariants] = useState<[string, string, string] | null>(null)
  const [status, setStatus] = useState<GenerateStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const { openGate, refreshUserData } = useAuth()

  const call = useCallback(
    async (params: AdGenerateRequest) => {
      setStatus('loading')
      setError(null)
      setAdText(null)
      setVariants(null)

      try {
        const res = await fetch('/api/generate-ad', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        })

        if (res.status === 401) {
          openGate('not_authenticated')
          setStatus('idle')
          return
        }

        if (res.status === 403) {
          const data = await res.json().catch(() => ({}))
          openGate(data.error === 'demo_exhausted' ? 'demo_exhausted' : 'insufficient_credits')
          setStatus('idle')
          return
        }

        if (res.status === 429) {
          setError('rate_limit')
          setStatus('error')
          return
        }

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          setError(data.error || 'unknown_error')
          setStatus('error')
          return
        }

        const data: AdGenerateResponse = await res.json()

        if (data.variants) {
          setVariants(data.variants)
        } else if (data.ad_text) {
          setAdText(data.ad_text)
        }

        setStatus('success')
        await refreshUserData()
      } catch {
        setError('network_error')
        setStatus('error')
      }
    },
    [openGate, refreshUserData]
  )

  const generateSingle = useCallback(
    (params: AdGenerateRequest) => call({ ...params, variants: false }),
    [call]
  )

  const generateVariants = useCallback(
    (params: AdGenerateRequest) => call({ ...params, variants: true }),
    [call]
  )

  const reset = useCallback(() => {
    setAdText(null)
    setVariants(null)
    setStatus('idle')
    setError(null)
  }, [])

  return { adText, variants, status, error, generateSingle, generateVariants, reset }
}
