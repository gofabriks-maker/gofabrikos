'use client'
import { useEffect, useState, useCallback } from 'react'
import {
  Mail, Phone, MessageCircle, Search, RefreshCw,
  Inbox, CheckCircle2,
} from 'lucide-react'

type Message = {
  id: string
  name: string
  email: string | null
  phone: string | null
  subject: string | null
  message: string
  status: 'unread' | 'read' | 'replied'
  created_at: string
}

const STATUS_COLORS: Record<string, string> = {
  unread:  'bg-rose-100 text-rose-700',
  read:    'bg-gray-100 text-gray-600',
  replied: 'bg-green-100 text-green-700',
}
const STATUS_NEXT: Record<string, string> = {
  unread: 'read',
  read:   'replied',
}
const STATUS_LABEL: Record<string, string> = {
  unread: '📬 Mark as Read',
  read:   '✅ Mark as Replied',
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function AdminContactPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [selected, setSelected] = useState<Message | null>(null)
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [filter,   setFilter]   = useState<'all'|'unread'|'read'|'replied'>('all')
  const [updating, setUpdating] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ filter })
      if (search) params.set('search', search)
      const res = await fetch(`/api/admin/contact?${params}`)
      const j   = await res.json()
      setMessages(j.messages || [])
    } catch {}
    setLoading(false)
  }, [filter, search])

  useEffect(() => { load() }, [load])

  async function updateStatus(msg: Message, newStatus: string) {
    setUpdating(true)
    try {
      await fetch('/api/admin/contact', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ id: msg.id, status: newStatus }),
      })
      await load()
      setSelected(prev => prev?.id === msg.id ? { ...msg, status: newStatus as Message['status'] } : prev)
    } finally {
      setUpdating(false)
    }
  }

  const counts = {
    all:     messages.length,
    unread:  messages.filter(m => m.status === 'unread').length,
    read:    messages.filter(m => m.status === 'read').length,
    replied: messages.filter(m => m.status === 'replied').length,
  }

  const waLink = (msg: Message) =>
    msg.phone
      ? `https://wa.me/91${msg.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
          `Hi ${msg.name}! Thank you for contacting GoFabrikos. Regarding "${msg.subject || 'your message'}", we'd love to help. Please let us know how we can assist. 🙏`
        )}`
      : null

  return (
    <div className="flex h-[calc(100vh-57px)] overflow-hidden bg-gray-50">

      {/* Left panel */}
      <div className="w-full md:w-80 flex-none border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-bold text-gray-900 flex items-center gap-2">
              <Inbox size={18} className="text-rose-600" /> Contact Messages
            </h1>
            <button onClick={load} className="p-1.5 hover:bg-gray-100 rounded-lg">
              <RefreshCw size={14} className={`text-gray-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name, email, phone…"
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {(['all', 'unread', 'read', 'replied'] as const).map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-2.5 py-1 text-xs rounded-full font-semibold transition-colors ${
                  filter === s ? 'bg-stone-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
                {s !== 'all' && counts[s] > 0 && <span className="ml-1">{counts[s]}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Loading…</div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-400 text-sm gap-2">
              <Inbox size={24} /><span>No messages found</span>
            </div>
          ) : messages.map(msg => (
            <button key={msg.id} onClick={() => setSelected(msg)}
              className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                selected?.id === msg.id ? 'bg-rose-50 border-l-2 border-l-rose-500' : ''
              } ${msg.status === 'unread' ? 'bg-white' : 'bg-gray-50/50'}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {msg.status === 'unread' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-none" />}
                    <p className={`text-sm truncate ${msg.status === 'unread' ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                      {msg.name}
                    </p>
                  </div>
                  {msg.subject && <p className="text-xs text-gray-500 truncate">{msg.subject}</p>}
                  <p className="text-xs text-gray-400 truncate mt-0.5">{msg.message}</p>
                </div>
                <div className="flex-none text-right">
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(msg.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </p>
                  <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[msg.status]}`}>
                    {msg.status}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 overflow-y-auto">
        {!selected ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-3">
            <Mail size={40} /><p className="text-sm">Select a message to view</p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto p-6">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[selected.status]}`}>
                  {selected.status.toUpperCase()}
                </span>
                <span className="text-xs text-gray-400">{fmt(selected.created_at)}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {waLink(selected) && (
                  <a href={waLink(selected)!} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-xl">
                    <MessageCircle size={13} /> Reply on WhatsApp
                  </a>
                )}
                {selected.email && (
                  <a href={`mailto:${selected.email}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl">
                    <Mail size={13} /> Reply by Email
                  </a>
                )}
                {selected.status !== 'replied' && STATUS_NEXT[selected.status] && (
                  <button onClick={() => updateStatus(selected, STATUS_NEXT[selected.status])}
                    disabled={updating}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl disabled:opacity-50">
                    <CheckCircle2 size={13} /> {STATUS_LABEL[selected.status]}
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
              <div className="bg-gray-50 border-b border-gray-100 px-5 py-4">
                <h2 className="font-bold text-gray-900 text-lg">{selected.subject || '(No subject)'}</h2>
                <p className="text-sm text-gray-500 mt-0.5">From: <span className="font-medium text-gray-700">{selected.name}</span></p>
              </div>
              <div className="px-5 py-5">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Sender Details</h3>
              <div className="space-y-2">
                {selected.email && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-rose-100 rounded-xl flex items-center justify-center">
                      <Mail size={14} className="text-rose-600" />
                    </div>
                    <a href={`mailto:${selected.email}`} className="text-sm text-gray-700 hover:text-rose-600">{selected.email}</a>
                  </div>
                )}
                {selected.phone && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Phone size={14} className="text-blue-600" />
                    </div>
                    <a href={`tel:+91${selected.phone}`} className="text-sm text-gray-700 hover:text-blue-600">{selected.phone}</a>
                  </div>
                )}
                {!selected.email && !selected.phone && (
                  <p className="text-sm text-gray-400">No contact details provided.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
