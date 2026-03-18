'use client'

import { useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import type { GenerateRequest, GenerateResponse, GenerateStatus } from '@/types'

interface UseGenerateReturn {
  hooks: string[]
  status: GenerateStatus
  error: string | null
  generationId: string | null
  generate: (params: GenerateRequest) => Promise<void>
  reset: () => void
}

export function useGenerate(): UseGenerateReturn {
  const [hooks, setHooks] = useState<string[]>([])
  const [status, setStatus] = useState<GenerateStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [generationId, setGenerationId] = useState<string | null>(null)
  const { openGate, refreshUserData } = useAuth()

  const generate = useCallback(
    async (params: GenerateRequest) => {
      setStatus('loading')
      setError(null)
      setHooks([])

      try {
        const res = await fetch('/api/generate', {
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

        const data: GenerateResponse = await res.json()
        setHooks(data.hooks)
        setGenerationId(data.generationId)
        setStatus('success')
        await refreshUserData()
      } catch {
        setError('network_error')
        setStatus('error')
      }
    },
    [openGate, refreshUserData]
  )

  const reset = useCallback(() => {
    setHooks([])
    setStatus('idle')
    setError(null)
    setGenerationId(null)
  }, [])

  return { hooks, status, error, generationId, generate, reset }
}
