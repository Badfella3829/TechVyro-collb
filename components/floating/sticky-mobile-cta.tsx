"use client"

import { useEffect, useState } from 'react'
import { MessageCircle, Phone, Mail } from 'lucide-react'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '916396094707'
const WA_HREF = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(
  "Hi TechVyro Team! I'd like to discuss a brand collaboration."
)}`

/**
 * Mobile-only sticky bottom CTA bar.
 * Appears after the user scrolls past the hero so it doesn't compete with
 * the primary above-the-fold CTAs.
 */
export function StickyMobileCta() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-40 sm:hidden pointer-events-none"
      aria-label="Quick contact bar"
    >
      <div className="mx-3 mb-3 pointer-events-auto">
        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-background/90 backdrop-blur-xl border border-border/60 shadow-2xl shadow-primary/10 p-2">
          <a
            href={WA_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs active:scale-95 transition-transform"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
          <a
            href="#availability"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-xs active:scale-95 transition-transform"
          >
            <Phone className="h-4 w-4" />
            Book Call
          </a>
          <a
            href="#contact"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-muted text-foreground font-semibold text-xs active:scale-95 transition-transform"
          >
            <Mail className="h-4 w-4" />
            Brief
          </a>
        </div>
      </div>
    </div>
  )
}
