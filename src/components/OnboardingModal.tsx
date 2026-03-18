'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { ChevronRight, ChevronLeft, Anchor, Zap, FileText, ImageIcon, X } from 'lucide-react'

const STORAGE_KEY = 'hooksy_onboarding_done'

const STEPS = [
  {
    icon: <Anchor size={32} className="text-[#00D4FF]" />,
    tag: 'Добро пожаловать',
    title: 'Это Хукси — твой AI-помощник для рекламы',
    description:
      'За пару минут я проведу тебя по всему пути: от идеи до готового рекламного креатива. Бесплатно — 3 полных цепочки.',
    example: null,
    gradient: 'from-[#00D4FF]/20 to-[#8B5CF6]/20',
  },
  {
    icon: <Zap size={32} className="text-[#00D4FF]" />,
    tag: 'Шаг 1',
    title: 'Генерируй вирусные хуки',
    description:
      'Введи тему контента — и я создам 10 цепляющих первых строк, адаптированных под платформу и аудиторию.',
    example: {
      label: 'Пример хука для YouTube',
      text: '🔥 Я потратил 100 000 ₽ на рекламу и вот что узнал — большинство маркетологов делают это неправильно',
    },
    gradient: 'from-[#00D4FF]/15 to-[#0A0A0B]',
  },
  {
    icon: <FileText size={32} className="text-[#8B5CF6]" />,
    tag: 'Шаг 2',
    title: 'Создавай тексты объявлений',
    description:
      'Кликни на любой хук — и я разверну его в готовый рекламный текст. Или сделаю сразу 3 варианта: эмоциональный, рациональный и провокационный.',
    example: {
      label: '3 варианта на выбор',
      text: '😤 Эмоциональный · 🧠 Рациональный · 🔥 Провокационный',
    },
    gradient: 'from-[#8B5CF6]/15 to-[#0A0A0B]',
  },
  {
    icon: <ImageIcon size={32} className="text-[#8B5CF6]" />,
    tag: 'Шаг 3',
    title: 'Генерируй рекламные изображения',
    description:
      'На основе хука и текста объявления модель NanoBanana 2 создаст готовый визуал. Загрузи референс-фото — и AI встроит тебя в сцену.',
    example: {
      label: 'Модель',
      text: '🎨 NanoBanana 2 (Google Gemini) · 1K / 2K / 4K · 10 форматов',
    },
    gradient: 'from-[#8B5CF6]/15 to-[#0A0A0B]',
  },
]

export function OnboardingModal() {
  const { user, signInWithGoogle } = useAuth()
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    // Show only for non-authenticated users who haven't seen it
    if (!user && typeof window !== 'undefined') {
      const done = localStorage.getItem(STORAGE_KEY)
      if (!done) setVisible(true)
    }
  }, [user])

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  const handleStart = () => {
    dismiss()
    signInWithGoogle()
  }

  if (!visible) return null

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#2A2A2E] bg-[#141416] overflow-hidden shadow-2xl">
        {/* Gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${current.gradient} pointer-events-none`} />

        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute right-4 top-4 z-10 text-[#5A5A5E] hover:text-[#F5F5F5] transition-colors"
        >
          <X size={18} />
        </button>

        {/* Progress dots */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === step ? 20 : 6,
                background: i === step ? '#00D4FF' : '#2A2A2E',
              }}
            />
          ))}
        </div>

        {/* Step counter */}
        <div className="absolute top-4 right-10 text-xs text-[#3A3A3E]">
          {step + 1} / {STEPS.length}
        </div>

        {/* Content — key forces remount + fade-in on step change */}
        <div key={step} className="relative px-5 sm:px-8 pt-14 pb-6 sm:pb-8 animate-fade-slide-up">
          {/* Icon */}
          <div className="mb-5 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1E1E22] border border-[#2A2A2E]">
              {current.icon}
            </div>
          </div>

          {/* Tag */}
          <div className="mb-2 text-center text-xs font-medium text-[#00D4FF] uppercase tracking-widest">
            {current.tag}
          </div>

          {/* Title */}
          <h2 className="mb-3 text-center text-xl font-bold text-[#F5F5F5] leading-snug">
            {current.title}
          </h2>

          {/* Description */}
          <p className="mb-6 text-center text-sm text-[#8A8A8E] leading-relaxed">
            {current.description}
          </p>

          {/* Example */}
          {current.example && (
            <div className="mb-6 rounded-xl border border-[#2A2A2E] bg-[#0A0A0B] p-4">
              <div className="mb-1.5 text-xs text-[#5A5A5E]">{current.example.label}</div>
              <div className="text-sm text-[#F5F5F5] leading-relaxed">{current.example.text}</div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-1 rounded-xl border border-[#2A2A2E] px-4 py-2.5 text-sm text-[#8A8A8E] hover:text-[#F5F5F5] transition-colors"
              >
                <ChevronLeft size={16} />
                Назад
              </button>
            )}

            {!isLast ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)' }}
              >
                Далее
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleStart}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" className="shrink-0">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Попробовать бесплатно
              </button>
            )}
          </div>

          {/* Skip */}
          {step === 0 && (
            <button
              onClick={dismiss}
              className="mt-3 w-full text-center text-xs text-[#5A5A5E] hover:text-[#8A8A8E] transition-colors"
            >
              Пропустить
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
