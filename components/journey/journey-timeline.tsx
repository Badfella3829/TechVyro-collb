"use client"

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Rocket, Users, Instagram, Facebook, Youtube, Crown } from 'lucide-react'

const milestones = [
  {
    title: 'The Beginning',
    description: 'Started TechVyro with a passion for making tech, AI tools, blogging and online earning accessible in simple Hinglish content.',
    icon: Rocket,
    color: 'bg-primary/20 text-primary border-primary/30',
  },
  {
    title: 'Building the Community',
    description: 'Started publishing consistent practical tutorials — Computer tips, mobile tricks, and beginner-friendly tech content.',
    icon: Users,
    color: 'bg-secondary/20 text-secondary border-secondary/30',
  },
  {
    title: 'Instagram @techvyro',
    description: 'Grew the Instagram presence with daily reels covering AI tools, ChatGPT, Canva, and digital skills.',
    icon: Instagram,
    color: 'bg-pink-500/20 text-pink-500 border-pink-500/30',
  },
  {
    title: 'Facebook Expansion',
    description: 'Launched the Facebook page to reach a wider Hindi-speaking audience with reels and tech updates.',
    icon: Facebook,
    color: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
  },
  {
    title: 'YouTube @techvyro',
    description: 'Built the YouTube channel with detailed long-form tutorials and Shorts on tech, freelancing, and online income.',
    icon: Youtube,
    color: 'bg-red-500/20 text-red-500 border-red-500/30',
  },
  {
    title: 'Today & Beyond',
    description: 'Continuing to publish 100% practical content across Instagram, Facebook & YouTube — helping people learn and earn online.',
    icon: Crown,
    color: 'bg-accent/20 text-accent border-accent/30',
  },
]

export function JourneyTimeline() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="journey" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-wider uppercase">
            Creator Journey
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 mb-4">
            The
            <span className="gradient-text"> TechVyro Story</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From passion project to India&apos;s leading tech content creator - every milestone
            tells a story of growth and dedication.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Center line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-accent md:-translate-x-px" />

          {milestones.map((milestone, index) => {
            const isLeft = index % 2 === 0

            return (
              <motion.div
                key={milestone.title}
                initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`relative flex items-start gap-8 mb-12 last:mb-0 ${
                  isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Content card - desktop adjustments */}
                <div className={`flex-1 ml-12 md:ml-0 ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                  <div className={`glass p-6 rounded-xl border border-border/50 hover:border-primary/30 transition-colors inline-block ${isLeft ? 'md:ml-auto' : ''}`}>
                    <h3 className="text-lg font-bold mb-2 text-foreground">{milestone.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{milestone.description}</p>
                  </div>
                </div>

                {/* Center node */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: index * 0.15 + 0.2, type: "spring" }}
                    className={`w-10 h-10 rounded-full border-2 ${milestone.color} flex items-center justify-center bg-background`}
                  >
                    <milestone.icon className="h-4 w-4" />
                  </motion.div>
                </div>

                {/* Spacer for the other side */}
                <div className="hidden md:block flex-1" />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
