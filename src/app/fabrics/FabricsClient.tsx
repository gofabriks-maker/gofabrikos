'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Heart, ShoppingBag, Star, SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutList, MessageCircle, Search, Flame, Sparkles } from 'lucide-react'
import type { ProductRow } from '@/types/database'
import { useWishlist } from '@/hooks/useWishlist'

const SORT_OPTIONS = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Top Rated', 'Most Reviewed']
const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: 99999 },
  { label: 'Under ₹150/m', min: 0, max: 150 },
  { label: '₹150 – ₹300/m', min: 150, max: 300 },
  { label: '₹300 – ₹600/m', min: 300, max: 600 },
  { label: 'Above ₹600/m', min: 600, max: 99999 },
]

export default function FabricsClient({ initialProducts }: { initialProducts: ProductRow[] }) {
  const categories  = ['All', ...Array.from(new Set(initialProducts.map(p => p.category)))]
  const fabricTypes = ['All Types', ...Array.from(new Set(initialProducts.map(p => p.fabric_type)))]
  const searchParams = useSearchParams()

  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedType,     setSelectedType]     = useState('All Types')
  const [selectedPrice,    setSelectedPrice]     = useState(0)
  const [sortBy,           setSortBy]            = useState('Newest')
  const [searchQuery,      setSearchQuery]       = useState(() => searchParams.get('q') ?? '')
  const [gridView,         setGridView]          = useState(true)
  const [filterOpen,       setFilterOpen]        = useState(false)
  const { isWishlisted, toggleWishlist } = useWishlist()

  // Sync search box when URL ?q= param changes (e.g. from header search)
  useEffect(() => {
    const q = searchParams.get('q') ?? ''
    setSearchQuery(q)
  }, [searchParams])

  const filtered = useMemo(() => {
    let result = [...initialProducts]
    if (selectedCategory !== 'All')    result = result.filter(p => p.category === selectedCategory)
    if (selectedType !== 'All Types')  result = result.filter(p => p.fabric_type === selectedType)
    const pr = PRICE_RANGES[selectedPrice]
    result = result.filter(p => p.price >= pr.min && p.price <= pr.max)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.fabric_type.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q))
      )
    }
    if (sortBy === 'Price: Low to High')  result.sort((a, b) => a.price - b.price)
    else if (sortBy === 'Price: High to Low') result.sort((a, b) => b.price - a.price)
    else if (sortBy === 'Top Rated')      result.sort((a, b) => b.rating - a.rating)
    else if (sortBy === 'Most Reviewed')  result.sort((a, b) => b.ratings_count - a.ratings_count)
    return result
  }, [initialProducts, selectedCategory, selectedType, selectedPrice, sortBy, searchQuery])

  // toggleWishlist provided by useWishlist hook

  const resetFilters = () => {
    setSelectedCategory('All')
    setSelectedType('All Types')
    setSelectedPrice(0)
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-playfair text-3xl font-bold text-gray-900">All Fabrics</h1>
              <p className="text-sm text-gray-500 mt-1">{filtered.length} fabrics found · Sold per metre · Min 0.5m</p>
            </div>
            {/* Search */}
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2.5 gap-2 w-full sm:w-72">
              <Search size={16} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search fabrics, categories…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder:text-gray-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}>
                  <X size={14} className="text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  selectedCategory === cat
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Filter Sidebar — Desktop */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-20">
              <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-widest">Filters</h3>

              <div className="mb-5">
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Price per Metre</h4>
                {PRICE_RANGES.map((pr, i) => (
                  <label key={i} className="flex items-center gap-2 mb-2 cursor-pointer group">
                    <input type="radio" name="price" checked={selectedPrice === i} onChange={() => setSelectedPrice(i)} className="accent-red-600" />
                    <span className={`text-sm ${selectedPrice === i ? 'text-primary font-medium' : 'text-gray-600'}`}>{pr.label}</span>
                  </label>
                ))}
              </div>

              <div className="mb-5">
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Fabric Type</h4>
                {fabricTypes.map(t => (
                  <label key={t} className="flex items-center gap-2 mb-2 cursor-pointer">
                    <input type="radio" name="type" checked={selectedType === t} onChange={() => setSelectedType(t)} className="accent-red-600" />
                    <span className={`text-sm ${selectedType === t ? 'text-primary font-medium' : 'text-gray-600'}`}>{t}</span>
                  </label>
                ))}
              </div>

              <button onClick={resetFilters} className="w-full text-xs text-gray-500 hover:text-primary border border-gray-200 rounded-lg py-2 transition-colors">
                Reset All Filters
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Sort & View Bar */}
            <div className="flex items-center justify-between mb-4 bg-white rounded-xl border border-gray-200 px-4 py-3">
              <div className="flex items-center gap-2">
                <button
                  className="lg:hidden flex items-center gap-1.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 hover:border-primary hover:text-primary transition-colors"
                  onClick={() => setFilterOpen(true)}
                >
                  <SlidersHorizontal size={14} /> Filters
                </button>
                <span className="text-sm text-gray-500">{filtered.length} products</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-gray-500 hidden sm:inline">Sort:</span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value)}
                      className="text-sm font-medium text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 pr-7 appearance-none bg-white cursor-pointer hover:border-primary transition-colors outline-none"
                    >
                      {SORT_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="hidden sm:flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={() => setGridView(true)} className={`p-1.5 ${gridView ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-50'}`}>
                    <Grid3X3 size={14} />
                  </button>
                  <button onClick={() => setGridView(false)} className={`p-1.5 ${!gridView ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-50'}`}>
                    <LayoutList size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">🔍</p>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No fabrics found</h3>
                <p className="text-gray-500 text-sm">Try adjusting your filters or search term</p>
                <button onClick={resetFilters} className="mt-4 btn-primary">Clear Filters</button>
              </div>
            ) : (
              <div className={gridView ? 'grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4' : 'flex flex-col gap-4'}>
                {filtered.map(product => {
                  const inStock = product.stock_left > 0
                  const badge = product.is_new_arrival ? 'NEW'
                    : product.is_trending ? 'TRENDING'
                    : product.discount > 0 ? `${product.discount}% OFF`
                    : null

                  return gridView ? (
                    <div key={product.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
                      <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {badge && (
                          <span className={`absolute top-2 left-2 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            badge === 'NEW' ? 'bg-emerald-500' :
                            badge === 'TRENDING' ? 'bg-amber-500' : 'bg-primary'
                          }`}>
                            {badge === 'NEW' && <Sparkles size={10} />}
                            {badge === 'TRENDING' && <Flame size={10} />}
                            {badge}
                          </span>
                        )}
                        {!inStock && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-sm font-bold bg-black/70 px-3 py-1 rounded-full">Out of Stock</span>
                          </div>
                        )}
                        <button
                          onClick={() => toggleWishlist({ id: product.id, slug: product.slug, name: product.name, price: product.price, category: product.category, image_url: product.image_url, rating: product.rating ?? undefined })}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center hover:scale-110 transition-transform"
                        >
                          <Heart size={13} className={isWishlisted(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                        </button>
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-gray-400 mb-0.5">{product.category}</p>
                        <Link href={`/fabrics/${product.slug}`}>
                          <h3 className="text-sm font-semibold text-gray-800 hover:text-primary transition-colors leading-tight line-clamp-2 mb-1">{product.name}</h3>
                        </Link>
                        <div className="flex items-center gap-1 mb-2">
                          <Star size={11} className="fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
                          <span className="text-xs text-gray-400">({product.ratings_count})</span>
                        </div>
                        <div className="flex items-baseline gap-1.5 mb-3">
                          <span className="text-base font-bold text-gray-900">
                            ₹{product.price}<span className="text-xs font-normal text-gray-500">/m</span>
                          </span>
                          {product.original_price && (
                            <span className="text-xs text-gray-400 line-through">₹{product.original_price}</span>
                          )}
                          {product.discount > 0 && (
                            <span className="text-xs text-green-600 font-semibold">{product.discount}% off</span>
                          )}
                        </div>
                        <div className="flex gap-1.5">
                          <Link
                            href={`/fabrics/${product.slug}`}
                            className="flex-1 bg-primary text-white text-xs font-semibold py-2 rounded-lg text-center hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                          >
                            <ShoppingBag size={12} /> Add to Cart
                          </Link>
                          <a
                            href={`https://wa.me/918298308314?text=Hi%20GoFabrikos%2C%20I%20want%20to%20order%20${encodeURIComponent(product.name)}%20at%20%E2%82%B9${product.price}%2Fm`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 flex items-center justify-center bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            <MessageCircle size={14} />
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* List view */
                    <div key={product.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex gap-4 p-3">
                      <div className="relative w-28 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                        {badge && (
                          <span className={`absolute top-1.5 left-1.5 text-white text-xs font-bold px-1.5 py-0.5 rounded-full ${
                            badge === 'NEW' ? 'bg-emerald-500' : badge === 'TRENDING' ? 'bg-amber-500' : 'bg-primary'
                          }`}>{badge}</span>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-xs text-gray-400">{product.category} · {product.fabric_type}</p>
                          <Link href={`/fabrics/${product.slug}`}>
                            <h3 className="text-sm font-semibold text-gray-800 hover:text-primary transition-colors mt-0.5">{product.name}</h3>
                          </Link>
                          <div className="flex items-center gap-1 mt-1">
                            <Star size={11} className="fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-semibold">{product.rating}</span>
                            <span className="text-xs text-gray-400">({product.ratings_count} reviews)</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold text-gray-900">₹{product.price}<span className="text-xs font-normal text-gray-500">/m</span></span>
                            {product.original_price && <span className="text-xs text-gray-400 line-through ml-2">₹{product.original_price}</span>}
                          </div>
                          <div className="flex gap-2">
                            <Link href={`/fabrics/${product.slug}`} className="btn-primary !py-1.5 !px-4 !text-xs">View</Link>
                            <a href={`https://wa.me/918298308314?text=Hi%20GoFabrikos%2C%20I%20want%20to%20order%20${encodeURIComponent(product.name)}`} target="_blank" rel="noopener noreferrer" className="w-8 flex items-center justify-center bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                              <MessageCircle size={14} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {filtered.length > 0 && (
              <div className="text-center mt-10">
                <p className="text-sm text-gray-500 mb-4">Showing {filtered.length} of {initialProducts.length} fabrics</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFilterOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-xl p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <button onClick={() => setFilterOpen(false)}><X size={20} /></button>
            </div>
            <div className="mb-5">
              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Category</h4>
              {categories.map(cat => (
                <label key={cat} className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input type="radio" name="mob-cat" checked={selectedCategory === cat} onChange={() => setSelectedCategory(cat)} className="accent-red-600" />
                  <span className={`text-sm ${selectedCategory === cat ? 'text-primary font-medium' : 'text-gray-600'}`}>{cat}</span>
                </label>
              ))}
            </div>
            <div className="mb-5">
              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Price per Metre</h4>
              {PRICE_RANGES.map((pr, i) => (
                <label key={i} className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input type="radio" name="mob-price" checked={selectedPrice === i} onChange={() => setSelectedPrice(i)} className="accent-red-600" />
                  <span className={`text-sm ${selectedPrice === i ? 'text-primary font-medium' : 'text-gray-600'}`}>{pr.label}</span>
                </label>
              ))}
            </div>
            <button onClick={() => setFilterOpen(false)} className="w-full btn-primary mt-4">Apply Filters</button>
            <button onClick={resetFilters} className="w-full text-sm text-gray-500 mt-2 py-2">Reset All</button>
          </div>
        </div>
      )}
    </div>
  )
}
