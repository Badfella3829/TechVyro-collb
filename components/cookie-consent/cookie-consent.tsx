"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Cookie, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const KEY = 'techvyro:cookie-consent'

type Consent = 'all' | 'essential' | null

export function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY) as Consent
      if (!v) {
        const t = setTimeout(() => setShow(true), 1500)
        return () => clearTimeout(t)
      }
    } catch {
      setShow(true)
    }
  }, [])

  const decide = (v: Exclude<Consent, null>) => {
    try { localStorage.setItem(KEY, v) } catch {}
    setShow(false)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cookie-consent', { detail: v }))
    }
  }

  if (!show) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 sm:left-auto sm:right-4 sm:bottom-4 sm:max-w-md z-[60] glass border border-border/60 rounded-2xl shadow-2xl p-4 sm:p-5 animate-in slide-in-from-bottom-5"
    >
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
          <Cookie className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold mb-1">We use cookies 🍪</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Hum essential cookies use karte hain site chalane ke liye, aur optional analytics cookies content improve karne ke liye. Aap apni preference choose kar sakte hain. Read our{' '}
            <Link href="/privacy" className="underline text-foreground">privacy policy</Link>.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Button size="sm" onClick={() => decide('all')} className="h-8 text-xs">Accept all</Button>
            <Button size="sm" variant="outline" onClick={() => decide('essential')} className="h-8 text-xs">Essential only</Button>
          </div>
        </div>
        <button
          aria-label="Dismiss"
          onClick={() => decide('essential')}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
