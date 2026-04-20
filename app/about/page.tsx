import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/navigation/navbar'
import { AboutSection } from '@/components/about/about-section'
import { JourneyTimeline } from '@/components/journey/journey-timeline'
import { WhyMeSection } from '@/components/why-me/why-me-section'
import { Footer } from '@/components/footer/footer'
import { ClientEffects } from '@/components/effects/client-effects'
import { Button } from '@/components/ui/button'
import { ArrowRight, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About TechVyro — India\'s Premier Tech Content Studio',
  description:
    'Learn about TechVyro: the team, mission, and journey behind India\'s fastest-growing tech content brand. 14K+ community, 8.45M+ views, 50+ brand partners.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About TechVyro',
    description: 'India\'s Premier Tech Content Studio — built different, engineered for ROI.',
    url: '/about',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <main className="relative min-h-screen">
      <ClientEffects />
      <Navbar />

      {/* Page header */}
      <section className="relative pt-32 pb-12 sm:pt-40 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-[10px] sm:text-xs tracking-[0.3em] font-bold text-primary uppercase mb-3">
            About Us
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
            We build <span className="gradient-text">tech content</span><br />
            that actually converts.
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            TechVyro is India&apos;s premier tech content studio — fusing creator-grade storytelling with
            agency-grade strategy to scale tech brands across YouTube, Instagram &amp; Facebook.
          </p>
        </div>
      </section>

      {/* Existing About content */}
      <AboutSection />
      <WhyMeSection />
      <JourneyTimeline />

      {/* CTA strip */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center glass border border-border/50 rounded-2xl p-10 sm:p-14 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Ready to grow with TechVyro?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Whether you&apos;re launching a product or scaling a campaign — we&apos;re your content engine.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-secondary text-white">
                <Link href="/#packages">
                  See Packages <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/#contact">
                  <MessageCircle className="h-4 w-4 mr-2" /> Send a Brief
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
