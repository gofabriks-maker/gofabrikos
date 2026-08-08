'use client'
import { useState } from 'react'
import { MessageSquare, Search, Phone, Mail, CheckCircle, Clock, Send, Tag, User, Filter } from 'lucide-react'

type Msg = {
  id: string
  customer: string
  phone: string
  email: string
  city: string
  channel: 'whatsapp' | 'email' | 'website'
  subject: string
  preview: string
  fullMessage: string
  date: string
  time: string
  status: 'unread' | 'open' | 'resolved'
  tag: 'order' | 'product' | 'wholesale' | 'complaint' | 'general'
  thread: { from:'customer'|'admin'; text:string; time:string }[]
}

const MSGS: Msg[] = [
  { id:'1', customer:'Fatima Shaikh',   phone:'9876543210', email:'fatima@email.com', city:'Mumbai',     channel:'whatsapp', subject:'Order GF-2024 — delivery update', preview:'When will my order be shipped? It has been 3 days…', fullMessage:'When will my order be shipped? It has been 3 days since I placed the order. I need it urgently for an event.',          date:'2026-08-05', time:'10:32 AM', status:'open',     tag:'order',     thread:[{from:'customer',text:'When will my order be shipped? It has been 3 days since I placed the order.',time:'10:32 AM'},{from:'admin',text:'Hello Fatima! Your order GF-2024 has been packed and will be dispatched today via Delhivery. Tracking will be shared shortly.',time:'11:15 AM'},{from:'customer',text:'Thank you! Please share tracking ASAP.',time:'11:20 AM'}]},
  { id:'2', customer:'Sanjay Gupta',    phone:'9988776655', email:'sanjay@email.com', city:'Surat',      channel:'email',    subject:'Wholesale inquiry — plain fabrics', preview:'We are looking to place a bulk order for plain cotton…', fullMessage:'We are looking to place a bulk order for plain cotton fabrics. Our monthly requirement is around 1000 metres. Please share your wholesale price list and GST invoice format.',       date:'2026-08-05', time:'9:14 AM',  status:'unread',   tag:'wholesale', thread:[{from:'customer',text:'We are looking to place a bulk order for plain cotton fabrics. Our monthly requirement is around 1000 metres. Please share your wholesale price list.',time:'9:14 AM'}]},
  { id:'3', customer:'Rekha Nair',      phone:'9845001122', email:'rekha@email.com',  city:'Kochi',      channel:'whatsapp', subject:'Color mismatch complaint', preview:'The saree color looks very different from the website photo…', fullMessage:'The saree color looks very different from the website photo. I ordered maroon but received something closer to dark red. I am not happy with this.',                              date:'2026-08-04', time:'3:45 PM',  status:'open',     tag:'complaint', thread:[{from:'customer',text:'The saree color looks different from the website photo. I ordered maroon but received dark red.',time:'3:45 PM'},{from:'admin',text:'Dear Rekha, we sincerely apologize for the inconvenience. We will arrange a free replacement or a refund per your preference. Kindly share a photo of the received fabric.',time:'4:10 PM'}]},
  { id:'4', customer:'Priya Agarwal',   phone:'7890123456', email:'priya@email.com',  city:'Jaipur',     channel:'website',  subject:'Custom yardage available?', preview:'Can I order exactly 2.75 meters of the Kanjivaram fabric?', fullMessage:'Hi, I want to order exactly 2.75 meters of the Kanjivaram fabric listed on your site. Is custom yardage possible? Also, do you do stitching?',                                    date:'2026-08-04', time:'1:20 PM',  status:'resolved', tag:'product',   thread:[{from:'customer',text:'Hi, I want to order exactly 2.75 meters of the Kanjivaram fabric. Is custom yardage possible?',time:'1:20 PM'},{from:'admin',text:'Yes Priya! We allow custom cuts from 0.5m onwards. You can add the quantity in the product page. We do not offer stitching services currently.',time:'1:55 PM'},{from:'customer',text:'Great! Thank you for the quick response.',time:'2:00 PM'}]},
  { id:'5', customer:'Anitha Reddy',    phone:'9123456789', email:'anitha@email.com', city:'Hyderabad',  channel:'whatsapp', subject:'GST invoice needed', preview:'Please send GST invoice for order GF-2018…', fullMessage:'Please send the GST invoice for my order GF-2018. I need it for my business expense claim.',                                                                               date:'2026-08-03', time:'5:00 PM',  status:'resolved', tag:'order',     thread:[{from:'customer',text:'Please send the GST invoice for order GF-2018 to my email.',time:'5:00 PM'},{from:'admin',text:'Hi Anitha! GST invoice GF-INV-00136 has been emailed to you. Please check your inbox.',time:'5:30 PM'}]},
  { id:'6', customer:'Meena Pillai',    phone:'9456789012', email:'meena@email.com',  city:'Coimbatore', channel:'email',    subject:'Bulk order enquiry — silk varieties', preview:'We are looking for 500m/month of silk fabrics. Please share pricing.', fullMessage:'Hi, we are looking to source 500 metres per month of silk varieties — Kanjivaram, Banarasi, and raw silk. Please share your wholesale pricing and GST details.',               date:'2026-08-03', time:'10:00 AM', status:'unread',   tag:'wholesale', thread:[{from:'customer',text:'Looking to source 500m/month of silk varieties. Please share wholesale pricing and GST details.',time:'10:00 AM'}]},
]

const TAG_STYLE: Record<string,string> = {
  order:     'bg-blue-100 text-blue-600',
  product:   'bg-purple-100 text-purple-600',
  wholesale: 'bg-amber-100 text-amber-700',
  complaint: 'bg-red-100 text-red-600',
  general:   'bg-stone-100 text-stone-500',
}
const CH_ICON: Record<string,string> = { whatsapp:'💬', email:'✉️', website:'🌐' }

export default function MessagesPage() {
  const [search, setSearch]     = useState('')
  const [statusF, setStatusF]   = useState('all')
  const [tagF, setTagF]         = useState('all')
  const [selected, setSelected] = useState<Msg|null>(MSGS[0])
  const [reply, setReply]       = useState('')
  const [msgs, setMsgs]         = useState<Msg[]>(MSGS)

  function resolve(id: string) {
    setMsgs(prev => prev.map(m => m.id===id ? {...m, status:'resolved'} : m))
    setSelected(prev => prev?.id===id ? {...prev, status:'resolved'} : prev)
  }
  function reopen(id: string) {
    setMsgs(prev => prev.map(m => m.id===id ? {...m, status:'open'} : m))
    setSelected(prev => prev?.id===id ? {...prev, status:'open'} : prev)
  }
  function markRead(id: string) {
    setMsgs(prev => prev.map(m => m.id===id && m.status==='unread' ? {...m, status:'open'} : m))
  }
  function sendReply() {
    if(!reply.trim()||!selected) return
    const now = new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})
    setMsgs(prev => prev.map(m => m.id===selected.id
      ? {...m, thread:[...m.thread,{from:'admin',text:reply,time:now}], status:'open'}
      : m
    ))
    setSelected(prev => prev ? {...prev, thread:[...prev.thread,{from:'admin',text:reply,time:now}]} : prev)
    setReply('')
  }

  const filtered = msgs.filter(m => {
    const q = search.toLowerCase()
    const match = m.customer.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q)
    const st = statusF === 'all' || m.status === statusF
    const tg = tagF === 'all' || m.tag === tagF
    return match && st && tg
  })

  const unreadCount = msgs.filter(m=>m.status==='unread').length

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-stone-900">Messages</h2>
          {unreadCount > 0 && (
            <span className="bg-rose-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount} new</span>
          )}
        </div>
      </div>

      <div className="flex gap-4 h-[calc(100vh-220px)] min-h-[500px]">
        {/* Left — Thread List */}
        <div className="w-80 shrink-0 flex flex-col gap-3">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"/>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Search messages…"
              className="w-full pl-8 pr-4 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400 bg-white"/>
          </div>
          {/* Filters */}
          <div className="flex gap-1.5">
            {(['all','unread','open','resolved'] as const).map(s=>(
              <button key={s} onClick={()=>setStatusF(s)}
                className={`flex-1 py-1 rounded-lg text-xs font-semibold capitalize transition-colors
                  ${statusF===s?'bg-rose-600 text-white':'bg-white border border-stone-200 text-stone-500 hover:bg-stone-50'}`}>
                {s}
              </button>
            ))}
          </div>
          {/* List */}
          <div className="flex-1 overflow-y-auto space-y-1.5">
            {filtered.map(m => (
              <button key={m.id} onClick={()=>{ setSelected(m); markRead(m.id) }}
                className={`w-full text-left p-3 rounded-xl border transition-all
                  ${selected?.id===m.id?'border-rose-300 bg-rose-50':'border-stone-200 bg-white hover:border-stone-300'}
                  ${m.status==='unread'?'border-l-4 border-l-rose-500':''}`}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span>{CH_ICON[m.channel]}</span>
                    <span className="font-semibold text-sm text-stone-900">{m.customer}</span>
                    {m.status==='unread' && <span className="w-2 h-2 bg-rose-500 rounded-full"/>}
                  </div>
                  <span className="text-xs text-stone-400 shrink-0">{m.time}</span>
                </div>
                <p className="text-xs font-medium text-stone-600 mb-0.5 truncate">{m.subject}</p>
                <p className="text-xs text-stone-400 truncate">{m.preview}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${TAG_STYLE[m.tag]}`}>{m.tag}</span>
                  <span className="text-xs text-stone-400">{m.city}</span>
                </div>
              </button>
            ))}
            {filtered.length===0 && <p className="text-center text-stone-400 text-sm py-8">No messages</p>}
          </div>
        </div>

        {/* Right — Thread View */}
        {selected ? (
          <div className="flex-1 bg-white rounded-xl border border-stone-200 flex flex-col min-w-0">
            {/* Header */}
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600 font-bold">{selected.customer[0]}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-stone-900">{selected.customer}</p>
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${TAG_STYLE[selected.tag]}`}>{selected.tag}</span>
                    <span>{CH_ICON[selected.channel]}</span>
                  </div>
                  <p className="text-xs text-stone-400">{selected.city} · {selected.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a href={`tel:${selected.phone}`} className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100"><Phone size={14}/></a>
                <a href={`mailto:${selected.email}`} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"><Mail size={14}/></a>
                {selected.status !== 'resolved'
                  ? <button onClick={()=>resolve(selected.id)} className="flex items-center gap-1 text-xs font-bold bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg"><CheckCircle size={12}/>Resolve</button>
                  : <button onClick={()=>reopen(selected.id)}  className="text-xs font-semibold text-stone-500 border border-stone-200 px-3 py-1.5 rounded-lg hover:bg-stone-50">Re-open</button>
                }
              </div>
            </div>

            {/* Subject */}
            <div className="px-5 py-2.5 bg-stone-50 border-b border-stone-100">
              <p className="text-sm font-semibold text-stone-700">{selected.subject}</p>
            </div>

            {/* Thread */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {selected.thread.map((t,i)=>(
                <div key={i} className={`flex ${t.from==='admin'?'justify-end':''}`}>
                  <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                    ${t.from==='admin'
                      ? 'bg-rose-600 text-white rounded-tr-sm'
                      : 'bg-stone-100 text-stone-800 rounded-tl-sm'}`}>
                    <p>{t.text}</p>
                    <p className={`text-xs mt-1 ${t.from==='admin'?'text-rose-200':'text-stone-400'}`}>{t.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Box */}
            {selected.status !== 'resolved' && (
              <div className="p-4 border-t border-stone-100">
                <div className="flex gap-2">
                  <textarea value={reply} onChange={e=>setReply(e.target.value)}
                    onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); sendReply() }}}
                    rows={2} placeholder="Type reply… (Enter to send)"
                    className="flex-1 px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400 resize-none"/>
                  <button onClick={sendReply}
                    className="px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl flex items-center justify-center">
                    <Send size={16}/>
                  </button>
                </div>
              </div>
            )}
            {selected.status === 'resolved' && (
              <div className="p-4 border-t border-stone-100 text-center text-sm text-stone-400 flex items-center justify-center gap-2">
                <CheckCircle size={14} className="text-green-500"/>This conversation is resolved
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 bg-white rounded-xl border border-stone-200 flex items-center justify-center text-stone-400">
            <div className="text-center"><MessageSquare size={32} className="mx-auto mb-2 opacity-30"/><p className="text-sm">Select a message to view</p></div>
          </div>
        )}
      </div>
    </div>
  )
}
