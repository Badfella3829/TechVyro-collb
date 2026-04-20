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

const productTypes = [
  { value: 'smartphone', label: 'Smartphone / Gadget', multiplier: 1.2 },
  { value: 'app', label: 'App / Software', multiplier: 0.9 },
  { value: 'ecommerce', label: 'E-commerce / D2C', multiplier: 1.0 },
  { value: 'gaming', label: 'Gaming / Accessories', multiplier: 1.1 },
  { value: 'lifestyle', label: 'Lifestyle / Fashion', multiplier: 0.85 },
  { value: 'finance', label: 'Fintech / Finance', multiplier: 0.8 },
  { value: 'education', label: 'EdTech / Courses', multiplier: 0.75 },
]

export function ROICalculator() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [budget, setBudget] = useState([50000])
  const [productType, setProductType] = useState('smartphone')

  const results = useMemo(() => {
    const amount = budget[0]
    const typeData = productTypes.find(p => p.value === productType) || productTypes[0]
    const m = typeData.multiplier

    // Based on average metrics
    const impressions = Math.round(amount * 4.6 * m)
    const reach = Math.round(impressions * 0.65)
    const engagement = Math.round(reach * 0.08 * m)
    const clicks = Math.round(engagement * 0.35 * m)
    const cpm = amount > 0 ? ((amount / impressions) * 1000).toFixed(1) : '0'

    return { impressions, reach, engagement, clicks, cpm }
  }, [budget, productType])

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
            See what your investment can achieve. These estimates are based on TechVyro&apos;s
            actual average campaign performance data.
          </p>
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
                    * Estimates are based on average performance metrics from past campaigns.
                    Actual results may vary based on content type, timing, and market conditions.
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
                          <item.icon className={`h-4 w-4 ${item.color}`} />
                          <span className="text-sm text-muted-foreground">{item.label}</span>
                        </div>
                        <span className={`text-lg font-bold ${item.color}`}>{item.value}</span>
                      </motion.div>
                    ))}

                    {/* CPM */}
                    <div className="pt-4 border-t border-border/30">
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
                        <span className="text-primary font-bold flex-inline items-center">
                          <IndianRupee className="h-3 w-3 inline" />
                          {formatCurrency(budget[0])}
                        </span>
                        <span className="text-muted-foreground"> investment = estimated </span>
                        <span className="text-accent font-bold">{formatNumber(results.impressions)}</span>
                        <span className="text-muted-foreground"> impressions</span>
                      </p>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-6 bg-primary text-primary-foreground"
                    onClick={() => {
                      const el = document.getElementById('contact')
                      el?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    Start Campaign
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
