import type { Platform, Locale } from '@/types'

const adPlatformStyles: Record<Platform, { ru: string; en: string }> = {
  telegram: {
    ru: 'Короткий (1-3 абзаца), цепляющий, можно использовать эмодзи, сильный CTA в конце.',
    en: 'Short (1-3 paragraphs), catchy, emojis allowed, strong CTA at the end.',
  },
  instagram: {
    ru: 'Hook + сторителлинг, короткие абзацы, возможны эмодзи, CTA в конце.',
    en: 'Hook + storytelling, short paragraphs, emojis allowed, CTA at the end.',
  },
  tiktok: {
    ru: 'Короткий, разговорный стиль, высокая динамика, CTA. Можно как озвучку для видео.',
    en: 'Short, conversational, high energy, CTA. Can be written as video voiceover.',
  },
  youtube: {
    ru: 'Hook + интрига + объяснение + CTA. Похоже на мини-скрипт.',
    en: 'Hook + intrigue + explanation + CTA. Like a mini video script.',
  },
  vk: {
    ru: 'Hook + история или факты, дружеский тон, CTA в конце.',
    en: 'Hook + story or facts, friendly tone, CTA at the end.',
  },
}

const platformNames: Record<Platform, string> = {
  youtube: 'YouTube',
  tiktok: 'TikTok',
  instagram: 'Instagram',
  telegram: 'Telegram',
  vk: 'VKontakte',
}

export function buildAdPrompt(
  hook: string,
  topic: string,
  platform: Platform,
  audience: string | undefined,
  context: string | undefined,
  locale: Locale
): string {
  const style = adPlatformStyles[platform][locale]
  const platformName = platformNames[platform]

  if (locale === 'ru') {
    return `Ты профессиональный рекламный копирайтер.

Напиши рекламный текст на основе следующего хука.

Hook:
${hook}

Тема: ${topic}
Площадка: ${platformName}
${audience ? `Целевая аудитория: ${audience}` : ''}
${context ? `Дополнительный контекст: ${context}` : ''}

Требования:
1. Используй hook как первую строку (не изменяй его).
2. Сделай текст нативным для ${platformName}: ${style}
3. Пиши короткими абзацами, каждый на новой строке.
4. Добавь убедительный CTA (призыв к действию) в конце.
5. Текст должен звучать живо и по-человечески, не как шаблонная реклама.

Верни только готовый текст объявления, без пояснений.`
  }

  return `You are a professional advertising copywriter.

Write an ad text based on the following hook.

Hook:
${hook}

Topic: ${topic}
Platform: ${platformName}
${audience ? `Target audience: ${audience}` : ''}
${context ? `Additional context: ${context}` : ''}

Requirements:
1. Use the hook as the first line (do not change it).
2. Make the text native for ${platformName}: ${style}
3. Write in short paragraphs, each on a new line.
4. Add a compelling CTA (call to action) at the end.
5. The text should feel human and natural, not like a typical ad.

Return only the finished ad text, no explanations.`
}

export function buildAdVariantsPrompt(
  hook: string,
  topic: string,
  platform: Platform,
  audience: string | undefined,
  context: string | undefined,
  locale: Locale
): string {
  const style = adPlatformStyles[platform][locale]
  const platformName = platformNames[platform]

  if (locale === 'ru') {
    return `Ты профессиональный рекламный копирайтер.

Напиши 3 варианта рекламного текста на основе одного хука. Каждый вариант — разный стиль.

Hook:
${hook}

Тема: ${topic}
Площадка: ${platformName}
${audience ? `Целевая аудитория: ${audience}` : ''}
${context ? `Дополнительный контекст: ${context}` : ''}

Требования к каждому варианту:
- Используй hook как первую строку (не изменяй его)
- Текст нативный для ${platformName}: ${style}
- Короткие абзацы, убедительный CTA

Стили вариантов:
1. Emotional — больше эмоций, личное обращение, вовлекающий стиль
2. Rational — логика, факты, конкретная польза, объяснение
3. Provocative — неожиданный заход, контраст, сильный curiosity gap

Верни ТОЛЬКО JSON без пояснений:
{"variants":["Вариант 1 (Emotional) полный текст...","Вариант 2 (Rational) полный текст...","Вариант 3 (Provocative) полный текст..."]}`
  }

  return `You are a professional advertising copywriter.

Write 3 variants of an ad text based on one hook. Each variant has a different style.

Hook:
${hook}

Topic: ${topic}
Platform: ${platformName}
${audience ? `Target audience: ${audience}` : ''}
${context ? `Additional context: ${context}` : ''}

Requirements for each variant:
- Use the hook as the first line (do not change it)
- Text native for ${platformName}: ${style}
- Short paragraphs, compelling CTA

Variant styles:
1. Emotional — more emotion, personal address, engaging style
2. Rational — logic, facts, concrete benefit, explanation
3. Provocative — unexpected angle, contrast, strong curiosity gap

Return ONLY JSON, no explanations:
{"variants":["Variant 1 (Emotional) full text...","Variant 2 (Rational) full text...","Variant 3 (Provocative) full text..."]}`
}

const platformStyles: Record<Platform, { ru: string; en: string }> = {
  youtube: {
    ru: 'Заголовок видео: интригующий, с числами, "я протестировал...", "вот почему...", провокационное утверждение. Читатель должен кликнуть.',
    en: 'Video title style: intriguing, with numbers, "I tested...", "here\'s why...", provocative statement. Reader must click.',
  },
  tiktok: {
    ru: 'Первая фраза ролика: разговорная, "POV:", "Сторитайм:", провокация, неожиданный поворот. Должна остановить скролл за 1 секунду.',
    en: 'First line of a reel: conversational, "POV:", "Storytime:", provocation. Must stop the scroll in 1 second.',
  },
  instagram: {
    ru: 'Первая строка поста: эмоциональная, личная история, риторический вопрос. Должна заставить нажать "читать далее".',
    en: 'First line of a post: emotional, personal story, rhetorical question. Must make reader tap "more".',
  },
  telegram: {
    ru: 'Начало поста в канале: экспертный тон, инсайд, "Разбор:", конкретные данные. Читатель — профессионал, цени его время.',
    en: 'Channel post opener: expert tone, insider info, "Deep dive:", concrete data. Reader is a professional.',
  },
  vk: {
    ru: 'Начало поста ВКонтакте: разговорный, дружеский, с юмором или сарказмом. Как будто пишешь другу.',
    en: 'VK post opener: conversational, friendly, humorous or sarcastic. Like writing to a friend.',
  },
}

const hookApproaches = {
  ru: `ЭМОЦИОНАЛЬНЫЕ ПОДХОДЫ (используй разные, не повторяйся):
1. [Любопытство] — намекни на неочевидный факт или секрет, который мало кто знает
2. [FOMO] — читатель что-то теряет прямо сейчас, не зная этого
3. [Личная история] — от первого лица, конкретный результат или провал
4. [Провокация] — оспорь общепринятое мнение по теме
5. [Цифры] — конкретное число + чёткое обещание ценности
6. [Вопрос] — острый вопрос, от которого читатель не сможет уйти
7. [Быстрый результат] — конкретное изменение за короткое время
8. [Шок] — неожиданное утверждение, которое ломает ожидания
9. [Экспертность] — позиция "я изучил это за тебя"
10. [Сравнение] — ожидания vs реальность, до vs после`,

  en: `EMOTIONAL APPROACHES (use different ones, don't repeat):
1. [Curiosity] — hint at a non-obvious fact or secret few people know
2. [FOMO] — reader is losing something right now without knowing it
3. [Personal story] — first person, specific result or failure
4. [Provocation] — challenge the common opinion on the topic
5. [Numbers] — specific number + clear promise of value
6. [Question] — sharp question the reader can't walk away from
7. [Quick win] — specific change in a short time
8. [Shock] — unexpected statement that breaks expectations
9. [Authority] — "I studied this so you don't have to"
10. [Comparison] — expectations vs reality, before vs after`,
}

export const systemPrompt = `Ты — профессиональный копирайтер, специализирующийся на вирусном контенте для социальных сетей.

ТВОИ HOOK'И ВСЕГДА:
- Звучат как написанные живым человеком, не роботом
- Используют правильные грамматические формы (падежи, согласования, склонения)
- Содержат конкретику: числа, детали, результаты — а не общие слова
- Переформулируют суть темы, а не копируют слова из запроса дословно
- Каждый хук уникален по структуре и эмоции
- Максимум 1-2 предложения

ТЫ НИКОГДА:
- Не подставляешь тему дословно в шаблонную фразу
- Не создаёшь грамматически неверные конструкции типа "о Методы" или "без Успех"
- Не повторяешь одну и ту же структуру в разных хуках`

export function buildUserPrompt(
  topic: string,
  platform: Platform,
  audience: string | undefined,
  locale: Locale,
  _templatePatterns: unknown[], // kept for API compatibility, not used in prompt
  count: number = 10
): string {
  const platformNames: Record<Platform, string> = {
    youtube: 'YouTube',
    tiktok: 'TikTok',
    instagram: 'Instagram',
    telegram: 'Telegram',
    vk: 'VKontakte',
  }

  const style = platformStyles[platform][locale]
  const approaches = hookApproaches[locale]
  const lang = locale === 'ru' ? 'русский' : 'English'
  const platformName = platformNames[platform]

  if (locale === 'ru') {
    return `ЗАДАЧА: Создай ${count} вирусных hook'ов для ${platformName}.

ВХОДНЫЕ ДАННЫЕ:
- Тема: "${topic}"
- Платформа: ${platformName}
- Формат платформы: ${style}
${audience ? `- Целевая аудитория: ${audience}` : ''}
- Язык: ${lang}

ШАГ 1 — АНАЛИЗ (выполни мысленно, не пиши в ответ):
Что реально означает эта тема? Какую проблему решает? Что получит аудитория? Какие конкретные боли, страхи, желания у читателей? Что удивительного или неочевидного можно сказать по этой теме?

ШАГ 2 — ГЕНЕРАЦИЯ HOOK'ОВ:
Напиши ${count} hook'ов, используя разные подходы из списка ниже.
Каждый hook должен отражать суть темы, а не просто вставлять слова темы в шаблон.

${approaches}

ВАЖНО:
- Тема может быть упомянута косвенно или перефразирована — главное, чтобы хук был про смысл темы
- Используй минимум 6 разных подходов из списка
- Проверь грамматику каждого хука перед добавлением в список

Верни ТОЛЬКО JSON массив из ${count} строк:
["Hook 1", "Hook 2", ...]`
  }

  return `TASK: Create ${count} viral hooks for ${platformName}.

INPUT:
- Topic: "${topic}"
- Platform: ${platformName}
- Platform format: ${style}
${audience ? `- Target audience: ${audience}` : ''}
- Language: ${lang}

STEP 1 — ANALYSIS (think internally, don't include in response):
What does this topic really mean? What problem does it solve? What will the audience gain? What specific pains, fears, desires do readers have? What's surprising or non-obvious about this topic?

STEP 2 — GENERATE HOOKS:
Write ${count} hooks using different approaches from the list below.
Each hook must reflect the essence of the topic — not just insert the topic words into a template.

${approaches}

IMPORTANT:
- The topic can be mentioned indirectly or rephrased — the hook should be about the meaning, not the words
- Use at least 6 different approaches from the list
- Check grammar of each hook before including it

Return ONLY a JSON array of ${count} strings:
["Hook 1", "Hook 2", ...]`
}
