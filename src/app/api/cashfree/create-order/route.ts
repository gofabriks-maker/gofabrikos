import { NextRequest, NextResponse } from 'next/server'

// POST /api/cashfree/create-order
// Creates a Cashfree payment session and returns payment_session_id
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      orderId,       // your internal order ID (UUID from gf_orders)
      orderAmount,   // total in INR (number)
      customerName,
      customerPhone,
      customerEmail,
    } = body

    if (!orderId || !orderAmount || !customerName || !customerPhone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const appId  = process.env.CASHFREE_APP_ID!
    const secret = process.env.CASHFREE_SECRET_KEY!

    // Cashfree test endpoint
    const cfRes = await fetch('https://sandbox.cashfree.com/pg/orders', {
      method:  'POST',
      headers: {
        'Content-Type':   'application/json',
        'x-api-version':  '2023-08-01',
        'x-client-id':    appId,
        'x-client-secret': secret,
      },
      body: JSON.stringify({
        order_id:      `GF-${orderId.slice(0, 8).toUpperCase()}`,
        order_amount:  Number(orderAmount),
        order_currency: 'INR',
        customer_details: {
          customer_id:    customerPhone,
          customer_name:  customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail || 'customer@gofabrikos.com',
        },
        order_meta: {
          return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gofabrikos.com'}/order-confirmation?id=${orderId}`,
          notify_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gofabrikos.com'}/api/cashfree/webhook`,
        },
      }),
    })

    const cfData = await cfRes.json()

    if (!cfRes.ok) {
      console.error('Cashfree create-order error:', cfData)
      return NextResponse.json(
        { error: cfData.message || 'Failed to create payment session' },
        { status: cfRes.status }
      )
    }

    return NextResponse.json({
      paymentSessionId: cfData.payment_session_id,
      cfOrderId:        cfData.order_id,
    })
  } catch (err) {
    console.error('Cashfree create-order exception:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
