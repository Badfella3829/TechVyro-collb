"use client"

import { useEffect, useRef, useCallback } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const pointsRef = useRef<Array<{ x: number; y: number; age: number }>>([])
  const rafRef = useRef<number>(0)
  const isMobile = useIsMobile()

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Age and filter points
    pointsRef.current = pointsRef.current
      .map(p => ({ ...p, age: p.age + 1 }))
      .filter(p => p.age < 30)

    // Draw trail
    if (pointsRef.current.length > 1) {
      for (let i = 1; i < pointsRef.current.length; i++) {
        const p = pointsRef.current[i]
        const opacity = Math.max(0, 1 - p.age / 30)
        const size = Math.max(1, 4 * (1 - p.age / 30))

        ctx.beginPath()
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
        ctx.fillStyle = `oklch(0.85 0.18 195 / ${opacity * 0.6})`
        ctx.fill()

        // Inner glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, size * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = `oklch(0.95 0.1 195 / ${opacity * 0.8})`
        ctx.fill()
      }
    }

    rafRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    if (isMobile) return

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      pointsRef.current.push({ x: e.clientX, y: e.clientY, age: 0 })
    }

    window.addEventListener('mousemove', handleMouseMove)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [isMobile, animate])

  if (isMobile) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
      aria-hidden="true"
    />
  )
}
