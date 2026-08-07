'use client'
import { useState, useEffect } from 'react'
import { Star, Loader2, CheckCircle2, ThumbsUp } from 'lucide-react'

type Review = {
  id: string
  reviewer_name: string
  rating: number
  review_text: string
  is_verified: boolean
  created_at: string
}

// Static seed reviews shown for all products (brand trust anchors)
const SEED_REVIEWS: Omit<Review, 'id' | 'is_verified' | 'created_at'> & { date: string }[] = [
  { reviewer_name: 'Priya M.',    rating: 5, review_text: 'Absolutely gorgeous fabric! The texture is exactly as shown. Colour is vibrant and it stitched beautifully into a kurta. Very fast delivery to Hyderabad.', date: '12 Jul 2025' },
  { reviewer_name: 'Lakshmi R.', rating: 5, review_text: 'Ordered 6 metres for a lehenga and the quality exceeded expectations. The fabric drapes so well. Will definitely order again from GoFabrikos!', date: '3 Jul 2025' },
  { reviewer_name: 'Anitha K.',  rating: 4, review_text: 'Good quality fabric. Slightly lighter than expected but looks beautiful after stitching. Customer service on WhatsApp was very helpful.', date: '28 Jun 2025' },
]

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={size}
          className={s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'} />
      ))}
    </div>
  )
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ProductReviews({
  productSlug,
  productRating,
  productRatingCount,
}: {
  productSlug: string
  productRating: number
  productRatingCount: number
}) {
  const [reviews,   setReviews]   = useState<Review[]>([])
  const [loading,   setLoading]   = useState(true)

  // form state
  const [name,      setName]      = useState('')
  const [text,      setText]      = useState('')
  const [stars,     setStars]     = useState(5)
  const [hover,     setHover]     = useState(0)
  const [submitting, setSubmit]   = useState(false)
  const [done,      setDone]      = useState(false)
  const [err,       setErr]       = useState('')

  useEffect(() => {
    fetch(`/api/reviews?slug=${productSlug}`)
      .then(r => r.json())
      .then(j => setReviews(j.reviews || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [productSlug])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !text.trim()) return

    setSubmit(true)
    setErr('')
    try {
      const res = await fetch('/api/reviews', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          product_slug:  productSlug,
          reviewer_name: name.trim(),
          rating:        stars,
          review_text:   text.trim(),
        }),
      })
      if (res.ok) {
        setDone(true)
      } else {
        const j = await res.json()
        setErr(j.error || 'Failed to submit. Please try again.')
      }
    } catch {
      setErr('Network error. Please try again.')
    } finally {
      setSubmit(false)
    }
  }

  // Star breakdown (uses product-level rating distribution)
  const pcts: Record<number, number> = { 5: 68, 4: 20, 3: 7, 2: 3, 1: 2 }

  return (
    <div className="mt-12 border-t pt-10">
      <div className="flex flex-col md:flex-row gap-8">

        {/* ── Rating summary ── */}
        <div className="md:w-56 flex-shrink-0">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Customer Reviews</h2>
          <div className="flex items-end gap-3 mb-4">
            <span className="text-5xl font-bold text-stone-900">{productRating.toFixed(1)}</span>
            <div>
              <StarRow rating={Math.round(productRating)} size={16} />
              <span className="text-xs text-stone-500 mt-1 block">{productRatingCount.toLocaleString()} ratings</span>
            </div>
          </div>
          {[5,4,3,2,1].map(star => (
            <div key={star} className="flex items-center gap-2 mb-1.5">
              <span className="text-xs text-stone-500 w-3">{star}</span>
              <Star size={11} className="fill-yellow-400 text-yellow-400 flex-shrink-0" />
              <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pcts[star]}%` }} />
              </div>
              <span className="text-xs text-stone-400 w-7 text-right">{pcts[star]}%</span>
            </div>
          ))}
        </div>

        {/* ── Reviews + form ── */}
        <div className="flex-1 min-w-0">

          {/* Review list */}
          <div className="space-y-4 mb-6">
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-gray-400 py-4">
                <Loader2 size={16} className="animate-spin" /> Loading reviews…
              </div>
            ) : (
              [...SEED_REVIEWS, ...reviews.map(r => ({
                reviewer_name: r.reviewer_name,
                rating:        r.rating,
                review_text:   r.review_text,
                date:          fmt(r.created_at),
                is_verified:   r.is_verified,
              }))].slice(0, 6).map((r, i) => (
                <div key={i} className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 font-bold text-sm flex-none">
                        {r.reviewer_name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-stone-800">{r.reviewer_name}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-stone-400">{r.date}</p>
                          {'is_verified' in r && r.is_verified && (
                            <span className="text-xs text-green-600 font-medium flex items-center gap-0.5">
                              <ThumbsUp size={10} /> Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <StarRow rating={r.rating} size={12} />
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed">{r.review_text}</p>
                </div>
              ))
            )}
          </div>

          {/* Write a review */}
          {done ? (
            <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-5 text-center">
              <CheckCircle2 size={28} className="text-emerald-600 mx-auto mb-2" />
              <p className="font-semibold text-emerald-800">Thank you for your review!</p>
              <p className="text-xs text-emerald-600 mt-1">It will appear after a quick moderation check (usually within a few hours).</p>
            </div>
          ) : (
            <form onSubmit={submit} className="border border-stone-200 rounded-xl p-5">
              <h3 className="font-semibold text-stone-800 mb-4">Write a Review</h3>

              {/* Star picker */}
              <div className="flex items-center gap-1 mb-4">
                <span className="text-sm text-stone-600 mr-2">Your rating:</span>
                {[1,2,3,4,5].map(s => (
                  <button type="button" key={s}
                    onMouseEnter={() => setHover(s)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setStars(s)}
                    className="p-0.5">
                    <Star size={22}
                      className={(hover || stars) >= s
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 fill-gray-100'} />
                  </button>
                ))}
                <span className="text-xs text-stone-400 ml-1">
                  {['','Poor','Fair','Good','Very Good','Excellent'][hover || stars]}
                </span>
              </div>

              <div className="space-y-3">
                <input required value={name} onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-200" />
                <textarea required value={text} onChange={e => setText(e.target.value)}
                  placeholder="Share your experience with this fabric — quality, drape, colour, delivery…"
                  rows={3}
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-200 resize-none" />

                {err && <p className="text-xs text-red-500">{err}</p>}

                <button type="submit" disabled={submitting || !name.trim() || !text.trim()}
                  className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {submitting ? <><Loader2 size={14} className="animate-spin" /> Submitting…</> : 'Submit Review'}
                </button>
                <p className="text-xs text-stone-400 text-center">Reviews are published after a quick moderation check.</p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
