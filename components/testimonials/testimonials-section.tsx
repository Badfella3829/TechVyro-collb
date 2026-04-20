"use client"

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const TESTIMONIALS = [
  {
    name: 'Rajesh Kumar',
    role: 'Marketing Head, Smartphone Brand',
    quote: 'TechVyro\'s unboxing video was a game-changer for our launch. 2.4M views and 18% conversion lift!',
    rating: 5,
    initial: 'RK',
  },
  {
    name: 'Priya Sharma',
    role: 'Founder, D2C Audio Brand',
    quote: 'Working with TechVyro was seamless. Professional, on-time delivery, and amazing creative ideas.',
    rating: 5,
    initial: 'PS',
  },
  {
    name: 'Vikram Mehta',
    role: 'Brand Manager, Tech Accessories',
    quote: 'Best ROI we\'ve seen from any creator. TechVyro\'s audience trusts them completely — that converts to sales.',
    rating: 5,
    initial: 'VM',
  },
  {
    name: 'Anjali Desai',
    role: 'CMO, Smart Home Brand',
    quote: 'Honest reviews, deep tech understanding, and incredible production quality. Highly recommend TechVyro!',
    rating: 5,
    initial: 'AD',
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 sm:py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary text-xs font-semibold tracking-wider uppercase">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2">
            What Brands <span className="gradient-text">Say</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
            Real feedback from brand partners who&apos;ve scaled with TechVyro.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="glass border-border/50 hover:border-primary/40 h-full transition-colors group">
                <CardContent className="p-5 sm:p-6 flex flex-col h-full">
                  <Quote className="h-6 w-6 text-primary/40 mb-3" />
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <Star key={idx} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border/30">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {t.initial}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{t.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
