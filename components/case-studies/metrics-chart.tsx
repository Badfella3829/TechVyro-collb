"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { TrendingUp } from 'lucide-react'
import type { BeforeAfterMetric } from '@/lib/case-studies-data'

interface ChartDatum {
  metric: string
  baselineIdx: number
  campaignIdx: number
  rawBaseline: string
  rawCampaign: string
  deltaLabel: string
}

function formatRawMetric(value: number, unit: string): string {
  if (unit === '₹') return `₹${value.toLocaleString('en-IN')}`
  if (unit === '%' || unit === 'x' || unit === 'K') return `${value}${unit}`
  return `${value.toLocaleString('en-IN')} ${unit}`
}

export function CaseStudyMetricsChart({
  metrics,
}: {
  metrics: BeforeAfterMetric[]
}) {
  const chartData: ChartDatum[] = metrics.map((m) => {
    const isLowerBetter = m.metric.toLowerCase().includes('cac')
    const ratio = m.baseline > 0 ? m.campaign / m.baseline : 1
    const campaignIdx = Math.round(ratio * 100)
    const deltaLabel = isLowerBetter
      ? `${Math.round((1 - m.campaign / m.baseline) * 100)}% lower`
      : `${ratio.toFixed(1)}× lift`

    return {
      metric: m.metric,
      baselineIdx: 100,
      campaignIdx,
      rawBaseline: formatRawMetric(m.baseline, m.unit),
      rawCampaign: formatRawMetric(m.campaign, m.unit),
      deltaLabel,
    }
  })

  return (
    <div className="space-y-6">
      {/* Compact lift cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {chartData.map((d) => (
          <div
            key={d.metric}
            className="rounded-xl border border-border/50 bg-background/50 p-3.5"
          >
            <p className="text-[11px] text-muted-foreground truncate">
              {d.metric}
            </p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-lg font-bold text-primary tabular-nums">
                {d.rawCampaign}
              </span>
              <span className="text-[11px] text-muted-foreground line-through tabular-nums">
                {d.rawBaseline}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 mt-1">
              <TrendingUp className="h-3 w-3" />
              {d.deltaLabel}
            </span>
          </div>
        ))}
      </div>

      {/* Normalized Before (100%) vs After Index Recharts BarChart */}
      <div className="h-72 w-full rounded-xl border border-border/40 bg-background/40 p-3 sm:p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 12, right: 16, left: 0, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis
              dataKey="metric"
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.12)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.12)' }}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              cursor={{ fill: 'rgba(34, 211, 238, 0.06)' }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const row = payload[0].payload as ChartDatum
                return (
                  <div className="rounded-xl border border-primary/40 bg-card/95 px-3.5 py-2.5 text-xs shadow-xl space-y-1">
                    <p className="font-semibold text-foreground">{row.metric}</p>
                    <p className="text-muted-foreground">
                      Before: <span className="text-foreground font-mono">{row.rawBaseline}</span> (100%)
                    </p>
                    <p className="text-primary">
                      After: <span className="font-mono font-semibold">{row.rawCampaign}</span> ({row.campaignIdx}%)
                    </p>
                    <p className="text-emerald-400 font-semibold">{row.deltaLabel}</p>
                  </div>
                )
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
            <Bar
              dataKey="baselineIdx"
              name="Industry Baseline (100%)"
              fill="#64748b"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="campaignIdx"
              name="TechVyro Playbook (% of Baseline)"
              fill="#22d3ee"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
