"use client"

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronDown, Play, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ParticleField } from './particle-field'

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

const glowVariants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
}

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Particle Background */}
      <ParticleField />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          {/* Logo */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-6">
            <Image
              src="/images/techvyro-logo.jpg"
              alt="TechVyro Logo"
              fill
              className="object-contain rounded-2xl"
              priority
            />
            {/* Glow effect behind logo */}
            <motion.div
              variants={glowVariants}
              initial="initial"
              animate="animate"
              className="absolute inset-0 -z-10 bg-primary/30 blur-3xl rounded-full scale-150"
            />
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          custom={1}
          variants={textVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-4"
        >
          <span className="gradient-text">TechVyro</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          custom={2}
          variants={textVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-2 max-w-2xl mx-auto"
        >
          India&apos;s Premier Tech Content Creator
        </motion.p>
        
        <motion.p
          custom={3}
          variants={textVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="text-base sm:text-lg text-primary font-medium mb-8"
        >
          Creating Content That Converts
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          custom={4}
          variants={textVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Button
            size="lg"
            onClick={() => scrollToSection('contact')}
            className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold neon-glow-cyan"
          >
            <Zap className="mr-2 h-5 w-5" />
            Let&apos;s Collab
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => scrollToSection('portfolio')}
            className="group border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground px-8 py-6 text-lg font-semibold"
          >
            <Play className="mr-2 h-5 w-5" />
            View My Work
          </Button>
        </motion.div>

        {/* Stats preview */}
        <motion.div
          custom={5}
          variants={textVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="flex flex-wrap items-center justify-center gap-8 sm:gap-12"
        >
          {[
            { value: '500K+', label: 'Followers' },
            { value: '100+', label: 'Brand Collabs' },
            { value: '50M+', label: 'Total Views' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        ref={scrollRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.button
          onClick={() => scrollToSection('about')}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors"
        >
          <span className="text-xs mb-2 uppercase tracking-widest">Scroll</span>
          <ChevronDown className="h-6 w-6" />
        </motion.button>
      </motion.div>

      {/* Side decorations */}
      <div className="absolute top-1/4 left-4 sm:left-8 w-px h-32 bg-gradient-to-b from-transparent via-primary to-transparent opacity-50" />
      <div className="absolute top-1/4 right-4 sm:right-8 w-px h-32 bg-gradient-to-b from-transparent via-secondary to-transparent opacity-50" />
    </section>
  )
}
