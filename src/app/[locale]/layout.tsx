import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Header } from '@/components/Header'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'ru' | 'en')) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="min-h-screen flex flex-col bg-[#0A0A0B]">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t border-[#2A2A2E] py-6">
          <div className="mx-auto max-w-4xl px-4 text-center text-sm text-[#5A5A5E]">
            © 2025 Хукси
          </div>
        </footer>
      </div>
    </NextIntlClientProvider>
  )
}
