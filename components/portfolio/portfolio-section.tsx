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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useInstagram, type InstagramMedia } from '@/hooks/use-instagram'

type FilterType = 'all' | 'reel' | 'video' | 'post'

function classify(m: InstagramMedia): FilterType {
  if (m.media_type === 'VIDEO') return 'reel'
  return 'post'
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

function captionTitle(caption: string | undefined): string {
  if (!caption) return 'Instagram Post'
  const firstLine = caption.split('\n')[0].trim()
  return firstLine.length > 80 ? firstLine.slice(0, 77) + '…' : firstLine
}

const filters: { id: FilterType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'all', label: 'Top Performing', icon: Play },
  { id: 'reel', label: 'Reels', icon: Film },
  { id: 'post', label: 'Posts', icon: ImageIcon },
]

export function PortfolioSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [selectedItem, setSelectedItem] = useState<InstagramMedia | null>(null)
  const { data: ig, loading, error } = useInstagram()

  const sortedMedia = useMemo(() => {
    if (!ig) return []
    return [...ig.media].sort((a, b) => {
      const aScore = (a.like_count || 0) + (a.comments_count || 0)
      const bScore = (b.like_count || 0) + (b.comments_count || 0)
      return bScore - aScore
    })
  }, [ig])

  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return sortedMedia.slice(0, 12)
    return sortedMedia.filter((m) => classify(m) === activeFilter).slice(0, 12)
  }, [sortedMedia, activeFilter])

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
            <span className="gradient-text"> Reels & Posts</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Live from <span className="text-primary font-semibold">@{ig?.account.username || 'techvyro'}</span> — top content
            ranked by real engagement (likes + comments).
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

        {/* Loading / Error */}
        {loading && (
          <div className="text-center text-muted-foreground py-12">
            Loading top content from Instagram…
          </div>
        )}
        {error && !loading && (
          <div className="text-center text-destructive py-12">
            Couldn&apos;t load Instagram content right now.
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredItems.map((item, index) => {
                const thumb = item.thumbnail_url || item.media_url || ''
                const type = classify(item)
                const likes = item.like_count || 0
                const comments = item.comments_count || 0
                return (
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
                        {thumb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={thumb}
                            alt={captionTitle(item.caption)}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                            <Instagram className="h-10 w-10" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

                        {/* Type badge */}
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="glass text-xs font-medium px-2 py-1 rounded-full capitalize flex items-center gap-1">
                            {type === 'reel' ? <Video className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                            {type}
                          </span>
                        </div>

                        {/* Rank badge for top 3 */}
                        {activeFilter === 'all' && index < 3 && (
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
                            {captionTitle(item.caption)}
                          </p>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Heart className="h-3.5 w-3.5 text-pink-500" />
                            <span className="font-semibold">{formatCount(likes)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-3.5 w-3.5" />
                            <span className="font-semibold">{formatCount(comments)}</span>
                          </div>
                          <div className="text-[10px] uppercase tracking-wider">
                            {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full"
          >
            <a
              href={`https://instagram.com/${ig?.account.username || 'techvyro'}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Full Instagram
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
                {(selectedItem.thumbnail_url || selectedItem.media_url) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedItem.thumbnail_url || selectedItem.media_url}
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
                  <span className="text-xs text-primary font-semibold uppercase tracking-wider px-2 py-1 bg-primary/10 rounded-full">
                    {classify(selectedItem)}
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
                      <span className="text-sm font-medium">{formatCount(selectedItem.like_count || 0)} likes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{formatCount(selectedItem.comments_count || 0)} comments</span>
                    </div>
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
