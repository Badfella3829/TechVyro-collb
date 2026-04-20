"use client"

import { useMemo } from 'react'
import { Clock, TrendingUp, Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useInstagram } from '@/hooks/use-instagram'
import { useFacebook } from '@/hooks/use-facebook'
import { useYouTube } from '@/hooks/use-youtube'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

type Bucket = { count: number; engagement: number }

// Always evaluate buckets in IST (Asia/Kolkata) so results are stable for the business
const IST_TZ = 'Asia/Kolkata'
const dowFmt = new Intl.DateTimeFormat('en-US', { timeZone: IST_TZ, weekday: 'short' })
const hourFmt = new Intl.DateTimeFormat('en-GB', { timeZone: IST_TZ, hour: '2-digit', hour12: false })
const DOW_INDEX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }

function bucketize(items: Array<{ ts: number; engagement: number }>) {
  const days: Bucket[] = Array.from({ length: 7 }, () => ({ count: 0, engagement: 0 }))
  const hours: Bucket[] = Array.from({ length: 24 }, () => ({ count: 0, engagement: 0 }))
  items.forEach(({ ts, engagement }) => {
    const d = new Date(ts)
    const day = DOW_INDEX[dowFmt.format(d)] ?? 0
    const hour = parseInt(hourFmt.format(d), 10) || 0
    days[day].count++; days[day].engagement += engagement
    hours[hour].count++; hours[hour].engagement += engagement
  })
  return { days, hours }
}

function avg(b: Bucket): number {
  return b.count > 0 ? b.engagement / b.count : 0
}

export function BestTimeInsights() {
  const { data: ig } = useInstagram()
  const { data: fb } = useFacebook()
  const { data: yt } = useYouTube()

  const insights = useMemo(() => {
    const items: Array<{ ts: number; engagement: number }> = []
    ig?.media?.forEach((m) => items.push({
      ts: new Date(m.timestamp).getTime(),
      engagement: (m.like_count ?? 0) + (m.comments_count ?? 0) * 3,
    }))
    fb?.posts?.forEach((p) => items.push({
      ts: new Date(p.created_time).getTime(),
      engagement: (p.reactions?.summary?.total_count ?? 0) + (p.comments?.summary?.total_count ?? 0) * 3,
    }))
    yt?.videos?.forEach((v) => items.push({
      ts: new Date(v.publishedAt).getTime(),
      engagement: v.views,
    }))

    if (items.length === 0) return null
    const { days, hours } = bucketize(items)
    const dayAvgs = days.map((d, i) => ({ name: DAYS[i], avg: avg(d), count: d.count }))
    const hourAvgs = hours.map((h, i) => ({ hour: i, avg: avg(h), count: h.count }))
    const bestDay = [...dayAvgs].sort((a, b) => b.avg - a.avg)[0]
    const bestHour = [...hourAvgs].filter(h => h.count > 0).sort((a, b) => b.avg - a.avg)[0]
    const maxDayAvg = Math.max(...dayAvgs.map(d => d.avg))
    const maxHourAvg = Math.max(...hourAvgs.map(h => h.avg))
    return { dayAvgs, hourAvgs, bestDay, bestHour, maxDayAvg, maxHourAvg, total: items.length }
  }, [ig, fb, yt])

  if (!insights) return null

  const formatHour = (h: number) => {
    const ampm = h >= 12 ? 'PM' : 'AM'
    const hr = h % 12 || 12
    return `${hr}${ampm} IST`
  }

  return (
    <Card className="glass border-border/50">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold">Best Posting Time</h3>
          <span className="text-[10px] text-muted-foreground ml-auto">analyzed {insights.total} posts</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Calendar className="h-3 w-3" /> Best Day
            </div>
            <p className="text-2xl font-bold text-primary">{insights.bestDay.name}</p>
          </div>
          <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Clock className="h-3 w-3" /> Best Hour
            </div>
            <p className="text-2xl font-bold text-accent">
              {insights.bestHour ? formatHour(insights.bestHour.hour) : '—'}
            </p>
          </div>
        </div>

        <div className="mb-5">
          <p className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Engagement by Day</p>
          <div className="grid grid-cols-7 gap-1.5">
            {insights.dayAvgs.map((d) => {
              const pct = insights.maxDayAvg > 0 ? (d.avg / insights.maxDayAvg) * 100 : 0
              return (
                <div key={d.name} className="text-center">
                  <div className="h-20 flex items-end justify-center mb-1">
                    <div className="w-full bg-primary/20 rounded-t transition-all" style={{ height: `${Math.max(pct, 5)}%` }}>
                      <div className="w-full bg-primary rounded-t h-full opacity-80" />
                    </div>
                  </div>
                  <p className="text-[10px] font-medium">{d.name}</p>
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Engagement by Hour</p>
          <div className="flex gap-0.5 h-16 items-end">
            {insights.hourAvgs.map((h) => {
              const pct = insights.maxHourAvg > 0 ? (h.avg / insights.maxHourAvg) * 100 : 0
              return (
                <div key={h.hour} className="flex-1 group relative">
                  <div className="w-full bg-accent rounded-sm transition-all hover:bg-primary" style={{ height: `${Math.max(pct, 2)}%`, opacity: pct > 0 ? 0.8 : 0.2 }} />
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] bg-card border border-border px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                    {formatHour(h.hour)}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="flex justify-between mt-1 text-[9px] text-muted-foreground">
            <span>12AM</span><span>6AM</span><span>12PM</span><span>6PM</span><span>11PM</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
