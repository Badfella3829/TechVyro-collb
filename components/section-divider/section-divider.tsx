"use client"

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

type Props = {
  label: string // e.g. "01 — PROOF"
  title: string // e.g. "Numbers That Speak"
  subtitle?: string
  variant?: 'default' | 'animated' | 'counter'
  number?: string // e.g. "01"
}

export function SectionDivider({ label, title, subtitle, variant = 'animated', number }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  })

  const lineWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])

  if (variant === 'counter') {
    return (
      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-4" style={{ position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-6"
        >
          {/* Large number */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <span className="text-7xl sm:text-8xl font-bold text-primary/10">{number || '01'}</span>
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="absolute inset-0 flex items-center justify-center text-7xl sm:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary"
            >
              {number || '01'}
            </motion.span>
          </motion.div>
          
          {/* Line and content */}
          <div className="flex-1">
            <motion.div
              className="h-px bg-gradient-to-r from-primary/60 via-secondary/40 to-transparent mb-4"
              style={{ width: lineWidth }}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="text-[10px] sm:text-xs tracking-[0.3em] font-bold text-primary uppercase mb-1">
                {label}
              </div>
              <div className="text-xl sm:text-2xl font-bold text-foreground">{title}</div>
              {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
            </motion.div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-4" style={{ position: 'relative' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4"
      >
        {/* Left animated line */}
        <div className="h-px flex-1 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-transparent via-primary/60 to-primary/40"
            initial={{ x: '-100%' }}
            animate={isInView ? { x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </div>
        
        {/* Center content with glow */}
        <motion.div 
          className="text-center relative"
          style={{ opacity }}
        >
          {/* Glow behind */}
          <motion.div
            className="absolute inset-0 bg-primary/10 blur-2xl rounded-full scale-150"
            animate={isInView ? { opacity: [0.3, 0.6, 0.3] } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Label with character animation */}
          <div className="text-[10px] sm:text-xs tracking-[0.3em] font-bold text-primary uppercase mb-1 relative">
            {label.split('').map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.03 }}
              >
                {char}
              </motion.span>
            ))}
          </div>
          
          {/* Title with word animation */}
          <div className="text-xl sm:text-2xl font-bold text-foreground relative">
            {title.split(' ').map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="inline-block mr-2"
              >
                {word}
              </motion.span>
            ))}
          </div>
          
          {subtitle && (
            <motion.div 
              className="text-xs text-muted-foreground mt-1 relative"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {subtitle}
            </motion.div>
          )}
        </motion.div>
        
        {/* Right animated line */}
        <div className="h-px flex-1 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-l from-transparent via-secondary/60 to-secondary/40"
            initial={{ x: '100%' }}
            animate={isInView ? { x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </div>
      </motion.div>
      
      {/* Decorative dots */}
      <motion.div
        className="flex justify-center gap-2 mt-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.8 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1 h-1 rounded-full bg-primary/40"
            animate={isInView ? {
              scale: [1, 1.5, 1],
              opacity: [0.4, 1, 0.4],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}
