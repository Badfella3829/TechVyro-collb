"use client"

import { motion } from 'framer-motion'
import { Newspaper, Award, Mic, Tv, Radio, Globe } from 'lucide-react'

const PUBLICATIONS = [
  { name: 'YourStory', icon: Newspaper, hint: 'Featured creator' },
  { name: 'Inc42', icon: Globe, hint: 'Tech ecosystem coverage' },
  { name: 'Gadgets360', icon: Tv, hint: 'Product reviews' },
  { name: 'Beebom', icon: Mic, hint: 'Tech commentary' },
  { name: 'Digit', icon: Award, hint: 'Featured collaborations' },
  { name: 'Smartprix', icon: Radio, hint: 'Smartphone insights' },
]

export function PressSection() {
  return (
    <section id="press" className="py-12 sm:py-16 px-4 border-t border-border/40">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-mono mb-2">Open to Coverage</p>
          <h2 className="text-2xl sm:text-3xl font-bold">Press &amp; Media Outreach</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
            Indian tech publications &amp; podcasts we&apos;re actively pitching. For media enquiries reach out to{' '}
            <a href="mailto:techvyro@gmail.com" className="text-foreground underline">techvyro@gmail.com</a>.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {PUBLICATIONS.map(({ name, icon: Icon, hint }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="glass border border-border/50 rounded-xl p-4 text-center hover:border-primary/40 transition-colors"
            >
              <Icon className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="text-sm font-semibold">{name}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{hint}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
