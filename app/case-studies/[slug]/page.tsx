import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Target, Layers, BarChart3, Sparkles } from 'lucide-react'

type CaseStudy = {
  slug: string
  title: string
  challenge: string
  approach: string[]
  deliverables: string[]
  outcome: string
}

const STUDIES: Record<string, CaseStudy> = {
  'tech-launch-blueprint': {
    slug: 'tech-launch-blueprint',
    title: 'Tech Product Launch Blueprint',
    challenge:
      'Brands launching a new gadget often face a flat first-week — the product disappears in the algorithm noise unless launch-day momentum is engineered intentionally.',
    approach: [
      'Pre-launch: 2 teaser Stories on Instagram + a teaser Short on YouTube, 48h before launch.',
      'Launch day: a high-production Reel on Instagram + a long-form review on YouTube, published within 2 hours of each other.',
      'Same day: a recap carousel on Facebook + Instagram tagging the brand handle.',
      'Day 3 follow-up: a "first impressions vs reality" Reel responding to viewer comments.',
    ],
    deliverables: ['1 Reel (60–90s)', '1 YouTube long-form (8–12 min)', '1 Carousel post', '2 Stories', '1 follow-up Reel'],
    outcome:
      'Typical result: 3–5× higher launch-day engagement vs a single-format push, and continued comment activity for 7+ days driving organic discovery.',
  },
  'always-on-creator-funnel': {
    slug: 'always-on-creator-funnel',
    title: 'Always-On Creator Funnel',
    challenge:
      'Most brand collabs end as a one-shot post that gets buried in 48 hours. An always-on funnel keeps the brand visible across the buyer journey.',
    approach: [
      'Awareness: short-form Reels & Shorts that show the product in everyday use.',
      'Consideration: a YouTube long-form review with honest pros & cons (this builds trust).',
      'Conversion: Stories with swipe-up / link sticker pointing to the offer.',
      'Retention: monthly recap post highlighting top customer use-cases.',
    ],
    deliverables: ['Monthly content calendar', 'Cross-platform publishing (IG + FB + YT)', 'Comment moderation & DM handoff', 'Monthly performance report'],
    outcome:
      'Compounding reach across 3 platforms with one consistent narrative — better than spreading the same budget across one-off campaigns.',
  },
  'viral-unboxing-campaign': {
    slug: 'viral-unboxing-campaign',
    title: 'Viral Unboxing Campaign',
    challenge:
      'Traditional product photos and spec sheets fail to create emotional connection. Brands need content that makes viewers feel like they already own the product.',
    approach: [
      'Pre-launch teaser: mysterious close-up shots hinting at the product design.',
      'Unboxing day: cinematic unboxing video with ASMR-quality audio and genuine first reactions.',
      'Deep-dive review: technical breakdown with real-world usage scenarios.',
      'User showcase: featuring customer unboxings and reactions to build social proof.',
    ],
    deliverables: ['1 Teaser Reel (15s)', '1 Full Unboxing (3-5 min)', '1 Review Video (8-12 min)', 'UGC compilation reel'],
    outcome:
      'Average of 10x organic shares compared to standard review content. Unboxing videos continue driving search traffic 6+ months after publication.',
  },
  'community-driven-launch': {
    slug: 'community-driven-launch',
    title: 'Community-Driven Launch',
    challenge:
      'Paid advertising costs are rising while effectiveness drops. Brands need organic growth strategies that leverage existing community for amplification.',
    approach: [
      'Beta access: exclusive early access to engaged community members for testing and feedback.',
      'Ambassador program: identifying and nurturing superfans who naturally promote the product.',
      'User-generated content: incentivizing and showcasing customer content across channels.',
      'Community events: live sessions, Q&As, and exclusive reveals to build anticipation.',
    ],
    deliverables: ['Community strategy document', 'Ambassador outreach templates', 'UGC campaign kit', 'Live event production (2 sessions)'],
    outcome:
      '50% lower customer acquisition cost compared to paid-only campaigns. Higher retention rates as customers feel invested in the brand success.',
  },
}

export function generateStaticParams() {
  return Object.keys(STUDIES).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const s = STUDIES[slug]
  if (!s) return { title: 'Case Study' }
  return { title: s.title, description: s.challenge.slice(0, 160) }
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const study = STUDIES[slug]
  if (!study) return notFound()

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-3xl">
        <Link href="/case-studies" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-3 w-3" /> All case studies
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">{study.title}</h1>

        <section className="glass border border-border/50 rounded-2xl p-5 sm:p-6 mt-6">
          <h2 className="text-sm font-mono uppercase tracking-wider text-primary flex items-center gap-2 mb-2"><Target className="h-3 w-3" /> Challenge</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{study.challenge}</p>
        </section>

        <section className="glass border border-border/50 rounded-2xl p-5 sm:p-6 mt-4">
          <h2 className="text-sm font-mono uppercase tracking-wider text-primary flex items-center gap-2 mb-3"><Layers className="h-3 w-3" /> Approach</h2>
          <ol className="space-y-2 text-sm">
            {study.approach.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 h-6 w-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <span className="text-muted-foreground leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="glass border border-border/50 rounded-2xl p-5 sm:p-6 mt-4">
          <h2 className="text-sm font-mono uppercase tracking-wider text-primary flex items-center gap-2 mb-3"><Sparkles className="h-3 w-3" /> Deliverables</h2>
          <div className="flex flex-wrap gap-2">
            {study.deliverables.map((d) => (
              <span key={d} className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">{d}</span>
            ))}
          </div>
        </section>

        <section className="glass border border-border/50 rounded-2xl p-5 sm:p-6 mt-4">
          <h2 className="text-sm font-mono uppercase tracking-wider text-primary flex items-center gap-2 mb-2"><BarChart3 className="h-3 w-3" /> Expected Outcome</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{study.outcome}</p>
        </section>

        <div className="mt-8 text-center">
          <Link href="/contact" className="inline-block px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90">
            Plan this for my brand →
          </Link>
        </div>
      </div>
    </main>
  )
}
