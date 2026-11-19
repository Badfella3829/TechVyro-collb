const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/

/**
 * Parses a strict YYYY-MM-DD date string into a local-midnight Date object.
 * Returns null if the format is invalid or the calendar date doesn't exist (e.g. 2026-02-30).
 */
export function parseLocalIsoDate(value: string): Date | null {
  const match = ISO_DATE_RE.exec(value.trim())
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }
  return date
}

/**
 * Checks whether a YYYY-MM-DD string represents today or a future date in local time.
 */
export function isTodayOrFutureIsoDate(value: string, now: Date = new Date()): boolean {
  const picked = parseLocalIsoDate(value)
  if (!picked) return false
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return picked.getTime() >= today.getTime()
}

/**
 * Strips all non-digit characters from a phone string (used for WhatsApp wa.me links).
 */
export function sanitizePhoneDigits(phone: string): string {
  return phone.replace(/\D/g, '')
}
