import { NextResponse } from 'next/server'
import {
  addBooking,
  listBookings,
  markConfirmationSent,
  removeBooking,
  updateBookingStatus,
  type SlotState,
} from '@/lib/availability-store'
import { sendBookingConfirmation } from '@/lib/whatsapp'

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
      action: 'add' | 'update' | 'remove'
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
      const { entry, previousStatus } = result

      // Auto-send WhatsApp confirmation when transitioning to "booked"
      let confirmation:
        | { sent: boolean; mode?: string; skipped?: boolean; reason?: string; error?: string }
        | undefined
      if (body.status === 'booked' && previousStatus !== 'booked') {
        const r = await sendBookingConfirmation({
          brandName: entry.brandName,
          contactName: entry.contactName,
          date: entry.date,
          reference: entry.reference,
          collabType: entry.collabType,
          phone: entry.phone,
        })
        if (r.ok) {
          confirmation = { sent: true, mode: r.mode }
          await markConfirmationSent(entry.id)
        } else if (r.skipped) {
          confirmation = { sent: false, skipped: true, reason: r.reason }
        } else {
          confirmation = { sent: false, error: r.error }
          console.error('[admin] Brand confirmation failed:', r.error, r.details)
        }
      }

      return NextResponse.json({ ok: true, entry, confirmation })
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
