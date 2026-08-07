'use client'
import { useState, useEffect, useCallback } from 'react'
import {
  Building2, Phone, Mail, MapPin,
  Clock, CheckCircle, XCircle, MessageSquare, Search,
  TrendingUp, Users, RefreshCw, Loader2, X, ChevronRight
} from 'lucide-react'

type EnquiryStatus = 'new' | 'contacted' | 'negotiating' | 'converted' | 'rejected'

interface Enquiry {
  id:             string
  business_name:  string
  contact_name:   string
  mobile:         string
  email:          string | null
  gstin:          string | null
  city:           string | null
  monthly_volume: string | null
  message:        string | null
  status:         EnquiryStatus
  admin_notes:    string | null
  created_at:     string
}

const STATUS_STYLE: Record<string, string> = {
  new:         'bg-blue-100 text-blue-700',
  contacted:   'bg-amber-100 text-amber-700',
  negotiating: 'bg-purple-100 text-purple-700',
  converted:   'bg-green-100 text-green-700',
  rejected:    'bg-red-100 text-red-600',
}

const STATUS_NEXT: Partial<Record<EnquiryStatus, EnquiryStatus>> = {
  new:         'contacted',
  contacted:   'negotiating',
  negotiating: 'converted',
}

const STATUS_FILTERS = ['all', 'new', 'contacted', 'negotiating', 'converted', 'rejected']

// ── Detail Panel ──────────────────────────────────────────────────────────
function EnquiryPanel({ enq, onClose, onUpdate }: {
  enq: Enquiry
  onClose: () => void
  onUpdate: (id: string, status?: EnquiryStatus, notes?: string) => Promise<void>
}) {
  const [notes,    setNotes]    = useState(enq.admin_notes || '')
  const [saving,   setSaving]   = useState(false)
  const [updating, setUpdating] = useState(false)

  const waMsg = `Hi ${enq.contact_name}! Thank you for your B2B inquiry at GoFabrikos. We'd love to discuss your requirements for *${enq.business_name}*. Can we connect for a quick call? 📞`

  async function saveNotes() {
    setSaving(true)
    await onUpdate(enq.id, undefined, notes)
    setSaving(false)
  }

  async function moveStatus(status: EnquiryStatus) {
    setUpdating(true)
    await onUpdate(enq.id, status, undefined)
    setUpdating(false)
  }

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-5 py-4 flex items-center gap-3 z-10">
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-stone-100">
            <ChevronRight size={18} />
          </button>
          <div className="flex-1">
            <p className="font-bold text-stone-900">{enq.business_name}</p>
            <p className="text-xs text-stone-500">{enq.contact_name} · {new Date(enq.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</p>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLE[enq.status]}`}>
            {enq.status}
          </span>
        </div>

        <div className="p-5 space-y-5">

          {/* Contact Info */}
          <div className="bg-stone-50 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-stone-400 mb-2">CONTACT</p>
            <div className="flex items-center gap-2 text-sm text-stone-700">
              <Phone size={13} className="text-stone-400" /> {enq.mobile}
            </div>
            {enq.email && (
              <div className="flex items-center gap-2 text-sm text-stone-700">
                <Mail size={13} className="text-stone-400" /> {enq.email}
              </div>
            )}
            {enq.city && (
              <div className="flex items-center gap-2 text-sm text-stone-700">
                <MapPin size={13} className="text-stone-400" /> {enq.city}
              </div>
            )}
            {enq.gstin && (
              <p className="text-xs text-stone-500 font-mono">GSTIN: {enq.gstin}</p>
            )}
          </div>

          {/* Enquiry Details */}
          <div>
            <p className="text-xs font-semibold text-stone-400 mb-2">ENQUIRY DETAILS</p>
            <div className="bg-stone-50 rounded-xl p-4 space-y-2">
              {enq.monthly_volume && (
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400">Monthly Volume</span>
                  <span className="font-semibold text-stone-800">{enq.monthly_volume}</span>
                </div>
              )}
              {enq.message && (
                <div className="pt-2 border-t border-stone-100">
                  <p className="text-xs text-stone-400 mb-1">Message</p>
                  <p className="text-sm text-stone-700">{enq.message}</p>
                </div>
              )}
            </div>
          </div>

          {/* Admin Notes */}
          <div>
            <p className="text-xs font-semibold text-stone-400 mb-2">ADMIN NOTES</p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add notes about this enquiry…"
              rows={4}
              className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-rose-400"
            />
            <button onClick={saveNotes} disabled={saving}
              className="mt-2 w-full py-2 bg-stone-800 hover:bg-stone-900 text-white text-sm font-semibold rounded-xl disabled:opacity-60 flex items-center justify-center gap-2">
              {saving ? <Loader2 size={13} className="animate-spin" /> : null}
              {saving ? 'Saving…' : 'Save Notes'}
            </button>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            {STATUS_NEXT[enq.status] && (
              <button onClick={() => moveStatus(STATUS_NEXT[enq.status as EnquiryStatus]!)} disabled={updating}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl disabled:opacity-60 flex items-center justify-center gap-2">
                {updating ? <Loader2 size={14} className="animate-spin" /> : null}
                Move to: {STATUS_NEXT[enq.status as EnquiryStatus]?.charAt(0).toUpperCase()}{STATUS_NEXT[enq.status as EnquiryStatus]?.slice(1)}
              </button>
            )}

            <a href={`https://wa.me/91${enq.mobile}?text=${encodeURIComponent(waMsg)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 border border-green-200 rounded-xl text-sm text-green-700 hover:bg-green-50 font-semibold">
              <MessageSquare size={14} /> WhatsApp Customer
            </a>

            {enq.status !== 'rejected' && enq.status !== 'converted' && (
              <button onClick={() => moveStatus('rejected')} disabled={updating}
                className="w-full py-2 border border-red-200 text-red-500 text-sm font-medium rounded-xl hover:bg-red-50">
                Mark Rejected
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function WholesalePage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [statusF,   setStatusF]   = useState('all')
  const [selected,  setSelected]  = useState<Enquiry | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusF !== 'all') params.set('status', statusF)
      if (search) params.set('search', search)
      const res  = await fetch(`/api/admin/wholesale?${params}`)
      const json = await res.json()
      setEnquiries(json.enquiries || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [statusF, search])

  useEffect(() => { load() }, [load])

  async function updateEnquiry(id: string, status?: EnquiryStatus, admin_notes?: string) {
    const body: Record<string, unknown> = { id }
    if (status !== undefined)      body.status      = status
    if (admin_notes !== undefined)  body.admin_notes = admin_notes

    await fetch('/api/admin/wholesale', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    })

    setEnquiries(prev => prev.map(e => e.id === id ? {
      ...e,
      ...(status !== undefined      ? { status }      : {}),
      ...(admin_notes !== undefined ? { admin_notes }  : {}),
    } : e))
    setSelected(prev => prev?.id === id ? {
      ...prev,
      ...(status !== undefined      ? { status }      : {}),
      ...(admin_notes !== undefined ? { admin_notes }  : {}),
    } : prev)
  }

  const stats = {
    total:      enquiries.length,
    new:        enquiries.filter(e => e.status === 'new').length,
    negotiating:enquiries.filter(e => e.status === 'negotiating').length,
    converted:  enquiries.filter(e => e.status === 'converted').length,
  }

  return (
    <>
      {selected && (
        <EnquiryPanel
          enq={selected}
          onClose={() => setSelected(null)}
          onUpdate={updateEnquiry}
        />
      )}

      <div className="p-6 max-w-[1400px] mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900">B2B / Wholesale Enquiries</h2>
            <p className="text-sm text-stone-500">{stats.total} total enquiries</p>
          </div>
          <button onClick={load} className="flex items-center gap-2 border border-stone-200 bg-white text-stone-600 text-sm px-3 py-2 rounded-xl hover:bg-stone-50">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total',       value: stats.total,       icon: Users,       color: 'text-stone-900' },
            { label: 'New',         value: stats.new,         icon: Clock,       color: 'text-blue-600'  },
            { label: 'Negotiating', value: stats.negotiating, icon: TrendingUp,  color: 'text-purple-600'},
            { label: 'Converted',   value: stats.converted,   icon: CheckCircle, color: 'text-green-600' },
          ].map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className="bg-white rounded-xl border border-stone-200 px-4 py-3 text-center">
                <Icon size={16} className={`mx-auto mb-1 ${s.color}`} />
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-stone-400">{s.label}</p>
              </div>
            )
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search business name, contact, mobile…"
              className="w-full pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_FILTERS.map(f => (
              <button key={f} onClick={() => setStatusF(f)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors
                  ${statusF === f ? 'bg-rose-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}>
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-2 text-stone-400">
              <Loader2 size={20} className="animate-spin" /> Loading enquiries…
            </div>
          ) : enquiries.length === 0 ? (
            <div className="text-center py-20 text-stone-400">
              <Building2 size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No enquiries yet</p>
              <p className="text-sm mt-1">B2B enquiries from the wholesale page will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50 text-left text-xs font-semibold text-stone-400">
                    <th className="px-4 py-3">BUSINESS</th>
                    <th className="px-4 py-3">CONTACT</th>
                    <th className="px-4 py-3">CITY</th>
                    <th className="px-4 py-3">VOLUME</th>
                    <th className="px-4 py-3">STATUS</th>
                    <th className="px-4 py-3">DATE</th>
                    <th className="px-4 py-3 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {enquiries.map(enq => (
                    <tr key={enq.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-4 py-3">
                        <button onClick={() => setSelected(enq)}
                          className="font-bold text-sm text-rose-600 hover:underline text-left">{enq.business_name}</button>
                        {enq.gstin && <p className="text-xs text-stone-400 font-mono">{enq.gstin}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-stone-800">{enq.contact_name}</p>
                        <p className="text-xs text-stone-400">{enq.mobile}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-stone-600">{enq.city || '—'}</td>
                      <td className="px-4 py-3 text-sm text-stone-600">{enq.monthly_volume || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLE[enq.status]}`}>
                          {enq.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-stone-500">
                        {new Date(enq.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <a href={`https://wa.me/91${enq.mobile}`} target="_blank" rel="noopener noreferrer"
                            className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors">
                            <MessageSquare size={14} />
                          </a>
                          <button onClick={() => setSelected(enq)}
                            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors">
                            <ChevronRight size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </>
  )
}
