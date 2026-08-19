"use client"

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Play, Eye, TrendingUp, Heart, MessageCircle, ArrowRight, Instagram, Facebook, Youtube } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

interface StatItemProps {
  icon: React.ComponentType<{ className?: string }>
  value: number
  suffix: string
  label: string
  color: string
  delay: number
  isInView: boolean
}

function AnimatedCounter({ value, isInView }: { value: number; isInView: boolean }) {
  const [displayValue, setDisplayValue] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isInView || hasAnimated.current) return

    hasAnimated.current = true
    const startTime = Date.now()
    const duration = 2000

    const animate = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      const current = Math.floor(value * progress)
      
      setDisplayValue(current)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayValue(value)
      }
    }

    requestAnimationFrame(animate)
  }, [value, isInView])

  return <span className="tabular-nums">{formatNumber(displayValue)}</span>
}

function StatItem({ icon: Icon, value, suffix, label, color, delay, isInView }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      <Card className="glass border-border/50 hover:border-primary/50 transition-colors group h-full">
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-start justify-between mb-2 sm:mb-4">
            <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${color}`}>
              <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
            </div>
            <TrendingUp className="h-4 w-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1 whitespace-nowrap">
            <AnimatedCounter value={value} isInView={isInView} />
            <span className="text-primary">{suffix}</span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-tight">{label}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Fixed headline metrics — edit these numbers anytime to match your real figures.
const stats = [
  { icon: Users, value: 850000, suffix: '+', label: 'Total Followers', color: 'bg-primary/20 text-primary' },
  { icon: Eye, value: 120000000, suffix: '+', label: 'Total Views', color: 'bg-red-500/20 text-red-500' },
  { icon: Play, value: 1200, suffix: '+', label: 'Total Content', color: 'bg-secondary/20 text-secondary' },
  { icon: Heart, value: 45000, suffix: '+', label: 'Avg. Likes / Post', color: 'bg-accent/20 text-accent' },
  { icon: MessageCircle, value: 1800, suffix: '+', label: 'Avg. Comments', color: 'bg-primary/20 text-primary' },
  { icon: TrendingUp, value: 8, suffix: '%', label: 'Engagement Rate', color: 'bg-secondary/20 text-secondary' },
]

// Fixed per-platform breakdown.
const platformStats = [
  {
    platform: 'Instagram',
    handle: '@techvyro',
    icon: Instagram,
    href: 'https://instagram.com/techvyro',
    followers: formatNumber(420000),
    secondMetricLabel: 'Avg. Likes',
    secondMetric: formatNumber(38000),
    engagement: '9.10%',
    iconBg: 'bg-gradient-to-br from-pink-500 via-fuchsia-500 to-orange-500 text-white',
    hover: 'hover:border-pink-500/50',
    accent: 'text-pink-500',
    glow: 'group-hover:shadow-pink-500/20',
  },
  {
    platform: 'Facebook',
    handle: '@techvyroclips',
    icon: Facebook,
    href: 'https://facebook.com/techvyroclips',
    followers: formatNumber(180000),
    secondMetricLabel: 'Avg. Reactions',
    secondMetric: formatNumber(12000),
    engagement: '6.70%',
    iconBg: 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white',
    hover: 'hover:border-blue-500/50',
    accent: 'text-blue-500',
    glow: 'group-hover:shadow-blue-500/20',
  },
  {
    platform: 'YouTube',
    handle: '@techvyro',
    icon: Youtube,
    href: 'https://youtube.com/@techvyro',
    followers: formatNumber(250000),
    secondMetricLabel: 'Avg. Views',
    secondMetric: formatNumber(95000),
    engagement: '7.40%',
    iconBg: 'bg-gradient-to-br from-red-600 to-orange-500 text-white',
    hover: 'hover:border-red-500/50',
    accent: 'text-red-500',
    glow: 'group-hover:shadow-red-500/20',
  },
]

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) {
      // No ref yet — still trigger so counters never get stuck on 0.
      const t = setTimeout(() => setIsInView(true), 200)
      return () => clearTimeout(t)
    }

    // Reveal as soon as the section enters the viewport...
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)

    // ...with a guaranteed fallback so the numbers always animate in.
    const fallback = setTimeout(() => {
      setIsInView(true)
      observer.disconnect()
    }, 1200)

    return () => {
      observer.disconnect()
      clearTimeout(fallback)
    }
  }, [])

  return (
    <section id="stats" className="py-10 sm:py-12 lg:py-16 relative">
      {/* Background decoration */}
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
            Reach & Impact
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 mb-4">
            Numbers That
            <span className="gradient-text"> Speak</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real metrics from real campaigns. These numbers represent the impact and reach
            of content created for brands across platforms.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              color={stat.color}
              delay={index * 0.1}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Platform breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="text-center mb-10">
            <span className="text-primary text-xs font-semibold tracking-wider uppercase">Platform Breakdown</span>
            <h3 className="text-2xl sm:text-3xl font-bold mt-2">Performance Across <span className="gradient-text">Channels</span></h3>
            <p className="text-sm text-muted-foreground mt-2">Follow us across every platform</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            {platformStats.map((platform, index) => {
              const Icon = platform.icon
              return (
                <motion.div
                  key={platform.platform}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                >
                  <a href={platform.href} target="_blank" rel="noopener noreferrer" className="block group h-full">
                    <Card className={`glass border-border/50 ${platform.hover} hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full overflow-hidden shadow-lg ${platform.glow}`}>
                      {/* Header with icon + name */}
                      <div className="p-5 sm:p-6 pb-4 flex items-center gap-4 border-b border-border/30">
                        <div className={`p-3 rounded-xl ${platform.iconBg} shadow-md shrink-0`}>
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base sm:text-lg font-bold leading-tight">{platform.platform}</h4>
                          {platform.handle && (
                            <p className="text-xs text-muted-foreground truncate">{platform.handle}</p>
                          )}
                        </div>
                        <ArrowRight className={`h-4 w-4 text-muted-foreground group-hover:${platform.accent} group-hover:translate-x-1 transition-all shrink-0`} />
                      </div>

                      <CardContent className="p-5 sm:p-6 pt-5">
                        {/* Hero metric: followers */}
                        <div className="mb-5">
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl sm:text-4xl font-bold">
                              {platform.followers}
                            </span>
                            <span className="text-xs text-muted-foreground">followers</span>
                          </div>
                        </div>

                        {/* Secondary metrics */}
                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/30">
                          <div>
                            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">{platform.secondMetricLabel}</p>
                            <p className="text-base sm:text-lg font-semibold">{platform.secondMetric}</p>
                          </div>
                          <div>
                            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Engagement</p>
                            <p className={`text-base sm:text-lg font-semibold ${platform.accent}`}>{platform.engagement}</p>
                          </div>
                        </div>

                        {/* CTA */}
                        <div className={`mt-5 pt-4 border-t border-border/30 flex items-center justify-between text-xs font-medium ${platform.accent} group-hover:gap-3 transition-all`}>
                          <span>Visit profile</span>
                          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
