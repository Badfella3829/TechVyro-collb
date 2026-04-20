"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { KeyRound, RefreshCw, CheckCircle2, AlertCircle, Instagram, Facebook, Youtube, Loader2, MessageCircle, Mail, Activity } from 'lucide-react'

type Status = {
  instagram: { source: string; updatedAt?: string; ageDays?: number; note?: string }
  facebook: { source: string; updatedAt?: string; pageId?: string; neverExpires?: boolean; note?: string }
  youtube: { source: string; neverExpires: boolean; note?: string }
  whatsapp?: { source: string; neverExpires: boolean; note?: string }
  gmail?: { source: string; neverExpires: boolean; note?: string }
  keepAlive?: { running: boolean; lastRunAt: string | null; intervalHours: number }
  appConfigured: boolean
}

export function TokenManager({ token }: { token: string }) {
  const [status, setStatus] = useState<Status | null>(null)
  const [loading, setLoading] = useState(true)
  const [userToken, setUserToken] = useState('')
  const [appId, setAppId] = useState('')
  const [appSecret, setAppSecret] = useState('')
  const [exchanging, setExchanging] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null)

  const refresh = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/exchange-fb-token', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) setStatus(await res.json())
    } catch {}
    setLoading(false)
  }

  useEffect(() => { refresh() }, [token])

  const exchange = async () => {
    if (!userToken.trim()) return
    setExchanging(true); setResult(null)
    try {
      const res = await fetch('/api/admin/exchange-fb-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          userToken: userToken.trim(),
          appId: appId.trim() || undefined,
          appSecret: appSecret.trim() || undefined,
        }),
      })
      const json = await res.json()
      if (res.ok && json.ok) {
        setResult({
          ok: true,
          message: `${json.pageName} (${json.pageId}) — ${json.neverExpires ? 'Never expires ✓' : `Expires at ${new Date((json.expiresAt || 0) * 1000).toLocaleString()}`}`,
        })
        setUserToken(''); setAppSecret('')
        refresh()
      } else {
        setResult({ ok: false, message: json.error || 'Exchange failed' })
      }
    } catch (e) {
      setResult({ ok: false, message: String(e) })
    }
    setExchanging(false)
  }

  return (
    <Card className="glass border-border/50">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" /> Token Manager
          </h2>
          <Button size="sm" variant="ghost" onClick={refresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Keep-alive banner */}
        {status?.keepAlive && (
          <div className={`mb-4 flex items-start gap-2 p-3 rounded-lg text-xs ${status.keepAlive.running ? 'bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'}`}>
            <Activity className={`h-4 w-4 shrink-0 mt-0.5 ${status.keepAlive.running ? 'animate-pulse' : ''}`} />
            <div>
              <strong>{status.keepAlive.running ? 'Keep-alive cron running' : 'Keep-alive cron stopped'}</strong>
              {' — '}
              checks every {status.keepAlive.intervalHours}h to keep Instagram token alive forever (zero-traffic safe).
              {status.keepAlive.lastRunAt && (
                <span className="block opacity-75 mt-0.5">Last run: {new Date(status.keepAlive.lastRunAt).toLocaleString()}</span>
              )}
            </div>
          </div>
        )}

        {/* Platform status grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          <PlatformCard
            icon={Instagram}
            label="Instagram"
            color="text-pink-500"
            ok={status?.instagram.source === 'stored' || status?.instagram.source === 'env'}
            permanent={status?.instagram.source === 'stored' && !!status?.keepAlive?.running}
            detail={
              status?.instagram.updatedAt
                ? `Refreshed ${status.instagram.ageDays}d ago • cron auto-extends every 50d → never expires`
                : 'Will be saved + auto-refresh on first API call'
            }
          />
          <PlatformCard
            icon={Facebook}
            label="Facebook"
            color="text-blue-500"
            ok={!!status?.facebook}
            permanent={status?.facebook.neverExpires === true}
            detail={
              status?.facebook.updatedAt
                ? `Saved ${new Date(status.facebook.updatedAt).toLocaleDateString()} — never expires ✓`
                : 'Env token (expires in ~60d). Exchange below for permanent ↓'
            }
          />
          <PlatformCard
            icon={Youtube}
            label="YouTube"
            color="text-red-500"
            ok={true}
            permanent={true}
            detail="API key — Google never expires it"
          />
          <PlatformCard
            icon={MessageCircle}
            label="WhatsApp"
            color="text-green-500"
            ok={true}
            permanent={true}
            detail="System User token — permanent until you revoke"
          />
          <PlatformCard
            icon={Mail}
            label="Gmail"
            color="text-orange-500"
            ok={true}
            permanent={true}
            detail="App Password — permanent until you revoke"
          />
        </div>

        {/* FB Exchange Tool */}
        <div className="border border-border/40 rounded-xl p-4 bg-card/30">
          <h3 className="text-sm font-semibold mb-1">Make Facebook token permanent</h3>
          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
            Open <a className="text-primary underline" href="https://developers.facebook.com/tools/explorer/" target="_blank" rel="noopener noreferrer">Graph API Explorer</a>, select your app, click <strong>Get Token → Get User Access Token</strong>, check <code className="text-[10px] bg-muted px-1 rounded">pages_show_list</code>, <code className="text-[10px] bg-muted px-1 rounded">pages_read_engagement</code>, <code className="text-[10px] bg-muted px-1 rounded">read_insights</code>. Copy the User Token and paste here.
          </p>

          <div className="space-y-2">
            <Input
              type="password"
              placeholder="User Access Token (paste from Graph API Explorer)"
              value={userToken}
              onChange={(e) => setUserToken(e.target.value)}
            />
            {!status?.appConfigured && (
              <>
                <Input
                  placeholder="Facebook App ID"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Facebook App Secret"
                  value={appSecret}
                  onChange={(e) => setAppSecret(e.target.value)}
                />
                <p className="text-[11px] text-muted-foreground">
                  💡 Tip: set <code className="bg-muted px-1 rounded">FACEBOOK_APP_ID</code> and <code className="bg-muted px-1 rounded">FACEBOOK_APP_SECRET</code> as env secrets to skip these fields.
                </p>
              </>
            )}
            <Button onClick={exchange} disabled={!userToken.trim() || exchanging} className="w-full">
              {exchanging ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Exchanging…</> : 'Exchange & save permanent token'}
            </Button>
          </div>

          {result && (
            <div className={`mt-3 p-3 rounded-lg text-xs flex gap-2 ${result.ok ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
              {result.ok ? <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" /> : <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />}
              <span>{result.message}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function PlatformCard({
  icon: Icon, label, color, ok, permanent, detail,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  color: string
  ok: boolean
  permanent: boolean
  detail: string
}) {
  return (
    <div className="border border-border/40 rounded-lg p-3 bg-card/30">
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`h-4 w-4 ${color}`} />
        <span className="text-sm font-semibold">{label}</span>
        {permanent ? (
          <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-green-500/15 text-green-600 dark:text-green-400 font-semibold">PERMANENT</span>
        ) : ok ? (
          <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 font-semibold">EXPIRES</span>
        ) : (
          <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-red-500/15 text-red-600 dark:text-red-400 font-semibold">DOWN</span>
        )}
      </div>
      <p className="text-[11px] text-muted-foreground leading-snug">{detail}</p>
    </div>
  )
}
