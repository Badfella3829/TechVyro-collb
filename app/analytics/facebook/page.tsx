"use client"

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Users, FileText, Heart, MessageCircle,
  TrendingUp, ExternalLink, Eye, Calendar, Trophy, Share2, Loader2,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useFacebook } from '@/hooks/use-facebook'

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString('en-IN')
}

export default function FacebookAnalyticsPage() {
  const { data, loading, error } = useFacebook()

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading live Facebook data…</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="glass max-w-md w-full">
          <CardContent className="p-8 text-center">
            <p className="text-destructive font-semibold mb-2">Could not load Facebook data</p>
            <p className="text-sm text-muted-foreground mb-6">{error || 'Unknown error'}</p>
            <Link href="/"><Button variant="outline"><ArrowLeft className="h-4 w-4 mr-2" />Back to home</Button></Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { page, posts, computed } = data
  const totalReactions = posts.reduce((s, p) => s + (p.reactions?.summary?.total_count ?? 0), 0)
  const totalComments = posts.reduce((s, p) => s + (p.comments?.summary?.total_count ?? 0), 0)
  const totalShares = posts.reduce((s, p) => s + (p.shares?.count ?? 0), 0)
  const sortedPosts = [...posts]
    .sort((a, b) => (b.reactions?.summary?.total_count ?? 0) - (a.reactions?.summary?.total_count ?? 0))
  const topPosts = sortedPosts.slice(0, 3)
  const top50 = sortedPosts.slice(0, 50)

  return (
    <main className="min-h-screen pt-24 pb-16 sm:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/#stats" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />Back to overview
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="glass border-blue-500/30 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-blue-700/10 mb-8">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {page.profile_picture_url && (
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-blue-500/50 shrink-0">
                    <Image src={page.profile_picture_url} alt={page.name} fill sizes="112px" className="object-cover" />
                  </div>
                )}
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <h1 className="text-2xl sm:text-3xl font-bold">{page.name}</h1>
                    <a href={page.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  {page.username && <p className="text-base text-muted-foreground mb-2">@{page.username}</p>}
                  {page.about && <p className="text-sm text-muted-foreground max-w-xl mb-4">{page.about}</p>}
                  <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm">
                    <span><strong className="text-foreground text-base">{fmt(page.followers_count)}</strong> <span className="text-muted-foreground">followers</span></span>
                    <span><strong className="text-foreground text-base">{fmt(computed.postCount || posts.length)}</strong> <span className="text-muted-foreground">posts</span></span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: 'Followers', value: fmt(page.followers_count), color: 'text-blue-500 bg-blue-500/10' },
            { icon: FileText, label: 'Total Posts', value: fmt(computed.postCount || posts.length), color: 'text-cyan-500 bg-cyan-500/10' },
            { icon: Heart, label: 'Avg Reactions', value: fmt(Math.round(computed.avgReactions)), color: 'text-red-500 bg-red-500/10' },
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
              <div className="flex items-center gap-3 mb-2"><Heart className="h-5 w-5 text-red-500" /><span className="text-sm text-muted-foreground">Total Reactions</span></div>
              <div className="text-2xl font-bold">{fmt(totalReactions)}</div>
            </CardContent></Card>
            <Card className="glass"><CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2"><MessageCircle className="h-5 w-5 text-blue-500" /><span className="text-sm text-muted-foreground">Total Comments</span></div>
              <div className="text-2xl font-bold">{fmt(totalComments)}</div>
            </CardContent></Card>
            <Card className="glass"><CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2"><Share2 className="h-5 w-5 text-green-500" /><span className="text-sm text-muted-foreground">Total Shares</span></div>
              <div className="text-2xl font-bold">{fmt(totalShares)}</div>
            </CardContent></Card>
            <Card className="glass"><CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2"><Eye className="h-5 w-5 text-primary" /><span className="text-sm text-muted-foreground">Total Views</span></div>
              <div className="text-2xl font-bold">{fmt(computed.totalViews)}</div>
            </CardContent></Card>
          </div>
        </motion.div>

        {topPosts.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Trophy className="h-5 w-5 text-amber-500" />Top Performing Posts</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {topPosts.map((post) => (
                <a key={post.id} href={post.permalink_url} target="_blank" rel="noopener noreferrer" className="group">
                  <Card className="glass hover:border-blue-500/50 transition-colors overflow-hidden h-full">
                    {post.full_picture && (
                      <div className="relative aspect-video bg-muted">
                        <Image src={post.full_picture} alt="" fill sizes="(max-width:640px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform" />
                      </div>
                    )}
                    <CardContent className="p-3">
                      {post.message && <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{post.message}</p>}
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1"><Heart className="h-3 w-3 text-red-500" />{fmt(post.reactions?.summary?.total_count ?? 0)}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3 text-blue-500" />{fmt(post.comments?.summary?.total_count ?? 0)}</span>
                        <span className="flex items-center gap-1"><Share2 className="h-3 w-3 text-green-500" />{fmt(post.shares?.count ?? 0)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h2 className="text-xl font-semibold mb-4">Top Performing Posts ({top50.length})</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {top50.map((post, idx) => (
              <a key={post.id} href={post.permalink_url} target="_blank" rel="noopener noreferrer" className="group">
                <Card className="glass hover:border-blue-500/50 transition-colors overflow-hidden h-full flex flex-col relative">
                  <span className="absolute top-2 left-2 z-10 bg-black/70 backdrop-blur text-white text-[10px] font-bold px-1.5 py-0.5 rounded">#{idx + 1}</span>
                  {post.full_picture && (
                    <div className="relative aspect-video bg-muted">
                      <Image src={post.full_picture} alt="" fill sizes="(max-width:640px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform" />
                    </div>
                  )}
                  <CardContent className="p-3 flex-1 flex flex-col">
                    {(post.message || post.story) && <p className="text-xs text-muted-foreground line-clamp-3 mb-2 flex-1">{post.message || post.story}</p>}
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1"><Heart className="h-3 w-3 text-red-500" />{fmt(post.reactions?.summary?.total_count ?? 0)}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3 text-blue-500" />{fmt(post.comments?.summary?.total_count ?? 0)}</span>
                      <span className="flex items-center gap-1"><Share2 className="h-3 w-3 text-green-500" />{fmt(post.shares?.count ?? 0)}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-2">
                      <Calendar className="h-2.5 w-2.5" />{new Date(post.created_time).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </motion.div>

        <p className="text-xs text-center text-muted-foreground mt-8">
          <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse mr-2 align-middle" />
          Live from Facebook Graph API • Updated {new Date(data.fetchedAt).toLocaleString('en-IN')}
        </p>
      </div>
    </main>
  )
}
