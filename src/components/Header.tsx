'use client'

import { useTranslations } from 'next-intl'
import { Anchor } from 'lucide-react'
import { LanguageSwitcher } from './LanguageSwitcher'
import { AuthButton } from './AuthButton'

export function Header() {
  const t = useTranslations('header')

  return (
    <header className="sticky top-0 z-50 border-b border-[#2A2A2E] bg-[#0A0A0B]/80 backdrop-blur-md">
      <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Anchor className="h-5 w-5 text-[#00D4FF]" />
          <span className="text-lg font-bold text-[#F5F5F5]">{t('title')}</span>
        </button>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <AuthButton />
        </div>
      </div>
    </header>
  )
}
