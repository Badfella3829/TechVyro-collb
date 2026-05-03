"use client"

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface SpotlightProps {
  size?: number
  color?: string
  intensity?: number
}

export function Spotlight({ 
  size = 400, 
  color = "cyan",
  intensity = 0.15 
}: SpotlightProps) {
  const [isVisible, setIsVisible] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springConfig = { damping: 25, stiffness: 150 }
  const spotlightX = useSpring(mouseX, springConfig)
  const spotlightY = useSpring(mouseY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.body.addEventListener('mouseleave', handleMouseLeave)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.body.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [mouseX, mouseY, isVisible])

  const colorMap: Record<string, string> = {
    cyan: 'rgba(0, 255, 255,',
    magenta: 'rgba(255, 0, 255,',
    lime: 'rgba(0, 255, 128,',
    blue: 'rgba(59, 130, 246,',
    purple: 'rgba(168, 85, 247,',
  }

  const spotlightColor = colorMap[color] || colorMap.cyan

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 hidden md:block"
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          x: spotlightX,
          y: spotlightY,
          translateX: '-50%',
          translateY: '-50%',
          background: `radial-gradient(circle, ${spotlightColor}${intensity}) 0%, ${spotlightColor}0.05) 40%, transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />
      {/* Secondary smaller spotlight */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 0.5,
          height: size * 0.5,
          x: spotlightX,
          y: spotlightY,
          translateX: '-50%',
          translateY: '-50%',
          background: `radial-gradient(circle, ${spotlightColor}${intensity * 1.5}) 0%, transparent 60%)`,
          filter: 'blur(20px)',
        }}
      />
    </motion.div>
  )
}

// Beam effect that follows cursor with a trailing beam
export function BeamEffect() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const beamRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isVisible])

  return (
    <div 
      ref={beamRef}
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden hidden md:block"
      style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.3s' }}
    >
      {/* Vertical beam */}
      <motion.div
        className="absolute w-px h-screen"
        style={{
          left: mousePosition.x,
          background: 'linear-gradient(to bottom, transparent, rgba(0, 255, 255, 0.1), transparent)',
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Horizontal beam */}
      <motion.div
        className="absolute h-px w-screen"
        style={{
          top: mousePosition.y,
          background: 'linear-gradient(to right, transparent, rgba(0, 255, 255, 0.1), transparent)',
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
      {/* Center glow */}
      <motion.div
        className="absolute w-4 h-4 rounded-full"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
          background: 'radial-gradient(circle, rgba(0, 255, 255, 0.8), transparent)',
          boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
        }}
      />
    </div>
  )
}
