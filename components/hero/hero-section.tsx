"use client"

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronDown, Play, Zap, TrendingUp, Award, Instagram, Youtube, Facebook, Linkedin, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ParticleField } from './particle-field'
import { useCombinedStats, formatBig } from '@/hooks/use-combined-stats'

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
  initial: { opacity: 0.4, scale: 1 },
  animate: {
    opacity: [0.4, 0.8, 0.4],
    scale: [1, 1.1, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
}

const floatingVariants = {
  initial: { y: 0 },
  animate: {
    y: [-8, 8, -8],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

const fadeUpItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { totals, ready } = useCombinedStats()

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24 pb-12">
      {/* Grid pattern background */}
      <div className="absolute inset-0 grid-pattern-subtle opacity-40" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      
      {/* 3D Particle Background */}
      <ParticleField />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          {/* Availability pill — reference inspired */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2.5 mb-8 px-4 py-2 rounded-full border border-gold/50 bg-gradient-to-r from-gold/15 to-gold/5 text-gold text-xs sm:text-sm font-semibold tracking-wide uppercase shadow-md shadow-gold/20 hover:shadow-lg hover:shadow-gold/30 transition-shadow duration-300"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-gold opacity-75 animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold" />
            </span>
            Available for Collaborations
          </motion.div>

          {/* Logo with gold corner-bracket frame + floating badges */}
          <motion.div 
            variants={floatingVariants}
            initial="initial"
            animate="animate"
            className="corner-frame relative w-36 h-36 sm:w-44 sm:h-44 mx-auto mb-6"
          >
            <Image
              src="/images/techvyro-logo-new.jpg"
              alt="TechVyro Brand Logo"
              fill
              sizes="(max-width: 640px) 144px, 176px"
              className="object-contain"
              priority
            />
            {/* Glow effect behind logo */}
            <motion.div
              variants={glowVariants}
              initial="initial"
              animate="animate"
              className="absolute inset-0 -z-10 bg-primary/30 blur-3xl rounded-full scale-150"
            />
            {/* Secondary glow */}
            <motion.div
              animate={{
                opacity: [0.2, 0.5, 0.2],
                scale: [1.2, 1.4, 1.2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute inset-0 -z-20 bg-gold/20 blur-[60px] rounded-full scale-150"
            />

            {/* Floating badge — top right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, type: 'spring', stiffness: 200 }}
              className="absolute -top-3 -right-10 sm:-right-16 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg glass border-gold/30 text-gold text-[11px] sm:text-xs font-semibold shadow-lg"
            >
              <TrendingUp className="h-3.5 w-3.5" />
              850K+ Reach
            </motion.div>

            {/* Floating badge — bottom left */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, type: 'spring', stiffness: 200 }}
              className="absolute -bottom-3 -left-10 sm:-left-16 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg glass border-primary/30 text-primary text-[11px] sm:text-xs font-semibold shadow-lg"
            >
              <Award className="h-3.5 w-3.5" />
              200+ Projects
            </motion.div>
          </motion.div>
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
          className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-foreground/90 mb-2 max-w-2xl mx-auto"
        >
          India&apos;s Premier Tech Content Creator
        </motion.p>
        
        <motion.p
          custom={3}
          variants={textVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="text-base sm:text-lg text-gold font-medium tracking-wide mb-6"
        >
          Creating Content That Converts
        </motion.p>

        {/* Skill / content pills — reference inspired */}
        <motion.div
          custom={3.5}
          variants={textVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-10 px-4 sm:px-0"
        >
          {['Tech Reviews', 'Unboxings', 'Brand Collabs', 'Tutorials', 'Shorts & Reels'].map((skill) => (
            <motion.span
              key={skill}
              whileHover={{ scale: 1.05, borderColor: 'rgba(217, 119, 6, 0.8)' }}
              className="px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border border-gold/40 bg-gradient-to-r from-gold/10 to-gold/5 text-foreground/90 hover:text-gold transition-all duration-300 cursor-default shadow-sm hover:shadow-md hover:shadow-gold/20"
            >
              {skill}
            </motion.span>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          custom={4}
          variants={textVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12 sm:mb-16 px-4 sm:px-0"
        >
          <Button
            size="lg"
            onClick={() => scrollToSection('contact')}
            className="group relative overflow-hidden gold-gradient-bg hover:opacity-90 text-background px-7 sm:px-10 py-6 sm:py-7 text-base sm:text-lg font-semibold neon-glow-gold w-full sm:w-auto transition-all duration-300"
          >
            <Zap className="mr-2.5 h-5 w-5" />
            Let&apos;s Collab
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => scrollToSection('portfolio')}
            className="group border-gold/60 text-gold hover:bg-gold hover:text-background px-7 sm:px-10 py-6 sm:py-7 text-base sm:text-lg font-semibold w-full sm:w-auto transition-all duration-300"
          >
            <Play className="mr-2.5 h-5 w-5" />
            View My Work
          </Button>
        </motion.div>

        {/* Social icons row — reference inspired */}
        <motion.div
          custom={4.5}
          variants={textVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="flex items-center justify-center gap-3 mb-10 sm:mb-12"
        >
          <span className="text-xs uppercase tracking-widest text-muted-foreground mr-1">Follow</span>
          {[
            { Icon: Instagram, href: 'https://instagram.com/techvyro', label: 'Instagram' },
            { Icon: Youtube, href: 'https://youtube.com/@techvyro', label: 'YouTube' },
            { Icon: Facebook, href: 'https://facebook.com/techvyro', label: 'Facebook' },
            { Icon: Linkedin, href: 'https://linkedin.com/in/techvyro', label: 'LinkedIn' },
            { Icon: MessageCircle, href: 'https://wa.me/916396094707', label: 'WhatsApp' },
          ].map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-gold/30 bg-gold/5 text-foreground/70 hover:text-gold hover:border-gold/60 hover:bg-gold/10 transition-colors"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </motion.div>

        {/* Stats preview */}
        <motion.div
          custom={5}
          variants={textVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="grid grid-cols-3 gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-6 lg:gap-10 w-full max-w-md sm:max-w-none mx-auto px-4 sm:px-0"
        >
          {[
            { value: ready ? formatBig(totals.followers) : '27K+', label: 'Followers' },
            { value: ready ? formatBig(totals.totalViews) : '2M+', label: 'Views' },
            { value: ready ? formatBig(totals.content) : '200+', label: 'Posts' },
          ].map((stat, index) => (
            <motion.div 
              key={index} 
              className="text-center px-4 py-3 rounded-xl glass-soft"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gold">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
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

      {/* Side decorations — desktop only */}
      <div className="hidden sm:block absolute top-1/4 left-8 w-px h-32 bg-gradient-to-b from-transparent via-gold to-transparent opacity-50" />
      <div className="hidden sm:block absolute top-1/4 right-8 w-px h-32 bg-gradient-to-b from-transparent via-gold to-transparent opacity-50" />
    </section>
  )
}
