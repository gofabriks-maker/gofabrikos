import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import FabricDetailClient from './FabricDetailClient'

// Fetch product from gf_products by slug
async function getProduct(slug: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data, error } = await supabase
    .from('gf_products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !data) return null
  return data
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug)
  if (!product) return { title: 'Product Not Found | GoFabrikos' }
  return {
    title: `${product.name} | GoFabrikos`,
    description: product.description || `Buy ${product.name} online at GoFabrikos`,
    openGraph: {
      images: product.cloudinary_url ? [product.cloudinary_url] : [],
    },
  }
}

export default async function FabricDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug)
  if (!product) notFound()

  // Normalize images array
  let imageUrls: string[] = []
  if (product.cloudinary_url) imageUrls.push(product.cloudinary_url)
  if (Array.isArray(product.images)) {
    product.images.forEach((img: any) => {
      const url = typeof img === 'string' ? img : img?.url
      if (url && !imageUrls.includes(url)) imageUrls.push(url)
    })
  }
  if (imageUrls.length === 0) imageUrls = ['/images/placeholder-fabric.jpg']

  // Map gf_products fields to the UI shape
  const p = {
    id:          product.id,
    name:        product.name,
    fullName:    product.full_name || product.name,
    slug:        product.slug,
    category:    product.category || '',
    price:       Number(product.price),
    mrp:         Number(product.original_price || product.price),
    fabricType:  product.fabric_type || '',
    printType:   product.print_type || '',
    gsm:         product.gsm ? `${product.gsm} GSM` : '',
    composition: product.material_composition || '',
    occasion:    product.occasion || product.suitable_for?.join(' · ') || '',
    season:      Array.isArray(product.season) ? product.season.join(' / ') : product.season || '',
    washCare:    Array.isArray(product.wash_care) ? product.wash_care.join(', ') : product.wash_care || '',
    description: product.description || '',
    stockLeft:   Number(product.stock_metres || 50),
    isNewArrival:product.is_new_arrival || false,
    isTrending:  product.is_trending || false,
    images:      imageUrls,
    tags:        Array.isArray(product.tags) ? product.tags : [],
  }

  return <FabricDetailClient product={p} />
}
