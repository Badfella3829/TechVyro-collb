"use client"

import { useRef, ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface FooterRevealProps {
  children: ReactNode
  className?: string
}

export function FooterReveal({ children, className = "" }: FooterRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1])
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1])
  const blur = useTransform(scrollYProgress, [0, 0.8, 1], [10, 2, 0])

  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ position: 'relative' }}>
      {/* Sticky content wrapper that reveals footer */}
      <div className="sticky bottom-0">
        <motion.div
          style={{ 
            y, 
            opacity, 
            scale,
            filter: blur.get() > 0 ? `blur(${blur.get()}px)` : 'none'
          }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}

// Alternative: Full-screen footer reveal effect
export function FooterRevealFull({ children, className = "" }: FooterRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  })

  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(100% 0 0 0)", "inset(0% 0 0 0)"]
  )
  
  const y = useTransform(scrollYProgress, [0, 1], [50, 0])

  return (
    <div ref={containerRef} className={`relative min-h-[50vh] ${className}`} style={{ position: 'relative' }}>
      <motion.div
        className="sticky bottom-0"
        style={{ 
          clipPath,
          y,
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}
