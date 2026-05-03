type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'list'; items: string[] }

export type BlogPost = {
  slug: string
  title: string
  date: string
  readMinutes: number
  excerpt: string
  body: Block[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'why-real-engagement-beats-follower-count',
    title: 'Why real engagement beats follower count in 2026',
    date: '2026-04-10',
    readMinutes: 4,
    excerpt: 'Brands chasing follower counts are leaving 80% of their ROI on the table. Here is the metric that actually predicts campaign performance.',
    body: [
      { type: 'p', text: 'Most brand briefs we receive start with a question about follower count. It is the wrong question. Two creators with identical follower counts can deliver wildly different results — and the variable that explains the gap is engagement quality, not size.' },
      { type: 'h2', text: 'What we actually measure' },
      { type: 'list', items: [
        'Engagement rate per post (likes + comments + shares ÷ reach)',
        'Save rate on Instagram — a strong signal of long-term retention',
        'Average watch-through on Reels & Shorts',
        'Comment-to-like ratio — high ratio means active community',
      ]},
      { type: 'h2', text: 'Why this matters for your budget' },
      { type: 'p', text: 'A creator with 100K engaged followers will outperform a creator with 1M passive followers on every metric that matters: clicks, store visits, and conversions. When you brief us, we share the live engagement metrics from our APIs so you can verify before you commit.' },
      { type: 'h2', text: 'How to evaluate any creator' },
      { type: 'list', items: [
        'Ask for the engagement rate on their last 10 posts (not their best 1)',
        'Check if comments are conversational or just emojis',
        'Look at audience reaction velocity — fast comments in the first hour signal a hot audience',
      ]},
    ],
  },
  {
    slug: 'instagram-reels-vs-youtube-shorts-for-brands',
    title: 'Instagram Reels vs YouTube Shorts — which one should brands prioritize?',
    date: '2026-03-22',
    readMinutes: 5,
    excerpt: 'Both formats look identical but they serve very different goals. Pick the wrong one and you waste 50% of your budget.',
    body: [
      { type: 'p', text: 'Short-form video is the dominant ad format of this decade — but Reels and Shorts are not interchangeable. They have different discovery mechanics, different audience intent, and different conversion behavior.' },
      { type: 'h2', text: 'When to choose Instagram Reels' },
      { type: 'list', items: [
        'Your goal is brand awareness inside an existing follower base',
        'You want comments and DMs as your conversion channel',
        'You need quick turnaround (3–5 days from concept to publish)',
      ]},
      { type: 'h2', text: 'When to choose YouTube Shorts' },
      { type: 'list', items: [
        'You want long-tail discovery (Shorts keep ranking for months)',
        'You will follow up with a long-form review on the same channel',
        'Your audience searches for product comparisons',
      ]},
      { type: 'h2', text: 'The combo that works best' },
      { type: 'p', text: 'For most product launches, we recommend running both. The Reel drives immediate buzz, the Short keeps showing up in search results six months later. Together they compound.' },
    ],
  },
  {
    slug: 'how-to-brief-a-creator-for-maximum-roi',
    title: 'How to brief a creator for maximum ROI (a 6-step template)',
    date: '2026-03-05',
    readMinutes: 6,
    excerpt: 'A great brief is the difference between content that moves the needle and content that disappears in 24 hours. Here is the template we use.',
    body: [
      { type: 'p', text: 'After running collaborations across Instagram, Facebook, and YouTube, we have noticed a pattern: brands with crisp briefs get 2–3× better results than brands with vague ones. Here is the structure that consistently works.' },
      { type: 'h2', text: 'The 6-section brief' },
      { type: 'list', items: [
        'One-line objective — what is the single outcome you want?',
        'Audience context — who are you trying to reach (specific, not "everyone")?',
        'Mandatory hooks — features or claims that must appear',
        'Tone & no-go list — words to use, words to avoid',
        'Distribution plan — which platforms, in what order, on what dates',
        'Success metric — what number defines a win?',
      ]},
      { type: 'h2', text: 'What we do with a great brief' },
      { type: 'p', text: 'We turn it around in 48 hours with a content treatment, a thumbnail mockup, and a publishing schedule. You approve once and we run it end-to-end.' },
    ],
  },
  {
    slug: 'facebook-reels-secret-weapon',
    title: 'Facebook Reels: The secret weapon brands are ignoring',
    date: '2026-02-18',
    readMinutes: 5,
    excerpt: 'While everyone fights for attention on Instagram, Facebook Reels offers 3x more organic reach with zero competition. Here is how to capitalize.',
    body: [
      { type: 'p', text: 'Instagram Reels gets all the hype, but Facebook Reels is quietly delivering insane organic reach. Most brands have not even discovered it yet — which means now is the perfect time to get in.' },
      { type: 'h2', text: 'Why Facebook Reels works right now' },
      { type: 'list', items: [
        'Algorithm is hungry for content — Facebook is pushing Reels hard to compete with TikTok',
        'Older demographic with higher purchasing power',
        'Less creator competition means your content stands out',
        'Cross-posting from Instagram Reels is seamless',
      ]},
      { type: 'h2', text: 'Best practices for Facebook Reels' },
      { type: 'list', items: [
        'Keep it under 60 seconds — attention span is shorter on Facebook',
        'Add captions — 85% watch without sound',
        'Hook in the first 2 seconds — thumb-stopping visuals',
        'Include a clear CTA in the last 5 seconds',
      ]},
      { type: 'h2', text: 'How we use it for brand campaigns' },
      { type: 'p', text: 'We create one master Reel optimized for Instagram, then re-edit for Facebook with adjusted text overlays and pacing. Same content, double the reach, minimal extra effort.' },
    ],
  },
  {
    slug: 'tech-unboxing-psychology',
    title: 'The psychology behind viral tech unboxings',
    date: '2026-02-01',
    readMinutes: 6,
    excerpt: 'Unboxing videos get 10x more engagement than standard reviews. Here is the science behind why — and how to engineer virality into your next launch.',
    body: [
      { type: 'p', text: 'Unboxing videos tap into something primal: the anticipation of a gift, the reveal of something new, the vicarious thrill of ownership. Brands that understand this psychology win.' },
      { type: 'h2', text: 'The 4 psychological triggers' },
      { type: 'list', items: [
        'Anticipation — the buildup creates dopamine spikes',
        'ASMR appeal — crisp sounds of packaging being opened',
        'Vicarious ownership — viewers imagine themselves unboxing',
        'Trust building — seeing real packaging builds authenticity',
      ]},
      { type: 'h2', text: 'Elements of a perfect unboxing' },
      { type: 'list', items: [
        'Clean, well-lit setup — white or minimal background',
        'Slow, deliberate movements — let viewers savor the reveal',
        'Genuine first reactions — authenticity over polish',
        'Detailed exploration — show every accessory and feature',
      ]},
      { type: 'h2', text: 'Why brands should invest in unboxings' },
      { type: 'p', text: 'An unboxing video has the longest shelf life of any content format. People search for unboxings months after launch. It is evergreen content that keeps driving discovery.' },
    ],
  },
  {
    slug: 'measuring-influencer-roi',
    title: 'How to actually measure influencer marketing ROI',
    date: '2026-01-15',
    readMinutes: 7,
    excerpt: 'Most brands track vanity metrics that mean nothing. Here are the 5 metrics that actually predict whether your campaign made money.',
    body: [
      { type: 'p', text: 'Likes and comments feel good but they do not pay the bills. After running 50+ brand campaigns, here is what we have learned actually predicts ROI.' },
      { type: 'h2', text: 'The 5 metrics that matter' },
      { type: 'list', items: [
        'Click-through rate — how many viewers took action',
        'Cost per click — what you paid for each interested user',
        'Conversion rate — percentage who bought after clicking',
        'Customer acquisition cost — total spend ÷ new customers',
        'Lifetime value ratio — LTV of acquired customers vs CAC',
      ]},
      { type: 'h2', text: 'How to track these metrics' },
      { type: 'list', items: [
        'Use unique UTM links for each creator',
        'Set up proper attribution windows (7-day, 28-day)',
        'Track both direct and assisted conversions',
        'Survey new customers: "How did you hear about us?"',
      ]},
      { type: 'h2', text: 'Our reporting approach' },
      { type: 'p', text: 'We provide brands with a live dashboard showing real engagement metrics from our APIs, plus post-campaign reports with conversion tracking. No guesswork, just data.' },
    ],
  },
]
