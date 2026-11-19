"use client"

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { 
  Video, 
  Film, 
  Image as ImageIcon, 
  Radio, 
  Star, 
  Package,
  Zap,
  Check,
  ChevronRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { selectPackage } from '@/lib/select-package'
import { formatPackagePrice, mergePackageAddons, type Currency } from '@/lib/pricing'
import { useLanguage } from '@/components/i18n/language-provider'

type CategoryKey = 'all' | 'video' | 'shorts' | 'social' | 'live' | 'premium' | 'bundles'

interface PackageItem {
  name: string
  description: string
  features: string[]
  popular?: boolean
  priceInr: number | null
  pricePlus?: boolean
}

interface PackageCategory {
  id: CategoryKey
  icon: React.ComponentType<{ className?: string }>
  label: string
  color: string
  packages: PackageItem[]
}

const categories: PackageCategory[] = [
  {
    id: 'video',
    icon: Video,
    label: 'Video Content',
    color: 'text-red-500',
    packages: [
      {
        name: 'Dedicated Sponsored Video',
        description: 'Full video on brand only - review, unboxing, or story',
        features: ['Full creative control', '5-15 min video', 'Custom thumbnail', 'Multi-platform upload'],
        popular: true,
        priceInr: 25000
      },
      {
        name: 'Integrated Sponsorship',
        description: '30-60 sec mention inside existing video',
        features: ['Mid-roll or end-roll', 'Natural integration', 'Existing audience reach'],
        priceInr: 10000
      },
      {
        name: 'Product Review Video',
        description: 'Honest detailed review with affiliate link',
        features: ['In-depth analysis', 'Pros & cons', 'Comparison with competitors', 'Affiliate tracking'],
        priceInr: 15000
      }
    ]
  },
  {
    id: 'shorts',
    icon: Film,
    label: 'Short Form',
    color: 'text-pink-500',
    packages: [
      {
        name: 'Instagram Reel',
        description: '15-60 sec high-reach reel content',
        features: ['Trending format', 'Music integration', 'Hashtag strategy', 'Explore page potential'],
        popular: true,
        priceInr: 8000
      },
      {
        name: 'YouTube Short',
        description: 'Under 60 sec algorithm-boosted content',
        features: ['Shorts shelf placement', 'Vertical format', 'Quick engagement'],
        priceInr: 8000
      },
      {
        name: 'TikTok Style Content',
        description: 'Trending format with viral potential',
        features: ['Trend participation', 'Sound trends', 'Duet/stitch friendly'],
        priceInr: 6000
      }
    ]
  },
  {
    id: 'social',
    icon: ImageIcon,
    label: 'Social Posts',
    color: 'text-blue-500',
    packages: [
      {
        name: 'Instagram Feed Post',
        description: 'Photo/carousel with caption + hashtags',
        features: ['High-quality imagery', 'Engaging caption', 'Strategic hashtags', 'Grid aesthetic'],
        priceInr: 5000
      },
      {
        name: 'Instagram Story',
        description: 'Swipe-up / link with poll/quiz/CTA',
        features: ['Interactive elements', 'Link stickers', '24hr visibility', 'Highlight option'],
        popular: true,
        priceInr: 3000
      },
      {
        name: 'Twitter/X Thread',
        description: 'Thread or single post with brand mention',
        features: ['Thread format', 'Engagement hooks', 'Retweet potential'],
        priceInr: 2500
      }
    ]
  },
  {
    id: 'live',
    icon: Radio,
    label: 'Live & Events',
    color: 'text-green-500',
    packages: [
      {
        name: 'Live Stream Sponsorship',
        description: 'Brand mention during live - real-time audience',
        features: ['Real-time engagement', 'Q&A opportunity', 'Chat interaction', 'Recording available'],
        popular: true,
        priceInr: 15000
      },
      {
        name: 'Event/Meetup Presence',
        description: 'Brand presence at fan meetup or physical event',
        features: ['On-ground activation', 'Fan engagement', 'Photo ops', 'Social coverage'],
        priceInr: 50000
      },
      {
        name: 'Webinar/Workshop',
        description: 'Brand co-hosts online session',
        features: ['Educational content', 'Lead generation', 'Extended engagement'],
        priceInr: 20000
      }
    ]
  },
  {
    id: 'premium',
    icon: Star,
    label: 'Premium',
    color: 'text-yellow-500',
    packages: [
      {
        name: 'Brand Ambassador',
        description: 'Long-term deal 3-12 months exclusive',
        features: ['Exclusive partnership', 'Multiple content pieces', 'Event appearances', 'Social takeovers'],
        popular: true,
        priceInr: 100000,
        pricePlus: true
      },
      {
        name: 'Custom UGC Content',
        description: 'Content created for brand\'s own page - white-label',
        features: ['Full usage rights', 'Brand voice match', 'No creator branding'],
        priceInr: 12000
      },
      {
        name: 'Affiliate Partnership',
        description: 'Commission per sale/click with promo code + link',
        features: ['Performance-based', 'Tracked conversions', 'Custom promo codes'],
        priceInr: null
      }
    ]
  },
  {
    id: 'bundles',
    icon: Package,
    label: 'Bundle Deals',
    color: 'text-primary',
    packages: [
      {
        name: 'Starter Bundle',
        description: '1 Reel + 2 Stories + 1 Post - Perfect for startups',
        features: ['Multi-format coverage', 'Cost effective', 'Quick turnaround', 'Best for awareness'],
        priceInr: 15000
      },
      {
        name: 'Growth Bundle',
        description: '1 Video + 1 Reel + 3 Stories + 1 Post',
        features: ['Comprehensive coverage', 'Multi-platform', 'Campaign cohesion', 'Mid-size brands'],
        popular: true,
        priceInr: 40000
      },
      {
        name: 'Mega Campaign',
        description: 'Video + Reel + Live + Stories + Post - Full package',
        features: ['Maximum exposure', 'All platforms', 'Premium support', 'Best ROI'],
        priceInr: 75000
      }
    ]
  }
]

export function PackagesSection() {
  const { t } = useLanguage()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all')
  const [currency, setCurrency] = useState<Currency>('INR')
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])

  const toggleAddon = (name: string) => {
    setSelectedAddons((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    )
  }

  const filteredCategories = activeCategory === 'all' 
    ? categories 
    : categories.filter(cat => cat.id === activeCategory)

  const scrollToContact = () => {
    const element = document.getElementById('contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="packages" className="py-10 sm:py-12 lg:py-16 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-semibold tracking-wider uppercase">
            {t.packages.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 mb-4">
            {t.packages.headingPrefix}
            <span className="gradient-text">{t.packages.headingAccent}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t.packages.subtitle}
          </p>
          {/* Currency Switcher */}
          <div className="mt-6 inline-flex items-center rounded-full border border-border/60 bg-muted/30 p-1" role="group" aria-label="Display currency">
            <button
              type="button"
              onClick={() => setCurrency('INR')}
              aria-pressed={currency === 'INR'}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-semibold transition-all min-h-[36px]",
                currency === 'INR'
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              INR (₹)
            </button>
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              aria-pressed={currency === 'USD'}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-semibold transition-all min-h-[36px]",
                currency === 'USD'
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              USD ($)
            </button>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex sm:flex-wrap sm:justify-center gap-2 mb-12 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible scrollbar-hide snap-x snap-mandatory"
        >
          <Button
            variant={activeCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveCategory('all')}
            className={cn(
              "rounded-full",
              activeCategory === 'all' && "bg-primary text-primary-foreground"
            )}
          >
            {t.packages.allPackages}
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'default' : 'outline'}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "rounded-full gap-2",
                activeCategory === category.id && "bg-primary text-primary-foreground"
              )}
            >
              <category.icon className={cn("h-4 w-4", activeCategory !== category.id && category.color)} />
              {category.label}
            </Button>
          ))}
        </motion.div>

        {/* Packages Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            {filteredCategories.map((category, categoryIndex) => (
              <div key={category.id}>
                {activeCategory === 'all' && (
                  <div className="flex items-center gap-3 mb-6">
                    <category.icon className={cn("h-6 w-6", category.color)} />
                    <h3 className="text-xl font-semibold">{category.label}</h3>
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.packages.map((pkg, index) => (
                    <motion.div
                      key={pkg.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: (categoryIndex * 0.1) + (index * 0.1) }}
                    >
                      <Card className={cn(
                        "h-full glass border-border/50 hover:border-primary/50 transition-all duration-300 group relative overflow-hidden",
                        pkg.popular && "border-primary/50"
                      )}>
                        {pkg.popular && (
                          <div className="absolute top-4 right-4">
                            <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                              {t.packages.popular}
                            </span>
                          </div>
                        )}
                        
                        <CardHeader>
                          <CardTitle className="text-lg pr-16">{pkg.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{pkg.description}</p>
                          <p className="text-lg font-bold text-primary mt-2">
                            {pkg.priceInr !== null ? t.packages.startingFrom : ''}
                            {formatPackagePrice(pkg.priceInr, currency, pkg.pricePlus)}
                          </p>
                        </CardHeader>
                        
                        <CardContent>
                          <ul className="space-y-2 mb-6">
                            {pkg.features.map((feature) => (
                              <li key={feature} className="flex items-start gap-2 text-sm">
                                <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                                <span className="text-muted-foreground">{feature}</span>
                              </li>
                            ))}
                          </ul>
                          
                          <Button 
                            variant="outline" 
                            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                            onClick={() => selectPackage({
                              name: pkg.name,
                              description: pkg.description,
                              features: mergePackageAddons(pkg.features, selectedAddons),
                              category: category.label,
                            })}
                          >
                            {selectedAddons.length > 0 ? `${t.packages.getQuote} (+${selectedAddons.length} add-on${selectedAddons.length > 1 ? 's' : ''})` : t.packages.getQuote}
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Add-ons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold">{t.packages.addonsTitle}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {t.packages.addonsHint}
              {selectedAddons.length > 0 && (
                <span className="ml-2 text-primary font-semibold">
                  ({selectedAddons.length} selected)
                </span>
              )}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Usage Rights', desc: 'Brand can reuse content on their channels' },
              { name: 'Rush Delivery', desc: '48-hour turnaround - premium charge' },
              { name: 'Pinned Post', desc: 'Stay pinned on profile 30/60/90 days' },
              { name: 'Regional Content', desc: 'Hindi / local language version' },
            ].map((addon, index) => {
              const isSelected = selectedAddons.includes(addon.name)
              return (
                <motion.button
                  type="button"
                  key={addon.name}
                  onClick={() => toggleAddon(addon.name)}
                  aria-pressed={isSelected}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  className={cn(
                    "glass p-4 rounded-xl border text-left transition-all",
                    isSelected
                      ? "border-accent bg-accent/10 shadow-md shadow-accent/10"
                      : "border-border/50 hover:border-accent/50"
                  )}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-accent" />
                      <span className="font-medium text-sm">{addon.name}</span>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-accent shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{addon.desc}</p>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-4">
            {t.packages.notSure}
          </p>
          <Button 
            size="lg" 
            onClick={scrollToContact}
            className="bg-primary hover:bg-primary/90 text-primary-foreground neon-glow-cyan"
          >
            {t.packages.discussCta}
            <ChevronRight className="h-5 w-5 ml-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
