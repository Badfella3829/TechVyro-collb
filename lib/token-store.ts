import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'

type Tokens = {
  instagram?: { token: string; updatedAt: string }
  facebook?: {
    token: string
    updatedAt: string
    pageId?: string
    neverExpires?: boolean
    expiresAt?: number // unix seconds; 0/undefined = never
    longLivedUserToken?: string // for auto re-exchange every 50 days
    appId?: string
    appSecret?: string
  }
}

const DATA_DIR = path.join(process.cwd(), '.data')
const FILE_PATH = path.join(DATA_DIR, 'tokens.json.enc')

let queue: Promise<unknown> = Promise.resolve()
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = queue.then(fn, fn)
  queue = next.catch(() => undefined)
  return next
}

// Encryption key derived from ADMIN_PASSWORD (required for the admin endpoint anyway).
// AES-256-GCM keeps long-lived OAuth tokens safe even if .data is leaked via backup/snapshot.
function key(): Buffer | null {
  const secret = process.env.ADMIN_PASSWORD || process.env.TOKEN_STORE_KEY
  if (!secret) return null
  return crypto.createHash('sha256').update(`techvyro:token-store:${secret}`).digest()
}

function encrypt(plain: string): string {
  const k = key()
  if (!k) throw new Error('ADMIN_PASSWORD must be set to use the encrypted token store')
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', k, iv)
  const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return `v1:${iv.toString('base64')}:${tag.toString('base64')}:${enc.toString('base64')}`
}

function decrypt(blob: string): string {
  const k = key()
  if (!k) throw new Error('ADMIN_PASSWORD must be set to read the encrypted token store')
  const parts = blob.split(':')
  if (parts.length !== 4 || parts[0] !== 'v1') throw new Error('Token store: unsupported format')
  const iv = Buffer.from(parts[1], 'base64')
  const tag = Buffer.from(parts[2], 'base64')
  const enc = Buffer.from(parts[3], 'base64')
  const decipher = crypto.createDecipheriv('aes-256-gcm', k, iv)
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8')
}

async function read(): Promise<Tokens> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  let raw: string
  try {
    raw = await fs.readFile(FILE_PATH, 'utf8')
  } catch (e: unknown) {
    // File missing is the only "soft" failure — anything else (perms, IO) should bubble up.
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') return {}
    throw e
  }
  try {
    return JSON.parse(decrypt(raw)) as Tokens
  } catch (e) {
    // Don't silently discard a corrupt file — back it up so the operator can investigate,
    // then start fresh. Without this, a single bad write could overwrite a permanent FB token.
    const backup = `${FILE_PATH}.corrupt-${Date.now()}`
    try { await fs.rename(FILE_PATH, backup) } catch {}
    console.error(`[token-store] CORRUPT token file moved to ${backup}:`, e)
    return {}
  }
}

async function write(data: Tokens): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  // Atomic write: write to tmp + rename so a crash mid-write can never half-truncate the file.
  const tmp = `${FILE_PATH}.tmp-${process.pid}-${Date.now()}`
  await fs.writeFile(tmp, encrypt(JSON.stringify(data)), { encoding: 'utf8', mode: 0o600 })
  await fs.rename(tmp, FILE_PATH)
  try { await fs.chmod(FILE_PATH, 0o600) } catch {}
}

export async function getStoredTokens(): Promise<Tokens> {
  return withLock(read)
}

export async function setInstagramToken(token: string): Promise<void> {
  return withLock(async () => {
    const data = await read()
    data.instagram = { token, updatedAt: new Date().toISOString() }
    await write(data)
  })
}

export async function setFacebookToken(
  token: string,
  opts: {
    pageId?: string
    neverExpires?: boolean
    expiresAt?: number
    longLivedUserToken?: string
    appId?: string
    appSecret?: string
  } = {}
): Promise<void> {
  return withLock(async () => {
    const data = await read()
    // Preserve previously-stored long-lived user token / app creds if not re-supplied
    const prev = data.facebook
    data.facebook = {
      token,
      updatedAt: new Date().toISOString(),
      pageId: opts.pageId ?? prev?.pageId,
      neverExpires: opts.neverExpires ?? false,
      expiresAt: opts.expiresAt,
      longLivedUserToken: opts.longLivedUserToken ?? prev?.longLivedUserToken,
      appId: opts.appId ?? prev?.appId,
      appSecret: opts.appSecret ?? prev?.appSecret,
    }
    await write(data)
  })
}

/** Returns the IG token to use (stored override → env). */
export async function getInstagramToken(): Promise<string | undefined> {
  const data = await getStoredTokens()
  return data.instagram?.token || process.env.INSTAGRAM_ACCESS_TOKEN
}

/** Returns the FB token to use (stored override → env). */
export async function getFacebookToken(): Promise<string | undefined> {
  const data = await getStoredTokens()
  return data.facebook?.token || process.env.FACEBOOK_PAGE_ACCESS_TOKEN
}

/** Days since the stored IG token was last refreshed (Infinity if never). */
export async function instagramTokenAgeDays(): Promise<number> {
  const data = await getStoredTokens()
  if (!data.instagram) return Infinity
  const ms = Date.now() - new Date(data.instagram.updatedAt).getTime()
  return ms / (1000 * 60 * 60 * 24)
}

/**
 * Calls Instagram's refresh endpoint to extend a long-lived token by 60 more days.
 * Safe to call on every API request — only actually refreshes if age > 50 days.
 */
export async function maybeRefreshInstagramToken(): Promise<void> {
  try {
    const age = await instagramTokenAgeDays()
    if (age < 50) return
    const current = await getInstagramToken()
    if (!current) return
    const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${current}`
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return
    const json = await res.json() as { access_token?: string; expires_in?: number }
    if (json.access_token) {
      await setInstagramToken(json.access_token)
      console.log('[token-store] Instagram token refreshed, expires in', json.expires_in, 's')
    }
  } catch (e) {
    console.warn('[token-store] IG refresh failed:', e)
  }
}

/**
 * Refreshes the Facebook page token (and underlying long-lived user token) before they expire.
 * Same flow as initial exchange:
 *   1. fb_exchange_token: long-lived user token -> fresh long-lived user token (60 more days)
 *   2. /me/accounts with new user token -> fresh page tokens (60 more days)
 * Only fires if the current page token is within 10 days of expiry.
 */
export async function maybeRefreshFacebookToken(): Promise<void> {
  try {
    const data = await getStoredTokens()
    const fb = data.facebook
    if (!fb || fb.neverExpires) return
    if (!fb.expiresAt || !fb.longLivedUserToken || !fb.pageId) return
    const appId = fb.appId || process.env.FACEBOOK_APP_ID
    const appSecret = fb.appSecret || process.env.FACEBOOK_APP_SECRET
    if (!appId || !appSecret) return

    const secondsLeft = fb.expiresAt - Math.floor(Date.now() / 1000)
    if (secondsLeft / 86400 > 10) return // >10 days left, skip

    const exchUrl =
      `https://graph.facebook.com/v23.0/oauth/access_token?grant_type=fb_exchange_token` +
      `&client_id=${encodeURIComponent(appId)}&client_secret=${encodeURIComponent(appSecret)}` +
      `&fb_exchange_token=${encodeURIComponent(fb.longLivedUserToken)}`
    const exchRes = await fetch(exchUrl, { cache: 'no-store' })
    const exchJson = await exchRes.json() as { access_token?: string; expires_in?: number }
    if (!exchRes.ok || !exchJson.access_token) {
      console.warn('[token-store] FB user-token refresh failed:', exchJson)
      return
    }
    const freshUserToken = exchJson.access_token

    const accountsUrl = `https://graph.facebook.com/v23.0/me/accounts?access_token=${encodeURIComponent(freshUserToken)}`
    const accountsRes = await fetch(accountsUrl, { cache: 'no-store' })
    const accountsJson = await accountsRes.json() as { data?: Array<{ id: string; access_token: string; name: string }> }
    const matched = accountsJson.data?.find((a) => a.id === fb.pageId)
    if (!matched) {
      console.warn('[token-store] FB page not found in fresh /me/accounts')
      return
    }

    let newExpiresAt: number | undefined
    try {
      const dbgUrl = `https://graph.facebook.com/debug_token?input_token=${encodeURIComponent(matched.access_token)}&access_token=${encodeURIComponent(appId + '|' + appSecret)}`
      const dbgRes = await fetch(dbgUrl, { cache: 'no-store' })
      const dbgJson = await dbgRes.json() as { data?: { expires_at?: number } }
      newExpiresAt = dbgJson.data?.expires_at
    } catch {}

    await setFacebookToken(matched.access_token, {
      pageId: matched.id,
      neverExpires: newExpiresAt === 0,
      expiresAt: newExpiresAt,
      longLivedUserToken: freshUserToken,
      appId,
      appSecret,
    })
    console.log('[token-store] Facebook token auto-refreshed')
  } catch (e) {
    console.warn('[token-store] FB refresh failed:', e)
  }
}

/** Days until the Facebook page token expires (Infinity if never-expires or unknown). */
export async function facebookTokenDaysUntilExpiry(): Promise<number> {
  const data = await getStoredTokens()
  const fb = data.facebook
  if (!fb) return Infinity
  if (fb.neverExpires || !fb.expiresAt) return Infinity
  return (fb.expiresAt - Math.floor(Date.now() / 1000)) / 86400
}
