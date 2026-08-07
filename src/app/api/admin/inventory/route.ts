import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// GET — list all inventory rolls joined with gf_products
export async function GET(req: NextRequest) {
  const supabase = adminClient()
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search')
  const status = searchParams.get('status')

  let query = supabase
    .from('gf_inventory')
    .select(`
      *,
      gf_products (
        id, name, category, fabric_type, slug, cloudinary_url, images, price
      )
    `)
    .order('available_metres', { ascending: true })

  if (status && status !== 'all') query = query.eq('status', status)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Filter by search in JS (simpler than ilike across joined columns)
  let rows = data || []
  if (search) {
    const q = search.toLowerCase()
    rows = rows.filter((r: any) =>
      r.roll_number?.toLowerCase().includes(q) ||
      r.shade_code?.toLowerCase().includes(q) ||
      r.rack_location?.toLowerCase().includes(q) ||
      r.gf_products?.name?.toLowerCase().includes(q) ||
      r.gf_products?.category?.toLowerCase().includes(q)
    )
  }

  return NextResponse.json({ data: rows })
}

// POST — add a new roll
export async function POST(req: NextRequest) {
  const supabase = adminClient()
  const body = await req.json()

  const {
    product_id, roll_number, shade_code,
    total_metres, available_metres, reserved_metres, damaged_metres,
    cost_price, rack_location, received_date,
  } = body

  if (!product_id) return NextResponse.json({ error: 'product_id is required' }, { status: 400 })
  if (!total_metres) return NextResponse.json({ error: 'total_metres is required' }, { status: 400 })

  // Auto-generate roll number if not provided
  const { count } = await supabase.from('gf_inventory').select('*', { count: 'exact', head: true })
  const nextNum = (count || 0) + 1
  const generatedRollNo = roll_number || `RL-${new Date().getFullYear()}-${String(nextNum).padStart(4, '0')}`

  const avail = Number(available_metres ?? total_metres)
  const status = avail === 0 ? 'exhausted' : avail < 15 ? 'low' : 'active'

  const row = {
    product_id,
    roll_number:      generatedRollNo,
    shade_code:       shade_code || null,
    total_metres:     Number(total_metres),
    available_metres: avail,
    reserved_metres:  Number(reserved_metres || 0),
    damaged_metres:   Number(damaged_metres || 0),
    cost_price:       cost_price ? Number(cost_price) : null,
    status,
    rack_location:    rack_location || null,
    received_date:    received_date || new Date().toISOString().split('T')[0],
    updated_at:       new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('gf_inventory')
    .insert(row)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Also update gf_products.stock_metres
  await supabase
    .from('gf_products')
    .update({ stock_metres: avail, updated_at: new Date().toISOString() })
    .eq('id', product_id)

  return NextResponse.json({ data }, { status: 201 })
}

// PATCH — update a roll
export async function PATCH(req: NextRequest) {
  const supabase = adminClient()
  const body = await req.json()
  const { id, ...updates } = body

  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  // Recompute status if available_metres is being updated
  if (updates.available_metres !== undefined) {
    const avail = Number(updates.available_metres)
    updates.status = avail === 0 ? 'exhausted' : avail < 15 ? 'low' : 'active'
  }
  updates.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('gf_inventory')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Sync stock_metres to gf_products if available_metres changed
  if (data?.product_id && updates.available_metres !== undefined) {
    await supabase
      .from('gf_products')
      .update({ stock_metres: Number(updates.available_metres), updated_at: new Date().toISOString() })
      .eq('id', data.product_id)
  }

  return NextResponse.json({ data })
}

// DELETE — delete a roll
export async function DELETE(req: NextRequest) {
  const supabase = adminClient()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const { error } = await supabase.from('gf_inventory').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
