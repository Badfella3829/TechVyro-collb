"use client"

import { motion } from 'framer-motion'
import { Star, Users, Eye, Award, Zap, TrendingUp, Heart, CheckCircle2 } from 'lucide-react'

const ITEMS = [
  { icon: Star, label: '5.0 Rated by Brands' },
  { icon: Users, label: '50+ Brand Partners' },
  { icon: Eye, label: '8.45M+ Total Views' },
  { icon: Heart, label: '14K+ Community' },
  { icon: Award, label: 'Top Tech Creator 2025' },
  { icon: Zap, label: '48hr Avg Turnaround' },
  { icon: TrendingUp, label: '18% Avg Conversion Lift' },
  { icon: CheckCircle2, label: '100% Authentic Reviews' },
]

export function TrustBar() {
  // Duplicate items so the marquee loops seamlessly
  const loop = [...ITEMS, ...ITEMS]

  return (
    <section
      aria-label="Trust indicators"
      className="relative border-y border-border/40 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 py-4 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        {loop.map((item, i) => {
          const Icon = item.icon
          return (
            <div
              key={`${item.label}-${i}`}
              className="flex items-center gap-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-primary">
                <Icon className="h-3.5 w-3.5" />
              </span>
              <span className="tracking-wide">{item.label}</span>
              <span className="text-primary/40 ml-6">◆</span>
            </div>
          )
        })}
      </motion.div>
    </section>
  )
}
