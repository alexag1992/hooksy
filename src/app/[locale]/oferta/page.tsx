import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowLeft } from 'lucide-react'

export default async function OfertaPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-[#C0C0C4]">
      <h1 className="text-2xl font-bold text-[#F5F5F5] mb-2">Публичная оферта</h1>
      <p className="text-sm text-[#5A5A5E] mb-10">
        Дата публикации: 18 марта 2026 г.
      </p>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">1. Общие положения</h2>
        <p className="mb-3">
          ООО «ЛАЙФ МЕДИА» (ОГРН 1176952020145, ИНН 6950213657, юридический адрес: 170034,
          Тверская Область, г. Тверь, пр-кт Чайковского, д. 28/2, офис 621), именуемое в
          дальнейшем <strong className="text-[#F5F5F5]">«Исполнитель»</strong>, публикует
          настоящую Публичную оферту — предложение заключить договор об оказании услуг доступа
          к сервису «Хукси» (hooksy.ru) на изложенных ниже условиях.
        </p>
        <p className="mb-3">
          Акцептом настоящей оферты является факт оплаты услуг. С момента оплаты договор
          считается заключённым между Исполнителем и лицом, осуществившим оплату
          (<strong className="text-[#F5F5F5]">«Заказчик»</strong>).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">2. Предмет договора</h2>
        <p className="mb-3">
          Исполнитель предоставляет Заказчику доступ к онлайн-сервису «Хукси» —
          программному обеспечению для автоматической генерации маркетинговых текстов (хуков,
          рекламных объявлений) и изображений с использованием технологий искусственного
          интеллекта, размещённому по адресу hooksy.ru.
        </p>
        <p className="mb-3">
          Услуга является цифровой. Доступ предоставляется немедленно после успешной оплаты
          путём зачисления кредитов на аккаунт Заказчика.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">3. Стоимость и порядок оплаты</h2>
        <div className="mb-4 p-4 rounded-xl bg-[#141416] border border-[#2A2A2E]">
          <p className="font-semibold text-[#F5F5F5] mb-2">Тарифный план «Хукси Pro»</p>
          <ul className="space-y-1 text-sm">
            <li>— Стоимость: <strong className="text-[#F5F5F5]">990 рублей в месяц</strong></li>
            <li>— Включено: 300 кредитов в месяц</li>
            <li>— Генерация хука: 1 кредит</li>
            <li>— Генерация рекламного текста: 2 кредита</li>
            <li>— Генерация изображения: 15 кредитов</li>
            <li>— Неиспользованные кредиты переходят на следующий период</li>
          </ul>
        </div>
        <p className="mb-3">
          Оплата производится безналичным способом через платёжный сервис ЮKassa.
          Подписка оформляется на один календарный месяц и автоматически продлевается
          при наличии средств на привязанной карте.
        </p>
        <p className="mb-3">
          Заказчик вправе отменить подписку в любое время через личный кабинет.
          При отмене доступ сохраняется до конца оплаченного периода.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">4. Порядок предоставления услуг</h2>
        <p className="mb-3">
          Доступ к сервису предоставляется через личный кабинет на сайте hooksy.ru после
          регистрации и авторизации. Кредиты зачисляются на аккаунт Заказчика автоматически
          после подтверждения платежа платёжной системой.
        </p>
        <p className="mb-3">
          Исполнитель обязуется обеспечить работоспособность сервиса не менее 95% времени
          в месяц. Плановые технические работы проводятся с предварительным уведомлением
          пользователей.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">5. Права и обязанности сторон</h2>
        <p className="mb-2 font-medium text-[#F5F5F5]">Исполнитель обязуется:</p>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>предоставить доступ к сервису в течение 5 минут после оплаты;</li>
          <li>обеспечить конфиденциальность данных Заказчика;</li>
          <li>оказывать техническую поддержку по email: lifemediasmm@gmail.com.</li>
        </ul>
        <p className="mb-2 font-medium text-[#F5F5F5]">Заказчик обязуется:</p>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>использовать сервис только в законных целях;</li>
          <li>не передавать доступ к аккаунту третьим лицам;</li>
          <li>не использовать автоматизированные средства массового обращения к API сервиса.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">6. Возврат средств</h2>
        <p className="mb-3">
          Возврат оплаты за текущий расчётный период возможен в течение 3 (трёх) календарных
          дней с момента оплаты при условии, что Заказчик не использовал более 10 кредитов
          за указанный период. Для возврата необходимо направить заявку на
          lifemediasmm@gmail.com с указанием email аккаунта и причины возврата.
        </p>
        <p className="mb-3">
          Возврат не производится, если услуга была оказана в полном объёме либо кредиты
          были существенно израсходованы.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">7. Ограничение ответственности</h2>
        <p className="mb-3">
          Сервис предоставляется «как есть». Исполнитель не несёт ответственности за
          содержание текстов и изображений, сгенерированных с помощью сервиса, а также
          за их соответствие требованиям законодательства о рекламе. Ответственность
          Исполнителя ограничена суммой фактически уплаченных Заказчиком средств за
          последний расчётный период.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">8. Персональные данные</h2>
        <p className="mb-3">
          Акцептуя настоящую оферту, Заказчик даёт согласие на обработку своих персональных
          данных (имя, адрес электронной почты) в целях исполнения договора, в соответствии
          с Федеральным законом № 152-ФЗ «О персональных данных».
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">9. Срок действия и изменение условий</h2>
        <p className="mb-3">
          Настоящая оферта вступает в силу с момента публикации на сайте hooksy.ru и
          действует бессрочно. Исполнитель вправе изменять условия оферты, уведомив
          Заказчиков путём публикации новой редакции на сайте. Продолжение использования
          сервиса после изменений означает согласие с новыми условиями.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[#F5F5F5] mb-3">10. Реквизиты Исполнителя</h2>
        <div className="p-4 rounded-xl bg-[#141416] border border-[#2A2A2E] text-sm space-y-1">
          <p><span className="text-[#5A5A5E]">Наименование:</span> ООО «ЛАЙФ МЕДИА»</p>
          <p><span className="text-[#5A5A5E]">ОГРН:</span> 1176952020145</p>
          <p><span className="text-[#5A5A5E]">ИНН:</span> 6950213657</p>
          <p><span className="text-[#5A5A5E]">КПП:</span> 695001001</p>
          <p><span className="text-[#5A5A5E]">Юридический адрес:</span> 170034, Тверская Область, г. Тверь, пр-кт Чайковского, д. 28/2, офис 621</p>
          <p><span className="text-[#5A5A5E]">Генеральный директор:</span> Кенда Алексей Анатольевич</p>
          <p><span className="text-[#5A5A5E]">Email:</span> lifemediasmm@gmail.com</p>
          <p className="pt-2"><span className="text-[#5A5A5E]">Банк:</span> ООО «Банк Точка»</p>
          <p><span className="text-[#5A5A5E]">Р/с:</span> 40702810820000008168</p>
          <p><span className="text-[#5A5A5E]">БИК:</span> 044525104</p>
          <p><span className="text-[#5A5A5E]">К/с:</span> 30101810745374525104</p>
        </div>
      </section>

      <div className="mt-4 pb-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#5A5A5E] hover:text-[#C0C0C4] transition-colors">
          <ArrowLeft className="h-4 w-4" />
          На главную
        </Link>
      </div>
    </div>
  )
}
