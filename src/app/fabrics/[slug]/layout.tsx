import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'

const BASE = 'https://www.gofabrikos.com'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

async function getProduct(slug: string) {
  try {
    const supabase = adminClient()
    const { data } = await supabase
      .from('gf_products')
      .select('name, description, price, mrp, category, images, rating, rating_count')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()
    return data
  } catch {
    return null
  }
}

// Fallback: humanise slug when product not found in DB
function titleFromSlug(slug: string) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const product = await getProduct(params.slug)
  const name    = product?.name ?? titleFromSlug(params.slug)
  const desc    = product?.description
    ?? `Buy ${name} fabric online at GoFabrikos. Priced per metre. GST invoice on every order. Pan-India delivery.`
  const image   = product?.images?.[0] ?? `${BASE}/og-image.jpg`
  const price   = product?.price
  const mrp     = product?.mrp
  const cat     = product?.category ?? 'Indian Fabric'

  const title = `${name} – Buy Online${price ? ` at ₹${price}/m` : ''} | GoFabrikos`
  const ogDesc = `${desc.slice(0, 150)}${desc.length > 150 ? '…' : ''} Category: ${cat}. GST invoice. Pan-India delivery.`

  return {
    title,
    description: ogDesc,
    alternates: {
      canonical: `${BASE}/fabrics/${params.slug}`,
    },
    openGraph: {
      title,
      description: ogDesc,
      url:         `${BASE}/fabrics/${params.slug}`,
      siteName:    'GoFabrikos',
      type:        'website',
      locale:      'en_IN',
      images: [{
        url:    image,
        width:  800,
        height: 800,
        alt:    name,
      }],
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description: `${name} – ₹${price ?? '...'}/m. Buy fabric online at GoFabrikos.`,
      images:      [image],
    },
  }
}

// Product JSON-LD injected via a server component inside the layout
async function ProductJsonLd({ slug }: { slug: string }) {
  const product = await getProduct(slug)
  if (!product) return null

  const jsonLd = {
    '@context':   'https://schema.org',
    '@type':      'Product',
    name:         product.name,
    description:  product.description ?? `${product.name} fabric available at GoFabrikos`,
    image:        product.images ?? [],
    sku:          slug,
    brand: {
      '@type': 'Brand',
      name:    'GoFabrikos',
    },
    offers: {
      '@type':           'Offer',
      url:               `${BASE}/fabrics/${slug}`,
      priceCurrency:     'INR',
      price:             product.price,
      priceValidUntil:   new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability:      'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name:    'GoFabrikos',
      },
    },
    ...(product.rating && {
      aggregateRating: {
        '@type':       'AggregateRating',
        ratingValue:   product.rating,
        reviewCount:   product.rating_count ?? 10,
        bestRating:    5,
        worstRating:   1,
      },
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { slug: string }
}) {
  return (
    <>
      <ProductJsonLd slug={params.slug} />
      {children}
    </>
  )
}
