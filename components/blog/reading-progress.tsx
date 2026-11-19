"use client"

import { useEffect, useState } from 'react'

export function ReadingProgress({ label }: { label?: string }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) {
        setProgress(0)
        return
      }
      setProgress(Math.min(100, Math.max(0, Math.round((scrollTop / docHeight) * 100))))
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] pointer-events-none"
      role="progressbar"
      aria-label={label || 'Reading progress'}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
    >
      <div className="h-1 w-full bg-border/30">
        <div
          className="h-full bg-gradient-to-r from-primary via-secondary to-gold transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
