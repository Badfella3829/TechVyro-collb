"use client"

import Link from 'next/link'
import { RefreshButton } from '@/components/analytics/refresh-button'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Users, Image as ImageIcon, Heart, MessageCircle,
  TrendingUp, ExternalLink, Eye, Calendar, Trophy, Loader2,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useInstagram } from '@/hooks/use-instagram'

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString('en-IN')
}

export default function InstagramAnalyticsPage() {
  const { data, loading, error } = useInstagram()

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading live Instagram data…</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="glass max-w-md w-full">
          <CardContent className="p-8 text-center">
            <p className="text-destructive font-semibold mb-2">Could not load Instagram data</p>
            <p className="text-sm text-muted-foreground mb-6">{error || 'Unknown error'}</p>
            <Link href="/"><Button variant="outline"><ArrowLeft className="h-4 w-4 mr-2" />Back to home</Button></Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { account, media, computed } = data
  const totalLikes = media.reduce((s, m) => s + (m.like_count ?? 0), 0)
  const totalComments = media.reduce((s, m) => s + (m.comments_count ?? 0), 0)
  const sortedByViews = [...media].sort((a, b) => (b.view_count ?? b.like_count ?? 0) - (a.view_count ?? a.like_count ?? 0))
  const topPosts = sortedByViews.slice(0, 3)
  const top50 = sortedByViews.slice(0, 50)

  return (
    <main className="min-h-screen pt-24 pb-16 sm:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back nav */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/#stats" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />Back to overview
          </Link>
          <RefreshButton endpoint="/api/instagram?refresh=1" />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass border-pink-500/30 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-orange-500/10 mb-8">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {account.profile_picture_url && (
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-pink-500/50 shrink-0">
                    <Image src={account.profile_picture_url} alt={account.username} fill sizes="112px" className="object-cover" />
                  </div>
                )}
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <h1 className="text-2xl sm:text-3xl font-bold">@{account.username}</h1>
                    <a href={`https://instagram.com/${account.username}`} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-400">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  {account.name && <p className="text-base text-muted-foreground mb-2">{account.name}</p>}
                  {account.biography && <p className="text-sm text-muted-foreground max-w-xl mb-4">{account.biography}</p>}
                  <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm">
                    <span><strong className="text-foreground text-base">{fmt(account.followers_count)}</strong> <span className="text-muted-foreground">followers</span></span>
                    <span><strong className="text-foreground text-base">{fmt(account.media_count)}</strong> <span className="text-muted-foreground">posts</span></span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: 'Followers', value: fmt(account.followers_count), color: 'text-pink-500 bg-pink-500/10' },
            { icon: ImageIcon, label: 'Total Posts', value: fmt(account.media_count), color: 'text-purple-500 bg-purple-500/10' },
            { icon: Heart, label: 'Avg Likes', value: fmt(Math.round(computed.avgLikes)), color: 'text-red-500 bg-red-500/10' },
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

        {/* Engagement breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Engagement Breakdown</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="glass"><CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2"><Heart className="h-5 w-5 text-red-500" /><span className="text-sm text-muted-foreground">Total Likes</span></div>
              <div className="text-2xl font-bold">{fmt(totalLikes)}</div>
              <p className="text-xs text-muted-foreground mt-1">across {media.length} recent posts</p>
            </CardContent></Card>
            <Card className="glass"><CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2"><MessageCircle className="h-5 w-5 text-blue-500" /><span className="text-sm text-muted-foreground">Total Comments</span></div>
              <div className="text-2xl font-bold">{fmt(totalComments)}</div>
              <p className="text-xs text-muted-foreground mt-1">avg {Math.round(computed.avgComments)} / post</p>
            </CardContent></Card>
            <Card className="glass"><CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2"><Eye className="h-5 w-5 text-primary" /><span className="text-sm text-muted-foreground">Total Views</span></div>
              <div className="text-2xl font-bold">{fmt(computed.totalViews)}</div>
              <p className="text-xs text-muted-foreground mt-1">video reach</p>
            </CardContent></Card>
          </div>
        </motion.div>

        {/* Top performing posts */}
        {topPosts.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Trophy className="h-5 w-5 text-amber-500" />Top Performing Posts</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {topPosts.map((post) => (
                <a key={post.id} href={post.permalink} target="_blank" rel="noopener noreferrer" className="group">
                  <Card className="glass hover:border-pink-500/50 transition-colors overflow-hidden h-full">
                    <div className="relative aspect-square bg-muted">
                      {(post.thumbnail_url || post.media_url) && (
                        <Image src={post.thumbnail_url || post.media_url!} alt="" fill sizes="(max-width:640px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform" />
                      )}
                    </div>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1"><Heart className="h-3 w-3 text-red-500" />{fmt(post.like_count ?? 0)}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3 text-blue-500" />{fmt(post.comments_count ?? 0)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recent posts grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="flex items-baseline justify-between flex-wrap gap-2 mb-4">
            <h2 className="text-xl font-semibold">Top Performing Posts ({top50.length})</h2>
            <span className="text-xs text-muted-foreground">sorted by Views</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {top50.map((post, idx) => (
              <a key={post.id} href={post.permalink} target="_blank" rel="noopener noreferrer" className="group">
                <Card className="glass hover:border-pink-500/50 transition-colors overflow-hidden relative">
                  <span className="absolute top-2 left-2 z-10 bg-black/70 backdrop-blur text-white text-[10px] font-bold px-1.5 py-0.5 rounded">#{idx + 1}</span>
                  <div className="relative aspect-square bg-muted">
                    {(post.thumbnail_url || post.media_url) && (
                      <Image src={post.thumbnail_url || post.media_url!} alt="" fill sizes="(max-width:640px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform" />
                    )}
                  </div>
                  <CardContent className="p-2.5">
                    {(post.view_count ?? 0) > 0 && (
                      <div className="flex items-center gap-1 text-xs mb-1 text-primary font-semibold">
                        <Eye className="h-3 w-3" />{fmt(post.view_count!)} views
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="flex items-center gap-1"><Heart className="h-3 w-3 text-red-500" />{fmt(post.like_count ?? 0)}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3 text-blue-500" />{fmt(post.comments_count ?? 0)}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-2.5 w-2.5" />{new Date(post.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </motion.div>

        <p className="text-xs text-center text-muted-foreground mt-8">
          <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse mr-2 align-middle" />
          Live from Instagram Graph API • Updated {new Date(data.fetchedAt).toLocaleString('en-IN')}
        </p>
      </div>
    </main>
  )
}
