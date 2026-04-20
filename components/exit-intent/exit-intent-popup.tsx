"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, X, MessageCircle, Mail } from 'lucide-react'

const STORAGE_KEY = 'tv_exit_intent_seen'

export function ExitIntentPopup() {
  const [open, setOpen] = useState(false)
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return
    } catch {}
    const armTimer = setTimeout(() => setArmed(true), 8000)
    return () => clearTimeout(armTimer)
  }, [])

  useEffect(() => {
    if (!armed) return
    const handler = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setOpen(true)
        try { sessionStorage.setItem(STORAGE_KEY, '1') } catch {}
        document.removeEventListener('mouseout', handler)
      }
    }
    document.addEventListener('mouseout', handler)
    return () => document.removeEventListener('mouseout', handler)
  }, [armed])

  const close = () => setOpen(false)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', bounce: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-card border border-border/60 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl"
          >
            <button onClick={close} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-4">
              <Gift className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Wait! Don&apos;t leave yet 🚀</h3>
            <p className="text-muted-foreground mb-5 leading-relaxed">
              Get a <span className="text-primary font-semibold">FREE 30-min strategy call</span> with Akansh.
              Discover how TechVyro can scale your brand with proven content strategies.
            </p>
            <div className="space-y-2.5">
              <a
                href="https://wa.me/919696094707?text=Hi%20Akansh!%20I%27d%20like%20my%20free%2030-min%20strategy%20call."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                <MessageCircle className="h-4 w-4" /> Claim Free Call via WhatsApp
              </a>
              <a
                href="mailto:techvyro@gmail.com?subject=Free%20Strategy%20Call%20Request"
                className="flex items-center justify-center gap-2 w-full border border-border hover:border-primary/40 font-semibold py-3 rounded-lg transition-colors"
              >
                <Mail className="h-4 w-4" /> Email Instead
              </a>
            </div>
            <button onClick={close} className="block mx-auto mt-4 text-xs text-muted-foreground hover:text-foreground">
              No thanks, I&apos;ll pass
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
