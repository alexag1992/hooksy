import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rateLimit'
import type { ImageGenerateRequest, ImageGenerateResponse } from '@/types'

const POLZA_API_URL = 'https://polza.ai/api/v1/media'
const POLZA_MODEL = 'google/gemini-3.1-flash-image-preview'

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

function buildPrompt(params: ImageGenerateRequest): string {
  if (params.useContext && (params.hook || params.adText)) {
    return [
      'Create an advertising image.',
      '',
      params.prompt ? `User instructions:\n${params.prompt}` : '',
      '',
      'Ad context:',
      params.hook ? `Hook: ${params.hook}` : '',
      params.adText ? `\nAd text:\n${params.adText}` : '',
    ]
      .filter((line, i, arr) => !(line === '' && (i === 0 || arr[i - 1] === '')))
      .join('\n')
      .trim()
  }

  return `Create an image.\n\nUser instructions:\n${params.prompt}`
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const rateLimitResult = checkRateLimit(ip)

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a minute.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)),
        },
      }
    )
  }

  let body: Partial<ImageGenerateRequest>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { prompt, aspectRatio = '1:1', resolution = '2K', useContext = true, references = [], hook, adText } = body

  if (!prompt && !useContext) {
    return NextResponse.json({ error: 'Prompt is required when context is disabled' }, { status: 400 })
  }

  const apiKey = process.env.POLZA_AI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Image generation API key not configured' }, { status: 500 })
  }

  const finalPrompt = buildPrompt({ prompt: prompt || '', aspectRatio, resolution: resolution as '1K' | '2K' | '4K', useContext, references: references || [], hook, adText })

  // Build images array from base64 references
  const images = (references || [])
    .slice(0, 8)
    .map((ref: string) => {
      // ref is a data URL like "data:image/png;base64,..."
      // strip the data URL prefix if present
      const base64Data = ref.includes(',') ? ref.split(',')[1] : ref
      return { type: 'base64', data: base64Data }
    })

  const requestBody: Record<string, unknown> = {
    model: POLZA_MODEL,
    input: {
      prompt: finalPrompt,
      aspect_ratio: aspectRatio,
      image_resolution: resolution,
      output_format: 'png',
      ...(images.length > 0 ? { images } : {}),
    },
  }

  try {
    const response = await fetch(POLZA_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const msg = (errorData as { message?: string }).message || response.statusText

      if (response.status === 422 || response.status === 400) {
        return NextResponse.json(
          { error: 'Ошибка: запрос нарушает правила генерации изображений' } as ImageGenerateResponse,
          { status: 422 }
        )
      }

      console.error('PolzaAI error:', response.status, msg)
      return NextResponse.json(
        { error: 'Ошибка генерации: сервис временно недоступен' } as ImageGenerateResponse,
        { status: 502 }
      )
    }

    const data = await response.json()

    // Handle async job — poll if status is pending/processing
    if (data.status && data.status !== 'completed' && data.id) {
      const jobId = data.id
      const maxAttempts = 25
      let attempts = 0

      while (attempts < maxAttempts) {
        await new Promise((r) => setTimeout(r, 2000))
        attempts++

        const pollRes = await fetch(`${POLZA_API_URL}/${jobId}`, {
          headers: { Authorization: `Bearer ${apiKey}` },
        })

        if (!pollRes.ok) break

        const pollData = await pollRes.json()

        if (pollData.status === 'completed') {
          const imageUrl = pollData.data?.[0]?.url
          if (imageUrl) {
            return NextResponse.json({ image_url: imageUrl } as ImageGenerateResponse)
          }
          break
        }

        if (pollData.status === 'failed') {
          return NextResponse.json(
            { error: 'Ошибка генерации: сервис временно недоступен' } as ImageGenerateResponse,
            { status: 502 }
          )
        }
      }

      return NextResponse.json(
        { error: 'Ошибка соединения с API PolzaAI: превышено время ожидания' } as ImageGenerateResponse,
        { status: 504 }
      )
    }

    // Synchronous response
    const imageUrl = data.data?.[0]?.url
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Ошибка генерации: сервис временно недоступен' } as ImageGenerateResponse,
        { status: 502 }
      )
    }

    return NextResponse.json({ image_url: imageUrl } as ImageGenerateResponse)
  } catch (err) {
    console.error('generate-image error:', err)
    return NextResponse.json(
      { error: 'Ошибка соединения с API PolzaAI' } as ImageGenerateResponse,
      { status: 500 }
    )
  }
}
