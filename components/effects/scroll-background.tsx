"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function ScrollBackground() {
  const [scrollY, setScrollY] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number }>>([])

  useEffect(() => {
    // Generate random particles on mount
    const newParticles = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 4 + 3,
    }))
    setParticles(newParticles)

    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      setScrollY(window.scrollY)
      setScrollProgress(maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Animated gradient orbs */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full blur-xl ${
            particle.id % 2 === 0 ? 'bg-cyan-500/20' : 'bg-purple-500/20'
          }`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size * 20}px`,
            height: `${particle.size * 20}px`,
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [0.8, 1.2, 0.8],
            x: [0, Math.sin(particle.id) * 40, 0],
            y: [0, Math.cos(particle.id) * 40, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Scroll-responsive accent line */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] origin-left"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.6), transparent)',
          scaleX: scrollProgress,
        }}
      />

      {/* Geometric decoration corners */}
      <div className="fixed top-10 right-10 w-20 h-20 border border-cyan-500/10 opacity-30" />
      <div className="fixed bottom-10 left-10 w-32 h-32 border-2 border-purple-500/10 opacity-20 rounded-full" />
    </div>
  )
}
