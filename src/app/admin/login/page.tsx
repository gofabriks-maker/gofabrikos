'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Loader2, Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword]   = useState('')
  const [show,     setShow]       = useState(false)
  const [loading,  setLoading]    = useState(false)
  const [error,    setError]      = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res  = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Incorrect password'); return }
      router.push('/admin')
      router.refresh()
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-rose-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">GoFabrikos Admin</h1>
          <p className="text-stone-400 text-sm mt-1">Enter your admin password to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-stone-900 rounded-2xl border border-stone-800 p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-400 mb-1.5">Admin Password</label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-stone-800 border border-stone-700 text-white rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:border-rose-500 placeholder-stone-600"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2">
              ❌ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 bg-rose-800 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Verifying…</> : '🔓 Enter Admin Panel'}
          </button>
        </form>

        <p className="text-center text-stone-600 text-xs mt-6">
          GoFabrikos · Prop: Lakshmi Sowjanya Aaki · Guntur, AP
        </p>
      </div>
    </div>
  )
}
