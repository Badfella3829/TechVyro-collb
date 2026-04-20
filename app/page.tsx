import { Navbar } from '@/components/navigation/navbar'
import { HeroSection } from '@/components/hero/hero-section'
import { AboutSection } from '@/components/about/about-section'
import { StatsSection } from '@/components/stats/stats-section'
import { JourneyTimeline } from '@/components/journey/journey-timeline'
import { PackagesSection } from '@/components/packages/packages-section'
import { PortfolioSection } from '@/components/portfolio/portfolio-section'
import { WhyMeSection } from '@/components/why-me/why-me-section'
import { TestimonialsSection } from '@/components/testimonials/testimonials-section'
import { CollabProcess } from '@/components/process/collab-process'
import { ContactSection } from '@/components/contact/contact-section'
import { Footer } from '@/components/footer/footer'
import { ClientEffects } from '@/components/effects/client-effects'

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <ClientEffects />
      <Navbar />
      <HeroSection />
      <AboutSection />
      <StatsSection />
      <JourneyTimeline />
      <PackagesSection />
      <PortfolioSection />
      <WhyMeSection />
      <TestimonialsSection />
      <CollabProcess />
      <ContactSection />
      <Footer />
    </main>
  )
}
