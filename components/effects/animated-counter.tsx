"use client"

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useSpring, useTransform } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  duration?: number
  delay?: number
  prefix?: string
  suffix?: string
  className?: string
  formatFn?: (value: number) => string
}

export function AnimatedCounter({
  value,
  duration = 2,
  delay = 0,
  prefix = "",
  suffix = "",
  className = "",
  formatFn
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [hasAnimated, setHasAnimated] = useState(false)

  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  })

  const display = useTransform(spring, (current) => {
    if (formatFn) return formatFn(Math.floor(current))
    return Math.floor(current).toLocaleString()
  })

  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timeout = setTimeout(() => {
        spring.set(value)
        setHasAnimated(true)
      }, delay * 1000)
      return () => clearTimeout(timeout)
    }
  }, [isInView, hasAnimated, spring, value, delay])

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  )
}

// Counter with rolling digits effect
interface RollingCounterProps {
  value: number
  className?: string
}

export function RollingCounter({ value, className = "" }: RollingCounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const digits = value.toString().split('')

  return (
    <div ref={ref} className={`flex overflow-hidden ${className}`}>
      {digits.map((digit, index) => (
        <RollingDigit 
          key={index} 
          digit={parseInt(digit)} 
          delay={index * 0.1}
          animate={isInView}
        />
      ))}
    </div>
  )
}

interface RollingDigitProps {
  digit: number
  delay: number
  animate: boolean
}

function RollingDigit({ digit, delay, animate }: RollingDigitProps) {
  return (
    <div className="h-[1.2em] overflow-hidden">
      <motion.div
        initial={{ y: '-100%' }}
        animate={animate ? { y: `${-digit * 10}%` } : {}}
        transition={{
          duration: 1.5,
          delay,
          ease: [0.33, 1, 0.68, 1],
        }}
        className="flex flex-col"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <span key={num} className="h-[1.2em] flex items-center justify-center">
            {num}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// Staggered container for grid animations
interface StaggeredGridProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggeredGrid({ 
  children, 
  className = "",
  staggerDelay = 0.1 
}: StaggeredGridProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

// Staggered item for use inside StaggeredGrid
interface StaggeredItemProps {
  children: React.ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale'
}

export function StaggeredItem({ 
  children, 
  className = "",
  direction = 'up'
}: StaggeredItemProps) {
  const variants = {
    up: {
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0 },
    },
    down: {
      hidden: { opacity: 0, y: -40 },
      visible: { opacity: 1, y: 0 },
    },
    left: {
      hidden: { opacity: 0, x: 40 },
      visible: { opacity: 1, x: 0 },
    },
    right: {
      hidden: { opacity: 0, x: -40 },
      visible: { opacity: 1, x: 0 },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
  }

  return (
    <motion.div
      className={className}
      variants={variants[direction]}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  )
}

// Wave animation for grid items
interface WaveGridProps {
  children: React.ReactNode[]
  className?: string
  columns?: number
}

export function WaveGrid({ 
  children, 
  className = "",
  columns = 3 
}: WaveGridProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => {
        const row = Math.floor(index / columns)
        const col = index % columns
        const delay = (row + col) * 0.1

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{
              duration: 0.5,
              delay,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {child}
          </motion.div>
        )
      })}
    </div>
  )
}
