import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai'
import { systemPrompt, buildUserPrompt } from '@/lib/prompts'
import { checkRateLimit } from '@/lib/rateLimit'
import { getCuratedTemplatesForAI, fillTemplate, getRandomTemplates } from '@/lib/hookTemplates'
import { OPENAI_MODEL, HOOKS_COUNT, MAX_TOPIC_LENGTH } from '@/config/constants'
import type { GenerateRequest, GenerateResponse, Platform, Locale } from '@/types'

const VALID_PLATFORMS: Platform[] = ['youtube', 'tiktok', 'instagram', 'telegram', 'vk']
const VALID_LOCALES: Locale[] = ['ru', 'en']

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

function getFallbackHooks(topic: string, locale: Locale): string[] {
  const templates = getRandomTemplates(locale, HOOKS_COUNT)
  return templates.map((t) => fillTemplate(t, { topic }))
}

export async function POST(req: NextRequest) {
  // Rate limiting
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

  // Parse body
  let body: Partial<GenerateRequest>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { topic, platform, audience, locale = 'ru' } = body

  // Validate inputs
  if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
    return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
  }

  if (topic.length > MAX_TOPIC_LENGTH) {
    return NextResponse.json(
      { error: `Topic must be under ${MAX_TOPIC_LENGTH} characters` },
      { status: 400 }
    )
  }

  if (!platform || !VALID_PLATFORMS.includes(platform as Platform)) {
    return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
  }

  if (!VALID_LOCALES.includes(locale as Locale)) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 })
  }

  const cleanTopic = topic.trim()
  const cleanAudience = audience?.trim() || undefined
  const validLocale = locale as Locale
  const validPlatform = platform as Platform
  const generationId = crypto.randomUUID()

  // Check if API key is configured (not placeholder)
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-...') {
    const hooks = getFallbackHooks(cleanTopic, validLocale)
    return NextResponse.json({ hooks, generationId } as GenerateResponse)
  }

  try {
    // Get curated template patterns for the AI to analyze and adapt
    const templatePatterns = getCuratedTemplatesForAI(validLocale, 2)

    const userPrompt = buildUserPrompt(
      cleanTopic,
      validPlatform,
      cleanAudience,
      validLocale,
      templatePatterns,
      HOOKS_COUNT
    )

    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.85,
      max_tokens: 2500,
    })

    const content = completion.choices[0]?.message?.content?.trim() || ''

    // Parse JSON array from response
    let hooks: string[]
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      if (!jsonMatch) throw new Error('No JSON array found')
      hooks = JSON.parse(jsonMatch[0])

      if (!Array.isArray(hooks) || hooks.length === 0) {
        throw new Error('Invalid hooks array')
      }

      hooks = hooks.slice(0, HOOKS_COUNT)
      if (hooks.length < HOOKS_COUNT) {
        const fallback = getFallbackHooks(cleanTopic, validLocale)
        hooks = [...hooks, ...fallback].slice(0, HOOKS_COUNT)
      }
    } catch {
      hooks = getFallbackHooks(cleanTopic, validLocale)
    }

    return NextResponse.json({ hooks, generationId } as GenerateResponse)
  } catch (error: unknown) {
    console.error('OpenAI API error:', error)

    const isOpenAIError = error && typeof error === 'object' && 'status' in error
    if (isOpenAIError) {
      const status = (error as { status: number }).status
      if (status === 401 || status === 403) {
        const hooks = getFallbackHooks(cleanTopic, validLocale)
        return NextResponse.json({ hooks, generationId } as GenerateResponse)
      }
    }

    const hooks = getFallbackHooks(cleanTopic, validLocale)
    return NextResponse.json({ hooks, generationId } as GenerateResponse)
  }
}
