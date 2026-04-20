import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { sendInquiryWhatsapp } from '@/lib/whatsapp'
import { addBooking } from '@/lib/availability-store'

export const runtime = 'nodejs'

type Inquiry = {
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
  receivedAt: string
  userAgent?: string
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<Inquiry>

    const fieldErrors: Record<string, string> = {}
    if (!body.brandName?.toString().trim()) fieldErrors.brandName = 'Brand name is required'
    if (!body.contactName?.toString().trim()) fieldErrors.contactName = 'Contact name is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!body.email?.toString().trim()) fieldErrors.email = 'Email is required'
    else if (!emailRegex.test(String(body.email))) fieldErrors.email = 'Invalid email address'
    if (!body.campaignGoal?.toString().trim()) fieldErrors.campaignGoal = 'Campaign goal is required'
    if (!body.collabType?.toString().trim()) fieldErrors.collabType = 'Collab type is required'
    const msg = body.message?.toString().trim() || ''
    if (msg.length < 20) fieldErrors.message = 'Message must be at least 20 characters'

    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', fieldErrors },
        { status: 400 }
      )
    }

    const inquiry: Inquiry = {
      brandName: String(body.brandName).trim(),
      contactName: String(body.contactName).trim(),
      email: String(body.email).trim(),
      phone: body.phone?.trim(),
      website: body.website?.trim(),
      campaignGoal: String(body.campaignGoal || '').trim(),
      collabType: String(body.collabType || '').trim(),
      deliverables: Array.isArray(body.deliverables) ? body.deliverables : [],
      budget: body.budget?.trim(),
      timeline: body.timeline?.trim(),
      startDate: body.startDate?.trim(),
      message: String(body.message).trim(),
      fitScore: typeof body.fitScore === 'number' ? body.fitScore : undefined,
      receivedAt: new Date().toISOString(),
      userAgent: req.headers.get('user-agent') || undefined,
    }

    // Persist to a local NDJSON log so user can review later.
    try {
      const dir = path.join(process.cwd(), '.data')
      await fs.mkdir(dir, { recursive: true })
      const file = path.join(dir, 'inquiries.ndjson')
      await fs.appendFile(file, JSON.stringify(inquiry) + '\n', 'utf8')
    } catch {
      // Filesystem write failed (read-only env). Continue silently — response still goes back.
    }

    const reference = `TV-${Date.now().toString(36).toUpperCase()}`

    // If a startDate was provided, automatically reserve it as TENTATIVE.
    // The owner can later confirm or remove via /admin/availability.
    if (inquiry.startDate && /^\d{4}-\d{2}-\d{2}$/.test(inquiry.startDate)) {
      try {
        await addBooking({
          date: inquiry.startDate,
          status: 'tentative',
          brandName: inquiry.brandName,
          contactName: inquiry.contactName,
          email: inquiry.email,
          phone: inquiry.phone,
          reference,
          collabType: inquiry.collabType,
        })
      } catch (e) {
        console.error('[contact] Failed to add tentative booking:', e)
      }
    }

    // Fire-and-record WhatsApp notification (non-blocking failure).
    let notification: { delivered: boolean; mode?: string; error?: string } = { delivered: false }
    try {
      const r = await sendInquiryWhatsapp({ ...inquiry, reference })
      if (r.ok) {
        notification = { delivered: true, mode: r.mode }
      } else {
        notification = { delivered: false, error: r.error }
        console.error('[contact] WhatsApp notify failed:', r.error, r.details)
      }
    } catch (err) {
      notification = { delivered: false, error: String(err) }
      console.error('[contact] WhatsApp notify threw:', err)
    }

    return NextResponse.json({
      ok: true,
      message: 'Inquiry received. You will hear back within 24 hours.',
      reference,
      notification,
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to process inquiry', details: String(err) },
      { status: 500 }
    )
  }
}
