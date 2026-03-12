'use client'

import { useTranslations } from 'next-intl'

interface GenerateButtonProps {
  onClick: () => void
  loading: boolean
  disabled: boolean
}

export function GenerateButton({ onClick, loading, disabled }: GenerateButtonProps) {
  const t = useTranslations('form')

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="
        btn-gradient
        w-full py-3.5 px-7
        rounded-xl
        text-white font-medium text-[15px]
        flex items-center justify-center gap-2
      "
    >
      {loading ? (
        <>
          <svg
            className="animate-spin-cyan h-4 w-4 border-2 border-white border-t-transparent rounded-full"
            viewBox="0 0 24 24"
            fill="none"
          />
          <span>{t('generating')}</span>
        </>
      ) : (
        <span>{t('generate')}</span>
      )}
    </button>
  )
}
