'use client'
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  ArrowLeft, Save, CheckCircle, Package, IndianRupee,
  Tag, Layers, Image, Trash2, AlertTriangle
} from 'lucide-react'

// Mock product data — in production this would be fetched from Supabase using params.id
const MOCK_PRODUCTS: Record<string, any> = {
  '1': { name:'Banarasi Silk Brocade — Red Gold Zari', sku:'GF-SAR-001', category:'Designer Sarees', description:'Exquisite hand-woven Banarasi silk with authentic gold zari brocade work. Perfect for bridal sarees, wedding lehengas and festive occasions. Each piece is individually crafted by master weavers of Varanasi.', fabricType:'Silk', color:'Red Gold', printType:'Woven Jacquard', width:'44', weightGsm:'180', occasion:'Bridal', washCare:'Dry clean only', mrp:'1800', sellingPrice:'1500', costPrice:'900', gstRate:'5%', hsnCode:'5007', minOrderMtr:'1', maxOrderMtr:'20', stock:'42', unit:'meters', allowCustom:true, isFeatured:true, isActive:true, cloudinaryUrl:'https://res.cloudinary.com/gofabrikos/banarasi-silk.jpg', tags:['banarasi silk','bridal fabric','zari work','wedding saree'] },
  '2': { name:'Georgette Floral Digital Print', sku:'GF-KUR-002', category:'Kurti Fabrics', description:'Lightweight georgette fabric with vibrant digital floral print. Ideal for summer kurtis, tops and dress materials. Machine washable and wrinkle-resistant.', fabricType:'Georgette', color:'Blue Multi', printType:'Digital Print', width:'44', weightGsm:'80', occasion:'Casual', washCare:'Machine wash cold', mrp:'550', sellingPrice:'450', costPrice:'280', gstRate:'5%', hsnCode:'5407', minOrderMtr:'1', maxOrderMtr:'', stock:'23', unit:'meters', allowCustom:true, isFeatured:false, isActive:true, cloudinaryUrl:'', tags:['georgette','kurti fabric','floral print','summer'] },
}

const CATEGORIES = ['Designer Sarees','Lehenga Fabrics','Kurti Fabrics','Plain Fabrics','Blouse Fabrics','Dupattas','Lining & Inner','Embroidery Work']
const FABRIC_TYPES = ['Silk','Cotton','Georgette','Chiffon','Velvet','Linen','Rayon','Polyester','Net','Organza','Chanderi','Tussar']
const COLORS = ['Red','Maroon','Pink','Rose Gold','Orange','Yellow','Green','Teal','Blue','Navy','Purple','Lavender','Black','White','Cream','Gold','Silver','Multicolor','Red Gold','Blue Multi','Bottle Green','Baby Pink','Navy Blue']
const PRINT_TYPES = ['Solid','Printed','Embroidered','Woven Jacquard','Digital Print','Block Print','Zari Work','Bandhani','Batik','None']
const OCCASIONS = ['Casual','Wedding','Festive','Office','Party','Bridal','Daily Wear']

export default function EditProductPage() {
  const router  = useRouter()
  const params  = useParams()
  const id      = (params?.id as string) || '1'

  const initial = MOCK_PRODUCTS[id] || MOCK_PRODUCTS['1']
  const [form, setForm]   = useState(initial)
  const [tags, setTags]   = useState<string[]>(initial.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [saved, setSaved] = useState(false)
  const [showDelete, setDelete] = useState(false)

  const f = (k: string, v: any) => setForm((p: any) => ({...p, [k]:v}))

  function addTag() {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) setTags(p=>[...p,t])
    setTagInput('')
  }

  function handleSave(status: 'active'|'draft') {
    f('isActive', status === 'active')
    setSaved(true)
    setTimeout(()=>{ setSaved(false); router.push('/admin/products') }, 1500)
  }

  const margin = form.sellingPrice && form.costPrice
    ? Math.round(((parseFloat(form.sellingPrice)-parseFloat(form.costPrice))/parseFloat(form.sellingPrice))*100)
    : null

  const Field = ({ label, req, children }: { label:string; req?:boolean; children: React.ReactNode }) => (
    <div>
      <label className="block text-xs font-semibold text-stone-500 mb-1.5">
        {label}{req && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )

  const Input = ({ k, placeholder, type='text' }: { k:string; placeholder?:string; type?:string }) => (
    <input type={type} value={form[k]||''} onChange={e=>f(k,e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400 bg-white"/>
  )

  const Select = ({ k, options }: { k:string; options:string[] }) => (
    <select value={form[k]||''} onChange={e=>f(k,e.target.value)}
      className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400 bg-white">
      <option value="">Select…</option>
      {options.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  )

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={()=>router.push('/admin/products')}
            className="p-2 rounded-xl hover:bg-stone-100 text-stone-500">
            <ArrowLeft size={18}/>
          </button>
          <div>
            <h2 className="text-xl font-bold text-stone-900">Edit Product</h2>
            <p className="text-xs text-stone-400 font-mono mt-0.5">{form.sku}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={()=>setDelete(true)}
            className="flex items-center gap-2 border border-red-200 bg-red-50 text-red-600 text-sm px-3 py-2 rounded-xl hover:bg-red-100">
            <Trash2 size={13}/>Delete
          </button>
          <button onClick={()=>handleSave('draft')}
            className="px-4 py-2 rounded-xl text-sm font-semibold border border-stone-200 text-stone-600 hover:bg-stone-50">
            Save as Draft
          </button>
          <button onClick={()=>handleSave('active')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors
              ${saved?'bg-green-600 text-white':'bg-rose-600 hover:bg-rose-700 text-white'}`}>
            {saved?<><CheckCircle size={14}/>Updated!</>:<><Save size={14}/>Update Product</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left — Main Details */}
        <div className="col-span-2 space-y-5">

          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2"><Package size={15}/>Basic Information</h3>
            <Field label="Product Name" req>
              <Input k="name" placeholder="Product name"/>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="SKU / Product Code">
                <Input k="sku" placeholder="e.g. GF-SAR-001"/>
              </Field>
              <Field label="Category" req>
                <Select k="category" options={CATEGORIES}/>
              </Field>
            </div>
            <Field label="Description" req>
              <textarea value={form.description||''} onChange={e=>f('description',e.target.value)}
                rows={4} placeholder="Fabric description…"
                className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400 resize-none"/>
            </Field>
          </div>

          {/* Fabric Attributes */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2"><Layers size={15}/>Fabric Attributes</h3>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Fabric Type" req><Select k="fabricType" options={FABRIC_TYPES}/></Field>
              <Field label="Color" req><Select k="color" options={COLORS}/></Field>
              <Field label="Print / Weave"><Select k="printType" options={PRINT_TYPES}/></Field>
              <Field label="Occasion"><Select k="occasion" options={OCCASIONS}/></Field>
              <Field label="Width (inches)"><Input k="width" placeholder="44"/></Field>
              <Field label="Weight (GSM)"><Input k="weightGsm" placeholder="e.g. 120"/></Field>
            </div>
            <Field label="Wash Care Instructions">
              <Input k="washCare" placeholder="e.g. Dry clean only"/>
            </Field>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2"><IndianRupee size={15}/>Pricing (per metre)</h3>
            <div className="grid grid-cols-3 gap-3">
              <Field label="MRP (₹)"><Input k="mrp" type="number"/></Field>
              <Field label="Selling Price (₹)" req><Input k="sellingPrice" type="number"/></Field>
              <Field label="Cost Price (₹)"><Input k="costPrice" type="number"/></Field>
            </div>
            {margin !== null && (
              <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-xl ${margin>=40?'bg-green-50 text-green-700':margin>=20?'bg-amber-50 text-amber-700':'bg-red-50 text-red-600'}`}>
                <span className="font-bold">Margin: {margin}%</span>
                <span className="text-xs">· Profit: ₹{(parseFloat(form.sellingPrice)-parseFloat(form.costPrice)).toFixed(0)} per metre</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <Field label="GST Rate">
                <select value={form.gstRate||'5%'} onChange={e=>f('gstRate',e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400">
                  <option value="5%">5% — Fabrics (Plain)</option>
                  <option value="12%">12% — Readymade / Stitched</option>
                </select>
              </Field>
              <Field label="HSN Code"><Input k="hsnCode" placeholder="e.g. 5007"/></Field>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
            <h3 className="font-bold text-stone-900 text-sm">Inventory & Order Limits</h3>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Stock (metres)"><Input k="stock" type="number"/></Field>
              <Field label="Min Order (m)"><Input k="minOrderMtr" type="number"/></Field>
              <Field label="Max Order (m)"><Input k="maxOrderMtr" type="number" placeholder="No limit"/></Field>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <button type="button" onClick={()=>f('allowCustom',!form.allowCustom)}
                className={`w-10 h-5 rounded-full transition-colors relative ${form.allowCustom?'bg-rose-600':'bg-stone-200'}`}>
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.allowCustom?'translate-x-5':'translate-x-0.5'}`}/>
              </button>
              <span className="text-sm text-stone-700">Allow custom cuts</span>
            </label>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-3">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2"><Tag size={15}/>Tags & Keywords</h3>
            <div className="flex gap-2">
              <input value={tagInput} onChange={e=>setTagInput(e.target.value)}
                onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); addTag() }}}
                placeholder="Type tag and press Enter…"
                className="flex-1 px-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400"/>
              <button onClick={addTag} className="px-3 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-sm text-stone-600 font-semibold">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map(t=>(
                <span key={t} className="flex items-center gap-1 bg-rose-50 text-rose-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {t}
                  <button onClick={()=>setTags(p=>p.filter(x=>x!==t))} className="hover:text-rose-900">✕</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-5">
          {/* Image */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-3">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2"><Image size={15}/>Product Image</h3>
            {form.cloudinaryUrl && (
              <img src={form.cloudinaryUrl} alt={form.name}
                className="w-full h-40 object-cover rounded-xl border border-stone-200"
                onError={e=>{(e.target as any).style.display='none'}}/>
            )}
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1.5">Cloudinary URL</label>
              <input value={form.cloudinaryUrl||''} onChange={e=>f('cloudinaryUrl',e.target.value)}
                placeholder="https://res.cloudinary.com/…"
                className="w-full px-3 py-2.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-rose-400"/>
            </div>
          </div>

          {/* Visibility */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-3">
            <h3 className="font-bold text-stone-900 text-sm">Visibility</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-stone-800">Active / Listed</p>
                  <p className="text-xs text-stone-400">Visible on website</p>
                </div>
                <button type="button" onClick={()=>f('isActive',!form.isActive)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${form.isActive?'bg-rose-600':'bg-stone-200'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isActive?'translate-x-5':'translate-x-0.5'}`}/>
                </button>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-stone-800">Featured</p>
                  <p className="text-xs text-stone-400">Homepage banners</p>
                </div>
                <button type="button" onClick={()=>f('isFeatured',!form.isFeatured)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${form.isFeatured?'bg-rose-600':'bg-stone-200'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isFeatured?'translate-x-5':'translate-x-0.5'}`}/>
                </button>
              </label>
            </div>
          </div>

          {/* Product Summary */}
          <div className="bg-stone-50 rounded-xl border border-stone-200 p-4 space-y-1.5 text-sm">
            <p className="text-xs font-bold text-stone-400">PRODUCT INFO</p>
            <p className="font-mono text-xs text-rose-600">{form.sku}</p>
            {form.sellingPrice && <p className="font-bold text-rose-600 text-base">₹{parseFloat(form.sellingPrice).toLocaleString('en-IN')}<span className="text-xs font-normal text-stone-400">/m</span></p>}
            {form.mrp && form.sellingPrice && parseFloat(form.mrp) > parseFloat(form.sellingPrice) && (
              <p className="text-xs text-stone-400 line-through">MRP ₹{parseFloat(form.mrp).toLocaleString('en-IN')}</p>
            )}
            {form.stock && <p className="text-xs text-stone-500">Stock: {form.stock}m</p>}
            {form.gstRate && <p className="text-xs text-stone-500">GST: {form.gstRate} · HSN {form.hsnCode}</p>}
          </div>

          {/* Save Buttons */}
          <div className="space-y-2">
            <button onClick={()=>handleSave('active')}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-colors
                ${saved?'bg-green-600 text-white':'bg-rose-600 hover:bg-rose-700 text-white'}`}>
              {saved?<><CheckCircle size={15}/>Updated!</>:<><Save size={15}/>Update Product</>}
            </button>
            <button onClick={()=>handleSave('draft')}
              className="w-full py-2.5 rounded-xl text-sm font-semibold border border-stone-200 text-stone-600 hover:bg-stone-50">
              Save as Draft
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto">
              <AlertTriangle size={24} className="text-red-600"/>
            </div>
            <div>
              <p className="font-bold text-stone-900">Delete Product?</p>
              <p className="text-sm text-stone-500 mt-1">This will permanently remove <span className="font-semibold">{form.name}</span> from your store. This cannot be undone.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>setDelete(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-stone-200 text-stone-600">Cancel</button>
              <button onClick={()=>{ setDelete(false); router.push('/admin/products') }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 text-white">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
