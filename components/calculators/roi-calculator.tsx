"use client"

import { useRef, useState, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Calculator,
  TrendingUp,
  Eye,
  Heart,
  MousePointerClick,
  IndianRupee,
  Zap,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCombinedStats } from '@/hooks/use-combined-stats'
import { ROIEmailForm } from './roi-email-form'

const productTypes = [
  { value: 'smartphone', label: 'Smartphone / Gadget', multiplier: 1.2, ctr: 0.38 },
  { value: 'app', label: 'App / Software', multiplier: 0.9, ctr: 0.32 },
  { value: 'ecommerce', label: 'E-commerce / D2C', multiplier: 1.0, ctr: 0.35 },
  { value: 'gaming', label: 'Gaming / Accessories', multiplier: 1.1, ctr: 0.36 },
  { value: 'lifestyle', label: 'Lifestyle / Fashion', multiplier: 0.85, ctr: 0.30 },
  { value: 'finance', label: 'Fintech / Finance', multiplier: 0.8, ctr: 0.28 },
  { value: 'education', label: 'EdTech / Courses', multiplier: 0.75, ctr: 0.25 },
]

// Benchmark: a typical ₹16,500 mini-package ≈ 1 piece of content (IG reel / story-set / FB post / 1 YT segment)
const COST_PER_PIECE = 16500

export function ROICalculator() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [budget, setBudget] = useState([50000])
  const [productType, setProductType] = useState('smartphone')
  const { ig, fb, yt, ready, loading } = useCombinedStats()

  const realMetrics = useMemo(() => {
    // Per-post avg views per platform (real, derived from APIs)
    const ytAvgViews = yt?.computed.avgViews ?? 0
    const igAvgViews = ig && ig.account.media_count > 0
      ? ig.computed.totalViews / ig.account.media_count
      : 0
    const fbAvgViews = fb && (fb.computed.postCount || fb.posts.length) > 0
      ? fb.computed.totalViews / (fb.computed.postCount || fb.posts.length)
      : 0

    // Weighted avg views per content piece (only count platforms with data)
    const platformAvgs = [ytAvgViews, igAvgViews, fbAvgViews].filter(v => v > 0)
    const avgViewsPerPiece = platformAvgs.length > 0
      ? platformAvgs.reduce((a, b) => a + b, 0) / platformAvgs.length
      : 0

    // Real engagement rate (avg across platforms)
    const engagements = [
      ig?.computed.avgEngagement,
      fb?.computed.avgEngagement,
      yt?.computed.avgEngagement,
    ].filter((e): e is number => typeof e === 'number' && e > 0)
    const avgEngagementRate = engagements.length > 0
      ? engagements.reduce((a, b) => a + b, 0) / engagements.length
      : 0

    return { avgViewsPerPiece, avgEngagementRate }
  }, [ig, fb, yt])

  const results = useMemo(() => {
    if (!ready || realMetrics.avgViewsPerPiece === 0) {
      return null
    }
    const amount = budget[0]
    const typeData = productTypes.find(p => p.value === productType) || productTypes[0]
    const m = typeData.multiplier

    // Pieces of content the budget buys
    const pieces = Math.max(1, Math.round(amount / COST_PER_PIECE))

    // Impressions = real avg views/post × pieces × product fit
    const impressions = Math.round(realMetrics.avgViewsPerPiece * pieces * m)
    // Industry standard: ~65% of impressions are unique reach on social
    const reach = Math.round(impressions * 0.65)
    // Engagement uses REAL engagement rate from APIs
    // (impressions already includes product multiplier `m`, so don't multiply again)
    const engagement = Math.round(impressions * (realMetrics.avgEngagementRate / 100))
    // CTR varies by product category (research-based)
    const clicks = Math.round(engagement * typeData.ctr)
    const cpm = amount > 0 && impressions > 0
      ? ((amount / impressions) * 1000).toFixed(1)
      : '0'

    return { impressions, reach, engagement, clicks, cpm, pieces }
  }, [budget, productType, ready, realMetrics])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num)
  }

  return (
    <section id="roi-calculator" className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-semibold tracking-wider uppercase">
            ROI Simulator
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 mb-4">
            Estimate Your
            <span className="gradient-text"> Campaign Impact</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See what your investment can achieve. Calculations powered by
            <span className="text-primary font-medium"> live data </span>
            from TechVyro&apos;s actual Instagram, Facebook & YouTube performance.
          </p>
          {ready && realMetrics.avgViewsPerPiece > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-xs">
              <Zap className="h-3 w-3 text-primary" />
              <span className="text-muted-foreground">Live avg:</span>
              <span className="text-foreground font-semibold">
                {Math.round(realMetrics.avgViewsPerPiece).toLocaleString('en-IN')} views/post
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-foreground font-semibold">
                {realMetrics.avgEngagementRate.toFixed(2)}% engagement
              </span>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="glass border-border/50 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                {/* Input Side */}
                <div className="p-6 sm:p-8 border-b md:border-b-0 md:border-r border-border/30">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <Calculator className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">Your Investment</h3>
                  </div>

                  {/* Product Type */}
                  <div className="mb-8">
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Product / Service Type
                    </label>
                    <Select value={productType} onValueChange={setProductType}>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {productTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Budget Slider */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Campaign Budget
                      </label>
                      <span className="text-lg font-bold text-primary flex items-center">
                        <IndianRupee className="h-4 w-4" />
                        {formatCurrency(budget[0])}
                      </span>
                    </div>
                    <Slider
                      value={budget}
                      onValueChange={setBudget}
                      min={10000}
                      max={500000}
                      step={5000}
                      className="mt-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>10K</span>
                      <span>2.5L</span>
                      <span>5L</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    * Estimates derived from real avg views & engagement from TechVyro&apos;s
                    Instagram, Facebook & YouTube. Actual results vary based on content type,
                    timing, and market conditions.
                  </p>
                </div>

                {/* Results Side */}
                <div className="p-6 sm:p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-accent/20">
                      <TrendingUp className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="text-lg font-semibold">Estimated Results</h3>
                  </div>

                  {!results ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
                      <p className="text-sm text-muted-foreground">
                        {loading ? 'Pulling live data from your channels…' : 'Real-time data unavailable'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {[
                        { icon: Eye, label: 'Estimated Impressions', value: formatNumber(results.impressions), color: 'text-primary' },
                        { icon: Eye, label: 'Estimated Reach', value: formatNumber(results.reach), color: 'text-secondary' },
                        { icon: Heart, label: 'Estimated Engagement', value: formatNumber(results.engagement), color: 'text-accent' },
                        { icon: MousePointerClick, label: 'Estimated Clicks', value: formatNumber(results.clicks), color: 'text-primary' },
                      ].map((item, index) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, x: 20 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="flex items-center justify-between p-3 rounded-lg bg-background/30"
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className={`h-4 w-4 ${item.color} shrink-0`} />
                            <span className="text-sm text-muted-foreground">{item.label}</span>
                          </div>
                          <span className={`text-lg font-bold ${item.color}`}>{item.value}</span>
                        </motion.div>
                      ))}

                      {/* CPM + content pieces */}
                      <div className="pt-4 border-t border-border/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Content Pieces</span>
                          <span className="text-sm font-semibold text-foreground">
                            ~{results.pieces} {results.pieces === 1 ? 'piece' : 'pieces'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Effective CPM</span>
                          <span className="text-lg font-bold text-foreground flex items-center">
                            <IndianRupee className="h-3.5 w-3.5" />
                            {results.cpm}
                          </span>
                        </div>
                      </div>

                      {/* Highlight */}
                      <div className="glass p-4 rounded-xl border border-primary/30 mt-4">
                        <p className="text-sm text-center">
                          <span className="text-muted-foreground">Your </span>
                          <span className="text-primary font-bold inline-flex items-center">
                            <IndianRupee className="h-3 w-3" />
                            {formatCurrency(budget[0])}
                          </span>
                          <span className="text-muted-foreground"> investment = estimated </span>
                          <span className="text-accent font-bold">{formatNumber(results.impressions)}</span>
                          <span className="text-muted-foreground"> impressions</span>
                        </p>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full mt-6 bg-primary text-primary-foreground"
                    onClick={() => {
                      const el = document.getElementById('contact')
                      el?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    Start Campaign
                  </Button>

                  {results && (
                    <ROIEmailForm
                      budget={budget[0]}
                      contentPieces={results.pieces}
                      estReach={results.reach}
                      estEngagement={(results.engagement / Math.max(results.impressions, 1)) * 100}
                      estROI={results.impressions / Math.max(budget[0] / 1000, 1) / 100}
                      packageName={productTypes.find((p) => p.value === productType)?.label}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
