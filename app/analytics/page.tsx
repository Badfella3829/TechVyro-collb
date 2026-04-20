import Link from 'next/link'
import type { Metadata } from 'next'
import { Youtube, Instagram, Facebook, ArrowRight, BarChart3 } from 'lucide-react'
import { Navbar } from '@/components/navigation/navbar'
import { Footer } from '@/components/footer/footer'
import { StatsSection } from '@/components/stats/stats-section'

export const metadata: Metadata = {
  title: 'Live Analytics | TechVyro',
  description:
    'Real-time analytics dashboard for TechVyro across YouTube, Instagram, and Facebook. Live stats from Graph APIs.',
}

const PLATFORMS = [
  {
    href: '/analytics/youtube',
    name: 'YouTube',
    desc: 'Subscribers, views, top videos, growth trends — pulled live from YouTube Data API.',
    icon: Youtube,
    iconBg: 'bg-red-500/10 text-red-400',
    accent: 'from-red-500/20 to-orange-500/10',
  },
  {
    href: '/analytics/instagram',
    name: 'Instagram',
    desc: 'Followers, reach, engagement, top reels — direct from Instagram Graph API.',
    icon: Instagram,
    iconBg: 'bg-pink-500/10 text-pink-400',
    accent: 'from-pink-500/20 to-purple-500/10',
  },
  {
    href: '/analytics/facebook',
    name: 'Facebook',
    desc: 'Page likes, reach, post insights — synced from Facebook Graph API.',
    icon: Facebook,
    iconBg: 'bg-blue-500/10 text-blue-400',
    accent: 'from-blue-500/20 to-cyan-500/10',
  },
]

export default function AnalyticsHub() {
  return (
    <main className="relative min-h-screen">
      <Navbar />

      <section className="pt-28 sm:pt-32 pb-12 px-4 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
          <BarChart3 className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-primary tracking-wide">LIVE ANALYTICS</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
          Real Numbers, <span className="gradient-text">Real Time</span>
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
          Zero fake data. Every stat below is pulled live from the platform's own Graph API. Click a
          platform for the full breakdown.
        </p>
      </section>

      {/* Live snapshot from home stats */}
      <StatsSection />

      {/* Platform deep-dives */}
      <section className="py-12 sm:py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Platform Deep-Dives</h2>
          <p className="text-muted-foreground text-sm">
            Pick a platform to see detailed live analytics
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PLATFORMS.map((p) => {
            const Icon = p.icon
            return (
              <Link
                key={p.href}
                href={p.href}
                className="group relative glass border border-border/50 rounded-2xl p-6 hover:border-primary/40 hover:-translate-y-1 transition-all overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${p.accent} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
                />
                <div className="relative">
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${p.iconBg} mb-4`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-1.5">{p.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{p.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                    View Analytics <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <Footer />
    </main>
  )
}
