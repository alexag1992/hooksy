'use client'

import { useState, useCallback, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import type { GeneratedImage, ImageGenerateRequest, ImageGenerateResponse } from '@/types'

interface UseGenerateImageReturn {
  images: GeneratedImage[]
  generate: (params: ImageGenerateRequest) => Promise<void>
  retry: (id: string) => Promise<void>
  clearImages: () => void
}

export function useGenerateImage(): UseGenerateImageReturn {
  const [images, setImages] = useState<GeneratedImage[]>([])
  const { openGate, refreshUserData } = useAuth()
  const paramsRef = useRef<Map<string, ImageGenerateRequest>>(new Map())

  const generate = useCallback(
    async (params: ImageGenerateRequest) => {
      const id = crypto.randomUUID()
      paramsRef.current.set(id, params)

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
              ? { id, status: 'error', errorMsg: 'Сервис генерации изображений не отвечает — попробуйте через минуту.' }
              : img
          )
        )
      }
    },
    [openGate, refreshUserData]
  )

  const retry = useCallback(
    async (id: string) => {
      const params = paramsRef.current.get(id)
      if (!params) return
      paramsRef.current.delete(id)
      setImages((prev) => prev.filter((img) => img.id !== id))
      await generate(params)
    },
    [generate]
  )

  const clearImages = useCallback(() => setImages([]), [])

  return { images, generate, retry, clearImages }
}
