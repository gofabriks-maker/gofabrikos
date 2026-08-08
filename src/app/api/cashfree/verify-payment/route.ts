import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST /api/cashfree/verify-payment
// Called after Cashfree payment completes — verifies with Cashfree API and updates order
export async function POST(req: NextRequest) {
  try {
    const { cfOrderId, orderId } = await req.json()

    if (!cfOrderId || !orderId) {
      return NextResponse.json({ error: 'Missing cfOrderId or orderId' }, { status: 400 })
    }

    const appId  = process.env.CASHFREE_APP_ID!
    const secret = process.env.CASHFREE_SECRET_KEY!

    // Verify payment status with Cashfree
    const cfRes = await fetch(`https://api.cashfree.com/pg/orders/${cfOrderId}`, {
      method:  'GET',
      headers: {
        'x-api-version':   '2023-08-01',
        'x-client-id':     appId,
        'x-client-secret': secret,
      },
    })

    const cfData = await cfRes.json()

    if (!cfRes.ok) {
      return NextResponse.json({ error: 'Failed to verify with Cashfree' }, { status: 400 })
    }

    const orderStatus = cfData.order_status // PAID | ACTIVE | EXPIRED

    if (orderStatus === 'PAID') {
      // Update order in Supabase
      const { error } = await supabase
        .from('gf_orders')
        .update({
          payment_status: 'paid',
          status:         'confirmed',
          payment_ref:    cfOrderId,
        })
        .eq('id', orderId)

      if (error) {
        console.error('Supabase update error:', error)
        return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
      }

      // Add timeline entry
      await supabase.from('gf_order_timeline').insert({
        order_id: orderId,
        status:   'confirmed',
        note:     `Payment confirmed via Cashfree (${cfOrderId})`,
      })

      return NextResponse.json({ success: true, status: 'PAID' })
    }

    return NextResponse.json({ success: false, status: orderStatus })
  } catch (err) {
    console.error('Verify payment error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
