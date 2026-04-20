import { NextResponse } from 'next/server'
import { setFacebookToken } from '@/lib/token-store'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Exchanges a short-lived User Access Token (from Graph API Explorer) for a
 * never-expiring Page Access Token, then persists it to the token store.
 *
 * Body: { userToken: string, appId?: string, appSecret?: string }
 *
 * If appId/appSecret aren't passed, falls back to FACEBOOK_APP_ID / FACEBOOK_APP_SECRET env vars.
 *
 * Flow (per Meta docs):
 *   1. short user token  -> long-lived user token (60 days)
 *   2. long-lived user token -> /me/accounts -> page tokens (never expire)
 */
export async function POST(req: Request) {
  // Brute-force protection
  const ip = getClientIp(req)
  const rl = rateLimit(`fb-exchange:${ip}`, 10, 5 * 60 * 1000)
  if (!rl.ok) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  // Auth
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return NextResponse.json({ error: 'ADMIN_PASSWORD not set' }, { status: 500 })
  const auth = req.headers.get('authorization') || ''
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7).trim() : ''
  if (!bearer || bearer !== expected) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { userToken?: string; appId?: string; appSecret?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const userToken = body.userToken?.trim()
  const appId = (body.appId || process.env.FACEBOOK_APP_ID || '').trim()
  const appSecret = (body.appSecret || process.env.FACEBOOK_APP_SECRET || '').trim()
  const targetPageId = (process.env.FACEBOOK_PAGE_ID || '').trim()

  if (!userToken) return NextResponse.json({ error: 'userToken required' }, { status: 400 })
  if (!appId || !appSecret) {
    return NextResponse.json(
      { error: 'FACEBOOK_APP_ID and FACEBOOK_APP_SECRET must be set (in env or in request body)' },
      { status: 400 }
    )
  }
  if (!targetPageId) {
    return NextResponse.json({ error: 'FACEBOOK_PAGE_ID env var must be set' }, { status: 400 })
  }

  try {
    // Step 1: short user token -> long-lived user token
    const exchUrl =
      `https://graph.facebook.com/v23.0/oauth/access_token?grant_type=fb_exchange_token` +
      `&client_id=${encodeURIComponent(appId)}&client_secret=${encodeURIComponent(appSecret)}` +
      `&fb_exchange_token=${encodeURIComponent(userToken)}`
    const exchRes = await fetch(exchUrl, { cache: 'no-store' })
    const exchJson = await exchRes.json()
    if (!exchRes.ok || !exchJson.access_token) {
      console.error('[fb-exchange] step=exchange-user-token', exchJson)
      return NextResponse.json(
        { step: 'exchange-user-token', error: exchJson.error?.message || 'Exchange failed' },
        { status: 400 }
      )
    }
    const longUserToken: string = exchJson.access_token

    // Step 2: long-lived user token -> page tokens via /me/accounts
    const accountsUrl = `https://graph.facebook.com/v23.0/me/accounts?access_token=${encodeURIComponent(longUserToken)}`
    const accountsRes = await fetch(accountsUrl, { cache: 'no-store' })
    const accountsJson = await accountsRes.json()
    if (!accountsRes.ok) {
      console.error('[fb-exchange] step=list-accounts', accountsJson)
      return NextResponse.json(
        { step: 'list-accounts', error: accountsJson.error?.message || 'Failed to list accounts' },
        { status: 400 }
      )
    }
    const accounts: Array<{ id: string; name: string; access_token: string; category?: string }> = accountsJson.data || []
    const matched = accounts.find((a) => a.id === targetPageId)
    if (!matched) {
      return NextResponse.json(
        {
          step: 'find-page',
          error: `Page ${targetPageId} not in user's managed pages`,
          managedPages: accounts.map((a) => ({ id: a.id, name: a.name })),
        },
        { status: 400 }
      )
    }

    // Step 3a: check expiry of the page token via debug_token
    let expiresAt: number | null = null
    try {
      const dbgUrl = `https://graph.facebook.com/debug_token?input_token=${encodeURIComponent(matched.access_token)}&access_token=${encodeURIComponent(appId + '|' + appSecret)}`
      const dbgRes = await fetch(dbgUrl, { cache: 'no-store' })
      const dbgJson = await dbgRes.json()
      expiresAt = dbgJson.data?.expires_at ?? 0
    } catch {}

    // Step 3b: persist token + the long-lived user token + app creds for auto-refresh
    await setFacebookToken(matched.access_token, {
      pageId: matched.id,
      neverExpires: expiresAt === 0,
      expiresAt: expiresAt ?? undefined,
      longLivedUserToken: longUserToken,
      appId,
      appSecret,
    })

    return NextResponse.json({
      ok: true,
      pageId: matched.id,
      pageName: matched.name,
      neverExpires: expiresAt === 0,
      expiresAt,
      autoRefreshEnabled: true,
      message:
        expiresAt === 0
          ? 'Page Access Token saved — never expires.'
          : 'Page Access Token saved. Auto-refresh cron will renew it every 50 days, so Facebook stats stay live forever.',
    })
  } catch (err) {
    return NextResponse.json({ error: 'Exchange request failed', details: String(err) }, { status: 500 })
  }
}

/** GET returns current stored token status (no token value exposed). */
export async function GET(req: Request) {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return NextResponse.json({ error: 'ADMIN_PASSWORD not set' }, { status: 500 })
  const auth = req.headers.get('authorization') || ''
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7).trim() : ''
  if (!bearer || bearer !== expected) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { getStoredTokens, instagramTokenAgeDays, facebookTokenDaysUntilExpiry } = await import('@/lib/token-store')
  const { getKeepAliveStatus } = await import('@/lib/token-keepalive')
  const tokens = await getStoredTokens()
  const igAge = await instagramTokenAgeDays()
  const fbDaysLeft = await facebookTokenDaysUntilExpiry()
  const keepAlive = getKeepAliveStatus()
  return NextResponse.json({
    instagram: tokens.instagram
      ? { updatedAt: tokens.instagram.updatedAt, ageDays: Math.round(igAge), source: 'stored' }
      : { source: 'env', note: 'Add a token by hitting any IG API call once to start auto-refresh.' },
    facebook: tokens.facebook
      ? {
          updatedAt: tokens.facebook.updatedAt,
          pageId: tokens.facebook.pageId,
          neverExpires: tokens.facebook.neverExpires ?? false,
          daysUntilExpiry: Number.isFinite(fbDaysLeft) ? Math.round(fbDaysLeft) : null,
          autoRefreshReady: !!(tokens.facebook.longLivedUserToken && (tokens.facebook.appId || process.env.FACEBOOK_APP_ID) && (tokens.facebook.appSecret || process.env.FACEBOOK_APP_SECRET)),
          source: 'stored',
        }
      : { source: 'env', note: 'Use POST to exchange a User Token for a never-expiring Page Token.' },
    youtube: { source: 'env', neverExpires: true, note: 'YouTube API keys never expire.' },
    whatsapp: { source: 'env', neverExpires: true, note: 'System User token — never expires unless revoked.' },
    gmail: { source: 'env', neverExpires: true, note: 'App Password — never expires unless revoked.' },
    keepAlive: { running: keepAlive.started, lastRunAt: keepAlive.lastRunAt || null, intervalHours: 24 },
    appConfigured: !!(process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET),
  })
}
