import Link from 'next/link'
import { Briefcase } from 'lucide-react'
import { Navbar } from '@/components/navigation/navbar'
import { Footer } from '@/components/footer/footer'
import { ClientEffects } from '@/components/effects/client-effects'
import { CASE_STUDIES, getCaseStudyCategories } from '@/lib/case-studies-data'
import { CaseStudiesExplorer } from '@/components/case-studies/case-studies-explorer'

export const metadata = {
  title: 'Case Studies',
  description:
    'Real strategies we use for brand collaborations. Each playbook explains the approach, deliverables, and typical results.',
}

export default function CaseStudiesPage() {
  const categories = getCaseStudyCategories(CASE_STUDIES)

  return (
    <main className="relative min-h-screen">
      <ClientEffects />
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-32 pb-10 sm:pt-40 sm:pb-14 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 grid-pattern-subtle opacity-30" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Briefcase className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary tracking-wide uppercase">
              Case Studies
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            Proven <span className="gradient-text">Playbooks</span> for Growth
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Real strategies we use for brand collaborations. Each playbook explains the approach, deliverables, and typical before-vs-after results.
          </p>
        </div>
      </section>

      {/* Filterable Case Studies Grid */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <CaseStudiesExplorer studies={CASE_STUDIES} categories={categories} />

          {/* CTA */}
          <div className="mt-12 glass border border-border/50 rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
            <div className="relative">
              <h3 className="text-2xl sm:text-3xl font-bold mb-3">Have a launch coming up?</h3>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Let&apos;s create a custom playbook for your brand. We&apos;ll analyze your goals and design the perfect content strategy.
              </p>
              <Link
                href="/#contact"
                className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 transition-opacity"
              >
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
