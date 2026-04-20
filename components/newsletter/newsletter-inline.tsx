"use client"

import { useState } from 'react'
import { Mail, Loader2, CheckCircle2, FileText } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function NewsletterInline() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [msg, setMsg] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setState('loading'); setMsg(null)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: name.trim(), source: 'newsletter' }),
      })
      const json = await res.json().catch(() => ({}))
      if (res.ok) {
        setState('success')
        setMsg(json.message || 'Subscribed!')
        setEmail(''); setName('')
      } else {
        setState('error'); setMsg(json.error || 'Could not subscribe')
      }
    } catch {
      setState('error'); setMsg('Network error')
    }
  }

  return (
    <section className="py-12 sm:py-16 px-4 border-t border-border/40">
      <div className="container mx-auto max-w-3xl">
        <div className="glass border border-primary/20 rounded-2xl p-6 sm:p-8 text-center bg-gradient-to-br from-primary/5 to-purple-500/5">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/15 text-primary mb-3">
            <FileText className="h-5 w-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold">Get the FREE TechVyro Media Kit</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto">
            Pricing, packages, deliverables &amp; audience snapshot — delivered to your inbox in 60 seconds. Plus monthly creator-economy insights.
          </p>

          {state === 'success' ? (
            <div className="mt-5 inline-flex items-center gap-2 text-sm text-green-500">
              <CheckCircle2 className="h-4 w-4" /> {msg}
            </div>
          ) : (
            <form onSubmit={submit} className="mt-5 grid sm:grid-cols-[1fr_1fr_auto] gap-2 max-w-xl mx-auto">
              <Input placeholder="Your name (optional)" value={name} onChange={(e) => setName(e.target.value)} disabled={state === 'loading'} />
              <Input type="email" placeholder="you@brand.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={state === 'loading'} />
              <Button type="submit" disabled={state === 'loading'} className="whitespace-nowrap">
                {state === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Mail className="h-4 w-4 mr-1.5" /> Get Kit</>}
              </Button>
            </form>
          )}
          {state === 'error' && msg && <p className="text-xs text-red-500 mt-2">{msg}</p>}
          <p className="text-[11px] text-muted-foreground mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  )
}
