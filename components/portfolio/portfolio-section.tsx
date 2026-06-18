"use client"

import { useRef, useState, useMemo } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Play,
  Heart,
  ExternalLink,
  Film,
  ImageIcon,
  MessageCircle,
  X,
  Instagram,
  Facebook,
  Youtube,
  Share2,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { InteractiveGlobe } from '@/components/3d/interactive-globe'

type Platform = 'instagram' | 'facebook' | 'youtube'
type FilterType = 'all' | 'reel' | 'post'

type UnifiedItem = {
  id: string
  platform: Platform
  type: FilterType
  thumbnail?: string
  title: string
  permalink: string
  likes: number
  comments: number
  shares?: number
  views?: number
  timestamp: string
  caption?: string
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

// Static featured content. Swap thumbnails, links and metrics anytime.
const PORTFOLIO_ITEMS: UnifiedItem[] = [
  {
    id: 'ig-1', platform: 'instagram', type: 'reel',
    thumbnail: '/images/portfolio/iphone-16.jpg',
    title: 'iPhone 16 Pro — cinematic launch reel',
    permalink: 'https://instagram.com/techvyro',
    likes: 58000, comments: 1200, timestamp: '2025-03-12',
    caption: 'A cinematic launch reel for the iPhone 16 Pro — shot, edited and delivered in 48 hours.',
  },
  {
    id: 'yt-1', platform: 'youtube', type: 'post',
    thumbnail: '/images/portfolio/samsung-s24.jpg',
    title: 'Samsung S24 Ultra full review',
    permalink: 'https://youtube.com/@techvyro',
    likes: 41000, comments: 2100, views: 1250000, timestamp: '2025-02-20',
    caption: 'A deep-dive long-form review of the Samsung S24 Ultra with custom motion graphics.',
  },
  {
    id: 'ig-2', platform: 'instagram', type: 'post',
    thumbnail: '/images/portfolio/pixel-9.jpg',
    title: 'Pixel 9 camera showcase',
    permalink: 'https://instagram.com/techvyro',
    likes: 33000, comments: 890, timestamp: '2025-02-10',
    caption: 'Carousel showcasing the Pixel 9 computational photography pipeline.',
  },
  {
    id: 'fb-1', platform: 'facebook', type: 'reel',
    thumbnail: '/images/portfolio/oneplus-12.jpg',
    title: 'OnePlus 12 speed test',
    permalink: 'https://facebook.com/techvyroclips',
    likes: 21000, comments: 540, shares: 1300, timestamp: '2025-01-28',
    caption: 'A fast-cut speed test reel for the OnePlus 12.',
  },
  {
    id: 'yt-2', platform: 'youtube', type: 'reel',
    thumbnail: '/images/portfolio/nothing-phone.jpg',
    title: 'Nothing Phone 2a — Short',
    permalink: 'https://youtube.com/@techvyro',
    likes: 28000, comments: 760, views: 880000, timestamp: '2025-01-15',
    caption: 'A punchy YouTube Short on the Nothing Phone 2a design language.',
  },
  {
    id: 'ig-3', platform: 'instagram', type: 'reel',
    thumbnail: '/images/portfolio/rog-phone.jpg',
    title: 'ROG Phone 8 gaming reel',
    permalink: 'https://instagram.com/techvyro',
    likes: 47000, comments: 1500, timestamp: '2024-12-22',
    caption: 'High-energy gaming reel for the ROG Phone 8.',
  },
  {
    id: 'fb-2', platform: 'facebook', type: 'post',
    thumbnail: '/images/portfolio/xiaomi-14.jpg',
    title: 'Xiaomi 14 Ultra photo walk',
    permalink: 'https://facebook.com/techvyroclips',
    likes: 16000, comments: 410, shares: 720, timestamp: '2024-12-05',
    caption: 'A photo-walk feature highlighting the Xiaomi 14 Ultra Leica lenses.',
  },
  {
    id: 'yt-3', platform: 'youtube', type: 'post',
    thumbnail: '/images/portfolio/sony-xperia.jpg',
    title: 'Sony Xperia 1 VI for creators',
    permalink: 'https://youtube.com/@techvyro',
    likes: 19000, comments: 980, views: 540000, timestamp: '2024-11-18',
    caption: 'Long-form creator-focused review of the Sony Xperia 1 VI.',
  },
]

const platformFilters: { id: Platform | 'all'; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'all', label: 'All Platforms', icon: Play },
  { id: 'instagram', label: 'Instagram', icon: Instagram },
  { id: 'facebook', label: 'Facebook', icon: Facebook },
  { id: 'youtube', label: 'YouTube', icon: Youtube },
]

const typeFilters: { id: FilterType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'all', label: 'Top', icon: Play },
  { id: 'reel', label: 'Reels/Shorts', icon: Film },
  { id: 'post', label: 'Posts/Long Videos', icon: ImageIcon },
]

function platformIcon(p: Platform) {
  if (p === 'instagram') return Instagram
  if (p === 'facebook') return Facebook
  return Youtube
}

function platformBg(p: Platform) {
  if (p === 'instagram') return 'bg-pink-500/90'
  if (p === 'facebook') return 'bg-blue-500/90'
  return 'bg-red-500/90'
}

function platformSolidBg(p: Platform) {
  if (p === 'instagram') return 'bg-pink-500'
  if (p === 'facebook') return 'bg-blue-500'
  return 'bg-red-500'
}

export function PortfolioSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<FilterType>('all')
  const [selectedItem, setSelectedItem] = useState<UnifiedItem | null>(null)

  const allItems = useMemo<UnifiedItem[]>(() => {
    const score = (i: UnifiedItem) =>
      i.platform === 'youtube' ? (i.views ?? 0) : (i.likes + i.comments) * 10
    return [...PORTFOLIO_ITEMS].sort((a, b) => score(b) - score(a))
  }, [])

  const filteredItems = useMemo(() => {
    let items = allItems
    if (platformFilter !== 'all') items = items.filter((i) => i.platform === platformFilter)
    if (typeFilter !== 'all') items = items.filter((i) => i.type === typeFilter)
    return items.slice(0, 12)
  }, [allItems, platformFilter, typeFilter])

  return (
    <section id="portfolio" className="py-10 sm:py-12 lg:py-16 relative">
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
            Best Performing
            <span className="gradient-text"> Content</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A selection of top content created for{' '}
            <span className="text-pink-500 font-semibold">Instagram</span>,{' '}
            <span className="text-blue-500 font-semibold">Facebook</span> &{' '}
            <span className="text-red-500 font-semibold">YouTube</span>.
          </p>
        </motion.div>

        {/* Platform tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2 mb-4"
        >
          {platformFilters.map((f) => (
            <Button
              key={f.id}
              variant={platformFilter === f.id ? 'default' : 'outline'}
              onClick={() => setPlatformFilter(f.id)}
              className={cn(
                "rounded-full gap-2 text-xs sm:text-sm px-3 sm:px-4 py-2 min-h-[44px]",
                platformFilter === f.id && "bg-primary text-primary-foreground",
                f.id === 'instagram' && platformFilter === 'instagram' && "bg-pink-500 hover:bg-pink-600",
                f.id === 'facebook' && platformFilter === 'facebook' && "bg-blue-500 hover:bg-blue-600",
                f.id === 'youtube' && platformFilter === 'youtube' && "bg-red-500 hover:bg-red-600",
              )}
            >
              <f.icon className="h-4 w-4 shrink-0" />
              <span className="hidden xs:inline">{f.label}</span>
              <span className="xs:hidden">{f.id === 'all' ? 'All' : f.id.charAt(0).toUpperCase() + f.id.slice(1, 3)}</span>
            </Button>
          ))}
        </motion.div>

        {/* Type tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {typeFilters.map((filter) => (
            <Button
              key={filter.id}
              variant={typeFilter === filter.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTypeFilter(filter.id)}
              className="rounded-full gap-2 text-xs sm:text-sm px-3 sm:px-4 py-2 min-h-[40px]"
            >
              <filter.icon className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{filter.label}</span>
              <span className="sm:hidden">{filter.id === 'all' ? 'Top' : filter.id === 'reel' ? 'Reels' : 'Posts'}</span>
            </Button>
          ))}
        </motion.div>

        {/* Grid */}
        {filteredItems.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${platformFilter}-${typeFilter}`}
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
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  <Card className="h-full overflow-hidden glass border-border/50 hover:border-primary/50 transition-all duration-300">
                    <div className="relative aspect-[4/5] sm:aspect-[9/12] overflow-hidden bg-muted">
                      {item.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.thumbnail || "/placeholder.svg"}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                          {(() => { const Icon = platformIcon(item.platform); return <Icon className="h-10 w-10" /> })()}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

                      {/* Platform + Type badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className={cn(
                          "text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 text-white",
                          platformBg(item.platform)
                        )}>
                          {(() => { const Icon = platformIcon(item.platform); return <Icon className="h-3 w-3" /> })()}
                          {item.platform === 'youtube' ? (item.type === 'reel' ? 'Short' : 'Video') : (item.type === 'reel' ? 'Reel' : 'Post')}
                        </span>
                      </div>

                      {/* Rank badge for top 3 */}
                      {platformFilter === 'all' && typeFilter === 'all' && index < 3 && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                            #{index + 1}
                          </span>
                        </div>
                      )}

                      {/* Hover play */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                          <Play className="h-5 w-5 text-primary-foreground fill-current" />
                        </div>
                      </div>

                      {/* Caption overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-sm font-medium line-clamp-2 text-foreground">
                          {item.title}
                        </p>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-2">
                        {item.views !== undefined && (
                          <div className="flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5 text-red-500" />
                            <span className="font-semibold">{formatCount(item.views)}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Heart className="h-3.5 w-3.5 text-pink-500" />
                          <span className="font-semibold">{formatCount(item.likes)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span className="font-semibold">{formatCount(item.comments)}</span>
                        </div>
                        {item.shares !== undefined && (
                          <div className="flex items-center gap-1">
                            <Share2 className="h-3.5 w-3.5" />
                            <span className="font-semibold">{formatCount(item.shares)}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-2">
                        {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12 flex flex-wrap justify-center gap-3"
        >
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <a href="https://instagram.com/techvyro" target="_blank" rel="noopener noreferrer">
              <Instagram className="h-4 w-4 mr-2 text-pink-500" />
              Visit Instagram
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <a href="https://facebook.com/techvyroclips" target="_blank" rel="noopener noreferrer">
              <Facebook className="h-4 w-4 mr-2 text-blue-500" />
              Visit Facebook
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <a href="https://youtube.com/@techvyro" target="_blank" rel="noopener noreferrer">
              <Youtube className="h-4 w-4 mr-2 text-red-500" />
              Visit YouTube
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
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
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full glass hover:bg-foreground/10 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative aspect-video bg-muted">
                {selectedItem.thumbnail && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedItem.thumbnail || "/placeholder.svg"}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <a
                  href={selectedItem.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center neon-glow-cyan">
                    <Play className="h-7 w-7 text-primary-foreground fill-current" />
                  </div>
                </a>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className={cn(
                    "text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full text-white flex items-center gap-1",
                    platformSolidBg(selectedItem.platform)
                  )}>
                    {(() => { const Icon = platformIcon(selectedItem.platform); return <Icon className="h-3 w-3" /> })()}
                    {selectedItem.platform}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(selectedItem.timestamp).toLocaleDateString(undefined, {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </span>
                </div>

                {selectedItem.caption && (
                  <p className="text-muted-foreground mb-6 whitespace-pre-line line-clamp-6">
                    {selectedItem.caption}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-border flex-wrap gap-4">
                  <div className="flex items-center gap-6 flex-wrap">
                    {selectedItem.views !== undefined && (
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium">{formatCount(selectedItem.views)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-pink-500" />
                      <span className="text-sm font-medium">{formatCount(selectedItem.likes)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{formatCount(selectedItem.comments)}</span>
                    </div>
                    {selectedItem.shares !== undefined && (
                      <div className="flex items-center gap-2">
                        <Share2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{formatCount(selectedItem.shares)}</span>
                      </div>
                    )}
                  </div>
                  <Button asChild size="sm" variant="outline" className="rounded-full">
                    <a href={selectedItem.permalink} target="_blank" rel="noopener noreferrer">
                      Open
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Interactive Globe Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true, margin: '-100px' }}
        className="mt-24"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold mb-3 bg-gradient-to-r from-gold via-accent to-gold bg-clip-text text-transparent">
              Our Global Reach
            </h3>
            <p className="text-foreground/60 max-w-2xl mx-auto">
              Explore our interactive 3D globe showcasing our audience reach across continents. Drag, rotate, and zoom to discover where our content resonates most.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden shadow-2xl border border-gold/10">
            <InteractiveGlobe />
          </div>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Asia Pacific', value: '35%' },
              { label: 'Europe', value: '28%' },
              { label: 'Americas', value: '22%' },
              { label: 'Africa & ME', value: '15%' },
            ].map((stat) => (
              <Card key={stat.label} className="bg-gold/5 border-gold/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gold mb-1">{stat.value}</div>
                  <p className="text-xs text-foreground/60 uppercase tracking-wide">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
