import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { HookGenerator } from '@/components/HookGenerator'
import { UnauthGate } from '@/components/UnauthGate'
import { DemoBanner } from '@/components/DemoBanner'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isRu = locale === 'ru'
  return {
    title: isRu
      ? 'Хукси — Генератор вирусных хуков для социальных сетей'
      : 'Hooksy — AI Viral Hook Generator for Social Media',
    description: isRu
      ? 'Создавайте цепляющие первые строки для YouTube, TikTok, Instagram и Telegram с помощью ИИ. Бесплатное демо — 3 генерации без регистрации.'
      : 'Generate viral hooks for YouTube, TikTok, Instagram and Telegram using AI. Free demo — 3 generations without sign-up.',
    openGraph: {
      title: isRu ? 'Хукси — Генератор вирусных хуков' : 'Hooksy — AI Hook Generator',
      description: isRu
        ? 'ИИ генерирует цепляющие хуки за секунды. Попробуйте бесплатно.'
        : 'AI generates viral hooks in seconds. Try for free.',
      url: 'https://hooksy.ru',
      siteName: 'Хукси',
      locale: isRu ? 'ru_RU' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: isRu ? 'Хукси — Генератор вирусных хуков' : 'Hooksy — AI Hook Generator',
      description: isRu
        ? 'ИИ генерирует цепляющие хуки за секунды.'
        : 'AI generates viral hooks in seconds.',
    },
    alternates: {
      canonical: `https://hooksy.ru/${locale}`,
      languages: { ru: 'https://hooksy.ru/ru', en: 'https://hooksy.ru/en' },
    },
  }
}

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
