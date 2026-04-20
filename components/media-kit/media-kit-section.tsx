"use client"

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import {
  Download,
  Share2,
  Eye,
  Users,
  Play,
  Award,
  BarChart3,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts'

const platformData = [
  { name: 'YouTube', value: 250, unit: 'K', color: '#FF0000' },
  { name: 'Instagram', value: 200, unit: 'K', color: '#E1306C' },
  { name: 'Twitter/X', value: 50, unit: 'K', color: '#1DA1F2' },
]

const audiencePie = [
  { name: '18-24', value: 38, fill: 'oklch(0.85 0.18 195)' },
  { name: '25-34', value: 32, fill: 'oklch(0.65 0.25 310)' },
  { name: '35+', value: 30, fill: 'oklch(0.85 0.22 130)' },
]

const contentStyles = [
  'Tech Reviews',
  'Unboxings',
  'Comparisons',
  'Tutorials',
  'Live Streams',
  'Short-form Content',
]

const quickStats = [
  { icon: Users, label: 'Total Reach', value: '500K+' },
  { icon: Eye, label: 'Monthly Views', value: '5M+' },
  { icon: Play, label: 'Videos', value: '1000+' },
  { icon: Award, label: 'Brand Collabs', value: '100+' },
  { icon: BarChart3, label: 'Avg. Engagement', value: '8%' },
]

export function MediaKitSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

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
            <span className="gradient-text"> One Click</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A comprehensive overview of TechVyro&apos;s reach, audience, and collaboration capabilities.
            Always up-to-date, always accurate.
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
                      Specializing in honest tech reviews, unboxings, and brand storytelling 
                      that drives engagement and conversions.
                    </p>
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                    <Button size="sm" className="bg-primary text-primary-foreground gap-2">
                      <Download className="h-4 w-4" />
                      Download PDF
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
              <div className="grid md:grid-cols-3 gap-0">
                {/* Platform Stats */}
                <div className="p-6 sm:p-8 border-r border-border/30">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    Platform Stats
                  </h4>
                  <div className="space-y-4">
                    {platformData.map((platform, index) => (
                      <motion.div
                        key={platform.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ background: platform.color }}
                          />
                          <span className="text-sm text-foreground">{platform.name}</span>
                        </div>
                        <span className="font-bold text-foreground">
                          {platform.value}{platform.unit}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/30">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Followers</span>
                      <span className="font-bold text-primary">500K+</span>
                    </div>
                  </div>
                </div>

                {/* Audience Overview */}
                <div className="p-6 sm:p-8 border-r border-border/30">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    Audience
                  </h4>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={audiencePie}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={55}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {audiencePie.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-2">
                    {audiencePie.map((entry) => (
                      <div key={entry.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ background: entry.fill }} />
                          <span className="text-muted-foreground">{entry.name}</span>
                        </div>
                        <span className="text-foreground font-medium">{entry.value}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/30 text-xs text-muted-foreground">
                    <p>72% Male / 24% Female</p>
                    <p className="mt-1">Top: Mumbai, Delhi, Bangalore</p>
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
                      Collab Types
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {['Videos', 'Reels', 'Posts', 'Stories', 'Live', 'UGC'].map((type) => (
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
                  Last updated: April 2026
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
                  <Button size="sm" className="bg-primary text-primary-foreground gap-2">
                    <Download className="h-3.5 w-3.5" />
                    Download Full Kit
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
