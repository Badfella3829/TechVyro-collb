type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

export function rateLimit(key: string, max: number, windowMs: number): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const existing = buckets.get(key)
  if (!existing || existing.resetAt < now) {
    const resetAt = now + windowMs
    buckets.set(key, { count: 1, resetAt })
    return { ok: true, remaining: max - 1, resetAt }
  }
  existing.count++
  if (existing.count > max) {
    return { ok: false, remaining: 0, resetAt: existing.resetAt }
  }
  return { ok: true, remaining: max - existing.count, resetAt: existing.resetAt }
}

export function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}

// Periodic cleanup
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [k, b] of buckets.entries()) if (b.resetAt < now) buckets.delete(k)
  }, 60_000)
}
