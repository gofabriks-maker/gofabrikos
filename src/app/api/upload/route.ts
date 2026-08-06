import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const apiKey    = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 })
    }

    // Build signed upload params
    const timestamp = Math.round(Date.now() / 1000)
    const folder    = 'gofabrikos/products'
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`

    // Sign using Web Crypto (Edge-compatible)
    const encoder = new TextEncoder()
    const keyData = encoder.encode(apiSecret)
    const msgData = encoder.encode(paramsToSign)
    const cryptoKey = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
    const sigBuffer = await crypto.subtle.sign('HMAC', cryptoKey, msgData)
    // Convert to hex
    const signature = Array.from(new Uint8Array(sigBuffer)).map(b => b.toString(16).padStart(2,'0')).join('')

    // Build Cloudinary upload formdata
    const upload = new FormData()
    upload.append('file', file)
    upload.append('api_key', apiKey)
    upload.append('timestamp', String(timestamp))
    upload.append('folder', folder)
    upload.append('signature', signature)

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: upload,
    })

    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data.error?.message || 'Upload failed' }, { status: 500 })

    return NextResponse.json({ url: data.secure_url, public_id: data.public_id })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
