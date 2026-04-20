import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy — TechVyro',
  description: 'How TechVyro collects, uses, and protects your information.',
}

const LAST_UPDATED = 'April 20, 2026'
const CONTACT_EMAIL = 'techvyro@gmail.com'

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <div className="flex items-center gap-3 mb-3">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-4xl sm:text-5xl font-bold">Privacy Policy</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-12">Last updated: {LAST_UPDATED}</p>

        <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">1. Introduction</h2>
            <p>
              TechVyro (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) operates the website at this domain
              and provides tech-focused content creation, brand collaboration, and digital marketing services.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
              you visit our website or engage with our services.
            </p>
            <p>
              By using our website or submitting an inquiry, you agree to the collection and use of information
              in accordance with this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">2. Information We Collect</h2>
            <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">2.1 Information you provide</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Brand name and contact person&apos;s name</li>
              <li>Work email address</li>
              <li>WhatsApp / phone number</li>
              <li>Website or social media handles</li>
              <li>Campaign goals, collaboration type, deliverables, budget, timeline, and brief</li>
              <li>Any additional content you voluntarily share with us</li>
            </ul>

            <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">2.2 Automatically collected</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Approximate location based on IP address</li>
              <li>Pages visited and time spent</li>
              <li>Referrer URLs</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To respond to your collaboration inquiries and bookings</li>
              <li>To send transactional notifications (email and WhatsApp) about your booking status</li>
              <li>To schedule and deliver agreed services</li>
              <li>To improve our website and service offerings</li>
              <li>To prevent fraud, abuse, and security incidents</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">4. WhatsApp Business Communication</h2>
            <p>
              When you submit an inquiry, we may contact you via WhatsApp using the WhatsApp Business Platform
              to confirm bookings and share updates. By providing your WhatsApp number, you consent to receive
              transactional messages from us. You can opt out at any time by replying &ldquo;STOP&rdquo;.
            </p>
            <p>
              We do not send marketing or promotional WhatsApp messages without explicit prior consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">5. Data Sharing &amp; Third Parties</h2>
            <p>We do not sell your personal data. We may share information with:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong className="text-foreground">Service providers</strong> (e.g. Meta WhatsApp Business
                Platform, hosting providers) who process data on our behalf under strict confidentiality
              </li>
              <li>
                <strong className="text-foreground">Legal authorities</strong> when required by law, court
                order, or to protect our legal rights
              </li>
              <li>
                <strong className="text-foreground">Successor entities</strong> in the event of a merger,
                acquisition, or asset sale
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">6. Data Retention</h2>
            <p>
              We retain inquiry and booking data for as long as necessary to provide our services and comply
              with legal obligations (typically up to 3 years from the last interaction). You may request
              earlier deletion at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data (subject to legal retention requirements)</li>
              <li>Opt out of WhatsApp communications</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, email us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">8. Cookies</h2>
            <p>
              We use essential cookies to operate the website and analytics cookies (where consented) to
              understand usage patterns. You can disable cookies in your browser settings; some features may
              not work as expected.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">9. Security</h2>
            <p>
              We implement industry-standard security measures including encryption in transit (HTTPS),
              access controls, and secure secret storage. No method of transmission over the internet is 100%
              secure; we cannot guarantee absolute security but follow best practices to minimise risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">10. Children&apos;s Privacy</h2>
            <p>
              Our services are not directed to individuals under 18. We do not knowingly collect data from
              children. If you believe a child has provided us information, contact us and we will delete it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">11. International Users</h2>
            <p>
              Our services are operated from India. If you access them from outside India, your data may be
              transferred to and processed in India, where data-protection laws may differ from those in your
              country.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The latest version will always be available
              on this page with the updated &ldquo;Last updated&rdquo; date. Material changes will be notified
              via email or prominent website notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">13. Contact Us</h2>
            <p>
              For questions about this Privacy Policy or our data practices, contact us at:
            </p>
            <p className="mt-2">
              <strong className="text-foreground">TechVyro</strong>
              <br />
              Email:{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">
                {CONTACT_EMAIL}
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
