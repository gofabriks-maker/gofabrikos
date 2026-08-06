'use client'
import { useState } from 'react'
import { Star, CheckCircle, XCircle, Clock, Search, Eye, ThumbsUp, ThumbsDown, MessageSquare, Filter } from 'lucide-react'

type Review = {
  id: string
  customer: string
  city: string
  product: string
  rating: number
  title: string
  body: string
  date: string
  status: 'pending' | 'approved' | 'rejected'
  helpful: number
  orderRef: string
  images: boolean
}

const REVIEWS: Review[] = [
  { id:'1',  customer:'Fatima Shaikh',    city:'Mumbai',     product:'Banarasi Silk Brocade',          rating:5, title:'Absolutely stunning quality!',      body:'The fabric quality is exceptional. The silk is pure and the zari work is beautiful. Highly recommend for bridal lehenga. Will definitely order more.',         date:'2026-08-05', status:'pending',  helpful:0,  orderRef:'GF-2024', images:true },
  { id:'2',  customer:'Rekha Nair',       city:'Kochi',      product:'Georgette Floral Digital Print',  rating:4, title:'Good quality, fast delivery',       body:'Nice fabric for kurtis. Color is exactly as shown in photos. Stitching margin was good. Minor issue with one edge but overall satisfied.',                   date:'2026-08-04', status:'pending',  helpful:0,  orderRef:'GF-2023', images:false },
  { id:'3',  customer:'Kavitha Rao',      city:'Guntur',     product:'Designer Saree - Kanjivaram',     rating:5, title:'Perfect for wedding occasion',      body:'Bought this for my daughter\'s wedding. The silk is pure and the zari is not tarnishing. Received many compliments. Worth every rupee.',                       date:'2026-08-03', status:'approved', helpful:24, orderRef:'GF-2022', images:true },
  { id:'4',  customer:'Priya Sharma',     city:'Delhi',      product:'Velvet Embroidery Kurti Fabric',  rating:3, title:'Okay quality, color slightly off',  body:'The fabric is decent but the color looks slightly different from what is shown online. The purple appeared more blue in person. Quality of velvet is fine.',    date:'2026-08-02', status:'approved', helpful:8,  orderRef:'GF-2021', images:false },
  { id:'5',  customer:'Sunita Verma',     city:'Jaipur',     product:'Chanderi Cotton Blend',          rating:5, title:'Perfect lightweight fabric',        body:'I love this fabric for summer. It is so light and comfortable. The print is crisp and colors are vibrant. Perfect for office kurtis.',                         date:'2026-08-01', status:'approved', helpful:31, orderRef:'GF-2020', images:true },
  { id:'6',  customer:'Meena Pillai',     city:'Coimbatore', product:'Rayon Solid Navy Blue',          rating:2, title:'Poor color fastness',               body:'The color faded badly in first wash. Not happy with this purchase. Expected better quality from GoFabrikos. The fabric itself is fine but dye quality is poor.', date:'2026-07-30', status:'rejected', helpful:3,  orderRef:'GF-2019', images:false },
  { id:'7',  customer:'Lakshmi Devi',     city:'Chennai',    product:'Cotton Muslin White Premium',    rating:4, title:'Great for inner lining',            body:'Very good quality cotton for dupatta and lining work. Soft texture and pure white color. Will buy more for tailoring use.',                                    date:'2026-07-28', status:'approved', helpful:12, orderRef:'GF-2018', images:false },
  { id:'8',  customer:'Anitha Reddy',     city:'Hyderabad',  product:'Banarasi Silk Brocade',          rating:5, title:'Luxury feel, perfect weave',        body:'This saree fabric is absolutely gorgeous. My tailor was amazed by the quality. The brocade pattern is sharp and colors are royal. 10/10.',                     date:'2026-07-25', status:'approved', helpful:18, orderRef:'GF-2017', images:true },
  { id:'9',  customer:'Deepa Krishna',    city:'Bengaluru',  product:'Lehenga Fabric Set',             rating:4, title:'Beautiful bridal set',              body:'Ordered for my niece\'s wedding. The set is stunning — embroidery is detailed and fabric drapes well. Slight delay in shipping but worth the wait.',           date:'2026-07-22', status:'pending',  helpful:0,  orderRef:'GF-2016', images:true },
  { id:'10', customer:'Saritha Nambiar',  city:'Kozhikode',  product:'Kerala Kasavu Saree Fabric',     rating:5, title:'Authentic Kerala cotton quality',   body:'Best kasavu fabric I have ordered online. Traditional gold border is perfect. Will be using this for Onam celebration. Thank you GoFabrikos!',              date:'2026-07-20', status:'approved', helpful:42, orderRef:'GF-2015', images:false },
]

function Stars({ n, size=14 }: { n:number; size?:number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i=>(
        <Star key={i} size={size} className={i<=n?'text-amber-400 fill-amber-400':'text-stone-200 fill-stone-200'}/>
      ))}
    </div>
  )
}

const STATUS_STYLE: Record<string,string> = {
  pending:  'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
}

export default function ReviewsPage() {
  const [tab, setTab]           = useState<'all'|'pending'|'approved'|'rejected'>('all')
  const [search, setSearch]     = useState('')
  const [selected, setSelected] = useState<Review|null>(null)
  const [reviews, setReviews]   = useState<Review[]>(REVIEWS)

  const filtered = reviews.filter(r => {
    const q = search.toLowerCase()
    const match = r.customer.toLowerCase().includes(q) || r.product.toLowerCase().includes(q) || r.title.toLowerCase().includes(q)
    const st = tab === 'all' || r.status === tab
    return match && st
  })

  function approve(id: string) {
    setReviews(prev => prev.map(r => r.id===id ? {...r, status:'approved'} : r))
    setSelected(prev => prev?.id===id ? {...prev, status:'approved'} : prev)
  }
  function reject(id: string) {
    setReviews(prev => prev.map(r => r.id===id ? {...r, status:'rejected'} : r))
    setSelected(prev => prev?.id===id ? {...prev, status:'rejected'} : prev)
  }

  const stats = {
    pending:  reviews.filter(r=>r.status==='pending').length,
    approved: reviews.filter(r=>r.status==='approved').length,
    rejected: reviews.filter(r=>r.status==='rejected').length,
    avgRating:(reviews.filter(r=>r.status==='approved').reduce((s,r)=>s+r.rating,0) /
               reviews.filter(r=>r.status==='approved').length).toFixed(1),
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Reviews & Ratings</h2>
          <p className="text-sm text-stone-500">Moderate customer product reviews</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
          <p className="text-xs font-semibold text-stone-500 mt-0.5">Pending Review</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          <p className="text-xs font-semibold text-stone-500 mt-0.5">Approved</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-2xl font-bold text-red-500">{stats.rejected}</p>
          <p className="text-xs font-semibold text-stone-500 mt-0.5">Rejected</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="flex items-center gap-1.5">
            <p className="text-2xl font-bold text-stone-900">{stats.avgRating}</p>
            <Star size={16} className="text-amber-400 fill-amber-400"/>
          </div>
          <p className="text-xs font-semibold text-stone-500 mt-0.5">Avg Rating</p>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="flex gap-1 bg-stone-100 p-1 rounded-xl">
          {(['all','pending','approved','rejected'] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold capitalize transition-colors
                ${tab===t?'bg-white text-stone-900 shadow-sm':'text-stone-500 hover:text-stone-700'}`}>
              {t}{t!=='all' && ` (${reviews.filter(r=>r.status===t).length})`}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search customer, product, title…"
            className="w-full pl-8 pr-4 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400 bg-white"/>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {filtered.map(r => (
          <div key={r.id} className="bg-white rounded-xl border border-stone-200 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700 font-bold shrink-0">
                  {r.customer[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-bold text-stone-900 text-sm">{r.customer}</span>
                    <span className="text-xs text-stone-400">{r.city}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[r.status]}`}>{r.status}</span>
                    {r.images && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">📷 Photos</span>}
                  </div>
                  <Stars n={r.rating} size={12}/>
                  <p className="text-sm font-semibold text-stone-800 mt-1.5">{r.title}</p>
                  <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">{r.body}</p>
                  <div className="flex gap-3 mt-2 text-xs text-stone-400">
                    <span>📦 {r.product}</span>
                    <span>🧾 {r.orderRef}</span>
                    <span>📅 {r.date}</span>
                    {r.helpful > 0 && <span>👍 {r.helpful} helpful</span>}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <button onClick={()=>setSelected(r)} className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100"><Eye size={14}/></button>
                {r.status === 'pending' && (
                  <div className="flex gap-1.5">
                    <button onClick={()=>approve(r.id)}
                      className="flex items-center gap-1 text-xs font-bold bg-green-600 hover:bg-green-700 text-white px-2.5 py-1.5 rounded-lg">
                      <CheckCircle size={11}/>Approve
                    </button>
                    <button onClick={()=>reject(r.id)}
                      className="flex items-center gap-1 text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-2.5 py-1.5 rounded-lg">
                      <XCircle size={11}/>Reject
                    </button>
                  </div>
                )}
                {r.status === 'approved' && (
                  <button onClick={()=>reject(r.id)}
                    className="text-xs text-red-500 hover:underline">Reject</button>
                )}
                {r.status === 'rejected' && (
                  <button onClick={()=>approve(r.id)}
                    className="text-xs text-green-600 hover:underline">Re-approve</button>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-stone-200 py-12 text-center text-stone-400 text-sm">No reviews found</div>
        )}
      </div>

      {/* Detail Panel */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end" onClick={()=>setSelected(null)}>
          <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl" onClick={e=>e.stopPropagation()}>
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <p className="font-bold text-stone-900">Review Detail</p>
              <button onClick={()=>setSelected(null)} className="text-stone-400 hover:text-stone-700 text-lg font-bold">✕</button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700 font-bold text-lg">
                  {selected.customer[0]}
                </div>
                <div>
                  <p className="font-bold text-stone-900">{selected.customer}</p>
                  <p className="text-xs text-stone-500">{selected.city} · {selected.orderRef}</p>
                  <Stars n={selected.rating} size={16}/>
                </div>
              </div>

              <div className="bg-stone-50 rounded-xl p-4">
                <p className="font-semibold text-stone-800 mb-2">{selected.title}</p>
                <p className="text-sm text-stone-600 leading-relaxed">{selected.body}</p>
              </div>

              <div className="space-y-1.5 text-sm text-stone-600">
                <p><span className="font-semibold">Product:</span> {selected.product}</p>
                <p><span className="font-semibold">Date:</span> {selected.date}</p>
                <p><span className="font-semibold">Helpful votes:</span> {selected.helpful}</p>
                <p><span className="font-semibold">Photos attached:</span> {selected.images ? 'Yes' : 'No'}</p>
              </div>

              {selected.status === 'pending' && (
                <div className="flex gap-2">
                  <button onClick={()=>approve(selected.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold">
                    <CheckCircle size={15}/>Approve
                  </button>
                  <button onClick={()=>reject(selected.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-semibold">
                    <XCircle size={15}/>Reject
                  </button>
                </div>
              )}
              {selected.status === 'approved' && (
                <button onClick={()=>reject(selected.id)}
                  className="w-full py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-semibold">
                  Reject this Review
                </button>
              )}
              {selected.status === 'rejected' && (
                <button onClick={()=>approve(selected.id)}
                  className="w-full py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold">
                  Re-approve this Review
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
