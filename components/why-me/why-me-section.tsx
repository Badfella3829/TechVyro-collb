"use client"

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, X } from 'lucide-react'

const comparisons = [
  {
    feature: 'Content Research',
    average: 'Generic scripts',
    techvyro: 'Deep-researched storytelling',
  },
  {
    feature: 'Post-Campaign Report',
    average: 'None provided',
    techvyro: '30-day detailed analytics report',
  },
  {
    feature: 'Brand Communication',
    average: 'Slow, delayed replies',
    techvyro: 'Same-day response guaranteed',
  },
  {
    feature: 'Content Ownership',
    average: 'Unclear terms',
    techvyro: 'Clear, defined usage rights',
  },
  {
    feature: 'Creative Direction',
    average: 'Template-based content',
    techvyro: 'Custom strategy per brand',
  },
  {
    feature: 'Audience Quality',
    average: 'Mixed, untargeted',
    techvyro: 'Tech-focused, high-intent audience',
  },
  {
    feature: 'Revision Rounds',
    average: '1 round max',
    techvyro: 'Unlimited until satisfied',
  },
  {
    feature: 'Deliverables Timeline',
    average: 'Often delayed',
    techvyro: 'On-time, every time',
  },
]

export function WhyMeSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-wider uppercase">
            Why Choose TechVyro
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 mb-4">
            Not Your Average
            <span className="gradient-text"> Creator</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See the difference between working with a professional tech content creator
            versus the average influencer.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass rounded-2xl border border-border/50 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-3 gap-4 p-4 sm:p-6 border-b border-border/50 bg-muted/20">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Feature
              </div>
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center">
                Average Creator
              </div>
              <div className="text-sm font-semibold text-center">
                <span className="gradient-text font-bold uppercase tracking-wider">TechVyro</span>
              </div>
            </div>

            {/* Table rows */}
            {comparisons.map((row, index) => (
              <motion.div
                key={row.feature}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.08 }}
                className="grid grid-cols-3 gap-4 p-4 sm:p-6 border-b border-border/30 last:border-b-0 hover:bg-primary/5 transition-colors"
              >
                <div className="text-sm font-medium text-foreground">
                  {row.feature}
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <X className="h-4 w-4 text-destructive/70 shrink-0 hidden sm:block" />
                  <span className="text-center">{row.average}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-primary">
                  <Check className="h-4 w-4 text-accent shrink-0 hidden sm:block" />
                  <span className="text-center font-medium">{row.techvyro}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
