import Link from 'next/link'
import { ArrowRight, TrendingUp, Briefcase, Zap, Target, Users } from 'lucide-react'
import { Navbar } from '@/components/navigation/navbar'
import { Footer } from '@/components/footer/footer'
import { ClientEffects } from '@/components/effects/client-effects'

export const metadata = { 
  title: 'Case Studies | TechVyro',
  description: 'Real strategies we use for brand collaborations. Each playbook explains the approach, deliverables, and typical results.'
}

const CASES = [
  {
    slug: 'tech-launch-blueprint',
    title: 'Tech Product Launch Blueprint',
    summary: 'How a Reel + YouTube short combo can drive a 3-5x engagement spike on launch day.',
    metric: '3-5x engagement lift',
    icon: Zap,
    gradient: 'from-orange-500/20 to-red-500/10',
  },
  {
    slug: 'always-on-creator-funnel',
    title: 'Always-On Creator Funnel',
    summary: 'Combining Instagram, Facebook & YouTube into one always-on collaboration funnel.',
    metric: 'Multi-platform reach',
    icon: Target,
    gradient: 'from-blue-500/20 to-cyan-500/10',
  },
  {
    slug: 'viral-unboxing-campaign',
    title: 'Viral Unboxing Campaign',
    summary: 'Strategic unboxing content that generates organic shares and UGC from viewers.',
    metric: '10x organic shares',
    icon: Briefcase,
    gradient: 'from-purple-500/20 to-pink-500/10',
  },
  {
    slug: 'community-driven-launch',
    title: 'Community-Driven Launch',
    summary: 'Leveraging existing community for beta testing and word-of-mouth amplification.',
    metric: '50% lower CAC',
    icon: Users,
    gradient: 'from-green-500/20 to-emerald-500/10',
  },
]

export default function CaseStudiesPage() {
  return (
    <main className="relative min-h-screen">
      <ClientEffects />
      <Navbar />
      
      {/* Hero Header */}
      <section className="relative pt-32 pb-12 sm:pt-40 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 grid-pattern-subtle opacity-30" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Briefcase className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary tracking-wide uppercase">Case Studies</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            Proven <span className="gradient-text">Playbooks</span> for Growth
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Real strategies we use for brand collaborations. Each playbook explains the approach, deliverables, and typical results to expect.
          </p>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="grid sm:grid-cols-2 gap-6">
            {CASES.map((c, idx) => {
              const Icon = c.icon
              return (
                <Link
                  key={c.slug}
                  href={`/case-studies/${c.slug}`}
                  className="group relative glass-card border border-border/30 rounded-2xl p-6 sm:p-8 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all hover:-translate-y-1 overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-xs font-mono px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-mono text-primary mb-3">
                      <TrendingUp className="h-3 w-3" /> {c.metric}
                    </div>
                    <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{c.title}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">{c.summary}</p>
                    <div className="inline-flex items-center gap-1.5 text-sm font-semibold mt-4 text-primary">
                      Read playbook <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* CTA */}
          <div className="mt-12 glass border border-border/50 rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
            <div className="relative">
              <h3 className="text-2xl sm:text-3xl font-bold mb-3">Have a launch coming up?</h3>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Let&apos;s create a custom playbook for your brand. We&apos;ll analyze your goals and design the perfect content strategy.
              </p>
              <Link href="/#contact" className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 transition-opacity">
                Book a Strategy Call
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
