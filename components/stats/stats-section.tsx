"use client"

import { useRef, useEffect, useState, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { Users, Play, Eye, TrendingUp, Heart, MessageCircle, ArrowRight, Instagram, Facebook, Youtube } from 'lucide-react'
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
      <Card className="glass border-border/50 hover:border-primary/50 transition-colors group h-full">
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-start justify-between mb-2 sm:mb-4">
            <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${color}`}>
              <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
            </div>
            <TrendingUp className="h-4 w-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1 break-all">
            {ready ? (
              <AnimatedCounter value={value} isInView={isInView} />
            ) : (
              <span className="opacity-40">—</span>
            )}
            <span className="text-primary">{suffix}</span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-tight">{label}</p>
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
      handle: ig ? `@${ig.account.username}` : '',
      icon: Instagram,
      href: '/analytics/instagram',
      followers: ig ? formatNumber(ig.account.followers_count) : '—',
      secondMetricLabel: 'Avg. Likes',
      secondMetric: ig ? formatNumber(ig.computed.avgLikes) : '—',
      engagement: ig ? `${ig.computed.avgEngagement.toFixed(2)}%` : '—',
      iconBg: 'bg-gradient-to-br from-pink-500 via-fuchsia-500 to-orange-500 text-white',
      hover: 'hover:border-pink-500/50',
      accent: 'text-pink-500',
      glow: 'group-hover:shadow-pink-500/20',
      ready: !!ig,
    },
    {
      platform: 'Facebook',
      handle: fb?.page.username ? `@${fb.page.username}` : fb?.page.name ?? '',
      icon: Facebook,
      href: '/analytics/facebook',
      followers: fb ? formatNumber(fb.page.followers_count) : '—',
      secondMetricLabel: 'Avg. Reactions',
      secondMetric: fb ? formatNumber(fb.computed.avgReactions) : '—',
      engagement: fb ? `${fb.computed.avgEngagement.toFixed(2)}%` : '—',
      iconBg: 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white',
      hover: 'hover:border-blue-500/50',
      accent: 'text-blue-500',
      glow: 'group-hover:shadow-blue-500/20',
      ready: !!fb,
    },
    {
      platform: 'YouTube',
      handle: yt?.channel.customUrl || yt?.channel.title || '',
      icon: Youtube,
      href: '/analytics/youtube',
      followers: yt ? formatNumber(yt.channel.subscribers) : '—',
      secondMetricLabel: 'Avg. Views',
      secondMetric: yt ? formatNumber(yt.computed.avgViews) : '—',
      engagement: yt ? `${yt.computed.avgEngagement.toFixed(2)}%` : '—',
      iconBg: 'bg-gradient-to-br from-red-600 to-orange-500 text-white',
      hover: 'hover:border-red-500/50',
      accent: 'text-red-500',
      glow: 'group-hover:shadow-red-500/20',
      ready: !!yt,
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
                // For aggregate cards, show whatever loaded (don't gate on all 3 platforms,
                // so a single expired token doesn't blank out the whole card).
                stat.label === 'Total Followers' || stat.label === 'Total Views' || stat.label === 'Total Content'
                  ? !!ig || !!fb || !!yt
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
          <div className="text-center mb-10">
            <span className="text-primary text-xs font-semibold tracking-wider uppercase">Platform Breakdown</span>
            <h3 className="text-2xl sm:text-3xl font-bold mt-2">Performance Across <span className="gradient-text">Channels</span></h3>
            <p className="text-sm text-muted-foreground mt-2">Tap any card for the full analytics dashboard</p>
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
                  <Link href={platform.href} className="block group h-full">
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
                            <span className={`text-3xl sm:text-4xl font-bold ${platform.ready ? '' : 'opacity-40'}`}>
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
                          <span>View detailed analytics</span>
                          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
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
