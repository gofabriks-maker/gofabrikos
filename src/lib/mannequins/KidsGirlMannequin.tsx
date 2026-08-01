'use client'
// ─── KIDS / GIRL MANNEQUIN — Front View ──────────────────────────────────────
// GoFabrikos Digital Mannequin System · Phase 1
//
// Appearance: Faceless · Ivory/off-white · Child proportions (NOT miniature adult)
// Key differences from adult: larger head-to-body ratio, shorter limbs,
//   rounder torso, no adult curves — age-appropriate for 4–14 year range
//
// ViewBox: 0 0 360 680  (4:5 ratio)
//
// Body landmarks (child proportions — 5.5 head heights total):
//   Head center: (180, 60)   Head height: ~80px
//   Neck base: y ≈ 116
//   Shoulders: y ≈ 128, span x = 105..255
//   Waist: y ≈ 270, x = 130..230
//   Hip: y ≈ 320, x = 118..242
//   Crotch: y ≈ 358
//   Knee: y ≈ 480
//   Ankle: y ≈ 600
//   Floor: y ≈ 628

import { GarmentDefinition, KidsGarmentType } from './types'

export const KIDS_GARMENT_DEFS: Record<KidsGarmentType, GarmentDefinition> = {
  frock: {
    type: 'frock',
    label: 'Frock',
    emoji: '👗',
    metersKids: '2–3 m',
    regions: [
      {
        id: 'frock-bodice',
        label: 'Bodice',
        zIndex: 1,
        path: `M 105 130 C 90 138, 82 152, 80 170
               L 78 208 C 78 226, 82 240, 88 252
               L 94 286 L 266 286 L 272 252
               C 278 240, 282 226, 282 208
               L 280 170 C 278 152, 270 138, 255 130
               C 232 120, 208 116, 180 116
               C 152 116, 128 120, 105 130 Z`,
      },
      {
        id: 'frock-skirt',
        label: 'Skirt',
        zIndex: 1,
        // A-line flare from waist to mid-calf
        path: `M 90 290 C 72 302, 56 326, 42 370 L 18 628 L 342 628 L 318 370
               C 304 326, 288 302, 270 290 Z`,
      },
    ],
    decorative: [
      // Hem border
      { path: `M 18 620 Q 180 630 342 620 L 342 628 Q 180 638 18 628 Z`, fillColor: 'currentColor' },
    ],
  },

  'party-frock': {
    type: 'party-frock',
    label: 'Party Frock',
    emoji: '🎀',
    metersKids: '2.5–3.5 m',
    regions: [
      {
        id: 'pfrock-bodice',
        label: 'Bodice',
        zIndex: 2,
        path: `M 112 130 C 98 138, 90 152, 88 170
               L 86 210 C 86 228, 90 242, 96 254
               L 100 278 L 260 278 L 264 254
               C 270 242, 274 228, 274 210
               L 272 170 C 270 152, 262 138, 248 130
               C 226 120, 204 116, 180 116
               C 156 116, 134 120, 112 130 Z`,
      },
      {
        id: 'pfrock-skirt',
        label: 'Full Skirt',
        zIndex: 1,
        // Very full party skirt with big flare
        path: `M 96 282 C 74 296, 50 328, 26 382 L 0 628 L 360 628 L 334 382
               C 310 328, 286 296, 264 282 Z`,
      },
    ],
    decorative: [
      { path: `M 0 618 Q 180 630 360 618 L 360 628 Q 180 640 0 628 Z`, fillColor: 'currentColor' },
    ],
  },

  lehenga: {
    type: 'lehenga',
    label: 'Lehenga',
    emoji: '👘',
    metersKids: '2–4 m',
    regions: [
      {
        id: 'klehenga-choli',
        label: 'Choli',
        zIndex: 2,
        path: `M 118 130 C 104 138, 96 150, 94 166
               L 92 216 C 92 232, 96 244, 102 254
               L 106 268 L 254 268 L 258 254
               C 264 244, 268 232, 268 216
               L 266 166 C 264 150, 256 138, 242 130
               C 222 120, 202 116, 180 116
               C 158 116, 138 120, 118 130 Z`,
      },
      {
        id: 'klehenga-skirt',
        label: 'Lehenga Skirt',
        zIndex: 1,
        path: `M 100 280 C 78 294, 54 322, 32 372 L 8 628 L 352 628 L 328 372
               C 306 322, 282 294, 260 280 Z`,
      },
    ],
    decorative: [
      { path: `M 8 618 Q 180 630 352 618 L 352 628 Q 180 640 8 628 Z`, fillColor: 'currentColor' },
    ],
  },

  'lehenga-voni': {
    type: 'lehenga-voni',
    label: 'Lehenga Voni / Half Saree',
    emoji: '🥻',
    metersKids: '2–4 m',
    regions: [
      {
        id: 'kvoni-blouse',
        label: 'Blouse',
        zIndex: 2,
        path: `M 118 130 C 104 138, 96 150, 94 166 L 92 216
               C 92 232, 96 244, 102 254 L 106 268 L 254 268
               L 258 254 C 264 244, 268 232, 268 216 L 266 166
               C 264 150, 256 138, 242 130 C 222 120, 202 116, 180 116
               C 158 116, 138 120, 118 130 Z`,
      },
      {
        id: 'kvoni-skirt',
        label: 'Skirt / Langa',
        zIndex: 1,
        path: `M 102 278 C 82 292, 60 318, 40 364 L 16 628 L 344 628 L 320 364
               C 300 318, 278 292, 258 278 Z`,
      },
      {
        id: 'kvoni-dupatta',
        label: 'Voni / Dupatta',
        zIndex: 3,
        path: `M 105 130 C 88 146, 76 170, 68 200 C 60 230, 60 258, 66 284
               C 72 268, 78 246, 82 222 C 88 196, 96 172, 108 150 Z`,
      },
    ],
    decorative: [
      { path: `M 16 618 Q 180 630 344 618 L 344 628 Q 180 640 16 628 Z`, fillColor: 'currentColor' },
    ],
  },

  chudidhar: {
    type: 'chudidhar',
    label: 'Chudidhar',
    emoji: '👗',
    metersKids: '2–3.5 m',
    regions: [
      {
        id: 'kchudi-top',
        label: 'Kameez',
        zIndex: 2,
        path: `M 105 130 C 88 138, 80 152, 78 170
               L 76 210 C 74 230, 78 248, 84 264
               C 88 278, 92 294, 94 310
               L 96 390 L 264 390 L 266 310
               C 268 294, 272 278, 276 264
               C 282 248, 286 230, 284 210
               L 282 170 C 280 152, 272 138, 255 130
               C 232 120, 208 116, 180 116
               C 152 116, 128 120, 105 130 Z`,
      },
      {
        id: 'kchudi-pants',
        label: 'Churidar / Pants',
        zIndex: 1,
        path: `M 96 390 L 94 450 L 106 530 L 124 622 L 152 628 L 150 536 L 138 454 L 138 390 Z
               M 264 390 L 266 450 L 254 530 L 236 622 L 208 628 L 210 536 L 222 454 L 222 390 Z
               M 138 390 L 138 454 L 150 536 L 152 628 L 208 628 L 210 536 L 222 454 L 222 390 Z`,
      },
    ],
  },

  dress: {
    type: 'dress',
    label: 'Dress',
    emoji: '👚',
    metersKids: '2–3 m',
    regions: [
      {
        id: 'kdress-main',
        label: 'Dress',
        zIndex: 1,
        // Simple dress from shoulder to knee
        path: `M 105 130 C 88 138, 80 152, 78 170
               L 76 210 C 74 230, 78 246, 84 260
               C 88 274, 92 290, 94 308
               L 82 530 L 278 530 L 266 308
               C 268 290, 272 274, 276 260
               C 282 246, 286 230, 284 210
               L 282 170 C 280 152, 272 138, 255 130
               C 232 120, 208 116, 180 116
               C 152 116, 128 120, 105 130 Z`,
      },
    ],
    decorative: [
      { path: `M 82 522 Q 180 532 278 522 L 278 530 Q 180 540 82 530 Z`, fillColor: 'currentColor' },
    ],
  },

  'dress-dupatta': {
    type: 'dress-dupatta',
    label: 'Dress with Dupatta',
    emoji: '👗',
    metersKids: '2.5–3.5 m',
    regions: [
      {
        id: 'kdressd-main',
        label: 'Dress',
        zIndex: 1,
        path: `M 105 130 C 88 138, 80 152, 78 170
               L 76 210 C 74 230, 78 246, 84 260
               C 88 274, 92 292, 94 312
               L 82 540 L 278 540 L 266 312
               C 268 292, 272 274, 276 260
               C 282 246, 286 230, 284 210
               L 282 170 C 280 152, 272 138, 255 130
               C 232 120, 208 116, 180 116
               C 152 116, 128 120, 105 130 Z`,
      },
      {
        id: 'kdressd-dupatta',
        label: 'Dupatta',
        zIndex: 2,
        path: `M 105 130 C 90 144, 78 166, 72 192 C 66 218, 66 242, 70 264
               C 76 250, 82 228, 86 204 C 92 178, 98 158, 108 144 Z
               M 255 130 C 270 144, 282 166, 288 192 C 294 218, 294 242, 290 264
               C 284 250, 278 228, 274 204 C 268 178, 262 158, 252 144 Z`,
      },
    ],
    decorative: [
      { path: `M 82 532 Q 180 542 278 532 L 278 540 Q 180 550 82 540 Z`, fillColor: 'currentColor' },
    ],
  },
}

// ── KIDS MANNEQUIN BODY PATHS ─────────────────────────────────────────────────
export const KIDS_BODY = {
  torsoLegs: `
    M 148 116
    C 130 120, 115 128, 105 138
    C 92 148, 84 162, 81 178
    C 78 194, 78 214, 80 234
    C 82 254, 88 270, 94 286
    C 100 300, 104 316, 104 332
    C 104 352, 102 370, 100 390
    C 98 412, 97 432, 98 456
    C 100 476, 104 498, 108 520
    C 112 542, 116 564, 118 588
    L 118 628
    C 118 633, 123 636, 130 636
    L 152 636 C 159 636, 162 633, 162 628
    L 160 360
    C 160 355, 165 352, 172 352
    C 179 352, 180 352, 180 352
    C 180 352, 181 352, 188 352
    C 195 352, 200 355, 200 360
    L 198 628 C 198 633, 201 636, 208 636
    L 230 636 C 237 636, 242 633, 242 628
    L 242 588 C 244 564, 248 542, 252 520
    C 256 498, 260 476, 262 456
    C 263 432, 262 412, 260 390
    C 258 370, 256 352, 256 332
    C 256 316, 260 300, 266 286
    C 272 270, 278 254, 280 234
    C 282 214, 282 194, 279 178
    C 276 162, 268 148, 255 138
    C 245 128, 230 120, 212 116
    Z
  `,
  leftArm: `
    M 81 178 C 70 190, 60 210, 54 234
    C 48 258, 48 282, 52 304
    C 56 326, 58 342, 58 354
    C 60 364, 58 370, 56 374
    C 62 377, 68 375, 70 368
    C 72 358, 72 342, 72 320
    C 72 296, 70 272, 72 250
    C 74 228, 80 208, 86 190 Z
  `,
  rightArm: `
    M 279 178 C 290 190, 300 210, 306 234
    C 312 258, 312 282, 308 304
    C 304 326, 302 342, 302 354
    C 300 364, 302 370, 304 374
    C 298 377, 292 375, 290 368
    C 288 358, 288 342, 288 320
    C 288 296, 290 272, 288 250
    C 286 228, 280 208, 274 190 Z
  `,
  // KIDS HEAD — larger relative to body, rounder, more child-proportioned
  head: `M 180 14 C 208 14, 230 28, 234 52 C 238 76, 230 98, 218 110
          C 207 122, 193 128, 180 128 C 167 128, 153 122, 142 110
          C 130 98, 122 76, 126 52 C 130 28, 152 14, 180 14 Z`,
  neck: `M 160 112 C 168 122, 175 128, 180 128 C 185 128, 192 122, 200 112
          L 202 136 C 194 142, 187 144, 180 144 C 173 144, 166 142, 158 136 Z`,
  stand: `M 148 636 L 142 658 L 218 658 L 212 636 Z`,
  standBase: `M 120 658 Q 180 665 240 658 L 240 663 Q 180 670 120 663 Z`,
}

// ── REACT COMPONENT ───────────────────────────────────────────────────────────

interface KidsMannequinProps {
  garmentType: KidsGarmentType
  productImageUrl?: string
  tintColor?: string
  showLabels?: boolean
  className?: string
  style?: React.CSSProperties
}

export default function KidsGirlMannequin({
  garmentType,
  productImageUrl,
  tintColor = '#C06090',
  showLabels = false,
  className = '',
  style,
}: KidsMannequinProps) {
  const garmentDef = KIDS_GARMENT_DEFS[garmentType]
  if (!garmentDef) return null

  const ivory = '#EDE8E0'
  const ivoryDark = '#D4CFC6'
  const ivoryLight = '#F5F2EE'

  return (
    <svg
      viewBox="0 0 360 682"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={`w-full h-full ${className}`}
      style={style}
      aria-label={`Kids/girl mannequin wearing ${garmentDef.label}`}
    >
      <defs>
        <linearGradient id="kmBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={ivoryDark} />
          <stop offset="20%" stopColor={ivory} />
          <stop offset="50%" stopColor={ivoryLight} />
          <stop offset="80%" stopColor={ivory} />
          <stop offset="100%" stopColor={ivoryDark} />
        </linearGradient>
        <linearGradient id="kmTopFade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.20)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.12)" />
        </linearGradient>
        <linearGradient id="kmGarmentShade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.18)" />
          <stop offset="25%" stopColor="rgba(0,0,0,0.03)" />
          <stop offset="75%" stopColor="rgba(0,0,0,0.02)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.16)" />
        </linearGradient>
        <linearGradient id="kmGarmentFade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.13)" />
        </linearGradient>
        <linearGradient id="kmStandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#BFBAB2" />
          <stop offset="100%" stopColor="#A0A098" />
        </linearGradient>

        {productImageUrl && (
          <pattern id="kmProductPat" patternUnits="userSpaceOnUse"
            x="40" y="110" width="280" height="540">
            <image href={productImageUrl} x="0" y="0" width="280" height="540"
              preserveAspectRatio="xMidYMid slice" />
          </pattern>
        )}

        {garmentDef.regions.map(r => (
          <clipPath key={`kcp-${r.id}`} id={`kcp-${r.id}`}>
            <path d={r.path} />
          </clipPath>
        ))}

        <filter id="kmShadow" x="-8%" y="-3%" width="116%" height="110%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.16)" />
        </filter>
        <filter id="kmSoftShadow" x="-5%" y="-2%" width="110%" height="108%">
          <feDropShadow dx="0" dy="2" stdDeviation="3.5" floodColor="rgba(0,0,0,0.13)" />
        </filter>
        <filter id="kmBlur">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      {/* Background */}
      <rect width="360" height="682" fill="#F0EDE8" />
      {/* Floor shadow */}
      <ellipse cx="180" cy="662" rx="76" ry="10" fill="rgba(0,0,0,0.08)" filter="url(#kmBlur)" />

      {/* Arms */}
      <path d={KIDS_BODY.leftArm} fill="url(#kmBodyGrad)" />
      <path d={KIDS_BODY.leftArm} fill="url(#kmTopFade)" opacity="0.6" />
      <path d={KIDS_BODY.leftArm} fill="none" stroke={ivoryDark} strokeWidth="0.5" opacity="0.5" />
      <path d={KIDS_BODY.rightArm} fill="url(#kmBodyGrad)" />
      <path d={KIDS_BODY.rightArm} fill="url(#kmTopFade)" opacity="0.6" />
      <path d={KIDS_BODY.rightArm} fill="none" stroke={ivoryDark} strokeWidth="0.5" opacity="0.5" />

      {/* Body */}
      <path d={KIDS_BODY.torsoLegs} fill="url(#kmBodyGrad)" filter="url(#kmShadow)" />
      <path d={KIDS_BODY.torsoLegs} fill="url(#kmTopFade)" opacity="0.55" />
      <line x1="180" y1="116" x2="180" y2="636"
        stroke={ivoryDark} strokeWidth="0.5" strokeDasharray="3,4" opacity="0.30" />
      <path d={KIDS_BODY.torsoLegs} fill="none" stroke={ivoryDark} strokeWidth="0.8" opacity="0.5" />

      {/* Garment */}
      {[...garmentDef.regions]
        .sort((a, b) => a.zIndex - b.zIndex)
        .map(region => (
          <g key={region.id} filter="url(#kmSoftShadow)">
            <path d={region.path}
              fill={productImageUrl ? 'url(#kmProductPat)' : tintColor}
              clipPath={`url(#kcp-${region.id})`}
              opacity={productImageUrl ? (region.opacity ?? 0.95) : 0.80}
            />
            <path d={region.path} fill="url(#kmGarmentShade)" opacity="0.48"
              clipPath={`url(#kcp-${region.id})`} />
            <path d={region.path} fill="url(#kmGarmentFade)" opacity="0.35"
              clipPath={`url(#kcp-${region.id})`} />
            <path d={region.path} fill="none" stroke="rgba(0,0,0,0.09)" strokeWidth="0.7" />
          </g>
        ))}

      {garmentDef.decorative?.map((d, i) => (
        <path key={i} d={d.path}
          fill={d.fillColor === 'currentColor' ? tintColor : (d.fillColor ?? 'none')}
          stroke={d.strokeColor === 'currentColor' ? tintColor : (d.strokeColor ?? 'none')}
          strokeWidth={d.strokeColor ? 1.5 : 0}
          opacity="0.58"
        />
      ))}

      {/* Neck */}
      <path d={KIDS_BODY.neck} fill="url(#kmBodyGrad)" />
      <path d={KIDS_BODY.neck} fill="url(#kmTopFade)" opacity="0.5" />
      <path d={KIDS_BODY.neck} fill="none" stroke={ivoryDark} strokeWidth="0.5" opacity="0.4" />

      {/* Head — bigger, rounder, child-proportioned, completely featureless */}
      <path d={KIDS_BODY.head} fill="url(#kmBodyGrad)" filter="url(#kmSoftShadow)" />
      <path d={KIDS_BODY.head} fill="url(#kmTopFade)" opacity="0.55" />
      {/* Very subtle facial plane (no features — mannequin style) */}
      <ellipse cx="168" cy="70" rx="10" ry="8" fill="rgba(190,182,172,0.15)" />
      <ellipse cx="192" cy="70" rx="10" ry="8" fill="rgba(190,182,172,0.15)" />
      <line x1="180" y1="14" x2="180" y2="116"
        stroke={ivoryDark} strokeWidth="0.5" strokeDasharray="3,4" opacity="0.25" />
      <path d={KIDS_BODY.head} fill="none" stroke={ivoryDark} strokeWidth="0.7" opacity="0.40" />

      {/* Stand */}
      <path d={KIDS_BODY.stand} fill="url(#kmStandGrad)" />
      <path d={KIDS_BODY.standBase} fill="#B0A8A0" />
      <ellipse cx="180" cy="661" rx="62" ry="7" fill="#C0B8B0" />
    </svg>
  )
}
