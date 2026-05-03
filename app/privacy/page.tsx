import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'
import { Navbar } from '@/components/navigation/navbar'
import { Footer } from '@/components/footer/footer'
import { ClientEffects } from '@/components/effects/client-effects'

export const metadata = { 
  title: 'Privacy Policy | TechVyro',
  description: 'TechVyro privacy policy - how we collect, use, and protect your data.'
}

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen">
      <ClientEffects />
      <Navbar />
      
      {/* Hero Header */}
      <section className="relative pt-32 pb-8 sm:pt-40 sm:pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary tracking-wide uppercase">Legal</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </section>
      
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl">

        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <section className="glass border border-border/50 rounded-xl p-5">
            <h2 className="text-base font-semibold text-foreground mb-2">Who we are</h2>
            <p>TechVyro is operated by TechVyro Team. Contact: <a className="underline" href="mailto:techvyro@gmail.com">techvyro@gmail.com</a>.</p>
          </section>

          <section className="glass border border-border/50 rounded-xl p-5">
            <h2 className="text-base font-semibold text-foreground mb-2">What we collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Information you submit through the contact, ROI, or newsletter forms (name, email, phone, company, message).</li>
              <li>Basic technical data like IP address and user agent for spam protection and rate limiting.</li>
              <li>Cookie preference (essential / all) so we don&apos;t ask again.</li>
            </ul>
          </section>

          <section className="glass border border-border/50 rounded-xl p-5">
            <h2 className="text-base font-semibold text-foreground mb-2">How we use it</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To respond to your enquiry and follow up about a potential collaboration.</li>
              <li>To send the resources you requested (e.g., the media kit).</li>
              <li>To keep our service secure and prevent abuse.</li>
            </ul>
          </section>

          <section className="glass border border-border/50 rounded-xl p-5">
            <h2 className="text-base font-semibold text-foreground mb-2">Cookies &amp; analytics</h2>
            <p>We use essential cookies (theme preference, language, cookie consent state). With your consent we also load privacy-friendly analytics. You can change your choice anytime by clearing site data.</p>
          </section>

          <section className="glass border border-border/50 rounded-xl p-5">
            <h2 className="text-base font-semibold text-foreground mb-2">Third parties</h2>
            <p>We use Meta (Instagram, Facebook) and YouTube official APIs to display public stats. We send transactional emails through standard email providers. We never sell your personal data.</p>
          </section>

          <section className="glass border border-border/50 rounded-xl p-5">
            <h2 className="text-base font-semibold text-foreground mb-2">Your rights</h2>
            <p>You can request access, correction, or deletion of your personal data at any time by emailing us. We will respond within 30 days as required by India&apos;s DPDP Act and GDPR (where applicable).</p>
          </section>
        </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
