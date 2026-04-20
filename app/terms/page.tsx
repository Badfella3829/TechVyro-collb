import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service — TechVyro',
  description: 'The terms governing the use of TechVyro services.',
}

const LAST_UPDATED = 'April 20, 2026'
const CONTACT_EMAIL = 'techvyro@gmail.com'

export default function TermsPage() {
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
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-4xl sm:text-5xl font-bold">Terms of Service</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-12">Last updated: {LAST_UPDATED}</p>

        <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">1. Agreement</h2>
            <p>
              These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the TechVyro
              website, services, and any content or features offered. By using our services, you agree to be
              bound by these Terms. If you do not agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">2. Services Offered</h2>
            <p>
              TechVyro provides tech-focused content creation and brand collaboration services, including:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Sponsored Instagram Reels, YouTube videos, and Facebook posts</li>
              <li>Product reviews and unboxings</li>
              <li>Brand integrations and shoutouts</li>
              <li>Long-form content collaborations</li>
              <li>Multi-platform campaign packages</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">3. Inquiries &amp; Bookings</h2>
            <p>
              Submitting an inquiry through our website does not constitute a binding contract. A booking is
              confirmed only after explicit confirmation from TechVyro via email or WhatsApp. All deliverables,
              timelines, and payment terms will be agreed upon in writing for each engagement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">4. Pricing &amp; Payment</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Quoted prices are valid for 14 days unless otherwise specified.</li>
              <li>50% advance is required to lock the schedule; balance is due before publishing.</li>
              <li>All amounts are in Indian Rupees (INR) unless explicitly stated.</li>
              <li>Applicable taxes (GST) will be added where required by law.</li>
              <li>Payments are non-refundable once production has commenced.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">5. Content &amp; Creative Control</h2>
            <p>
              TechVyro retains creative control over content style, format, and presentation to maintain
              authenticity and audience engagement. Brands may provide briefs, key messages, and reasonable
              feedback. We reserve the right to decline content directions that are misleading, illegal, or
              inconsistent with our values.
            </p>
            <p>
              Up to 2 rounds of revisions are included; additional rounds may incur extra charges.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">6. Intellectual Property</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Original content created by TechVyro (videos, images, scripts) remains the property of
                TechVyro. Brands receive a license to use the content for agreed marketing purposes.
              </li>
              <li>
                Brand-supplied assets (logos, products, copy) remain the property of the brand. By providing
                them, you grant TechVyro a non-exclusive license to use them in the agreed deliverables.
              </li>
              <li>
                Unauthorised reuse, modification, or redistribution of TechVyro content is prohibited.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">7. Cancellation Policy</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Cancellations 7+ days before scheduled delivery: full refund of advance.</li>
              <li>Cancellations 3-6 days before: 50% refund of advance.</li>
              <li>Cancellations within 72 hours: no refund (production typically underway).</li>
              <li>TechVyro reserves the right to cancel any engagement that violates these Terms; advance will be refunded in such cases.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">8. Acceptable Use</h2>
            <p>You agree NOT to use our services for:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Promoting illegal products or services</li>
              <li>Misleading, deceptive, or fraudulent advertising</li>
              <li>Hate speech, harassment, or discriminatory content</li>
              <li>Adult content, gambling, or substance abuse promotion (case-by-case basis)</li>
              <li>Direct competitor disparagement</li>
              <li>Pyramid schemes, MLMs, or get-rich-quick schemes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">9. Disclaimer of Warranties</h2>
            <p>
              While we strive to deliver high-quality content and reasonable engagement, we do not guarantee
              specific views, sales, conversions, or other performance metrics. Audience response depends on
              many factors outside our control. Services are provided &ldquo;as is&rdquo; without warranties of
              any kind, express or implied.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, TechVyro&apos;s total liability for any claim arising
              from a single engagement is limited to the fees paid by the brand for that engagement. We are
              not liable for indirect, incidental, consequential, or punitive damages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">11. Indemnification</h2>
            <p>
              You agree to indemnify and hold TechVyro harmless from any claims, damages, or expenses
              (including reasonable legal fees) arising from your use of our services, your content, or your
              violation of these Terms or any third-party rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">12. Confidentiality</h2>
            <p>
              Both parties agree to keep confidential any non-public business information shared during the
              engagement. This obligation survives termination of the engagement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">13. Termination</h2>
            <p>
              Either party may terminate an engagement for material breach with 7 days&apos; written notice
              and opportunity to cure. TechVyro may terminate immediately for serious violations including
              non-payment, illegal use, or harassment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">14. Governing Law &amp; Jurisdiction</h2>
            <p>
              These Terms are governed by the laws of India. Any disputes will be subject to the exclusive
              jurisdiction of the courts of Uttarakhand, India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">15. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. Material changes will be notified via email or
              prominent website notice. Continued use of our services after changes indicates acceptance of
              the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-3">16. Contact</h2>
            <p>
              For questions about these Terms, please reach out at:
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
