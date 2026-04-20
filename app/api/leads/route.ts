import { NextResponse } from 'next/server'
import { listLeads, updateLeadStatus, deleteLead, type LeadStatus } from '@/lib/lead-store'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function gate(req: Request): NextResponse | null {
  // Brute-force protection: 30 requests per IP per 5 minutes (any outcome)
  const ip = getClientIp(req)
  const rl = rateLimit(`leads:${ip}`, 30, 5 * 60 * 1000)
  if (!rl.ok) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const auth = req.headers.get('authorization') || ''
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7).trim() : ''
  if (!bearer || bearer !== expected) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return null
}

const VALID_STATUSES: LeadStatus[] = ['new', 'contacted', 'booked', 'closed', 'lost']

export async function GET(req: Request) {
  const fail = gate(req); if (fail) return fail
  const leads = await listLeads()
  return NextResponse.json({ leads })
}

export async function PATCH(req: Request) {
  const fail = gate(req); if (fail) return fail
  try {
    const body = await req.json()
    const { id, status, notes } = body || {}
    if (!id || typeof id !== 'string' || id.length > 64) return NextResponse.json({ error: 'id required' }, { status: 400 })
    if (!status || !VALID_STATUSES.includes(status)) return NextResponse.json({ error: 'invalid status' }, { status: 400 })
    const safeNotes = typeof notes === 'string' ? notes.slice(0, 500) : undefined
    const lead = await updateLeadStatus(id, status, safeNotes)
    if (!lead) return NextResponse.json({ error: 'not found' }, { status: 404 })
    return NextResponse.json({ lead })
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  const fail = gate(req); if (fail) return fail
  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  if (!id || id.length > 64) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const ok = await deleteLead(id)
  if (!ok) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
