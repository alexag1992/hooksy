'use client'

import { useState, useCallback } from 'react'
import { useLocale } from 'next-intl'
import { TopicInput } from './TopicInput'
import { PlatformSelector } from './PlatformSelector'
import { AudienceInput } from './AudienceInput'
import { ContextInput } from './ContextInput'
import { GenerateButton } from './GenerateButton'
import { ResultsList } from './ResultsList'
import { useGenerate } from '@/hooks/useGenerate'
import type { Platform, Locale } from '@/types'

export function HookGenerator() {
  const locale = useLocale() as Locale
  const { hooks, status, error, generate, reset } = useGenerate()

  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState<Platform | null>(null)
  const [audience, setAudience] = useState('')
  const [context, setContext] = useState('')

  const handleGenerate = useCallback(async () => {
    if (!topic.trim() || !platform) return
    await generate({
      topic: topic.trim(),
      platform,
      audience: audience.trim() || undefined,
      locale,
    })
  }, [topic, platform, audience, locale, generate])

  const handleRetry = useCallback(() => {
    reset()
  }, [reset])

  const isLoading = status === 'loading'
  const canGenerate = topic.trim().length > 0 && platform !== null && !isLoading

  return (
    <div className="flex flex-col gap-6">
      {/* Form */}
      <div className="flex flex-col gap-5">
        <TopicInput value={topic} onChange={setTopic} disabled={isLoading} />
        <PlatformSelector value={platform} onChange={setPlatform} disabled={isLoading} />
        <AudienceInput value={audience} onChange={setAudience} disabled={isLoading} />
        <ContextInput value={context} onChange={setContext} disabled={isLoading} />
        <GenerateButton onClick={handleGenerate} loading={isLoading} disabled={!canGenerate} />
      </div>

      {/* Divider */}
      {(status === 'loading' || status === 'success' || status === 'error') && (
        <div className="border-t border-[#2A2A2E]" />
      )}

      {/* Results */}
      <ResultsList
        hooks={hooks}
        status={status}
        error={error}
        onRetry={handleRetry}
        topic={topic}
        platform={platform}
        audience={audience}
        context={context}
        locale={locale}
      />
    </div>
  )
}
