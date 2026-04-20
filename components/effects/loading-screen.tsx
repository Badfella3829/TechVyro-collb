"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsLoading(false), 400)
          return 100
        }
        return prev + Math.random() * 15 + 5
      })
    }, 120)
    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        >
          {/* Animated background grid lines */}
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(var(--neon-cyan) 1px, transparent 1px),
                linear-gradient(90deg, var(--neon-cyan) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }} />
          </div>

          {/* Corner accents */}
          <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-primary/50 rounded-tl-xl" />
          <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-secondary/50 rounded-tr-xl" />
          <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-secondary/50 rounded-bl-xl" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-accent/50 rounded-br-xl" />

          {/* Logo with pulsing glow */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative mb-8"
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 30px oklch(0.85 0.18 195 / 0.3), 0 0 60px oklch(0.85 0.18 195 / 0.1)',
                  '0 0 40px oklch(0.85 0.18 195 / 0.5), 0 0 80px oklch(0.85 0.18 195 / 0.2)',
                  '0 0 30px oklch(0.85 0.18 195 / 0.3), 0 0 60px oklch(0.85 0.18 195 / 0.1)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-24 h-24 rounded-2xl overflow-hidden bg-background"
            >
              <Image
                src="/images/techvyro-logo.jpg"
                alt="TechVyro"
                fill
                sizes="96px"
                className="object-cover scale-[1.45] origin-top"
                priority
              />
            </motion.div>
          </motion.div>

          {/* Brand name reveal */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl font-bold gradient-text mb-8"
          >
            TechVyro
          </motion.h1>

          {/* Progress bar */}
          <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, oklch(0.85 0.18 195), oklch(0.65 0.25 310), oklch(0.85 0.22 130))',
                width: `${Math.min(progress, 100)}%`,
              }}
              transition={{ duration: 0.2 }}
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-muted-foreground mt-4 font-mono tracking-wider"
          >
            LOADING EXPERIENCE
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
