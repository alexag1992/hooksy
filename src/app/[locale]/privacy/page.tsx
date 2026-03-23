import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности — Хукси',
  description: 'Политика конфиденциальности сервиса Хукси. Как мы обрабатываем ваши персональные данные.',
  robots: { index: false, follow: false },
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-[#C0C0C4]">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-[#5A5A5E] hover:text-[#F5F5F5] transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" /> На главную
      </Link>

      <h1 className="text-2xl font-bold text-[#F5F5F5] mb-2">Политика конфиденциальности</h1>
      <p className="text-sm text-[#5A5A5E] mb-10">Дата публикации: 23 марта 2026 г.</p>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">1. Общие положения</h2>
        <p className="mb-3">
          ООО «ЛАЙФ МЕДИА» (ОГРН 1176952020145, ИНН 6950213657) уважает конфиденциальность
          пользователей сервиса «Хукси» (hooksy.ru) и обеспечивает защиту их персональных данных
          в соответствии с Федеральным законом № 152-ФЗ «О персональных данных».
        </p>
        <p>
          Настоящая Политика описывает, какие данные мы собираем, как используем и какими
          правами вы обладаете в отношении ваших персональных данных.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">2. Какие данные мы собираем</h2>
        <p className="mb-3">При использовании сервиса мы можем получать следующие данные:</p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong className="text-[#F5F5F5]">Аутентификационные данные:</strong> адрес электронной почты и, при входе через Google — имя и фото профиля.</li>
          <li><strong className="text-[#F5F5F5]">Данные об использовании:</strong> количество сгенерированных хуков, текстов и изображений.</li>
          <li><strong className="text-[#F5F5F5]">Платёжные данные:</strong> обрабатываются платёжной системой ЮКасса и не хранятся на наших серверах.</li>
          <li><strong className="text-[#F5F5F5]">Технические данные:</strong> IP-адрес, тип браузера, данные сессии (cookies).</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">3. Цели обработки данных</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Предоставление доступа к сервису и управление аккаунтом.</li>
          <li>Обработка платежей и управление подпиской.</li>
          <li>Отправка уведомлений о статусе подписки и транзакциях.</li>
          <li>Обеспечение безопасности и предотвращение мошенничества.</li>
          <li>Улучшение качества сервиса.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">4. Передача данных третьим лицам</h2>
        <p className="mb-3">Мы передаём данные только следующим сервисам-обработчикам:</p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong className="text-[#F5F5F5]">Supabase</strong> — аутентификация и хранение данных.</li>
          <li><strong className="text-[#F5F5F5]">ЮКасса</strong> — обработка платежей.</li>
          <li><strong className="text-[#F5F5F5]">Google</strong> — при использовании Google OAuth.</li>
          <li><strong className="text-[#F5F5F5]">Resend</strong> — отправка транзакционных писем.</li>
        </ul>
        <p className="mt-3">Мы не продаём персональные данные третьим лицам.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">5. Cookies</h2>
        <p>
          Сервис использует cookies для поддержания сессии аутентификации. Cookies необходимы
          для корректной работы. Вы можете отключить их в браузере, однако это повлияет на
          функциональность сайта.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">6. Хранение данных</h2>
        <p>
          Данные хранятся на серверах Supabase в защищённом виде в течение всего срока
          существования аккаунта. При удалении аккаунта данные удаляются в течение 30 дней.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">7. Ваши права</h2>
        <p className="mb-3">В соответствии с ФЗ-152 вы вправе:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Получить информацию об обрабатываемых данных.</li>
          <li>Потребовать исправления неточных данных.</li>
          <li>Потребовать удаления персональных данных.</li>
          <li>Отозвать согласие на обработку данных.</li>
        </ul>
        <p className="mt-3">
          Для реализации прав обращайтесь:{' '}
          <a href="mailto:lifemediasmm@gmail.com" className="text-[#00D4FF] hover:underline">
            lifemediasmm@gmail.com
          </a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">8. Изменения политики</h2>
        <p>
          Мы оставляем за собой право вносить изменения. Об изменениях уведомляем путём
          публикации новой версии на данной странице.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">9. Контакты</h2>
        <p>
          ООО «ЛАЙФ МЕДИА» · ИНН 6950213657 · ОГРН 1176952020145<br />
          170034, г. Тверь, пр-кт Чайковского, д. 28/2, офис 621<br />
          <a href="mailto:lifemediasmm@gmail.com" className="text-[#00D4FF] hover:underline">
            lifemediasmm@gmail.com
          </a>
        </p>
      </section>
    </div>
  )
}
