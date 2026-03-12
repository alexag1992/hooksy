'use client'

import { useTranslations } from 'next-intl'
import { MAX_TOPIC_LENGTH } from '@/config/constants'

interface TopicInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function TopicInput({ value, onChange, disabled }: TopicInputProps) {
  const t = useTranslations('form.topic')

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#F5F5F5]">{t('label')}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={t('placeholder')}
        maxLength={MAX_TOPIC_LENGTH}
        rows={2}
        className="
          w-full resize-none rounded-xl px-4 py-3.5
          bg-[#141416] border border-[#2A2A2E]
          text-[#F5F5F5] placeholder-[#5A5A5E]
          text-[15px] leading-relaxed
          transition-all duration-200
          focus:border-[#00D4FF] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.1)] focus:outline-none
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      />
      <div className="text-right text-xs text-[#5A5A5E]">
        {value.length}/{MAX_TOPIC_LENGTH}
      </div>
    </div>
  )
}
