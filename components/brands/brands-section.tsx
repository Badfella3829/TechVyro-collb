"use client"

import { motion } from 'framer-motion'
import { Award } from 'lucide-react'

const BRANDS = [
  'Samsung', 'OnePlus', 'Realme', 'Xiaomi', 'Vivo', 'Oppo',
  'Boat', 'Noise', 'JBL', 'Sony', 'Asus', 'Lenovo',
  'HP', 'Dell', 'Acer', 'Nothing',
]

export function BrandsSection() {
  return (
    <section id="brands" className="py-12 sm:py-16 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-3">
            <Award className="h-3.5 w-3.5" /> Trusted Collaborations
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold">
            Brands I&apos;ve Worked <span className="gradient-text">With</span>
          </h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
            From global giants to category leaders — joining hands with brands that build the future.
          </p>
        </motion.div>

        {/* Marquee scroller */}
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          <div className="flex gap-3 sm:gap-4 animate-marquee">
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <div
                key={`${brand}-${i}`}
                className="shrink-0 glass border border-border/50 hover:border-primary/40 px-5 sm:px-7 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-bold tracking-wide text-muted-foreground hover:text-foreground transition-colors"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          width: max-content;
        }
        .animate-marquee:hover { animation-play-state: paused; }
      `}</style>
    </section>
  )
}
