"use client"

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calculator, Video, Image, Mic, Share2, Clock, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

interface ContentOption {
  id: string
  name: string
  icon: React.ReactNode
  basePrice: number
  description: string
}

interface AddOn {
  id: string
  name: string
  price: number
  description: string
}

const CONTENT_OPTIONS: ContentOption[] = [
  {
    id: 'youtube-video',
    name: 'YouTube Video',
    icon: <Video className="h-5 w-5" />,
    basePrice: 50000,
    description: 'Dedicated review/unboxing video',
  },
  {
    id: 'youtube-shorts',
    name: 'YouTube Shorts',
    icon: <Video className="h-5 w-5" />,
    basePrice: 15000,
    description: 'Short-form vertical content',
  },
  {
    id: 'instagram-reel',
    name: 'Instagram Reel',
    icon: <Image className="h-5 w-5" />,
    basePrice: 20000,
    description: 'Engaging reel content',
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story',
    icon: <Image className="h-5 w-5" />,
    basePrice: 8000,
    description: '24hr story feature',
  },
  {
    id: 'instagram-post',
    name: 'Instagram Post',
    icon: <Image className="h-5 w-5" />,
    basePrice: 12000,
    description: 'Feed post with carousel',
  },
  {
    id: 'podcast-mention',
    name: 'Podcast Mention',
    icon: <Mic className="h-5 w-5" />,
    basePrice: 25000,
    description: 'Audio mention/review',
  },
]

const ADD_ONS: AddOn[] = [
  { id: 'rush', name: 'Rush Delivery (48hrs)', price: 15000, description: 'Priority production' },
  { id: 'raw-footage', name: 'Raw Footage', price: 10000, description: 'Unedited clips included' },
  { id: 'usage-rights', name: 'Extended Usage Rights', price: 20000, description: '1 year brand usage' },
  { id: 'cross-post', name: 'Cross-Platform Posting', price: 8000, description: 'Post on all platforms' },
  { id: 'analytics', name: 'Detailed Analytics Report', price: 5000, description: 'Performance insights' },
]

export function PricingCalculator() {
  const [selectedContent, setSelectedContent] = useState<string[]>([])
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [campaignDuration, setCampaignDuration] = useState([1])

  const toggleContent = (id: string) => {
    if (selectedContent.includes(id)) {
      setSelectedContent(prev => prev.filter(c => c !== id))
      setQuantities(prev => {
        const newQ = { ...prev }
        delete newQ[id]
        return newQ
      })
    } else {
      setSelectedContent(prev => [...prev, id])
      setQuantities(prev => ({ ...prev, [id]: 1 }))
    }
  }

  const updateQuantity = (id: string, value: number[]) => {
    setQuantities(prev => ({ ...prev, [id]: value[0] }))
  }

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )
  }

  const { subtotal, discount, total } = useMemo(() => {
    let contentTotal = 0
    selectedContent.forEach(id => {
      const option = CONTENT_OPTIONS.find(c => c.id === id)
      if (option) {
        contentTotal += option.basePrice * (quantities[id] || 1)
      }
    })

    let addOnTotal = 0
    selectedAddOns.forEach(id => {
      const addOn = ADD_ONS.find(a => a.id === id)
      if (addOn) {
        addOnTotal += addOn.price
      }
    })

    const subtotal = (contentTotal + addOnTotal) * campaignDuration[0]
    
    // Volume discounts
    let discountPercent = 0
    if (subtotal >= 500000) discountPercent = 20
    else if (subtotal >= 300000) discountPercent = 15
    else if (subtotal >= 150000) discountPercent = 10
    else if (subtotal >= 75000) discountPercent = 5

    const discount = subtotal * (discountPercent / 100)
    const total = subtotal - discount

    return { subtotal, discount, total }
  }, [selectedContent, quantities, selectedAddOns, campaignDuration])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <section className="py-16 sm:py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-primary text-xs font-semibold tracking-wider uppercase">Custom Quote</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2">
            Build Your <span className="gradient-text">Package</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
            Select content types, add-ons, and get an instant quote
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Content Selection */}
          <Card className="lg:col-span-2 glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calculator className="h-5 w-5 text-primary" />
                Select Content Types
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-3">
                {CONTENT_OPTIONS.map((option) => (
                  <motion.div
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all ${
                        selectedContent.includes(option.id)
                          ? 'border-primary bg-primary/5 neon-glow-cyan'
                          : 'border-border/50 hover:border-primary/30'
                      }`}
                      onClick={() => toggleContent(option.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              selectedContent.includes(option.id)
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}>
                              {option.icon}
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{option.name}</p>
                              <p className="text-xs text-muted-foreground">{option.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary text-sm">{formatPrice(option.basePrice)}</p>
                            <p className="text-[10px] text-muted-foreground">per piece</p>
                          </div>
                        </div>
                        
                        {selectedContent.includes(option.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="mt-4 pt-4 border-t border-border/30"
                          >
                            <div className="flex items-center justify-between">
                              <Label className="text-xs">Quantity: {quantities[option.id] || 1}</Label>
                              <span className="text-xs font-semibold text-primary">
                                {formatPrice(option.basePrice * (quantities[option.id] || 1))}
                              </span>
                            </div>
                            <Slider
                              value={[quantities[option.id] || 1]}
                              onValueChange={(v) => updateQuantity(option.id, v)}
                              min={1}
                              max={10}
                              step={1}
                              className="mt-2"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Campaign Duration */}
              <div className="pt-4 border-t border-border/30">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-semibold">Campaign Duration</Label>
                  <Badge variant="outline" className="text-primary border-primary/50">
                    {campaignDuration[0]} {campaignDuration[0] === 1 ? 'Month' : 'Months'}
                  </Badge>
                </div>
                <Slider
                  value={campaignDuration}
                  onValueChange={setCampaignDuration}
                  min={1}
                  max={12}
                  step={1}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Longer campaigns get better rates and priority scheduling
                </p>
              </div>

              {/* Add-ons */}
              <div className="pt-4 border-t border-border/30">
                <Label className="text-sm font-semibold mb-3 block">Add-ons</Label>
                <div className="grid sm:grid-cols-2 gap-2">
                  {ADD_ONS.map((addOn) => (
                    <div
                      key={addOn.id}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                        selectedAddOns.includes(addOn.id)
                          ? 'border-accent bg-accent/5'
                          : 'border-border/50 hover:border-accent/30'
                      }`}
                      onClick={() => toggleAddOn(addOn.id)}
                    >
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={selectedAddOns.includes(addOn.id)}
                          onCheckedChange={() => toggleAddOn(addOn.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div>
                          <p className="text-sm font-medium">{addOn.name}</p>
                          <p className="text-[10px] text-muted-foreground">{addOn.description}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-accent">+{formatPrice(addOn.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quote Summary */}
          <div className="space-y-4">
            <Card className="glass border-border/50 sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 text-accent" />
                  Your Quote
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedContent.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calculator className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Select content types to build your package</p>
                  </div>
                ) : (
                  <>
                    {/* Selected Items */}
                    <div className="space-y-2">
                      {selectedContent.map(id => {
                        const option = CONTENT_OPTIONS.find(c => c.id === id)
                        if (!option) return null
                        return (
                          <div key={id} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {option.name} x{quantities[id] || 1}
                            </span>
                            <span>{formatPrice(option.basePrice * (quantities[id] || 1))}</span>
                          </div>
                        )
                      })}
                      {selectedAddOns.map(id => {
                        const addOn = ADD_ONS.find(a => a.id === id)
                        if (!addOn) return null
                        return (
                          <div key={id} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{addOn.name}</span>
                            <span>{formatPrice(addOn.price)}</span>
                          </div>
                        )
                      })}
                      {campaignDuration[0] > 1 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">x{campaignDuration[0]} months</span>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-border/30 pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-sm text-accent">
                          <span>Volume Discount</span>
                          <span>-{formatPrice(discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-bold pt-2 border-t border-border/30">
                        <span>Total</span>
                        <span className="text-primary">{formatPrice(total)}</span>
                      </div>
                    </div>

                    {discount > 0 && (
                      <Badge className="w-full justify-center bg-accent/20 text-accent border-accent/30">
                        You save {formatPrice(discount)}!
                      </Badge>
                    )}

                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                      Get Custom Proposal
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    
                    <p className="text-[10px] text-muted-foreground text-center">
                      Final pricing may vary based on specific requirements
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
