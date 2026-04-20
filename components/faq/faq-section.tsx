"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, HelpCircle } from 'lucide-react'

const FAQS = [
  {
    q: 'Aap kis tarah ke brands ke saath kaam karte ho?',
    a: 'Tech-first brands — gadgets, SaaS, AI tools, EdTech, mobile accessories, smart home, FinTech apps. Agar product tech-related hai aur target audience Gen-Z + Millennials hai, hum perfect fit hain.',
  },
  {
    q: 'Pricing kaise kaam karti hai? Hidden costs to nahi?',
    a: 'Bilkul transparent. 3 packages hain (Starter / Growth / Enterprise) — fixed pricing, no hidden costs. ROI Calculator se aap khud projected return calculate kar sakte ho. Custom briefs ke liye quote 24hr mein milta hai.',
  },
  {
    q: 'Turnaround time kya hai content ka?',
    a: 'Standard delivery 48-72 hours from approved brief. Reels/Shorts: 24-48hr. Long-form YouTube videos: 5-7 days. Urgent campaigns ke liye rush delivery available (additional charge).',
  },
  {
    q: 'Kya aap white-label / ghostwriting karte ho?',
    a: 'Haan, brand campaigns ke liye white-label content aur unattributed content dono available hain. NDA + content rights ka clear contract hota hai upfront.',
  },
  {
    q: 'Performance guarantee milti hai?',
    a: 'Hum minimum reach guarantee dete hain (package ke hisaab se). Engagement rate aur conversion lift par track-record share karte hain. Industry mein 18% avg conversion lift achieve kiya hai brand campaigns mein.',
  },
  {
    q: 'Payment terms kya hain?',
    a: '50% advance on brief approval, 50% on delivery. UPI, Bank Transfer, Razorpay accept karte hain. International clients ke liye Wise / Stripe. GST invoice provide karte hain.',
  },
  {
    q: 'Content rights kiske paas rehte hain?',
    a: 'Brand collaborations mein full usage rights aap (brand) ko milte hain — paid ads, organic posts, website, sab jagah use kar sakte ho. Originality + IP humare paas reh sakti hai depending on contract.',
  },
  {
    q: 'Pehli baar collab kaise start karein?',
    a: 'Bahut simple — niche "Send a Brief" form fill karein ya WhatsApp +91 63960 94707 par message karein. Hum 24hr mein discovery call schedule kar denge — free, no commitment.',
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
            Sab kuch jo aapko poochna tha — saaf-saaf jawaab. Aur kuch hai? Bas WhatsApp karo.
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
            Aur question hai?{' '}
            <a
              href="https://wa.me/916396094707?text=Hi%20TechVyro%20Team!%20I%20have%20a%20question."
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold hover:underline"
            >
              WhatsApp pe poocho →
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
