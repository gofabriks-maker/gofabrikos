// Server Component — fetches products from Supabase, passes to client UI
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { ProductRow } from '@/types/database'
import FabricsClient from './FabricsClient'
import { FabricGridSkeleton } from '@/components/FabricCardSkeleton'

export const revalidate = 60 // revalidate every 60 seconds

// Fallback hardcoded products for when Supabase is not yet connected
const FALLBACK_PRODUCTS: ProductRow[] = [
  {
    id: 1, slug: 'mull-chanderi-digital-print', name: 'Mull Chanderi Digital Print',
    full_name: 'Mull Chanderi Digital Print — Ivory & Rose', price: 125, original_price: 160, discount: 22,
    category: 'Chanderi', fabric_type: 'Chanderi Silk-Cotton', print_type: 'Digital Print', gsm: 90,
    composition: '70% Cotton 30% Silk', season: 'All Season', wash_care: 'Dry clean recommended',
    description: 'Lightweight Mull Chanderi with contemporary digital floral print.', metres_per_garment: 5.5,
    rating: 4.7, ratings_count: 312, stock_left: 65, is_new_arrival: true, is_trending: false, is_active: true,
    viewing_now: 8, likes: 234, views_today: 892, orders_today: 14,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'],
    designs: [{ name: 'Ivory Rose', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80', inStock: true }],
    tags: ['chanderi', 'digital print'], created_at: '', updated_at: '',
  },
  {
    id: 2, slug: 'pure-silk-banarasi-brocade', name: 'Pure Silk Banarasi Brocade',
    full_name: 'Pure Silk Banarasi Brocade — Gold Zari', price: 850, original_price: 1100, discount: 23,
    category: 'Banarasi', fabric_type: 'Pure Silk', print_type: 'Brocade Weave', gsm: 180,
    composition: '100% Pure Silk', season: 'Winter & Festive', wash_care: 'Dry clean only',
    description: 'Authentic Banarasi brocade with real gold zari work.', metres_per_garment: 6.5,
    rating: 4.9, ratings_count: 187, stock_left: 28, is_new_arrival: false, is_trending: true, is_active: true,
    viewing_now: 12, likes: 567, views_today: 1243, orders_today: 22,
    image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80'],
    designs: [{ name: 'Gold Zari', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&q=80', inStock: true }],
    tags: ['banarasi', 'silk', 'zari'], created_at: '', updated_at: '',
  },
  {
    id: 3, slug: 'handloom-khadi-cotton', name: 'Handloom Khadi Cotton',
    full_name: 'Handloom Khadi Cotton — Natural Cream', price: 280, original_price: 340, discount: 18,
    category: 'Khadi', fabric_type: 'Khadi Cotton', print_type: 'Plain / Handloom', gsm: 120,
    composition: '100% Cotton', season: 'All Season', wash_care: 'Machine wash cold',
    description: 'Hand-spun and hand-woven Khadi cotton from certified KVIC artisans.', metres_per_garment: 5.0,
    rating: 4.6, ratings_count: 98, stock_left: 90, is_new_arrival: false, is_trending: false, is_active: true,
    viewing_now: 4, likes: 145, views_today: 423, orders_today: 7,
    image_url: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&q=80'],
    designs: [{ name: 'Natural Cream', img: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=200&q=80', inStock: true }],
    tags: ['khadi', 'cotton', 'eco'], created_at: '', updated_at: '',
  },
  {
    id: 4, slug: 'kanjivaram-pure-silk', name: 'Kanjivaram Pure Silk',
    full_name: 'Kanjivaram Pure Silk — Temple Border', price: 1200, original_price: 1500, discount: 20,
    category: 'Kanjivaram', fabric_type: 'Pure Mulberry Silk', print_type: 'Temple Border Weave', gsm: 220,
    composition: '100% Mulberry Silk', season: 'Wedding & Festive', wash_care: 'Dry clean only',
    description: 'Authentic Kanjivaram silk with traditional temple border.', metres_per_garment: 7.0,
    rating: 4.9, ratings_count: 256, stock_left: 18, is_new_arrival: false, is_trending: true, is_active: true,
    viewing_now: 15, likes: 678, views_today: 1567, orders_today: 31,
    image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4f4d47?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4f4d47?w=600&q=80'],
    designs: [{ name: 'Ruby Red', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4f4d47?w=200&q=80', inStock: true }],
    tags: ['kanjivaram', 'silk', 'wedding'], created_at: '', updated_at: '',
  },
  {
    id: 5, slug: 'georgette-embroidered', name: 'Georgette Embroidered',
    full_name: 'Georgette Embroidered — Floral Sequin', price: 320, original_price: 420, discount: 24,
    category: 'Georgette', fabric_type: 'Georgette', print_type: 'Embroidered', gsm: 80,
    composition: '100% Polyester', season: 'All Season', wash_care: 'Hand wash cold',
    description: 'Flowing georgette with delicate floral embroidery and sequin work.', metres_per_garment: 3.5,
    rating: 4.5, ratings_count: 143, stock_left: 55, is_new_arrival: true, is_trending: false, is_active: true,
    viewing_now: 7, likes: 189, views_today: 612, orders_today: 11,
    image_url: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80'],
    designs: [{ name: 'Black Sequin', img: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=200&q=80', inStock: true }],
    tags: ['georgette', 'embroidered'], created_at: '', updated_at: '',
  },
  {
    id: 6, slug: 'linen-slub-plain', name: 'Linen Slub Plain',
    full_name: 'Linen Slub Plain — Natural Sand', price: 380, original_price: 460, discount: 17,
    category: 'Linen', fabric_type: 'Pure Linen', print_type: 'Plain Slub', gsm: 140,
    composition: '100% Linen', season: 'Summer & Spring', wash_care: 'Machine wash gentle',
    description: 'Premium linen with natural slub texture. Breathable, cool fabric.', metres_per_garment: 3.0,
    rating: 4.6, ratings_count: 89, stock_left: 72, is_new_arrival: false, is_trending: false, is_active: true,
    viewing_now: 5, likes: 112, views_today: 334, orders_today: 6,
    image_url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80'],
    designs: [{ name: 'Natural Sand', img: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&q=80', inStock: true }],
    tags: ['linen', 'summer'], created_at: '', updated_at: '',
  },
  {
    id: 7, slug: 'cotton-ikat-double', name: 'Cotton Ikat Double',
    full_name: 'Cotton Ikat Double — Pochampally Weave', price: 450, original_price: 580, discount: 22,
    category: 'Ikat', fabric_type: 'Cotton', print_type: 'Double Ikat', gsm: 130,
    composition: '100% Cotton', season: 'All Season', wash_care: 'Machine wash cold',
    description: 'Traditional Pochampally double ikat. Each piece is unique.', metres_per_garment: 5.5,
    rating: 4.7, ratings_count: 134, stock_left: 40, is_new_arrival: false, is_trending: true, is_active: true,
    viewing_now: 9, likes: 267, views_today: 745, orders_today: 13,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'],
    designs: [{ name: 'Classic Indigo', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80', inStock: true }],
    tags: ['ikat', 'pochampally'], created_at: '', updated_at: '',
  },
  {
    id: 8, slug: 'mysore-silk-plain', name: 'Mysore Silk Plain',
    full_name: 'Mysore Silk Plain — Satin Finish', price: 680, original_price: 820, discount: 17,
    category: 'Mysore Silk', fabric_type: 'Mysore Silk', print_type: 'Plain Satin', gsm: 160,
    composition: '100% Silk', season: 'All Season', wash_care: 'Dry clean only',
    description: 'Karnataka Silk Industries certified Mysore Crepe Silk.', metres_per_garment: 6.0,
    rating: 4.8, ratings_count: 78, stock_left: 35, is_new_arrival: true, is_trending: false, is_active: true,
    viewing_now: 6, likes: 198, views_today: 521, orders_today: 9,
    image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80'],
    designs: [{ name: 'Royal Purple', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&q=80', inStock: true }],
    tags: ['mysore silk', 'satin'], created_at: '', updated_at: '',
  },
  {
    id: 9, slug: 'handblock-dabu-print-cotton', name: 'Handblock Dabu Print Cotton',
    full_name: 'Handblock Dabu Print Cotton — Indigo Resist', price: 380, original_price: 480, discount: 21,
    category: 'Block Print', fabric_type: 'Cotton', print_type: 'Handblock / Dabu Print', gsm: 110,
    composition: '100% Cotton', season: 'All Season', wash_care: 'Machine wash cold',
    description: 'Jaipur mud-resist Dabu print on soft cotton. Each piece is handblocked.', metres_per_garment: 3.0,
    rating: 4.6, ratings_count: 112, stock_left: 58, is_new_arrival: false, is_trending: false, is_active: true,
    viewing_now: 5, likes: 156, views_today: 412, orders_today: 8,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'],
    designs: [{ name: 'Indigo White', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80', inStock: true }],
    tags: ['dabu', 'handblock', 'cotton'], created_at: '', updated_at: '',
  },
  {
    id: 10, slug: 'pashmina-wool-blend', name: 'Pashmina Wool Blend',
    full_name: 'Pashmina Wool Blend — Winter Heritage', price: 950, original_price: 1200, discount: 21,
    category: 'Pashmina', fabric_type: 'Pashmina Wool', print_type: 'Woven', gsm: 200,
    composition: '70% Pashmina 30% Merino Wool', season: 'Winter', wash_care: 'Dry clean only',
    description: 'Exquisite pashmina-merino blend from Kashmir. Ultra-soft warmth.', metres_per_garment: 3.5,
    rating: 4.9, ratings_count: 67, stock_left: 22, is_new_arrival: false, is_trending: false, is_active: true,
    viewing_now: 4, likes: 189, views_today: 398, orders_today: 5,
    image_url: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&q=80'],
    designs: [{ name: 'Natural Beige', img: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=200&q=80', inStock: true }],
    tags: ['pashmina', 'wool', 'winter'], created_at: '', updated_at: '',
  },
  {
    id: 11, slug: 'sambalpuri-ikat-silk', name: 'Sambalpuri Ikat Silk',
    full_name: 'Sambalpuri Ikat Silk — Odisha GI-Tagged', price: 780, original_price: 980, discount: 20,
    category: 'Ikat', fabric_type: 'Silk-Cotton', print_type: 'Single Ikat Weave', gsm: 170,
    composition: '60% Silk 40% Cotton', season: 'All Season', wash_care: 'Dry clean recommended',
    description: 'GI-tagged Sambalpuri ikat from Odisha. Traditional motifs by master craftsmen.', metres_per_garment: 6.0,
    rating: 4.8, ratings_count: 91, stock_left: 30, is_new_arrival: true, is_trending: false, is_active: true,
    viewing_now: 7, likes: 234, views_today: 567, orders_today: 10,
    image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4f4d47?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4f4d47?w=600&q=80'],
    designs: [{ name: 'Traditional Red', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4f4d47?w=200&q=80', inStock: true }],
    tags: ['sambalpuri', 'ikat', 'GI-tagged'], created_at: '', updated_at: '',
  },
  {
    id: 12, slug: 'raw-silk-dupion', name: 'Raw Silk Dupion',
    full_name: 'Raw Silk Dupion — Textured Sheen', price: 520, original_price: 650, discount: 20,
    category: 'Raw Silk', fabric_type: 'Dupion Silk', print_type: 'Plain', gsm: 150,
    composition: '100% Raw Silk', season: 'All Season', wash_care: 'Dry clean only',
    description: 'Textured dupion silk with characteristic slub weave and natural sheen.', metres_per_garment: 2.5,
    rating: 4.7, ratings_count: 103, stock_left: 45, is_new_arrival: false, is_trending: true, is_active: true,
    viewing_now: 8, likes: 312, views_today: 689, orders_today: 16,
    image_url: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80'],
    designs: [{ name: 'Ivory Sheen', img: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=200&q=80', inStock: true }],
    tags: ['dupion', 'raw silk'], created_at: '', updated_at: '',
  },
]

export default async function FabricsPage() {
  let products: ProductRow[] = FALLBACK_PRODUCTS

  // Only try Supabase if env vars are set
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project-id.supabase.co'
  ) {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (!error && data && data.length > 0) {
        products = data as ProductRow[]
      }
    } catch {
      // Supabase not connected — use fallback products
    }
  }

  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-6 bg-stone-200 rounded w-48 mb-6 animate-pulse" />
        <FabricGridSkeleton count={12} />
      </div>
    }>
      <FabricsClient initialProducts={products} />
    </Suspense>
  )
}
