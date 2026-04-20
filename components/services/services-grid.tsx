"use client"

import { motion } from 'framer-motion'
import { Youtube, Instagram, Film, Megaphone, Star, GraduationCap, Mic, Sparkles } from 'lucide-react'

const SERVICES = [
  {
    icon: Youtube,
    title: 'YouTube Long-form',
    desc: '8-15 min deep-dive reviews, tutorials, unboxings. Full production.',
    tags: ['Reviews', 'Tutorials', 'Unboxings'],
    gradient: 'from-red-500/20 to-orange-500/10',
    iconBg: 'bg-red-500/10 text-red-400',
  },
  {
    icon: Film,
    title: 'YouTube Shorts',
    desc: 'Snackable 30-60s vertical content optimized for discovery.',
    tags: ['Hook-first', 'Trends', 'Viral'],
    gradient: 'from-orange-500/20 to-pink-500/10',
    iconBg: 'bg-orange-500/10 text-orange-400',
  },
  {
    icon: Instagram,
    title: 'Instagram Reels',
    desc: 'Trending-format reels with brand storytelling baked in.',
    tags: ['Reels', 'Stories', 'Carousels'],
    gradient: 'from-pink-500/20 to-purple-500/10',
    iconBg: 'bg-pink-500/10 text-pink-400',
  },
  {
    icon: Megaphone,
    title: 'Brand Integrations',
    desc: 'Native ad placements that feel organic — not forced.',
    tags: ['Sponsored', 'Native ads', 'Endorsements'],
    gradient: 'from-purple-500/20 to-blue-500/10',
    iconBg: 'bg-purple-500/10 text-purple-400',
  },
  {
    icon: Star,
    title: 'Honest Reviews',
    desc: 'Trust-building reviews that drive purchase intent.',
    tags: ['Pros/Cons', 'Verdict', 'Buy Guide'],
    gradient: 'from-yellow-500/20 to-orange-500/10',
    iconBg: 'bg-yellow-500/10 text-yellow-400',
  },
  {
    icon: GraduationCap,
    title: 'Tutorials & Guides',
    desc: 'How-to content that ranks on YouTube search.',
    tags: ['SEO-driven', 'Step-by-step', 'Evergreen'],
    gradient: 'from-emerald-500/20 to-teal-500/10',
    iconBg: 'bg-emerald-500/10 text-emerald-400',
  },
  {
    icon: Mic,
    title: 'Podcast Appearances',
    desc: 'Tech podcast guest spots & cross-promotion.',
    tags: ['Audio', 'Interviews', 'Collabs'],
    gradient: 'from-blue-500/20 to-cyan-500/10',
    iconBg: 'bg-blue-500/10 text-blue-400',
  },
  {
    icon: Sparkles,
    title: 'Custom Campaigns',
    desc: 'Multi-platform launch campaigns built around your goal.',
    tags: ['Launch', '360° rollout', 'Bespoke'],
    gradient: 'from-cyan-500/20 to-emerald-500/10',
    iconBg: 'bg-cyan-500/10 text-cyan-400',
  },
]

export function ServicesGrid() {
  return (
    <section id="services" className="py-16 sm:py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary tracking-wide">WHAT WE CREATE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
            Content Formats That <span className="gradient-text">Convert</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            8 production formats. One creative team. Built around your brand goal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICES.map((service, idx) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`group relative glass border border-border/50 rounded-2xl p-5 hover:border-primary/40 hover:-translate-y-1 transition-all overflow-hidden`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
                />
                <div className="relative">
                  <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${service.iconBg} mb-4`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-base mb-1.5">{service.title}</h3>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{service.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {service.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-muted/40 border border-border/40 text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
