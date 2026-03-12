'use client'

import { useTranslations } from 'next-intl'

interface ContextInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function ContextInput({ value, onChange, disabled }: ContextInputProps) {
  const t = useTranslations('form.context')

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#8A8A8E]">{t('label')}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={t('placeholder')}
        maxLength={500}
        rows={3}
        className="
          w-full rounded-xl px-4 py-3.5
          bg-[#141416] border border-[#2A2A2E]
          text-[#F5F5F5] placeholder-[#5A5A5E]
          text-[15px] leading-relaxed resize-none
          transition-all duration-200
          focus:border-[#00D4FF] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.1)] focus:outline-none
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      />
    </div>
  )
}
