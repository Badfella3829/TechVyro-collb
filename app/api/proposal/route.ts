import { NextRequest, NextResponse } from 'next/server'
import {
  calculateQuoteSummary,
  decodeQuoteFromQuery,
  DEFAULT_QUOTE_SELECTION,
  formatViewsCompact,
} from '@/lib/quote-builder'
import { convertInrToUsd, formatCurrencyAmount } from '@/lib/pricing'

export const runtime = 'nodejs'

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function GET(req: NextRequest) {
  const decoded = decodeQuoteFromQuery(req.nextUrl.searchParams)
  const selection = decoded.selection ?? DEFAULT_QUOTE_SELECTION
  const currency = decoded.currency
  const brandName = decoded.brandName || 'Your Brand'
  const summary = calculateQuoteSummary(selection, currency)

  const quoteRef = `TVQ-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`
  const issuedDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  const rowsHtml = summary.lines
    .map((line) => {
      const unitAmt =
        currency === 'USD'
          ? convertInrToUsd(line.item.priceInr)
          : line.item.priceInr
      const lineAmt =
        currency === 'USD'
          ? convertInrToUsd(line.lineTotalInr)
          : line.lineTotalInr
      return `
        <tr>
          <td>
            <strong>${escapeHtml(line.item.name)}</strong>
            <div class="sub">${escapeHtml(line.item.platform)} · ${escapeHtml(line.item.description)}</div>
          </td>
          <td class="num">${line.qty}</td>
          <td class="num">${escapeHtml(formatCurrencyAmount(unitAmt, currency))}</td>
          <td class="num">${line.lineViews > 0 ? escapeHtml(formatViewsCompact(line.lineViews)) : '—'}</td>
          <td class="num"><strong>${escapeHtml(formatCurrencyAmount(lineAmt, currency))}</strong></td>
        </tr>`
    })
    .join('')

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>TechVyro Campaign Proposal — ${escapeHtml(brandName)}</title>
  <style>
    :root { --bg:#090b10; --panel:#111520; --border:#232a3b; --text:#f3f5f8; --muted:#9aa4b8; --accent:#22d3ee; --gold:#f59e0b; }
    * { box-sizing:border-box; }
    body { margin:0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; background:var(--bg); color:var(--text); line-height:1.55; }
    .toolbar { max-width:860px; margin:20px auto 0; padding:0 24px; display:flex; justify-content:space-between; align-items:center; gap:12px; }
    .btn { background:linear-gradient(135deg,#06b6d4,#6366f1); color:#fff; border:none; border-radius:10px; padding:10px 18px; font-weight:600; font-size:14px; cursor:pointer; text-decoration:none; display:inline-block; }
    .btn-ghost { background:transparent; border:1px solid var(--border); color:var(--text); }
    .sheet { max-width:860px; margin:16px auto 48px; background:var(--panel); border:1px solid var(--border); border-radius:18px; padding:40px 36px; }
    .header { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; border-bottom:1px solid var(--border); padding-bottom:24px; margin-bottom:24px; }
    .brand-title { font-size:30px; font-weight:800; margin:0; background:linear-gradient(135deg,#22d3ee,#a855f7); -webkit-background-clip:text; background-clip:text; color:transparent; }
    .meta { text-align:right; font-size:13px; color:var(--muted); }
    .meta strong { color:var(--text); display:block; font-size:14px; }
    .kpis { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin:20px 0 28px; }
    .kpi { background:#0c1018; border:1px solid var(--border); border-radius:12px; padding:14px; }
    .kpi span { display:block; font-size:11px; text-transform:uppercase; letter-spacing:0.06em; color:var(--muted); }
    .kpi strong { display:block; font-size:20px; margin-top:4px; color:var(--accent); }
    table { width:100%; border-collapse:collapse; margin-top:8px; }
    th,td { padding:12px 10px; border-bottom:1px solid var(--border); text-align:left; font-size:14px; vertical-align:top; }
    th { font-size:11px; text-transform:uppercase; letter-spacing:0.05em; color:var(--muted); }
    .num { text-align:right; white-space:nowrap; }
    .sub { font-size:12px; color:var(--muted); margin-top:2px; }
    .totals { margin-top:20px; margin-left:auto; max-width:340px; font-size:14px; }
    .totals-row { display:flex; justify-content:space-between; padding:6px 0; color:var(--muted); }
    .totals-row.discount { color:#34d399; }
    .totals-row.grand { border-top:1px solid var(--border); margin-top:8px; padding-top:12px; font-size:18px; font-weight:700; color:var(--text); }
    .terms { margin-top:32px; padding-top:20px; border-top:1px solid var(--border); display:grid; grid-template-columns:1fr 1fr; gap:20px; font-size:13px; color:var(--muted); }
    .terms h3 { margin:0 0 8px; font-size:13px; text-transform:uppercase; letter-spacing:0.06em; color:var(--text); }
    .terms ul { margin:0; padding-left:18px; }
    .footer-note { margin-top:28px; text-align:center; font-size:12px; color:var(--muted); }
    @media (max-width:640px) { .kpis { grid-template-columns:repeat(2,1fr); } .terms { grid-template-columns:1fr; } .header { flex-direction:column; } .meta { text-align:left; } }
    @media print {
      body { background:#fff; color:#111; }
      .toolbar { display:none; }
      .sheet { border:none; box-shadow:none; background:#fff; margin:0; padding:16px; max-width:none; }
      .kpi { background:#f8fafc; border-color:#e2e8f0; }
      .kpi strong { color:#0284c7; }
      th,td,.header,.terms,.totals-row.grand { border-color:#e2e8f0; }
      .sub,.meta,.totals-row,.terms,.footer-note { color:#475569; }
      .brand-title { color:#0f172a; -webkit-background-clip:initial; background:none; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <a class="btn btn-ghost" href="/#quote-builder">← Back to Quote Builder</a>
    <button class="btn" onclick="window.print()">Print / Save as PDF</button>
  </div>
  <main class="sheet">
    <div class="header">
      <div>
        <h1 class="brand-title">TechVyro</h1>
        <p class="sub" style="margin:4px 0 0">Custom Brand Collaboration Proposal · India's Premier Tech Creator (850K+ Reach)</p>
      </div>
      <div class="meta">
        <strong>Prepared for: ${escapeHtml(brandName)}</strong>
        <div>Ref: ${quoteRef}</div>
        <div>Issued: ${issuedDate} · Valid 14 days</div>
      </div>
    </div>

    <div class="kpis">
      <div class="kpi">
        <span>Estimated Reach</span>
        <strong>${summary.estimatedViews > 0 ? escapeHtml(formatViewsCompact(summary.estimatedViews)) + ' Views' : 'Custom Scope'}</strong>
      </div>
      <div class="kpi">
        <span>Blended CPM</span>
        <strong>${escapeHtml(summary.blendedCpmDisplay)}</strong>
      </div>
      <div class="kpi">
        <span>Turnaround</span>
        <strong>${summary.turnaroundDays > 0 ? `${summary.turnaroundDays} Days` : 'TBD'}</strong>
      </div>
      <div class="kpi">
        <span>Investment (${currency})</span>
        <strong>${escapeHtml(summary.totalDisplay)}</strong>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Deliverable</th>
          <th class="num">Qty</th>
          <th class="num">Rate</th>
          <th class="num">Est. Views</th>
          <th class="num">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row">
        <span>Subtotal</span>
        <span>${escapeHtml(summary.subtotalDisplay)}</span>
      </div>
      ${
        summary.discountPercent > 0
          ? `<div class="totals-row discount">
               <span>Multi-Deliverable Savings (${summary.discountPercent}%)</span>
               <span>−${escapeHtml(summary.discountDisplay)}</span>
             </div>`
          : ''
      }
      <div class="totals-row grand">
        <span>Estimated Total (${currency})</span>
        <span>${escapeHtml(summary.totalDisplay)}</span>
      </div>
    </div>

    <div class="terms">
      <div>
        <h3>Payment &amp; Deliverables</h3>
        <ul>
          <li>50% advance on brief sign-off, 50% upon content delivery.</li>
          <li>Includes concept script, shoot, edit, and 1 round of revisions.</li>
          <li>GST invoice provided; UPI, Bank Transfer, Wise &amp; Stripe supported.</li>
        </ul>
      </div>
      <div>
        <h3>Confirm &amp; Lock Your Slot</h3>
        <ul>
          <li>Email: techvyro@gmail.com</li>
          <li>WhatsApp Business: +91 63960 94707</li>
          <li>Live Analytics: Verified Meta &amp; YouTube metrics shared pre-launch.</li>
        </ul>
      </div>
    </div>

    <p class="footer-note">© ${new Date().getFullYear()} TechVyro · Proposal generated via Custom Campaign Quote Builder</p>
  </main>
</body>
</html>`

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': 'inline; filename="techvyro-campaign-proposal.html"',
      'Cache-Control': 'no-store',
    },
  })
}
