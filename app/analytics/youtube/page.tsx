"use client"

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Users, Video, Heart, MessageCircle,
  TrendingUp, ExternalLink, Eye, Calendar, Trophy, Clock, Loader2, Film,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useYouTube } from '@/hooks/use-youtube'

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString('en-IN')
}

function fmtDuration(s: number | null): string {
  if (!s) return '—'
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  return `${m}:${String(sec).padStart(2, '0')}`
}

export default function YouTubeAnalyticsPage() {
  const { data, loading, error } = useYouTube()

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading live YouTube data…</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="glass max-w-md w-full">
          <CardContent className="p-8 text-center">
            <p className="text-destructive font-semibold mb-2">Could not load YouTube data</p>
            <p className="text-sm text-muted-foreground mb-6">{error || 'Unknown error'}</p>
            <Link href="/"><Button variant="outline"><ArrowLeft className="h-4 w-4 mr-2" />Back to home</Button></Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { channel, videos, computed } = data
  const totalLikes = videos.reduce((s, v) => s + v.likes, 0)
  const totalComments = videos.reduce((s, v) => s + v.comments, 0)
  const shortsCount = videos.filter(v => v.isShort).length
  const longCount = videos.length - shortsCount
  const sortedVideos = [...videos].sort((a, b) => b.views - a.views)
  const topVideos = sortedVideos.slice(0, 3)
  const top50 = sortedVideos.slice(0, 50)

  return (
    <main className="min-h-screen pt-24 pb-16 sm:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/#stats" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />Back to overview
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="glass border-red-500/30 bg-gradient-to-br from-red-500/10 via-orange-500/10 to-red-700/10 mb-8">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {channel.thumbnail && (
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-red-500/50 shrink-0">
                    <Image src={channel.thumbnail} alt={channel.title} fill sizes="112px" className="object-cover" />
                  </div>
                )}
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <h1 className="text-2xl sm:text-3xl font-bold">{channel.title}</h1>
                    <a href={channel.link} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-400">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  {channel.customUrl && <p className="text-base text-muted-foreground mb-2">{channel.customUrl}</p>}
                  {channel.description && <p className="text-sm text-muted-foreground max-w-xl mb-4 line-clamp-3">{channel.description}</p>}
                  <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm">
                    <span><strong className="text-foreground text-base">{fmt(channel.subscribers)}</strong> <span className="text-muted-foreground">subscribers</span></span>
                    <span><strong className="text-foreground text-base">{fmt(channel.videoCount)}</strong> <span className="text-muted-foreground">videos</span></span>
                    <span><strong className="text-foreground text-base">{fmt(channel.totalViews)}</strong> <span className="text-muted-foreground">total views</span></span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: 'Subscribers', value: fmt(channel.subscribers), color: 'text-red-500 bg-red-500/10' },
            { icon: Video, label: 'Total Videos', value: fmt(channel.videoCount), color: 'text-orange-500 bg-orange-500/10' },
            { icon: Eye, label: 'Avg Views', value: fmt(Math.round(computed.avgViews)), color: 'text-primary bg-primary/10' },
            { icon: TrendingUp, label: 'Engagement', value: `${computed.avgEngagement.toFixed(2)}%`, color: 'text-accent bg-accent/10' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
              <Card className="glass h-full">
                <CardContent className="p-4 sm:p-5">
                  <div className={`inline-flex p-2 rounded-lg ${s.color} mb-3`}><s.icon className="h-4 w-4" /></div>
                  <div className="text-xl sm:text-2xl font-bold mb-1 break-all">{s.value}</div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Engagement Breakdown</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="glass"><CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2"><Heart className="h-5 w-5 text-red-500" /><span className="text-sm text-muted-foreground">Total Likes</span></div>
              <div className="text-2xl font-bold">{fmt(totalLikes)}</div>
              <p className="text-xs text-muted-foreground mt-1">avg {fmt(Math.round(computed.avgLikes))} / video</p>
            </CardContent></Card>
            <Card className="glass"><CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2"><MessageCircle className="h-5 w-5 text-blue-500" /><span className="text-sm text-muted-foreground">Total Comments</span></div>
              <div className="text-2xl font-bold">{fmt(totalComments)}</div>
            </CardContent></Card>
            <Card className="glass"><CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2"><Film className="h-5 w-5 text-orange-500" /><span className="text-sm text-muted-foreground">Long-form Videos</span></div>
              <div className="text-2xl font-bold">{longCount}</div>
              <p className="text-xs text-muted-foreground mt-1">in recent uploads</p>
            </CardContent></Card>
            <Card className="glass"><CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2"><Video className="h-5 w-5 text-pink-500" /><span className="text-sm text-muted-foreground">Shorts</span></div>
              <div className="text-2xl font-bold">{shortsCount}</div>
              <p className="text-xs text-muted-foreground mt-1">in recent uploads</p>
            </CardContent></Card>
          </div>
        </motion.div>

        {topVideos.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Trophy className="h-5 w-5 text-amber-500" />Top Performing Videos</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {topVideos.map((v) => (
                <a key={v.id} href={v.permalink} target="_blank" rel="noopener noreferrer" className="group">
                  <Card className="glass hover:border-red-500/50 transition-colors overflow-hidden h-full">
                    <div className="relative aspect-video bg-muted">
                      {v.thumbnail && <Image src={v.thumbnail} alt={v.title} fill sizes="(max-width:640px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform" />}
                      {v.duration && (
                        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                          {fmtDuration(v.duration)}
                        </span>
                      )}
                      {v.isShort && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded font-semibold">SHORT</span>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <p className="text-sm font-medium line-clamp-2 mb-2">{v.title}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3 text-primary" />{fmt(v.views)}</span>
                        <span className="flex items-center gap-1"><Heart className="h-3 w-3 text-red-500" />{fmt(v.likes)}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3 text-blue-500" />{fmt(v.comments)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="flex items-baseline justify-between flex-wrap gap-2 mb-4">
            <h2 className="text-xl font-semibold">Top Performing Videos ({top50.length})</h2>
            <span className="text-xs text-muted-foreground">sorted by Views</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {top50.map((v, idx) => (
              <a key={v.id} href={v.permalink} target="_blank" rel="noopener noreferrer" className="group">
                <Card className="glass hover:border-red-500/50 transition-colors overflow-hidden h-full flex flex-col">
                  <div className="relative aspect-video bg-muted">
                    {v.thumbnail && <Image src={v.thumbnail} alt={v.title} fill sizes="(max-width:640px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform" />}
                    <span className="absolute top-2 left-2 bg-black/70 backdrop-blur text-white text-[10px] font-bold px-1.5 py-0.5 rounded">#{idx + 1}</span>
                    {v.duration && (
                      <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                        {fmtDuration(v.duration)}
                      </span>
                    )}
                    {v.isShort && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded font-semibold">SHORT</span>
                    )}
                  </div>
                  <CardContent className="p-3 flex-1 flex flex-col">
                    <p className="text-sm font-medium line-clamp-2 mb-2 flex-1">{v.title}</p>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3 text-primary" />{fmt(v.views)}</span>
                      <span className="flex items-center gap-1"><Heart className="h-3 w-3 text-red-500" />{fmt(v.likes)}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3 text-blue-500" />{fmt(v.comments)}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-2.5 w-2.5" />{new Date(v.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </motion.div>

        <p className="text-xs text-center text-muted-foreground mt-8">
          <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse mr-2 align-middle" />
          Live from YouTube Data API • Updated {new Date(data.fetchedAt).toLocaleString('en-IN')}
        </p>
      </div>
    </main>
  )
}
