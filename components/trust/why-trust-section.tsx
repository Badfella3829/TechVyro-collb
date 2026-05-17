"use client"

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FileText, Users, TrendingUp, Target, Handshake, Award, Zap, Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const brandBenefits = [
  { icon: Zap, text: 'Hassle-free execution' },
  { icon: Users, text: 'Verified creator network' },
  { icon: TrendingUp, text: 'Performance-driven strategy' },
  { icon: Target, text: 'ROI-focused campaigns' },
  { icon: Shield, text: 'Scalable growth systems' },
  { icon: Award, text: 'Full-service content marketing' },
]

const creatorBenefits = [
  { icon: Handshake, text: 'Fair collaboration opportunities' },
  { icon: FileText, text: 'Paid brand deals' },
  { icon: TrendingUp, text: 'PR campaigns' },
  { icon: Users, text: 'Long-term partnerships' },
  { icon: Award, text: 'Brand exposure' },
  { icon: Target, text: 'Growth-focused strategy' },
]

export function WhyTrustSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-16 sm:py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {/* Why Brands Choose TechVyro */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Card className="glass border-accent/30 h-full">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-accent/20">
                    <FileText className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                    Why Brands Choose TechVyro
                  </h3>
                </div>
                
                <ul className="space-y-4">
                  {brandBenefits.map((benefit, index) => (
                    <motion.li
                      key={benefit.text}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Why Creators Trust TechVyro */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="glass border-primary/30 h-full">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-primary/20">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                    Why Creators Trust TechVyro
                  </h3>
                </div>
                
                <ul className="space-y-4">
                  {creatorBenefits.map((benefit, index) => (
                    <motion.li
                      key={benefit.text}
                      initial={{ opacity: 0, x: 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
