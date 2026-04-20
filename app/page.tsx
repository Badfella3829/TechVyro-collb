import { Navbar } from '@/components/navigation/navbar'
import { HeroSection } from '@/components/hero/hero-section'
import { TrustBar } from '@/components/trust-bar/trust-bar'
import { SectionDivider } from '@/components/section-divider/section-divider'
import { StatsSection } from '@/components/stats/stats-section'
import { BrandsSection } from '@/components/brands/brands-section'
import { ServicesGrid } from '@/components/services/services-grid'
import { JourneyTimeline } from '@/components/journey/journey-timeline'
import { PackagesSection } from '@/components/packages/packages-section'
import { ROICalculator } from '@/components/calculators/roi-calculator'
import { ComparisonTable } from '@/components/comparison/comparison-table'
import { PortfolioSection } from '@/components/portfolio/portfolio-section'
import { LatestFeed } from '@/components/feed/latest-feed'
import { WhyMeSection } from '@/components/why-me/why-me-section'
import { TestimonialsSection } from '@/components/testimonials/testimonials-section'
import { NewsletterInline } from '@/components/newsletter/newsletter-inline'
import { PressSection } from '@/components/press/press-section'
import { MediaKitSection } from '@/components/media-kit/media-kit-section'
import { CollabProcess } from '@/components/process/collab-process'
import { AvailabilityCalendar } from '@/components/availability/availability-calendar'
import { ContactSection } from '@/components/contact/contact-section'
import { FaqSection } from '@/components/faq/faq-section'
import { Footer } from '@/components/footer/footer'
import { ClientEffects } from '@/components/effects/client-effects'
import { StickyMobileCta } from '@/components/floating/sticky-mobile-cta'

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <ClientEffects />
      <Navbar />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ACT 1 — IMPACT: First impression in 5 seconds                  */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <HeroSection />
      <TrustBar />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ACT 2 — PROOF: Live numbers + brand logos                      */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <SectionDivider
        label="01 — PROOF"
        title="Numbers Don't Lie"
        subtitle="Real-time stats from live platforms"
      />
      <StatsSection />
      <BrandsSection />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ACT 3 — SERVICES: What we make                                 */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <SectionDivider
        label="02 — SERVICES"
        title="What We Create"
        subtitle="8 production formats engineered for tech brands"
      />
      <ServicesGrid />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ACT 4 — WORK: Featured productions                             */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <SectionDivider
        label="03 — WORK"
        title="Featured Productions"
        subtitle="From idea to viral — explore our latest"
      />
      <PortfolioSection />
      <LatestFeed />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ACT 5 — STORY: Why we win                                      */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <SectionDivider
        label="04 — STORY"
        title="The TechVyro Edge"
        subtitle="Built different. Engineered for ROI."
      />
      <WhyMeSection />
      <JourneyTimeline />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ACT 6 — VALIDATION: Voices that matter                         */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <SectionDivider
        label="05 — VALIDATION"
        title="Brands & Press Speak"
        subtitle="What partners and media say about working with us"
      />
      <TestimonialsSection />
      <PressSection />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ACT 7 — OFFER: Packages + ROI                                  */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <SectionDivider
        label="06 — OFFER"
        title="Pick Your Growth Pack"
        subtitle="Transparent pricing. Calculate your ROI live."
      />
      <PackagesSection />
      <ROICalculator />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ACT 8 — DIFFERENTIATION: Why TechVyro vs others                */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <SectionDivider
        label="07 — DIFFERENTIATION"
        title="Why TechVyro Wins"
        subtitle="Side-by-side: agency vs solo creator vs us"
      />
      <ComparisonTable />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ACT 9 — PROCESS: How we collaborate                            */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <SectionDivider
        label="08 — PROCESS"
        title="From Brief to Viral"
        subtitle="A frictionless 4-step collaboration flow"
      />
      <CollabProcess />
      <MediaKitSection />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ACT 10 — ANSWERS: FAQ                                          */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <SectionDivider
        label="09 — ANSWERS"
        title="Frequently Asked"
        subtitle="Everything you wanted to know — answered"
      />
      <FaqSection />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ACT 11 — CONNECT: Final conversion stack (right above footer)  */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <SectionDivider
        label="10 — CONNECT"
        title="Let's Build Something Big"
        subtitle="Newsletter · Book a call · Send a brief"
      />
      <NewsletterInline />
      <AvailabilityCalendar />
      <ContactSection />

      <Footer />
      <StickyMobileCta />
    </main>
  )
}
