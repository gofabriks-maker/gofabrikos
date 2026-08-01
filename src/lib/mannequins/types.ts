// ─── DIGITAL MANNEQUIN SYSTEM — TYPE DEFINITIONS ─────────────────────────────
// GoFabrikos · Naari Fashions Pvt Ltd

export type MannequinType = 'adult-female' | 'kids-girl'

export type AdultGarmentType =
  | 'saree'
  | 'chudidhar'       // Salwar Suit
  | 'lehenga'
  | 'lehenga-voni'    // Half Saree
  | 'gown'            // Gown / Anarkali
  | 'dress-dupatta'   // Dress with Dupatta
  | 'blouse'

export type KidsGarmentType =
  | 'frock'
  | 'party-frock'
  | 'lehenga'
  | 'lehenga-voni'
  | 'chudidhar'
  | 'dress'
  | 'dress-dupatta'

export type GarmentType = AdultGarmentType | KidsGarmentType

export type MannequinView = 'front' | 'back' | 'left-3q' | 'right-3q' | 'side'

// Represents a single clip region on the mannequin (one fabric area)
export interface GarmentRegion {
  id: string
  label: string           // e.g. "Blouse", "Skirt", "Pallu"
  path: string            // SVG path data
  zIndex: number          // layering order (higher = on top)
  opacity?: number        // default 1
}

// Full garment definition — one or more fabric regions
export interface GarmentDefinition {
  type: GarmentType
  label: string
  emoji: string
  metersAdult?: string    // suggested fabric meters
  metersKids?: string
  regions: GarmentRegion[]
  // Optional decorative paths (hem borders, pallu edges, etc.)
  decorative?: { path: string; strokeColor?: string; fillColor?: string }[]
}

// Metadata for a mannequin image generation job
export interface MannequinJobMeta {
  productId: string
  sku: string
  originalImageUrl: string
  processedImageUrl?: string    // after background removal
  mannequinImageUrl?: string    // final composite
  mannequinType: MannequinType
  garmentType: GarmentType
  view: MannequinView
  status: 'pending' | 'processing' | 'review' | 'approved' | 'rejected' | 'manual-review'
  generatedAt?: string          // ISO date
  approvedBy?: string
  approvedAt?: string
  rejectedReason?: string
  generationHistory: MannequinJobMeta[]  // previous attempts
  qualityFlags?: QualityFlag[]
}

export interface QualityFlag {
  field: 'color' | 'print' | 'embroidery' | 'border' | 'pallu' | 'dupatta' | 'sleeves' | 'neckline' | 'invented-detail' | 'proportions' | 'consistency' | 'commercial-quality'
  passed: boolean
  note?: string
}

// Admin decision after review
export type AdminDecision = 'approve' | 'reject' | 'regenerate' | 'manual-review'

// Config for the GarmentImageProcessor abstraction layer
export interface ImageProcessorConfig {
  provider: 'cloudinary' | 'replicate' | 'fal' | 'stability' | 'manual'
  cloudinaryCloudName?: string
  replicateApiKey?: string
  falApiKey?: string
}
