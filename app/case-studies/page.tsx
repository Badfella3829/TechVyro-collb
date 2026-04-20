import Link from 'next/link'
import { ArrowRight, TrendingUp } from 'lucide-react'

export const metadata = { title: 'Case Studies' }

const CASES = [
  {
    slug: 'tech-launch-blueprint',
    title: 'Tech Product Launch Blueprint',
    summary: 'How a Reel + YouTube short combo can drive a 3–5× engagement spike on launch day.',
    metric: '3–5× engagement lift',
  },
  {
    slug: 'always-on-creator-funnel',
    title: 'Always-On Creator Funnel',
    summary: 'Combining Instagram, Facebook & YouTube into one always-on collaboration funnel.',
    metric: 'Multi-platform reach',
  },
]

export default function CaseStudiesPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-mono mb-2">Case Studies</p>
          <h1 className="text-3xl sm:text-4xl font-bold">Proven playbooks for brand growth</h1>
          <p className="text-sm text-muted-foreground mt-3 max-w-2xl">
            Real strategies we use for brand collaborations. Each playbook explains the approach, the deliverables, and the typical results to expect.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {CASES.map((c) => (
            <Link
              key={c.slug}
              href={`/case-studies/${c.slug}`}
              className="group glass border border-border/50 rounded-2xl p-6 hover:border-primary/50 transition-all hover:-translate-y-0.5"
            >
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-primary mb-3">
                <TrendingUp className="h-3 w-3" /> {c.metric}
              </div>
              <h2 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{c.title}</h2>
              <p className="text-sm text-muted-foreground">{c.summary}</p>
              <div className="inline-flex items-center gap-1 text-sm font-semibold mt-4 text-primary">
                Read playbook <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

        <div className="glass border border-border/50 rounded-2xl p-6 mt-8 text-center">
          <p className="text-sm text-muted-foreground">Have a launch coming up?</p>
          <Link href="/contact" className="inline-block mt-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90">
            Book a strategy call →
          </Link>
        </div>
      </div>
    </main>
  )
}
