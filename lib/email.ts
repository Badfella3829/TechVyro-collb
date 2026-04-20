import nodemailer, { type Transporter } from 'nodemailer'

let cachedTransporter: Transporter | null = null

function getTransporter(): Transporter | null {
  const user = process.env.GMAIL_USER || 'techvyro@gmail.com'
  const pass = process.env.GMAIL_APP_PASSWORD
  if (!pass) return null
  if (cachedTransporter) return cachedTransporter
  cachedTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })
  return cachedTransporter
}

export type EmailResult =
  | { ok: true; messageId: string }
  | { ok: false; skipped: true; reason: string }
  | { ok: false; error: string }

interface SendArgs {
  to: string
  subject: string
  text: string
  html?: string
  replyTo?: string
}

export async function sendEmail(args: SendArgs): Promise<EmailResult> {
  const transporter = getTransporter()
  if (!transporter) {
    return { ok: false, skipped: true, reason: 'GMAIL_APP_PASSWORD not configured' }
  }
  const fromUser = process.env.GMAIL_USER || 'techvyro@gmail.com'
  try {
    const info = await transporter.sendMail({
      from: `"TechVyro" <${fromUser}>`,
      to: args.to,
      subject: args.subject,
      text: args.text,
      html: args.html,
      replyTo: args.replyTo || fromUser,
    })
    return { ok: true, messageId: info.messageId }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}

// ─── INQUIRY ACKNOWLEDGEMENT (sent immediately after brand submits form) ───────

export interface InquiryEmailData {
  reference: string
  brandName: string
  contactName: string
  email: string
  phone?: string
  website?: string
  campaignGoal: string
  collabType: string
  deliverables?: string[]
  budget?: string
  timeline?: string
  startDate?: string
  message: string
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function row(label: string, value?: string): string {
  if (!value) return ''
  return `<tr><td style="padding:6px 12px;color:#6b7280;font-size:13px;">${escapeHtml(label)}</td><td style="padding:6px 12px;color:#111827;font-size:14px;font-weight:500;">${escapeHtml(value)}</td></tr>`
}

export function buildInquiryAckEmail(d: InquiryEmailData): { subject: string; text: string; html: string } {
  const subject = `Thanks for reaching out, ${d.contactName.split(' ')[0]} — Ref ${d.reference}`

  const text = [
    `Hi ${d.contactName},`,
    ``,
    `Thank you for reaching out to TechVyro! I have received your collaboration inquiry and will personally review the details within the next 24 hours.`,
    ``,
    `--- Your Inquiry Summary ---`,
    `Reference No.   : ${d.reference}`,
    `Brand           : ${d.brandName}`,
    `Contact         : ${d.contactName}`,
    `Email           : ${d.email}`,
    ...(d.phone ? [`WhatsApp        : ${d.phone}`] : []),
    ...(d.website ? [`Website         : ${d.website}`] : []),
    `Campaign Goal   : ${d.campaignGoal}`,
    `Collab Type     : ${d.collabType}`,
    ...(d.deliverables?.length ? [`Deliverables    : ${d.deliverables.join(', ')}`] : []),
    ...(d.budget ? [`Budget          : ${d.budget}`] : []),
    ...(d.timeline ? [`Timeline        : ${d.timeline}`] : []),
    ...(d.startDate ? [`Preferred Start : ${d.startDate}`] : []),
    `----------------------------`,
    ``,
    `Your Brief:`,
    d.message,
    ``,
    `What happens next:`,
    `1. I will review your brief and check schedule availability.`,
    `2. You'll hear back from me within 24 hours with next steps.`,
    `3. We'll align on creative direction, deliverables, and timeline.`,
    ``,
    `In the meantime, feel free to reply to this email or reach out on WhatsApp at +91 63960 94707 with any questions.`,
    ``,
    `Looking forward to creating something great together.`,
    ``,
    `Warm regards,`,
    ``,
    `Vyom`,
    `Founder, TechVyro`,
    `Email: techvyro@gmail.com`,
    `WhatsApp: +91 63960 94707`,
  ].join('\n')

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 12px;">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
      <tr><td style="background:linear-gradient(135deg,#0d9488 0%,#0891b2 100%);padding:28px 32px;color:#fff;">
        <div style="font-size:13px;letter-spacing:1.5px;text-transform:uppercase;opacity:0.85;margin-bottom:6px;">TechVyro</div>
        <div style="font-size:24px;font-weight:700;line-height:1.3;">Thanks for reaching out, ${escapeHtml(d.contactName.split(' ')[0])}!</div>
        <div style="font-size:14px;opacity:0.9;margin-top:6px;">We've received your collaboration inquiry.</div>
      </td></tr>
      <tr><td style="padding:28px 32px;color:#111827;font-size:15px;line-height:1.6;">
        <p style="margin:0 0 16px;">Hi ${escapeHtml(d.contactName)},</p>
        <p style="margin:0 0 16px;">Thank you for choosing TechVyro for your campaign. I've received your inquiry and will personally review the details within the next <strong>24 hours</strong>.</p>
        <div style="background:#f0fdfa;border-left:3px solid #0d9488;padding:12px 16px;border-radius:6px;margin:20px 0;">
          <div style="font-size:12px;color:#0f766e;text-transform:uppercase;letter-spacing:1px;">Your Reference</div>
          <div style="font-size:18px;font-weight:700;color:#134e4a;font-family:monospace;letter-spacing:0.5px;">${escapeHtml(d.reference)}</div>
        </div>
        <h3 style="font-size:14px;color:#374151;text-transform:uppercase;letter-spacing:0.5px;margin:24px 0 8px;">Inquiry Summary</h3>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
          ${row('Brand', d.brandName)}
          ${row('Contact', d.contactName)}
          ${row('Email', d.email)}
          ${row('WhatsApp', d.phone)}
          ${row('Website', d.website)}
          ${row('Campaign Goal', d.campaignGoal)}
          ${row('Collab Type', d.collabType)}
          ${row('Deliverables', d.deliverables?.join(', '))}
          ${row('Budget', d.budget)}
          ${row('Timeline', d.timeline)}
          ${row('Preferred Start', d.startDate)}
        </table>
        <h3 style="font-size:14px;color:#374151;text-transform:uppercase;letter-spacing:0.5px;margin:24px 0 8px;">Your Brief</h3>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:14px 16px;font-size:14px;color:#374151;white-space:pre-wrap;line-height:1.55;">${escapeHtml(d.message)}</div>
        <h3 style="font-size:14px;color:#374151;text-transform:uppercase;letter-spacing:0.5px;margin:24px 0 8px;">What Happens Next</h3>
        <ol style="margin:0;padding-left:20px;color:#374151;">
          <li style="margin-bottom:6px;">I'll review your brief and check schedule availability.</li>
          <li style="margin-bottom:6px;">You'll hear back from me within 24 hours with next steps.</li>
          <li>We'll align on creative direction, deliverables, and timeline.</li>
        </ol>
        <p style="margin:24px 0 0;color:#6b7280;font-size:14px;">Have a question in the meantime? Just reply to this email or message me on WhatsApp at <a href="https://wa.me/916396094707" style="color:#0d9488;text-decoration:none;">+91 63960 94707</a>.</p>
      </td></tr>
      <tr><td style="background:#f9fafb;padding:20px 32px;border-top:1px solid #e5e7eb;text-align:center;color:#6b7280;font-size:13px;line-height:1.6;">
        <strong style="color:#111827;">Vyom</strong> · Founder, TechVyro<br>
        <a href="mailto:techvyro@gmail.com" style="color:#0d9488;text-decoration:none;">techvyro@gmail.com</a> · 
        <a href="https://wa.me/916396094707" style="color:#0d9488;text-decoration:none;">+91 63960 94707</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`

  return { subject, text, html }
}

// ─── OWNER ALERT (sent to TechVyro owner when a new inquiry arrives) ──────────

export function buildOwnerAlertEmail(d: InquiryEmailData): { subject: string; text: string; html: string } {
  const subject = `🔔 New Inquiry: ${d.brandName} (${d.reference})`

  const text = [
    `New collaboration inquiry received!`,
    ``,
    `Reference   : ${d.reference}`,
    `Brand       : ${d.brandName}`,
    `Contact     : ${d.contactName}`,
    `Email       : ${d.email}`,
    ...(d.phone ? [`WhatsApp    : ${d.phone}`] : []),
    ...(d.website ? [`Website     : ${d.website}`] : []),
    `Goal        : ${d.campaignGoal}`,
    `Type        : ${d.collabType}`,
    ...(d.deliverables?.length ? [`Deliverables: ${d.deliverables.join(', ')}`] : []),
    ...(d.budget ? [`Budget      : ${d.budget}`] : []),
    ...(d.timeline ? [`Timeline    : ${d.timeline}`] : []),
    ...(d.startDate ? [`Start Date  : ${d.startDate}`] : []),
    ``,
    `Brief:`,
    d.message,
    ``,
    `Open admin panel: https://techvyro.com/admin/availability`,
  ].join('\n')

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 12px;">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
      <tr><td style="background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);padding:20px 28px;color:#fff;">
        <div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;opacity:0.9;">TechVyro Admin Alert</div>
        <div style="font-size:22px;font-weight:700;margin-top:4px;">🔔 New Collaboration Inquiry</div>
        <div style="font-size:13px;opacity:0.9;margin-top:4px;font-family:monospace;">Ref: ${escapeHtml(d.reference)}</div>
      </td></tr>
      <tr><td style="padding:20px 28px;color:#111827;font-size:14px;line-height:1.55;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
          ${row('Brand', d.brandName)}
          ${row('Contact', d.contactName)}
          ${row('Email', d.email)}
          ${row('WhatsApp', d.phone)}
          ${row('Website', d.website)}
          ${row('Goal', d.campaignGoal)}
          ${row('Type', d.collabType)}
          ${row('Deliverables', d.deliverables?.join(', '))}
          ${row('Budget', d.budget)}
          ${row('Timeline', d.timeline)}
          ${row('Start Date', d.startDate)}
        </table>
        <h3 style="font-size:13px;color:#374151;text-transform:uppercase;letter-spacing:0.5px;margin:18px 0 6px;">Brief</h3>
        <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px 14px;font-size:13.5px;color:#374151;white-space:pre-wrap;line-height:1.5;">${escapeHtml(d.message)}</div>
        <div style="margin-top:20px;text-align:center;">
          <a href="https://techvyro.com/admin/availability" style="display:inline-block;background:#0d9488;color:#fff;text-decoration:none;padding:11px 22px;border-radius:8px;font-weight:600;font-size:14px;">Open Admin Panel →</a>
        </div>
        <p style="margin:14px 0 0;color:#6b7280;font-size:12px;text-align:center;">Quick replies: <a href="mailto:${escapeHtml(d.email)}" style="color:#0d9488;">Email ${escapeHtml(d.contactName.split(' ')[0])}</a>${d.phone ? ` · <a href="https://wa.me/${d.phone.replace(/\\D/g, '')}" style="color:#0d9488;">WhatsApp</a>` : ''}</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`

  return { subject, text, html }
}

// ─── BOOKING CONFIRMATION (sent when admin confirms a booking) ───────────────

export interface ConfirmationEmailData {
  brandName: string
  contactName: string
  date: string
  reference: string
  collabType?: string
}

export function buildConfirmationEmail(d: ConfirmationEmailData): { subject: string; text: string; html: string } {
  const subject = `Your TechVyro Collaboration is Confirmed — Ref ${d.reference}`

  const text = [
    `Dear ${d.contactName},`,
    ``,
    `Thank you for choosing TechVyro for your upcoming campaign. I'm pleased to confirm your collaboration booking with the following details:`,
    ``,
    `--- Booking Confirmation ---`,
    `Brand          : ${d.brandName}`,
    ...(d.collabType ? [`Collaboration  : ${d.collabType}`] : []),
    `Scheduled Date : ${d.date}`,
    `Reference No.  : ${d.reference}`,
    `----------------------------`,
    ``,
    `What happens next:`,
    `1. I will share a detailed brief and creative direction within 24 hours.`,
    `2. We'll align on key messaging, deliverables, and timelines.`,
    `3. Production and review schedule will be confirmed in writing.`,
    ``,
    `If you have any questions or wish to discuss anything before we kick off, feel free to reply to this email or reach me on WhatsApp at +91 63960 94707.`,
    ``,
    `Looking forward to creating something great together.`,
    ``,
    `Warm regards,`,
    ``,
    `Vyom`,
    `Founder, TechVyro`,
    `Email: techvyro@gmail.com`,
    `WhatsApp: +91 63960 94707`,
  ].join('\n')

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 12px;">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
      <tr><td style="background:linear-gradient(135deg,#10b981 0%,#0d9488 100%);padding:28px 32px;color:#fff;">
        <div style="font-size:13px;letter-spacing:1.5px;text-transform:uppercase;opacity:0.85;margin-bottom:6px;">TechVyro</div>
        <div style="font-size:26px;font-weight:700;line-height:1.3;">✅ Your Collaboration is Confirmed</div>
        <div style="font-size:14px;opacity:0.9;margin-top:6px;">Welcome aboard, ${escapeHtml(d.contactName.split(' ')[0])}!</div>
      </td></tr>
      <tr><td style="padding:28px 32px;color:#111827;font-size:15px;line-height:1.6;">
        <p style="margin:0 0 16px;">Dear ${escapeHtml(d.contactName)},</p>
        <p style="margin:0 0 16px;">Thank you for choosing TechVyro. I'm pleased to confirm your collaboration booking with the following details:</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin:20px 0;">
          ${row('Brand', d.brandName)}
          ${row('Collaboration', d.collabType)}
          ${row('Scheduled Date', d.date)}
          ${row('Reference No.', d.reference)}
        </table>
        <h3 style="font-size:14px;color:#374151;text-transform:uppercase;letter-spacing:0.5px;margin:24px 0 8px;">What Happens Next</h3>
        <ol style="margin:0;padding-left:20px;color:#374151;">
          <li style="margin-bottom:6px;">I'll share a detailed brief and creative direction within 24 hours.</li>
          <li style="margin-bottom:6px;">We'll align on key messaging, deliverables, and timelines.</li>
          <li>Production and review schedule will be confirmed in writing.</li>
        </ol>
        <p style="margin:24px 0 0;color:#6b7280;font-size:14px;">Have a question? Just reply to this email or message me on WhatsApp at <a href="https://wa.me/916396094707" style="color:#0d9488;text-decoration:none;">+91 63960 94707</a>.</p>
        <p style="margin:16px 0 0;color:#374151;font-size:15px;">Looking forward to creating something great together.</p>
      </td></tr>
      <tr><td style="background:#f9fafb;padding:20px 32px;border-top:1px solid #e5e7eb;text-align:center;color:#6b7280;font-size:13px;line-height:1.6;">
        <strong style="color:#111827;">Vyom</strong> · Founder, TechVyro<br>
        <a href="mailto:techvyro@gmail.com" style="color:#0d9488;text-decoration:none;">techvyro@gmail.com</a> · 
        <a href="https://wa.me/916396094707" style="color:#0d9488;text-decoration:none;">+91 63960 94707</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`

  return { subject, text, html }
}
