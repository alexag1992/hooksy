import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Check, Zap, MessageCircle } from 'lucide-react'
import { Link } from '@/i18n/navigation'

export const metadata: Metadata = {
  title: 'Тарифы — Хукси',
  description: 'Подписка Хукси Pro — 990 ₽/мес, 300 кредитов. Генерируйте хуки, тексты объявлений и рекламные креативы без ограничений.',
  openGraph: {
    title: 'Тарифы — Хукси',
    description: '990 ₽/мес — 300 кредитов на хуки, тексты и изображения.',
  },
  robots: { index: true, follow: true },
}

const BASE_FEATURES = [
  '300 кредитов в месяц',
  'До 300 хуков (1 кр/шт)',
  'До 150 рекламных текстов (2 кр/шт)',
  'До 20 креативов (15 кр/шт)',
  'Неиспользованные кредиты переходят',
  'Все платформы и форматы',
  'Приоритетная генерация',
]

const INDIVIDUAL_FEATURES = [
  'Индивидуальный пакет кредитов под ваш объём',
  'Поддержка напрямую в Telegram',
  'Гибкие условия и способы оплаты',
  'Возможность обсудить новые функции под ваши задачи',
]

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#F5F5F5] mb-3">Тарифы</h1>
        <p className="text-[#8A8A8E] text-base md:text-lg max-w-md mx-auto">
          Начните бесплатно, подключите подписку когда будете готовы
        </p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-6 items-start">

        {/* Base plan */}
        <div className="relative rounded-2xl border border-[#00D4FF]/30 bg-[#141416] p-6 flex flex-col gap-5">
          {/* Recommended badge */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)' }}
            >
              Рекомендуем
            </span>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00D4FF]/10">
              <Zap className="h-4 w-4 text-[#00D4FF]" />
            </div>
            <h2 className="text-lg font-bold text-[#F5F5F5]">База</h2>
          </div>

          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-[#F5F5F5]">990</span>
              <span className="text-[#8A8A8E]">₽/мес</span>
            </div>
            <p className="text-xs text-[#5A5A5E] mt-1">= 3,3 ₽ за хук</p>
          </div>

          <ul className="flex flex-col gap-2.5">
            {BASE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-[#C0C0C4]">
                <Check className="h-4 w-4 text-[#00D4FF] shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>

          <button
            className="mt-auto w-full py-3 rounded-xl text-white font-medium text-sm transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)' }}
            disabled
          >
            Оформить подписку — скоро
          </button>
          <p className="text-center text-xs text-[#3A3A3E]">Приём платежей через ЮKassa — в разработке</p>
        </div>

        {/* Individual plan */}
        <div className="rounded-2xl border border-[#2A2A2E] bg-[#141416] p-6 flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8B5CF6]/10">
              <MessageCircle className="h-4 w-4 text-[#8B5CF6]" />
            </div>
            <h2 className="text-lg font-bold text-[#F5F5F5]">Индивидуальный</h2>
          </div>

          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-[#F5F5F5]">По запросу</span>
            </div>
            <p className="text-xs text-[#5A5A5E] mt-1">Обсудим условия индивидуально</p>
          </div>

          <ul className="flex flex-col gap-2.5">
            {INDIVIDUAL_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-[#C0C0C4]">
                <Check className="h-4 w-4 text-[#8B5CF6] shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>

          <a
            href="https://t.me/alex_ag92"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto w-full py-3 rounded-xl font-medium text-sm text-center transition-all border border-[#8B5CF6]/50 text-[#8B5CF6] hover:bg-[#8B5CF6]/10"
          >
            Написать в Telegram
          </a>
        </div>
      </div>

      {/* Demo info */}
      <div className="mt-10 rounded-xl border border-[#2A2A2E] bg-[#141416] p-5 text-center">
        <p className="text-sm text-[#8A8A8E]">
          Не уверены? Попробуйте бесплатно —{' '}
          <span className="text-[#F5F5F5]">3 хука, 3 текста объявления и 1 креатив</span>{' '}
          без подписки после регистрации.
        </p>
        <Link
          href="/"
          className="inline-block mt-3 text-sm text-[#00D4FF] hover:underline"
        >
          Попробовать демо →
        </Link>
      </div>
    </div>
  )
}
