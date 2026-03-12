'use client'

import { useState, useCallback } from 'react'
import type { GeneratedImage, ImageGenerateRequest, ImageGenerateResponse } from '@/types'

interface UseGenerateImageReturn {
  images: GeneratedImage[]
  generate: (params: ImageGenerateRequest) => Promise<void>
  clearImages: () => void
}

export function useGenerateImage(): UseGenerateImageReturn {
  const [images, setImages] = useState<GeneratedImage[]>([])

  const generate = useCallback(async (params: ImageGenerateRequest) => {
    const id = crypto.randomUUID()

    // Add loading placeholder immediately
    setImages((prev) => [...prev, { id, status: 'loading' }])

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })

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
    } catch {
      setImages((prev) =>
        prev.map((img) =>
          img.id === id
            ? { id, status: 'error', errorMsg: 'Ошибка соединения с API PolzaAI' }
            : img
        )
      )
    }
  }, [])

  const clearImages = useCallback(() => setImages([]), [])

  return { images, generate, clearImages }
}
