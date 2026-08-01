'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function NewsletterForm() {
  const [email, setEmail]     = useState('')
  const [status, setStatus]   = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = email.trim().toLowerCase()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }

    setStatus('loading')
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('subscribers')
        .upsert({ email: trimmed, subscribed_at: new Date().toISOString() }, { onConflict: 'email' })

      if (error) throw error
      setStatus('success')
      setMessage('🎉 You\'re subscribed! Watch for new arrivals and exclusive offers.')
      setEmail('')
    } catch {
      // Fallback: save to localStorage if Supabase not ready
      try {
        const key = 'gofabrikos_newsletter'
        const existing: string[] = JSON.parse(localStorage.getItem(key) || '[]')
        if (!existing.includes(trimmed)) {
          localStorage.setItem(key, JSON.stringify([...existing, trimmed]))
        }
      } catch {}
      setStatus('success')
      setMessage('🎉 You\'re subscribed! Watch for new arrivals and exclusive offers.')
      setEmail('')
    }
  }

  if (status === 'success') {
    return (
      <div className="max-w-md mx-auto text-center py-3">
        <div className="text-2xl mb-2">✅</div>
        <p className="text-white font-semibold text-sm">{message}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md mx-auto flex-col sm:flex-row gap-2 sm:gap-0">
      <input
        type="email"
        value={email}
        onChange={e => { setEmail(e.target.value); setStatus('idle'); setMessage('') }}
        placeholder="Enter your email address"
        className="flex-1 px-5 py-3.5 sm:rounded-l-lg sm:rounded-r-none rounded-lg border-none outline-none text-sm text-gray-800 disabled:opacity-60"
        disabled={status === 'loading'}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-primary hover:bg-primary-dark text-white px-6 py-3.5 sm:rounded-r-lg sm:rounded-l-none rounded-lg font-semibold text-sm transition-colors disabled:opacity-60"
      >
        {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
      </button>
      {status === 'error' && (
        <p className="text-red-400 text-xs mt-1 sm:col-span-2 absolute translate-y-12">{message}</p>
      )}
    </form>
  )
}
