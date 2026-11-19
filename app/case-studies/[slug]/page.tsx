import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Target, Layers, BarChart3, Sparkles, Tag } from 'lucide-react'
import { CASE_STUDIES, getCaseStudyBySlug } from '@/lib/case-studies-data'
import { Navbar } from '@/components/navigation/navbar'
import { Footer } from '@/components/footer/footer'
import { ClientEffects } from '@/components/effects/client-effects'
import { ReadingProgress } from '@/components/blog/reading-progress'
import { CaseStudyMetricsChart } from '@/components/case-studies/metrics-chart'

export function generateStaticParams() {
  return CASE_STUDIES.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const s = getCaseStudyBySlug(slug)
  if (!s) return { title: 'Case Study' }
  return { title: s.title, description: s.challenge.slice(0, 160) }
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const study = getCaseStudyBySlug(slug)
  if (!study) return notFound()

  return (
    <main className="relative min-h-screen">
      <ReadingProgress label={`Reading progress for ${study.title}`} />
      <ClientEffects />
      <Navbar />

      <div className="container mx-auto max-w-4xl pt-28 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-8">
        <Link
          href="/case-studies"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary mb-5 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All case studies
        </Link>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/15 text-primary border border-primary/30">
            {study.category}
          </span>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            {study.metric}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">{study.title}</h1>
        <p className="text-base text-muted-foreground mb-5">{study.summary}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {study.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-muted/40 text-muted-foreground border border-border/40"
            >
              <Tag className="h-3 w-3 text-primary" />
              {tag}
            </span>
          ))}
        </div>

        {/* Before vs After Campaign Impact Chart */}
        <section className="glass border border-primary/30 rounded-2xl p-5 sm:p-6 mt-6">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h2 className="text-sm font-mono uppercase tracking-wider text-primary flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> Campaign Impact — Before vs. After
            </h2>
            <span className="text-[11px] text-muted-foreground">Typical benchmark lift</span>
          </div>
          <CaseStudyMetricsChart metrics={study.beforeAfterMetrics} />
        </section>

        <section className="glass border border-border/50 rounded-2xl p-5 sm:p-6 mt-5">
          <h2 className="text-sm font-mono uppercase tracking-wider text-primary flex items-center gap-2 mb-2">
            <Target className="h-3.5 w-3.5" /> Challenge
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {study.challenge}
          </p>
        </section>

        <section className="glass border border-border/50 rounded-2xl p-5 sm:p-6 mt-4">
          <h2 className="text-sm font-mono uppercase tracking-wider text-primary flex items-center gap-2 mb-3">
            <Layers className="h-3.5 w-3.5" /> Approach
          </h2>
          <ol className="space-y-2.5 text-sm sm:text-base">
            {study.approach.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 h-6 w-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-muted-foreground leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="glass border border-border/50 rounded-2xl p-5 sm:p-6 mt-4">
          <h2 className="text-sm font-mono uppercase tracking-wider text-primary flex items-center gap-2 mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Deliverables
          </h2>
          <div className="flex flex-wrap gap-2">
            {study.deliverables.map((d) => (
              <span
                key={d}
                className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20"
              >
                {d}
              </span>
            ))}
          </div>
        </section>

        <section className="glass border border-border/50 rounded-2xl p-5 sm:p-6 mt-4">
          <h2 className="text-sm font-mono uppercase tracking-wider text-primary flex items-center gap-2 mb-2">
            <BarChart3 className="h-3.5 w-3.5" /> Expected Outcome
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {study.outcome}
          </p>
        </section>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/#quote-builder"
            className="inline-block px-6 py-3 rounded-lg border border-primary/40 text-primary font-semibold text-sm hover:bg-primary/10 transition-colors"
          >
            Estimate This Playbook
          </Link>
          <Link
            href="/#contact"
            className="inline-block px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Plan this for my brand →
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  )
}
