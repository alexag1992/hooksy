'use client'

import { useState, useCallback } from 'react'
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

  const generate = useCallback(async (params: GenerateRequest) => {
    setStatus('loading')
    setError(null)
    setHooks([])

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })

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
    } catch {
      setError('network_error')
      setStatus('error')
    }
  }, [])

  const reset = useCallback(() => {
    setHooks([])
    setStatus('idle')
    setError(null)
    setGenerationId(null)
  }, [])

  return { hooks, status, error, generationId, generate, reset }
}
