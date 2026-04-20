import { Navbar } from '@/components/navigation/navbar'
import { HeroSection } from '@/components/hero/hero-section'
import { AboutSection } from '@/components/about/about-section'
import { StatsSection } from '@/components/stats/stats-section'
import { PackagesSection } from '@/components/packages/packages-section'
import { PortfolioSection } from '@/components/portfolio/portfolio-section'
import { ContactSection } from '@/components/contact/contact-section'
import { Footer } from '@/components/footer/footer'

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <StatsSection />
      <PackagesSection />
      <PortfolioSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
