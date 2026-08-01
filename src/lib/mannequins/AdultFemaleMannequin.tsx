'use client'
// ─── ADULT FEMALE MANNEQUIN — Front View ─────────────────────────────────────
// GoFabrikos Digital Mannequin System · Phase 1
//
// Appearance: Faceless · Ivory/off-white · Realistic product-display proportions
// Style: Like high-end fabric mannequin (Etsy reference: cream fabric-covered form)
// ViewBox: 0 0 400 760  (4:5 ratio — matches catalogue image standard)
//
// Garment clip regions defined for each Indian ethnic wear category.
// Real product photo is rendered inside these clip regions via <image> element.

import { GarmentDefinition, AdultGarmentType } from './types'

// ── GARMENT REGION DEFINITIONS ────────────────────────────────────────────────
// All paths are in 400×760 coordinate space
// Body landmarks:
//   Head center: (200, 68)
//   Neck base: y ≈ 138
//   Shoulders: y ≈ 155, span x = 95..305
//   Bust apex: y ≈ 200
//   Waist (narrowest): y ≈ 295, x = 135..265
//   Hip (widest): y ≈ 360, x = 120..280
//   Crotch: y ≈ 420
//   Knee: y ≈ 570
//   Ankle: y ≈ 690
//   Floor: y ≈ 720

export const ADULT_GARMENT_DEFS: Record<AdultGarmentType, GarmentDefinition> = {
  saree: {
    type: 'saree',
    label: 'Saree',
    emoji: '🥻',
    metersAdult: '6–9 m',
    regions: [
      {
        id: 'saree-skirt',
        label: 'Saree Main Drape',
        zIndex: 1,
        // Full saree drape — starts at EXACT same curve as blouse bottom (y=296 sides, y=314 center).
        // Zero gap guaranteed: top of skirt = bottom of blouse (same control points, reversed).
        path: `M 102 296
               C 140 310, 170 316, 200 316
               C 230 316, 260 310, 298 296
               C 299 316, 300 340, 300 366
               C 301 400, 302 440, 302 480
               L 302 720 L 98 720 L 98 480
               C 98 440, 99 400, 100 366
               C 100 340, 101 316, 102 296 Z`,
      },
      {
        id: 'saree-blouse',
        label: 'Blouse',
        zIndex: 3,
        // Blouse — shoulder to waist. Bottom edge: y=296 at sides, y=316 at center (natural curve).
        // Skirt top uses exact same curve → ZERO gap between blouse and skirt.
        path: `M 108 152
               C 142 140, 172 136, 200 136
               C 228 136, 258 140, 292 152
               L 298 296
               C 260 310, 230 316, 200 316
               C 170 316, 140 310, 102 296 Z`,
      },
      {
        id: 'saree-pallu',
        label: 'Pallu',
        zIndex: 4,
        // Pallu — broad diagonal drape from LEFT SHOULDER flowing across front to RIGHT HIP.
        // In standard saree draping: pallu goes over left shoulder, falls diagonally across body.
        // This is the WIDE drape visible on the front (see reference image).
        path: `M 96 155
               C 80 165, 66 185, 58 212
               C 50 240, 48 268, 52 296
               C 56 324, 64 350, 72 376
               C 78 398, 82 420, 82 444
               C 100 440, 120 430, 140 418
               C 152 410, 164 400, 172 388
               C 160 364, 148 338, 138 310
               C 128 282, 120 252, 116 222
               C 112 196, 112 172, 116 152
               C 108 153, 101 154, 96 155 Z`,
      },
    ],
    decorative: [
      // Rich border at hem (gold-toned)
      { path: `M 96 706 Q 200 718 304 706 L 304 718 Q 200 730 96 718 Z`, fillColor: 'currentColor' },
      // Pallu flowing edge
      { path: `M 72 376 Q 76 385 80 392 Q 82 398 82 406`, strokeColor: 'currentColor' },
      // Pallu border detail
      { path: `M 58 212 Q 54 240 50 268`, strokeColor: 'currentColor' },
    ],
  },

  chudidhar: {
    type: 'chudidhar',
    label: 'Chudidhar / Salwar Suit',
    emoji: '👗',
    metersAdult: '3–5 m',
    regions: [
      {
        id: 'chudi-kameez',
        label: 'Kameez (Top)',
        zIndex: 2,
        // Long kameez from shoulder to mid-thigh
        path: `M 95 155 C 78 163, 70 178, 68 198
               L 64 238 C 62 258, 68 272, 76 284
               C 82 294, 86 308, 88 326
               L 92 440 L 308 440 L 312 326
               C 314 308, 318 294, 324 284
               C 332 272, 338 258, 336 238
               L 332 198 C 330 178, 322 163, 305 155
               C 272 142, 236 136, 200 136
               C 164 136, 128 142, 95 155 Z`,
      },
      {
        id: 'chudi-salwar',
        label: 'Salwar / Pants',
        zIndex: 1,
        // Tapered salwar from hip to ankle
        path: `M 92 440 L 88 520 L 108 580 L 140 690 L 170 700 L 168 590 L 155 510 L 154 440 Z
               M 308 440 L 312 520 L 292 580 L 260 690 L 230 700 L 232 590 L 245 510 L 246 440 Z
               M 154 440 L 155 510 L 168 590 L 170 700 L 230 700 L 232 590 L 245 510 L 246 440 Z`,
      },
      {
        id: 'chudi-dupatta',
        label: 'Dupatta',
        zIndex: 3,
        // Dupatta draped over both shoulders, gentle drape
        path: `M 95 155 C 80 168, 68 186, 62 214 C 56 242, 58 268, 64 290
               C 68 280, 74 264, 78 246 C 84 222, 90 198, 98 176 Z
               M 305 155 C 320 168, 332 186, 338 214 C 344 242, 342 268, 336 290
               C 332 280, 326 264, 322 246 C 316 222, 310 198, 302 176 Z
               M 95 155 C 130 148, 165 144, 200 144 C 235 144, 270 148, 305 155
               C 290 162, 245 168, 200 168 C 155 168, 110 162, 95 155 Z`,
      },
    ],
  },

  lehenga: {
    type: 'lehenga',
    label: 'Lehenga',
    emoji: '👘',
    metersAdult: '4–7 m',
    regions: [
      {
        id: 'lehenga-choli',
        label: 'Choli (Blouse)',
        zIndex: 2,
        // Short fitted choli
        path: `M 138 152 C 162 140, 182 136, 200 136 C 218 136, 238 140, 262 152
               L 268 250 C 242 260, 222 266, 200 266 C 178 266, 158 260, 132 250 Z`,
      },
      {
        id: 'lehenga-skirt',
        label: 'Lehenga Skirt',
        zIndex: 1,
        // Very flared skirt from waist to floor
        path: `M 128 282 C 100 292, 80 310, 60 350
               L 20 720 L 380 720 L 340 350
               C 320 310, 300 292, 272 282
               C 248 294, 224 300, 200 300
               C 176 300, 152 294, 128 282 Z`,
      },
    ],
    decorative: [
      // Lehenga hem border
      { path: `M 20 710 Q 200 724 380 710 L 380 720 Q 200 734 20 720 Z`, fillColor: 'currentColor' },
    ],
  },

  'lehenga-voni': {
    type: 'lehenga-voni',
    label: 'Lehenga Voni / Half Saree',
    emoji: '🥻',
    metersAdult: '4–6 m',
    regions: [
      {
        id: 'voni-blouse',
        label: 'Blouse',
        zIndex: 2,
        path: `M 138 152 C 162 140, 182 136, 200 136 C 218 136, 238 140, 262 152
               L 268 250 C 242 260, 222 266, 200 266 C 178 266, 158 260, 132 250 Z`,
      },
      {
        id: 'voni-skirt',
        label: 'Skirt / Langa',
        zIndex: 1,
        path: `M 130 275 C 105 288, 86 308, 70 348
               L 38 720 L 362 720 L 330 348
               C 314 308, 295 288, 270 275
               C 246 287, 224 293, 200 293
               C 176 293, 154 287, 130 275 Z`,
      },
      {
        id: 'voni-dupatta',
        label: 'Voni / Dupatta',
        zIndex: 3,
        // Half-saree style voni draping over shoulder
        path: `M 95 148 C 76 164, 64 192, 58 228 C 52 264, 56 300, 64 336
               C 70 320, 74 296, 76 272 C 80 244, 88 218, 100 194
               C 106 174, 110 158, 108 148 Z
               M 95 148 C 130 144, 165 140, 200 140 C 218 140, 236 142, 262 152
               C 240 148, 220 145, 200 145 C 155 145, 115 148, 95 148 Z`,
      },
    ],
    decorative: [
      { path: `M 38 710 Q 200 722 362 710 L 362 720 Q 200 732 38 720 Z`, fillColor: 'currentColor' },
    ],
  },

  gown: {
    type: 'gown',
    label: 'Gown / Anarkali',
    emoji: '🩱',
    metersAdult: '5–8 m',
    regions: [
      {
        id: 'gown-bodice',
        label: 'Bodice / Top',
        zIndex: 2,
        // Fitted from shoulder to hip
        path: `M 95 155 C 78 163, 70 180, 68 200
               L 64 240 C 62 260, 68 276, 76 290
               C 82 302, 86 318, 88 336
               L 92 380 L 308 380 L 312 336
               C 314 318, 318 302, 324 290
               C 332 276, 338 260, 336 240
               L 332 200 C 330 180, 322 163, 305 155
               C 272 142, 236 136, 200 136
               C 164 136, 128 142, 95 155 Z`,
      },
      {
        id: 'gown-skirt',
        label: 'Gown Skirt',
        zIndex: 1,
        // Fitted at hip, moderate flare to floor
        path: `M 90 380 C 72 392, 56 416, 44 456 L 20 720 L 380 720 L 356 456
               C 344 416, 328 392, 310 380 Z`,
      },
    ],
    decorative: [
      { path: `M 20 710 Q 200 722 380 710 L 380 720 Q 200 732 20 720 Z`, fillColor: 'currentColor' },
    ],
  },

  'dress-dupatta': {
    type: 'dress-dupatta',
    label: 'Dress with Dupatta',
    emoji: '👗',
    metersAdult: '4–6 m',
    regions: [
      {
        id: 'dress-main',
        label: 'Dress',
        zIndex: 1,
        // A-line dress from shoulder to knee
        path: `M 95 155 C 78 163, 70 180, 68 200
               L 64 240 C 62 260, 68 276, 76 290
               C 82 302, 88 320, 90 340
               L 80 580 L 320 580 L 310 340
               C 312 320, 318 302, 324 290
               C 332 276, 338 260, 336 240
               L 332 200 C 330 180, 322 163, 305 155
               C 272 142, 236 136, 200 136
               C 164 136, 128 142, 95 155 Z`,
      },
      {
        id: 'dress-dupatta',
        label: 'Dupatta',
        zIndex: 2,
        // Dupatta over both shoulders, draping down
        path: `M 95 155 C 78 170, 66 194, 60 224 C 54 254, 56 282, 62 308
               C 66 296, 72 276, 76 254 C 82 228, 90 204, 100 182 Z
               M 305 155 C 322 170, 334 194, 340 224 C 346 254, 344 282, 338 308
               C 334 296, 328 276, 324 254 C 318 228, 310 204, 300 182 Z
               M 95 155 Q 148 150 200 150 Q 252 150 305 155 Q 252 160 200 160 Q 148 160 95 155 Z`,
      },
    ],
    decorative: [
      { path: `M 80 572 Q 200 582 320 572 L 320 580 Q 200 590 80 580 Z`, fillColor: 'currentColor' },
    ],
  },

  blouse: {
    type: 'blouse',
    label: 'Blouse / Choli',
    emoji: '🧵',
    metersAdult: '0.8–1 m',
    regions: [
      {
        id: 'blouse-main',
        label: 'Blouse Body',
        zIndex: 1,
        path: `M 108 152 C 140 140, 170 136, 200 136 C 230 136, 260 140, 292 152
               L 298 280 C 262 292, 232 298, 200 298 C 168 298, 138 292, 102 280 Z`,
      },
      {
        id: 'blouse-sleeve-l',
        label: 'Left Sleeve',
        zIndex: 2,
        path: `M 108 152 C 90 162, 76 180, 68 206 C 60 232, 60 256, 64 276
               C 70 264, 76 244, 82 222 C 88 200, 96 180, 108 164 Z`,
      },
      {
        id: 'blouse-sleeve-r',
        label: 'Right Sleeve',
        zIndex: 2,
        path: `M 292 152 C 310 162, 324 180, 332 206 C 340 232, 340 256, 336 276
               C 330 264, 324 244, 318 222 C 312 200, 304 180, 292 164 Z`,
      },
    ],
  },
}

// ── MANNEQUIN SVG PATHS (body silhouette) ─────────────────────────────────────
// These define the ivory mannequin form. ViewBox 400×760.

export const ADULT_BODY = {
  // Main torso + legs as one smooth bezier path (front silhouette)
  torsoLegs: `
    M 168 136
    C 148 140, 132 148, 108 158
    C 90 166, 78 180, 72 200
    C 66 220, 64 242, 65 264
    C 66 286, 72 304, 80 320
    C 88 338, 92 356, 92 374
    C 92 392, 90 410, 90 428
    C 90 450, 94 474, 98 500
    C 104 530, 110 558, 114 584
    C 118 610, 120 640, 120 670
    L 120 720
    C 120 726, 127 730, 136 730
    L 162 730 C 170 730, 174 726, 174 720
    L 172 428
    C 173 422, 178 418, 186 418
    C 194 418, 200 418, 200 418
    C 200 418, 206 418, 214 418
    C 222 418, 227 422, 228 428
    L 226 720 C 226 726, 230 730, 238 730
    L 264 730 C 273 730, 280 726, 280 720
    L 280 670 C 280 640, 282 610, 286 584
    C 290 558, 296 530, 302 500
    C 306 474, 310 450, 310 428
    C 310 410, 308 392, 308 374
    C 308 356, 312 338, 320 320
    C 328 304, 334 286, 335 264
    C 336 242, 334 220, 328 200
    C 322 180, 310 166, 292 158
    C 268 148, 252 140, 232 136
    Z
  `,
  // Left arm (hanging at side, slightly away from body)
  leftArm: `
    M 72 200
    C 60 212, 50 234, 44 262
    C 38 290, 38 320, 42 348
    C 46 376, 50 398, 52 416
    C 54 428, 54 436, 52 442
    C 58 446, 66 444, 70 438
    C 72 430, 72 418, 72 406
    C 72 384, 70 360, 70 332
    C 70 304, 74 278, 80 256
    C 86 236, 88 218, 84 202 Z
  `,
  // Right arm
  rightArm: `
    M 328 200
    C 340 212, 350 234, 356 262
    C 362 290, 362 320, 358 348
    C 354 376, 350 398, 348 416
    C 346 428, 346 436, 348 442
    C 342 446, 334 444, 330 438
    C 328 430, 328 418, 328 406
    C 328 384, 330 360, 330 332
    C 330 304, 326 278, 320 256
    C 314 236, 312 218, 316 202 Z
  `,
  // Head (smooth oval, no face features)
  head: `M 200 28 C 226 28, 246 44, 250 66 C 254 88, 248 108, 238 120
          C 226 134, 213 140, 200 140 C 187 140, 174 134, 162 120
          C 152 108, 146 88, 150 66 C 154 44, 174 28, 200 28 Z`,
  // Neck
  neck: `M 174 126 C 182 136, 192 140, 200 140 C 208 140, 218 136, 226 126
          L 228 158 C 218 164, 209 166, 200 166 C 191 166, 182 164, 172 158 Z`,
  // Mannequin base stand
  stand: `M 158 730 L 152 758 L 248 758 L 242 730 Z`,
  standBase: `M 130 758 Q 200 766 270 758 L 270 764 Q 200 772 130 764 Z`,
}

// ── REACT COMPONENT ───────────────────────────────────────────────────────────

interface AdultMannequinProps {
  garmentType: AdultGarmentType
  // The real product photo URL — displayed inside garment clip regions
  productImageUrl?: string
  // Fallback tint color when no product image supplied
  tintColor?: string
  // Show/hide garment region labels (for admin UI)
  showLabels?: boolean
  className?: string
  style?: React.CSSProperties
}

export default function AdultFemaleMannequin({
  garmentType,
  productImageUrl,
  tintColor = '#4A0082',
  showLabels = false,
  className = '',
  style,
}: AdultMannequinProps) {
  const garmentDef = ADULT_GARMENT_DEFS[garmentType]
  if (!garmentDef) return null

  // Mannequin color palette — bright white like reference store mannequins
  const ivory = '#F0EEEB'
  const ivoryDark = '#C8C4C0'
  const ivoryLight = '#FFFFFF'

  return (
    <svg
      viewBox="0 0 400 780"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={`w-full h-full ${className}`}
      style={style}
      aria-label={`Adult female mannequin wearing ${garmentDef.label}`}
    >
      <defs>
        {/* Mannequin body gradients — gives 3D form */}
        <linearGradient id="amBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={ivoryDark} />
          <stop offset="18%" stopColor={ivory} />
          <stop offset="50%" stopColor={ivoryLight} />
          <stop offset="82%" stopColor={ivory} />
          <stop offset="100%" stopColor={ivoryDark} />
        </linearGradient>
        <linearGradient id="amHeadGrad" cx="40%" cy="35%" r="55%"
          gradientUnits="objectBoundingBox" x1="20%" y1="10%" x2="80%" y2="90%">
          <stop offset="0%" stopColor={ivoryLight} />
          <stop offset="100%" stopColor={ivoryDark} />
        </linearGradient>
        <linearGradient id="amTopFade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.20)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.12)" />
        </linearGradient>
        <linearGradient id="amSideShadow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.16)" />
          <stop offset="22%" stopColor="rgba(0,0,0,0.03)" />
          <stop offset="78%" stopColor="rgba(0,0,0,0.02)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.14)" />
        </linearGradient>
        <linearGradient id="amStandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#BFBAB2" />
          <stop offset="100%" stopColor="#A0A098" />
        </linearGradient>

        {/* Product image pattern — tiles the product photo to fill garment regions */}
        {productImageUrl && (
          <pattern id="amProductPat" patternUnits="userSpaceOnUse"
            x="40" y="130" width="320" height="600">
            <image
              href={productImageUrl}
              x="0" y="0" width="320" height="600"
              preserveAspectRatio="xMidYMid slice"
            />
          </pattern>
        )}

        {/* Clip paths for each garment region */}
        {garmentDef.regions.map(r => (
          <clipPath key={`cp-${r.id}`} id={`cp-${r.id}`}>
            <path d={r.path} />
          </clipPath>
        ))}

        {/* Clip paths for body parts (used when garment covers them) */}
        <clipPath id="cp-am-body">
          <path d={ADULT_BODY.torsoLegs} />
        </clipPath>
        <clipPath id="cp-am-larm">
          <path d={ADULT_BODY.leftArm} />
        </clipPath>
        <clipPath id="cp-am-rarm">
          <path d={ADULT_BODY.rightArm} />
        </clipPath>

        {/* Garment shading overlays */}
        <linearGradient id="amGarmentShade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.20)" />
          <stop offset="28%" stopColor="rgba(0,0,0,0.04)" />
          <stop offset="72%" stopColor="rgba(0,0,0,0.03)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.18)" />
        </linearGradient>
        <linearGradient id="amGarmentFade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.14)" />
        </linearGradient>

        {/* Subtle drop shadow */}
        <filter id="amShadow" x="-12%" y="-4%" width="124%" height="112%">
          <feDropShadow dx="2" dy="6" stdDeviation="9" floodColor="rgba(0,0,0,0.22)" />
        </filter>
        <filter id="amSoftShadow" x="-8%" y="-3%" width="116%" height="110%">
          <feDropShadow dx="1" dy="3" stdDeviation="5" floodColor="rgba(0,0,0,0.18)" />
        </filter>
        <filter id="amBlur">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      {/* ── BACKGROUND ── */}
      <rect width="400" height="780" fill="#F0EDE8" rx="0" />
      {/* Floor shadow */}
      <ellipse cx="200" cy="756" rx="90" ry="12" fill="rgba(0,0,0,0.09)" filter="url(#amBlur)" />

      {/* ══ MANNEQUIN BODY ══ */}

      {/* Arms (behind body/garment) */}
      <path d={ADULT_BODY.leftArm} fill="url(#amBodyGrad)" />
      <path d={ADULT_BODY.leftArm} fill="url(#amTopFade)" opacity="0.6" />
      <path d={ADULT_BODY.leftArm} fill="none" stroke={ivoryDark} strokeWidth="0.6" opacity="0.5" />

      <path d={ADULT_BODY.rightArm} fill="url(#amBodyGrad)" />
      <path d={ADULT_BODY.rightArm} fill="url(#amTopFade)" opacity="0.6" />
      <path d={ADULT_BODY.rightArm} fill="none" stroke={ivoryDark} strokeWidth="0.6" opacity="0.5" />

      {/* Body */}
      <path d={ADULT_BODY.torsoLegs} fill="url(#amBodyGrad)" filter="url(#amShadow)" />
      <path d={ADULT_BODY.torsoLegs} fill="url(#amTopFade)" opacity="0.55" />
      {/* Center seam (subtle) */}
      <line x1="200" y1="136" x2="200" y2="730"
        stroke={ivoryDark} strokeWidth="0.5" strokeDasharray="4,5" opacity="0.35" />
      <path d={ADULT_BODY.torsoLegs} fill="none" stroke={ivoryDark} strokeWidth="0.9" opacity="0.55" />

      {/* ══ GARMENT LAYERS ══ */}
      {/* Render garment regions sorted by zIndex */}
      {[...garmentDef.regions]
        .sort((a, b) => a.zIndex - b.zIndex)
        .map(region => (
          <g key={region.id} filter="url(#amSoftShadow)">
            {productImageUrl ? (
              /* Real product photo clipped to garment region */
              <path
                d={region.path}
                fill="url(#amProductPat)"
                clipPath={`url(#cp-${region.id})`}
                opacity={region.opacity ?? 0.96}
              />
            ) : (
              /* Fallback: solid tint color */
              <path
                d={region.path}
                fill={tintColor}
                opacity={0.82}
              />
            )}
            {/* 3D shading overlays — always applied */}
            <path d={region.path} fill="url(#amGarmentShade)" opacity="0.50"
              clipPath={`url(#cp-${region.id})`} />
            <path d={region.path} fill="url(#amGarmentFade)" opacity="0.38"
              clipPath={`url(#cp-${region.id})`} />
            {/* Garment edge outline */}
            <path d={region.path} fill="none"
              stroke="rgba(0,0,0,0.10)" strokeWidth="0.8" />
            {/* Admin label (dev mode only) */}
            {showLabels && (
              <text
                fontSize="10" fill="rgba(0,0,0,0.5)" textAnchor="middle"
                style={{ pointerEvents: 'none' }}
              >
                <textPath href={`#cp-${region.id}`}>{region.label}</textPath>
              </text>
            )}
          </g>
        ))}

      {/* Decorative elements (hem borders, pallu edges, etc.) */}
      {garmentDef.decorative?.map((d, i) => (
        <path
          key={i}
          d={d.path}
          fill={d.fillColor === 'currentColor' ? tintColor : (d.fillColor ?? 'none')}
          stroke={d.strokeColor === 'currentColor' ? tintColor : (d.strokeColor ?? 'none')}
          strokeWidth={d.strokeColor ? 1.5 : 0}
          opacity="0.60"
        />
      ))}

      {/* ══ NECK + HEAD ══ */}
      <path d={ADULT_BODY.neck} fill="url(#amBodyGrad)" />
      <path d={ADULT_BODY.neck} fill="url(#amTopFade)" opacity="0.5" />
      <path d={ADULT_BODY.neck} fill="none" stroke={ivoryDark} strokeWidth="0.6" opacity="0.4" />

      {/* Head — smooth, featureless mannequin oval */}
      <path d={ADULT_BODY.head} fill="url(#amBodyGrad)" filter="url(#amSoftShadow)" />
      <path d={ADULT_BODY.head} fill="url(#amTopFade)" opacity="0.55" />
      {/* Subtle face plane hints — mannequin style, NOT facial features */}
      <ellipse cx="185" cy="82" rx="12" ry="9" fill="rgba(190,182,172,0.18)" />
      <ellipse cx="215" cy="82" rx="12" ry="9" fill="rgba(190,182,172,0.18)" />
      {/* Chin plane */}
      <path d="M 186 108 Q 200 114 214 108" fill="none"
        stroke="rgba(180,172,162,0.22)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Head center seam */}
      <line x1="200" y1="28" x2="200" y2="136"
        stroke={ivoryDark} strokeWidth="0.5" strokeDasharray="3,4" opacity="0.28" />
      <path d={ADULT_BODY.head} fill="none" stroke={ivoryDark} strokeWidth="0.8" opacity="0.45" />

      {/* ══ MANNEQUIN STAND ══ */}
      <path d={ADULT_BODY.stand} fill="url(#amStandGrad)" />
      <path d={ADULT_BODY.standBase} fill="#B0A8A0" />
      <ellipse cx="200" cy="761" rx="70" ry="8" fill="#C0B8B0" />
    </svg>
  )
}
