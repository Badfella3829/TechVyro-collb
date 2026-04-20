import { NextResponse } from 'next/server'
import { getPublicAvailability } from '@/lib/availability-store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = await getPublicAvailability()
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store, must-revalidate' },
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to load availability', details: String(err) },
      { status: 500 }
    )
  }
}
