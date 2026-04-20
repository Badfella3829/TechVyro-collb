"use client"

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, BarChart3 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

type Point = { date: string; value: number; label: string }

function buildSeries(items: Array<{ ts: number; value: number }>, days: number = 30): Point[] {
  const now = Date.now()
  const buckets: number[] = Array.from({ length: days }, () => 0)
  items.forEach(({ ts, value }) => {
    const dayDiff = Math.floor((now - ts) / 86400000)
    if (dayDiff >= 0 && dayDiff < days) buckets[days - 1 - dayDiff] += value
  })
  return buckets.map((value, i) => {
    const d = new Date(now - (days - 1 - i) * 86400000)
    return {
      date: d.toISOString().slice(0, 10),
      value,
      label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    }
  })
}

function Sparkline({ series, color, label, total }: { series: Point[]; color: string; label: string; total: number }) {
  const max = Math.max(...series.map((p) => p.value), 1)
  const width = 100
  const height = 40
  const points = series
    .map((p, i) => {
      const x = (i / (series.length - 1)) * width
      const y = height - (p.value / max) * height
      return `${x},${y}`
    })
    .join(' ')
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
        <span className="text-lg font-bold" style={{ color }}>
          {total >= 1_000_000 ? `${(total / 1_000_000).toFixed(1)}M` : total >= 1_000 ? `${(total / 1_000).toFixed(1)}K` : total.toLocaleString()}
        </span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-12">
        <defs>
          <linearGradient id={`grad-${label.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`0,${height} ${points} ${width},${height}`} fill={`url(#grad-${label.replace(/\s/g, '')})`} />
        <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    </div>
  )
}

export function GrowthCharts({
  postsByPlatform,
}: {
  postsByPlatform: {
    instagram: Array<{ ts: number; engagement: number }>
    facebook: Array<{ ts: number; engagement: number }>
    youtube: Array<{ ts: number; engagement: number }>
  }
}) {
  const series = useMemo(() => ({
    instagram: buildSeries(postsByPlatform.instagram.map(p => ({ ts: p.ts, value: p.engagement }))),
    facebook: buildSeries(postsByPlatform.facebook.map(p => ({ ts: p.ts, value: p.engagement }))),
    youtube: buildSeries(postsByPlatform.youtube.map(p => ({ ts: p.ts, value: p.engagement }))),
  }), [postsByPlatform])

  const totals = {
    instagram: series.instagram.reduce((s, p) => s + p.value, 0),
    facebook: series.facebook.reduce((s, p) => s + p.value, 0),
    youtube: series.youtube.reduce((s, p) => s + p.value, 0),
  }

  return (
    <Card className="glass border-border/50">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-5">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold">30-Day Engagement Trend</h3>
          <TrendingUp className="h-4 w-4 text-accent ml-auto" />
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          <Sparkline series={series.instagram} color="#ec4899" label="Instagram" total={totals.instagram} />
          <Sparkline series={series.facebook} color="#3b82f6" label="Facebook" total={totals.facebook} />
          <Sparkline series={series.youtube} color="#ef4444" label="YouTube" total={totals.youtube} />
        </div>
        <p className="text-[10px] text-muted-foreground mt-5 text-center">
          Engagement = likes + comments × 3 (YouTube uses views) per recent post, bucketed by day
        </p>
      </CardContent>
    </Card>
  )
}
