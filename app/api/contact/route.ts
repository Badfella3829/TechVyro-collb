import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { sendInquiryWhatsapp } from '@/lib/whatsapp'
import { addBooking } from '@/lib/availability-store'
import { sendEmail, buildInquiryAckEmail, buildOwnerAlertEmail } from '@/lib/email'

const OWNER_EMAIL = process.env.OWNER_EMAIL || 'techvyro@gmail.com'

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
    const brand = body.brandName?.toString().trim() || ''
    const contact = body.contactName?.toString().trim() || ''
    const email = body.email?.toString().trim() || ''
    const phone = body.phone?.toString().trim() || ''
    const website = body.website?.toString().trim() || ''
    const goal = body.campaignGoal?.toString().trim() || ''
    const type = body.collabType?.toString().trim() || ''
    const budget = body.budget?.toString().trim() || ''
    const timeline = body.timeline?.toString().trim() || ''
    const startDate = body.startDate?.toString().trim() || ''
    const msg = body.message?.toString().trim() || ''
    const deliverables = Array.isArray(body.deliverables) ? body.deliverables : []

    if (!brand || brand.length < 2) fieldErrors.brandName = 'Brand name is required'
    if (!contact || contact.length < 2) fieldErrors.contactName = 'Contact name is required'

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!email) fieldErrors.email = 'Email is required'
    else if (!emailRegex.test(email)) fieldErrors.email = 'Invalid email address'

    const phoneDigits = phone.replace(/\D/g, '')
    if (!phone) fieldErrors.phone = 'WhatsApp number is required'
    else if (phoneDigits.length < 10 || phoneDigits.length > 15)
      fieldErrors.phone = 'Enter a valid WhatsApp number with country code'
    else if (!/^\+?[\d\s\-()]{10,20}$/.test(phone))
      fieldErrors.phone = 'Only digits, spaces, +, -, () allowed'

    if (!website) fieldErrors.website = 'Website or social handle is required'
    else if (
      !/^@[A-Za-z0-9_.]{2,}$/.test(website) &&
      !/^(https?:\/\/)?([\w-]+\.)+[A-Za-z]{2,}([\/?#].*)?$/.test(website)
    ) fieldErrors.website = 'Enter a domain or @handle'

    if (!goal) fieldErrors.campaignGoal = 'Campaign goal is required'
    if (!type) fieldErrors.collabType = 'Collab type is required'
    if (deliverables.length === 0) fieldErrors.deliverables = 'Pick at least one deliverable'
    if (!budget) fieldErrors.budget = 'Budget range is required'
    if (!timeline) fieldErrors.timeline = 'Timeline is required'

    if (!startDate) fieldErrors.startDate = 'Start date is required'
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) fieldErrors.startDate = 'Use YYYY-MM-DD format'
    else {
      const picked = new Date(startDate)
      const today = new Date(); today.setHours(0, 0, 0, 0)
      if (isNaN(picked.getTime()) || picked < today) fieldErrors.startDate = 'Pick today or a future date'
    }

    if (!msg) fieldErrors.message = 'Brief is required'
    else if (msg.length < 20) fieldErrors.message = 'Brief must be at least 20 characters'
    else if (msg.length > 2000) fieldErrors.message = 'Brief must be under 2000 characters'

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

    // Send owner alert email (to techvyro@gmail.com)
    let ownerAlert: { delivered: boolean; error?: string } = { delivered: false }
    try {
      const ownerBuilt = buildOwnerAlertEmail({
        reference,
        brandName: inquiry.brandName,
        contactName: inquiry.contactName,
        email: inquiry.email,
        phone: inquiry.phone,
        website: inquiry.website,
        campaignGoal: inquiry.campaignGoal,
        collabType: inquiry.collabType,
        deliverables: inquiry.deliverables,
        budget: inquiry.budget,
        timeline: inquiry.timeline,
        startDate: inquiry.startDate,
        message: inquiry.message,
      })
      const r = await sendEmail({
        to: OWNER_EMAIL,
        subject: ownerBuilt.subject,
        text: ownerBuilt.text,
        html: ownerBuilt.html,
        replyTo: inquiry.email,
      })
      if (r.ok) ownerAlert = { delivered: true }
      else if ('skipped' in r) ownerAlert = { delivered: false, error: r.reason }
      else { ownerAlert = { delivered: false, error: r.error }; console.error('[contact] Owner alert email failed:', r.error) }
    } catch (err) {
      ownerAlert = { delivered: false, error: String(err) }
      console.error('[contact] Owner alert email threw:', err)
    }

    // Send acknowledgement email to brand
    let ack: { delivered: boolean; error?: string } = { delivered: false }
    try {
      const built = buildInquiryAckEmail({
        reference,
        brandName: inquiry.brandName,
        contactName: inquiry.contactName,
        email: inquiry.email,
        phone: inquiry.phone,
        website: inquiry.website,
        campaignGoal: inquiry.campaignGoal,
        collabType: inquiry.collabType,
        deliverables: inquiry.deliverables,
        budget: inquiry.budget,
        timeline: inquiry.timeline,
        startDate: inquiry.startDate,
        message: inquiry.message,
      })
      const r = await sendEmail({
        to: inquiry.email,
        subject: built.subject,
        text: built.text,
        html: built.html,
      })
      if (r.ok) ack = { delivered: true }
      else if ('skipped' in r) ack = { delivered: false, error: r.reason }
      else { ack = { delivered: false, error: r.error }; console.error('[contact] Ack email failed:', r.error) }
    } catch (err) {
      ack = { delivered: false, error: String(err) }
      console.error('[contact] Ack email threw:', err)
    }

    return NextResponse.json({
      ok: true,
      message: 'Inquiry received. You will hear back within 24 hours.',
      reference,
      notification,
      ack,
      ownerAlert,
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to process inquiry', details: String(err) },
      { status: 500 }
    )
  }
}
