"use client"

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

// Seeded random for consistent values
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

// Particle component for loading screen - uses seeded random for hydration consistency
function LoadingParticle({ index }: { index: number }) {
  const randomValues = useMemo(() => ({
    x: seededRandom(index * 1) * 100,
    y: seededRandom(index * 2) * 100,
    size: seededRandom(index * 3) * 4 + 2,
    duration: seededRandom(index * 4) * 3 + 2,
    delay: seededRandom(index * 5) * 2,
  }), [index])

  return (
    <motion.div
      className="absolute rounded-full bg-primary/30"
      style={{
        left: `${randomValues.x}%`,
        top: `${randomValues.y}%`,
        width: randomValues.size,
        height: randomValues.size,
      }}
      animate={{
        y: [-20, 20, -20],
        x: [-10, 10, -10],
        opacity: [0.2, 0.6, 0.2],
        scale: [1, 1.5, 1],
      }}
      transition={{
        duration: randomValues.duration,
        repeat: Infinity,
        delay: randomValues.delay,
        ease: 'easeInOut',
      }}
    />
  )
}

// Orbiting ring component
function OrbitRing({ delay, size, reverse }: { delay: number; size: number; reverse?: boolean }) {
  return (
    <motion.div
      className="absolute border border-primary/20 rounded-full"
      style={{
        width: size,
        height: size,
        left: '50%',
        top: '50%',
        marginLeft: -size / 2,
        marginTop: -size / 2,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: [0.1, 0.3, 0.1],
        rotate: reverse ? -360 : 360,
        scale: [0.95, 1.05, 0.95],
      }}
      transition={{
        opacity: { duration: 2, repeat: Infinity, delay },
        rotate: { duration: reverse ? 8 : 6, repeat: Infinity, ease: 'linear', delay: delay * 0.5 },
        scale: { duration: 3, repeat: Infinity, delay },
      }}
    >
      {/* Orbiting dot */}
      <motion.div
        className="absolute w-2 h-2 bg-primary rounded-full"
        style={{ top: -4, left: '50%', marginLeft: -4 }}
        animate={{
          boxShadow: [
            '0 0 10px var(--neon-cyan)',
            '0 0 20px var(--neon-cyan)',
            '0 0 10px var(--neon-cyan)',
          ],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </motion.div>
  )
}

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('Initializing')

  const loadingSteps = useMemo(() => [
    'Initializing',
    'Loading Assets',
    'Preparing UI',
    'Almost Ready',
    'Welcome',
  ], [])

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsLoading(false), 600)
          return 100
        }
        const newProgress = prev + Math.random() * 12 + 4
        // Update loading text based on progress
        const stepIndex = Math.min(Math.floor(newProgress / 25), loadingSteps.length - 1)
        setLoadingText(loadingSteps[stepIndex])
        return newProgress
      })
    }, 100)
    return () => clearInterval(interval)
  }, [loadingSteps])

  const particles = useMemo(() => Array.from({ length: 20 }), [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 1.2,
            filter: 'blur(10px)',
          }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background overflow-hidden"
        >
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {particles.map((_, i) => (
              <LoadingParticle key={i} index={i} />
            ))}
          </div>

          {/* Animated background grid lines */}
          <motion.div 
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.08 }}
            transition={{ duration: 1 }}
          >
            <motion.div 
              className="absolute inset-0"
              animate={{ 
                backgroundPosition: ['0px 0px', '60px 60px'],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              style={{
                backgroundImage: `
                  linear-gradient(var(--neon-cyan) 1px, transparent 1px),
                  linear-gradient(90deg, var(--neon-cyan) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px',
              }} 
            />
          </motion.div>

          {/* Radial gradient overlay */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, transparent 0%, var(--background) 70%)',
            }}
          />

          {/* Corner accents with animation */}
          <motion.div 
            initial={{ opacity: 0, x: -20, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-primary/50 rounded-tl-xl" 
          />
          <motion.div 
            initial={{ opacity: 0, x: 20, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-secondary/50 rounded-tr-xl" 
          />
          <motion.div 
            initial={{ opacity: 0, x: -20, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-secondary/50 rounded-bl-xl" 
          />
          <motion.div 
            initial={{ opacity: 0, x: 20, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-accent/50 rounded-br-xl" 
          />

          {/* Central container */}
          <div className="relative flex flex-col items-center">
            {/* Orbit rings */}
            <OrbitRing delay={0} size={180} />
            <OrbitRing delay={0.5} size={240} reverse />
            <OrbitRing delay={1} size={300} />

            {/* Logo with pulsing glow */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative mb-8 z-10"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 30px oklch(0.85 0.18 195 / 0.3), 0 0 60px oklch(0.85 0.18 195 / 0.1)',
                    '0 0 50px oklch(0.85 0.18 195 / 0.5), 0 0 100px oklch(0.85 0.18 195 / 0.2)',
                    '0 0 30px oklch(0.85 0.18 195 / 0.3), 0 0 60px oklch(0.85 0.18 195 / 0.1)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-28 h-28 rounded-2xl overflow-hidden bg-background border border-primary/20"
              >
                <Image
                  src="/images/techvyro-icon.jpg"
                  alt="TechVyro"
                  fill
                  sizes="112px"
                  className="object-contain"
                  priority
                />
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                />
              </motion.div>
            </motion.div>

            {/* Brand name reveal with character animation */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-4xl font-bold gradient-text mb-2 relative"
            >
              {'TechVyro'.split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 1 }}
              className="text-sm text-muted-foreground mb-8 tracking-widest"
            >
              TECH CONTENT CREATOR
            </motion.p>

            {/* Progress bar with glow */}
            <div className="relative w-56">
              <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div
                  className="h-full rounded-full relative"
                  style={{
                    background: 'linear-gradient(90deg, oklch(0.85 0.18 195), oklch(0.65 0.25 310), oklch(0.85 0.22 130))',
                    width: `${Math.min(progress, 100)}%`,
                  }}
                  transition={{ duration: 0.15 }}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </motion.div>
              </div>
              
              {/* Progress percentage */}
              <motion.div
                className="flex justify-between mt-3 text-xs font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <span className="text-muted-foreground">{loadingText}</span>
                <span className="text-primary">{Math.round(Math.min(progress, 100))}%</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
