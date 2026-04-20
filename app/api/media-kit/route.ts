import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

function buildHtmlMediaKit() {
  const ig = process.env.INSTAGRAM_USER_ID ? 'Connected' : 'N/A'
  return `<!doctype html><html><head><meta charset="utf-8"><title>TechVyro Media Kit</title>
<style>
  body{font-family:-apple-system,system-ui,sans-serif;background:#0a0a0a;color:#fff;padding:0;margin:0}
  .page{max-width:780px;margin:auto;padding:48px 32px}
  h1{font-size:36px;margin:0 0 4px;background:linear-gradient(135deg,#3b82f6,#a855f7);-webkit-background-clip:text;background-clip:text;color:transparent}
  h2{font-size:20px;margin-top:32px;color:#3b82f6;border-bottom:1px solid #222;padding-bottom:8px}
  p,li{color:#cfcfcf;line-height:1.6}
  .grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin:16px 0}
  .stat{background:#111;padding:16px;border-radius:12px;border:1px solid #222}
  .stat b{font-size:24px;color:#fff;display:block}
  .stat span{color:#888;font-size:13px}
  .pkg{background:#111;border:1px solid #222;border-radius:12px;padding:16px;margin:8px 0}
  .pkg b{color:#a855f7}
  table{width:100%;border-collapse:collapse;margin:8px 0}
  th,td{padding:10px;border-bottom:1px solid #222;text-align:left;color:#ddd;font-size:14px}
  th{color:#888;font-weight:500}
  .cta{background:linear-gradient(135deg,#3b82f6,#a855f7);padding:20px;border-radius:12px;text-align:center;margin:24px 0}
  .cta a{color:#fff;font-weight:700;text-decoration:none}
  @media print{body{background:#fff;color:#000}.stat,.pkg,th,td{background:#fff;color:#000;border-color:#ddd}p,li{color:#333}}
</style></head><body>
<div class="page">
  <h1>TechVyro Media Kit</h1>
  <p style="color:#888">India's Premier Tech Content Creator · Founder: TechVyro Team</p>

  <h2>About</h2>
  <p>TechVyro creates high-quality tech reviews, unboxings, and brand collaborations across Instagram, Facebook & YouTube. Our audience is engaged tech enthusiasts in Tier-1 & Tier-2 Indian cities.</p>

  <h2>Audience Snapshot</h2>
  <div class="grid">
    <div class="stat"><b>Tech Enthusiasts</b><span>Primary niche</span></div>
    <div class="stat"><b>India · Tier 1+2</b><span>Geographic focus</span></div>
    <div class="stat"><b>18–34 yrs</b><span>Core demographic</span></div>
    <div class="stat"><b>Hindi · English</b><span>Content languages</span></div>
  </div>
  <p style="font-size:13px;color:#888">↳ Live, real-time stats: visit <b>techvyro.com/analytics</b> for current follower count, engagement rates, and top-performing posts pulled directly from Meta & YouTube APIs.</p>

  <h2>Collaboration Packages</h2>
  <div class="pkg"><b>Starter — ₹16,500</b><br>1 piece of content (Reel OR Static post). Perfect for product launches & quick brand pushes.</div>
  <div class="pkg"><b>Growth — ₹49,500</b><br>3 pieces of content + cross-platform repost. Best for sustained brand awareness.</div>
  <div class="pkg"><b>Scale — ₹99,000+</b><br>6+ pieces, multi-platform campaign, performance reporting, exclusivity window.</div>
  <div class="pkg"><b>Custom</b><br>Long-term ambassadorships, video series, event coverage. WhatsApp for a quote.</div>

  <h2>Deliverables Include</h2>
  <table>
    <tr><th>Format</th><th>Platforms</th><th>Turnaround</th></tr>
    <tr><td>Reels / Shorts</td><td>Instagram, YouTube</td><td>5–7 days</td></tr>
    <tr><td>Long-form Reviews</td><td>YouTube</td><td>10–14 days</td></tr>
    <tr><td>Static Posts / Carousels</td><td>Instagram, Facebook</td><td>3–5 days</td></tr>
    <tr><td>Stories / Status</td><td>Instagram, Facebook</td><td>1–2 days</td></tr>
  </table>

  <h2>Past Brand Collaborations</h2>
  <p>Tech, gadgets, smartphones, audio, fintech & D2C brands. See full portfolio at <b>techvyro.com</b>.</p>

  <h2>Why TechVyro?</h2>
  <ul>
    <li><b>Real engagement</b> — every metric verified via Meta & YouTube Graph APIs (no inflated numbers)</li>
    <li><b>Audience trust</b> — honest reviews, no shilling</li>
    <li><b>Fast turnaround</b> — concept to publish in under a week</li>
    <li><b>Multi-language</b> — Hindi-English content for maximum India reach</li>
  </ul>

  <div class="cta">
    <a href="https://techvyro.com/contact">📩 Start a Collaboration → techvyro.com/contact</a><br>
    <span style="color:#fff;font-size:13px;opacity:.9">WhatsApp: +91 63960 94707 · Email: techvyro@gmail.com</span>
  </div>

  <p style="text-align:center;color:#666;font-size:12px;margin-top:32px">© ${new Date().getFullYear()} TechVyro · All rights reserved</p>
</div></body></html>`
}

export async function GET() {
  const html = buildHtmlMediaKit()
  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': 'inline; filename="techvyro-media-kit.html"',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
