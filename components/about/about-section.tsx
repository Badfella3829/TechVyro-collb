"use client"

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { Youtube, Instagram, Facebook, CheckCircle } from 'lucide-react'

const platforms = [
  { icon: Youtube, label: 'YouTube', color: 'text-red-500' },
  { icon: Instagram, label: 'Instagram', color: 'text-pink-500' },
  { icon: Facebook, label: 'Facebook', color: 'text-blue-500' },
]

const highlights = [
  'Tech Tips & Tutorials',
  'AI Tools & Automation',
  'Blogging & SEO',
  'Freelancing Guides',
  'Make Money Online',
  'Digital Skills',
]

export function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="about" className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-secondary/5 to-transparent rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* Image/Visual side */}
          <div className="relative order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative aspect-square max-w-md mx-auto"
            >
              {/* Decorative elements */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary via-secondary to-accent opacity-20 blur-2xl rounded-full" />
              
              {/* Main image container */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border glass bg-background">
                <Image
                  src="/images/techvyro-icon.jpg"
                  alt="TechVyro"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-contain"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                
                {/* Floating badge */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-6 left-6 glass px-4 py-2 rounded-full"
                >
                  <span className="text-sm font-medium text-primary">Tech Content Creator</span>
                </motion.div>
              </div>
              
              {/* Decorative corner elements */}
              <div className="absolute -top-2 -right-2 w-16 h-16 border-t-2 border-r-2 border-primary rounded-tr-2xl" />
              <div className="absolute -bottom-2 -left-2 w-16 h-16 border-b-2 border-l-2 border-secondary rounded-bl-2xl" />
            </motion.div>
          </div>
          
          {/* Content side */}
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">
                About Me
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 mb-6 text-balance">
                Turning Tech Into
                <span className="gradient-text"> Engaging Stories</span>
              </h2>
              
              <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Hey! I&apos;m the creator behind TechVyro - your go-to source for honest tech reviews, 
                  in-depth gadget analysis, and content that actually helps you make informed decisions.
                </p>
                <p>
                  With years of experience creating content for leading tech brands, I specialize in 
                  transforming complex products into compelling stories that resonate with audiences.
                </p>
              </div>
              
              {/* Platforms */}
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                  Active On
                </h3>
                <div className="flex flex-wrap gap-4">
                  {platforms.map((platform, index) => (
                    <motion.div
                      key={platform.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      className="flex items-center gap-2 glass px-4 py-2 rounded-full"
                    >
                      <platform.icon className={`h-5 w-5 ${platform.color}`} />
                      <span className="text-sm font-medium">{platform.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Content types */}
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                  Content I Create
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {highlights.map((item, index) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
