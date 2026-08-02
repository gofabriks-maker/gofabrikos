-- ═══════════════════════════════════════════════════════════════════
-- GoFabrikos · Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- ═══════════════════════════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────────────────────────
-- PRODUCTS TABLE
-- ─────────────────────────────────────────────────────────────────

create table if not exists products (
  id                serial primary key,
  slug              text unique not null,
  name              text not null,
  full_name         text not null,
  price             numeric(10,2) not null,
  original_price    numeric(10,2),
  discount          int not null default 0,
  category          text not null,
  fabric_type       text not null,
  print_type        text,
  gsm               int,
  composition       text,
  season            text,
  wash_care         text,
  description       text not null,
  metres_per_garment numeric(4,1) not null default 5.5,
  rating            numeric(3,1) not null default 4.5,
  ratings_count     int not null default 0,
  stock_left        int not null default 80,
  is_new_arrival    boolean not null default false,
  is_trending       boolean not null default false,
  is_active         boolean not null default true,
  viewing_now       int not null default 6,
  likes             int not null default 120,
  views_today       int not null default 340,
  orders_today      int not null default 8,
  image_url         text not null,
  images            text[] not null default '{}',
  designs           jsonb not null default '[]',
  tags              text[] not null default '{}',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Auto-update updated_at on every change
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at
  before update on products
  for each row execute function update_updated_at();

-- ─────────────────────────────────────────────────────────────────
-- ORDERS TABLE
-- ─────────────────────────────────────────────────────────────────

create table if not exists orders (
  id                serial primary key,
  order_number      text unique not null,
  user_id           uuid references auth.users(id) on delete set null,
  customer_name     text not null,
  customer_mobile   text not null,
  customer_email    text,
  customer_gstin    text,
  shipping_address  jsonb not null,
  status            text not null default 'confirmed'
                    check (status in ('confirmed','processing','packed','shipped','delivered','cancelled')),
  subtotal          numeric(10,2) not null,
  shipping          numeric(10,2) not null default 0,
  discount          numeric(10,2) not null default 0,
  total             numeric(10,2) not null,
  payment_method    text not null,
  payment_id        text,
  courier           text,
  tracking_id       text,
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

-- ─────────────────────────────────────────────────────────────────
-- ORDER ITEMS TABLE
-- ─────────────────────────────────────────────────────────────────

create table if not exists order_items (
  id                serial primary key,
  order_id          int references orders(id) on delete cascade,
  product_id        int references products(id) on delete set null,
  product_name      text not null,
  quantity          numeric(6,1) not null,
  price_per_metre   numeric(10,2) not null,
  total             numeric(10,2) not null
);

-- ─────────────────────────────────────────────────────────────────
-- SWATCH REQUESTS TABLE
-- ─────────────────────────────────────────────────────────────────

create table if not exists swatch_requests (
  id          serial primary key,
  name        text not null,
  mobile      text not null,
  email       text,
  address     text not null,
  city        text not null,
  pin         text not null,
  fabric_ids  int[] not null,
  status      text not null default 'pending'
              check (status in ('pending','dispatched','delivered')),
  created_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────
-- WHOLESALE ENQUIRIES TABLE
-- ─────────────────────────────────────────────────────────────────

create table if not exists wholesale_enquiries (
  id              serial primary key,
  business_name   text not null,
  contact_name    text not null,
  gstin           text,
  mobile          text not null,
  email           text,
  city            text,
  monthly_volume  text,
  message         text,
  status          text not null default 'new'
                  check (status in ('new','contacted','converted','closed')),
  created_at      timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────────────

-- Products: anyone can read active products; only service role can write
alter table products enable row level security;
create policy "Anyone can read active products"
  on products for select
  using (is_active = true);

-- Orders: users see their own orders only
alter table orders enable row level security;
create policy "Users see own orders"
  on orders for select
  using (auth.uid() = user_id);
create policy "Authenticated users can insert orders"
  on orders for insert
  with check (true);

-- Order items: visible if the related order is accessible
alter table order_items enable row level security;
create policy "Order items visible with order"
  on order_items for select
  using (
    exists (
      select 1 from orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

-- Swatch requests: insert-only for public, read by service role
alter table swatch_requests enable row level security;
create policy "Anyone can insert swatch request"
  on swatch_requests for insert
  with check (true);

-- Wholesale enquiries: insert-only for public
alter table wholesale_enquiries enable row level security;
create policy "Anyone can insert wholesale enquiry"
  on wholesale_enquiries for insert
  with check (true);

-- ─────────────────────────────────────────────────────────────────
-- INDEXES for performance
-- ─────────────────────────────────────────────────────────────────

create index if not exists products_slug_idx      on products(slug);
create index if not exists products_category_idx  on products(category);
create index if not exists products_active_idx    on products(is_active);
create index if not exists orders_user_idx        on orders(user_id);
create index if not exists orders_number_idx      on orders(order_number);
create index if not exists order_items_order_idx  on order_items(order_id);

-- ── Newsletter Subscribers ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscribers (
  id            BIGSERIAL PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  is_active     BOOLEAN DEFAULT TRUE
);

-- Allow anonymous inserts (newsletter signup)
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON subscribers
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can read subscribers" ON subscribers
  FOR SELECT USING (auth.role() = 'service_role');

-- ── Contact Messages ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  mobile     TEXT NOT NULL,
  email      TEXT,
  subject    TEXT NOT NULL,
  message    TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'new'
             CHECK (status IN ('new','read','replied','closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert contact message" ON contact_messages
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can read contact messages" ON contact_messages
  FOR SELECT USING (auth.role() = 'service_role');
