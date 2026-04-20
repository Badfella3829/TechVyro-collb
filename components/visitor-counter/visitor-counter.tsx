"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users } from 'lucide-react'

export function VisitorCounter() {
  const [count, setCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const base = 12 + Math.floor(Math.random() * 18)
    setCount(base)
    const interval = setInterval(() => {
      setCount((c) => Math.max(8, Math.min(45, c + (Math.random() > 0.5 ? 1 : -1))))
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5 }}
      className="fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-40 hidden sm:flex items-center gap-2 glass border border-border/60 px-3 py-2 rounded-full text-xs shadow-lg"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
      </span>
      <Users className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="font-semibold">{count}</span>
      <span className="text-muted-foreground">brands viewing</span>
    </motion.div>
  )
}
