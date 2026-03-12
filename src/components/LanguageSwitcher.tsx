'use client'

import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'

export function LanguageSwitcher() {
  const locale = useLocale()

  return (
    <div className="flex items-center gap-1">
      {(['ru', 'en'] as const).map((lang) => (
        <a
          key={lang}
          href={`/${lang}`}
          onClick={(e) => {
            e.preventDefault()
            window.location.replace(`/${lang}`)
          }}
          className={cn(
            'px-2 py-1 text-sm font-medium rounded transition-colors duration-200 uppercase',
            locale === lang
              ? 'text-[#F5F5F5] bg-[#1A1A1E] underline underline-offset-2'
              : 'text-[#5A5A5E] hover:text-[#8A8A8E]'
          )}
        >
          {lang}
        </a>
      ))}
    </div>
  )
}
