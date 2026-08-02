-- ═══════════════════════════════════════════════════════════════════
-- GoFabrikos · Seed Data — 12 Products
-- Run AFTER schema.sql in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════

insert into products (
  slug, name, full_name, price, original_price, discount,
  category, fabric_type, print_type, gsm, composition, season, wash_care,
  description, metres_per_garment, rating, ratings_count,
  stock_left, is_new_arrival, is_trending,
  viewing_now, likes, views_today, orders_today,
  image_url, images, designs, tags
) values

-- 1. Mull Chanderi
(
  'mull-chanderi-digital-print',
  'Mull Chanderi Digital Print',
  'Mull Chanderi Digital Print — Ivory & Rose',
  125, 160, 22,
  'Kurti Fabrics', 'Chanderi Silk-Cotton', 'Digital Print', 90, '70% Cotton 30% Silk', 'All Season', 'Dry clean recommended',
  'Lightweight Mull Chanderi with contemporary digital floral print. Perfect for salwar suits and light sarees.',
  5.5, 4.7, 312,
  65, true, false,
  8, 234, 892, 14,
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80','https://images.unsplash.com/photo-1594938298603-c8148c4f4d47?w=600&q=80'],
  '[{"name":"Ivory Rose","img":"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80","inStock":true},{"name":"Sage Green","img":"https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&q=80","inStock":true},{"name":"Coral Pink","img":"https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=200&q=80","inStock":false}]'::jsonb,
  ARRAY['chanderi','digital print','lightweight','salwar','summer']
),

-- 2. Pure Silk Banarasi Brocade
(
  'pure-silk-banarasi-brocade',
  'Pure Silk Banarasi Brocade',
  'Pure Silk Banarasi Brocade — Gold Zari',
  850, 1100, 23,
  'Designer Sarees', 'Pure Silk', 'Brocade Weave', 180, '100% Pure Silk', 'Winter & Festive', 'Dry clean only',
  'Authentic Banarasi brocade with real gold zari work. Sourced directly from master weavers of Varanasi.',
  6.5, 4.9, 187,
  28, false, true,
  12, 567, 1243, 22,
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
  ARRAY['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80','https://images.unsplash.com/photo-1594938298603-c8148c4f4d47?w=600&q=80'],
  '[{"name":"Gold Zari","img":"https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&q=80","inStock":true},{"name":"Silver Zari","img":"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80","inStock":true},{"name":"Copper Zari","img":"https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=200&q=80","inStock":true}]'::jsonb,
  ARRAY['banarasi','silk','zari','brocade','wedding','festive']
),

-- 3. Handloom Khadi Cotton
(
  'handloom-khadi-cotton',
  'Handloom Khadi Cotton',
  'Handloom Khadi Cotton — Natural Cream',
  280, 340, 18,
  'Plain Fabrics', 'Khadi Cotton', 'Plain / Handloom', 120, '100% Cotton', 'All Season', 'Machine wash cold',
  'Hand-spun and hand-woven Khadi cotton from certified KVIC artisans. Breathable and eco-friendly.',
  5.0, 4.6, 98,
  90, false, false,
  4, 145, 423, 7,
  'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&q=80',
  ARRAY['https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&q=80'],
  '[{"name":"Natural Cream","img":"https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=200&q=80","inStock":true},{"name":"Indigo Blue","img":"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80","inStock":true}]'::jsonb,
  ARRAY['khadi','cotton','handloom','eco','sustainable','casual']
),

-- 4. Kanjivaram Pure Silk
(
  'kanjivaram-pure-silk',
  'Kanjivaram Pure Silk',
  'Kanjivaram Pure Silk — Temple Border',
  1200, 1500, 20,
  'Designer Sarees', 'Pure Mulberry Silk', 'Temple Border Weave', 220, '100% Mulberry Silk', 'Wedding & Festive', 'Dry clean only',
  'Authentic Kanjivaram silk with traditional temple border. GI-tagged, sourced from Kanchipuram master weavers.',
  7.0, 4.9, 256,
  18, false, true,
  15, 678, 1567, 31,
  'https://images.unsplash.com/photo-1594938298603-c8148c4f4d47?w=600&q=80',
  ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4f4d47?w=600&q=80'],
  '[{"name":"Ruby Red","img":"https://images.unsplash.com/photo-1594938298603-c8148c4f4d47?w=200&q=80","inStock":true},{"name":"Royal Blue","img":"https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&q=80","inStock":true},{"name":"Emerald Green","img":"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80","inStock":false}]'::jsonb,
  ARRAY['kanjivaram','silk','saree','wedding','GI-tagged','kanchipuram']
),

-- 5. Georgette Embroidered
(
  'georgette-embroidered',
  'Georgette Embroidered',
  'Georgette Embroidered — Floral Sequin',
  320, 420, 24,
  'Blouse Fabrics', 'Georgette', 'Embroidered', 80, '100% Polyester', 'All Season', 'Hand wash cold',
  'Flowing georgette with delicate floral embroidery and sequin work. Ideal for evening wear and party suits.',
  3.5, 4.5, 143,
  55, true, false,
  7, 189, 612, 11,
  'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80',
  ARRAY['https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80'],
  '[{"name":"Black Sequin","img":"https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=200&q=80","inStock":true},{"name":"Wine Red","img":"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80","inStock":true}]'::jsonb,
  ARRAY['georgette','embroidered','sequin','party','evening wear']
),

-- 6. Linen Slub Plain
(
  'linen-slub-plain',
  'Linen Slub Plain',
  'Linen Slub Plain — Natural Sand',
  380, 460, 17,
  'Kurti Fabrics', 'Pure Linen', 'Plain Slub', 140, '100% Linen', 'Summer & Spring', 'Machine wash gentle',
  'Premium Belgian linen with natural slub texture. Breathable, cool fabric perfect for summer kurtas and shirts.',
  3.0, 4.6, 89,
  72, false, false,
  5, 112, 334, 6,
  'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80',
  ARRAY['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80'],
  '[{"name":"Natural Sand","img":"https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&q=80","inStock":true},{"name":"Slate Grey","img":"https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=200&q=80","inStock":true},{"name":"Off White","img":"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80","inStock":true}]'::jsonb,
  ARRAY['linen','slub','summer','kurta','breathable']
),

-- 7. Cotton Ikat Double
(
  'cotton-ikat-double',
  'Cotton Ikat Double',
  'Cotton Ikat Double — Pochampally Weave',
  450, 580, 22,
  'Lehenga Fabrics', 'Cotton', 'Double Ikat', 130, '100% Cotton', 'All Season', 'Machine wash cold',
  'Traditional Pochampally double ikat from Telangana. Each piece is unique — hand-dyed and handwoven by master weavers.',
  5.5, 4.7, 134,
  40, false, true,
  9, 267, 745, 13,
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'],
  '[{"name":"Classic Indigo","img":"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80","inStock":true},{"name":"Earth Brown","img":"https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&q=80","inStock":true}]'::jsonb,
  ARRAY['ikat','pochampally','double ikat','handloom','telangana']
),

-- 8. Mysore Silk Plain
(
  'mysore-silk-plain',
  'Mysore Silk Plain',
  'Mysore Silk Plain — Satin Finish',
  680, 820, 17,
  'Designer Sarees', 'Mysore Silk', 'Plain Satin', 160, '100% Silk', 'All Season', 'Dry clean only',
  'Karnataka Silk Industries certified Mysore Crepe Silk. Lustrous satin finish, lightweight yet rich drape.',
  6.0, 4.8, 78,
  35, true, false,
  6, 198, 521, 9,
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80',
  ARRAY['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80'],
  '[{"name":"Royal Purple","img":"https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&q=80","inStock":true},{"name":"Champagne","img":"https://images.unsplash.com/photo-1594938298603-c8148c4f4d47?w=200&q=80","inStock":true}]'::jsonb,
  ARRAY['mysore silk','plain silk','satin','Karnataka','saree']
),

-- 9. Handblock Dabu Print Cotton
(
  'handblock-dabu-print-cotton',
  'Handblock Dabu Print Cotton',
  'Handblock Dabu Print Cotton — Indigo Resist',
  380, 480, 21,
  'Kurti Fabrics', 'Cotton', 'Handblock / Dabu Print', 110, '100% Cotton', 'All Season', 'Machine wash cold',
  'Jaipur mud-resist Dabu print on soft cotton. Each piece is handblocked by artisans — slight variations are marks of authenticity.',
  3.0, 4.6, 112,
  58, false, false,
  5, 156, 412, 8,
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'],
  '[{"name":"Indigo White","img":"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80","inStock":true},{"name":"Madder Red","img":"https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=200&q=80","inStock":true}]'::jsonb,
  ARRAY['dabu print','handblock','Jaipur','cotton','indigo']
),

-- 10. Pashmina Wool Blend
(
  'pashmina-wool-blend',
  'Pashmina Wool Blend',
  'Pashmina Wool Blend — Winter Heritage',
  950, 1200, 21,
  'Dupattas', 'Pashmina Wool', 'Woven', 200, '70% Pashmina 30% Merino Wool', 'Winter', 'Dry clean only',
  'Exquisite pashmina-merino blend from Kashmir. Ultra-soft, lightweight warmth. Perfect for shawls and winter suits.',
  3.5, 4.9, 67,
  22, false, false,
  4, 189, 398, 5,
  'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&q=80',
  ARRAY['https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&q=80'],
  '[{"name":"Natural Beige","img":"https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=200&q=80","inStock":true},{"name":"Charcoal Grey","img":"https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&q=80","inStock":true}]'::jsonb,
  ARRAY['pashmina','wool','Kashmir','winter','shawl','warm']
),

-- 11. Sambalpuri Ikat Silk
(
  'sambalpuri-ikat-silk',
  'Sambalpuri Ikat Silk',
  'Sambalpuri Ikat Silk — Odisha GI-Tagged',
  780, 980, 20,
  'Lehenga Fabrics', 'Silk-Cotton', 'Single Ikat Weave', 170, '60% Silk 40% Cotton', 'All Season', 'Dry clean recommended',
  'GI-tagged Sambalpuri ikat from Odisha. Traditional fish, conch, and flower motifs woven by master craftsmen.',
  6.0, 4.8, 91,
  30, true, false,
  7, 234, 567, 10,
  'https://images.unsplash.com/photo-1594938298603-c8148c4f4d47?w=600&q=80',
  ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4f4d47?w=600&q=80'],
  '[{"name":"Traditional Red","img":"https://images.unsplash.com/photo-1594938298603-c8148c4f4d47?w=200&q=80","inStock":true},{"name":"Temple Blue","img":"https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&q=80","inStock":false}]'::jsonb,
  ARRAY['sambalpuri','ikat','silk','Odisha','GI-tagged','handwoven']
),

-- 12. Raw Silk Dupion
(
  'raw-silk-dupion',
  'Raw Silk Dupion',
  'Raw Silk Dupion — Textured Sheen',
  520, 650, 20,
  'Blouse Fabrics', 'Dupion Silk', 'Plain', 150, '100% Raw Silk', 'All Season', 'Dry clean only',
  'Textured dupion silk with characteristic slub weave and natural sheen. Ideal for blouses, lehengas, and evening wear.',
  2.5, 4.7, 103,
  45, false, true,
  8, 312, 689, 16,
  'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80',
  ARRAY['https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80'],
  '[{"name":"Ivory Sheen","img":"https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=200&q=80","inStock":true},{"name":"Rose Gold","img":"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80","inStock":true},{"name":"Midnight Blue","img":"https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&q=80","inStock":true}]'::jsonb,
  ARRAY['dupion','raw silk','blouse','lehenga','evening wear']
);
