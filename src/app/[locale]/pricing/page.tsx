import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Check, Zap, MessageCircle } from 'lucide-react'
import { Link } from '@/i18n/navigation'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isRu = locale === 'ru'
  return {
    title: isRu ? 'Тарифы — Хукси' : 'Pricing — Hooksy',
    description: isRu
      ? 'Подписка Хукси База — 990 ₽/мес, 300 кредитов. Генерируйте хуки, тексты объявлений и рекламные креативы без ограничений.'
      : 'Hooksy Base subscription — 990 ₽/mo, 300 credits. Generate hooks, ad texts and creatives without limits.',
    robots: { index: true, follow: true },
  }
}

const t = {
  ru: {
    title: 'Тарифы',
    subtitle: 'Начните бесплатно, подключите подписку когда будете готовы',
    recommended: 'Рекомендуем',
    baseName: 'База',
    priceUnit: '₽/мес',
    priceHint: '= 3,3 ₽ за хук',
    subscribeCta: 'Оформить подписку',
    individualName: 'Индивидуальный',
    individualPrice: 'По запросу',
    individualHint: 'Обсудим условия индивидуально',
    contactCta: 'Написать в Telegram',
    demoText: 'Не уверены? Попробуйте бесплатно —',
    demoHighlight: '3 хука, 3 текста объявления и 1 креатив',
    demoSuffix: 'без подписки после регистрации.',
    demoCta: 'Попробовать демо →',
    baseFeatures: [
      '300 кредитов в месяц',
      'До 300 хуков (1 кр/шт)',
      'До 150 рекламных текстов (2 кр/шт)',
      'До 20 креативов (15 кр/шт)',
      'Неиспользованные кредиты переходят',
      'Все платформы и форматы',
      'Приоритетная генерация',
    ],
    individualFeatures: [
      'Индивидуальный пакет кредитов под ваш объём',
      'Поддержка напрямую в Telegram',
      'Гибкие условия и способы оплаты',
      'Возможность обсудить новые функции под ваши задачи',
    ],
  },
  en: {
    title: 'Pricing',
    subtitle: 'Start for free, upgrade when you\'re ready',
    recommended: 'Recommended',
    baseName: 'Base',
    priceUnit: '₽/mo',
    priceHint: '= 3.3 ₽ per hook',
    subscribeCta: 'Subscribe',
    individualName: 'Custom',
    individualPrice: 'On request',
    individualHint: 'We\'ll discuss terms individually',
    contactCta: 'Message on Telegram',
    demoText: 'Not sure yet? Try for free —',
    demoHighlight: '3 hooks, 3 ad texts and 1 creative',
    demoSuffix: 'without a subscription after sign-up.',
    demoCta: 'Try demo →',
    baseFeatures: [
      '300 credits per month',
      'Up to 300 hooks (1 cr/each)',
      'Up to 150 ad texts (2 cr/each)',
      'Up to 20 creatives (15 cr/each)',
      'Unused credits roll over',
      'All platforms and formats',
      'Priority generation',
    ],
    individualFeatures: [
      'Custom credit package for your volume',
      'Direct support on Telegram',
      'Flexible payment terms and methods',
      'Discuss new features tailored to your needs',
    ],
  },
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const c = locale === 'ru' ? t.ru : t.en

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#F5F5F5] mb-3">{c.title}</h1>
        <p className="text-[#8A8A8E] text-base md:text-lg max-w-md mx-auto">{c.subtitle}</p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-6 items-start">

        {/* Base plan */}
        <div className="relative rounded-2xl border border-[#00D4FF]/30 bg-[#141416] p-6 flex flex-col gap-5">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)' }}
            >
              {c.recommended}
            </span>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00D4FF]/10">
              <Zap className="h-4 w-4 text-[#00D4FF]" />
            </div>
            <h2 className="text-lg font-bold text-[#F5F5F5]">{c.baseName}</h2>
          </div>

          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-[#F5F5F5]">990</span>
              <span className="text-[#8A8A8E]">{c.priceUnit}</span>
            </div>
            <p className="text-xs text-[#5A5A5E] mt-1">{c.priceHint}</p>
          </div>

          <ul className="flex flex-col gap-2.5">
            {c.baseFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-[#C0C0C4]">
                <Check className="h-4 w-4 text-[#00D4FF] shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>

          <Link
            href="/checkout"
            className="mt-auto w-full py-3 rounded-xl text-white font-medium text-sm text-center transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)' }}
          >
            {c.subscribeCta}
          </Link>
        </div>

        {/* Individual plan */}
        <div className="rounded-2xl border border-[#2A2A2E] bg-[#141416] p-6 flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8B5CF6]/10">
              <MessageCircle className="h-4 w-4 text-[#8B5CF6]" />
            </div>
            <h2 className="text-lg font-bold text-[#F5F5F5]">{c.individualName}</h2>
          </div>

          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-[#F5F5F5]">{c.individualPrice}</span>
            </div>
            <p className="text-xs text-[#5A5A5E] mt-1">{c.individualHint}</p>
          </div>

          <ul className="flex flex-col gap-2.5">
            {c.individualFeatures.map((f) => (
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
            {c.contactCta}
          </a>
        </div>
      </div>

      {/* Demo info */}
      <div className="mt-10 rounded-xl border border-[#2A2A2E] bg-[#141416] p-5 text-center">
        <p className="text-sm text-[#8A8A8E]">
          {c.demoText}{' '}
          <span className="text-[#F5F5F5]">{c.demoHighlight}</span>{' '}
          {c.demoSuffix}
        </p>
        <Link href="/" className="inline-block mt-3 text-sm text-[#00D4FF] hover:underline">
          {c.demoCta}
        </Link>
      </div>
    </div>
  )
}
