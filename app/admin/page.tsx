"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, LayoutDashboard, Calendar, Lock } from 'lucide-react'
import { BestTimeInsights } from '@/components/admin/best-time-insights'
import { GrowthCharts } from '@/components/charts/growth-charts'
import { LeadsTable } from '@/components/admin/leads-table'
import { AudienceInsights } from '@/components/admin/audience-insights'
import { TokenManager } from '@/components/admin/token-manager'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useInstagram } from '@/hooks/use-instagram'
import { useFacebook } from '@/hooks/use-facebook'
import { useYouTube } from '@/hooks/use-youtube'

const PASSWORD_KEY = 'techvyro:admin-key'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PASSWORD_KEY)
      if (saved) verify(saved)
    } catch {}
  }, [])

  const verify = async (pwd: string) => {
    setLoading(true); setError(null)
    try {
      const res = await fetch('/api/admin/availability', {
        headers: { Authorization: `Bearer ${pwd}` },
      })
      if (res.ok) {
        setAuthed(true); setToken(pwd)
        try { localStorage.setItem(PASSWORD_KEY, pwd) } catch {}
      } else {
        setError('Wrong password')
        try { localStorage.removeItem(PASSWORD_KEY) } catch {}
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const { data: ig } = useInstagram()
  const { data: fb } = useFacebook()
  const { data: yt } = useYouTube()

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm glass border border-border/50 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold">Owner Login</h1>
          </div>
          <p className="text-sm text-muted-foreground mb-5">Enter your admin password to view internal dashboards.</p>
          <form onSubmit={(e) => { e.preventDefault(); if (password.trim()) verify(password.trim()) }} className="space-y-3">
            <Input type="password" placeholder="Admin password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
            <Button type="submit" disabled={loading} className="w-full">{loading ? 'Verifying…' : 'Sign in'}</Button>
            {error && <p className="text-xs text-red-500 text-center">{error}</p>}
            <Link href="/" className="block text-xs text-center text-muted-foreground hover:text-foreground mt-2">← Back to site</Link>
          </form>
        </div>
      </main>
    )
  }

  const postsByPlatform = {
    instagram: (ig?.media || []).map((m: any) => ({
      ts: new Date(m.timestamp).getTime(),
      engagement: (m.like_count ?? 0) + (m.comments_count ?? 0) * 3,
    })),
    facebook: (fb?.posts || []).map((p: any) => ({
      ts: new Date(p.created_time).getTime(),
      engagement: (p.reactions?.summary?.total_count ?? 0) + (p.comments?.summary?.total_count ?? 0) * 3,
    })),
    youtube: (yt?.videos || []).map((v: any) => ({
      ts: new Date(v.publishedAt).getTime(),
      engagement: v.views ?? 0,
    })),
  }

  return (
    <main className="min-h-screen pt-24 pb-24 md:pb-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <Link href="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-2">
              <ArrowLeft className="h-3 w-3" /> Back to site
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <LayoutDashboard className="h-6 w-6 text-primary" /> Owner Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Internal insights powered by real Graph API data</p>
          </div>
          <Link
            href="/admin/availability"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-sm font-semibold transition-colors"
          >
            <Calendar className="h-4 w-4" /> Manage Availability
          </Link>
        </div>

        <div className="space-y-6">
          <TokenManager token={token} />
          <LeadsTable token={token} />
          <AudienceInsights />
          <GrowthCharts postsByPlatform={postsByPlatform} />
          <BestTimeInsights />
        </div>
      </div>
    </main>
  )
}
