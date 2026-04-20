"use client"

import { useMemo } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Instagram, Facebook, Youtube, Eye, Heart, MessageCircle, ExternalLink, Calendar, Activity } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useInstagram } from '@/hooks/use-instagram'
import { useFacebook } from '@/hooks/use-facebook'
import { useYouTube } from '@/hooks/use-youtube'

type FeedItem = {
  id: string
  platform: 'instagram' | 'facebook' | 'youtube'
  title?: string
  thumbnail?: string
  link: string
  timestamp: number
  likes?: number
  comments?: number
  views?: number
}

function fmt(n?: number): string {
  if (!n) return '0'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const days = Math.floor(diff / 86400000)
  if (days < 1) return 'today'
  if (days === 1) return '1d ago'
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months === 1) return '1mo ago'
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}

const ICONS = { instagram: Instagram, facebook: Facebook, youtube: Youtube }
const COLORS = {
  instagram: 'bg-gradient-to-br from-pink-500 to-orange-500',
  facebook: 'bg-gradient-to-br from-blue-600 to-cyan-500',
  youtube: 'bg-gradient-to-br from-red-600 to-orange-500',
}

export function LatestFeed() {
  const { data: ig } = useInstagram()
  const { data: fb } = useFacebook()
  const { data: yt } = useYouTube()

  const feed = useMemo<FeedItem[]>(() => {
    const items: FeedItem[] = []
    ig?.media?.forEach((m) => items.push({
      id: `ig-${m.id}`, platform: 'instagram',
      title: m.caption?.slice(0, 80),
      thumbnail: m.thumbnail_url || m.media_url,
      link: m.permalink,
      timestamp: new Date(m.timestamp).getTime(),
      likes: m.like_count, comments: m.comments_count, views: m.view_count,
    }))
    fb?.posts?.forEach((p) => items.push({
      id: `fb-${p.id}`, platform: 'facebook',
      title: (p.message || p.story)?.slice(0, 80),
      thumbnail: p.full_picture,
      link: p.permalink_url || '#',
      timestamp: new Date(p.created_time).getTime(),
      likes: p.reactions?.summary?.total_count,
      comments: p.comments?.summary?.total_count,
    }))
    yt?.videos?.forEach((v) => items.push({
      id: `yt-${v.id}`, platform: 'youtube',
      title: v.title, thumbnail: v.thumbnail,
      link: v.permalink, timestamp: new Date(v.publishedAt).getTime(),
      likes: v.likes, comments: v.comments, views: v.views,
    }))
    return items.sort((a, b) => b.timestamp - a.timestamp).slice(0, 12)
  }, [ig, fb, yt])

  if (feed.length === 0) return null

  return (
    <section id="latest" className="py-16 sm:py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold tracking-wider uppercase mb-3">
            <Activity className="h-3.5 w-3.5 animate-pulse" /> Live Feed
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold">
            Latest from <span className="gradient-text">All Channels</span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Fresh content auto-pulled from Instagram, Facebook, and YouTube — sorted by date.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {feed.map((item, i) => {
            const Icon = ICONS[item.platform]
            return (
              <motion.a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.04, 0.4) }}
                className="group"
              >
                <Card className="glass border-border/40 hover:border-primary/40 overflow-hidden h-full transition-all hover:-translate-y-1">
                  <div className="relative aspect-square bg-muted">
                    {item.thumbnail && (
                      <Image src={item.thumbnail} alt="" fill sizes="(max-width:640px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform" />
                    )}
                    <div className={`absolute top-2 left-2 ${COLORS[item.platform]} p-1.5 rounded-md shadow-lg`}>
                      <Icon className="h-3 w-3 text-white" />
                    </div>
                    <ExternalLink className="absolute top-2 right-2 h-3.5 w-3.5 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <CardContent className="p-2.5">
                    {item.title && <p className="text-[11px] line-clamp-2 mb-1.5 leading-tight">{item.title}</p>}
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <div className="flex items-center gap-2">
                        {item.views ? (
                          <span className="flex items-center gap-0.5"><Eye className="h-2.5 w-2.5" />{fmt(item.views)}</span>
                        ) : (
                          <span className="flex items-center gap-0.5"><Heart className="h-2.5 w-2.5" />{fmt(item.likes)}</span>
                        )}
                        <span className="flex items-center gap-0.5"><MessageCircle className="h-2.5 w-2.5" />{fmt(item.comments)}</span>
                      </div>
                      <span className="flex items-center gap-0.5"><Calendar className="h-2.5 w-2.5" />{timeAgo(item.timestamp)}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
