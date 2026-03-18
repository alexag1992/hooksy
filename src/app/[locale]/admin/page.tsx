'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'
import { Coins, Users, Zap, RefreshCw } from 'lucide-react'

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

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()
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

  useEffect(() => {
    if (!loading && !isAdmin) router.push('/')
    if (!loading && isAdmin) load()
  }, [loading, isAdmin, router, load])

  const grantCredits = async () => {
    if (!grantUserId || !grantAmount) return
    setGrantMsg('...')
    const res = await fetch('/api/admin/grant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: grantUserId, amount: Number(grantAmount) }),
    })
    if (res.ok) {
      setGrantMsg(`✓ Выдано ${grantAmount} кредитов`)
      setGrantUserId('')
      setGrantAmount('')
      load()
    } else {
      setGrantMsg('✗ Ошибка')
    }
  }

  if (loading || !isAdmin) return null

  const totalUsers = users.length
  const proUsers = users.filter((u) => u.has_sub).length
  const demoUsers = users.filter((u) => !u.has_sub && !u.is_admin).length

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#F5F5F5]">Админ-панель</h1>
        <button
          onClick={load}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#2A2A2E] text-xs text-[#8A8A8E] hover:text-[#F5F5F5] transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${fetching ? 'animate-spin' : ''}`} />
          Обновить
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-[#2A2A2E] bg-[#141416] p-4 text-center">
          <Users className="h-5 w-5 text-[#00D4FF] mx-auto mb-2" />
          <p className="text-2xl font-bold text-[#F5F5F5]">{totalUsers}</p>
          <p className="text-xs text-[#5A5A5E] mt-0.5">Всего пользователей</p>
        </div>
        <div className="rounded-xl border border-[#2A2A2E] bg-[#141416] p-4 text-center">
          <Zap className="h-5 w-5 text-[#8B5CF6] mx-auto mb-2" />
          <p className="text-2xl font-bold text-[#F5F5F5]">{proUsers}</p>
          <p className="text-xs text-[#5A5A5E] mt-0.5">Pro подписок</p>
        </div>
        <div className="rounded-xl border border-[#2A2A2E] bg-[#141416] p-4 text-center">
          <Coins className="h-5 w-5 text-[#F59E0B] mx-auto mb-2" />
          <p className="text-2xl font-bold text-[#F5F5F5]">{demoUsers}</p>
          <p className="text-xs text-[#5A5A5E] mt-0.5">Демо-пользователей</p>
        </div>
      </div>

      {/* Grant credits */}
      <div className="rounded-xl border border-[#2A2A2E] bg-[#141416] p-5 mb-8">
        <p className="text-sm font-semibold text-[#F5F5F5] mb-3">Выдать кредиты</p>
        <div className="flex gap-2 flex-wrap">
          <input
            value={grantUserId}
            onChange={(e) => setGrantUserId(e.target.value)}
            placeholder="User ID"
            className="flex-1 min-w-0 rounded-lg border border-[#2A2A2E] bg-[#0A0A0B] px-3 py-2 text-xs text-[#F5F5F5] placeholder-[#3A3A3E] focus:border-[#00D4FF] focus:outline-none"
          />
          <input
            value={grantAmount}
            onChange={(e) => setGrantAmount(e.target.value)}
            placeholder="Кол-во кредитов"
            type="number"
            className="w-36 rounded-lg border border-[#2A2A2E] bg-[#0A0A0B] px-3 py-2 text-xs text-[#F5F5F5] placeholder-[#3A3A3E] focus:border-[#00D4FF] focus:outline-none"
          />
          <button
            onClick={grantCredits}
            className="px-4 py-2 rounded-lg text-xs font-medium text-white"
            style={{ background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)' }}
          >
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
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[#5A5A5E]">Загрузка...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[#5A5A5E]">Нет пользователей</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-b border-[#1E1E22] hover:bg-[#1A1A1E] transition-colors">
                    <td className="px-4 py-3 text-[#F5F5F5] max-w-[200px] truncate">{u.email}</td>
                    <td className="px-4 py-3 text-center">
                      {u.is_admin ? (
                        <span className="text-[#8B5CF6]">Admin</span>
                      ) : u.has_sub ? (
                        <span className="text-[#00D4FF]">Pro</span>
                      ) : (
                        <span className="text-[#5A5A5E]">Демо</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-[#8A8A8E]">{u.hooks_used}</td>
                    <td className="px-4 py-3 text-center text-[#8A8A8E]">{u.ads_used}</td>
                    <td className="px-4 py-3 text-center text-[#8A8A8E]">{u.images_used}</td>
                    <td className="px-4 py-3 text-center text-[#F5F5F5] font-medium">{u.credits}</td>
                    <td className="px-4 py-3 text-[#3A3A3E] font-mono text-[10px] max-w-[100px] truncate">
                      <button
                        onClick={() => { navigator.clipboard.writeText(u.id); setGrantUserId(u.id) }}
                        title="Копировать ID"
                        className="hover:text-[#8A8A8E] transition-colors"
                      >
                        {u.id.slice(0, 8)}…
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
