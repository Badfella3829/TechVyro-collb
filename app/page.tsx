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
      {/* ACT 1 — WELCOME: First impression                              */}
      {/* Hero hook → TrustBar marquee                                   */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <HeroSection />
      <TrustBar />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ACT 2 — PROOF: Credibility numbers + brand logos               */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <SectionDivider
        label="01 — PROOF"
        title="Numbers Don't Lie"
        subtitle="Real-time stats from live platforms · Brands we've served"
      />
      <StatsSection />
      <BrandsSection />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ACT 3 — WORK: Show the work, then explain the formats          */}
      {/* Portfolio (show) → Latest Feed (live) → Services (formats)     */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <SectionDivider
        label="02 — WORK"
        title="Featured Productions"
        subtitle="See what we've built · Live feed · Content formats we create"
      />
      <PortfolioSection />
      <LatestFeed />
      <ServicesGrid />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ACT 4 — STORY: Why TechVyro + journey timeline                 */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <SectionDivider
        label="03 — STORY"
        title="The TechVyro Edge"
        subtitle="Why we win · How we got here"
      />
      <WhyMeSection />
      <JourneyTimeline />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ACT 5 — TRUST: Voices that matter (clients + media)            */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <SectionDivider
        label="04 — TRUST"
        title="Brands & Press Speak"
        subtitle="What partners and media say about working with us"
      />
      <TestimonialsSection />
      <PressSection />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ACT 6 — OFFER: Packages → ROI → Why us vs others               */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <SectionDivider
        label="05 — OFFER"
        title="Pick Your Growth Pack"
        subtitle="Transparent pricing · Calculate ROI · See the difference"
      />
      <PackagesSection />
      <ROICalculator />
      <ComparisonTable />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ACT 7 — PROCESS: How we collaborate + media kit download       */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <SectionDivider
        label="06 — PROCESS"
        title="From Brief to Viral"
        subtitle="A frictionless 4-step flow · Download our deck"
      />
      <CollabProcess />
      <MediaKitSection />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ACT 8 — ANSWERS: Clear final doubts                            */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <SectionDivider
        label="07 — ANSWERS"
        title="Frequently Asked"
        subtitle="Everything you wanted to know — answered"
      />
      <FaqSection />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* ACT 9 — CONNECT: Final conversion stack (right above footer)   */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <SectionDivider
        label="08 — CONNECT"
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
