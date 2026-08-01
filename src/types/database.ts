// ─────────────────────────────────────────────────────────────────────────────
// GoFabrikos · Supabase Database Types
// ─────────────────────────────────────────────────────────────────────────────

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ── Product types ─────────────────────────────────────────────────────────────

export interface ProductDesign {
  name: string
  img: string
  inStock: boolean
}

export interface ProductRow {
  id: number
  slug: string
  name: string
  full_name: string
  price: number
  original_price: number | null
  discount: number
  category: string
  fabric_type: string
  print_type: string | null
  gsm: number | null
  composition: string | null
  season: string | null
  wash_care: string | null
  description: string
  metres_per_garment: number
  rating: number
  ratings_count: number
  stock_left: number
  is_new_arrival: boolean
  is_trending: boolean
  is_active: boolean
  viewing_now: number
  likes: number
  views_today: number
  orders_today: number
  image_url: string
  images: string[]
  designs: ProductDesign[]
  tags: string[]
  created_at: string
  updated_at: string
}

// ── Order types ───────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface OrderItemRow {
  id: number
  order_id: number
  product_id: number
  product_name: string
  quantity: number
  price_per_metre: number
  total: number
}

export interface OrderRow {
  id: number
  order_number: string
  user_id: string | null
  customer_name: string
  customer_mobile: string
  customer_email: string | null
  customer_gstin: string | null
  shipping_address: Json
  status: OrderStatus
  subtotal: number
  shipping: number
  discount: number
  total: number
  payment_method: string
  payment_id: string | null
  courier: string | null
  tracking_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
  items?: OrderItemRow[]
}

// ── Swatch types ──────────────────────────────────────────────────────────────

export interface SwatchRequestRow {
  id: number
  name: string
  mobile: string
  email: string | null
  address: string
  city: string
  pin: string
  fabric_ids: number[]
  status: 'pending' | 'dispatched' | 'delivered'
  created_at: string
}

// ── Wholesale enquiry ─────────────────────────────────────────────────────────

export interface WholesaleEnquiryRow {
  id: number
  business_name: string
  contact_name: string
  gstin: string | null
  mobile: string
  email: string | null
  city: string | null
  monthly_volume: string | null
  message: string | null
  status: 'new' | 'contacted' | 'converted' | 'closed'
  created_at: string
}

// ── Supabase Database schema ──────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      products: {
        Row: ProductRow
        Insert: Omit<ProductRow, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ProductRow, 'id' | 'created_at' | 'updated_at'>>
      }
      orders: {
        Row: OrderRow
        Insert: Omit<OrderRow, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<OrderRow, 'id' | 'created_at' | 'updated_at'>>
      }
      order_items: {
        Row: OrderItemRow
        Insert: Omit<OrderItemRow, 'id'>
        Update: Partial<Omit<OrderItemRow, 'id'>>
      }
      swatch_requests: {
        Row: SwatchRequestRow
        Insert: Omit<SwatchRequestRow, 'id' | 'created_at'>
        Update: Partial<Omit<SwatchRequestRow, 'id' | 'created_at'>>
      }
      wholesale_enquiries: {
        Row: WholesaleEnquiryRow
        Insert: Omit<WholesaleEnquiryRow, 'id' | 'created_at'>
        Update: Partial<Omit<WholesaleEnquiryRow, 'id' | 'created_at'>>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
