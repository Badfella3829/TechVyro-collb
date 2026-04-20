import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { sendInquiryWhatsapp } from '@/lib/whatsapp'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { addLead } from '@/lib/lead-store'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Payload = {
  email: string
  name?: string
  budget: number
  contentPieces: number
  estReach: number
  estEngagement: number
  estROI: number
  package?: string
}

function generateReportHTML(p: Payload): string {
  const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>TechVyro ROI Report</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
  body{background:#0a0a0a;color:#fff;padding:40px 24px;max-width:680px;margin:0 auto}
  .header{text-align:center;border-bottom:1px solid #333;padding-bottom:24px;margin-bottom:32px}
  .logo{font-size:32px;font-weight:bold;background:linear-gradient(135deg,#00ffff,#ff00ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .subtitle{color:#888;margin-top:8px}
  .greeting{font-size:18px;margin-bottom:24px}
  .metric-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:24px 0}
  .metric{background:#1a1a1a;border:1px solid #333;border-radius:12px;padding:20px}
  .metric-label{font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px}
  .metric-value{font-size:26px;font-weight:bold;color:#00ffff}
  .roi-highlight{background:linear-gradient(135deg,#00ffff20,#ff00ff20);border:2px solid #00ffff;border-radius:16px;padding:24px;text-align:center;margin:32px 0}
  .roi-value{font-size:48px;font-weight:bold;background:linear-gradient(135deg,#00ffff,#ff00ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .cta{background:#00ffff;color:#0a0a0a;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:bold;display:inline-block;margin-top:16px}
  .footer{text-align:center;color:#666;font-size:12px;margin-top:40px;padding-top:24px;border-top:1px solid #333}
  @media print {body{background:#fff;color:#000}.metric{background:#f5f5f5;border-color:#ccc}}
</style>
</head>
<body>
  <div class="header">
    <div class="logo">TechVyro</div>
    <div class="subtitle">Personalised ROI Report • ${date}</div>
  </div>
  <div class="greeting">Hi <strong>${p.name || 'there'}</strong>,<br/>Here&rsquo;s your projected ROI based on real-data benchmarks from our top campaigns 👇</div>
  <div class="metric-grid">
    <div class="metric"><div class="metric-label">Investment Budget</div><div class="metric-value">₹${p.budget.toLocaleString('en-IN')}</div></div>
    <div class="metric"><div class="metric-label">Content Pieces</div><div class="metric-value">${p.contentPieces}</div></div>
    <div class="metric"><div class="metric-label">Estimated Reach</div><div class="metric-value">${p.estReach.toLocaleString('en-IN')}</div></div>
    <div class="metric"><div class="metric-label">Engagement Lift</div><div class="metric-value">${p.estEngagement.toFixed(2)}%</div></div>
  </div>
  <div class="roi-highlight">
    <div style="font-size:13px;color:#888;margin-bottom:8px">PROJECTED ROI</div>
    <div class="roi-value">${p.estROI.toFixed(1)}×</div>
    <div style="margin-top:12px;font-size:14px;color:#aaa">on your ₹${p.budget.toLocaleString('en-IN')} investment</div>
  </div>
  ${p.package ? `<p style="text-align:center;color:#aaa;margin:16px 0">Recommended package: <strong style="color:#00ffff">${p.package}</strong></p>` : ''}
  <div style="text-align:center;margin:32px 0">
    <a href="https://wa.me/919696094707" class="cta">Book a Free 30-min Strategy Call →</a>
  </div>
  <div class="footer">
    <p>TechVyro &mdash; India&rsquo;s Premier Tech Content Creator</p>
    <p>techvyro@gmail.com &middot; +91 96960 94707</p>
    <p style="margin-top:8px;color:#444">This report is auto-generated using real engagement data.</p>
  </div>
</body>
</html>`
}

export async function POST(req: Request) {
  try {
    // Rate limit: 3 requests per IP per hour
    const ip = getClientIp(req)
    const rl = rateLimit(`roi-report:${ip}`, 3, 60 * 60 * 1000)
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'retry-after': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      )
    }

    const data: Payload = await req.json()

    // Strict server-side validation
    if (!data?.email || typeof data.email !== 'string' || !EMAIL_RE.test(data.email) || data.email.length > 200) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }
    if (data.name && (typeof data.name !== 'string' || data.name.length > 100)) {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
    }
    if (data.package && (typeof data.package !== 'string' || data.package.length > 100)) {
      return NextResponse.json({ error: 'Invalid package' }, { status: 400 })
    }
    const numFields: Array<keyof Payload> = ['budget', 'contentPieces', 'estReach', 'estEngagement', 'estROI']
    for (const k of numFields) {
      const v = data[k]
      if (typeof v !== 'number' || !Number.isFinite(v) || v < 0 || v > 1e12) {
        return NextResponse.json({ error: `Invalid ${String(k)}` }, { status: 400 })
      }
    }

    const html = generateReportHTML(data)

    const text = `Hi ${data.name || 'there'},\n\nYour TechVyro ROI report:\n- Budget: ₹${data.budget.toLocaleString('en-IN')}\n- Content pieces: ${data.contentPieces}\n- Estimated reach: ${data.estReach.toLocaleString('en-IN')}\n- Engagement lift: ${data.estEngagement.toFixed(2)}%\n- Projected ROI: ${data.estROI.toFixed(1)}×\n\nReply to this email or WhatsApp +91 96960 94707 to discuss.\n\n— TechVyro`

    const emailRes = await sendEmail({
      to: data.email,
      subject: `Your TechVyro ROI Report — ${data.estROI.toFixed(1)}× projected return`,
      text,
      html,
    })

    // Notify owner of new lead via existing inquiry pipeline
    try {
      await sendInquiryWhatsapp({
        reference: `ROI-${Date.now().toString(36).toUpperCase()}`,
        brandName: data.name || 'ROI Lead',
        contactName: data.name || 'Lead',
        contactEmail: data.email,
        message: `🔥 ROI report request\nBudget: ₹${data.budget.toLocaleString('en-IN')}\nProjected ROI: ${data.estROI.toFixed(1)}×\nPackage: ${data.package || 'N/A'}`,
      } as any)
    } catch (e) {
      console.error('roi report whatsapp failed', e)
    }

    try {
      await addLead({
        source: 'roi-report',
        email: data.email,
        name: data.name,
        package: data.package,
        budget: String(data.budget),
        notes: `ROI: ${data.estROI.toFixed(1)}× · Reach: ${data.estReach.toLocaleString('en-IN')}`,
        payload: { ip },
      })
    } catch {}

    return NextResponse.json({ ok: true, message: 'Report sent to your email' })
  } catch (err) {
    console.error('roi-report error', err)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}
