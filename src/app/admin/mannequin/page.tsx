'use client'
// ─── ADMIN: DIGITAL MANNEQUIN COMPOSITING & APPROVAL WORKFLOW ────────────────
// GoFabrikos · Prop: Lakshmi Sowjanya Aaki · Guntur, AP
// Route: /admin/mannequin
//
// Phase 1 workflow:
//   1. Admin uploads product photo
//   2. Select mannequin (Adult / Kids) + garment type
//   3. Product photo composited onto mannequin SVG
//   4. Side-by-side comparison: Original vs Generated
//   5. Admin: Approve / Reject / Manual Review
//   6. Quality checklist before approval
//
// Phase 3 will replace Step 3 with AI API call (Replicate / Fal.ai).
// The GarmentImageProcessor abstraction isolates that swap.

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  Upload, CheckCircle, XCircle, AlertTriangle, Eye, RotateCcw,
  ChevronRight, Layers, Image as ImageIcon, Settings, ClipboardList,
  Shield, ZoomIn, Download, Sparkles, Clock, User, Tag
} from 'lucide-react'

import AdultFemaleMannequin, { ADULT_GARMENT_DEFS } from '@/lib/mannequins/AdultFemaleMannequin'
import KidsGirlMannequin, { KIDS_GARMENT_DEFS } from '@/lib/mannequins/KidsGirlMannequin'
import type {
  MannequinType, AdultGarmentType, KidsGarmentType,
  QualityFlag, AdminDecision
} from '@/lib/mannequins/types'

// ── QUALITY CHECKLIST FIELDS ──────────────────────────────────────────────────
const QUALITY_FIELDS: { field: QualityFlag['field']; label: string; critical: boolean }[] = [
  { field: 'color', label: 'Garment colour is accurate', critical: true },
  { field: 'print', label: 'Print / pattern is preserved', critical: true },
  { field: 'embroidery', label: 'Embroidery details are visible', critical: false },
  { field: 'border', label: 'Border design is preserved', critical: true },
  { field: 'pallu', label: 'Pallu (if applicable) is correct', critical: false },
  { field: 'dupatta', label: 'Dupatta is correctly shown', critical: false },
  { field: 'sleeves', label: 'Sleeve design is correct', critical: false },
  { field: 'neckline', label: 'Neckline is correct', critical: false },
  { field: 'invented-detail', label: 'No AI-invented design details', critical: true },
  { field: 'proportions', label: 'Garment proportions look correct', critical: true },
  { field: 'consistency', label: 'Consistent with other products', critical: false },
  { field: 'commercial-quality', label: 'Suitable for e-commerce display', critical: true },
]

// ── MOCK PRODUCT DATA (replace with Supabase query in Phase 2) ───────────────
const MOCK_PRODUCTS = [
  { id: 'PROD-001', sku: 'KAN-SILK-RED-001', name: 'Kanjivaram Pure Silk', category: 'Saree', price: 1200 },
  { id: 'PROD-002', sku: 'CHAN-DIG-MUL-002', name: 'Mull Chanderi Digital Print', category: 'Chudidhar fabric', price: 125 },
  { id: 'PROD-003', sku: 'GEO-EMB-PNK-003', name: 'Georgette Embroidered', category: 'Lehenga fabric', price: 320 },
  { id: 'PROD-004', sku: 'BAN-BRO-GLD-004', name: 'Banarasi Brocade Gold', category: 'Gown fabric', price: 850 },
  { id: 'PROD-005', sku: 'KDS-FRK-BLU-005', name: 'Kids Floral Cotton', category: 'Kids Frock', price: 180 },
]

// ── JOB HISTORY (mock) ───────────────────────────────────────────────────────
type JobStatus = 'pending' | 'review' | 'approved' | 'rejected' | 'manual-review'
interface Job {
  id: string; sku: string; name: string; garment: string; mannequin: string
  status: JobStatus; time: string; by?: string
}
const MOCK_JOBS: Job[] = [
  { id: 'J001', sku: 'KAN-SILK-RED-001', name: 'Kanjivaram Pure Silk', garment: 'Saree', mannequin: 'Adult Female', status: 'approved', time: '2 hrs ago', by: 'Admin' },
  { id: 'J002', sku: 'CHAN-DIG-MUL-002', name: 'Mull Chanderi', garment: 'Chudidhar', mannequin: 'Adult Female', status: 'manual-review', time: '4 hrs ago' },
  { id: 'J003', sku: 'KDS-FRK-BLU-005', name: 'Kids Floral Cotton', garment: 'Party Frock', mannequin: 'Kids Girl', status: 'rejected', time: '1 day ago' },
  { id: 'J004', sku: 'GEO-EMB-PNK-003', name: 'Georgette Embroidered', garment: 'Lehenga', mannequin: 'Adult Female', status: 'review', time: 'just now' },
]

const STATUS_BADGE: Record<JobStatus, { label: string; bg: string; text: string }> = {
  pending: { label: 'Pending', bg: 'bg-gray-100', text: 'text-gray-600' },
  review: { label: 'In Review', bg: 'bg-blue-100', text: 'text-blue-700' },
  approved: { label: 'Approved ✓', bg: 'bg-green-100', text: 'text-green-700' },
  rejected: { label: 'Rejected ✗', bg: 'bg-red-100', text: 'text-red-700' },
  'manual-review': { label: 'Manual Review ⚠', bg: 'bg-amber-100', text: 'text-amber-700' },
}

// ── STEP TYPE ────────────────────────────────────────────────────────────────
type Step = 1 | 2 | 3 | 4

export default function AdminMannequinPage() {
  const [step, setStep] = useState<Step>(1)
  const [selectedProduct, setSelectedProduct] = useState<typeof MOCK_PRODUCTS[0] | null>(null)
  const [mannequinType, setMannequinType] = useState<MannequinType>('adult-female')
  const [adultGarment, setAdultGarment] = useState<AdultGarmentType>('saree')
  const [kidsGarment, setKidsGarment] = useState<KidsGarmentType>('frock')
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [qualityFlags, setQualityFlags] = useState<Record<string, boolean>>({})
  const [decision, setDecision] = useState<AdminDecision | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [activeTab, setActiveTab] = useState<'workflow' | 'history'>('workflow')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const garmentType = mannequinType === 'adult-female' ? adultGarment : kidsGarment
  const garmentLabel = mannequinType === 'adult-female'
    ? ADULT_GARMENT_DEFS[adultGarment]?.label
    : KIDS_GARMENT_DEFS[kidsGarment]?.label

  // Quality check: are all critical fields checked?
  const criticalFields = QUALITY_FIELDS.filter(f => f.critical)
  const criticalPassed = criticalFields.every(f => qualityFlags[f.field] === true)
  const allChecked = QUALITY_FIELDS.every(f => qualityFlags[f.field] !== undefined)
  const anyFailed = QUALITY_FIELDS.some(f => qualityFlags[f.field] === false)
  const criticalFailed = criticalFields.some(f => qualityFlags[f.field] === false)

  const handleFileUpload = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    setUploadedImageUrl(url)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }, [handleFileUpload])

  const resetWorkflow = () => {
    setStep(1)
    setSelectedProduct(null)
    setUploadedImageUrl(null)
    setQualityFlags({})
    setDecision(null)
    setRejectReason('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto px-6 flex items-center justify-between h-14">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#C8102E,#D4AF37)' }}>
              <span className="text-white font-bold text-xs">GF</span>
            </div>
            <span className="font-bold text-gray-800">GoFabrikos Admin</span>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="font-bold text-red-700 flex items-center space-x-1.5">
              <Layers size={15} />
              <span>Digital Mannequin</span>
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/admin/mannequin" className="text-xs text-gray-500 hover:text-gray-700">Job History</Link>
            <Link href="/" className="text-xs text-gray-500 hover:text-gray-700">← Back to Site</Link>
          </div>
        </div>
      </header>

      {/* Phase 1 badge */}
      <div className="bg-blue-50 border-b border-blue-100 px-6 py-2 text-center">
        <span className="text-xs text-blue-700 font-semibold">
          PHASE 1 — Manual Compositing Workflow · AI Auto-Draping available in Phase 3
        </span>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-white rounded-xl p-1 border border-gray-200 w-fit shadow-sm">
          {(['workflow', 'history'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${activeTab === t ? 'bg-red-700 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
              {t === 'workflow' ? '+ New Mannequin Image' : 'Job History'}
            </button>
          ))}
        </div>

        {activeTab === 'history' ? (
          // ── JOB HISTORY TAB ────────────────────────────────────────────────
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-800 flex items-center space-x-2">
                <ClipboardList size={18} className="text-red-700" />
                <span>Mannequin Image Job History</span>
              </h2>
              <span className="text-xs text-gray-400">{MOCK_JOBS.length} jobs</span>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Job ID', 'Product', 'SKU', 'Garment', 'Mannequin', 'Status', 'Time', 'By', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {MOCK_JOBS.map(job => {
                  const badge = STATUS_BADGE[job.status]
                  return (
                    <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{job.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{job.name}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{job.sku}</td>
                      <td className="px-4 py-3 text-gray-600">{job.garment}</td>
                      <td className="px-4 py-3 text-gray-600">{job.mannequin}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 flex items-center space-x-1">
                        <Clock size={11} /><span>{job.time}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{job.by ?? '—'}</td>
                      <td className="px-4 py-3">
                        <button className="text-xs text-red-600 hover:underline font-semibold">View</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

        ) : (
          // ── WORKFLOW TAB ───────────────────────────────────────────────────
          <div className="grid grid-cols-12 gap-6">

            {/* LEFT: Step Navigator */}
            <div className="col-span-3">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sticky top-20">
                <h3 className="font-bold text-gray-700 text-sm mb-4">Workflow Steps</h3>
                <ol className="space-y-3">
                  {[
                    { n: 1, label: 'Select Product', icon: Tag },
                    { n: 2, label: 'Upload Product Photo', icon: Upload },
                    { n: 3, label: 'Configure Mannequin', icon: Settings },
                    { n: 4, label: 'Review & Approve', icon: CheckCircle },
                  ].map(({ n, label, icon: Icon }) => (
                    <li key={n}
                      className={`flex items-center space-x-3 p-2.5 rounded-xl cursor-pointer transition-all ${step === n ? 'bg-red-50 border border-red-200' : step > n ? 'opacity-70' : 'opacity-40'}`}
                      onClick={() => step > n && setStep(n as Step)}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${step === n ? 'bg-red-700 text-white' : step > n ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                        {step > n ? '✓' : n}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-semibold truncate ${step === n ? 'text-red-700' : 'text-gray-600'}`}>{label}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                {selectedProduct && (
                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Selected Product</p>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs font-bold text-gray-800 truncate">{selectedProduct.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{selectedProduct.sku}</p>
                      {uploadedImageUrl && (
                        <div className="mt-2 w-full aspect-square rounded-lg overflow-hidden border border-gray-200">
                          <img src={uploadedImageUrl} alt="product" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <button onClick={resetWorkflow}
                  className="mt-4 w-full py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 flex items-center justify-center space-x-1.5 transition-colors">
                  <RotateCcw size={12} />
                  <span>Reset Workflow</span>
                </button>
              </div>
            </div>

            {/* RIGHT: Step Content */}
            <div className="col-span-9">

              {/* ─── STEP 1: Select Product ─────────────────────────────────── */}
              {step === 1 && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h2 className="font-black text-gray-800 text-lg mb-1">Step 1 — Select Product</h2>
                  <p className="text-gray-500 text-sm mb-5">Choose the product to generate a mannequin image for.</p>

                  <div className="space-y-2">
                    {MOCK_PRODUCTS.map(p => (
                      <button key={p.id}
                        onClick={() => setSelectedProduct(p)}
                        className={`w-full flex items-center space-x-4 p-4 rounded-xl border-2 text-left transition-all hover:border-red-300 ${selectedProduct?.id === p.id ? 'border-red-600 bg-red-50' : 'border-gray-100 bg-gray-50'}`}>
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#FDF0F0' }}>
                          <ImageIcon size={18} className="text-red-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold text-sm truncate ${selectedProduct?.id === p.id ? 'text-red-800' : 'text-gray-800'}`}>{p.name}</p>
                          <p className="text-xs text-gray-400 font-mono">{p.sku} · {p.category}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-black" style={{ color: '#C8102E' }}>₹{p.price}/m</p>
                          {selectedProduct?.id === p.id && (
                            <span className="text-xs text-green-600 font-bold">✓ Selected</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={!selectedProduct}
                    onClick={() => setStep(2)}
                    className="mt-5 px-6 py-3 rounded-xl font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg,#C8102E,#A00020)' }}>
                    Continue → Upload Photo
                  </button>
                </div>
              )}

              {/* ─── STEP 2: Upload Product Photo ───────────────────────────── */}
              {step === 2 && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h2 className="font-black text-gray-800 text-lg mb-1">Step 2 — Upload Product Photo</h2>
                  <p className="text-gray-500 text-sm mb-2">Upload the original product photograph. Original is never overwritten.</p>
                  <div className="flex items-center space-x-2 mb-5 bg-blue-50 rounded-xl p-3 border border-blue-100">
                    <Shield size={14} className="text-blue-600 flex-shrink-0" />
                    <p className="text-xs text-blue-700 font-medium">
                      Original saved to <code className="bg-blue-100 px-1 rounded font-mono">/products/original/{selectedProduct?.sku}-01.jpg</code> · Never overwritten.
                    </p>
                  </div>

                  {/* Upload zone */}
                  <div
                    onDrop={handleDrop}
                    onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${isDragging ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'}`}>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                      onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
                    {uploadedImageUrl ? (
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-40 h-40 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                          <img src={uploadedImageUrl} alt="uploaded" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-green-600 font-bold text-sm">✓ Photo uploaded successfully</p>
                        <button onClick={e => { e.stopPropagation(); setUploadedImageUrl(null) }}
                          className="text-xs text-gray-400 hover:text-red-600 underline">Replace photo</button>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                          <Upload size={28} className="text-gray-400" />
                        </div>
                        <p className="font-bold text-gray-700 mb-1">Drag & drop product photo here</p>
                        <p className="text-sm text-gray-400 mb-3">or click to browse files</p>
                        <p className="text-xs text-gray-300">JPG, PNG, WEBP · Minimum 1000×1200px recommended · 4:5 ratio preferred</p>
                      </>
                    )}
                  </div>

                  {/* Storage path display */}
                  <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100 text-xs font-mono text-gray-500 space-y-1">
                    <p className="font-sans font-bold text-gray-600 text-xs mb-2">File Storage Plan (Cloudinary)</p>
                    <p>📁 /gofabrikos/products/<span className="text-red-600">{selectedProduct?.sku}</span>/original/</p>
                    <p>📁 /gofabrikos/products/<span className="text-red-600">{selectedProduct?.sku}</span>/processed/</p>
                    <p>📁 /gofabrikos/products/<span className="text-red-600">{selectedProduct?.sku}</span>/mannequin/</p>
                    <p>📁 /gofabrikos/products/<span className="text-red-600">{selectedProduct?.sku}</span>/thumbnails/</p>
                  </div>

                  <div className="flex space-x-3 mt-5">
                    <button onClick={() => setStep(1)}
                      className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">← Back</button>
                    <button
                      disabled={!uploadedImageUrl}
                      onClick={() => setStep(3)}
                      className="px-6 py-2.5 rounded-xl font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ background: 'linear-gradient(135deg,#C8102E,#A00020)' }}>
                      Continue → Configure Mannequin
                    </button>
                  </div>
                </div>
              )}

              {/* ─── STEP 3: Configure Mannequin ────────────────────────────── */}
              {step === 3 && (
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h2 className="font-black text-gray-800 text-lg mb-1">Step 3 — Configure & Preview</h2>
                    <p className="text-gray-500 text-sm mb-5">Select mannequin type, garment category, then preview the composite.</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {/* Mannequin type */}
                      <div>
                        <label className="text-xs font-bold text-gray-600 block mb-2 uppercase tracking-wide">Mannequin</label>
                        <div className="grid grid-cols-2 gap-2">
                          {([['adult-female', '👩', 'Adult Female'], ['kids-girl', '👧', 'Kids / Girl']] as const).map(([type, emoji, label]) => (
                            <button key={type}
                              onClick={() => setMannequinType(type)}
                              className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${mannequinType === type ? 'border-red-600 bg-red-50' : 'border-gray-100 hover:border-red-200'}`}>
                              <span className="text-2xl mb-1">{emoji}</span>
                              <span className={`text-xs font-bold ${mannequinType === type ? 'text-red-700' : 'text-gray-600'}`}>{label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Garment type */}
                      <div>
                        <label className="text-xs font-bold text-gray-600 block mb-2 uppercase tracking-wide">Garment Category</label>
                        {mannequinType === 'adult-female' ? (
                          <select
                            value={adultGarment}
                            onChange={e => setAdultGarment(e.target.value as AdultGarmentType)}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 focus:outline-none focus:border-red-400">
                            {Object.entries(ADULT_GARMENT_DEFS).map(([key, def]) => (
                              <option key={key} value={key}>{def.emoji} {def.label}</option>
                            ))}
                          </select>
                        ) : (
                          <select
                            value={kidsGarment}
                            onChange={e => setKidsGarment(e.target.value as KidsGarmentType)}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 focus:outline-none focus:border-red-400">
                            {Object.entries(KIDS_GARMENT_DEFS).map(([key, def]) => (
                              <option key={key} value={key}>{def.emoji} {def.label}</option>
                            ))}
                          </select>
                        )}
                        <p className="text-xs text-gray-400 mt-1.5">
                          Phase 3: AI will auto-detect garment type from photo
                        </p>
                      </div>
                    </div>

                    {/* SIDE-BY-SIDE PREVIEW */}
                    <div className="grid grid-cols-2 gap-6">
                      {/* Original */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Original Product Photo</p>
                          <button className="text-xs text-blue-600 flex items-center space-x-1 hover:underline">
                            <ZoomIn size={11} /><span>Zoom</span>
                          </button>
                        </div>
                        <div className="aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center">
                          {uploadedImageUrl ? (
                            <img src={uploadedImageUrl} alt="Original" className="w-full h-full object-contain" />
                          ) : (
                            <div className="text-center text-gray-400">
                              <ImageIcon size={32} className="mx-auto mb-2" />
                              <p className="text-xs">No photo uploaded</p>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-center text-gray-400 mt-1.5">SOURCE — never modified</p>
                      </div>

                      {/* Mannequin composite */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Mannequin Preview</p>
                          <button className="text-xs text-blue-600 flex items-center space-x-1 hover:underline">
                            <ZoomIn size={11} /><span>Zoom</span>
                          </button>
                        </div>
                        <div className="aspect-[4/5] bg-gray-50 rounded-xl overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center">
                          {mannequinType === 'adult-female' ? (
                            <AdultFemaleMannequin
                              garmentType={adultGarment}
                              productImageUrl={uploadedImageUrl ?? undefined}
                              tintColor="#4A0082"
                            />
                          ) : (
                            <KidsGirlMannequin
                              garmentType={kidsGarment}
                              productImageUrl={uploadedImageUrl ?? undefined}
                              tintColor="#C06090"
                            />
                          )}
                        </div>
                        <p className="text-xs text-center text-gray-400 mt-1.5">
                          GENERATED — <span className="text-amber-600 font-semibold">pending approval</span>
                        </p>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="mt-5 grid grid-cols-4 gap-3 text-xs">
                      {[
                        { label: 'Product ID', value: selectedProduct?.id },
                        { label: 'SKU', value: selectedProduct?.sku },
                        { label: 'Mannequin', value: mannequinType === 'adult-female' ? 'Adult Female · Front' : 'Kids Girl · Front' },
                        { label: 'Garment', value: garmentLabel },
                      ].map(m => (
                        <div key={m.label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                          <p className="font-bold text-gray-400 mb-0.5">{m.label}</p>
                          <p className="font-semibold text-gray-700 truncate">{m.value ?? '—'}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button onClick={() => setStep(2)}
                      className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">← Back</button>
                    <button onClick={() => setStep(4)}
                      className="px-6 py-2.5 rounded-xl font-bold text-white"
                      style={{ background: 'linear-gradient(135deg,#C8102E,#A00020)' }}>
                      Continue → Quality Review
                    </button>
                  </div>
                </div>
              )}

              {/* ─── STEP 4: Quality Review & Approval ──────────────────────── */}
              {step === 4 && (
                <div className="space-y-5">
                  {/* Quality Checklist */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Shield size={18} className="text-red-700" />
                      <h2 className="font-black text-gray-800 text-lg">Step 4 — Quality Control Checklist</h2>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 flex items-start space-x-2">
                      <AlertTriangle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700 font-medium">
                        All <strong>critical items</strong> (marked ★) must pass before approving.
                        If any critical item fails → flag as Manual Review. Never auto-publish a failing image.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {QUALITY_FIELDS.map(f => (
                        <div key={f.field}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all ${qualityFlags[f.field] === true ? 'bg-green-50 border-green-200' : qualityFlags[f.field] === false ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'}`}>
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            {f.critical && <span className="text-amber-500 text-xs flex-shrink-0">★</span>}
                            <span className="text-xs font-semibold text-gray-700 truncate">{f.label}</span>
                          </div>
                          <div className="flex space-x-1.5 flex-shrink-0 ml-2">
                            <button
                              onClick={() => setQualityFlags(prev => ({ ...prev, [f.field]: true }))}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all ${qualityFlags[f.field] === true ? 'bg-green-500 text-white shadow-sm' : 'bg-gray-200 text-gray-400 hover:bg-green-100'}`}
                              title="Pass">✓</button>
                            <button
                              onClick={() => setQualityFlags(prev => ({ ...prev, [f.field]: false }))}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all ${qualityFlags[f.field] === false ? 'bg-red-500 text-white shadow-sm' : 'bg-gray-200 text-gray-400 hover:bg-red-100'}`}
                              title="Fail">✗</button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Running score */}
                    {allChecked && (
                      <div className={`mt-4 rounded-xl p-3 border text-sm font-bold text-center ${criticalFailed ? 'bg-red-50 border-red-200 text-red-700' : criticalPassed && !anyFailed ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                        {criticalFailed
                          ? '⚠ Critical issues found — MANUAL REVIEW REQUIRED before publishing'
                          : criticalPassed && !anyFailed
                            ? '✓ All checks passed — ready to approve'
                            : '⚠ Some non-critical items failed — review before approving'}
                      </div>
                    )}
                  </div>

                  {/* Decision Panel */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h3 className="font-black text-gray-800 mb-4">Admin Decision</h3>

                    {!decision ? (
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          disabled={criticalFailed || !allChecked}
                          onClick={() => setDecision('approve')}
                          className="flex items-center justify-center space-x-2 py-4 rounded-xl font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all"
                          style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)' }}>
                          <CheckCircle size={20} />
                          <span>Approve & Publish</span>
                        </button>
                        <button
                          onClick={() => setDecision('reject')}
                          className="flex items-center justify-center space-x-2 py-4 rounded-xl font-bold text-white hover:opacity-90 transition-all"
                          style={{ background: 'linear-gradient(135deg,#dc2626,#b91c1c)' }}>
                          <XCircle size={20} />
                          <span>Reject</span>
                        </button>
                        <button
                          onClick={() => setDecision('regenerate')}
                          className="flex items-center justify-center space-x-2 py-4 rounded-xl font-bold border-2 border-blue-300 text-blue-700 hover:bg-blue-50 transition-all">
                          <RotateCcw size={18} />
                          <span>Regenerate</span>
                        </button>
                        <button
                          onClick={() => setDecision('manual-review')}
                          className="flex items-center justify-center space-x-2 py-4 rounded-xl font-bold border-2 border-amber-300 text-amber-700 hover:bg-amber-50 transition-all">
                          <AlertTriangle size={18} />
                          <span>Flag: Manual Review</span>
                        </button>
                      </div>
                    ) : (
                      <div className={`rounded-2xl p-6 border-2 text-center ${decision === 'approve' ? 'bg-green-50 border-green-300' : decision === 'reject' ? 'bg-red-50 border-red-300' : decision === 'manual-review' ? 'bg-amber-50 border-amber-300' : 'bg-blue-50 border-blue-300'}`}>
                        <div className="text-4xl mb-3">
                          {decision === 'approve' ? '✅' : decision === 'reject' ? '❌' : decision === 'manual-review' ? '⚠️' : '🔄'}
                        </div>
                        <h3 className={`text-lg font-black mb-1 ${decision === 'approve' ? 'text-green-800' : decision === 'reject' ? 'text-red-800' : decision === 'manual-review' ? 'text-amber-800' : 'text-blue-800'}`}>
                          {decision === 'approve' ? 'Image Approved & Published'
                            : decision === 'reject' ? 'Image Rejected'
                              : decision === 'manual-review' ? 'Flagged for Manual Review'
                                : 'Sent for Regeneration'}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          Product: <strong>{selectedProduct?.name}</strong> · SKU: <code className="font-mono text-xs">{selectedProduct?.sku}</code>
                        </p>
                        <p className="text-xs text-gray-400 mb-4">
                          Mannequin: {mannequinType === 'adult-female' ? 'Adult Female' : 'Kids Girl'} · {garmentLabel} · Front View
                        </p>

                        {decision === 'reject' && (
                          <textarea
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            placeholder="Reason for rejection (required for audit trail)..."
                            className="w-full border border-red-200 rounded-xl p-3 text-sm focus:outline-none focus:border-red-400 mb-3 bg-white"
                            rows={3}
                          />
                        )}

                        {decision === 'approve' && (
                          <div className="text-xs text-gray-500 bg-white rounded-xl p-3 border border-green-200">
                            Saved to: <code className="font-mono">/products/{selectedProduct?.sku}/mannequin/front.webp</code>
                          </div>
                        )}

                        <div className="flex justify-center space-x-3 mt-4">
                          <button onClick={() => setDecision(null)}
                            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                            Change Decision
                          </button>
                          <button onClick={resetWorkflow}
                            className="px-4 py-2 rounded-xl font-bold text-white text-sm"
                            style={{ background: '#C8102E' }}>
                            Next Product →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <button onClick={() => setStep(3)}
                      className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">← Back to Preview</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Phase Roadmap footer */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Digital Mannequin System — Implementation Phases</p>
          <div className="grid grid-cols-4 gap-3">
            {[
              { phase: 'Phase 1', label: 'Manual Compositing', status: 'active', desc: 'SVG mannequin + admin upload + approval workflow' },
              { phase: 'Phase 2', label: 'Views & History', status: 'next', desc: 'Back / 3Q views · approval history · detail shots' },
              { phase: 'Phase 3', label: 'AI Auto-Draping', status: 'planned', desc: 'Replicate / Fal.ai API · batch processing · job queue' },
              { phase: 'Phase 4', label: '360° & Try-On', status: 'future', desc: '360° view · customer mannequin selection · advanced VTO' },
            ].map(p => (
              <div key={p.phase} className={`rounded-xl p-3 border ${p.status === 'active' ? 'bg-red-50 border-red-200' : p.status === 'next' ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100'}`}>
                <div className="flex items-center space-x-2 mb-1.5">
                  <span className={`text-xs font-black ${p.status === 'active' ? 'text-red-700' : p.status === 'next' ? 'text-blue-600' : 'text-gray-400'}`}>{p.phase}</span>
                  {p.status === 'active' && <span className="text-xs bg-red-600 text-white px-1.5 py-0.5 rounded-full font-bold">NOW</span>}
                </div>
                <p className="text-xs font-bold text-gray-700 mb-0.5">{p.label}</p>
                <p className="text-xs text-gray-400">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
