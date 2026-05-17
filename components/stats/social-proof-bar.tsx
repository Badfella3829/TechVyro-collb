"use client"

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useCombinedStats } from '@/hooks/use-combined-stats'

interface CounterProps {
  value: number | string
  suffix?: string
  isInView: boolean
}

function AnimatedCounter({ value, suffix = '', isInView }: CounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) || 0 : value

  useEffect(() => {
    if (!isInView || hasAnimated) return
    
    setHasAnimated(true)
    let start = 0
    const duration = 2000
    const increment = numericValue / (duration / 16)
    
    const timer = setInterval(() => {
      start += increment
      if (start >= numericValue) {
        setDisplayValue(numericValue)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(start))
      }
    }, 16)
    
    return () => clearInterval(timer)
  }, [numericValue, isInView, hasAnimated])
  
  // Format the display value
  const formatted = numericValue >= 1000 
    ? `${(displayValue / 1000).toFixed(displayValue >= numericValue ? 0 : 0)}K` 
    : displayValue.toString()

  return (
    <span className="tabular-nums">
      {typeof value === 'string' && value.includes('+') 
        ? `${formatted}+`
        : typeof value === 'string' && value.includes('x')
        ? `${displayValue}x`
        : typeof value === 'string' && value.includes('%')
        ? `${displayValue}%`
        : formatted
      }
      {suffix}
    </span>
  )
}

const proofStats = [
  { value: '50+', label: 'Brands Served' },
  { value: '3x', label: 'Average ROI for Clients' },
  { value: '7', label: 'Days Campaign Go-Live' },
  { value: '100%', label: 'Managed For You' },
]

export function SocialProofBar() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const { totals, ready } = useCombinedStats()

  const dynamicStats = ready ? [
    { value: `${Math.round(totals.followers / 1000)}K+`, label: 'Total Reach' },
    { value: '3x', label: 'Average ROI for Clients' },
    { value: '7', label: 'Days Campaign Go-Live' },
    { value: '100%', label: 'Managed For You' },
  ] : proofStats

  return (
    <section ref={ref} className="py-8 sm:py-12 border-y border-border/30 bg-gradient-to-r from-background via-card/50 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {dynamicStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-accent mb-2">
                {stat.value}
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
