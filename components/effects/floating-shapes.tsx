"use client"

import { motion } from 'framer-motion'
import { useEffect, useState, memo } from 'react'

// Check for reduced motion preference
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Check if device is low-powered
function isLowPowerDevice(): boolean {
  if (typeof window === 'undefined') return true
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

interface Shape {
  id: number
  type: 'circle' | 'square' | 'triangle' | 'hexagon' | 'ring'
  x: number
  y: number
  size: number
  duration: number
  delay: number
  opacity: number
  color: 'primary' | 'secondary' | 'accent'
}

function generateShapes(count: number): Shape[] {
  const types: Shape['type'][] = ['circle', 'square', 'triangle', 'hexagon', 'ring']
  const colors: Shape['color'][] = ['primary', 'secondary', 'accent']
  
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    type: types[Math.floor(Math.random() * types.length)],
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 20 + Math.random() * 60,
    duration: 15 + Math.random() * 25,
    delay: Math.random() * 5,
    opacity: 0.03 + Math.random() * 0.07,
    color: colors[Math.floor(Math.random() * colors.length)],
  }))
}

const colorMap = {
  primary: 'oklch(0.85 0.18 195)',
  secondary: 'oklch(0.65 0.25 310)',
  accent: 'oklch(0.85 0.22 130)',
}

const ShapeComponent = memo(function ShapeComponent({ shape }: { shape: Shape }) {
  const color = colorMap[shape.color]
  
  const getPath = () => {
    switch (shape.type) {
      case 'circle':
        return (
          <circle
            cx={shape.size / 2}
            cy={shape.size / 2}
            r={shape.size / 2 - 2}
            fill="none"
            stroke={color}
            strokeWidth="1"
          />
        )
      case 'square':
        return (
          <rect
            x="2"
            y="2"
            width={shape.size - 4}
            height={shape.size - 4}
            fill="none"
            stroke={color}
            strokeWidth="1"
            rx="4"
          />
        )
      case 'triangle':
        const h = shape.size
        const w = shape.size
        return (
          <polygon
            points={`${w/2},2 ${w-2},${h-2} 2,${h-2}`}
            fill="none"
            stroke={color}
            strokeWidth="1"
          />
        )
      case 'hexagon':
        const s = shape.size / 2
        const points = Array.from({ length: 6 }, (_, i) => {
          const angle = (i * 60 - 30) * Math.PI / 180
          return `${s + (s - 2) * Math.cos(angle)},${s + (s - 2) * Math.sin(angle)}`
        }).join(' ')
        return (
          <polygon
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="1"
          />
        )
      case 'ring':
        return (
          <>
            <circle
              cx={shape.size / 2}
              cy={shape.size / 2}
              r={shape.size / 2 - 2}
              fill="none"
              stroke={color}
              strokeWidth="1"
            />
            <circle
              cx={shape.size / 2}
              cy={shape.size / 2}
              r={shape.size / 3}
              fill="none"
              stroke={color}
              strokeWidth="1"
            />
          </>
        )
    }
  }
  
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${shape.x}%`,
        top: `${shape.y}%`,
        opacity: shape.opacity,
      }}
      animate={{
        y: [0, -30, 0, 30, 0],
        x: [0, 20, 0, -20, 0],
        rotate: [0, 90, 180, 270, 360],
        scale: [1, 1.1, 1, 0.9, 1],
      }}
      transition={{
        duration: shape.duration,
        delay: shape.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        width={shape.size}
        height={shape.size}
        viewBox={`0 0 ${shape.size} ${shape.size}`}
        className="drop-shadow-sm"
      >
        {getPath()}
      </svg>
    </motion.div>
  )
})

export function FloatingShapes({ count = 12 }: { count?: number }) {
  const [shapes, setShapes] = useState<Shape[]>([])
  const [mounted, setMounted] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    // Skip on low-power devices or reduced motion preference
    if (isLowPowerDevice() || prefersReducedMotion()) {
      setShouldRender(false)
      return
    }
    setShouldRender(true)
    // Reduce shape count on mobile
    const actualCount = window.innerWidth < 768 ? Math.floor(count / 2) : count
    setShapes(generateShapes(actualCount))
  }, [count])
  
  if (!mounted || !shouldRender) return null
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {shapes.map((shape) => (
        <ShapeComponent key={shape.id} shape={shape} />
      ))}
    </div>
  )
}

// Gradient blob variant - optimized for performance
export function FloatingBlobs() {
  const [mounted, setMounted] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    // Skip on low-power devices - blurs are expensive
    if (isLowPowerDevice() || prefersReducedMotion()) {
      setShouldRender(false)
      return
    }
    setShouldRender(true)
  }, [])
  
  if (!mounted || !shouldRender) return null
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Large cyan blob */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.04]"
        style={{
          background: 'radial-gradient(circle, oklch(0.85 0.18 195) 0%, transparent 70%)',
          left: '10%',
          top: '20%',
        }}
        animate={{
          x: [0, 100, 0, -50, 0],
          y: [0, 50, 100, 50, 0],
          scale: [1, 1.2, 1, 0.8, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Medium magenta blob */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.05]"
        style={{
          background: 'radial-gradient(circle, oklch(0.65 0.25 310) 0%, transparent 70%)',
          right: '15%',
          top: '40%',
        }}
        animate={{
          x: [0, -80, 0, 60, 0],
          y: [0, -60, 0, 80, 0],
          scale: [1, 0.9, 1.1, 1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      
      {/* Small lime blob */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full blur-[80px] opacity-[0.04]"
        style={{
          background: 'radial-gradient(circle, oklch(0.85 0.22 130) 0%, transparent 70%)',
          left: '50%',
          bottom: '20%',
        }}
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -40, 60, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />
      
      {/* Extra subtle blob for depth */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[150px] opacity-[0.02]"
        style={{
          background: 'radial-gradient(circle, oklch(0.85 0.18 195) 0%, oklch(0.65 0.25 310) 50%, transparent 70%)',
          right: '5%',
          bottom: '10%',
        }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  )
}
