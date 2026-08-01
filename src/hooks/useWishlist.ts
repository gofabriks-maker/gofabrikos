'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'gofabrikos_wishlist'

export type WishlistProduct = {
  id: number
  slug: string
  name: string
  price: number
  category: string
  image_url: string
  rating?: number
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([])
  const [loaded, setLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setWishlist(JSON.parse(stored))
    } catch {}
    setLoaded(true)
  }, [])

  // Save to localStorage whenever wishlist changes (after initial load)
  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist))
    } catch {}
  }, [wishlist, loaded])

  const isWishlisted = useCallback(
    (id: number) => wishlist.some(p => p.id === id),
    [wishlist]
  )

  const toggleWishlist = useCallback((product: WishlistProduct) => {
    setWishlist(prev =>
      prev.some(p => p.id === product.id)
        ? prev.filter(p => p.id !== product.id)
        : [...prev, product]
    )
  }, [])

  const removeFromWishlist = useCallback((id: number) => {
    setWishlist(prev => prev.filter(p => p.id !== id))
  }, [])

  const clearWishlist = useCallback(() => setWishlist([]), [])

  return { wishlist, isWishlisted, toggleWishlist, removeFromWishlist, clearWishlist, loaded }
}
