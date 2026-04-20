"use client"

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Eye, 
  Heart, 
  ExternalLink,
  Video,
  Film,
  ImageIcon,
  Radio,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type FilterType = 'all' | 'video' | 'reel' | 'post' | 'live'

interface PortfolioItem {
  id: number
  brand: string
  campaign: string
  type: FilterType
  thumbnail: string
  views: string
  engagement: string
  description: string
  results: string[]
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    brand: 'Samsung',
    campaign: 'Galaxy S24 Ultra Launch',
    type: 'video',
    thumbnail: '/images/techvyro-logo.jpg',
    views: '1.2M',
    engagement: '8.5%',
    description: 'Comprehensive review and unboxing of the Samsung Galaxy S24 Ultra with AI features demo.',
    results: ['1.2M views in 7 days', '45K new subscribers', '12% conversion rate']
  },
  {
    id: 2,
    brand: 'OnePlus',
    campaign: 'OnePlus 12 Series',
    type: 'reel',
    thumbnail: '/images/techvyro-logo.jpg',
    views: '850K',
    engagement: '12%',
    description: 'Quick comparison reel showcasing camera capabilities and Hasselblad partnership.',
    results: ['850K views', '95K likes', 'Featured on Explore']
  },
  {
    id: 3,
    brand: 'Apple',
    campaign: 'iPhone 16 Pro Max',
    type: 'video',
    thumbnail: '/images/techvyro-logo.jpg',
    views: '2.1M',
    engagement: '9%',
    description: 'Detailed camera test and real-world performance review of the latest iPhone.',
    results: ['2.1M views', 'Top 10 trending', '18% watch time']
  },
  {
    id: 4,
    brand: 'Google',
    campaign: 'Pixel 9 Pro Launch',
    type: 'live',
    thumbnail: '/images/techvyro-logo.jpg',
    views: '320K',
    engagement: '15%',
    description: 'Live unboxing and first impressions stream with real-time Q&A.',
    results: ['320K live viewers', '8K chat messages', '25% retention']
  },
  {
    id: 5,
    brand: 'Xiaomi',
    campaign: '14 Ultra Camera',
    type: 'post',
    thumbnail: '/images/techvyro-logo.jpg',
    views: '180K',
    engagement: '11%',
    description: 'Photography-focused carousel post showcasing Leica partnership results.',
    results: ['180K reach', '22K saves', '5K shares']
  },
  {
    id: 6,
    brand: 'Nothing',
    campaign: 'Phone (2) Experience',
    type: 'reel',
    thumbnail: '/images/techvyro-logo.jpg',
    views: '620K',
    engagement: '14%',
    description: 'Creative Glyph interface showcase with trending audio integration.',
    results: ['620K views', '85K likes', 'Brand repost']
  },
  {
    id: 7,
    brand: 'ASUS ROG',
    campaign: 'ROG Phone 8 Gaming',
    type: 'video',
    thumbnail: '/images/techvyro-logo.jpg',
    views: '980K',
    engagement: '10%',
    description: 'Gaming performance deep-dive with BGMI and Genshin Impact benchmarks.',
    results: ['980K views', '65K new subs', '15% CTR']
  },
  {
    id: 8,
    brand: 'Sony',
    campaign: 'Xperia 1 VI',
    type: 'post',
    thumbnail: '/images/techvyro-logo.jpg',
    views: '145K',
    engagement: '9%',
    description: 'Photo showcase highlighting videography capabilities and Creator mode.',
    results: ['145K reach', '15K engagement', '3K saves']
  }
]

const filters: { id: FilterType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'all', label: 'All Work', icon: Play },
  { id: 'video', label: 'Videos', icon: Video },
  { id: 'reel', label: 'Reels', icon: Film },
  { id: 'post', label: 'Posts', icon: ImageIcon },
  { id: 'live', label: 'Live', icon: Radio },
]

export function PortfolioSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)

  const filteredItems = activeFilter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.type === activeFilter)

  return (
    <section id="portfolio" className="py-24 sm:py-32 relative">
      {/* Background */}
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
            Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 mb-4">
            Past
            <span className="gradient-text"> Collaborations</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A showcase of successful brand partnerships and content campaigns 
            that delivered real results.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? 'default' : 'outline'}
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                "rounded-full gap-2",
                activeFilter === filter.id && "bg-primary text-primary-foreground"
              )}
            >
              <filter.icon className="h-4 w-4" />
              {filter.label}
            </Button>
          ))}
        </motion.div>

        {/* Portfolio Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <Card className="h-full overflow-hidden glass border-border/50 hover:border-primary/50 transition-all duration-300">
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url(${item.thumbnail})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    
                    {/* Type badge */}
                    <div className="absolute top-3 left-3">
                      <span className="glass text-xs font-medium px-2 py-1 rounded-full capitalize">
                        {item.type}
                      </span>
                    </div>
                    
                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                        <Play className="h-5 w-5 text-primary-foreground fill-current" />
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    {/* Brand & Campaign */}
                    <div className="mb-3">
                      <span className="text-xs text-primary font-semibold uppercase tracking-wider">
                        {item.brand}
                      </span>
                      <h3 className="text-sm font-semibold mt-1 line-clamp-1">{item.campaign}</h3>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{item.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        <span>{item.engagement}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View More CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <Button 
            variant="outline" 
            size="lg"
            className="rounded-full"
          >
            View Full Portfolio
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </motion.div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl glass rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full glass hover:bg-foreground/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              
              {/* Thumbnail */}
              <div className="relative aspect-video">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${selectedItem.thumbnail})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center neon-glow-cyan">
                    <Play className="h-7 w-7 text-primary-foreground fill-current" />
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs text-primary font-semibold uppercase tracking-wider px-2 py-1 bg-primary/10 rounded-full">
                    {selectedItem.brand}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {selectedItem.type}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold mb-2">{selectedItem.campaign}</h3>
                <p className="text-muted-foreground mb-6">{selectedItem.description}</p>
                
                {/* Results */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider">Campaign Results</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {selectedItem.results.map((result, index) => (
                      <div key={index} className="glass p-3 rounded-lg text-center">
                        <span className="text-sm text-muted-foreground">{result}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Stats bar */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{selectedItem.views} views</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{selectedItem.engagement} engagement</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
