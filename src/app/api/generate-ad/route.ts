import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai'
import { buildAdPrompt, buildAdVariantsPrompt } from '@/lib/prompts'
import { checkRateLimit } from '@/lib/rateLimit'
import { OPENAI_MODEL } from '@/config/constants'
import type { AdGenerateRequest, AdGenerateResponse, Platform, Locale } from '@/types'

const VALID_PLATFORMS: Platform[] = ['youtube', 'tiktok', 'instagram', 'telegram', 'vk']
const VALID_LOCALES: Locale[] = ['ru', 'en']

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
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

  let body: Partial<AdGenerateRequest>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { hook, topic, platform, audience, context, locale = 'ru', variants } = body

  if (!hook || typeof hook !== 'string' || hook.trim().length === 0) {
    return NextResponse.json({ error: 'Hook is required' }, { status: 400 })
  }

  if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
    return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
  }

  if (!platform || !VALID_PLATFORMS.includes(platform as Platform)) {
    return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
  }

  if (!VALID_LOCALES.includes(locale as Locale)) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 })
  }

  const validPlatform = platform as Platform
  const validLocale = locale as Locale

  // Fallback if no API key
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-...') {
    if (variants) {
      return NextResponse.json({
        variants: [hook, hook, hook] as [string, string, string],
      } as AdGenerateResponse)
    }
    return NextResponse.json({ ad_text: hook } as AdGenerateResponse)
  }

  try {
    if (variants) {
      const prompt = buildAdVariantsPrompt(hook, topic, validPlatform, audience, context, validLocale)

      const completion = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.9,
        max_tokens: 2000,
      })

      const content = completion.choices[0]?.message?.content?.trim() || ''

      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (!jsonMatch) throw new Error('No JSON found')
        const parsed = JSON.parse(jsonMatch[0])
        if (!Array.isArray(parsed.variants) || parsed.variants.length < 3) {
          throw new Error('Invalid variants array')
        }
        return NextResponse.json({
          variants: parsed.variants.slice(0, 3) as [string, string, string],
        } as AdGenerateResponse)
      } catch {
        return NextResponse.json({ error: 'Failed to parse variants' }, { status: 500 })
      }
    } else {
      const prompt = buildAdPrompt(hook, topic, validPlatform, audience, context, validLocale)

      const completion = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.85,
        max_tokens: 800,
      })

      const ad_text = completion.choices[0]?.message?.content?.trim() || hook
      return NextResponse.json({ ad_text } as AdGenerateResponse)
    }
  } catch (error) {
    console.error('OpenAI API error (generate-ad):', error)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
