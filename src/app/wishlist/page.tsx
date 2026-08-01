'use client'


import Link from 'next/link'
import { Heart, Trash2, ArrowLeft, Sparkles, ExternalLink } from 'lucide-react'
import { useWishlist } from '@/hooks/useWishlist'

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist, loaded } = useWishlist()

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-stone-400 text-sm">Loading wishlist…</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-stone-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/fabrics" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-rose-600 transition-colors mb-2">
              <ArrowLeft size={14} /> Back to Fabrics
            </Link>
            <h1 className="font-playfair text-3xl font-bold text-stone-800 flex items-center gap-2">
              My Wishlist
              <Heart size={24} className="fill-rose-500 text-rose-500" />
            </h1>
            <p className="text-stone-500 text-sm mt-1">
              {wishlist.length === 0
                ? 'Your wishlist is empty'
                : `${wishlist.length} fabric${wishlist.length > 1 ? 's' : ''} saved`}
            </p>
          </div>
          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-xs text-stone-400 hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <Trash2 size={13} /> Clear all
            </button>
          )}
        </div>

        {/* Empty state */}
        {wishlist.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-5">
              <Heart size={36} className="text-rose-300" />
            </div>
            <h2 className="text-xl font-semibold text-stone-700 mb-2">Nothing saved yet</h2>
            <p className="text-stone-400 text-sm mb-7">
              Tap the ❤️ icon on any fabric to save it here for later.
            </p>
            <Link
              href="/fabrics"
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <Sparkles size={15} /> Explore Fabrics
            </Link>
          </div>
        )}

        {/* Wishlist grid */}
        {wishlist.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {wishlist.map(product => (
                <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden group hover:shadow-md transition-shadow">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={product.image_url || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:bg-red-50 transition-colors"
                      title="Remove from wishlist"
                    >
                      <Heart size={15} className="fill-rose-500 text-rose-500" />
                    </button>
                    <span className="absolute top-2 left-2 bg-stone-800/70 text-white text-[10px] px-2 py-0.5 rounded-full">
                      {product.category}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <Link href={`/fabrics/${product.slug}`}>
                      <h3 className="font-semibold text-stone-800 text-sm leading-snug hover:text-rose-600 transition-colors line-clamp-2 mb-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-rose-600 font-bold text-base mb-4">₹{product.price}<span className="text-stone-400 font-normal text-xs">/metre</span></p>

                    <div className="flex gap-2">
                      <Link
                        href={`/fabrics/${product.slug}`}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                      >
                        <ExternalLink size={13} /> View &amp; Buy
                      </Link>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="px-3 py-2 border border-stone-200 rounded-lg text-xs text-stone-400 hover:border-red-300 hover:text-red-500 transition-colors"
                        title="Remove"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-10 text-center">
              <Link
                href="/fabrics"
                className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-rose-600 transition-colors"
              >
                <Sparkles size={14} /> Continue Exploring Fabrics
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
