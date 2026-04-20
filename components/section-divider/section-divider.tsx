"use client"

import { motion } from 'framer-motion'

type Props = {
  label: string // e.g. "01 — PROOF"
  title: string // e.g. "Numbers That Speak"
  subtitle?: string
}

export function SectionDivider({ label, title, subtitle }: Props) {
  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4"
      >
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/40" />
        <div className="text-center">
          <div className="text-[10px] sm:text-xs tracking-[0.3em] font-bold text-primary uppercase mb-1">
            {label}
          </div>
          <div className="text-xl sm:text-2xl font-bold text-foreground">{title}</div>
          {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
        </div>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-secondary/40" />
      </motion.div>
    </div>
  )
}
