import { useTranslations } from 'next-intl'
import { Anchor } from 'lucide-react'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Header() {
  const t = useTranslations('header')

  return (
    <header className="sticky top-0 z-50 border-b border-[#2A2A2E] bg-[#0A0A0B]/80 backdrop-blur-md">
      <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Anchor className="h-5 w-5 text-[#00D4FF]" />
          <span className="text-lg font-bold text-[#F5F5F5]">{t('title')}</span>
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  )
}
