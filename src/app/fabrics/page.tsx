// Server Component — fetches products from gf_products (same table as admin)
import { Suspense } from 'react'
import { createClient } from '@supabase/supabase-js'
import FabricsClient from './FabricsClient'
import { FabricGridSkeleton } from '@/components/FabricCardSkeleton'

export const revalidate = 60

export default async function FabricsPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string; sort?: string }
}) {
  // Use service role key so RLS doesn't block reads
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  let query = supabase
    .from('gf_products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  // Category filter
  if (searchParams.category && searchParams.category !== 'all') {
    query = query.ilike('category', `%${searchParams.category}%`)
  }

  // Search filter
  if (searchParams.search) {
    query = query.ilike('name', `%${searchParams.search}%`)
  }

  const { data, error } = await query

  // Map gf_products columns → shape FabricsClient expects
  const products = (data || []).map((p: any) => {
    // Resolve main image URL
    let imageUrl = p.cloudinary_url || ''
    if (!imageUrl && Array.isArray(p.images) && p.images.length > 0) {
      const first = p.images[0]
      imageUrl = typeof first === 'string' ? first : first?.url || ''
    }

    const price    = Number(p.price) || 0
    const mrp      = Number(p.original_price) || price
    const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0

    return {
      id:               p.id,
      slug:             p.slug,
      name:             p.name,
      full_name:        p.full_name || p.name,
      price,
      original_price:   mrp,
      discount,
      category:         p.category || '',
      fabric_type:      p.fabric_type || '',
      print_type:       p.print_type || '',
      gsm:              p.gsm || null,
      composition:      p.material_composition || '',
      season:           Array.isArray(p.season) ? p.season.join(', ') : p.season || '',
      wash_care:        Array.isArray(p.wash_care) ? p.wash_care[0] : p.wash_care || '',
      description:      p.description || '',
      metres_per_garment: p.metres_per_garment || 5,
      rating:           p.avg_rating || 0,
      ratings_count:    p.review_count || 0,
      stock_left:       Number(p.stock_metres) || 50,
      is_new_arrival:   p.is_new_arrival || false,
      is_trending:      p.is_trending || false,
      is_active:        p.is_active,
      viewing_now:      Math.floor(Math.random() * 20) + 1,
      likes:            p.wishlist_count || 0,
      views_today:      p.view_count || 0,
      orders_today:     p.purchase_count || 0,
      image_url:        imageUrl || '/images/placeholder-fabric.jpg',
      images:           imageUrl ? [imageUrl] : ['/images/placeholder-fabric.jpg'],
      designs:          [],
      tags:             Array.isArray(p.tags) ? p.tags : [],
      created_at:       p.created_at || '',
      updated_at:       p.updated_at || '',
    }
  })

  if (error) {
    console.error('Error fetching from gf_products:', error.message)
  }

  return (
    <Suspense fallback={<FabricGridSkeleton />}>
      <FabricsClient initialProducts={products} />
    </Suspense>
  )
}
