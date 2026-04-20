"use client"

import { useRef, useState, useMemo } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Play,
  Heart,
  ExternalLink,
  Video,
  Film,
  ImageIcon,
  MessageCircle,
  X,
  Instagram,
  Facebook,
  Share2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useInstagram, type InstagramMedia } from '@/hooks/use-instagram'
import { useFacebook, type FacebookPost } from '@/hooks/use-facebook'

type Platform = 'instagram' | 'facebook'
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
  timestamp: string
  caption?: string
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

function captionTitle(caption: string | undefined, fallback = 'Post'): string {
  if (!caption) return fallback
  const firstLine = caption.split('\n')[0].trim()
  return firstLine.length > 80 ? firstLine.slice(0, 77) + '…' : firstLine
}

function igToUnified(m: InstagramMedia): UnifiedItem {
  return {
    id: `ig-${m.id}`,
    platform: 'instagram',
    type: m.media_type === 'VIDEO' ? 'reel' : 'post',
    thumbnail: m.thumbnail_url || m.media_url,
    title: captionTitle(m.caption, 'Instagram Post'),
    permalink: m.permalink,
    likes: m.like_count || 0,
    comments: m.comments_count || 0,
    timestamp: m.timestamp,
    caption: m.caption,
  }
}

function fbToUnified(p: FacebookPost): UnifiedItem {
  const att = p.attachments?.data?.[0]
  const isVideo = att?.type?.includes('video') || p.permalink_url?.includes('/reel/') || p.permalink_url?.includes('/videos/')
  return {
    id: `fb-${p.id}`,
    platform: 'facebook',
    type: isVideo ? 'reel' : 'post',
    thumbnail: p.full_picture || att?.media?.image?.src,
    title: captionTitle(p.message || p.story, 'Facebook Post'),
    permalink: p.permalink_url || `https://facebook.com/${p.id}`,
    likes: p.reactions?.summary?.total_count || 0,
    comments: p.comments?.summary?.total_count || 0,
    shares: p.shares?.count,
    timestamp: p.created_time,
    caption: p.message || p.story,
  }
}

const platformFilters: { id: Platform | 'all'; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'all', label: 'All Platforms', icon: Play },
  { id: 'instagram', label: 'Instagram', icon: Instagram },
  { id: 'facebook', label: 'Facebook', icon: Facebook },
]

const typeFilters: { id: FilterType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'all', label: 'Top', icon: Play },
  { id: 'reel', label: 'Reels/Videos', icon: Film },
  { id: 'post', label: 'Posts', icon: ImageIcon },
]

export function PortfolioSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<FilterType>('all')
  const [selectedItem, setSelectedItem] = useState<UnifiedItem | null>(null)
  const { data: ig, loading: igLoading, error: igError } = useInstagram()
  const { data: fb, loading: fbLoading, error: fbError } = useFacebook()

  const allItems = useMemo<UnifiedItem[]>(() => {
    const items: UnifiedItem[] = []
    if (ig) items.push(...ig.media.map(igToUnified))
    if (fb) items.push(...fb.posts.map(fbToUnified))
    return items.sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments))
  }, [ig, fb])

  const filteredItems = useMemo(() => {
    let items = allItems
    if (platformFilter !== 'all') items = items.filter((i) => i.platform === platformFilter)
    if (typeFilter !== 'all') items = items.filter((i) => i.type === typeFilter)
    return items.slice(0, 12)
  }, [allItems, platformFilter, typeFilter])

  const loading = igLoading || fbLoading
  const hasError = !ig && !fb && (igError || fbError)

  return (
    <section id="portfolio" className="py-24 sm:py-32 relative">
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
            Live top content from{' '}
            <span className="text-pink-500 font-semibold">@{ig?.account.username || 'techvyro'}</span>
            {' '}&{' '}
            <span className="text-blue-500 font-semibold">{fb?.page.name || 'TechVyro'}</span>
            {' '}— ranked by real engagement (likes/reactions + comments).
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
                "rounded-full gap-2",
                platformFilter === f.id && "bg-primary text-primary-foreground",
                f.id === 'instagram' && platformFilter === 'instagram' && "bg-pink-500 hover:bg-pink-600",
                f.id === 'facebook' && platformFilter === 'facebook' && "bg-blue-500 hover:bg-blue-600",
              )}
            >
              <f.icon className="h-4 w-4" />
              {f.label}
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
              className="rounded-full gap-2"
            >
              <filter.icon className="h-4 w-4" />
              {filter.label}
            </Button>
          ))}
        </motion.div>

        {/* Loading / Error */}
        {loading && allItems.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            Loading top content…
          </div>
        )}
        {hasError && (
          <div className="text-center text-destructive py-12">
            Couldn&apos;t load content right now.
          </div>
        )}

        {/* Grid */}
        {allItems.length > 0 && (
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
                    <div className="relative aspect-[9/12] overflow-hidden bg-muted">
                      {item.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                          {item.platform === 'instagram' ? <Instagram className="h-10 w-10" /> : <Facebook className="h-10 w-10" />}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

                      {/* Platform + Type badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className={cn(
                          "text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 text-white",
                          item.platform === 'instagram' ? "bg-pink-500/90" : "bg-blue-500/90"
                        )}>
                          {item.platform === 'instagram' ? <Instagram className="h-3 w-3" /> : <Facebook className="h-3 w-3" />}
                          {item.type === 'reel' ? 'Reel' : 'Post'}
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
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
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
                        <div className="text-[10px] uppercase tracking-wider">
                          {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', year: '2-digit' })}
                        </div>
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
            <a href={`https://instagram.com/${ig?.account.username || 'techvyro'}`} target="_blank" rel="noopener noreferrer">
              <Instagram className="h-4 w-4 mr-2 text-pink-500" />
              Visit Instagram
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <a href={fb?.page.link || 'https://facebook.com/techvyroclips'} target="_blank" rel="noopener noreferrer">
              <Facebook className="h-4 w-4 mr-2 text-blue-500" />
              Visit Facebook
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
                    src={selectedItem.thumbnail}
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
                    selectedItem.platform === 'instagram' ? "bg-pink-500" : "bg-blue-500"
                  )}>
                    {selectedItem.platform === 'instagram' ? <Instagram className="h-3 w-3" /> : <Facebook className="h-3 w-3" />}
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

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-6">
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
    </section>
  )
}
