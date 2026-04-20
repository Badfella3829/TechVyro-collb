"use client"

import { useEffect, useState } from 'react'
import { Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'

const STORAGE_KEY = 'tv_lang'

export function LangToggle() {
  const [lang, setLang] = useState<'en' | 'hi'>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as 'en' | 'hi' | null
      if (saved) {
        setLang(saved)
        document.documentElement.lang = saved
      }
    } catch {}
  }, [])

  const toggle = () => {
    const next = lang === 'en' ? 'hi' : 'en'
    setLang(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
      document.documentElement.lang = next
    } catch {}
  }

  if (!mounted) return <div className="w-9 h-9" aria-hidden />

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      aria-label="Toggle language"
      className="h-9 px-2.5 rounded-lg gap-1.5 text-xs font-semibold"
    >
      <Languages className="h-3.5 w-3.5" />
      {lang === 'en' ? 'EN' : 'हिं'}
    </Button>
  )
}
