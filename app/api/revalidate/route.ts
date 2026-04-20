import { NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export const runtime = 'nodejs'

function authorized(req: Request): boolean {
  const expected = process.env.REVALIDATE_SECRET || process.env.ADMIN_PASSWORD
  if (!expected) return false
  // Require Bearer header only — never accept secrets in URL query params (logged everywhere).
  const auth = req.headers.get('authorization') || ''
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7).trim() : ''
  return bearer.length > 0 && bearer === expected
}

async function handle(req: Request) {
  const url = new URL(req.url)
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const path = url.searchParams.get('path')
  const tag = url.searchParams.get('tag')

  const revalidated: string[] = []
  if (path) { revalidatePath(path); revalidated.push(`path:${path}`) }
  if (tag) { revalidateTag(tag); revalidated.push(`tag:${tag}`) }

  if (!path && !tag) {
    // Default: refresh primary pages
    const paths = ['/', '/analytics', '/portfolio']
    for (const p of paths) { revalidatePath(p); revalidated.push(`path:${p}`) }
  }

  return NextResponse.json({ ok: true, revalidated, at: new Date().toISOString() })
}

export const GET = handle
export const POST = handle
