'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Upload, X, Loader2, Download, ZoomIn, Image as ImageIcon } from 'lucide-react'
import { useGenerateImage } from '@/hooks/useGenerateImage'
import type { Locale, GeneratedImage } from '@/types'

// Aspect ratio config: [value, label, widthRatio, heightRatio]
const ASPECT_RATIOS = [
  { value: '1:1',  label: '1:1',  w: 1,  h: 1 },
  { value: '16:9', label: '16:9', w: 16, h: 9 },
  { value: '9:16', label: '9:16', w: 9,  h: 16 },
  { value: '4:3',  label: '4:3',  w: 4,  h: 3 },
  { value: '3:4',  label: '3:4',  w: 3,  h: 4 },
  { value: '4:5',  label: '4:5',  w: 4,  h: 5 },
  { value: '5:4',  label: '5:4',  w: 5,  h: 4 },
  { value: '3:2',  label: '3:2',  w: 3,  h: 2 },
  { value: '2:3',  label: '2:3',  w: 2,  h: 3 },
  { value: '21:9', label: '21:9', w: 21, h: 9 },
]

function AspectIcon({ w, h }: { w: number; h: number }) {
  const maxDim = 18
  const scale = Math.min(maxDim / w, maxDim / h)
  const width = Math.round(w * scale)
  const height = Math.round(h * scale)

  return (
    <span
      className="inline-block border border-current rounded-[1px] shrink-0"
      style={{ width, height, minWidth: width, minHeight: height }}
    />
  )
}

function ImageModal({ image, onClose }: { image: GeneratedImage; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!image.url) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-[90vw] max-h-[90vh] flex flex-col gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 p-1.5 rounded-full bg-[#2A2A2E] text-[#8A8A8E] hover:text-[#F5F5F5] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        <img
          src={image.url}
          alt="Generated creative"
          className="max-w-full max-h-[80vh] rounded-xl object-contain"
        />
        <a
          href={image.url}
          download="creative.png"
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
            bg-[#141416] border border-[#2A2A2E] text-[#8A8A8E]
            hover:border-[#3A3A3E] hover:text-[#F5F5F5]
            transition-all duration-200
          "
        >
          <Download className="h-4 w-4" />
          Скачать оригинал
        </a>
      </div>
    </div>
  )
}

function ImageCard({ image }: { image: GeneratedImage }) {
  const [showModal, setShowModal] = useState(false)

  if (image.status === 'loading') {
    return (
      <div className="relative aspect-square rounded-xl bg-[#1A1A1E] border border-[#2A2A2E] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2A2A2E]/50 to-transparent animate-shimmer" />
        <Loader2 className="h-6 w-6 text-[#00D4FF] animate-spin" />
      </div>
    )
  }

  if (image.status === 'error') {
    return (
      <div className="aspect-square rounded-xl bg-[#1A1A1E] border border-[#EF4444]/30 flex items-center justify-center p-3">
        <p className="text-[#EF4444] text-xs text-center leading-relaxed">{image.errorMsg}</p>
      </div>
    )
  }

  return (
    <>
      <div
        className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group border border-[#2A2A2E] hover:border-[#00D4FF]/40 transition-colors"
        onClick={() => setShowModal(true)}
      >
        <img src={image.url} alt="Generated creative" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      {showModal && <ImageModal image={image} onClose={() => setShowModal(false)} />}
    </>
  )
}

interface CreativeGeneratorProps {
  hook: string
  adText: string
  locale: Locale
}

export function CreativeGenerator({ hook, adText }: CreativeGeneratorProps) {
  const t = useTranslations('creative')
  const { images, generate } = useGenerateImage()

  const [references, setReferences] = useState<string[]>([])
  const [prompt, setPrompt] = useState('')
  const [useContext, setUseContext] = useState(true)
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [resolution, setResolution] = useState<'1K' | '2K' | '4K'>('2K')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const readFile = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }, [])

  const addFiles = useCallback(
    async (files: FileList | File[]) => {
      const arr = Array.from(files).filter((f) => f.type.startsWith('image/'))
      const remaining = 10 - references.length
      const toAdd = arr.slice(0, remaining)
      const base64s = await Promise.all(toAdd.map(readFile))
      setReferences((prev) => [...prev, ...base64s].slice(0, 10))
    },
    [references.length, readFile]
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) addFiles(e.target.files)
      e.target.value = ''
    },
    [addFiles]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (e.dataTransfer.files) addFiles(e.dataTransfer.files)
    },
    [addFiles]
  )

  const removeReference = useCallback((index: number) => {
    setReferences((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleGenerate = useCallback(() => {
    generate({
      hook,
      adText,
      prompt,
      aspectRatio,
      resolution,
      useContext,
      references,
    })
  }, [generate, hook, adText, prompt, aspectRatio, resolution, useContext, references])

  const hasGenerated = images.length > 0
  const canGenerate = (prompt.trim().length > 0 || useContext) && !hasGenerated
  const selectedRatio = ASPECT_RATIOS.find((r) => r.value === aspectRatio) ?? ASPECT_RATIOS[0]

  return (
    <div className="mt-3 rounded-xl border border-[#00D4FF]/20 bg-[#0D0D0F] p-4">
      <div className="flex items-center gap-2 mb-4">
        <ImageIcon className="h-4 w-4 text-[#00D4FF]" />
        <span className="text-sm font-semibold text-[#F5F5F5]">{t('title')}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left: settings */}
        <div className="flex flex-col gap-4 lg:w-64 shrink-0">
          {/* References */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-[#8A8A8E]">{t('references')}</label>

            {references.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {references.map((ref, i) => (
                  <div key={i} className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#2A2A2E] shrink-0">
                    <img src={ref} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeReference(i)}
                      className="absolute top-0 right-0 p-0.5 bg-black/70 text-white hover:bg-black/90 rounded-bl-lg transition-colors"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {references.length < 10 && (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl
                  border border-dashed cursor-pointer
                  transition-all duration-200
                  ${isDragging
                    ? 'border-[#00D4FF] bg-[#00D4FF]/5'
                    : 'border-[#2A2A2E] hover:border-[#3A3A3E] hover:bg-[#141416]'
                  }
                `}
              >
                <Upload className="h-4 w-4 text-[#5A5A5E]" />
                <span className="text-xs text-[#5A5A5E]">{t('uploadBtn')}</span>
                <span className="text-[10px] text-[#3A3A3E]">{t('dropHint')}</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>

          {/* Prompt */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#8A8A8E]">{t('prompt')}</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t('promptPlaceholder')}
              rows={3}
              className="
                w-full rounded-xl px-3 py-2.5
                bg-[#141416] border border-[#2A2A2E]
                text-[#F5F5F5] placeholder-[#5A5A5E]
                text-[13px] leading-relaxed resize-none
                focus:border-[#00D4FF] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.1)] focus:outline-none
                transition-all duration-200
              "
            />
          </div>

          {/* Use context checkbox */}
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={useContext}
              onChange={(e) => setUseContext(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-[#2A2A2E] bg-[#141416] text-[#00D4FF] accent-[#00D4FF] cursor-pointer"
            />
            <span className="text-xs text-[#8A8A8E] leading-relaxed">{t('useContext')}</span>
          </label>

          {/* Aspect Ratio */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#8A8A8E]">{t('aspectRatio')}</label>
            <div className="relative">
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="
                  w-full rounded-xl px-3 py-2.5 pr-8
                  bg-[#141416] border border-[#2A2A2E]
                  text-[#F5F5F5] text-[13px]
                  focus:border-[#00D4FF] focus:outline-none
                  transition-all duration-200 appearance-none cursor-pointer
                "
              >
                {ASPECT_RATIOS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              {/* Custom icon overlay */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-[#5A5A5E]">
                <AspectIcon w={selectedRatio.w} h={selectedRatio.h} />
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#5A5A5E]">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Resolution */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#8A8A8E]">{t('resolution')}</label>
            <div className="flex gap-2">
              {(['1K', '2K', '4K'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setResolution(r)}
                  className={`
                    flex-1 py-2 rounded-xl text-xs font-medium
                    border transition-all duration-200
                    ${resolution === r
                      ? 'border-[#00D4FF]/50 bg-[#00D4FF]/10 text-[#00D4FF]'
                      : 'border-[#2A2A2E] text-[#8A8A8E] hover:border-[#3A3A3E] hover:text-[#F5F5F5]'
                    }
                  `}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="
              flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
              bg-gradient-to-r from-[#00D4FF] to-[#8B5CF6]
              text-white
              hover:opacity-90 active:scale-[0.98]
              transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            <ImageIcon className="h-4 w-4" />
            {t('generate')}
          </button>
        </div>

        {/* Right: results */}
        {images.length > 0 && (
          <div className="flex-1 overflow-y-auto max-h-[500px]">
            <div className="grid grid-cols-2 gap-2">
              {images.map((img) => (
                <ImageCard key={img.id} image={img} />
              ))}
            </div>
          </div>
        )}

        {images.length === 0 && (
          <div className="flex-1 flex items-center justify-center min-h-[120px]">
            <p className="text-xs text-[#3A3A3E] text-center">{t('emptyHint')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
