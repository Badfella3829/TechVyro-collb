type InquiryPayload = {
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
  fitScore?: number
}

const GRAPH_VERSION = 'v21.0'

function formatInquiryMessage(i: InquiryPayload): string {
  const lines: string[] = []
  lines.push(`🚀 *New Collab Inquiry*`)
  lines.push(`Ref: ${i.reference}`)
  lines.push('')
  lines.push(`*Brand:* ${i.brandName}`)
  lines.push(`*Contact:* ${i.contactName}`)
  lines.push(`*Email:* ${i.email}`)
  if (i.phone) lines.push(`*Phone:* ${i.phone}`)
  if (i.website) lines.push(`*Website:* ${i.website}`)
  lines.push('')
  lines.push(`*Goal:* ${i.campaignGoal}`)
  lines.push(`*Type:* ${i.collabType}`)
  if (i.deliverables?.length) lines.push(`*Deliverables:* ${i.deliverables.join(', ')}`)
  if (i.budget) lines.push(`*Budget:* ${i.budget}`)
  if (i.timeline) lines.push(`*Timeline:* ${i.timeline}`)
  if (i.startDate) lines.push(`*Start:* ${i.startDate}`)
  if (typeof i.fitScore === 'number') lines.push(`*Fit Score:* ${i.fitScore}/100`)
  lines.push('')
  const briefPreview = i.message.length > 400 ? i.message.slice(0, 400) + '…' : i.message
  lines.push(`*Brief:*`)
  lines.push(briefPreview)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || process.env.REPLIT_DEV_DOMAIN
  if (siteUrl) {
    const base = siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`
    lines.push('')
    lines.push(`Manage: ${base}/admin/availability`)
  }
  return lines.join('\n')
}

export type WhatsappResult =
  | { ok: true; messageId: string; mode: 'freeform' | 'template' }
  | { ok: false; error: string; details?: unknown }

export interface BookingConfirmation {
  brandName: string
  contactName: string
  date: string
  reference: string
  collabType?: string
  phone?: string
}

export function normalizePhone(raw: string | undefined): string | null {
  if (!raw) return null
  // Strip everything except digits
  let digits = raw.replace(/\D/g, '')
  // Strip leading zeros
  digits = digits.replace(/^0+/, '')
  if (digits.length < 10) return null
  // If 10-digit local number, default to India (+91)
  if (digits.length === 10) digits = '91' + digits
  return digits
}

async function postToGraph(phoneNumberId: string, token: string, body: unknown): Promise<Response> {
  return fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

export async function sendInquiryWhatsapp(inquiry: InquiryPayload): Promise<WhatsappResult> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const token = process.env.WHATSAPP_ACCESS_TOKEN
  const recipient = process.env.WHATSAPP_RECIPIENT_NUMBER

  if (!phoneNumberId || !token || !recipient) {
    return { ok: false, error: 'WhatsApp env vars not configured' }
  }

  const text = formatInquiryMessage(inquiry)

  // 1) Try freeform text (works only if recipient messaged the business in last 24h)
  try {
    const res = await postToGraph(phoneNumberId, token, {
      messaging_product: 'whatsapp',
      to: recipient,
      type: 'text',
      text: { preview_url: false, body: text },
    })
    if (res.ok) {
      const data = (await res.json()) as { messages?: { id: string }[] }
      const id = data.messages?.[0]?.id || ''
      return { ok: true, messageId: id, mode: 'freeform' }
    }
    const errText = await res.text()
    // Detect 24h-window error and fall back to template
    const looksLikeWindowError = /re-?engagement|24 hours|outside.*window|recipient/i.test(errText)
    if (!looksLikeWindowError) {
      return { ok: false, error: `Freeform send failed (${res.status})`, details: errText }
    }
  } catch (err) {
    return { ok: false, error: 'Network error sending freeform', details: String(err) }
  }

  // 2) Fallback: send the default approved 'hello_world' template (no parameters)
  //    Pre-approved by Meta for every new WABA. Notifies the user — they can then
  //    open a 24h window by replying, after which freeform messages flow normally.
  return sendHelloWorldTemplate(phoneNumberId, token, recipient)
}

async function sendHelloWorldTemplate(
  phoneNumberId: string,
  token: string,
  to: string
): Promise<WhatsappResult> {
  try {
    const res = await postToGraph(phoneNumberId, token, {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: { name: 'hello_world', language: { code: 'en_US' } },
    })
    if (res.ok) {
      const data = (await res.json()) as { messages?: { id: string }[] }
      const id = data.messages?.[0]?.id || ''
      return { ok: true, messageId: id, mode: 'template' }
    }
    const errText = await res.text()
    return { ok: false, error: `Template send failed (${res.status})`, details: errText }
  } catch (err) {
    return { ok: false, error: 'Network error sending template', details: String(err) }
  }
}

function formatConfirmationMessage(c: BookingConfirmation): string {
  const lines: string[] = []
  lines.push(`✅ *Booking Confirmed — TechVyro*`)
  lines.push('')
  lines.push(`Hi ${c.contactName},`)
  lines.push('')
  lines.push(`Great news! Your collaboration with TechVyro is confirmed:`)
  lines.push('')
  lines.push(`*Brand:* ${c.brandName}`)
  if (c.collabType) lines.push(`*Type:* ${c.collabType}`)
  lines.push(`*Date:* ${c.date}`)
  lines.push(`*Ref:* ${c.reference}`)
  lines.push('')
  lines.push(`We'll be in touch shortly with next steps. Save this number for direct communication.`)
  lines.push('')
  lines.push(`— TechVyro Team`)
  return lines.join('\n')
}

export async function sendBookingConfirmation(
  c: BookingConfirmation
): Promise<WhatsappResult & { skipped?: boolean; reason?: string }> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const token = process.env.WHATSAPP_ACCESS_TOKEN
  if (!phoneNumberId || !token) {
    return { ok: false, skipped: true, reason: 'WhatsApp not configured', error: 'WhatsApp not configured' }
  }
  const to = normalizePhone(c.phone)
  if (!to) {
    return { ok: false, skipped: true, reason: 'Brand did not provide a phone number', error: 'No phone number' }
  }

  const text = formatConfirmationMessage(c)

  // Try freeform first (works only if recipient previously messaged business — usually NOT)
  try {
    const res = await postToGraph(phoneNumberId, token, {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { preview_url: false, body: text },
    })
    if (res.ok) {
      const data = (await res.json()) as { messages?: { id: string }[] }
      return { ok: true, messageId: data.messages?.[0]?.id || '', mode: 'freeform' }
    }
    // Fall through to template
  } catch {
    // Fall through to template
  }

  // Fallback: hello_world template — pings the brand. Owner should follow up
  // manually with details once brand replies (which opens the 24h window).
  const tplResult = await sendHelloWorldTemplate(phoneNumberId, token, to)
  if (!tplResult.ok) {
    // Translate common Meta errors into user-friendly skip reasons
    const detailsStr = typeof tplResult.details === 'string' ? tplResult.details : JSON.stringify(tplResult.details || '')
    if (/131030|not in allowed list|allowed list/i.test(detailsStr)) {
      return {
        ok: false,
        skipped: true,
        reason: `Brand number ${c.phone} not in WhatsApp test allowlist. Either add it in Meta dashboard (Test numbers) or move WABA to production. Owner should DM brand manually for now.`,
        error: 'Recipient not in allowed list',
      }
    }
    if (/131026|not registered|not.*whatsapp/i.test(detailsStr)) {
      return {
        ok: false,
        skipped: true,
        reason: `${c.phone} doesn't have WhatsApp. Reach out via email/phone instead.`,
        error: 'Number not on WhatsApp',
      }
    }
    if (/access token|expired|OAuthException.*190/i.test(detailsStr)) {
      return {
        ok: false,
        skipped: true,
        reason: 'WhatsApp access token expired. Generate a new one in Meta dashboard and update WHATSAPP_ACCESS_TOKEN.',
        error: 'Token expired',
      }
    }
  }
  return tplResult
}
