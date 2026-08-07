import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const BASE = 'https://www.gofabrikos.com'

// Static pages with priority/changeFreq hints
const STATIC: MetadataRoute.Sitemap = [
  { url: BASE,                      lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
  { url: `${BASE}/fabrics`,         lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
  { url: `${BASE}/b2b`,             lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
  { url: `${BASE}/visualizer`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  { url: `${BASE}/contact`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  { url: `${BASE}/about`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  { url: `${BASE}/faq`,             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  { url: `${BASE}/track-order`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  { url: `${BASE}/privacy`,         lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  { url: `${BASE}/terms`,           lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  { url: `${BASE}/returns`,         lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: products } = await supabase
      .from('gf_products')
      .select('slug, updated_at')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })

    const productUrls: MetadataRoute.Sitemap = (products || []).map(p => ({
      url:             `${BASE}/fabrics/${p.slug}`,
      lastModified:    new Date(p.updated_at),
      changeFrequency: 'weekly',
      priority:        0.8,
    }))

    return [...STATIC, ...productUrls]
  } catch {
    // If Supabase fails, return static sitemap
    return STATIC
  }
}
