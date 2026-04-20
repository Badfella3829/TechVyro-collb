"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Props = {
  budget: number
  contentPieces: number
  estReach: number
  estEngagement: number
  estROI: number
  packageName?: string
}

export function ROIEmailForm(props: Props) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('sending')
    try {
      const res = await fetch('/api/roi-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email, name,
          budget: props.budget,
          contentPieces: props.contentPieces,
          estReach: props.estReach,
          estEngagement: props.estEngagement,
          estROI: props.estROI,
          package: props.packageName,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('sent')
        setMessage(data.message || 'Report sent! Check your inbox.')
      } else {
        setStatus('error')
        setMessage(data.error || 'Failed to send report')
      }
    } catch {
      setStatus('error')
      setMessage('Network error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="mt-3 flex items-center justify-center gap-2 text-sm text-green-500 font-medium py-3">
        <CheckCircle2 className="h-4 w-4" /> {message}
      </div>
    )
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="w-full mt-2"
        onClick={() => setOpen((o) => !o)}
      >
        <Mail className="h-4 w-4 mr-2" /> Email me this report
      </Button>
      <AnimatePresence>
        {open && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={submit}
            className="mt-3 space-y-2 overflow-hidden"
          >
            <Input placeholder="Your name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
            <Input type="email" required placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button type="submit" className="w-full" disabled={status === 'sending'}>
              {status === 'sending' ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending…</> : 'Send Report'}
            </Button>
            {status === 'error' && <p className="text-xs text-red-500">{message}</p>}
            <p className="text-[10px] text-muted-foreground text-center">
              We&apos;ll email a branded PDF-style report. No spam, ever.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </>
  )
}
