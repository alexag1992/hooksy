'use client'

import { useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import type { GeneratedImage, ImageGenerateRequest, ImageGenerateResponse } from '@/types'

interface UseGenerateImageReturn {
  images: GeneratedImage[]
  generate: (params: ImageGenerateRequest) => Promise<void>
  clearImages: () => void
}

export function useGenerateImage(): UseGenerateImageReturn {
  const [images, setImages] = useState<GeneratedImage[]>([])
  const { openGate, refreshUserData } = useAuth()

  const generate = useCallback(
    async (params: ImageGenerateRequest) => {
      const id = crypto.randomUUID()

      // Add loading placeholder immediately
      setImages((prev) => [...prev, { id, status: 'loading' }])

      try {
        const res = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        })

        if (res.status === 401) {
          setImages((prev) => prev.filter((img) => img.id !== id))
          openGate('not_authenticated')
          return
        }

        if (res.status === 403) {
          const data = await res.json().catch(() => ({}))
          setImages((prev) => prev.filter((img) => img.id !== id))
          const reason =
            data.error === 'demo_image_exhausted'
              ? 'demo_image_exhausted'
              : data.error === 'demo_exhausted'
              ? 'demo_exhausted'
              : 'insufficient_credits'
          openGate(reason)
          return
        }

        const data: ImageGenerateResponse = await res.json().catch(() => ({}))

        if (!res.ok || data.error) {
          setImages((prev) =>
            prev.map((img) =>
              img.id === id
                ? { id, status: 'error', errorMsg: data.error || 'Ошибка генерации' }
                : img
            )
          )
          return
        }

        setImages((prev) =>
          prev.map((img) =>
            img.id === id ? { id, status: 'ready', url: data.image_url } : img
          )
        )
        await refreshUserData()
      } catch {
        setImages((prev) =>
          prev.map((img) =>
            img.id === id
              ? { id, status: 'error', errorMsg: 'Ошибка соединения с API PolzaAI' }
              : img
          )
        )
      }
    },
    [openGate, refreshUserData]
  )

  const clearImages = useCallback(() => setImages([]), [])

  return { images, generate, clearImages }
}
