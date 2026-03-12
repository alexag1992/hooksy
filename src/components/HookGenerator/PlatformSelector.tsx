'use client'

import { useTranslations } from 'next-intl'
import { platforms } from '@/config/platforms'
import { cn } from '@/lib/utils'
import type { Platform } from '@/types'

interface PlatformSelectorProps {
  value: Platform | null
  onChange: (platform: Platform) => void
  disabled?: boolean
}

export function PlatformSelector({ value, onChange, disabled }: PlatformSelectorProps) {
  const t = useTranslations('form.platform')

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[#F5F5F5]">{t('label')}</label>
      <div className="flex flex-wrap gap-2">
        {platforms.map((platform) => {
          const isSelected = value === platform.id
          return (
            <button
              key={platform.id}
              type="button"
              onClick={() => onChange(platform.id)}
              disabled={disabled}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] border text-sm font-medium',
                'transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                isSelected
                  ? 'bg-[#1A1A2E] border-[#00D4FF] text-[#00D4FF] shadow-[0_0_0_1px_rgba(0,212,255,0.2)]'
                  : 'bg-[#141416] border-[#2A2A2E] text-[#8A8A8E] hover:bg-[#1A1A1E] hover:border-[#3A3A3E]'
              )}
            >
              <span>{platform.emoji}</span>
              <span>{platform.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
