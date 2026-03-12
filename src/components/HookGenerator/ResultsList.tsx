'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Check, Copy, ChevronDown, Loader2, RefreshCw, FileText, Image as ImageIcon } from 'lucide-react'
import { useGenerateAd } from '@/hooks/useGenerateAd'
import { CreativeGenerator } from '@/components/CreativeGenerator'
import type { GenerateStatus, Platform, Locale } from '@/types'

interface HookCardProps {
  hook: string
  index: number
  topic: string
  platform: Platform
  audience: string
  context: string
  locale: Locale
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [text])

  return (
    <button
      onClick={handleCopy}
      className="
        flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs
        border border-[#2A2A2E] text-[#8A8A8E]
        hover:border-[#3A3A3E] hover:text-[#F5F5F5]
        transition-all duration-200 shrink-0
      "
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-[#22C55E]" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {copied ? '✓' : label}
    </button>
  )
}

const VARIANT_LABELS = {
  ru: ['Эмоциональный', 'Рациональный', 'Провокационный'],
  en: ['Emotional', 'Rational', 'Provocative'],
}

const VARIANT_COLORS = [
  'border-[#8B5CF6]/30 bg-[#8B5CF6]/5',
  'border-[#00D4FF]/30 bg-[#00D4FF]/5',
  'border-[#F59E0B]/30 bg-[#F59E0B]/5',
]

const VARIANT_LABEL_COLORS = ['text-[#8B5CF6]', 'text-[#00D4FF]', 'text-[#F59E0B]']

function CreativeButton({
  onClick,
  active,
  label,
  disabled,
}: {
  onClick: () => void
  active: boolean
  label: string
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs
        border transition-all duration-200 shrink-0
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          active
            ? 'border-[#00D4FF]/50 bg-[#00D4FF]/10 text-[#00D4FF]'
            : 'border-[#2A2A2E] text-[#8A8A8E] hover:border-[#3A3A3E] hover:text-[#F5F5F5]'
        }
      `}
    >
      <ImageIcon className="h-3.5 w-3.5" />
      {label}
    </button>
  )
}

function AdTextBlock({
  text,
  hook,
  locale,
  onRegenerate,
  onGenerateVariants,
  isLoading,
}: {
  text: string
  hook: string
  locale: Locale
  onRegenerate: () => void
  onGenerateVariants: () => void
  isLoading: boolean
}) {
  const t = useTranslations('ad')
  const [showCreative, setShowCreative] = useState(false)

  return (
    <div className="flex flex-col gap-3 pt-3">
      <div className="rounded-xl p-4 bg-[#0F0F11] border border-[#2A2A2E]">
        <p className="text-[#F5F5F5] text-[14px] leading-relaxed whitespace-pre-line">{text}</p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <CopyButton text={text} label={t('copy')} />
        <button
          onClick={onRegenerate}
          disabled={isLoading}
          className="
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs
            border border-[#2A2A2E] text-[#8A8A8E]
            hover:border-[#3A3A3E] hover:text-[#F5F5F5]
            transition-all duration-200 shrink-0
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {t('regenerate')}
        </button>
        <button
          onClick={onGenerateVariants}
          disabled={isLoading}
          className="
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs
            border border-[#8B5CF6]/40 text-[#8B5CF6]
            hover:border-[#8B5CF6]/70 hover:bg-[#8B5CF6]/10
            transition-all duration-200 shrink-0
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <FileText className="h-3.5 w-3.5" />
          {t('makeVariants')}
        </button>
        <CreativeButton
          onClick={() => setShowCreative((v) => !v)}
          active={showCreative}
          label={t('createCreative')}
        />
      </div>
      {showCreative && <CreativeGenerator hook={hook} adText={text} locale={locale} />}
    </div>
  )
}

function AdVariantsBlock({
  variants,
  hook,
  locale,
  onRegenerate,
  onRegenerateSingle,
  isLoading,
}: {
  variants: [string, string, string]
  hook: string
  locale: Locale
  onRegenerate: () => void
  onRegenerateSingle: () => void
  isLoading: boolean
}) {
  const t = useTranslations('ad')
  const labels = VARIANT_LABELS[locale]
  const [showCreative, setShowCreative] = useState<boolean[]>([false, false, false])

  const toggleCreative = useCallback((i: number) => {
    setShowCreative((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
  }, [])

  return (
    <div className="flex flex-col gap-3 pt-3">
      {variants.map((text, i) => (
        <div key={i} className={`rounded-xl p-4 border ${VARIANT_COLORS[i]}`}>
          <p className={`text-xs font-semibold mb-2 ${VARIANT_LABEL_COLORS[i]}`}>{labels[i]}</p>
          <p className="text-[#F5F5F5] text-[14px] leading-relaxed whitespace-pre-line">{text}</p>
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <CopyButton text={text} label={t('copy')} />
            <CreativeButton
              onClick={() => toggleCreative(i)}
              active={showCreative[i]}
              label={t('createCreative')}
            />
          </div>
          {showCreative[i] && <CreativeGenerator hook={hook} adText={text} locale={locale} />}
        </div>
      ))}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onRegenerate}
          disabled={isLoading}
          className="
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs
            border border-[#2A2A2E] text-[#8A8A8E]
            hover:border-[#3A3A3E] hover:text-[#F5F5F5]
            transition-all duration-200 shrink-0
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {t('regenerateVariants')}
        </button>
        <button
          onClick={onRegenerateSingle}
          disabled={isLoading}
          className="
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs
            border border-[#2A2A2E] text-[#8A8A8E]
            hover:border-[#3A3A3E] hover:text-[#F5F5F5]
            transition-all duration-200 shrink-0
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <FileText className="h-3.5 w-3.5" />
          {t('singleVariant')}
        </button>
      </div>
    </div>
  )
}

function HookCard({ hook, index, topic, platform, audience, context, locale }: HookCardProps) {
  const t = useTranslations('results')
  const tAd = useTranslations('ad')
  const [isExpanded, setIsExpanded] = useState(false)
  const [hookCopied, setHookCopied] = useState(false)
  const { adText, variants, status: adStatus, generateSingle, generateVariants, reset: resetAd } = useGenerateAd()

  const adParams = { hook, topic, platform, audience: audience || undefined, context: context || undefined, locale }

  const handleHookCopy = useCallback(async () => {
    await navigator.clipboard.writeText(hook)
    setHookCopied(true)
    setTimeout(() => setHookCopied(false), 2000)
  }, [hook])

  const handleExpand = useCallback(() => {
    setIsExpanded((v) => !v)
    if (isExpanded) resetAd()
  }, [isExpanded, resetAd])

  const handleGenerate = useCallback(() => {
    generateSingle(adParams)
  }, [generateSingle, adParams])

  const handleGenerateVariants = useCallback(() => {
    generateVariants(adParams)
  }, [generateVariants, adParams])

  const handleRegenerateSingle = useCallback(() => {
    generateSingle(adParams)
  }, [generateSingle, adParams])

  const isAdLoading = adStatus === 'loading'

  return (
    <div
      className={`
        animate-fade-slide-up rounded-xl
        bg-[#141416] border
        transition-all duration-200
        ${isExpanded ? 'border-[#00D4FF]/30' : 'border-[#2A2A2E] hover:border-[#3A3A3E]'}
      `}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Hook row */}
      <div
        className="flex items-start gap-3 p-4 cursor-pointer select-none group"
        onClick={handleExpand}
      >
        <span className="shrink-0 w-8 text-right font-mono text-sm text-[#5A5A5E] pt-0.5">
          {String(index + 1).padStart(2, '0')}
        </span>
        <p className="flex-1 text-[#F5F5F5] text-[15px] leading-relaxed">{hook}</p>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleHookCopy()
            }}
            className="
              p-1.5 rounded-lg text-[#5A5A5E] hover:text-[#00D4FF]
              transition-colors duration-200
              opacity-0 group-hover:opacity-100
            "
            title={t('copy')}
          >
            {hookCopied ? (
              <Check className="h-4 w-4 text-[#22C55E]" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
          <div
            className={`
              p-1.5 rounded-lg text-[#5A5A5E]
              transition-all duration-200
              ${isExpanded ? 'rotate-180 text-[#00D4FF]' : 'group-hover:text-[#8A8A8E]'}
            `}
          >
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Expanded panel */}
      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="border-t border-[#2A2A2E] pt-3">
            {adStatus === 'idle' && (
              <button
                onClick={handleGenerate}
                className="
                  flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                  bg-gradient-to-r from-[#00D4FF]/10 to-[#8B5CF6]/10
                  border border-[#00D4FF]/30 text-[#00D4FF]
                  hover:from-[#00D4FF]/20 hover:to-[#8B5CF6]/20 hover:border-[#00D4FF]/50
                  transition-all duration-200
                "
              >
                <FileText className="h-4 w-4" />
                {tAd('generate')}
              </button>
            )}

            {adStatus === 'loading' && (
              <div className="flex items-center gap-2 py-2 text-[#8A8A8E] text-sm">
                <Loader2 className="h-4 w-4 animate-spin text-[#00D4FF]" />
                {tAd('generating')}
              </div>
            )}

            {adStatus === 'error' && (
              <div className="flex items-center gap-3 py-2">
                <span className="text-[#EF4444] text-sm">{tAd('error')}</span>
                <button
                  onClick={handleGenerate}
                  className="text-xs text-[#8A8A8E] hover:text-[#F5F5F5] underline transition-colors"
                >
                  {tAd('retry')}
                </button>
              </div>
            )}

            {adStatus === 'success' && adText && (
              <AdTextBlock
                text={adText}
                hook={hook}
                locale={locale}
                onRegenerate={handleRegenerateSingle}
                onGenerateVariants={handleGenerateVariants}
                isLoading={isAdLoading}
              />
            )}

            {adStatus === 'success' && variants && (
              <AdVariantsBlock
                variants={variants}
                hook={hook}
                locale={locale}
                onRegenerate={handleGenerateVariants}
                onRegenerateSingle={handleRegenerateSingle}
                isLoading={isAdLoading}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

interface ResultsListProps {
  hooks: string[]
  status: GenerateStatus
  error: string | null
  onRetry: () => void
  topic: string
  platform: Platform | null
  audience: string
  context: string
  locale: Locale
}

export function ResultsList({
  hooks,
  status,
  error,
  onRetry,
  topic,
  platform,
  audience,
  context,
  locale,
}: ResultsListProps) {
  const t = useTranslations('results')
  const [allCopied, setAllCopied] = useState(false)

  const handleCopyAll = useCallback(async () => {
    const text = hooks.map((h, i) => `${i + 1}. ${h}`).join('\n')
    await navigator.clipboard.writeText(text)
    setAllCopied(true)
    setTimeout(() => setAllCopied(false), 2000)
  }, [hooks])

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-2 border-[#2A2A2E]" />
          <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-transparent border-t-[#00D4FF] animate-spin" />
        </div>
        <p className="text-[#8A8A8E] text-sm animate-pulse">{t('generating')}</p>
      </div>
    )
  }

  if (status === 'error') {
    const errorMsg = error === 'rate_limit' ? t('errorRateLimit') : t('error')
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="text-[#EF4444] text-sm text-center max-w-sm">{errorMsg}</div>
        <button
          onClick={onRetry}
          className="
            px-5 py-2.5 rounded-xl text-sm font-medium
            border border-[#2A2A2E] text-[#8A8A8E]
            hover:border-[#3A3A3E] hover:text-[#F5F5F5]
            transition-all duration-200
          "
        >
          {t('tryAgain')}
        </button>
      </div>
    )
  }

  if (status !== 'success' || hooks.length === 0) return null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#F5F5F5]">{t('title')}</h2>
        <button
          onClick={handleCopyAll}
          className="
            flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-sm
            border border-[#2A2A2E] text-[#8A8A8E]
            hover:border-[#3A3A3E] hover:text-[#F5F5F5]
            transition-all duration-200
          "
        >
          {allCopied ? (
            <Check className="h-3.5 w-3.5 text-[#22C55E]" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          <span>{allCopied ? t('copied') : t('copyAll')}</span>
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {hooks.map((hook, index) => (
          <HookCard
            key={`${hook}-${index}`}
            hook={hook}
            index={index}
            topic={topic}
            platform={platform!}
            audience={audience}
            context={context}
            locale={locale}
          />
        ))}
      </div>

      <p className="text-center text-xs text-[#5A5A5E] pt-2">{t('clickHint')}</p>
    </div>
  )
}
