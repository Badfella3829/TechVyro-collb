"use client"

import { useEffect, useRef, useCallback } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useCursorMode } from '@/hooks/use-cursor-mode'

interface Point {
  x: number
  y: number
  age: number
  vx?: number
  vy?: number
  angle?: number
}

export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const pointsRef = useRef<Point[]>([])
  const particlesRef = useRef<Point[]>([])
  const orbitalsRef = useRef<{ angle: number; distance: number; speed: number }[]>([])
  const rafRef = useRef<number>(0)
  const isMobile = useIsMobile()
  const mode = useCursorMode((s) => s.mode)

  // Initialize orbital dots
  useEffect(() => {
    orbitalsRef.current = Array.from({ length: 6 }, (_, i) => ({
      angle: (i / 6) * Math.PI * 2,
      distance: 25 + Math.random() * 10,
      speed: 0.02 + Math.random() * 0.02,
    }))
  }, [])

  const drawConstellation = useCallback((ctx: CanvasRenderingContext2D, points: Point[]) => {
    if (points.length < 2) return

    // Draw connecting lines
    ctx.strokeStyle = 'oklch(0.85 0.18 195 / 0.3)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y)
    }
    ctx.stroke()

    // Draw dots
    for (const p of points) {
      const opacity = Math.max(0, 1 - p.age / 40)
      const size = Math.max(2, 5 * (1 - p.age / 40))

      ctx.beginPath()
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
      ctx.fillStyle = `oklch(0.85 0.18 195 / ${opacity * 0.8})`
      ctx.fill()

      // Inner bright core
      ctx.beginPath()
      ctx.arc(p.x, p.y, size * 0.4, 0, Math.PI * 2)
      ctx.fillStyle = `oklch(0.98 0.05 195 / ${opacity})`
      ctx.fill()
    }
  }, [])

  const drawFountainPen = useCallback((ctx: CanvasRenderingContext2D, points: Point[]) => {
    if (points.length < 3) return

    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)

    for (let i = 1; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2
      const yc = (points[i].y + points[i + 1].y) / 2
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc)
    }

    const gradient = ctx.createLinearGradient(
      points[0].x, points[0].y,
      points[points.length - 1].x, points[points.length - 1].y
    )
    gradient.addColorStop(0, 'oklch(0.65 0.25 310 / 0)')
    gradient.addColorStop(0.5, 'oklch(0.65 0.25 310 / 0.6)')
    gradient.addColorStop(1, 'oklch(0.85 0.18 195 / 0.8)')

    ctx.strokeStyle = gradient
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
  }, [])

  const drawParticles = useCallback((ctx: CanvasRenderingContext2D, mouse: { x: number; y: number }) => {
    // Add new particles
    if (Math.random() > 0.7) {
      particlesRef.current.push({
        x: mouse.x + (Math.random() - 0.5) * 30,
        y: mouse.y + (Math.random() - 0.5) * 30,
        age: 0,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2 - 1,
      })
    }

    // Update and draw particles
    particlesRef.current = particlesRef.current
      .map(p => ({
        ...p,
        x: p.x + (p.vx || 0),
        y: p.y + (p.vy || 0),
        age: p.age + 1,
      }))
      .filter(p => p.age < 60)

    for (const p of particlesRef.current) {
      const opacity = Math.max(0, 1 - p.age / 60)
      const size = Math.max(1, 4 * (1 - p.age / 60))
      const hue = 195 + (p.age / 60) * 115 // Cyan to magenta

      ctx.beginPath()
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
      ctx.fillStyle = `oklch(0.75 0.2 ${hue} / ${opacity * 0.7})`
      ctx.fill()
    }
  }, [])

  const drawCrosshair = useCallback((ctx: CanvasRenderingContext2D, mouse: { x: number; y: number }) => {
    const size = 15
    const gap = 5
    const lineWidth = 2

    ctx.strokeStyle = 'oklch(0.85 0.18 195 / 0.9)'
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'

    // Horizontal lines
    ctx.beginPath()
    ctx.moveTo(mouse.x - size, mouse.y)
    ctx.lineTo(mouse.x - gap, mouse.y)
    ctx.moveTo(mouse.x + gap, mouse.y)
    ctx.lineTo(mouse.x + size, mouse.y)
    ctx.stroke()

    // Vertical lines
    ctx.beginPath()
    ctx.moveTo(mouse.x, mouse.y - size)
    ctx.lineTo(mouse.x, mouse.y - gap)
    ctx.moveTo(mouse.x, mouse.y + gap)
    ctx.lineTo(mouse.x, mouse.y + size)
    ctx.stroke()

    // Center dot
    ctx.beginPath()
    ctx.arc(mouse.x, mouse.y, 2, 0, Math.PI * 2)
    ctx.fillStyle = 'oklch(0.65 0.25 310 / 0.9)'
    ctx.fill()

    // Outer ring
    ctx.beginPath()
    ctx.arc(mouse.x, mouse.y, size + 3, 0, Math.PI * 2)
    ctx.strokeStyle = 'oklch(0.85 0.18 195 / 0.3)'
    ctx.lineWidth = 1
    ctx.stroke()
  }, [])

  const drawOrbital = useCallback((ctx: CanvasRenderingContext2D, mouse: { x: number; y: number }) => {
    // Update orbital angles
    orbitalsRef.current = orbitalsRef.current.map(o => ({
      ...o,
      angle: o.angle + o.speed,
    }))

    // Draw orbital trail
    ctx.strokeStyle = 'oklch(0.85 0.18 195 / 0.15)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(mouse.x, mouse.y, 25, 0, Math.PI * 2)
    ctx.stroke()

    // Draw orbiting dots
    for (let i = 0; i < orbitalsRef.current.length; i++) {
      const o = orbitalsRef.current[i]
      const x = mouse.x + Math.cos(o.angle) * o.distance
      const y = mouse.y + Math.sin(o.angle) * o.distance
      const size = 3 + Math.sin(o.angle * 2) * 1.5
      const hue = 195 + (i / orbitalsRef.current.length) * 115

      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fillStyle = `oklch(0.8 0.2 ${hue} / 0.8)`
      ctx.fill()

      // Glow
      ctx.beginPath()
      ctx.arc(x, y, size + 3, 0, Math.PI * 2)
      ctx.fillStyle = `oklch(0.8 0.2 ${hue} / 0.2)`
      ctx.fill()
    }

    // Center dot
    ctx.beginPath()
    ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2)
    ctx.fillStyle = 'oklch(0.98 0.05 195 / 0.9)'
    ctx.fill()
  }, [])

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const mouse = mouseRef.current

    switch (mode) {
      case 'constellation':
        // Age and filter points
        pointsRef.current = pointsRef.current
          .map(p => ({ ...p, age: p.age + 1 }))
          .filter(p => p.age < 40)
        drawConstellation(ctx, pointsRef.current)
        break

      case 'fountain-pen':
        pointsRef.current = pointsRef.current
          .map(p => ({ ...p, age: p.age + 1 }))
          .filter(p => p.age < 25)
        drawFountainPen(ctx, pointsRef.current)
        break

      case 'particles':
        drawParticles(ctx, mouse)
        break

      case 'crosshair':
        drawCrosshair(ctx, mouse)
        break

      case 'orbital':
        drawOrbital(ctx, mouse)
        break
    }

    rafRef.current = requestAnimationFrame(animate)
  }, [mode, drawConstellation, drawFountainPen, drawParticles, drawCrosshair, drawOrbital])

  useEffect(() => {
    if (isMobile) return
    
    // Check for reduced motion preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      
      // Add point for trail-based effects
      if (mode === 'constellation' || mode === 'fountain-pen') {
        pointsRef.current.push({ x: e.clientX, y: e.clientY, age: 0 })
      }
    }
    
    // Pause when tab is not visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current)
      } else {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      cancelAnimationFrame(rafRef.current)
    }
  }, [isMobile, mode, animate])

  if (isMobile) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
      aria-hidden="true"
    />
  )
}
