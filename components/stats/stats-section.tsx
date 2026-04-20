"use client"

import { useRef, useEffect, useState, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import { Users, Play, Eye, TrendingUp, Heart, MessageCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useInstagram } from '@/hooks/use-instagram'
import { useFacebook } from '@/hooks/use-facebook'
import { useYouTube } from '@/hooks/use-youtube'

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

function StatItem({ icon: Icon, value, suffix, label, color, delay, isInView, ready }: StatItemProps & { ready: boolean }) {
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
            {ready ? (
              <AnimatedCounter value={value} isInView={isInView} />
            ) : (
              <span className="opacity-40">—</span>
            )}
            <span className="text-primary">{suffix}</span>
          </div>
          <p className="text-sm text-muted-foreground">{label}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { data: ig, loading: igLoading } = useInstagram()
  const { data: fb, loading: fbLoading } = useFacebook()
  const { data: yt, loading: ytLoading } = useYouTube()

  const stats = useMemo(() => {
    const igFollowers = ig?.account.followers_count ?? 0
    const fbFollowers = fb?.page.followers_count ?? 0
    const ytSubs = yt?.channel.subscribers ?? 0
    const totalFollowers = igFollowers + fbFollowers + ytSubs
    const totalPosts =
      (ig?.account.media_count ?? 0) +
      (fb?.computed.postCount ?? fb?.posts.length ?? 0) +
      (yt?.channel.videoCount ?? 0)
    const ytTotalViews = yt?.channel.totalViews ?? 0
    const igTotalViews = ig?.computed.totalViews ?? 0
    const fbTotalViews = fb?.computed.totalViews ?? 0
    const allViews = ytTotalViews + igTotalViews + fbTotalViews
    const avgLikes = ig?.computed.avgLikes ?? 0
    const avgComments = ig?.computed.avgComments ?? 0
    const engagement = ig?.computed.avgEngagement ?? 0

    const avgComm = avgComments
    return [
      { icon: Users, value: totalFollowers, suffix: '', label: 'Total Followers', color: 'bg-primary/20 text-primary' },
      { icon: Eye, value: allViews, suffix: '', label: 'Total Views', color: 'bg-red-500/20 text-red-500' },
      { icon: Play, value: totalPosts, suffix: '', label: 'Total Content', color: 'bg-secondary/20 text-secondary' },
      { icon: Heart, value: avgLikes, suffix: '', label: 'Avg. Likes / Post', color: 'bg-accent/20 text-accent' },
      { icon: MessageCircle, value: avgComm, suffix: '', label: 'Avg. Comments', color: 'bg-primary/20 text-primary' },
      { icon: TrendingUp, value: Math.round(engagement * 100) / 100, suffix: '%', label: 'Engagement Rate', color: 'bg-secondary/20 text-secondary' },
    ]
  }, [ig, fb, yt])

  const platformStats = useMemo(() => [
    {
      platform: 'Instagram',
      followers: ig ? formatNumber(ig.account.followers_count) : '—',
      avgViews: ig ? formatNumber(ig.computed.avgLikes) : '—',
      engagement: ig ? `${ig.computed.avgEngagement.toFixed(2)}%` : '—',
      color: 'border-pink-500/30 bg-pink-500/10',
    },
    {
      platform: 'Facebook',
      followers: fb ? formatNumber(fb.page.followers_count) : '—',
      avgViews: fb ? formatNumber(fb.computed.avgReactions) : '—',
      engagement: fb ? `${fb.computed.avgEngagement.toFixed(2)}%` : '—',
      color: 'border-blue-500/30 bg-blue-500/10',
    },
    {
      platform: 'YouTube',
      followers: yt ? formatNumber(yt.channel.subscribers) : '—',
      avgViews: yt ? formatNumber(yt.computed.avgViews) : '—',
      engagement: yt ? `${yt.computed.avgEngagement.toFixed(2)}%` : '—',
      color: 'border-red-500/30 bg-red-500/10',
    },
  ], [ig, fb, yt])

  return (
    <section id="stats" className="py-16 sm:py-24 lg:py-32 relative">
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
              ready={
                stat.label === 'Total Followers'
                  ? !!ig && !!fb && !!yt
                  : stat.label === 'Total Views'
                  ? !!ig && !!fb && !!yt
                  : stat.label === 'Total Content'
                  ? !!ig && !!fb && !!yt
                  : !!ig
              }
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
        
        {/* Last updated badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="text-center mt-8"
        >
          <span className="inline-flex items-center gap-2 text-xs text-muted-foreground glass px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            {igLoading || fbLoading || ytLoading
              ? 'Fetching live data from Instagram, Facebook & YouTube…'
              : ig || fb || yt
              ? `Live from Instagram, Facebook & YouTube • ${new Date(ig?.fetchedAt || fb?.fetchedAt || yt?.fetchedAt || Date.now()).toLocaleString()}`
              : 'Live data temporarily unavailable'}
          </span>
        </motion.div>
      </div>
    </section>
  )
}
