import { NextResponse } from 'next/server'
import { addLead } from '@/lib/lead-store'
import { sendEmail } from '@/lib/email'
import { sendInquiryWhatsapp } from '@/lib/whatsapp'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export const runtime = 'nodejs'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://techvyro.com'
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'techvyro@gmail.com'

function welcomeHtml(name: string) {
  return `<!doctype html><html><body style="font-family:system-ui,-apple-system,sans-serif;background:#0a0a0a;color:#fff;padding:24px">
  <div style="max-width:560px;margin:auto;background:#111;border-radius:16px;padding:32px">
    <h1 style="margin:0 0 8px;font-size:22px">Welcome to TechVyro, ${name || 'there'}! 🎉</h1>
    <p style="color:#aaa;margin:0 0 16px">You're now part of India's premier tech creator network. Your <b>FREE Media Kit + Pricing Guide</b> is attached below (download link).</p>
    <p style="margin:0 0 24px"><a href="${SITE_URL}/api/media-kit" style="display:inline-block;background:#3b82f6;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">📄 Download Media Kit</a></p>
    <p style="color:#888;font-size:13px">For brand collaborations, simply reply to this email or WhatsApp us at +91 63960 94707.<br>— TechVyro Team</p>
  </div></body></html>`
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`newsletter:${ip}`, 5, 60 * 60 * 1000)
    if (!rl.ok) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

    const body = await req.json().catch(() => ({}))
    const email = String(body?.email || '').trim().toLowerCase()
    const name = body?.name ? String(body.name).trim().slice(0, 80) : ''
    const source = body?.source === 'exit-intent' ? 'exit-intent' : 'newsletter'

    if (!EMAIL_RE.test(email) || email.length > 200) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const lead = await addLead({ source, email, name, payload: { ip } })

    // Send welcome email + media kit link
    await sendEmail({
      to: email,
      subject: 'Welcome to TechVyro — Your FREE Media Kit',
      html: welcomeHtml(name),
      text: `Welcome to TechVyro, ${name || 'there'}! Download your media kit: ${SITE_URL}/api/media-kit`,
    }).catch((e) => console.error('newsletter welcome email failed', e))

    // Notify owner
    await sendEmail({
      to: OWNER_EMAIL,
      subject: `📧 New ${source} signup: ${email}`,
      text: `Source: ${source}\nName: ${name || '-'}\nEmail: ${email}\nLead ID: ${lead.id}\nIP: ${ip}`,
    }).catch(() => {})

    await sendInquiryWhatsapp({
      brand: name || 'Newsletter',
      contact: name || '-',
      email,
      message: `New ${source} signup`,
    }).catch(() => {})

    return NextResponse.json({ ok: true, message: 'Subscribed! Check your inbox for the media kit.' })
  } catch (err) {
    console.error('newsletter error', err)
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }
}
