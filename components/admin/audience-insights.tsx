"use client"

import { useEffect, useState } from 'react'
import { Users, MapPin, Globe2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

type Insights = {
  ok: boolean
  source: string
  totalFans?: number
  countries?: { code: string; count: number }[]
  cities?: { name: string; count: number }[]
  gender?: { label: string; count: number }[]
  ageGender?: { bucket: string; count: number }[]
  note?: string
}

function Bar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div>
      <div className="flex justify-between text-xs mb-0.5">
        <span className="truncate text-foreground">{label}</span>
        <span className="text-muted-foreground tabular-nums ml-2">{value.toLocaleString('en-IN')}</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary to-purple-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export function AudienceInsights() {
  const [data, setData] = useState<Insights | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/audience').then((r) => r.json()).then((j) => setData(j)).finally(() => setLoading(false))
  }, [])

  if (loading) return <Card className="glass border-border/50"><CardContent className="p-6 text-sm text-muted-foreground">Loading audience data…</CardContent></Card>
  if (!data || !data.ok) {
    return (
      <Card className="glass border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">Audience Demographics</h2>
          </div>
          <p className="text-xs text-muted-foreground">{data?.note || 'Audience insights unavailable. Requires a Facebook Page with 100+ likes and the page_show_list / read_insights permissions on your token.'}</p>
        </CardContent>
      </Card>
    )
  }

  const cMax = Math.max(1, ...(data.cities || []).map((c) => c.count))
  const ctMax = Math.max(1, ...(data.countries || []).map((c) => c.count))
  const gMax = Math.max(1, ...(data.gender || []).map((g) => g.count))

  return (
    <Card className="glass border-border/50">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-4 w-4 text-primary" />
          <h2 className="font-semibold">Audience Demographics</h2>
          {typeof data.totalFans === 'number' && (
            <span className="text-xs text-muted-foreground">· {data.totalFans.toLocaleString('en-IN')} total fans</span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground mb-4">Source: Facebook Page Insights · Live</p>

        <div className="grid sm:grid-cols-3 gap-5">
          {data.cities && data.cities.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2"><MapPin className="h-3 w-3" /> Top cities</div>
              <div className="space-y-2">
                {data.cities.slice(0, 6).map((c) => <Bar key={c.name} label={c.name} value={c.count} max={cMax} />)}
              </div>
            </div>
          )}
          {data.countries && data.countries.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2"><Globe2 className="h-3 w-3" /> Top countries</div>
              <div className="space-y-2">
                {data.countries.slice(0, 6).map((c) => <Bar key={c.code} label={c.code} value={c.count} max={ctMax} />)}
              </div>
            </div>
          )}
          {data.gender && data.gender.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2"><Users className="h-3 w-3" /> Gender split</div>
              <div className="space-y-2">
                {data.gender.map((g) => <Bar key={g.label} label={g.label} value={g.count} max={gMax} />)}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
