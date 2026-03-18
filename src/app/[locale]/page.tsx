import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { HookGenerator } from '@/components/HookGenerator'
import { UnauthGate } from '@/components/UnauthGate'
import { DemoBanner } from '@/components/DemoBanner'

function HeroSection() {
  const t = useTranslations('hero')
  return (
    <div className="text-center mb-10">
      <h1 className="text-3xl md:text-4xl font-bold text-[#F5F5F5] mb-3">
        {t('title')}
      </h1>
      <p className="text-[#8A8A8E] text-base md:text-lg">
        {t('subtitle')}
      </p>
    </div>
  )
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:py-14">
      <HeroSection />
      <DemoBanner />
      <UnauthGate>
        <HookGenerator />
      </UnauthGate>
    </div>
  )
}
