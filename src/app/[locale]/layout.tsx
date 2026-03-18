import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Header } from '@/components/Header'
import { AuthProvider } from '@/context/AuthContext'
import { GateModal } from '@/components/GateModal'
import { OnboardingModal } from '@/components/OnboardingModal'

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
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-[#0A0A0B]">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t border-[#2A2A2E] py-8">
            <div className="mx-auto max-w-4xl px-4 space-y-3 text-center text-sm text-[#5A5A5E]">
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/pricing" className="hover:text-[#C0C0C4] transition-colors">Тарифы</a>
                <a href="/oferta" className="hover:text-[#C0C0C4] transition-colors">Публичная оферта</a>
                <a href="mailto:lifemediasmm@gmail.com" className="hover:text-[#C0C0C4] transition-colors">lifemediasmm@gmail.com</a>
              </div>
              <p>ООО «ЛАЙФ МЕДИА» · ИНН 6950213657 · ОГРН 1176952020145</p>
              <p>170034, г. Тверь, пр-кт Чайковского, д. 28/2, офис 621</p>
              <p>© 2026 Хукси</p>
            </div>
          </footer>
        </div>
        <GateModal />
        <OnboardingModal />
      </AuthProvider>
    </NextIntlClientProvider>
  )
}
