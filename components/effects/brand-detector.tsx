"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Smartphone, ShoppingBag, Gamepad2, GraduationCap, Sparkles } from 'lucide-react'

const brandTypes = [
  { id: 'tech', label: 'Tech / Gadgets', icon: Smartphone, color: 'bg-primary/20 text-primary border-primary/30 hover:bg-primary/30' },
  { id: 'ecommerce', label: 'E-commerce / D2C', icon: ShoppingBag, color: 'bg-secondary/20 text-secondary border-secondary/30 hover:bg-secondary/30' },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2, color: 'bg-accent/20 text-accent border-accent/30 hover:bg-accent/30' },
  { id: 'education', label: 'EdTech / Courses', icon: GraduationCap, color: 'bg-primary/20 text-primary border-primary/30 hover:bg-primary/30' },
  { id: 'other', label: 'Other', icon: Sparkles, color: 'bg-secondary/20 text-secondary border-secondary/30 hover:bg-secondary/30' },
]

export function BrandDetector() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    // Check if user already interacted this session
    const interacted = sessionStorage.getItem('tv-brand-detected')
    if (!interacted) {
      const timer = setTimeout(() => setIsVisible(true), 3000)
      return () => clearTimeout(timer)
    } else {
      setHasInteracted(true)
    }
  }, [])

  const handleSelect = (brandType: string) => {
    sessionStorage.setItem('tv-brand-detected', brandType)
    setHasInteracted(true)
    // Short delay for exit animation
    setTimeout(() => setIsVisible(false), 300)
  }

  const handleDismiss = () => {
    sessionStorage.setItem('tv-brand-detected', 'skipped')
    setHasInteracted(true)
    setIsVisible(false)
  }

  if (hasInteracted) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={handleDismiss}
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative glass rounded-2xl border border-border/50 p-8 max-w-md w-full"
          >
            {/* Close */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip
            </button>

            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-background">
                <Image
                  src="/images/techvyro-icon.jpg"
                  alt="TechVyro"
                  fill
                  sizes="64px"
                  className="object-contain"
                />
              </div>
            </div>

            <h3 className="text-xl font-bold text-center mb-2">
              Welcome to <span className="gradient-text">TechVyro</span>
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-6">
              What best describes your brand? This helps me show you the most relevant work.
            </p>

            {/* Options */}
            <div className="space-y-2">
              {brandTypes.map((type, index) => (
                <motion.button
                  key={type.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.08 }}
                  onClick={() => handleSelect(type.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${type.color}`}
                >
                  <type.icon className="h-5 w-5 shrink-0" />
                  <span className="text-sm font-medium">{type.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
