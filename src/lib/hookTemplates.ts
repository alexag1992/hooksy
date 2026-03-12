import type { HookTemplate } from '@/types'

export const hookTemplates: HookTemplate[] = [
  // 1. ЛЮБОПЫТСТВО / CURIOSITY GAP
  {
    id: 'curiosity',
    category: 'curiosity',
    categoryLabel: { ru: 'Любопытство', en: 'Curiosity' },
    templates: {
      ru: [
        'Вот почему {topic} изменит всё в {year}',
        'Никто не говорит об этом, но {topic}...',
        '{number}% людей не знают это о {topic}',
        'Я только что узнал правду о {topic}',
        'Вот что скрывают эксперты по {topic}',
        'Секрет {topic}, который знают только профи',
        'То, что я узнал о {topic}, шокировало меня',
        'Один факт о {topic} изменил моё мнение навсегда',
        'Есть одна деталь о {topic}, о которой все молчат',
        'Почему {topic} работает не так, как вы думаете',
        '{topic}: то, что вам не расскажут на курсах',
        'Мало кто знает, но {topic} устроен совсем иначе',
        'Что если всё, что вы знали о {topic} — неправда?',
        'Вот что происходит, когда {topic} используют неправильно',
        'Угадайте, что будет если совместить {topic} и здравый смысл',
      ],
      en: [
        "Here's why {topic} will change everything in {year}",
        "Nobody talks about this, but {topic}...",
        "{number}% of people don't know this about {topic}",
        "I just found out the truth about {topic}",
        "Here's what experts hide about {topic}",
        "The secret about {topic} only pros know",
        "What I learned about {topic} shocked me",
        "One fact about {topic} changed my mind forever",
        "There's one detail about {topic} everyone ignores",
        "Why {topic} doesn't work the way you think",
        "{topic}: what they won't teach you in courses",
        "Few people know, but {topic} works completely differently",
        "What if everything you knew about {topic} was wrong?",
        "Here's what happens when {topic} is used incorrectly",
        "Guess what happens when you combine {topic} with common sense",
      ],
    },
  },

  // 2. FOMO (СТРАХ УПУСТИТЬ)
  {
    id: 'fomo',
    category: 'fomo',
    categoryLabel: { ru: 'Страх упустить', en: 'FOMO' },
    templates: {
      ru: [
        'Если вы не делаете это с {topic} — вы теряете деньги',
        'Все уже используют {topic}, а вы?',
        'Пока вы думаете — ваши конкуренты уже внедрили {topic}',
        '{topic}: кто не начнёт сейчас — пожалеет через год',
        'Вы всё ещё игнорируете {topic}? Зря.',
        'Тренд на {topic} закончится — и вы останетесь позади',
        '{number} из 10 лидеров рынка уже используют {topic}',
        'Через год вы пожалеете, что не начали {topic} сегодня',
        'Этот {topic}-приём уже дал результат тысячам — кроме вас',
        'Ваши конкуренты прочитали это о {topic}. А вы?',
        'Пока вы сомневаетесь в {topic}, другие зарабатывают',
        'Не знать это о {topic} в {year} — непозволительная роскошь',
        '{topic} уже не опция — это необходимость',
        'Каждый день без {topic} стоит вам клиентов',
        'Последний шанс разобраться в {topic} до того, как будет поздно',
      ],
      en: [
        "If you're not doing this with {topic} — you're losing money",
        "Everyone's already using {topic}. Are you?",
        "While you're thinking, your competitors already adopted {topic}",
        "{topic}: those who don't start now will regret it in a year",
        "Still ignoring {topic}? Big mistake.",
        "The {topic} trend will end — and you'll be left behind",
        "{number} out of 10 market leaders already use {topic}",
        "A year from now, you'll wish you started {topic} today",
        "This {topic} trick already worked for thousands — except you",
        "Your competitors read this about {topic}. Did you?",
        "While you're doubting {topic}, others are profiting",
        "Not knowing this about {topic} in {year} is unacceptable",
        "{topic} is no longer optional — it's a necessity",
        "Every day without {topic} costs you clients",
        "Last chance to figure out {topic} before it's too late",
      ],
    },
  },

  // 3. ЛИЧНЫЙ ОПЫТ / PERSONAL STORY
  {
    id: 'personal',
    category: 'personal',
    categoryLabel: { ru: 'Личный опыт', en: 'Personal Story' },
    templates: {
      ru: [
        'Как {topic} изменило мою жизнь за {number} дней',
        'Я пробовал {topic} {number} дней — вот результат',
        'Мой провал с {topic} научил меня большему, чем любой курс',
        'Я потратил {number}$ на {topic} — и вот что понял',
        'История о том, как я чуть не бросил {topic}',
        'Я делал {topic} неправильно {number} лет. Вот как надо',
        'Почему я отказался от старого подхода к {topic}',
        'Мои первые {number} дней в {topic} были ужасны. А потом...',
        '{topic} разрушило мои планы — и это лучшее что случилось',
        'Я сделал {number} ошибок в {topic}. Вот главная',
        'Что бы я сказал себе, когда начинал {topic}',
        'Мой путь в {topic}: от полного нуля до результата',
        'Я бросил {topic} на 3 месяца — и вернулся. Вот почему',
        'Один разговор изменил всё, что я думал о {topic}',
        'Вот как выглядит {topic} после {number} попыток',
      ],
      en: [
        "How {topic} changed my life in {number} days",
        "I tried {topic} for {number} days — here's the result",
        "My failure with {topic} taught me more than any course",
        "I spent ${number} on {topic} — here's what I learned",
        "The story of how I almost quit {topic}",
        "I did {topic} wrong for {number} years. Here's the right way",
        "Why I abandoned my old approach to {topic}",
        "My first {number} days in {topic} were terrible. Then...",
        "{topic} ruined my plans — and it was the best thing ever",
        "I made {number} mistakes in {topic}. Here's the biggest one",
        "What I'd tell myself when I started {topic}",
        "My {topic} journey: from complete zero to results",
        "I quit {topic} for 3 months — and came back. Here's why",
        "One conversation changed everything I thought about {topic}",
        "Here's what {topic} looks like after {number} attempts",
      ],
    },
  },

  // 4. ЭКСПЕРТНОСТЬ / AUTHORITY
  {
    id: 'authority',
    category: 'authority',
    categoryLabel: { ru: 'Экспертность', en: 'Authority' },
    templates: {
      ru: [
        'Я потратил {number} часов изучая {topic} — вот что узнал',
        'Разобрал {number} примеров {topic} — вот лучший',
        'Проанализировал {number} кейсов по {topic}: вот выводы',
        'Мой {number}-летний опыт в {topic} в одном посте',
        'Топ-{number} инструментов для {topic} в {year}',
        'Полный гайд по {topic}: всё что нужно знать',
        'Я протестировал {number} подходов к {topic}. Работает только один',
        'Что говорят данные о {topic}: разбор {number} исследований',
        '{number} стратегий {topic}, которые реально работают',
        'Сравнил {number} решений для {topic} — результаты удивили',
        'Главные метрики {topic}, на которые смотрят профи',
        'Подробный разбор: почему {topic} работает (с примерами)',
        'Формула {topic}: {number} шагов к результату',
        'Чек-лист по {topic}: {number} пунктов от практика',
        'Как устроен {topic} изнутри: технический разбор',
      ],
      en: [
        "I spent {number} hours studying {topic} — here's what I found",
        "Analyzed {number} examples of {topic} — here's the best one",
        "Reviewed {number} case studies on {topic}: key takeaways",
        "My {number}-year experience with {topic} in one post",
        "Top {number} tools for {topic} in {year}",
        "The complete guide to {topic}: everything you need to know",
        "I tested {number} approaches to {topic}. Only one works",
        "What the data says about {topic}: {number} studies reviewed",
        "{number} {topic} strategies that actually work",
        "Compared {number} solutions for {topic} — results were surprising",
        "Key {topic} metrics that pros focus on",
        "Deep dive: why {topic} works (with examples)",
        "The {topic} formula: {number} steps to results",
        "{topic} checklist: {number} points from a practitioner",
        "How {topic} really works under the hood: technical breakdown",
      ],
    },
  },

  // 5. ПРОВОКАЦИЯ / CONTROVERSY
  {
    id: 'controversy',
    category: 'controversy',
    categoryLabel: { ru: 'Провокация', en: 'Controversy' },
    templates: {
      ru: [
        '{topic} — это переоценено. Вот почему',
        'Популярное мнение о {topic} — неправда',
        'Перестаньте делать это с {topic}. Серьёзно.',
        'Непопулярное мнение: {topic} не работает для большинства',
        'Почему гуру {topic} вам врут',
        'Я устал от мифов о {topic}. Давайте разберёмся',
        '{topic}? Забудьте. Вот что реально работает',
        'Хватит верить в эти {number} мифов о {topic}',
        'Жёсткая правда о {topic}, которую никто не хочет слышать',
        '{topic} мёртв. Или нет?',
        'Вам не нужен {topic}. Вот что нужно вместо этого',
        'Худший совет по {topic}, который я когда-либо слышал',
        'Индустрия {topic} вас обманывает. Вот доказательства',
        '{topic} в {year}: почему все делают это неправильно',
        'Спорим, вы неправильно понимаете {topic}?',
      ],
      en: [
        "{topic} is overrated. Here's why",
        "The popular opinion about {topic} is wrong",
        "Stop doing this with {topic}. Seriously.",
        "Unpopular opinion: {topic} doesn't work for most people",
        "Why {topic} gurus are lying to you",
        "I'm tired of myths about {topic}. Let's break it down",
        "{topic}? Forget it. Here's what actually works",
        "Stop believing these {number} myths about {topic}",
        "The hard truth about {topic} nobody wants to hear",
        "{topic} is dead. Or is it?",
        "You don't need {topic}. Here's what you need instead",
        "The worst {topic} advice I've ever heard",
        "The {topic} industry is lying to you. Here's the proof",
        "{topic} in {year}: why everyone's doing it wrong",
        "Bet you misunderstand {topic}?",
      ],
    },
  },

  // 6. ЧИСЛА И СПИСКИ / NUMBERS & LISTS
  {
    id: 'numbers',
    category: 'numbers',
    categoryLabel: { ru: 'Цифры и списки', en: 'Numbers & Lists' },
    templates: {
      ru: [
        '{number} вещей о {topic}, которые я узнал слишком поздно',
        'Топ-{number} ошибок в {topic} (вы делаете минимум 3)',
        '{number} правил {topic}, которые нельзя нарушать',
        '{number} секунд — столько нужно чтобы понять {topic}',
        '{topic} за {number} минут: краткий разбор',
        'Всего {number} шагов отделяют вас от успеха в {topic}',
        '{number} трендов {topic} на {year} год',
        '{number} признаков что вы делаете {topic} неправильно',
        '{number} бесплатных ресурсов по {topic}',
        'Делал {topic} {number} месяцев. {number} выводов',
        '{number} лайфхаков для {topic}, которые экономят часы',
        'От {number} до {number}: мой рост в {topic}',
        '{number} фактов о {topic}, которые вас удивят',
        '{number} шаблонов {topic}, которые можно скопировать прямо сейчас',
        '{number} причин начать {topic} именно сегодня',
      ],
      en: [
        "{number} things about {topic} I learned too late",
        "Top {number} mistakes in {topic} (you're making at least 3)",
        "{number} rules of {topic} you can't break",
        "{number} seconds — that's all you need to understand {topic}",
        "{topic} in {number} minutes: quick breakdown",
        "Just {number} steps separate you from {topic} success",
        "{number} {topic} trends for {year}",
        "{number} signs you're doing {topic} wrong",
        "{number} free resources for {topic}",
        "Did {topic} for {number} months. {number} takeaways",
        "{number} {topic} hacks that save hours",
        "From {number} to {number}: my {topic} growth",
        "{number} facts about {topic} that will surprise you",
        "{number} {topic} templates you can copy right now",
        "{number} reasons to start {topic} today",
      ],
    },
  },

  // 7. ВОПРОСЫ / QUESTIONS
  {
    id: 'questions',
    category: 'questions',
    categoryLabel: { ru: 'Вопросы', en: 'Questions' },
    templates: {
      ru: [
        'Вы точно уверены, что правильно используете {topic}?',
        'Что если {topic} — это не то, что вы думаете?',
        'Почему {topic} не даёт вам результат?',
        'Хотите узнать главный секрет {topic}?',
        'Как понять, что {topic} работает на вас?',
        'Знаете ли вы эти {number} фактов о {topic}?',
        'Что общего у {topic} и успешного бизнеса?',
        'Готовы к правде о {topic}?',
        'А вы уже попробовали это с {topic}?',
        'Сколько вы теряете из-за незнания {topic}?',
        'Почему одни преуспевают в {topic}, а другие нет?',
        'Какой {topic}-подход подходит именно вам?',
        'Вы делаете эту ошибку в {topic}?',
        'Что будет если отказаться от {topic}?',
        'Какой результат даст {topic} через {number} дней?',
      ],
      en: [
        "Are you sure you're using {topic} correctly?",
        "What if {topic} isn't what you think it is?",
        "Why isn't {topic} giving you results?",
        "Want to know the main secret of {topic}?",
        "How to tell if {topic} is working for you?",
        "Do you know these {number} facts about {topic}?",
        "What do {topic} and successful business have in common?",
        "Ready for the truth about {topic}?",
        "Have you tried this with {topic} yet?",
        "How much are you losing by not knowing {topic}?",
        "Why do some succeed at {topic} while others don't?",
        "Which {topic} approach is right for you?",
        "Are you making this {topic} mistake?",
        "What happens if you give up {topic}?",
        "What results will {topic} bring in {number} days?",
      ],
    },
  },

  // 8. ИНСТРУКЦИИ / HOW-TO
  {
    id: 'howto',
    category: 'howto',
    categoryLabel: { ru: 'Инструкции', en: 'How-To' },
    templates: {
      ru: [
        'Как начать {topic} с нуля (пошаговый план)',
        'Как использовать {topic} если вы новичок',
        'Как я настроил {topic} за {number} минут',
        'Пошаговая инструкция: {topic} для начинающих',
        'Как получить максимум от {topic} без бюджета',
        'Как делать {topic} быстрее и эффективнее',
        'Как перейти с нуля до про в {topic}',
        'Как автоматизировать {topic} (простой способ)',
        'Как я использую {topic} каждый день — мой воркфлоу',
        'Простой способ внедрить {topic} в свой бизнес',
        'Как избежать {number} главных ошибок в {topic}',
        'Как совмещать {topic} с основной работой',
        'Как масштабировать {topic}: от хобби к бизнесу',
        'Как {topic} экономит мне {number} часов в неделю',
        'Как выбрать лучший подход к {topic} для себя',
      ],
      en: [
        "How to start {topic} from scratch (step-by-step plan)",
        "How to use {topic} if you're a beginner",
        "How I set up {topic} in {number} minutes",
        "Step-by-step guide: {topic} for beginners",
        "How to get the most from {topic} with zero budget",
        "How to do {topic} faster and more efficiently",
        "How to go from zero to pro in {topic}",
        "How to automate {topic} (the simple way)",
        "How I use {topic} every day — my workflow",
        "Simple way to implement {topic} in your business",
        "How to avoid the top {number} mistakes in {topic}",
        "How to combine {topic} with your day job",
        "How to scale {topic}: from hobby to business",
        "How {topic} saves me {number} hours per week",
        "How to choose the best {topic} approach for yourself",
      ],
    },
  },

  // 9. СРАВНЕНИЕ / COMPARISON
  {
    id: 'comparison',
    category: 'comparison',
    categoryLabel: { ru: 'Сравнение', en: 'Comparison' },
    templates: {
      ru: [
        '{topic}: ожидания vs реальность',
        '{topic} до и после — разница огромна',
        'Новички в {topic} vs профессионалы: {number} отличий',
        '{topic} бесплатно vs платно — что лучше?',
        '{topic} в {year} vs {topic} {number} лет назад',
        'Дешёвый {topic} vs дорогой: стоит ли переплачивать?',
        '{topic}: быстрый способ vs правильный способ',
        'Как выглядит {topic} у новичка и у эксперта',
        '{topic}: теория vs практика — что важнее?',
        'Я попробовал {number} подходов к {topic}. Вот рейтинг',
        '{topic}: хайп или реальная польза?',
        'Что выбрать для {topic}: вариант А или Б?',
        '{topic} своими руками vs делегирование',
        'Было → Стало: мой результат с {topic}',
        '{topic} для бизнеса vs для себя — есть ли разница?',
      ],
      en: [
        "{topic}: expectations vs reality",
        "{topic} before and after — the difference is huge",
        "Beginners in {topic} vs pros: {number} differences",
        "Free {topic} vs paid — which is better?",
        "{topic} in {year} vs {topic} {number} years ago",
        "Cheap {topic} vs expensive: is it worth paying more?",
        "{topic}: the quick way vs the right way",
        "What {topic} looks like for a beginner vs an expert",
        "{topic}: theory vs practice — what matters more?",
        "I tried {number} approaches to {topic}. Here's my ranking",
        "{topic}: hype or real value?",
        "What to choose for {topic}: option A or B?",
        "{topic}: DIY vs delegation",
        "Before → After: my result with {topic}",
        "{topic} for business vs personal use — any difference?",
      ],
    },
  },

  // 10. ТРЕНДЫ / TRENDS
  {
    id: 'trends',
    category: 'trends',
    categoryLabel: { ru: 'Тренды', en: 'Trends' },
    templates: {
      ru: [
        '{topic} в {year}: что изменилось и что делать',
        'Новый тренд в {topic}, который взорвёт рынок',
        'Прогноз: как {topic} изменится через {number} лет',
        'Почему все вдруг заговорили о {topic}',
        '{topic} — это пузырь или будущее?',
        'Этот {topic}-тренд изменит вашу стратегию',
        'Что ждёт {topic} в ближайшие {number} месяцев',
        '{topic}: тренд или долгосрочный сдвиг?',
        'Как подготовиться к изменениям в {topic}',
        '{number} трендов {topic}, которые нельзя игнорировать',
        'Будущее {topic}: мой прогноз на {year}',
        '{topic} на пике — как не опоздать',
        'Вот почему {topic} будет везде через {number} месяцев',
        'Революция в {topic}: вот что происходит прямо сейчас',
        '{topic} в {year}: гайд по новым правилам игры',
      ],
      en: [
        "{topic} in {year}: what changed and what to do",
        "A new {topic} trend that will blow up the market",
        "Prediction: how {topic} will change in {number} years",
        "Why everyone suddenly started talking about {topic}",
        "{topic} — bubble or the future?",
        "This {topic} trend will change your strategy",
        "What's ahead for {topic} in the next {number} months",
        "{topic}: trend or long-term shift?",
        "How to prepare for changes in {topic}",
        "{number} {topic} trends you can't ignore",
        "The future of {topic}: my prediction for {year}",
        "{topic} is at its peak — don't be late",
        "Here's why {topic} will be everywhere in {number} months",
        "Revolution in {topic}: here's what's happening right now",
        "{topic} in {year}: guide to the new rules of the game",
      ],
    },
  },

  // 11. БЫСТРЫЙ РЕЗУЛЬТАТ / QUICK WIN
  {
    id: 'quickwin',
    category: 'quickwin',
    categoryLabel: { ru: 'Быстрый результат', en: 'Quick Win' },
    templates: {
      ru: [
        'Один простой приём в {topic}, который работает мгновенно',
        '{topic}: получите первый результат за {number} минут',
        'Сделайте это прямо сейчас — и ваш {topic} улучшится',
        'Самый быстрый способ начать с {topic}',
        'Лайфхак по {topic}, который занимает {number} секунд',
        '{topic}: минимум усилий — максимум результата',
        'Скопируйте эту {topic}-стратегию и получите результат сегодня',
        'Одно изменение в {topic}, которое всё перевернёт',
        'Как улучшить {topic} за {number} минут без бюджета',
        'Бесплатный способ прокачать {topic} прямо сейчас',
        'Попробуйте это с {topic} — результат будет через {number} часов',
        '{topic}: мгновенный буст за {number} шагов',
        'Вот что сделать с {topic} в ближайшие {number} минут',
        'Микро-действие в {topic}, которое даёт макро-результат',
        'Я улучшил {topic} за {number} минут. Вот как',
      ],
      en: [
        "One simple {topic} trick that works instantly",
        "{topic}: get your first result in {number} minutes",
        "Do this right now — and your {topic} will improve",
        "The fastest way to get started with {topic}",
        "A {topic} hack that takes {number} seconds",
        "{topic}: minimum effort — maximum result",
        "Copy this {topic} strategy and get results today",
        "One change in {topic} that flips everything",
        "How to improve {topic} in {number} minutes with zero budget",
        "A free way to level up your {topic} right now",
        "Try this with {topic} — results in {number} hours",
        "{topic}: instant boost in {number} steps",
        "Here's what to do with {topic} in the next {number} minutes",
        "A micro-action in {topic} that gives macro-results",
        "I improved {topic} in {number} minutes. Here's how",
      ],
    },
  },

  // 12. РАЗРУШЕНИЕ МИФОВ / MYTH BUSTING
  {
    id: 'mythbusting',
    category: 'mythbusting',
    categoryLabel: { ru: 'Разрушение мифов', en: 'Myth Busting' },
    templates: {
      ru: [
        'Миф: {topic} — это сложно. Реальность: ...',
        'Забудьте всё, что знали о {topic}',
        '{number} мифов о {topic}, в которые все верят',
        'Почему советы по {topic} из интернета не работают',
        'Самое большое заблуждение о {topic}',
        'Вам сказали, что {topic} работает так. Это ложь',
        'Разбираю {number} популярных мифов о {topic}',
        '{topic}: что правда, а что выдумка',
        'Эксперты по {topic} ошибаются в этом',
        'Правда о {topic}, которую не хотят слышать',
        'Почему «общепринятый» подход к {topic} устарел',
        '{topic}: развенчиваю {number} главных мифов',
        'Это «правило» {topic} — полная ерунда. Вот почему',
        'Почему книги по {topic} дают плохие советы',
        '{topic}: наконец-то правда, а не маркетинг',
      ],
      en: [
        "Myth: {topic} is hard. Reality: ...",
        "Forget everything you knew about {topic}",
        "{number} myths about {topic} everyone believes",
        "Why {topic} advice from the internet doesn't work",
        "The biggest misconception about {topic}",
        "They told you {topic} works like this. It's a lie",
        "Debunking {number} popular myths about {topic}",
        "{topic}: what's true and what's fiction",
        "{topic} experts are wrong about this",
        "The truth about {topic} nobody wants to hear",
        "Why the 'standard' approach to {topic} is outdated",
        "{topic}: debunking the top {number} myths",
        "This {topic} 'rule' is complete nonsense. Here's why",
        "Why {topic} books give bad advice",
        "{topic}: finally the truth, not marketing",
      ],
    },
  },

  // 13. ЭМОЦИОНАЛЬНЫЕ / EMOTIONAL
  {
    id: 'emotional',
    category: 'emotional',
    categoryLabel: { ru: 'Эмоциональные', en: 'Emotional' },
    templates: {
      ru: [
        'Это видео о {topic} заставило меня переосмыслить всё',
        'Я чуть не заплакал, когда понял это о {topic}',
        '{topic} спасло мой бизнес. Буквально',
        'Я был на грани, пока не открыл {topic}',
        'Самый честный пост о {topic}, который вы прочитаете',
        'Почему я так страстно отношусь к {topic}',
        '{topic} — это не просто тренд. Это мой спасательный круг',
        'Если {topic} вызывает у вас страх — послушайте',
        'Мой самый болезненный урок в {topic}',
        'Благодаря {topic} я наконец-то чувствую уверенность',
        'Тот момент, когда {topic} наконец-то заработало...',
        'Я должен был узнать это о {topic} раньше',
        '{topic}: история, которая изменит ваш взгляд',
        'Меня трясло, когда я увидел результаты {topic}',
        'Вот почему {topic} — это больше, чем просто инструмент',
      ],
      en: [
        "This {topic} video made me rethink everything",
        "I almost cried when I realized this about {topic}",
        "{topic} literally saved my business",
        "I was on the edge until I discovered {topic}",
        "The most honest post about {topic} you'll ever read",
        "Why I'm so passionate about {topic}",
        "{topic} isn't just a trend. It's my lifeline",
        "If {topic} scares you — listen up",
        "My most painful lesson in {topic}",
        "Thanks to {topic}, I finally feel confident",
        "That moment when {topic} finally worked...",
        "I should have learned this about {topic} sooner",
        "{topic}: a story that will change your perspective",
        "I was shaking when I saw my {topic} results",
        "Here's why {topic} is more than just a tool",
      ],
    },
  },

  // 14. ПОД ПЛАТФОРМУ / PLATFORM-SPECIFIC
  {
    id: 'platform_specific',
    category: 'platform_specific',
    categoryLabel: { ru: 'Под платформу', en: 'Platform-Specific' },
    templates: {
      ru: [
        'POV: вы только что открыли для себя {topic}',
        'Сторитайм: как {topic} изменило всё',
        'Подождите до конца... {topic}',
        'Это не шутка: {topic} реально работает',
        'Я потратил 100 часов на {topic} чтобы вам не пришлось',
        '{topic}: полный разбор за {number} минут',
        'ЭКСПЕРИМЕНТ: что будет если {topic}?',
        'Сохрани, чтобы не потерять 📌 {topic}',
        'Листай, если хочешь разобраться в {topic} →',
        'Тот пост про {topic}, который вы ждали',
        'Разбор: {topic} — всё, что нужно знать',
        'Инсайд: что происходит с {topic} прямо сейчас',
        'Конспект: {topic} в {number} пунктах',
        'Ребят, ну это реально работает: {topic}',
        'Короче, разобрался с {topic}. Рассказываю',
      ],
      en: [
        "POV: you just discovered {topic}",
        "Storytime: how {topic} changed everything",
        "Wait for it... {topic}",
        "This is not a joke: {topic} actually works",
        "I spent 100 hours on {topic} so you don't have to",
        "{topic}: complete breakdown in {number} minutes",
        "EXPERIMENT: what happens if {topic}?",
        "Save this for later 📌 {topic}",
        "Swipe if you want to understand {topic} →",
        "The post about {topic} you've been waiting for",
        "Deep dive: {topic} — everything you need to know",
        "Inside scoop: what's happening with {topic} right now",
        "Summary: {topic} in {number} bullet points",
        "Guys, this actually works: {topic}",
        "So I figured out {topic}. Let me explain",
      ],
    },
  },

  // 15. ШОК / SHOCK VALUE
  {
    id: 'shock',
    category: 'shock',
    categoryLabel: { ru: 'Шок-контент', en: 'Shock Value' },
    templates: {
      ru: [
        'Я удалил всё и начал {topic} заново. Вот почему',
        'Это самая большая ошибка в {topic}. И все её делают',
        'ВНИМАНИЕ: {topic} изменился. Старые методы не работают',
        'Я потерял {number}$ из-за этой ошибки в {topic}',
        'Шок: {topic} работает совсем не так, как учат',
        'Прекратите делать {topic} по старинке. Вот новый путь',
        'То, что случилось с моим {topic} — не для слабонервных',
        'ВСЁ. {topic} больше никогда не будет прежним',
        '{topic} уничтожит {number}% бизнесов. Вот как выжить',
        'Я чуть не потерял всё из-за {topic}. Учитесь на моих ошибках',
        'ЭТО МЕНЯЕТ ВСЁ: новый подход к {topic}',
        'Невероятно, но {topic} можно сделать за {number} минут',
        'Я отказался от {topic} — и произошло невероятное',
        '{topic}: что-то пошло не так... (и это хорошо)',
        'Вот почему {number}% людей провалятся в {topic}',
      ],
      en: [
        "I deleted everything and started {topic} from scratch. Here's why",
        "This is the biggest {topic} mistake. And everyone makes it",
        "WARNING: {topic} has changed. Old methods don't work",
        "I lost ${number} because of this {topic} mistake",
        "Shocking: {topic} works nothing like they teach",
        "Stop doing {topic} the old way. Here's the new path",
        "What happened with my {topic} isn't for the faint-hearted",
        "THAT'S IT. {topic} will never be the same",
        "{topic} will destroy {number}% of businesses. Here's how to survive",
        "I almost lost everything because of {topic}. Learn from my mistakes",
        "THIS CHANGES EVERYTHING: a new approach to {topic}",
        "Unbelievable, but {topic} can be done in {number} minutes",
        "I quit {topic} — and something incredible happened",
        "{topic}: something went wrong... (and it's a good thing)",
        "Here's why {number}% of people will fail at {topic}",
      ],
    },
  },
]

// ═══════════════════════════════════════
// УТИЛИТЫ
// ═══════════════════════════════════════

export function fillTemplate(
  template: string,
  variables: { topic: string; number?: number; year?: number }
): string {
  return template
    .replace(/{topic}/g, variables.topic)
    .replace(/{number}/g, String(variables.number ?? Math.floor(Math.random() * 20) + 3))
    .replace(/{year}/g, String(variables.year ?? new Date().getFullYear()))
}

export function getRandomTemplates(locale: 'ru' | 'en', count: number = 10): string[] {
  const allTemplates = hookTemplates.flatMap((cat) => cat.templates[locale])
  const shuffled = [...allTemplates].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function getTemplatesByCategory(categoryId: string, locale: 'ru' | 'en'): string[] {
  const category = hookTemplates.find((cat) => cat.id === categoryId)
  return category ? category.templates[locale] : []
}

export function getPlatformTemplates(platform: string, locale: 'ru' | 'en'): string[] {
  const platformCategory = hookTemplates.find((cat) => cat.id === 'platform_specific')
  return platformCategory ? platformCategory.templates[locale] : []
}

// Get a curated diverse set of templates for AI to analyze and adapt.
// Returns labeled patterns: "Категория: шаблон" — so AI understands the intent behind each.
export function getCuratedTemplatesForAI(
  locale: 'ru' | 'en',
  perCategory: number = 2
): { category: string; label: string; template: string }[] {
  const result: { category: string; label: string; template: string }[] = []

  for (const cat of hookTemplates) {
    const templates = cat.templates[locale]
    // Pick templates from different positions for diversity (start, middle, end)
    const picks = [
      templates[0],
      templates[Math.floor(templates.length / 2)],
      templates[templates.length - 1],
    ].slice(0, perCategory)

    for (const template of picks) {
      result.push({
        category: cat.id,
        label: cat.categoryLabel[locale],
        template,
      })
    }
  }

  return result
}
