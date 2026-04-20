/**
 * Next.js instrumentation hook — runs once when the server starts.
 * Used to boot the daily token keep-alive cron so social tokens
 * stay permanent without depending on user traffic.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { startTokenKeepAlive } = await import('./lib/token-keepalive')
    startTokenKeepAlive()
  }
}
