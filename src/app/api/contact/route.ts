import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { name, mobile, email, subject, message } = await req.json()

    if (!name || !mobile || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: process.env.OWNER_EMAIL || 'gofabriks@gmail.com',
      subject: `GoFabrikos Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #7f1d1d; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">GoFabrikos</h1>
            <p style="color: #fca5a5; margin: 4px 0 0;">New Contact Form Message</p>
          </div>
          <div style="padding: 24px; background: #fff; border: 1px solid #e7e7e7;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 100px;">Name</td>
                <td style="padding: 8px 0; font-weight: 600; color: #111;">${name}</td>
              </tr>
              <tr style="border-top: 1px solid #f3f4f6;">
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Mobile</td>
                <td style="padding: 8px 0; font-weight: 600; color: #111;">${mobile}</td>
              </tr>
              ${email ? `
              <tr style="border-top: 1px solid #f3f4f6;">
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td>
                <td style="padding: 8px 0; font-weight: 600; color: #111;">${email}</td>
              </tr>` : ''}
              <tr style="border-top: 1px solid #f3f4f6;">
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Topic</td>
                <td style="padding: 8px 0; font-weight: 600; color: #111;">${subject}</td>
              </tr>
              <tr style="border-top: 1px solid #f3f4f6;">
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; vertical-align: top;">Message</td>
                <td style="padding: 8px 0; color: #374151; line-height: 1.6;">${message}</td>
              </tr>
            </table>
          </div>
          <div style="padding: 16px 24px; background: #fef2f2; border: 1px solid #fecaca; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="margin: 0; font-size: 13px; color: #6b7280;">
              Reply to this customer:
              <a href="https://wa.me/91${mobile.replace(/\D/g, '')}" style="color: #7f1d1d;">WhatsApp</a>
              ${email ? ` · <a href="mailto:${email}" style="color: #7f1d1d;">${email}</a>` : ''}
            </p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
