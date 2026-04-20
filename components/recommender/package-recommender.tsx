"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Step = 0 | 1 | 2 | 3 | 4
type Goal = 'awareness' | 'conversions' | 'launch' | 'longterm'
type Budget = 'low' | 'mid' | 'high' | 'enterprise'
type Industry = 'tech' | 'fintech' | 'd2c' | 'service' | 'other'
type Timeline = 'urgent' | 'normal' | 'flexible'

type Answers = { goal: Goal | null; budget: Budget | null; industry: Industry | null; timeline: Timeline | null }

const PACKAGES = {
  starter: { name: 'Starter', price: '₹16,500', pieces: 1, summary: 'Single high-impact piece. Great for product pushes & tests.' },
  growth: { name: 'Growth', price: '₹49,500', pieces: 3, summary: '3 pieces + cross-platform repost. Best ongoing value.' },
  scale: { name: 'Scale', price: '₹99,000+', pieces: 6, summary: '6+ pieces, full multi-platform campaign with reporting.' },
  custom: { name: 'Custom', price: 'Quote', pieces: 0, summary: 'Long-term ambassadorship, video series, or event coverage.' },
} as const

type PkgKey = keyof typeof PACKAGES

function recommend(a: Answers): { pkg: PkgKey; reasons: string[]; addons: string[] } {
  const reasons: string[] = []
  const addons: string[] = []
  let pkg: PkgKey = 'growth'

  if (a.budget === 'low') { pkg = 'starter'; reasons.push('Budget fit — Starter delivers fastest under ₹25K') }
  else if (a.budget === 'mid') { pkg = 'growth'; reasons.push('Mid-budget sweet spot — Growth gives best per-piece value') }
  else if (a.budget === 'high') { pkg = 'scale'; reasons.push('Budget supports a multi-piece push — Scale maximises reach') }
  else if (a.budget === 'enterprise') { pkg = 'custom'; reasons.push('Custom plan recommended for enterprise budgets') }

  if (a.goal === 'launch' && pkg === 'starter') { pkg = 'growth'; reasons.push('Launches benefit from a 3-piece sequence (teaser + hero + recap)') }
  if (a.goal === 'longterm' && pkg !== 'custom') { pkg = pkg === 'starter' ? 'growth' : pkg; reasons.push('Long-term goals work best as monthly Growth/Scale retainers') }
  if (a.goal === 'conversions') { addons.push('Add Instagram Story sequence with link sticker for direct CTR') }
  if (a.goal === 'awareness') { addons.push('Add a YouTube Short alongside the Reel for long-tail discovery') }

  if (a.industry === 'fintech') { addons.push('Add a 60-second explainer Reel — fintech needs trust-building') }
  if (a.industry === 'd2c') { addons.push('Add an unboxing-style Reel + Story poll for D2C credibility') }
  if (a.industry === 'tech') { addons.push('Add a long-form YouTube review (8–12 min) for buying-intent searches') }

  if (a.timeline === 'urgent') { addons.push('Priority slot available with 48h turnaround surcharge') }

  if (reasons.length === 0) reasons.push('Best balance of pieces, reach, and turnaround for most brands')
  return { pkg, reasons, addons }
}

const QUESTIONS = [
  {
    key: 'goal' as const,
    title: 'What is your primary goal?',
    options: [
      { v: 'awareness' as Goal, label: 'Brand awareness', hint: 'Reach new audiences' },
      { v: 'conversions' as Goal, label: 'Conversions', hint: 'Sales / signups' },
      { v: 'launch' as Goal, label: 'Product launch', hint: 'Big bang on launch day' },
      { v: 'longterm' as Goal, label: 'Long-term partnership', hint: 'Always-on presence' },
    ],
  },
  {
    key: 'budget' as const,
    title: 'What is your monthly budget?',
    options: [
      { v: 'low' as Budget, label: 'Under ₹25K', hint: 'Test the waters' },
      { v: 'mid' as Budget, label: '₹25K – ₹75K', hint: 'Most popular range' },
      { v: 'high' as Budget, label: '₹75K – ₹2L', hint: 'Multi-piece campaign' },
      { v: 'enterprise' as Budget, label: '₹2L+', hint: 'Custom retainer' },
    ],
  },
  {
    key: 'industry' as const,
    title: 'Which industry are you in?',
    options: [
      { v: 'tech' as Industry, label: 'Tech / Gadgets', hint: 'Phones, audio, accessories' },
      { v: 'fintech' as Industry, label: 'Fintech / Apps', hint: 'Payments, investing, SaaS' },
      { v: 'd2c' as Industry, label: 'D2C / Lifestyle', hint: 'Consumer brands' },
      { v: 'service' as Industry, label: 'Service / B2B', hint: 'Agencies, platforms' },
      { v: 'other' as Industry, label: 'Other', hint: 'Anything else' },
    ],
  },
  {
    key: 'timeline' as const,
    title: 'How fast do you need this live?',
    options: [
      { v: 'urgent' as Timeline, label: 'Urgent (under 7 days)', hint: 'Priority slot' },
      { v: 'normal' as Timeline, label: '2–3 weeks', hint: 'Standard timeline' },
      { v: 'flexible' as Timeline, label: 'Flexible / Ongoing', hint: 'No rush' },
    ],
  },
]

export function PackageRecommender() {
  const [step, setStep] = useState<Step>(0)
  const [answers, setAnswers] = useState<Answers>({ goal: null, budget: null, industry: null, timeline: null })

  const restart = () => { setAnswers({ goal: null, budget: null, industry: null, timeline: null }); setStep(0) }

  if (step === 4) {
    const r = recommend(answers)
    const pkg = PACKAGES[r.pkg]
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass border border-border/50 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary mb-2">
          <CheckCircle2 className="h-3 w-3" /> Recommended for you
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold">{pkg.name} Package</h3>
        <p className="text-3xl font-bold text-primary mt-1">{pkg.price}</p>
        <p className="text-sm text-muted-foreground mt-3">{pkg.summary}</p>

        <div className="mt-5">
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Why this fits</p>
          <ul className="space-y-1.5">
            {r.reasons.map((rs, i) => (
              <li key={i} className="text-sm flex items-start gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" /> {rs}</li>
            ))}
          </ul>
        </div>

        {r.addons.length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Suggested add-ons</p>
            <ul className="space-y-1.5">
              {r.addons.map((rs, i) => (
                <li key={i} className="text-sm flex items-start gap-2"><Sparkles className="h-3.5 w-3.5 text-purple-400 mt-0.5 shrink-0" /> {rs}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-6">
          <Button asChild className="flex-1 min-w-[180px]">
            <a href={`/contact?pkg=${r.pkg}`}>Start with {pkg.name} <ArrowRight className="h-4 w-4 ml-1" /></a>
          </Button>
          <Button variant="outline" onClick={restart}><RefreshCw className="h-3.5 w-3.5 mr-1" /> Try again</Button>
        </div>
      </motion.div>
    )
  }

  const q = QUESTIONS[step]
  return (
    <div className="glass border border-border/50 rounded-2xl p-6 sm:p-8">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono uppercase tracking-wider text-primary">Step {step + 1} of 4</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`h-1.5 w-6 rounded-full ${i <= step ? 'bg-primary' : 'bg-muted'}`} />
          ))}
        </div>
      </div>
      <h3 className="text-xl sm:text-2xl font-bold mb-5">{q.title}</h3>
      <AnimatePresence mode="wait">
        <motion.div key={q.key} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} className="grid sm:grid-cols-2 gap-2.5">
          {q.options.map((opt) => (
            <button
              key={opt.v}
              onClick={() => {
                setAnswers((a) => ({ ...a, [q.key]: opt.v }))
                setStep((s) => (s + 1) as Step)
              }}
              className="text-left p-4 rounded-xl border border-border/60 hover:border-primary/60 hover:bg-primary/5 transition-all group"
            >
              <div className="font-semibold text-sm group-hover:text-primary transition-colors">{opt.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{opt.hint}</div>
            </button>
          ))}
        </motion.div>
      </AnimatePresence>
      {step > 0 && (
        <button onClick={() => setStep((s) => (s - 1) as Step)} className="text-xs text-muted-foreground hover:text-foreground mt-4">
          ← Back
        </button>
      )}
    </div>
  )
}
