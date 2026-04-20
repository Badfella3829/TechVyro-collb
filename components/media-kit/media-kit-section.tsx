"use client"

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import {
  Share2,
  Eye,
  Users,
  Play,
  Heart,
  BarChart3,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCombinedStats, formatBig } from '@/hooks/use-combined-stats'

const contentStyles = [
  'Tech Tips & Tricks',
  'AI Tools (ChatGPT, Canva, Bard)',
  'Computer & Mobile Tutorials',
  'Blogging & SEO',
  'Freelancing & Make Money Online',
  'Short-form Reels & Shorts',
]

export function MediaKitSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { ig, fb, yt, totals, ready } = useCombinedStats()

  const platformData = [
    { name: 'YouTube', value: totals.ytSubs, color: '#FF0000', link: yt?.channel.link },
    { name: 'Instagram', value: totals.igFollowers, color: '#E1306C', link: ig ? `https://instagram.com/${ig.account.username}` : undefined },
    { name: 'Facebook', value: totals.fbFollowers, color: '#1877F2', link: fb?.page.link },
  ]

  const igEng = ig?.computed.avgEngagement ?? 0
  const fbEng = fb?.computed.avgEngagement ?? 0
  const ytEng = yt?.computed.avgEngagement ?? 0
  const avgEng = ready ? ((igEng + fbEng + ytEng) / 3).toFixed(2) : '—'

  const quickStats = [
    { icon: Users, label: 'Total Followers', value: ready ? formatBig(totals.followers) : '—' },
    { icon: Eye, label: 'Total Views', value: ready ? formatBig(totals.totalViews) : '—' },
    { icon: Play, label: 'Total Content', value: ready ? formatBig(totals.content) : '—' },
    { icon: Heart, label: 'Avg. Likes/Post', value: ig ? formatBig(ig.computed.avgLikes) : '—' },
    { icon: BarChart3, label: 'Avg. Engagement', value: ready ? `${avgEng}%` : '—' },
  ]

  return (
    <section id="media-kit" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-semibold tracking-wider uppercase">
            Media Kit
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 mb-4">
            Everything You Need,
            <span className="gradient-text"> One Place</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Live stats from TechVyro&apos;s Instagram, Facebook & YouTube — pulled directly
            from each platform&apos;s API. Always real, always up-to-date.
          </p>
        </motion.div>

        {/* Media Kit Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <Card className="glass border-border/50 overflow-hidden">
            <CardContent className="p-0">
              {/* Top Banner */}
              <div className="relative p-8 sm:p-10 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-b border-border/30">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/30 shrink-0">
                    <Image
                      src="/images/techvyro-logo.jpg"
                      alt="TechVyro"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <h3 className="text-2xl font-bold gradient-text">TechVyro</h3>
                    <p className="text-muted-foreground mt-1">
                      India&apos;s Premier Tech Content Creator
                    </p>
                    <p className="text-sm text-muted-foreground mt-2 max-w-xl">
                      Practical Hinglish content on Tech, AI Tools, Blogging,
                      Freelancing & Make Money Online — for India&apos;s digital learners.
                    </p>
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => {
                        if (typeof navigator !== 'undefined' && navigator.share) {
                          navigator.share({ title: 'TechVyro', url: window.location.href }).catch(() => {})
                        }
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-5 border-b border-border/30">
                {quickStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="p-4 sm:p-6 text-center border-r border-b sm:border-b-0 border-border/30 last:border-r-0 [&:nth-child(2)]:border-r-0 sm:[&:nth-child(2)]:border-r"
                  >
                    <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                    <p className="text-lg font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Content Area */}
              <div className="grid md:grid-cols-2 gap-0">
                {/* Platform Stats */}
                <div className="p-6 sm:p-8 border-r border-border/30">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    Platform Stats
                  </h4>
                  <div className="space-y-4">
                    {platformData.map((platform, index) => (
                      <motion.a
                        key={platform.name}
                        href={platform.link || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-center justify-between hover:bg-muted/20 rounded-lg p-2 -mx-2 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ background: platform.color }}
                          />
                          <span className="text-sm text-foreground">{platform.name}</span>
                        </div>
                        <span className="font-bold text-foreground">
                          {ready ? formatBig(platform.value) : '—'}
                        </span>
                      </motion.a>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/30">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Combined Followers</span>
                      <span className="font-bold text-primary">
                        {ready ? formatBig(totals.followers) : '—'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Styles */}
                <div className="p-6 sm:p-8">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    Content Styles
                  </h4>
                  <div className="space-y-2">
                    {contentStyles.map((style, index) => (
                      <motion.div
                        key={style}
                        initial={{ opacity: 0, x: 10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.6 + index * 0.08 }}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-muted-foreground">{style}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/30">
                    <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Collab Formats
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {['Reels', 'Shorts', 'Long Videos', 'Posts', 'Stories', 'Tutorials'].map((type) => (
                        <span
                          key={type}
                          className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-6 sm:p-8 border-t border-border/30 bg-muted/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  Live data • {ready ? new Date(ig?.fetchedAt || Date.now()).toLocaleString() : 'Loading…'}
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      const el = document.getElementById('contact')
                      el?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Request Rate Card
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
