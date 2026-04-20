import { Navbar } from '@/components/navigation/navbar'
import { HeroSection } from '@/components/hero/hero-section'
import { AboutSection } from '@/components/about/about-section'
import { StatsSection } from '@/components/stats/stats-section'
import { BrandsSection } from '@/components/brands/brands-section'
import { JourneyTimeline } from '@/components/journey/journey-timeline'
import { PackagesSection } from '@/components/packages/packages-section'
import { ROICalculator } from '@/components/calculators/roi-calculator'
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
import { Footer } from '@/components/footer/footer'
import { ClientEffects } from '@/components/effects/client-effects'

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <ClientEffects />
      <Navbar />

      {/* 1. HOOK — Grab attention */}
      <HeroSection />

      {/* 2. PROOF — Live numbers build instant credibility */}
      <StatsSection />

      {/* 3. SOCIAL PROOF — Brand logos */}
      <BrandsSection />

      {/* 4. WORK — Show what we deliver */}
      <PortfolioSection />
      <LatestFeed />

      {/* 5. STORY — Now context makes sense */}
      <AboutSection />
      <WhyMeSection />
      <JourneyTimeline />

      {/* 6. VALIDATION — Words from clients & press */}
      <TestimonialsSection />
      <PressSection />

      {/* 7. OFFER — Packages + interactive value */}
      <PackagesSection />
      <ROICalculator />

      {/* 8. PROCESS — How collaboration works */}
      <CollabProcess />
      <MediaKitSection />

      {/* 9. ENGAGE — Stay connected */}
      <NewsletterInline />

      {/* 10. ACTION — Book & contact */}
      <AvailabilityCalendar />
      <ContactSection />

      <Footer />
    </main>
  )
}
