'use client'
import { useState } from 'react'
import { Loader2, CheckCircle2 } from 'lucide-react'

export default function NewsletterForm() {
  const [email,  setEmail]  = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [msg,    setMsg]    = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = email.trim().toLowerCase()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus('error')
      setMsg('Please enter a valid email address.')
      return
    }

    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: trimmed }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        const j = await res.json()
        setStatus('error')
        setMsg(j.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMsg('Network error. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="max-w-md mx-auto text-center py-3 flex items-center justify-center gap-2">
        <CheckCircle2 size={20} className="text-green-400" />
        <p className="text-white font-semibold text-sm">You're subscribed! Expect exclusive offers soon.</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-0">
        <input
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setStatus('idle'); setMsg('') }}
          placeholder="Enter your email address"
          disabled={status === 'loading'}
          className="flex-1 px-5 py-3.5 sm:rounded-l-lg sm:rounded-r-none rounded-lg border-none outline-none text-sm text-gray-800 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-rose-700 hover:bg-rose-800 text-white px-6 py-3.5 sm:rounded-r-lg sm:rounded-l-none rounded-lg font-semibold text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {status === 'loading'
            ? <><Loader2 size={14} className="animate-spin" /> Subscribing…</>
            : 'Subscribe'
          }
        </button>
      </form>
      {status === 'error' && (
        <p className="text-red-400 text-xs mt-2 text-center">{msg}</p>
      )}
    </div>
  )
}
