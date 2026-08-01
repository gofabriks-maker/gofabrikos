'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'gofabrikos_recently_viewed'
const MAX_ITEMS = 6

export type RecentProduct = {
  id: number
  slug: string
  name: string
  price: number
  category: string
  image_url: string
  rating?: number
  viewedAt: number
}

export function useRecentlyViewed() {
  const [recent, setRecent] = useState<RecentProduct[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setRecent(JSON.parse(stored))
    } catch {}
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recent))
    } catch {}
  }, [recent, loaded])

  const trackView = useCallback((product: Omit<RecentProduct, 'viewedAt'>) => {
    setRecent(prev => {
      const filtered = prev.filter(p => p.id !== product.id)
      return [{ ...product, viewedAt: Date.now() }, ...filtered].slice(0, MAX_ITEMS)
    })
  }, [])

  return { recent, loaded }
  // Note: trackView exported separately so callers can call it without creating
  // a dependency loop; we return it from a separate internal ref pattern
}

// Separate export so product detail page can import just the tracker
export function useTrackView() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => { setLoaded(true) }, [])

  const trackView = useCallback((product: Omit<RecentProduct, 'viewedAt'>) => {
    if (!loaded) return
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const prev: RecentProduct[] = stored ? JSON.parse(stored) : []
      const filtered = prev.filter(p => p.id !== product.id)
      const updated = [{ ...product, viewedAt: Date.now() }, ...filtered].slice(0, MAX_ITEMS)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {}
  }, [loaded])

  return { trackView }
}
