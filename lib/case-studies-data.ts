export type CaseStudyCategory = 'Product Launch' | 'Full Funnel' | 'Viral Growth' | 'Community'

export interface BeforeAfterMetric {
  metric: string
  baseline: number
  campaign: number
  unit: string
}

export interface CaseStudyItem {
  slug: string
  title: string
  category: CaseStudyCategory
  tags: string[]
  summary: string
  metric: string
  iconName: 'zap' | 'target' | 'briefcase' | 'users'
  gradient: string
  challenge: string
  approach: string[]
  deliverables: string[]
  outcome: string
  beforeAfterMetrics: BeforeAfterMetric[]
}

export const CASE_STUDIES: CaseStudyItem[] = [
  {
    slug: 'tech-launch-blueprint',
    title: 'Tech Product Launch Blueprint',
    category: 'Product Launch',
    tags: ['YouTube Review', 'Instagram Reel', 'Launch Day'],
    summary: 'How a Reel + YouTube short combo can drive a 3-5x engagement spike on launch day.',
    metric: '3-5x engagement lift',
    iconName: 'zap',
    gradient: 'from-orange-500/20 to-red-500/10',
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
    beforeAfterMetrics: [
      { metric: 'Launch Views (K)', baseline: 65, campaign: 310, unit: 'K' },
      { metric: 'Engagement (%)', baseline: 2.4, campaign: 9.2, unit: '%' },
      { metric: 'Link CTR (%)', baseline: 1.1, campaign: 4.8, unit: '%' },
      { metric: 'Saves & Shares (K)', baseline: 1.8, campaign: 14.5, unit: 'K' },
    ],
  },
  {
    slug: 'always-on-creator-funnel',
    title: 'Always-On Creator Funnel',
    category: 'Full Funnel',
    tags: ['Multi-Platform', 'Retainer', 'Conversions'],
    summary: 'Combining Instagram, Facebook & YouTube into one always-on collaboration funnel.',
    metric: 'Multi-platform reach',
    iconName: 'target',
    gradient: 'from-blue-500/20 to-cyan-500/10',
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
    beforeAfterMetrics: [
      { metric: 'Monthly Reach (K)', baseline: 120, campaign: 490, unit: 'K' },
      { metric: 'Assisted Sales', baseline: 180, campaign: 740, unit: 'orders' },
      { metric: 'Brand Recall (%)', baseline: 18, campaign: 62, unit: '%' },
      { metric: 'ROAS Multiple', baseline: 1.9, campaign: 5.4, unit: 'x' },
    ],
  },
  {
    slug: 'viral-unboxing-campaign',
    title: 'Viral Unboxing Campaign',
    category: 'Viral Growth',
    tags: ['Unboxing', 'ASMR', 'Organic Shares'],
    summary: 'Strategic unboxing content that generates organic shares and UGC from viewers.',
    metric: '10x organic shares',
    iconName: 'briefcase',
    gradient: 'from-purple-500/20 to-pink-500/10',
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
    beforeAfterMetrics: [
      { metric: 'Organic Shares (K)', baseline: 1.2, campaign: 12.6, unit: 'K' },
      { metric: 'Watch-Through (%)', baseline: 34, campaign: 78, unit: '%' },
      { metric: 'Search Traffic (K)', baseline: 14, campaign: 89, unit: 'K' },
      { metric: 'UGC Mentions', baseline: 22, campaign: 215, unit: 'posts' },
    ],
  },
  {
    slug: 'community-driven-launch',
    title: 'Community-Driven Launch',
    category: 'Community',
    tags: ['Beta Access', 'Lower CAC', 'Live Q&A'],
    summary: 'Leveraging existing community for beta testing and word-of-mouth amplification.',
    metric: '50% lower CAC',
    iconName: 'users',
    gradient: 'from-green-500/20 to-emerald-500/10',
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
    beforeAfterMetrics: [
      { metric: 'CAC Cost (₹)', baseline: 680, campaign: 320, unit: '₹' },
      { metric: 'Beta Signups', baseline: 240, campaign: 1450, unit: 'users' },
      { metric: 'Repeat Buyers (%)', baseline: 14, campaign: 39, unit: '%' },
      { metric: 'Live Peak Viewers', baseline: 310, campaign: 1920, unit: 'live' },
    ],
  },
]

export function getCaseStudyBySlug(slug: string): CaseStudyItem | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug)
}

export function getCaseStudyCategories(studies: CaseStudyItem[] = CASE_STUDIES): CaseStudyCategory[] {
  return Array.from(new Set(studies.map((s) => s.category)))
}

export function filterCaseStudies(
  studies: CaseStudyItem[],
  query: string,
  category: string = 'All'
): CaseStudyItem[] {
  const q = query.trim().toLowerCase()
  return studies.filter((study) => {
    const matchesCategory = category === 'All' || study.category === category
    if (!matchesCategory) return false
    if (!q) return true
    return (
      study.title.toLowerCase().includes(q) ||
      study.summary.toLowerCase().includes(q) ||
      study.category.toLowerCase().includes(q) ||
      study.tags.some((t) => t.toLowerCase().includes(q))
    )
  })
}
