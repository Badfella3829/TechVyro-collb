"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, HelpCircle } from 'lucide-react'

const FAQS = [
  {
    q: 'What kinds of brands do you work with?',
    a: 'Tech-first brands — gadgets, SaaS, AI tools, EdTech, mobile accessories, smart home, and FinTech apps. If your product is tech-related and your target audience is Gen-Z and Millennials, we are the perfect fit.',
  },
  {
    q: 'How does pricing work? Are there any hidden costs?',
    a: 'Completely transparent. We offer 3 packages (Starter / Growth / Enterprise) with fixed pricing and no hidden costs. Our ROI Calculator lets you estimate projected returns yourself. For custom briefs, you receive a quote within 24 hours.',
  },
  {
    q: 'What is the turnaround time for content?',
    a: 'Standard delivery is 48–72 hours from an approved brief. Reels and Shorts: 24–48 hours. Long-form YouTube videos: 5–7 days. Rush delivery is available for urgent campaigns (additional charge applies).',
  },
  {
    q: 'Do you offer white-label or ghostwriting services?',
    a: 'Yes — both white-label and unattributed content are available for brand campaigns. A clear NDA and content rights contract is signed upfront.',
  },
  {
    q: 'Do you offer a performance guarantee?',
    a: 'We offer a minimum reach guarantee (varies by package) and share our track record on engagement rate and conversion lift. Our brand campaigns have achieved an industry-leading 18% average conversion lift.',
  },
  {
    q: 'What are the payment terms?',
    a: '50% advance on brief approval, 50% on delivery. We accept UPI, Bank Transfer, and Razorpay. For international clients we use Wise or Stripe. GST invoices are provided.',
  },
  {
    q: 'Who owns the content rights?',
    a: 'For brand collaborations, the brand receives full usage rights — paid ads, organic posts, your website, anywhere you need. Originality and IP may remain with us depending on the contract.',
  },
  {
    q: 'How do I start my first collaboration?',
    a: 'Very simple — fill out the "Send a Brief" form below, or message us on WhatsApp at +91 63960 94707. We will schedule a discovery call within 24 hours — free and no commitment.',
  },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-16 sm:py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <HelpCircle className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary tracking-wide">FREQUENTLY ASKED</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
            Got <span className="gradient-text">Questions?</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Everything you wanted to know — clear, straightforward answers. Anything else? Just send us a WhatsApp message.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, idx) => {
            const isOpen = openIndex === idx
            return (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`glass border rounded-xl overflow-hidden transition-colors ${
                  isOpen ? 'border-primary/40' : 'border-border/50 hover:border-border'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-base sm:text-lg flex-1">{item.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`shrink-0 flex h-8 w-8 items-center justify-center rounded-full ${
                      isOpen ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 -mt-1 text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            Have another question?{' '}
            <a
              href="https://wa.me/916396094707?text=Hi%20TechVyro%20Team!%20I%20have%20a%20question."
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold hover:underline"
            >
              Ask on WhatsApp →
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
