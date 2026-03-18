'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from '@/i18n/navigation'
import { Coins, Users, Zap, Tag, Plus, ToggleLeft, ToggleRight } from 'lucide-react'

interface UserRow {
  id: string
  email: string
  full_name: string | null
  created_at: string
  is_admin: boolean
  hooks_used: number
  ads_used: number
  images_used: number
  credits: number
  has_sub: boolean
}

interface PromoRow {
  id: string
  code: string
  discount_percent: number
  is_single_use: boolean
  max_uses: number | null
  uses_count: number
  expires_at: string | null
  is_active: boolean
  created_at: string
}

// ─── Users tab ────────────────────────────────────────────────────────────────

function UsersTab() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [fetching, setFetching] = useState(true)
  const [grantUserId, setGrantUserId] = useState('')
  const [grantAmount, setGrantAmount] = useState('')
  const [grantMsg, setGrantMsg] = useState('')

  const load = useCallback(async () => {
    setFetching(true)
    const res = await fetch('/api/admin/users')
    if (res.ok) setUsers(await res.json())
    setFetching(false)
  }, [])

  useEffect(() => { load() }, [load])

  const grantCredits = async () => {
    if (!grantUserId || !grantAmount) return
    setGrantMsg('...')
    const res = await fetch('/api/admin/grant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: grantUserId, amount: Number(grantAmount) }),
    })
    setGrantMsg(res.ok ? `✓ Выдано ${grantAmount} кредитов` : '✗ Ошибка')
    if (res.ok) { setGrantUserId(''); setGrantAmount(''); load() }
  }

  const total = users.length
  const pro = users.filter(u => u.has_sub).length
  const demo = users.filter(u => !u.has_sub && !u.is_admin).length

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <Users className="h-5 w-5 text-[#00D4FF]" />, val: total, label: 'Всего' },
          { icon: <Zap className="h-5 w-5 text-[#8B5CF6]" />, val: pro, label: 'Pro' },
          { icon: <Coins className="h-5 w-5 text-[#F59E0B]" />, val: demo, label: 'Демо' },
        ].map(({ icon, val, label }) => (
          <div key={label} className="rounded-xl border border-[#2A2A2E] bg-[#141416] p-4 text-center">
            <div className="flex justify-center mb-2">{icon}</div>
            <p className="text-2xl font-bold text-[#F5F5F5]">{val}</p>
            <p className="text-xs text-[#5A5A5E] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Grant credits */}
      <div className="rounded-xl border border-[#2A2A2E] bg-[#141416] p-5">
        <p className="text-sm font-semibold text-[#F5F5F5] mb-3">Выдать кредиты</p>
        <div className="flex gap-2 flex-wrap">
          <input value={grantUserId} onChange={e => setGrantUserId(e.target.value)}
            placeholder="User ID" className="flex-1 min-w-0 rounded-lg border border-[#2A2A2E] bg-[#0A0A0B] px-3 py-2 text-xs text-[#F5F5F5] placeholder-[#3A3A3E] focus:border-[#00D4FF] focus:outline-none" />
          <input value={grantAmount} onChange={e => setGrantAmount(e.target.value)}
            placeholder="Кредиты" type="number" className="w-28 rounded-lg border border-[#2A2A2E] bg-[#0A0A0B] px-3 py-2 text-xs text-[#F5F5F5] placeholder-[#3A3A3E] focus:border-[#00D4FF] focus:outline-none" />
          <button onClick={grantCredits} className="px-4 py-2 rounded-lg text-xs font-medium text-white" style={{ background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)' }}>
            Выдать
          </button>
        </div>
        {grantMsg && <p className="text-xs text-[#8A8A8E] mt-2">{grantMsg}</p>}
      </div>

      {/* Users table */}
      <div className="rounded-xl border border-[#2A2A2E] bg-[#141416] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#2A2A2E] text-[#5A5A5E] uppercase tracking-wide">
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-center">Статус</th>
                <th className="px-4 py-3 text-center">Хуки</th>
                <th className="px-4 py-3 text-center">Объявл.</th>
                <th className="px-4 py-3 text-center">Крeat.</th>
                <th className="px-4 py-3 text-center">Кредиты</th>
                <th className="px-4 py-3 text-left">ID</th>
              </tr>
            </thead>
            <tbody>
              {fetching ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-[#5A5A5E]">Загрузка...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-[#5A5A5E]">Нет пользователей</td></tr>
              ) : users.map(u => (
                <tr key={u.id} className="border-b border-[#1E1E22] hover:bg-[#1A1A1E] transition-colors">
                  <td className="px-4 py-3 text-[#F5F5F5] max-w-[200px] truncate">{u.email}</td>
                  <td className="px-4 py-3 text-center">
                    {u.is_admin ? <span className="text-[#8B5CF6]">Admin</span>
                      : u.has_sub ? <span className="text-[#00D4FF]">Pro</span>
                      : <span className="text-[#5A5A5E]">Демо</span>}
                  </td>
                  <td className="px-4 py-3 text-center text-[#8A8A8E]">{u.hooks_used}</td>
                  <td className="px-4 py-3 text-center text-[#8A8A8E]">{u.ads_used}</td>
                  <td className="px-4 py-3 text-center text-[#8A8A8E]">{u.images_used}</td>
                  <td className="px-4 py-3 text-center text-[#F5F5F5] font-medium">{u.credits}</td>
                  <td className="px-4 py-3 text-[#3A3A3E] font-mono text-[10px] max-w-[100px] truncate">
                    <button onClick={() => { navigator.clipboard.writeText(u.id); setGrantUserId(u.id) }}
                      title="Копировать ID" className="hover:text-[#8A8A8E] transition-colors">
                      {u.id.slice(0, 8)}…
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Promo codes tab ──────────────────────────────────────────────────────────

const EXPIRE_OPTIONS = [
  { label: 'Без ограничения', value: null },
  { label: '3 дня', value: 3 },
  { label: '1 неделя', value: 7 },
  { label: '2 недели', value: 14 },
  { label: '1 месяц', value: 30 },
  { label: '3 месяца', value: 90 },
]

function PromoTab() {
  const [promos, setPromos] = useState<PromoRow[]>([])
  const [fetching, setFetching] = useState(true)
  const [msg, setMsg] = useState('')

  // Form state
  const [customCode, setCustomCode] = useState('')
  const [discount, setDiscount] = useState('20')
  const [isSingleUse, setIsSingleUse] = useState(false)
  const [maxUses, setMaxUses] = useState('')
  const [expiresInDays, setExpiresInDays] = useState<number | null>(null)

  const load = useCallback(async () => {
    setFetching(true)
    const res = await fetch('/api/admin/promo')
    if (res.ok) setPromos(await res.json())
    setFetching(false)
  }, [])

  useEffect(() => { load() }, [load])

  const generate = async () => {
    setMsg('...')
    const res = await fetch('/api/admin/promo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: customCode || undefined,
        discountPercent: Number(discount),
        isSingleUse,
        maxUses: maxUses ? Number(maxUses) : null,
        expiresInDays,
      }),
    })
    if (res.ok) {
      const data = await res.json()
      setMsg(`✓ Создан: ${data.code}`)
      setCustomCode('')
      load()
    } else {
      const err = await res.json()
      setMsg(`✗ ${err.error}`)
    }
  }

  const toggle = async (id: string, is_active: boolean) => {
    await fetch('/api/admin/promo', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active: !is_active }),
    })
    load()
  }

  const fmt = (d: string | null) => d ? new Date(d).toLocaleDateString('ru-RU') : '—'

  return (
    <div className="flex flex-col gap-6">
      {/* Generator form */}
      <div className="rounded-xl border border-[#2A2A2E] bg-[#141416] p-5">
        <p className="text-sm font-semibold text-[#F5F5F5] mb-4">Создать промокод</p>
        <div className="flex flex-col gap-3">
          {/* Code + Discount */}
          <div className="flex gap-2 flex-wrap">
            <input value={customCode} onChange={e => setCustomCode(e.target.value.toUpperCase())}
              placeholder="Код (авто если пусто)" maxLength={20}
              className="flex-1 min-w-[140px] rounded-lg border border-[#2A2A2E] bg-[#0A0A0B] px-3 py-2 text-xs font-mono text-[#F5F5F5] placeholder-[#3A3A3E] focus:border-[#00D4FF] focus:outline-none uppercase" />
            <div className="flex items-center gap-1.5 rounded-lg border border-[#2A2A2E] bg-[#0A0A0B] px-3 py-2">
              <input value={discount} onChange={e => setDiscount(e.target.value)} type="number" min="1" max="100"
                className="w-10 bg-transparent text-xs text-[#F5F5F5] focus:outline-none" />
              <span className="text-xs text-[#5A5A5E]">% скидка</span>
            </div>
          </div>

          {/* Type + Max uses */}
          <div className="flex gap-3 flex-wrap items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs text-[#8A8A8E]">Тип:</span>
              <button onClick={() => setIsSingleUse(false)}
                className={`px-3 py-1 rounded-lg text-xs border transition-colors ${!isSingleUse ? 'border-[#00D4FF]/50 bg-[#00D4FF]/10 text-[#00D4FF]' : 'border-[#2A2A2E] text-[#5A5A5E]'}`}>
                Многоразовый
              </button>
              <button onClick={() => setIsSingleUse(true)}
                className={`px-3 py-1 rounded-lg text-xs border transition-colors ${isSingleUse ? 'border-[#8B5CF6]/50 bg-[#8B5CF6]/10 text-[#8B5CF6]' : 'border-[#2A2A2E] text-[#5A5A5E]'}`}>
                Одноразовый
              </button>
            </label>

            {!isSingleUse && (
              <div className="flex items-center gap-1.5 rounded-lg border border-[#2A2A2E] bg-[#0A0A0B] px-3 py-2">
                <input value={maxUses} onChange={e => setMaxUses(e.target.value)} type="number" min="1"
                  placeholder="∞"
                  className="w-14 bg-transparent text-xs text-[#F5F5F5] placeholder-[#3A3A3E] focus:outline-none" />
                <span className="text-xs text-[#5A5A5E]">макс. использований</span>
              </div>
            )}
          </div>

          {/* Expiry */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-[#8A8A8E]">Срок действия:</span>
            {EXPIRE_OPTIONS.map(opt => (
              <button key={String(opt.value)} onClick={() => setExpiresInDays(opt.value)}
                className={`px-2.5 py-1 rounded-lg text-xs border transition-colors ${expiresInDays === opt.value ? 'border-[#00D4FF]/50 bg-[#00D4FF]/10 text-[#00D4FF]' : 'border-[#2A2A2E] text-[#5A5A5E] hover:text-[#8A8A8E]'}`}>
                {opt.label}
              </button>
            ))}
          </div>

          <button onClick={generate}
            className="flex items-center justify-center gap-2 w-full sm:w-auto sm:self-start px-5 py-2.5 rounded-xl text-sm font-medium text-white"
            style={{ background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)' }}>
            <Plus className="h-4 w-4" />
            Сгенерировать промокод
          </button>
          {msg && <p className="text-xs text-[#8A8A8E]">{msg}</p>}
        </div>
      </div>

      {/* Promo list */}
      <div className="rounded-xl border border-[#2A2A2E] bg-[#141416] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#2A2A2E] text-[#5A5A5E] uppercase tracking-wide">
                <th className="px-4 py-3 text-left">Код</th>
                <th className="px-4 py-3 text-center">Скидка</th>
                <th className="px-4 py-3 text-center">Тип</th>
                <th className="px-4 py-3 text-center">Использований</th>
                <th className="px-4 py-3 text-center">Истекает</th>
                <th className="px-4 py-3 text-center">Активен</th>
              </tr>
            </thead>
            <tbody>
              {fetching ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-[#5A5A5E]">Загрузка...</td></tr>
              ) : promos.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-[#5A5A5E]">Промокодов нет</td></tr>
              ) : promos.map(p => {
                const expired = p.expires_at && new Date(p.expires_at) < new Date()
                const limitReached = p.max_uses !== null && p.uses_count >= p.max_uses
                const isOk = p.is_active && !expired && !limitReached
                return (
                  <tr key={p.id} className={`border-b border-[#1E1E22] transition-colors ${isOk ? 'hover:bg-[#1A1A1E]' : 'opacity-50'}`}>
                    <td className="px-4 py-3 font-mono font-bold text-[#F5F5F5]">
                      <button onClick={() => navigator.clipboard.writeText(p.code)} title="Копировать" className="hover:text-[#00D4FF] transition-colors">
                        {p.code}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center text-[#00D4FF] font-semibold">{p.discount_percent}%</td>
                    <td className="px-4 py-3 text-center">
                      {p.is_single_use
                        ? <span className="text-[#8B5CF6]">Одноразовый</span>
                        : <span className="text-[#8A8A8E]">Многоразовый</span>}
                    </td>
                    <td className="px-4 py-3 text-center text-[#8A8A8E]">
                      {p.uses_count}{p.max_uses !== null ? ` / ${p.max_uses}` : ''}
                    </td>
                    <td className="px-4 py-3 text-center text-[#8A8A8E]">{fmt(p.expires_at)}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggle(p.id, p.is_active)} title={p.is_active ? 'Деактивировать' : 'Активировать'}>
                        {p.is_active
                          ? <ToggleRight className="h-5 w-5 text-[#00D4FF] mx-auto" />
                          : <ToggleLeft className="h-5 w-5 text-[#3A3A3E] mx-auto" />}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { loading, isAdmin } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState<'users' | 'promo'>('users')

  useEffect(() => {
    if (!loading && !isAdmin) router.push('/')
  }, [loading, isAdmin, router])

  if (loading || !isAdmin) return null

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#F5F5F5]">Админ-панель</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[#2A2A2E]">
        {[
          { id: 'users' as const, label: 'Пользователи', icon: <Users className="h-4 w-4" /> },
          { id: 'promo' as const, label: 'Промокоды', icon: <Tag className="h-4 w-4" /> },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.id
                ? 'border-[#00D4FF] text-[#00D4FF]'
                : 'border-transparent text-[#5A5A5E] hover:text-[#8A8A8E]'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'users' ? <UsersTab /> : <PromoTab />}
    </div>
  )
}
