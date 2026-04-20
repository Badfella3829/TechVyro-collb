"use client"

import { motion } from 'framer-motion'
import { Check, X, Crown } from 'lucide-react'

const ROWS = [
  { feature: 'Tech-niche expertise', techvyro: true, agency: false, solo: true },
  { feature: 'Production-grade quality', techvyro: true, agency: true, solo: false },
  { feature: '48-72 hr turnaround', techvyro: true, agency: false, solo: true },
  { feature: 'Built-in audience (14K+)', techvyro: true, agency: false, solo: true },
  { feature: 'Transparent fixed pricing', techvyro: true, agency: false, solo: false },
  { feature: 'ROI calculator + analytics', techvyro: true, agency: true, solo: false },
  { feature: 'Multi-platform distribution', techvyro: true, agency: true, solo: false },
  { feature: 'Performance guarantee', techvyro: true, agency: false, solo: false },
  { feature: 'Direct creator access', techvyro: true, agency: false, solo: true },
  { feature: 'NDA + brand-safe contract', techvyro: true, agency: true, solo: false },
]

function Cell({ value }: { value: boolean }) {
  return value ? (
    <div className="flex items-center justify-center">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
    </div>
  ) : (
    <div className="flex items-center justify-center">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 text-red-400/60">
        <X className="h-3.5 w-3.5" strokeWidth={2.5} />
      </span>
    </div>
  )
}

export function ComparisonTable() {
  return (
    <section id="compare" className="py-16 sm:py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 mb-4">
            <Crown className="h-3.5 w-3.5 text-secondary" />
            <span className="text-xs font-semibold text-secondary tracking-wide">WHY TECHVYRO</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
            TechVyro vs <span className="gradient-text">The Rest</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Get the agency-grade quality of a studio with the authenticity of a creator.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="glass border border-border/50 rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="grid grid-cols-4 sm:grid-cols-[1.5fr_1fr_1fr_1fr] bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-b border-border/50">
            <div className="p-3 sm:p-4 text-xs sm:text-sm font-semibold text-muted-foreground hidden sm:block">
              Feature
            </div>
            <div className="p-3 sm:p-4 text-center">
              <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">RECOMMENDED</div>
              <div className="font-bold text-primary text-sm sm:text-base flex items-center justify-center gap-1">
                <Crown className="h-3.5 w-3.5" /> TechVyro
              </div>
            </div>
            <div className="p-3 sm:p-4 text-center">
              <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">TRADITIONAL</div>
              <div className="font-bold text-foreground/70 text-sm sm:text-base">Agency</div>
            </div>
            <div className="p-3 sm:p-4 text-center">
              <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">FREELANCE</div>
              <div className="font-bold text-foreground/70 text-sm sm:text-base">Solo Creator</div>
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border/30">
            {ROWS.map((row, idx) => (
              <motion.div
                key={row.feature}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                className="grid grid-cols-4 sm:grid-cols-[1.5fr_1fr_1fr_1fr] hover:bg-muted/20 transition-colors"
              >
                <div className="p-3 sm:p-4 text-xs sm:text-sm font-medium col-span-1 sm:col-span-1 hidden sm:flex items-center">
                  {row.feature}
                </div>
                <div className="p-3 sm:p-4 col-span-4 sm:hidden text-xs font-medium text-center bg-muted/10 border-b border-border/30">
                  {row.feature}
                </div>
                <div className="p-3 sm:p-4 bg-primary/5">
                  <Cell value={row.techvyro} />
                </div>
                <div className="p-3 sm:p-4">
                  <Cell value={row.agency} />
                </div>
                <div className="p-3 sm:p-4">
                  <Cell value={row.solo} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          * Comparison based on industry-standard tech content engagements in India.
        </p>
      </div>
    </section>
  )
}
