'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const supabase = createClient()
      const { error } = await supabase.from('subscribers').insert({ email })
      if (error && error.code !== '23505') throw error // 23505 = duplicate, treat as success
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-center justify-center gap-2 text-emerald-400 font-semibold text-sm">
        <span>✅</span> You're subscribed! We'll send you the latest updates.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Enter your email address"
        className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-primary text-sm"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-60 whitespace-nowrap"
      >
        {status === 'loading' ? 'Subscribing…' : '📧 Subscribe'}
      </button>
      {status === 'error' && (
        <p className="text-red-400 text-xs mt-1 text-center w-full">Something went wrong. Please try again.</p>
      )}
    </form>
  )
}
