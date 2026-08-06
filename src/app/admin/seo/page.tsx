'use client'
import { useState } from 'react'
import { Globe, Search, CheckCircle, Save, Eye, AlertTriangle, TrendingUp, ExternalLink, RefreshCw } from 'lucide-react'

type PageSEO = {
  id: string
  page: string
  path: string
  title: string
  description: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  indexable: boolean
  priority: number
  lastModified: string
}

const PAGES: PageSEO[] = [
  { id:'1', page:'Homepage',         path:'/',                    title:'GoFabrikos — India\'s Finest Fabrics | Designer Sarees, Lehenga & Kurti Fabrics',     description:'Shop premium designer fabrics online — Banarasi silk, Kanjivaram sarees, lehenga fabrics, kurti materials & more. GST invoice on every order. Free shipping above ₹999.',  ogTitle:'GoFabrikos — India\'s Finest Fabrics',       ogDescription:'Premium designer fabrics delivered across India. Banarasi silk, Kanjivaram sarees & more.',  ogImage:'https://res.cloudinary.com/gofabrikos/og-home.jpg',      indexable:true,  priority:1.0, lastModified:'2026-08-01' },
  { id:'2', page:'All Products',     path:'/products',            title:'All Fabrics & Textiles — GoFabrikos',                                                  description:'Browse our complete collection of designer fabrics. Filter by category, fabric type, color and occasion. GST invoice on all orders.',                                       ogTitle:'Shop All Fabrics — GoFabrikos',              ogDescription:'Designer sarees, lehenga fabrics, kurti materials and more.',                                ogImage:'https://res.cloudinary.com/gofabrikos/og-products.jpg',  indexable:true,  priority:0.9, lastModified:'2026-08-01' },
  { id:'3', page:'Designer Sarees',  path:'/category/sarees',     title:'Designer Sarees Online — Banarasi Silk, Kanjivaram | GoFabrikos',                      description:'Buy pure Banarasi silk sarees, Kanjivaram silk sarees, Georgette sarees online. Wholesale & retail. GST invoice on every purchase.',                                       ogTitle:'Designer Sarees — GoFabrikos',               ogDescription:'Pure Banarasi silk, Kanjivaram sarees at wholesale prices.',                                ogImage:'https://res.cloudinary.com/gofabrikos/og-sarees.jpg',    indexable:true,  priority:0.8, lastModified:'2026-08-01' },
  { id:'4', page:'Lehenga Fabrics',  path:'/category/lehenga',    title:'Lehenga Fabric Online — Bridal & Party Lehenga Materials | GoFabrikos',                description:'Shop premium lehenga fabrics for bridal, wedding and party wear. Silk, velvet, net, brocade and more. Free shipping on orders above ₹999.',                               ogTitle:'Lehenga Fabrics — GoFabrikos',               ogDescription:'Premium bridal and party lehenga fabrics with GST invoice.',                                ogImage:'https://res.cloudinary.com/gofabrikos/og-lehenga.jpg',   indexable:true,  priority:0.8, lastModified:'2026-08-01' },
  { id:'5', page:'B2B Wholesale',    path:'/wholesale',           title:'Fabric Wholesale Supplier — B2B Textile Business | GoFabrikos',                        description:'GoFabrikos is a wholesale fabric supplier for boutiques, retailers and distributors across India. Bulk pricing, GST invoicing, reliable supply.',                           ogTitle:'Wholesale Fabrics — GoFabrikos',             ogDescription:'B2B fabric supplier for boutiques and retailers. Bulk pricing available.',                  ogImage:'https://res.cloudinary.com/gofabrikos/og-wholesale.jpg', indexable:true,  priority:0.7, lastModified:'2026-08-01' },
  { id:'6', page:'About Us',         path:'/about',               title:'About GoFabrikos — Our Story | Guntur, Andhra Pradesh',                                description:'Learn about GoFabrikos, founded by Lakshmi Sowjanya Aaki in Guntur, AP. Our mission is to bring India\'s finest fabrics to every doorstep.',                               ogTitle:'About GoFabrikos',                           ogDescription:'Premium fabric brand from Guntur, Andhra Pradesh.',                                        ogImage:'https://res.cloudinary.com/gofabrikos/og-about.jpg',     indexable:true,  priority:0.5, lastModified:'2026-08-01' },
  { id:'7', page:'Admin Panel',      path:'/admin',               title:'Admin — GoFabrikos',                                                                   description:'GoFabrikos Admin Panel',                                                                                                                                                       ogTitle:'Admin — GoFabrikos',                         ogDescription:'',                                                                                         ogImage:'',                                                       indexable:false, priority:0.0, lastModified:'2026-08-01' },
]

export default function SEOPage() {
  const [pages, setPages]   = useState<PageSEO[]>(PAGES)
  const [selected, setSelected] = useState<PageSEO>(PAGES[0])
  const [saved, setSaved]   = useState(false)
  const [preview, setPreview] = useState<'google'|'og'>('google')

  function update(k: keyof PageSEO, v: any) {
    setSelected(prev => ({...prev, [k]:v}))
    setPages(prev => prev.map(p => p.id===selected.id ? {...p,[k]:v} : p))
  }

  function save() {
    setSaved(true)
    setTimeout(()=>setSaved(false), 2000)
  }

  const titleLen = selected.title.length
  const descLen  = selected.description.length
  const titleOk  = titleLen >= 50 && titleLen <= 60
  const descOk   = descLen >= 150 && descLen <= 160

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-900">SEO Management</h2>
          <p className="text-sm text-stone-500">Optimize page titles, descriptions and social previews</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 border border-stone-200 bg-white text-stone-600 text-sm px-3 py-2 rounded-xl hover:bg-stone-50">
            <ExternalLink size={13}/>View Sitemap
          </button>
          <button onClick={save}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors
              ${saved?'bg-green-600 text-white':'bg-rose-600 hover:bg-rose-700 text-white'}`}>
            {saved?<><CheckCircle size={14}/>Saved!</>:<><Save size={14}/>Save Changes</>}
          </button>
        </div>
      </div>

      {/* SEO Score */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:'Indexed Pages',    value: pages.filter(p=>p.indexable).length, color:'text-green-600' },
          { label:'Non-indexed',      value: pages.filter(p=>!p.indexable).length, color:'text-stone-400' },
          { label:'Missing OG Image', value: pages.filter(p=>!p.ogImage&&p.indexable).length, color:'text-amber-600' },
          { label:'Total Pages',      value: pages.length, color:'text-stone-700' },
        ].map(s=>(
          <div key={s.label} className="bg-white rounded-xl border border-stone-200 p-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs font-semibold text-stone-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-5">
        {/* Page List */}
        <div className="w-56 shrink-0 space-y-1.5">
          <p className="text-xs font-bold text-stone-400 px-1">PAGES</p>
          {pages.map(p=>(
            <button key={p.id} onClick={()=>setSelected(p)}
              className={`w-full text-left px-3 py-2.5 rounded-xl border text-sm transition-all
                ${selected.id===p.id?'border-rose-300 bg-rose-50 text-rose-700 font-semibold':'border-transparent text-stone-600 hover:bg-stone-50'}`}>
              <div className="flex items-center justify-between">
                <span>{p.page}</span>
                {!p.indexable && <span className="text-xs text-stone-400">🚫</span>}
                {p.indexable && (!p.title||!p.description) && <span className="text-xs text-amber-500">⚠️</span>}
                {p.indexable && p.title && p.description && <span className="text-xs text-green-500">✓</span>}
              </div>
              <span className="text-xs text-stone-400">{p.path}</span>
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="flex-1 space-y-4">
          {/* Page header */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 flex items-center justify-between">
            <div>
              <p className="font-bold text-stone-900">{selected.page}</p>
              <p className="text-xs text-stone-400 font-mono">{selected.path}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-stone-500">Priority: {selected.priority}</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <button onClick={()=>update('indexable',!selected.indexable)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${selected.indexable?'bg-rose-600':'bg-stone-200'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${selected.indexable?'translate-x-5':'translate-x-0.5'}`}/>
                </button>
                <span className="text-sm text-stone-700">Indexable</span>
              </label>
            </div>
          </div>

          {/* Meta Tags */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2"><Search size={14}/>Meta Tags (Google)</h3>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-stone-500">Page Title</label>
                <span className={`text-xs font-bold ${titleOk?'text-green-600':titleLen>60?'text-red-500':'text-amber-500'}`}>
                  {titleLen}/60 chars {titleOk?'✓':titleLen>60?'too long':'too short'}
                </span>
              </div>
              <input value={selected.title} onChange={e=>update('title',e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400"/>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-stone-500">Meta Description</label>
                <span className={`text-xs font-bold ${descOk?'text-green-600':descLen>160?'text-red-500':'text-amber-500'}`}>
                  {descLen}/160 chars {descOk?'✓':descLen>160?'too long':'too short'}
                </span>
              </div>
              <textarea value={selected.description} onChange={e=>update('description',e.target.value)}
                rows={3} className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400 resize-none"/>
            </div>
          </div>

          {/* OG Tags */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2"><Globe size={14}/>Open Graph (Social Sharing)</h3>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">OG Title</label>
                <input value={selected.ogTitle} onChange={e=>update('ogTitle',e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400"/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">OG Description</label>
                <textarea value={selected.ogDescription} onChange={e=>update('ogDescription',e.target.value)}
                  rows={2} className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400 resize-none"/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">OG Image URL (1200×630)</label>
                <input value={selected.ogImage} onChange={e=>update('ogImage',e.target.value)}
                  placeholder="https://res.cloudinary.com/gofabrikos/…"
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400 font-mono text-xs"/>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2"><Eye size={14}/>Preview</h3>
              <div className="flex gap-1">
                {(['google','og'] as const).map(v=>(
                  <button key={v} onClick={()=>setPreview(v)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${preview===v?'bg-stone-900 text-white':'bg-stone-100 text-stone-500'}`}>
                    {v==='google'?'Google':'Social'}
                  </button>
                ))}
              </div>
            </div>

            {preview === 'google' ? (
              <div className="border border-stone-200 rounded-xl p-4 bg-white space-y-1">
                <p className="text-xs text-green-700">www.gofabrikos.com{selected.path}</p>
                <p className="text-base text-blue-700 hover:underline cursor-pointer leading-tight line-clamp-1">{selected.title || 'Page Title'}</p>
                <p className="text-xs text-stone-500 line-clamp-2">{selected.description || 'Page description will appear here…'}</p>
              </div>
            ) : (
              <div className="border border-stone-200 rounded-xl overflow-hidden max-w-[400px]">
                <div className="bg-stone-200 h-[140px] flex items-center justify-center text-stone-400 text-xs">
                  {selected.ogImage ? (
                    <img src={selected.ogImage} alt="" className="w-full h-full object-cover" onError={e=>{(e.target as any).style.display='none'}}/>
                  ) : '1200×630 OG Image'}
                </div>
                <div className="p-3 bg-stone-50 border-t border-stone-200">
                  <p className="text-xs text-stone-400 uppercase">gofabrikos.com</p>
                  <p className="text-sm font-bold text-stone-800 line-clamp-1 mt-0.5">{selected.ogTitle||selected.title||'OG Title'}</p>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-0.5">{selected.ogDescription||selected.description||'OG Description'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sitemap Settings */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-3">
            <h3 className="font-bold text-stone-900 text-sm">Sitemap & Robots</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">Sitemap Priority</label>
                <select value={selected.priority} onChange={e=>update('priority',parseFloat(e.target.value))}
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400">
                  {[1.0,0.9,0.8,0.7,0.5,0.3,0.0].map(v=><option key={v} value={v}>{v} {v===1.0?'(highest)':v===0.0?'(excluded)':''}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 mb-1.5">Change Frequency</label>
                <select className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400">
                  <option>daily</option>
                  <option>weekly</option>
                  <option>monthly</option>
                  <option>yearly</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
