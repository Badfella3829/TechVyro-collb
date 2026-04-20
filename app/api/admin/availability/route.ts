import { NextResponse } from 'next/server'
import {
  addBooking,
  listBookings,
  markConfirmationSent,
  removeBooking,
  updateBookingStatus,
  getBookingById,
  type SlotState,
} from '@/lib/availability-store'
import { sendEmail, buildConfirmationEmail } from '@/lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function authorized(req: Request): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  // Bearer token in Authorization header OR ?key= query param
  const auth = req.headers.get('authorization') || ''
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7).trim() : ''
  if (bearer && bearer === expected) return true
  const url = new URL(req.url)
  const key = url.searchParams.get('key') || ''
  return key === expected
}

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function GET(req: Request) {
  if (!authorized(req)) return unauthorized()
  const bookings = await listBookings()
  return NextResponse.json({ bookings })
}

export async function POST(req: Request) {
  if (!authorized(req)) return unauthorized()
  try {
    const body = (await req.json()) as {
      action: 'add' | 'update' | 'remove' | 'mark-confirmation-sent' | 'send-confirmation-email'
      id?: string
      date?: string
      status?: SlotState
      brandName?: string
      contactName?: string
      email?: string
      reference?: string
      collabType?: string
      notes?: string
    }
    if (body.action === 'add') {
      if (!body.date || !body.status || !body.brandName || !body.contactName || !body.email || !body.reference) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
      }
      const entry = await addBooking({
        date: body.date,
        status: body.status,
        brandName: body.brandName,
        contactName: body.contactName,
        email: body.email,
        reference: body.reference,
        collabType: body.collabType,
        notes: body.notes,
      })
      if (!entry) return NextResponse.json({ error: 'Invalid date' }, { status: 400 })
      return NextResponse.json({ ok: true, entry })
    }
    if (body.action === 'update') {
      if (!body.id || !body.status) return NextResponse.json({ error: 'Missing id/status' }, { status: 400 })
      const result = await updateBookingStatus(body.id, body.status)
      if (!result) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      const { entry } = result
      // Confirmation messages are sent manually via WhatsApp/Email buttons in admin UI
      return NextResponse.json({ ok: true, entry })
    }
    if (body.action === 'mark-confirmation-sent') {
      if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
      const ok = await markConfirmationSent(body.id)
      if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json({ ok: true })
    }
    if (body.action === 'send-confirmation-email') {
      if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
      const entry = await getBookingById(body.id)
      if (!entry) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      const built = buildConfirmationEmail({
        brandName: entry.brandName,
        contactName: entry.contactName,
        date: entry.date,
        reference: entry.reference,
        collabType: entry.collabType,
      })
      const result = await sendEmail({
        to: entry.email,
        subject: built.subject,
        text: built.text,
        html: built.html,
      })
      if (result.ok) {
        await markConfirmationSent(entry.id)
        return NextResponse.json({ ok: true, sent: true, to: entry.email })
      }
      if ('skipped' in result) {
        return NextResponse.json({ ok: false, skipped: true, reason: result.reason })
      }
      return NextResponse.json({ ok: false, error: result.error })
    }
    if (body.action === 'remove') {
      if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
      const ok = await removeBooking(body.id)
      if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ error: 'Failed', details: String(err) }, { status: 500 })
  }
}
