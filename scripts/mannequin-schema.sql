-- ═══════════════════════════════════════════════════════════════════════════
-- GOFABRIKOS — DIGITAL MANNEQUIN SYSTEM DATABASE SCHEMA
-- GoFabrikos · Naari Fashions Pvt Ltd
-- Run this in: Supabase → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- ENUM TYPES
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TYPE mannequin_type AS ENUM (
  'adult-female',
  'kids-girl'
);

CREATE TYPE mannequin_view AS ENUM (
  'front',
  'back',
  'left-3q',
  'right-3q',
  'side'
);

CREATE TYPE adult_garment_type AS ENUM (
  'saree',
  'chudidhar',
  'lehenga',
  'lehenga-voni',
  'gown',
  'dress-dupatta',
  'blouse'
);

CREATE TYPE kids_garment_type AS ENUM (
  'frock',
  'party-frock',
  'lehenga',
  'lehenga-voni',
  'chudidhar',
  'dress',
  'dress-dupatta'
);

CREATE TYPE mannequin_job_status AS ENUM (
  'pending',
  'processing',
  'review',
  'approved',
  'rejected',
  'manual-review'
);

CREATE TYPE image_generation_provider AS ENUM (
  'manual',         -- Phase 1: Admin manually composited
  'cloudinary',     -- Cloudinary AI tools
  'replicate',      -- Replicate.com (ControlNet / IP-Adapter)
  'fal',            -- Fal.ai
  'stability',      -- Stability AI
  'custom'          -- Custom/internal model
);


-- ─────────────────────────────────────────────────────────────────────────────
-- PRODUCTS TABLE
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS products (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku               VARCHAR(100) UNIQUE NOT NULL,
  name              VARCHAR(255) NOT NULL,
  slug              VARCHAR(255) UNIQUE NOT NULL,

  -- Category / Type
  category          VARCHAR(100) NOT NULL,         -- e.g. 'Saree', 'Chudidhar fabric'
  subcategory       VARCHAR(100),
  fabric_type       VARCHAR(100),                  -- e.g. 'Silk', 'Cotton', 'Georgette'
  customer_segment  VARCHAR(20) DEFAULT 'adult',   -- 'adult' | 'kids'
  garment_type      VARCHAR(50),                   -- adult_garment_type or kids_garment_type

  -- Pricing
  price             NUMERIC(10,2) NOT NULL,
  mrp               NUMERIC(10,2),
  unit              VARCHAR(20) DEFAULT 'per_meter', -- 'per_meter' | 'per_piece'
  min_quantity      NUMERIC(5,2) DEFAULT 1.0,
  quantity_step     NUMERIC(5,2) DEFAULT 0.5,

  -- Fabric details
  color             VARCHAR(100),
  color_hex         VARCHAR(7),                    -- e.g. '#C8102E'
  width_cm          NUMERIC(6,2),
  weight_gsm        NUMERIC(6,2),
  origin            VARCHAR(100),                  -- e.g. 'Varanasi', 'Kanchipuram'
  occasion          VARCHAR(255),
  care_instructions TEXT,
  description       TEXT,

  -- Status
  in_stock          BOOLEAN DEFAULT true,
  is_active         BOOLEAN DEFAULT true,
  is_featured       BOOLEAN DEFAULT false,

  -- SEO
  meta_title        VARCHAR(255),
  meta_description  TEXT,

  -- Ratings (denormalized for performance)
  rating            NUMERIC(3,2) DEFAULT 0,
  review_count      INTEGER DEFAULT 0,

  -- Timestamps
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- PRODUCT IMAGES TABLE
-- Stores all image variants for a product.
-- Maintains original → processed → mannequin chain.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS product_images (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id        UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku               VARCHAR(100) NOT NULL,           -- denormalized for easy query

  -- Image variant
  variant           VARCHAR(30) NOT NULL,
  -- Values: 'original' | 'processed' | 'mannequin-front' |
  --         'mannequin-back' | 'mannequin-3q-left' | 'mannequin-3q-right' |
  --         'detail-border' | 'detail-pallu' | 'detail-embroidery' | 'thumbnail'

  -- Cloudinary / storage info
  cloudinary_public_id  VARCHAR(500),               -- e.g. gofabrikos/products/SKU-001/mannequin/front
  url_original          TEXT,                       -- full-res (1600×2000)
  url_1200              TEXT,                       -- 1200×1500
  url_800               TEXT,                       -- 800×1000
  url_thumb             TEXT,                       -- thumbnail
  url_webp              TEXT,                       -- WebP version

  -- Image specs
  width_px          INTEGER,
  height_px         INTEGER,
  aspect_ratio      VARCHAR(10),                    -- e.g. '4:5'
  format            VARCHAR(10),                    -- 'jpg' | 'webp' | 'png' | 'avif'
  file_size_bytes   INTEGER,

  -- Sort order for gallery
  sort_order        INTEGER DEFAULT 0,
  is_primary        BOOLEAN DEFAULT false,
  alt_text          VARCHAR(500),

  -- Timestamps
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- MANNEQUIN JOBS TABLE
-- One row per mannequin image generation attempt.
-- Full audit trail: every attempt, decision, reason, and metadata.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS mannequin_jobs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Product linkage
  product_id        UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku               VARCHAR(100) NOT NULL,
  product_image_id  UUID REFERENCES product_images(id), -- the 'original' source image

  -- Mannequin configuration
  mannequin_type    mannequin_type NOT NULL,
  view              mannequin_view NOT NULL DEFAULT 'front',
  garment_type      VARCHAR(50) NOT NULL,            -- adult or kids garment type

  -- Image URLs (Cloudinary paths)
  original_image_url   TEXT,                         -- source product photo
  processed_image_url  TEXT,                         -- after background removal
  mannequin_image_url  TEXT,                         -- final composite/generated image

  -- Generation metadata
  provider          image_generation_provider NOT NULL DEFAULT 'manual',
  model_version     VARCHAR(200),                    -- e.g. 'replicate/...@sha256:...'
  generation_params JSONB,                           -- full params sent to AI API
  generation_time_ms INTEGER,                        -- how long generation took

  -- Status & review
  status            mannequin_job_status NOT NULL DEFAULT 'pending',

  -- Quality checklist (stored as JSONB array of {field, passed, note})
  quality_flags     JSONB,
  -- Example:
  -- [{"field": "color", "passed": true}, {"field": "border", "passed": false, "note": "border missing"}]

  -- Admin review
  reviewed_by       VARCHAR(255),                    -- admin email or name
  reviewed_at       TIMESTAMPTZ,
  rejection_reason  TEXT,

  -- Output image reference
  output_image_id   UUID REFERENCES product_images(id),

  -- Attempt tracking (for regenerate history)
  attempt_number    INTEGER DEFAULT 1,               -- 1 = first, 2 = first regen, etc.
  parent_job_id     UUID REFERENCES mannequin_jobs(id), -- if this is a regen of another job

  -- Timestamps
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- MANNEQUIN TEMPLATES TABLE
-- Registry of available mannequin templates/SVGs.
-- Extensible: new mannequins can be added without code changes.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS mannequin_templates (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code              VARCHAR(50) UNIQUE NOT NULL,     -- e.g. 'adult-female-v1-front'
  label             VARCHAR(100) NOT NULL,           -- e.g. 'Adult Female · Front View · v1'
  mannequin_type    mannequin_type NOT NULL,
  view              mannequin_view NOT NULL DEFAULT 'front',
  version           VARCHAR(20) DEFAULT 'v1',

  -- SVG / image info
  svg_component     VARCHAR(255),                    -- React component name
  png_url           TEXT,                            -- Static PNG base (Phase 2+)
  viewbox           VARCHAR(50),                     -- e.g. '0 0 400 780'
  aspect_ratio      VARCHAR(10) DEFAULT '4:5',

  -- Supported garments
  supported_garments JSONB,                          -- array of garment type strings
  -- Example: ["saree", "lehenga", "chudidhar", "gown", "dress-dupatta", "blouse"]

  is_active         BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- IMAGE AUDIT LOG
-- Immutable log of every action on every mannequin image.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS image_audit_log (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id            UUID REFERENCES mannequin_jobs(id),
  product_id        UUID REFERENCES products(id),
  sku               VARCHAR(100),

  action            VARCHAR(50) NOT NULL,
  -- Values: 'uploaded' | 'bg-removed' | 'generated' | 'submitted-for-review' |
  --         'approved' | 'rejected' | 'manual-review-flagged' | 'regenerated' |
  --         'published' | 'unpublished' | 'replaced'

  performed_by      VARCHAR(255),                    -- admin email
  details           JSONB,                           -- arbitrary action details
  ip_address        INET,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);


-- ─────────────────────────────────────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_products_sku         ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_slug        ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category    ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active      ON products(is_active, in_stock);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_variant  ON product_images(product_id, variant);

CREATE INDEX IF NOT EXISTS idx_mannequin_jobs_product ON mannequin_jobs(product_id);
CREATE INDEX IF NOT EXISTS idx_mannequin_jobs_status  ON mannequin_jobs(status);
CREATE INDEX IF NOT EXISTS idx_mannequin_jobs_sku     ON mannequin_jobs(sku);

CREATE INDEX IF NOT EXISTS idx_audit_log_product ON image_audit_log(product_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_job     ON image_audit_log(job_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action  ON image_audit_log(action);


-- ─────────────────────────────────────────────────────────────────────────────
-- SEED: MANNEQUIN TEMPLATES
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO mannequin_templates (code, label, mannequin_type, view, svg_component, viewbox, supported_garments) VALUES
(
  'adult-female-v1-front',
  'Adult Female · Front View · v1',
  'adult-female',
  'front',
  'AdultFemaleMannequin',
  '0 0 400 780',
  '["saree","chudidhar","lehenga","lehenga-voni","gown","dress-dupatta","blouse"]'
),
(
  'kids-girl-v1-front',
  'Kids / Girl · Front View · v1',
  'kids-girl',
  'front',
  'KidsGirlMannequin',
  '0 0 360 682',
  '["frock","party-frock","lehenga","lehenga-voni","chudidhar","dress","dress-dupatta"]'
)
ON CONFLICT (code) DO NOTHING;


-- ─────────────────────────────────────────────────────────────────────────────
-- SEED: 5 SAMPLE PRODUCTS (Phase 1 test set)
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO products (sku, name, slug, category, fabric_type, customer_segment, garment_type, price, mrp, unit, color, origin, description, in_stock, is_active, is_featured)
VALUES
  ('KAN-SILK-RED-001',  'Kanjivaram Pure Silk',          'kanjivaram-pure-silk',          'Saree',           'Silk',      'adult', 'saree',        1200.00, 1500.00, 'per_meter', 'Red & Gold',    'Kanchipuram', 'Authentic Kanjivaram silk with zari border',          true, true,  true),
  ('CHAN-DIG-MUL-002',  'Mull Chanderi Digital Print',   'mull-chanderi-digital-print',   'Chudidhar fabric','Chanderi',  'adult', 'chudidhar',     125.00,  150.00, 'per_meter', 'Multicolor',    'Chanderi',    'Soft Mull Chanderi with vibrant digital print',       true, true,  false),
  ('GEO-EMB-PNK-003',  'Georgette Embroidered',         'georgette-embroidered-fabric',  'Lehenga fabric',  'Georgette', 'adult', 'lehenga',       320.00,  400.00, 'per_meter', 'Pink',          'Surat',       'Embroidered georgette perfect for lehenga sets',     true, true,  true),
  ('BAN-BRO-GLD-004',  'Banarasi Brocade Gold',         'pure-silk-banarasi-brocade',    'Gown fabric',     'Banarasi',  'adult', 'gown',          850.00, 1100.00, 'per_meter', 'Gold & Maroon', 'Varanasi',    'Rich Banarasi brocade with gold zari work',          true, true,  true),
  ('KDS-FRK-BLU-005',  'Kids Floral Cotton Frock',      'kids-floral-cotton-frock',      'Kids Frock',      'Cotton',    'kids',  'party-frock',   180.00,  220.00, 'per_piece', 'Blue & White',  'Jaipur',      'Soft breathable cotton frock for girls age 4-12',    true, true,  false)
ON CONFLICT (sku) DO NOTHING;


-- ─────────────────────────────────────────────────────────────────────────────
-- UPDATED_AT TRIGGER
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_images_updated_at
  BEFORE UPDATE ON product_images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mannequin_jobs_updated_at
  BEFORE UPDATE ON mannequin_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ─────────────────────────────────────────────────────────────────────────────
-- USEFUL VIEWS
-- ─────────────────────────────────────────────────────────────────────────────

-- Products with their mannequin image status
CREATE OR REPLACE VIEW v_product_mannequin_status AS
SELECT
  p.id,
  p.sku,
  p.name,
  p.category,
  p.garment_type,
  p.customer_segment,
  COUNT(DISTINCT mj.id) AS total_jobs,
  COUNT(DISTINCT CASE WHEN mj.status = 'approved' THEN mj.id END) AS approved_jobs,
  COUNT(DISTINCT CASE WHEN mj.status = 'pending' THEN mj.id END) AS pending_jobs,
  COUNT(DISTINCT CASE WHEN mj.status = 'manual-review' THEN mj.id END) AS needs_review,
  BOOL_OR(mj.status = 'approved') AS has_approved_mannequin,
  MAX(mj.created_at) AS last_job_at
FROM products p
LEFT JOIN mannequin_jobs mj ON mj.product_id = p.id
WHERE p.is_active = true
GROUP BY p.id, p.sku, p.name, p.category, p.garment_type, p.customer_segment;

-- Latest approved mannequin image per product per view
CREATE OR REPLACE VIEW v_product_approved_images AS
SELECT DISTINCT ON (mj.product_id, mj.view)
  mj.product_id,
  mj.sku,
  mj.view,
  mj.mannequin_type,
  mj.garment_type,
  mj.mannequin_image_url,
  mj.reviewed_by,
  mj.reviewed_at
FROM mannequin_jobs mj
WHERE mj.status = 'approved'
  AND mj.mannequin_image_url IS NOT NULL
ORDER BY mj.product_id, mj.view, mj.reviewed_at DESC;

-- ═══════════════════════════════════════════════════════════════════════════
-- END OF MANNEQUIN SCHEMA
-- To run: Supabase → SQL Editor → paste this file → Run
-- ═══════════════════════════════════════════════════════════════════════════
