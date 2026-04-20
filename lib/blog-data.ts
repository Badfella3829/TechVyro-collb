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
]
