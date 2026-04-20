import { maybeRefreshInstagramToken, instagramTokenAgeDays, maybeRefreshFacebookToken, facebookTokenDaysUntilExpiry } from './token-store'

/**
 * Server-side daily keep-alive that guarantees the Instagram long-lived token
 * never expires — even if the site gets zero user traffic for months.
 *
 * Runs once per Node process (idempotent guard via globalThis), polls every 24h,
 * and lets `maybeRefreshInstagramToken` decide whether an actual refresh is needed.
 *
 * This is the difference between "auto-refreshes on traffic" and "truly permanent
 * unless you manually revoke" — the latter requires this keep-alive.
 */
const KEY = '__techvyro_token_keepalive__'
const INTERVAL_MS = 24 * 60 * 60 * 1000 // 24h

declare global {
  // eslint-disable-next-line no-var
  var __techvyro_token_keepalive__: { started: boolean; lastRunAt?: string } | undefined
}

export function startTokenKeepAlive() {
  const g = globalThis as unknown as Record<string, { started: boolean; lastRunAt?: string } | undefined>
  if (g[KEY]?.started) return
  g[KEY] = { started: true }

  const tick = async () => {
    try {
      const igAge = await instagramTokenAgeDays()
      const fbDaysLeft = await facebookTokenDaysUntilExpiry()
      await maybeRefreshInstagramToken()
      await maybeRefreshFacebookToken()
      g[KEY]!.lastRunAt = new Date().toISOString()
      console.log(`[keep-alive] IG age=${Math.round(igAge)}d, FB expires in ${Number.isFinite(fbDaysLeft) ? Math.round(fbDaysLeft) + 'd' : 'never'}`)
    } catch (e) {
      console.warn('[keep-alive] tick failed:', e)
    }
  }

  // Fire once on boot (delayed 30s so server is fully up), then every 24h
  setTimeout(tick, 30_000)
  setInterval(tick, INTERVAL_MS)
  console.log('[keep-alive] Token refresh cron started — IG will stay permanent forever')
}

export function getKeepAliveStatus() {
  const g = globalThis as unknown as Record<string, { started: boolean; lastRunAt?: string } | undefined>
  return g[KEY] || { started: false }
}
