/**
 * Cloudinary URL helpers for GoFabrikos
 * Cloud name: muaprkqa
 */

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? 'muaprkqa'
const BASE = `https://res.cloudinary.com/${CLOUD}/image/upload`

interface TransformOptions {
  width?: number
  height?: number
  quality?: number | 'auto'
  format?: 'auto' | 'webp' | 'jpg' | 'png'
  crop?: 'fill' | 'limit' | 'fit' | 'thumb' | 'pad'
  gravity?: 'auto' | 'face' | 'center'
}

/**
 * Build a Cloudinary transformation URL
 * Works with both full https URLs and public IDs
 */
export function cloudinaryUrl(
  src: string,
  opts: TransformOptions = {}
): string {
  if (!src) return '/images/placeholder-fabric.jpg'

  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'limit',
    gravity,
  } = opts

  // If it's already a Cloudinary URL, inject transformations
  if (src.includes('cloudinary.com')) {
    const transforms: string[] = []
    if (width) transforms.push(`w_${width}`)
    if (height) transforms.push(`h_${height}`)
    transforms.push(`c_${crop}`)
    if (gravity) transforms.push(`g_${gravity}`)
    transforms.push(`q_${quality}`)
    transforms.push(`f_${format}`)

    const t = transforms.join(',')
    // Insert transformations after /upload/
    return src.replace('/upload/', `/upload/${t}/`)
  }

  // Assume it's a public_id (not a full URL)
  const transforms: string[] = []
  if (width) transforms.push(`w_${width}`)
  if (height) transforms.push(`h_${height}`)
  transforms.push(`c_${crop}`)
  if (gravity) transforms.push(`g_${gravity}`)
  transforms.push(`q_${quality}`)
  transforms.push(`f_${format}`)

  return `${BASE}/${transforms.join(',')}/${src}`
}

// Preset sizes used across the site
export const fabricCard = (src: string) =>
  cloudinaryUrl(src, { width: 400, height: 400, crop: 'fill', gravity: 'auto', quality: 'auto', format: 'auto' })

export const fabricDetail = (src: string) =>
  cloudinaryUrl(src, { width: 800, height: 800, crop: 'limit', quality: 'auto', format: 'auto' })

export const fabricThumb = (src: string) =>
  cloudinaryUrl(src, { width: 120, height: 120, crop: 'fill', gravity: 'auto', quality: 'auto', format: 'auto' })
