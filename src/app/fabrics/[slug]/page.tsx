'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Heart, ShoppingBag, Star, MessageCircle, Share2,
  Shield, Truck, RotateCcw, ChevronRight, Minus, Plus,
  Check, Copy, Eye, Flame, Sparkles, Users, TrendingUp,
  Facebook, Instagram, ZoomIn, X, ChevronLeft
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useWishlist } from '@/hooks/useWishlist'
import { useTrackView } from '@/hooks/useRecentlyViewed'
import RecentlyViewed from '@/components/RecentlyViewed'

// ── Product data ─────────────────────────────────────────────────────────
const allProducts = [
  {
    id: 1,
    name: 'Mull Chanderi Digital Print',
    fullName: 'Mull Chanderi Digital Print Fabric — Floral Bloom Collection',
    category: 'Chanderi',
    price: 125, mrp: 150, rating: 4.7, ratings: 2189, reviews: 486,
    slug: 'mull-chanderi-digital-print',
    fabricType: 'Mull Chanderi', printType: 'Digital Print',
    gsm: '80 GSM (Lightweight)', width: '44 inches',
    composition: '60% Cotton · 40% Silk',
    occasion: 'Kurta · Dupatta · Dress',
    season: 'Summer / All Season',
    washCare: 'Gentle Hand Wash',
    origin: 'Chanderi, Madhya Pradesh',
    color: 'Multicolor',
    inStock: true, stockLeft: 28,
    isNewArrival: true, isTrending: true,
    viewingNow: 63, likes: 1247, viewsToday: 8304, ordersToday: 342,
    description: 'Exquisite Mull Chanderi fabric with vibrant digital prints. Lightweight, breathable — perfect for sarees, salwar suits, and dupattas. The sheer texture with a subtle sheen makes it ideal for festive and casual occasions.',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=85',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=700&q=85',
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=700&q=85',
      'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=700&q=85',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&q=85',
    ],
    designs: [
      { name: 'Floral Bloom',   img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&q=70',  inStock: true },
      { name: 'Pastel Garden',  img: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=80&q=70', inStock: true },
      { name: 'Ivory Charm',    img: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=80&q=70', inStock: true },
      { name: 'Terracotta Hues',img: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=80&q=70', inStock: true },
      { name: 'Midnight Blue',  img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=80&q=70', inStock: false },
    ],
  },
  {
    id: 2, name: 'Pure Silk Banarasi Brocade', fullName: 'Pure Silk Banarasi Brocade — Heritage Zari Collection',
    category: 'Banarasi', price: 850, mrp: 1000, rating: 4.8, ratings: 1872, reviews: 218,
    slug: 'pure-silk-banarasi-brocade', fabricType: 'Banarasi Silk', printType: 'Zari Brocade',
    gsm: '180 GSM (Heavy)', width: '46 inches', composition: '100% Pure Silk',
    occasion: 'Saree · Lehenga · Bridal', season: 'All Season', washCare: 'Dry Clean Only',
    origin: 'Varanasi, Uttar Pradesh', color: 'Gold & Red', inStock: true, stockLeft: 14,
    isNewArrival: false, isTrending: true, viewingNow: 41, likes: 986, viewsToday: 5210, ordersToday: 189,
    description: 'Authentic Pure Silk Banarasi Brocade with intricate zari weaving. A timeless classic crafted by master weavers of Varanasi. Perfect for bridal sarees, lehengas, and ceremonial attire.',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&q=85',
      'https://images.unsplash.com/photo-1594938298603-c8148c4f4d47?w=700&q=85',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=700&q=85',
    ],
    designs: [
      { name: 'Classic Gold',  img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=80&q=70', inStock: true },
      { name: 'Royal Red',     img: 'https://images.unsplash.com/photo-1594938298603-c8148c4f4d47?w=80&q=70', inStock: true },
      { name: 'Peacock Green', img: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=80&q=70', inStock: false },
    ],
  },
  {
    id: 3, name: 'Handloom Khadi Cotton', fullName: 'Handloom Khadi Cotton — Artisan Spun Collection',
    category: 'Khadi', price: 280, mrp: 320, rating: 4.7, ratings: 1456, reviews: 156,
    slug: 'handloom-khadi-cotton', fabricType: 'Handloom Cotton', printType: 'Plain / Solid',
    gsm: '120 GSM (Medium)', width: '42 inches', composition: '100% Cotton',
    occasion: 'Kurta · Shirt · Summer Dress', season: 'Summer / Spring', washCare: 'Machine Wash Cold',
    origin: 'West Bengal', color: 'Off White', inStock: true, stockLeft: 52,
    isNewArrival: true, isTrending: false, viewingNow: 18, likes: 542, viewsToday: 2100, ordersToday: 76,
    description: 'Authentic handloom Khadi cotton, hand-spun and hand-woven by skilled artisans. Breathable and comfortable for everyday wear.',
    images: [
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=700&q=85',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=85',
      'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=700&q=85',
    ],
    designs: [
      { name: 'Natural White', img: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=80&q=70', inStock: true },
      { name: 'Sand Beige',    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&q=70',  inStock: true },
    ],
  },
  {
    id: 4, name: 'Kanjivaram Pure Silk', fullName: 'Kanjivaram Pure Silk — Temple Border Heritage',
    category: 'Kanjivaram', price: 1200, mrp: 1500, rating: 5.0, ratings: 892, reviews: 89,
    slug: 'kanjivaram-pure-silk', fabricType: 'Kanjivaram Silk', printType: 'Woven Motifs',
    gsm: '200 GSM (Heavy)', width: '48 inches', composition: '100% Mulberry Silk',
    occasion: 'Saree · Temple · Wedding', season: 'All Season', washCare: 'Dry Clean Only',
    origin: 'Kanchipuram, Tamil Nadu', color: 'Royal Purple', inStock: true, stockLeft: 8,
    isNewArrival: false, isTrending: true, viewingNow: 89, likes: 1654, viewsToday: 11200, ordersToday: 421,
    description: 'Premium Kanjivaram Pure Silk with traditional temple border motifs. Woven with the finest mulberry silk threads, this fabric carries a rich heritage of Tamil Nadu weaving traditions.',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4f4d47?w=700&q=85',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&q=85',
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=700&q=85',
    ],
    designs: [
      { name: 'Royal Purple', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4f4d47?w=80&q=70', inStock: true },
      { name: 'Bridal Red',   img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=80&q=70', inStock: true },
      { name: 'Deep Green',   img: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=80&q=70', inStock: false },
    ],
  },
  {
    id: 5, name: 'Georgette Embroidered Fabric', fullName: 'Georgette Embroidered Fabric — Delicate Bloom',
    category: 'Georgette', price: 320, mrp: 380, rating: 4.6, ratings: 2034, reviews: 203,
    slug: 'georgette-embroidered', fabricType: 'Georgette', printType: 'Embroidered',
    gsm: '75 GSM (Lightweight)', width: '44 inches', composition: '100% Polyester',
    occasion: 'Party · Evening · Festive', season: 'All Season', washCare: 'Hand Wash / Dry Clean',
    origin: 'Surat, Gujarat', color: 'Dusty Rose', inStock: true, stockLeft: 35,
    isNewArrival: true, isTrending: false, viewingNow: 27, likes: 780, viewsToday: 3400, ordersToday: 112,
    description: 'Flowing georgette fabric with delicate embroidery work. Lightweight drape and subtle embellishments make it perfect for sarees, dupattas, and evening wear.',
    images: [
      'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=700&q=85',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=85',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=700&q=85',
    ],
    designs: [
      { name: 'Dusty Rose',  img: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=80&q=70', inStock: true },
      { name: 'Sky Blue',    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&q=70',  inStock: true },
      { name: 'Mint Green',  img: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=80&q=70', inStock: false },
    ],
  },
  {
    id: 6, name: 'Linen Slub Fabric', fullName: 'Linen Slub Fabric — Natural Earth Collection',
    category: 'Linen', price: 195, mrp: 240, rating: 4.5, ratings: 1670, reviews: 167,
    slug: 'linen-slub-plain', fabricType: 'Linen', printType: 'Slub Weave',
    gsm: '140 GSM (Medium)', width: '58 inches', composition: '100% Linen',
    occasion: 'Casual · Office · Summer', season: 'Summer', washCare: 'Machine Wash Gentle',
    origin: 'Kolkata, West Bengal', color: 'Natural Beige', inStock: true, stockLeft: 67,
    isNewArrival: false, isTrending: false, viewingNow: 12, likes: 340, viewsToday: 1800, ordersToday: 54,
    description: 'Natural linen slub fabric with characteristic texture and earthy appeal. Perfect for summer kurtas, shirts, trousers, and home furnishings.',
    images: [
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=700&q=85',
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=700&q=85',
      'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=700&q=85',
    ],
    designs: [
      { name: 'Natural Beige', img: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=80&q=70', inStock: true },
      { name: 'Slate Grey',    img: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=80&q=70', inStock: true },
    ],
  },
  {
    id: 7, name: 'Mysore Silk Plain', fullName: 'Mysore Silk Plain — Karnataka Heritage',
    category: 'Mysore Silk', price: 650, mrp: 780, rating: 4.8, ratings: 1340, reviews: 134,
    slug: 'mysore-silk-plain', fabricType: 'Mysore Silk', printType: 'Plain Solid',
    gsm: '160 GSM', width: '44 inches', composition: '100% Pure Silk',
    occasion: 'Saree · Blouse · Ethnic', season: 'All Season', washCare: 'Dry Clean Only',
    origin: 'Mysuru, Karnataka', color: 'Peacock Blue', inStock: true, stockLeft: 22,
    isNewArrival: false, isTrending: true, viewingNow: 34, likes: 623, viewsToday: 4100, ordersToday: 98,
    description: "Classic Mysore Silk known for its smooth texture and natural sheen. One of Karnataka's prized treasures, perfect for sarees, blouses, and ethnic wear.",
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&q=85',
      'https://images.unsplash.com/photo-1594938298603-c8148c4f4d47?w=700&q=85',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=85',
    ],
    designs: [
      { name: 'Peacock Blue', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=80&q=70', inStock: true },
      { name: 'Wine Red',     img: 'https://images.unsplash.com/photo-1594938298603-c8148c4f4d47?w=80&q=70', inStock: true },
    ],
  },
  {
    id: 8, name: 'Cotton Ikat Fabric', fullName: 'Cotton Ikat Fabric — Odisha Resist-Dye Collection',
    category: 'Ikat', price: 220, mrp: 260, rating: 4.7, ratings: 980, reviews: 98,
    slug: 'cotton-ikat-double', fabricType: 'Ikat Weave', printType: 'Resist-Dyed',
    gsm: '110 GSM', width: '44 inches', composition: '100% Cotton',
    occasion: 'Casual · Ethnic · Travel', season: 'All Season', washCare: 'Hand Wash Cold',
    origin: 'Sambalpur, Odisha', color: 'Indigo Blue', inStock: true, stockLeft: 41,
    isNewArrival: true, isTrending: false, viewingNow: 21, likes: 412, viewsToday: 2300, ordersToday: 67,
    description: 'Traditional Odisha Cotton Ikat with resist-dyed patterns. Each piece is unique due to the intricate tie-dye weaving process. Ideal for sarees, kurtas, and home textiles.',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=85',
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=700&q=85',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=700&q=85',
    ],
    designs: [
      { name: 'Indigo Blue', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&q=70', inStock: true },
      { name: 'Earthy Brown', img: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=80&q=70', inStock: true },
    ],
  },
  {
    id: 9, name: 'Raw Silk Dupioni', fullName: 'Raw Silk Dupioni — Champagne Luxe',
    category: 'Raw Silk', price: 480, mrp: 580, rating: 4.6, ratings: 1120, reviews: 112,
    slug: 'raw-silk-dupion', fabricType: 'Dupioni Silk', printType: 'Natural Slub',
    gsm: '170 GSM', width: '44 inches', composition: '100% Raw Silk',
    occasion: 'Bridal · Formal · Evening', season: 'All Season', washCare: 'Dry Clean Only',
    origin: 'Bhagalpur, Bihar', color: 'Champagne Gold', inStock: false, stockLeft: 0,
    isNewArrival: false, isTrending: false, viewingNow: 9, likes: 287, viewsToday: 1100, ordersToday: 0,
    description: 'Luxurious Raw Silk Dupioni with characteristic slubs and crisp texture. The natural irregularities add unique character to garments. Perfect for bridal wear, blazers, and curtains.',
    images: [
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=700&q=85',
      'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=700&q=85',
    ],
    designs: [
      { name: 'Champagne', img: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=80&q=70', inStock: false },
    ],
  },
  {
    id: 10, name: 'Block Print Cotton Voile', fullName: 'Block Print Cotton Voile — Jaipur Artisan Edition',
    category: 'Cotton', price: 145, mrp: 175, rating: 4.8, ratings: 2670, reviews: 267,
    slug: 'handblock-dabu-print-cotton', fabricType: 'Cotton Voile', printType: 'Hand Block Print',
    gsm: '55 GSM (Ultra-light)', width: '44 inches', composition: '100% Cotton',
    occasion: 'Summer · Casual · Travel', season: 'Summer / Spring', washCare: 'Machine Wash Cold',
    origin: 'Jaipur, Rajasthan', color: 'Jaipur Pink', inStock: true, stockLeft: 89,
    isNewArrival: true, isTrending: true, viewingNow: 47, likes: 1102, viewsToday: 6700, ordersToday: 234,
    description: 'Hand block printed cotton voile from the workshops of Jaipur. Each meter features unique floral motifs stamped by skilled artisans using traditional wooden blocks dipped in natural dyes.',
    images: [
      'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=700&q=85',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=85',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&q=85',
    ],
    designs: [
      { name: 'Jaipur Pink',    img: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=80&q=70', inStock: true },
      { name: 'Indigo Floral',  img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&q=70',  inStock: true },
      { name: 'Saffron Motif',  img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=80&q=70', inStock: false },
    ],
  },
  {
    id: 11, name: 'Patola Silk Saree Fabric', fullName: 'Patola Silk — Patan Double Ikat Heritage',
    category: 'Patola', price: 2200, mrp: 2800, rating: 5.0, ratings: 430, reviews: 43,
    slug: 'sambalpuri-ikat-silk', fabricType: 'Patola Silk', printType: 'Double Ikat',
    gsm: '190 GSM', width: '46 inches', composition: '100% Pure Silk',
    occasion: 'Bridal · Heritage · Special', season: 'All Season', washCare: 'Dry Clean Only',
    origin: 'Patan, Gujarat', color: 'Royal Red', inStock: true, stockLeft: 5,
    isNewArrival: false, isTrending: true, viewingNow: 112, likes: 2341, viewsToday: 15800, ordersToday: 608,
    description: "Authentic Patan Patola silk with double-ikat weaving — one of India's rarest and most labor-intensive textiles. Each meter can take days to weeks to produce. A collector's treasure.",
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4f4d47?w=700&q=85',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&q=85',
    ],
    designs: [
      { name: 'Royal Red', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4f4d47?w=80&q=70', inStock: true },
    ],
  },
  {
    id: 12, name: 'Pashmina Wool Blend', fullName: 'Pashmina Wool Blend — Kashmir Valley Edition',
    category: 'Pashmina', price: 950, mrp: 1150, rating: 4.9, ratings: 780, reviews: 78,
    slug: 'pashmina-wool-blend', fabricType: 'Pashmina', printType: 'Plain / Embroidered',
    gsm: '220 GSM', width: '72 inches', composition: '70% Pashmina · 30% Wool',
    occasion: 'Shawl · Stole · Winter', season: 'Winter / Festive', washCare: 'Dry Clean Only',
    origin: 'Srinagar, Kashmir', color: 'Ivory Cream', inStock: true, stockLeft: 18,
    isNewArrival: false, isTrending: false, viewingNow: 29, likes: 876, viewsToday: 4500, ordersToday: 143,
    description: 'Premium Pashmina wool blend from the valleys of Kashmir. Ultra-soft, lightweight yet warm. Ideal for shawls, stoles, winter sarees, and elegant winter wear.',
    images: [
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=700&q=85',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=700&q=85',
    ],
    designs: [
      { name: 'Ivory Cream', img: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=80&q=70', inStock: true },
      { name: 'Blush Pink',  img: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=80&q=70', inStock: true },
    ],
  },
]

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = allProducts.find(p => p.slug === params.slug) ?? allProducts[0]
  const related = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
  const relatedProducts = related.length > 0 ? related : allProducts.filter(p => p.id !== product.id).slice(0, 4)

  const [selectedImage,  setImage]    = useState(0)
  const [lightboxOpen,   setLightbox] = useState(false)
  const [sizeGuideOpen,  setSizeGuide] = useState(false)
  const [reviewName,     setReviewName]  = useState('')
  const [reviewText,     setReviewText]  = useState('')
  const [reviewRating,   setReviewRating] = useState(5)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [userReviews,    setUserReviews]  = useState<{ name: string; rating: number; text: string; date: string }[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      return JSON.parse(localStorage.getItem(`reviews_${product.id}`) ?? '[]')
    } catch { return [] }
  })

  // Lock body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxOpen])
  const [selectedDesign, setDesign]   = useState(0)
  const [meters,         setMeters]   = useState(1)
  const { isWishlisted, toggleWishlist: toggleWish } = useWishlist()
  const { trackView } = useTrackView()

  // Track this product as recently viewed
  useEffect(() => {
    trackView({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      category: product.category,
      image_url: product.images[0],
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id])
  const isWishlist = isWishlisted(product.id)
  const [addedToCart,    setAdded]    = useState(false)
  const [copied,         setCopied]   = useState(false)
  const [viewers,        setViewers]  = useState(product.viewingNow)
  const [liveStock,      setLiveStock] = useState(product.stockLeft)

  // Fetch live stock & viewer data from Supabase
  useEffect(() => {
    async function fetchLiveData() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('products')
          .select('stock_left, viewing_now')
          .eq('slug', params.slug)
          .single()
        if (data) {
          setLiveStock(data.stock_left)
          setViewers(data.viewing_now)
        }
      } catch {
        // Supabase not connected — use hardcoded fallback values
      }
    }
    fetchLiveData()
  }, [params.slug])

  // Simulate live viewer count fluctuation
  useEffect(() => {
    const t = setInterval(() => {
      setViewers(v => Math.max(1, v + Math.floor(Math.random() * 5) - 2))
    }, 4000)
    return () => clearInterval(t)
  }, [])

  const discount    = Math.round(((product.mrp - product.price) / product.mrp) * 100)
  const totalPrice  = product.price * meters
  const totalMrp    = product.mrp * meters
  const savedAmount = totalMrp - totalPrice
  const stockPct    = Math.min(100, Math.round((liveStock / 100) * 100))
  const stockColor  = stockPct <= 20 ? '#DC2626' : stockPct <= 40 ? '#D97706' : '#16A34A'

  const pageUrl       = `https://gofabrikos.com/fabrics/${product.slug}`
  const waOrderText = [
    `🛍️ *Order Request — GoFabrikos*`,
    ``,
    `*Fabric:* ${product.name}`,
    `*Category:* ${product.category} | ${product.fabric_type}`,
    `*Design:* ${product.designs[selectedDesign]?.name ?? 'Default'}`,
    `*Quantity:* ${meters} metre${meters > 1 ? 's' : ''}`,
    `*Price:* ₹${product.price}/m × ${meters}m = *₹${totalPrice.toLocaleString()}*`,
    ``,
    `🔗 ${pageUrl}`,
    ``,
    `Please confirm availability and share payment details. Thank you!`,
  ].join('%0A')

  const whatsappOrder = `https://wa.me/918298308314?text=${waOrderText}`
  const whatsappShare = `https://wa.me/?text=Check out this fabric on GoFabrikos: ${product.fullName} at ₹${product.price}/m — ${encodeURIComponent('https://gofabrikos.com/fabrics/' + product.slug)}`

  function handleAddToCart() { setAdded(true); setTimeout(() => setAdded(false), 2500) }
  function handleCopy() {
    navigator.clipboard.writeText(pageUrl).catch(() => {})
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Nav ───────────────────────────────────────────── */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-rose-700 to-amber-500">
                <span className="text-white font-bold text-xs">GF</span>
              </div>
              <span className="text-xl font-bold text-stone-900">Go<span className="text-rose-700">Fabrikos</span></span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-600 hover:text-rose-700 text-sm">Home</Link>
              <Link href="/fabrics" className="text-rose-700 text-sm font-semibold border-b-2 border-rose-700 pb-1">Fabrics</Link>
              <Link href="/visualizer" className="text-gray-600 hover:text-rose-700 text-sm">Visualizer</Link>
              <Link href="/about" className="text-gray-600 hover:text-rose-700 text-sm">About</Link>
            </nav>
            <div className="flex items-center gap-2">
              <button onClick={() => toggleWish({ id: product.id, slug: product.slug, name: product.name, price: product.price, category: product.category, image_url: product.images[0] })} className="p-2 rounded-full hover:bg-red-50">
                <Heart size={20} className={isWishlist ? 'fill-red-600 text-red-600' : 'text-gray-500'} />
              </button>
              <Link href="/cart" className="p-2 rounded-full hover:bg-red-50">
                <ShoppingBag size={20} className="text-gray-500" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Breadcrumb ─────────────────────────────────────── */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-rose-700">Home</Link>
            <ChevronRight size={13} />
            <Link href="/fabrics" className="hover:text-rose-700">Fabrics</Link>
            <ChevronRight size={13} />
            <span className="text-gray-800 font-medium truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ── LEFT: Image gallery ─────────────────────────── */}
          <div className="flex gap-3">
            {/* Vertical thumbnail strip */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setImage(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === idx ? 'border-rose-600 shadow-md scale-105' : 'border-gray-200 hover:border-rose-300'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div
              className="flex-1 relative rounded-2xl overflow-hidden bg-white shadow-md aspect-[4/5] cursor-zoom-in group"
              onClick={() => setLightbox(true)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              {/* Zoom hint */}
              <div className="absolute bottom-3 right-3 bg-black/40 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <ZoomIn size={16} />
              </div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {discount > 0 && (
                  <span className="px-2.5 py-1 bg-rose-700 text-white text-xs font-bold rounded-full">{discount}% OFF</span>
                )}
                {product.isNewArrival && (
                  <span className="px-2.5 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <Sparkles size={11} /> NEW ARRIVAL
                  </span>
                )}
                {product.isTrending && (
                  <span className="px-2.5 py-1 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <Flame size={11} /> TRENDING
                  </span>
                )}
              </div>

              {/* Wishlist + share buttons on image */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => toggleWish({ id: product.id, slug: product.slug, name: product.name, price: product.price, category: product.category, image_url: product.images[0] })}
                  className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Heart size={17} className={isWishlist ? 'fill-red-600 text-red-600' : 'text-gray-400'} />
                </button>
                <button
                  onClick={handleCopy}
                  className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform"
                >
                  {copied ? <Check size={17} className="text-emerald-500" /> : <Share2 size={17} className="text-gray-400" />}
                </button>
              </div>

              {/* Out of stock overlay */}
              {liveStock <= 0 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-white text-gray-800 font-bold px-6 py-3 rounded-full text-lg">Out of Stock</span>
                </div>
              )}

              {/* Click to zoom hint */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[11px] px-3 py-1 rounded-full flex items-center gap-1.5 pointer-events-none">
                <ZoomIn size={11} /> Click to zoom
              </div>
            </div>
          </div>

          {/* ── RIGHT: Product info ─────────────────────────── */}
          <div className="space-y-5">

            {/* Seller badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">GOFABRIKOS</span>
              <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                <Check size={11} /> VERIFIED SELLER
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-stone-900 leading-snug">{product.fullName}</h1>

            {/* Rating + live viewers */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 bg-emerald-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                <Star size={13} className="fill-white" /> {product.rating}
              </div>
              <span className="text-sm text-gray-500">{product.ratings.toLocaleString()} Ratings · {product.reviews} Reviews</span>
              <span className="flex items-center gap-1.5 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-full font-medium">
                <Flame size={12} className="text-amber-500" /> {viewers} people viewing right now
              </span>
            </div>

            {/* Price block */}
            <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100 space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-rose-700">₹{product.price}</span>
                <span className="text-base text-gray-400 line-through">₹{product.mrp}/m</span>
                <span className="px-2.5 py-0.5 bg-rose-700 text-white text-sm font-bold rounded-full">{discount}% OFF</span>
              </div>
              <p className="text-xs text-gray-500">Inclusive of all taxes · <span className="text-emerald-600 font-medium">FREE delivery above ₹499</span></p>

              {/* Offers */}
              <div className="border-t border-rose-100 pt-2 space-y-1.5">
                <div className="flex items-start gap-2 text-xs text-gray-700">
                  <span className="text-lg leading-none">🏦</span>
                  <span>Extra <strong className="text-rose-700">5% off</strong> on online payment (UPI / Net Banking)</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-700">
                  <span className="text-lg leading-none">🎁</span>
                  <span>Use code <strong className="text-rose-700">GOFA10</strong> → Get 10% off on first order</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-700">
                  <span className="text-lg leading-none">📦</span>
                  <span>Buy 10m+ → Get <strong className="text-rose-700">additional 8% bulk discount</strong></span>
                </div>
              </div>
            </div>

            {/* Stock availability bar */}
            {liveStock > 0 && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                    <TrendingUp size={13} /> Stock Availability
                  </span>
                  <span className="text-xs font-bold" style={{ color: stockColor }}>
                    Only {liveStock} meters left!
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${stockPct}%`, backgroundColor: stockColor }}
                  />
                </div>
              </div>
            )}

            {/* Select Design */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Select Design <span className="text-rose-600 font-normal">{product.designs[selectedDesign]?.name} (Selected)</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.designs.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => !d.inStock || setDesign(i)}
                    className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      !d.inStock ? 'opacity-60 cursor-not-allowed border-gray-200' :
                      selectedDesign === i ? 'border-rose-600 shadow-md scale-105' :
                      'border-gray-200 hover:border-rose-300'
                    }`}
                    title={d.name}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={d.img} alt={d.name} className="w-full h-full object-cover" />
                    {!d.inStock && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-gray-600 text-center leading-tight">SOLD OUT</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Metre selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">Quantity (metres)</label>
                <button
                  onClick={() => setSizeGuide(true)}
                  className="text-xs text-rose-600 underline underline-offset-2 hover:text-rose-700 transition-colors"
                >
                  📏 Size Guide
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setMeters(m => Math.max(1, m - 0.5))} className="w-11 h-11 flex items-center justify-center hover:bg-rose-50 text-gray-600">
                    <Minus size={16} />
                  </button>
                  <span className="w-14 text-center font-bold text-lg text-stone-900">{meters}m</span>
                  <button onClick={() => setMeters(m => m + 0.5)} className="w-11 h-11 flex items-center justify-center hover:bg-rose-50 text-gray-600">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="bg-gray-100 rounded-xl px-4 py-2.5 flex-1 text-center">
                  <div className="text-xl font-bold text-stone-900">₹{totalPrice.toLocaleString()}</div>
                  <div className="text-xs text-emerald-600 font-medium">Save ₹{savedAmount.toLocaleString()} total</div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={liveStock <= 0}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                  addedToCart ? 'bg-emerald-500 text-white' :
                  liveStock > 0 ? 'bg-stone-900 text-white hover:bg-stone-800' :
                  'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {addedToCart ? <><Check size={20} /> Added to Cart!</> : <><ShoppingBag size={20} /> Add to Cart — ₹{totalPrice.toLocaleString()}</>}
              </button>
              <a
                href={whatsappOrder}
                target="_blank" rel="noopener noreferrer"
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 text-white transition-all ${liveStock <= 0 ? 'opacity-50 pointer-events-none' : 'hover:opacity-90'}`}
                style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
              >
                <MessageCircle size={20} /> Order via WhatsApp
              </a>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Truck size={20} className="text-blue-600" />, label: 'Free Shipping', sub: 'Above ₹499' },
                { icon: <Shield size={20} className="text-emerald-600" />, label: '100% Genuine', sub: 'Certified Fabric' },
                { icon: <RotateCcw size={20} className="text-purple-600" />, label: 'Easy Returns', sub: '7 Day Policy' },
              ].map(b => (
                <div key={b.label} className="flex flex-col items-center text-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                  {b.icon}
                  <span className="text-xs font-semibold text-gray-700 mt-1">{b.label}</span>
                  <span className="text-xs text-gray-400">{b.sub}</span>
                </div>
              ))}
            </div>

            {/* Social stats + share buttons */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center gap-5 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1.5"><Heart size={14} className="text-red-400 fill-red-400" /> {product.likes.toLocaleString()} Likes</span>
                <span className="flex items-center gap-1.5"><Eye size={14} className="text-blue-400" /> {product.viewsToday.toLocaleString()} Views Today</span>
                <span className="flex items-center gap-1.5"><ShoppingBag size={14} className="text-emerald-500" /> {product.ordersToday.toLocaleString()} Orders</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500 mr-1">Share:</span>
                <a href={whatsappShare} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-300 text-emerald-700 text-xs hover:bg-emerald-50">
                  <MessageCircle size={13} /> WhatsApp
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-300 text-blue-700 text-xs hover:bg-blue-50">
                  <Facebook size={13} /> Facebook
                </a>
                <a href={`https://www.instagram.com/`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-pink-300 text-pink-700 text-xs hover:bg-pink-50">
                  <Instagram size={13} /> Instagram
                </a>
                <button onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 text-gray-600 text-xs hover:bg-gray-50">
                  {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Fabric details ──────────────────────────────────── */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-stone-900 mb-4">About this Fabric</h2>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-stone-900 mb-4">Fabric Specifications</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['FABRIC TYPE',   product.fabricType],
                ['PRINT TYPE',    product.printType],
                ['GSM',           product.gsm],
                ['WIDTH',         product.width],
                ['COMPOSITION',   product.composition],
                ['OCCASION',      product.occasion],
                ['SEASON',        product.season],
                ['WASH CARE',     product.washCare],
              ].map(([label, value]) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-stone-800">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Customer Reviews ──────────────────────────────────── */}
        <div className="mt-12 border-t pt-10">
          <div className="flex flex-col md:flex-row gap-8">

            {/* Rating summary */}
            <div className="md:w-56 flex-shrink-0">
              <h2 className="text-2xl font-bold text-stone-900 mb-4">Customer Reviews</h2>
              <div className="flex items-end gap-3 mb-4">
                <span className="text-5xl font-bold text-stone-900">{product.rating}</span>
                <div>
                  <div className="flex gap-0.5 mb-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={16} className={s <= Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'} />
                    ))}
                  </div>
                  <span className="text-xs text-stone-500">{product.ratings.toLocaleString()} ratings</span>
                </div>
              </div>
              {/* Star breakdown */}
              {[5,4,3,2,1].map(star => {
                const pcts: Record<number, number> = { 5: 68, 4: 20, 3: 7, 2: 3, 1: 2 }
                return (
                  <div key={star} className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs text-stone-500 w-3">{star}</span>
                    <Star size={11} className="fill-yellow-400 text-yellow-400 flex-shrink-0" />
                    <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pcts[star]}%` }} />
                    </div>
                    <span className="text-xs text-stone-400 w-7 text-right">{pcts[star]}%</span>
                  </div>
                )
              })}
            </div>

            {/* Review cards + write form */}
            <div className="flex-1 min-w-0">

              {/* Sample reviews */}
              <div className="space-y-4 mb-6">
                {[
                  { name: 'Priya M.', rating: 5, date: '12 Jul 2025', text: 'Absolutely gorgeous fabric! The texture is exactly as shown. Colour is vibrant and it stitched beautifully into a kurta. Very fast delivery to Hyderabad.' },
                  { name: 'Lakshmi R.', rating: 5, date: '3 Jul 2025', text: 'Ordered 6 metres for a lehenga and the quality exceeded expectations. The fabric drapes so well. Will definitely order again from GoFabrikos!' },
                  { name: 'Anitha K.', rating: 4, date: '28 Jun 2025', text: 'Good quality fabric. Slightly lighter than expected but looks beautiful after stitching. Customer service on WhatsApp was very helpful.' },
                  ...userReviews,
                ].slice(0, 5).map((r, i) => (
                  <div key={i} className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 font-bold text-sm">
                          {r.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-stone-800">{r.name}</p>
                          <p className="text-xs text-stone-400">{r.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} size={12} className={s <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-stone-600 leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>

              {/* Write a review */}
              {!reviewSubmitted ? (
                <div className="border border-stone-200 rounded-xl p-5">
                  <h3 className="font-semibold text-stone-800 mb-4">Write a Review</h3>

                  {/* Star picker */}
                  <div className="flex items-center gap-1 mb-4">
                    <span className="text-sm text-stone-600 mr-2">Your rating:</span>
                    {[1,2,3,4,5].map(s => (
                      <button key={s} onClick={() => setReviewRating(s)} className="p-0.5">
                        <Star size={22} className={s <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 fill-gray-100'} />
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <input
                      value={reviewName}
                      onChange={e => setReviewName(e.target.value)}
                      placeholder="Your name"
                      className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-200"
                    />
                    <textarea
                      value={reviewText}
                      onChange={e => setReviewText(e.target.value)}
                      placeholder="Share your experience with this fabric…"
                      rows={3}
                      className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-200 resize-none"
                    />
                    <button
                      onClick={() => {
                        if (!reviewName.trim() || !reviewText.trim()) return
                        const newReview = {
                          name: reviewName.trim(),
                          rating: reviewRating,
                          text: reviewText.trim(),
                          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                        }
                        const updated = [newReview, ...userReviews]
                        setUserReviews(updated)
                        try { localStorage.setItem(`reviews_${product.id}`, JSON.stringify(updated)) } catch {}
                        setReviewSubmitted(true)
                      }}
                      disabled={!reviewName.trim() || !reviewText.trim()}
                      className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-5 text-center">
                  <div className="text-2xl mb-1">🙏</div>
                  <p className="font-semibold text-emerald-800">Thank you for your review!</p>
                  <p className="text-xs text-emerald-600 mt-1">Your feedback helps other customers make better choices.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── You May Also Like ─────────────────────────────────── */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-stone-900 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {relatedProducts.map(p => (
              <Link key={p.id} href={`/fabrics/${p.slug}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group hover:-translate-y-1">
                <div className="relative aspect-square overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className="px-2 py-0.5 bg-rose-700 text-white text-[10px] font-bold rounded-full">
                      {Math.round(((p.mrp - p.price) / p.mrp) * 100)}% OFF
                    </span>
                    {p.isTrending && <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full">🔥 TRENDING</span>}
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-400 mb-0.5">{p.category}</p>
                  <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 leading-snug">{p.name}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="font-bold text-sm text-rose-700">₹{p.price}/m</span>
                    <span className="text-xs text-gray-400 line-through">₹{p.mrp}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={11} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-500">{p.rating} ({p.reviews})</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recently Viewed */}
      <RecentlyViewed excludeId={product.id} />

      {/* Footer */}
      <footer className="mt-8 py-8 border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-gray-400 text-sm">
          <p className="font-semibold text-gray-600 mb-1">GoFabrikos | Prop: Lakshmi Sowjanya Aaki</p>
          <p>Premium Indian Fabrics · WhatsApp: +91 82983 08314 · Guntur, Andhra Pradesh</p>
        </div>
      </footer>

      {/* ── SIZE GUIDE MODAL ──────────────────────────────── */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4" onClick={() => setSizeGuide(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b">
              <div>
                <h2 className="font-playfair text-xl font-bold text-stone-800">📏 Fabric Size Guide</h2>
                <p className="text-xs text-stone-500 mt-0.5">How many metres do you need?</p>
              </div>
              <button onClick={() => setSizeGuide(false)} className="p-2 rounded-full hover:bg-stone-100 transition-colors">
                <X size={20} className="text-stone-500" />
              </button>
            </div>

            {/* Table */}
            <div className="p-5">
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-rose-50">
                      <th className="text-left py-2.5 px-3 font-semibold text-stone-700 rounded-tl-lg">Garment</th>
                      <th className="text-center py-2.5 px-3 font-semibold text-stone-700">S / M</th>
                      <th className="text-center py-2.5 px-3 font-semibold text-stone-700">L / XL</th>
                      <th className="text-center py-2.5 px-3 font-semibold text-stone-700 rounded-tr-lg">XXL+</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { garment: '👗 Saree (6.3m standard)', s: '6.3m', l: '6.3m', xxl: '6.3m' },
                      { garment: '🥻 Lehenga Skirt', s: '2.5m', l: '3m', xxl: '3.5m' },
                      { garment: '👚 Blouse / Choli', s: '0.8m', l: '1m', xxl: '1.2m' },
                      { garment: '👘 Anarkali Kurta', s: '2.5m', l: '3m', xxl: '3.5m' },
                      { garment: '🥼 Straight Kurta', s: '2m', l: '2.5m', xxl: '3m' },
                      { garment: '🩱 Kurti (short)', s: '1.5m', l: '1.8m', xxl: '2m' },
                      { garment: '🧣 Dupatta / Stole', s: '2.5m', l: '2.5m', xxl: '2.5m' },
                      { garment: '👖 Palazzo / Wide Pants', s: '2m', l: '2.5m', xxl: '3m' },
                      { garment: '🩴 Salwar', s: '2m', l: '2.5m', xxl: '2.8m' },
                      { garment: '🧥 Jacket / Shrug', s: '1m', l: '1.2m', xxl: '1.5m' },
                    ].map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                        <td className="py-2.5 px-3 text-stone-700 font-medium">{row.garment}</td>
                        <td className="py-2.5 px-3 text-center text-stone-600">{row.s}</td>
                        <td className="py-2.5 px-3 text-center text-stone-600">{row.l}</td>
                        <td className="py-2.5 px-3 text-center text-stone-600">{row.xxl}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                💡 <strong>Tip:</strong> Always add 10–15% extra fabric for matching prints, cutting losses, or future alterations. For heavily embroidered or printed fabrics, confirm with our team on WhatsApp.
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setSizeGuide(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  Close
                </button>
                <a
                  href="https://wa.me/918298308314?text=Hi! I need help deciding how many metres to buy."
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold text-center transition-colors"
                  style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
                >
                  💬 Ask on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── LIGHTBOX ───────────────────────────────────────── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          onClick={() => setLightbox(false)}
        >
          {/* Close */}
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={28} />
          </button>

          {/* Prev */}
          {product.images.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); setImage(i => (i - 1 + product.images.length) % product.images.length) }}
              className="absolute left-4 text-white/80 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors"
            >
              <ChevronLeft size={32} />
            </button>
          )}

          {/* Main zoomed image */}
          <div className="max-w-3xl max-h-[85vh] w-full px-16" onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-contain rounded-xl"
              style={{ maxHeight: '80vh' }}
            />
            <p className="text-white/60 text-center text-sm mt-3">
              {selectedImage + 1} / {product.images.length} — {product.name}
            </p>
          </div>

          {/* Next */}
          {product.images.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); setImage(i => (i + 1) % product.images.length) }}
              className="absolute right-4 text-white/80 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors"
            >
              <ChevronRight size={32} />
            </button>
          )}

          {/* Thumbnail strip */}
          {product.images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={e => { e.stopPropagation(); setImage(idx) }}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-white scale-110' : 'border-white/30 hover:border-white/70'}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Floating WhatsApp button — mobile only */}
      {liveStock > 0 && (
        <a
          href={whatsappOrder}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-5 z-50 md:hidden flex items-center gap-2 px-4 py-3 rounded-full text-white text-sm font-bold shadow-lg hover:shadow-xl active:scale-95 transition-all"
          style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
        >
          <MessageCircle size={18} />
          Order via WhatsApp
        </a>
      )}
    </div>
  )
}
