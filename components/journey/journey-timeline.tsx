"use client"

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Rocket, Users, Award, TrendingUp, Zap, Crown } from 'lucide-react'

const milestones = [
  {
    year: '2020',
    title: 'The Beginning',
    description: 'Started creating tech content with a passion for making technology accessible to everyone.',
    icon: Rocket,
    color: 'bg-primary/20 text-primary border-primary/30',
    lineColor: 'from-primary',
  },
  {
    year: '2021',
    title: 'First 10K Followers',
    description: 'Hit 10,000 followers across platforms. The community started growing with genuine tech enthusiasts.',
    icon: Users,
    color: 'bg-secondary/20 text-secondary border-secondary/30',
    lineColor: 'from-secondary',
  },
  {
    year: '2022',
    title: 'First Brand Deal',
    description: 'Landed the first major brand collaboration. Started working with top tech companies in India.',
    icon: Award,
    color: 'bg-accent/20 text-accent border-accent/30',
    lineColor: 'from-accent',
  },
  {
    year: '2023',
    title: '1 Lakh Milestone',
    description: 'Crossed 1 lakh followers! Multiple viral videos and recognition from industry leaders.',
    icon: TrendingUp,
    color: 'bg-primary/20 text-primary border-primary/30',
    lineColor: 'from-primary',
  },
  {
    year: '2024',
    title: 'Viral Moment',
    description: 'Content went massively viral with 50M+ total views. Became a go-to creator for tech brands.',
    icon: Zap,
    color: 'bg-secondary/20 text-secondary border-secondary/30',
    lineColor: 'from-secondary',
  },
  {
    year: '2025',
    title: 'Today & Beyond',
    description: 'Leading tech content creation in India with 500K+ community. Building the future of tech storytelling.',
    icon: Crown,
    color: 'bg-accent/20 text-accent border-accent/30',
    lineColor: 'from-accent',
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
                key={milestone.year}
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
                    <span className="text-xs font-mono text-primary tracking-wider">{milestone.year}</span>
                    <h3 className="text-lg font-bold mt-1 mb-2 text-foreground">{milestone.title}</h3>
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
