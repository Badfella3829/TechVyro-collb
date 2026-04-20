"use client"

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Users, Play, Eye, Award, TrendingUp, Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { AudienceDemographics } from './audience-demographics'

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
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    if (!isInView) return
    
    let start = 0
    const duration = 2000
    const increment = value / (duration / 16)
    
    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    
    return () => clearInterval(timer)
  }, [value, isInView])
  
  return <span>{count.toLocaleString()}</span>
}

function StatItem({ icon: Icon, value, suffix, label, color, delay, isInView }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      <Card className="glass border-border/50 hover:border-primary/50 transition-colors group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <TrendingUp className="h-4 w-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1">
            <AnimatedCounter value={value} isInView={isInView} />
            <span className="text-primary">{suffix}</span>
          </div>
          <p className="text-sm text-muted-foreground">{label}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const stats = [
  { icon: Users, value: 500, suffix: 'K+', label: 'Total Followers', color: 'bg-primary/20 text-primary' },
  { icon: Play, value: 1000, suffix: '+', label: 'Videos Published', color: 'bg-secondary/20 text-secondary' },
  { icon: Eye, value: 50, suffix: 'M+', label: 'Total Views', color: 'bg-accent/20 text-accent' },
  { icon: Award, value: 100, suffix: '+', label: 'Brand Collabs', color: 'bg-primary/20 text-primary' },
  { icon: Calendar, value: 5, suffix: '+', label: 'Years Creating', color: 'bg-secondary/20 text-secondary' },
  { icon: TrendingUp, value: 8, suffix: '%', label: 'Avg. Engagement', color: 'bg-accent/20 text-accent' },
]

const platformStats = [
  { 
    platform: 'YouTube',
    followers: '250K',
    avgViews: '100K',
    engagement: '8.5%',
    color: 'border-red-500/30 bg-red-500/10'
  },
  { 
    platform: 'Instagram',
    followers: '200K',
    avgViews: '50K',
    engagement: '12%',
    color: 'border-pink-500/30 bg-pink-500/10'
  },
  { 
    platform: 'Twitter/X',
    followers: '50K',
    avgViews: '25K',
    engagement: '5%',
    color: 'border-foreground/30 bg-foreground/10'
  },
]

export function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="stats" className="py-24 sm:py-32 relative">
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
          <h3 className="text-xl font-semibold text-center mb-8">Platform Breakdown</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {platformStats.map((platform, index) => (
              <motion.div
                key={platform.platform}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              >
                <Card className={`border-2 ${platform.color} hover:scale-[1.02] transition-transform`}>
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold mb-4">{platform.platform}</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-sm">Followers</span>
                        <span className="font-semibold">{platform.followers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-sm">Avg. Views</span>
                        <span className="font-semibold">{platform.avgViews}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-sm">Engagement</span>
                        <span className="font-semibold text-accent">{platform.engagement}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Audience Demographics Charts */}
        <AudienceDemographics />

        {/* Last updated badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="text-center mt-8"
        >
          <span className="inline-flex items-center gap-2 text-xs text-muted-foreground glass px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            Last updated: April 2026
          </span>
        </motion.div>
      </div>
    </section>
  )
}
