"use client"

import { useRef, ReactNode } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

interface ParallaxProps {
  children: ReactNode
  speed?: number
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
}

export function Parallax({ 
  children, 
  speed = 0.5, 
  className = "",
  direction = 'up'
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }
  
  // Calculate movement based on direction
  const yRange = direction === 'up' ? [100 * speed, -100 * speed] : 
                 direction === 'down' ? [-100 * speed, 100 * speed] : [0, 0]
  const xRange = direction === 'left' ? [100 * speed, -100 * speed] :
                 direction === 'right' ? [-100 * speed, 100 * speed] : [0, 0]

  const y = useSpring(useTransform(scrollYProgress, [0, 1], yRange), springConfig)
  const x = useSpring(useTransform(scrollYProgress, [0, 1], xRange), springConfig)

  return (
    <motion.div
      ref={ref}
      style={{ x, y, position: 'relative' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface ParallaxLayerProps {
  children: ReactNode
  depth?: number // 0 = no movement, 1 = full movement
  className?: string
}

export function ParallaxLayer({ 
  children, 
  depth = 0.5,
  className = "" 
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [50 * depth, -50 * depth])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6])

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity, position: 'relative' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Parallax background with multiple layers
interface ParallaxBackgroundProps {
  className?: string
}

export function ParallaxBackground({ className = "" }: ParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 150])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 50])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.5])

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden ${className}`} style={{ position: 'absolute' }}>
      {/* Layer 1 - Slowest */}
      <motion.div
        style={{ y: y1, opacity }}
        className="absolute inset-0"
      >
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </motion.div>
      
      {/* Layer 2 - Medium */}
      <motion.div
        style={{ y: y2 }}
        className="absolute inset-0"
      >
        <div className="absolute top-1/3 left-1/3 w-48 h-48 bg-primary/10 rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 right-1/3 w-56 h-56 bg-secondary/10 rounded-full blur-2xl" />
      </motion.div>
      
      {/* Layer 3 - Fastest */}
      <motion.div
        style={{ y: y3 }}
        className="absolute inset-0"
      >
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-accent/10 rounded-full blur-xl" />
      </motion.div>
    </div>
  )
}

// Floating elements with parallax
interface FloatingElementProps {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
}

export function FloatingElement({ 
  children, 
  delay = 0,
  duration = 4,
  className = "" 
}: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-10, 10, -10],
        rotate: [-2, 2, -2],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}
