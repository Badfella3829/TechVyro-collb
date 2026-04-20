import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = { title: 'Privacy Policy' }

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-2xl">
        <Link href="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-3 w-3" /> Back
        </Link>
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-xs text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

        <div className="space-y-5 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">Who we are</h2>
            <p>TechVyro is operated by Akansh Chahal. Contact: <a className="underline" href="mailto:techvyro@gmail.com">techvyro@gmail.com</a>.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">What we collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Information you submit through the contact, ROI, or newsletter forms (name, email, phone, company, message).</li>
              <li>Basic technical data like IP address and user agent for spam protection and rate limiting.</li>
              <li>Cookie preference (essential / all) so we don&apos;t ask again.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">How we use it</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To respond to your enquiry and follow up about a potential collaboration.</li>
              <li>To send the resources you requested (e.g., the media kit).</li>
              <li>To keep our service secure and prevent abuse.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">Cookies &amp; analytics</h2>
            <p>We use essential cookies (theme preference, language, cookie consent state). With your consent we also load privacy-friendly analytics. You can change your choice anytime by clearing site data.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">Third parties</h2>
            <p>We use Meta (Instagram, Facebook) and YouTube official APIs to display public stats. We send transactional emails through standard email providers. We never sell your personal data.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">Your rights</h2>
            <p>You can request access, correction, or deletion of your personal data at any time by emailing us. We will respond within 30 days as required by India&apos;s DPDP Act and GDPR (where applicable).</p>
          </section>
        </div>
      </div>
    </main>
  )
}
