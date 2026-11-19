"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertCircle,
  Check,
  Copy,
  Film,
  Lightbulb,
  Loader2,
  Send,
  Sparkles,
  Wand2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { selectPackage } from '@/lib/select-package'
import { useLanguage } from '@/components/i18n/language-provider'
import type { CampaignIdeaResponse } from '@/lib/gemini'

const CATEGORIES = [
  'Smartphone / Gadget',
  'Audio / Wearables',
  'AI / SaaS App',
  'Gaming & Accessories',
  'FinTech / EdTech',
  'Smart Home',
]

const GOALS = [
  'Product Launch Buzz',
  'High-Intent Sales & Clicks',
  'App Installs & Signups',
  'Brand Trust & Awareness',
]

export function CampaignIdeaGenerator() {
  const { t } = useLanguage()
  const [brandName, setBrandName] = useState('')
  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [goal, setGoal] = useState(GOALS[0])
  const [outputLanguage, setOutputLanguage] = useState<'Hinglish' | 'English'>('Hinglish')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [concept, setConcept] = useState<CampaignIdeaResponse | null>(null)
  const [copiedHookIdx, setCopiedHookIdx] = useState<number | null>(null)

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!brandName.trim() || !productName.trim()) {
      setError('Please enter both your brand name and product name.')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ai/campaign-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName: brandName.trim(),
          productName: productName.trim(),
          category,
          goal,
          outputLanguage,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data?.concept) {
        throw new Error(data?.error || 'Could not generate campaign ideas right now.')
      }
      setConcept(data.concept as CampaignIdeaResponse)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong while generating concepts.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyHook = async (idx: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedHookIdx(idx)
      setTimeout(() => setCopiedHookIdx(null), 1600)
    } catch {}
  }

  const handleUseInBrief = () => {
    if (!concept) return
    const hookBullets = concept.hooks.map(
      (h) => `${h.format}: "${h.hookLine}" (CTA: ${h.cta})`
    )
    selectPackage({
      name: concept.recommendedPackage || 'Growth Bundle',
      description: `Campaign Concept: "${concept.conceptTitle}" for ${brandName.trim()} — ${productName.trim()} (${goal}).`,
      features: [
        ...hookBullets,
        `Projected Impact: ${concept.estimatedImpact}`,
      ],
      category: 'Campaign Concept',
    })
  }

  return (
    <section id="ai-studio" className="py-12 sm:py-16 lg:py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-12"
        >
          <span className="inline-flex items-center gap-2 text-primary text-xs sm:text-sm font-semibold tracking-wider uppercase">
            <Wand2 className="h-4 w-4" />
            {t.aiStudio.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 mb-3">
            {t.aiStudio.headingPrefix}
            <span className="gradient-text">{t.aiStudio.headingAccent}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            {t.aiStudio.subtitle}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 max-w-6xl mx-auto items-start">
          {/* Left: Form */}
          <Card className="lg:col-span-5 glass border-border/50">
            <CardContent className="p-5 sm:p-6">
              <form onSubmit={handleGenerate} className="space-y-5">
                <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="ai-brand-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t.aiStudio.brandLabel} *
                    </Label>
                    <Input
                      id="ai-brand-name"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="e.g. Nothing, boAt, Notion"
                      className="mt-1.5 bg-background/60"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="ai-product-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t.aiStudio.productLabel} *
                    </Label>
                    <Input
                      id="ai-product-name"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g. Ear (3) ANC Earbuds"
                      className="mt-1.5 bg-background/60"
                      required
                    />
                  </div>
                </div>

                {/* Category pills */}
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                    {t.aiStudio.categoryLabel}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        aria-pressed={category === cat}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                          category === cat
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background/40 text-muted-foreground border-border/60 hover:border-primary/40 hover:text-foreground'
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Goal pills */}
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                    {t.aiStudio.goalLabel}
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {GOALS.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGoal(g)}
                        aria-pressed={goal === g}
                        className={cn(
                          'px-3 py-2 rounded-lg text-xs font-medium border text-left transition-colors',
                          goal === g
                            ? 'bg-secondary/20 text-foreground border-secondary/60'
                            : 'bg-background/40 text-muted-foreground border-border/60 hover:border-border hover:text-foreground'
                        )}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Output script style */}
                <div className="flex items-center justify-between gap-3 pt-1">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t.aiStudio.outputLangLabel}
                  </Label>
                  <div className="inline-flex rounded-lg border border-border/60 bg-muted/30 p-0.5">
                    {(['Hinglish', 'English'] as const).map((langOpt) => (
                      <button
                        key={langOpt}
                        type="button"
                        onClick={() => setOutputLanguage(langOpt)}
                        aria-pressed={outputLanguage === langOpt}
                        className={cn(
                          'px-3 py-1 rounded-md text-xs font-semibold transition-all min-h-[32px]',
                          outputLanguage === langOpt
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {langOpt}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300 flex items-start gap-2"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white font-semibold gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t.aiStudio.generatingBtn}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      {t.aiStudio.generateBtn}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Right: Output Studio */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="glass border-primary/30 p-8 sm:p-10 text-center space-y-4">
                    <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto" />
                    <div>
                      <p className="font-semibold text-foreground">
                        {t.aiStudio.generatingBtn}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Building tailored Reel, Short &amp; YouTube review hooks for {productName || 'your product'}...
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ) : concept ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <Card className="glass border-primary/40 overflow-hidden">
                    <CardHeader className="border-b border-border/40 bg-gradient-to-r from-primary/10 via-secondary/10 to-transparent pb-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-mono uppercase tracking-wider text-primary">
                          Recommended: {concept.recommendedPackage}
                        </span>
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {concept.estimatedImpact}
                        </span>
                      </div>
                      <CardTitle className="text-xl sm:text-2xl mt-2">
                        {concept.conceptTitle}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="p-5 sm:p-6 space-y-5">
                      {/* Hooks */}
                      <div className="space-y-3">
                        {concept.hooks.map((hook, idx) => (
                          <div
                            key={`${hook.format}-${idx}`}
                            className="rounded-xl border border-border/50 bg-background/50 p-4 space-y-2"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                                <Film className="h-3.5 w-3.5" />
                                {hook.format}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleCopyHook(
                                    idx,
                                    `${hook.format}\nHook: "${hook.hookLine}"\nVisual: ${hook.visualDirection}\nCTA: ${hook.cta}`
                                  )
                                }
                                className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors"
                              >
                                {copiedHookIdx === idx ? (
                                  <>
                                    <Check className="h-3 w-3 text-emerald-400" />
                                    {t.aiStudio.copied}
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" />
                                    {t.aiStudio.copyHook}
                                  </>
                                )}
                              </button>
                            </div>
                            <p className="text-sm sm:text-base font-semibold text-foreground leading-snug">
                              &ldquo;{hook.hookLine}&rdquo;
                            </p>
                            <p className="text-xs text-muted-foreground">
                              <span className="text-foreground/80 font-medium">Visual:</span>{' '}
                              {hook.visualDirection}
                            </p>
                            <p className="text-xs text-accent">
                              <span className="font-medium">CTA:</span> {hook.cta}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Creative angles */}
                      {concept.contentAngles?.length > 0 && (
                        <div className="rounded-xl border border-border/40 bg-muted/20 p-4">
                          <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                            Creative Differentiators
                          </h4>
                          <ul className="space-y-1.5 text-xs sm:text-sm text-foreground/90">
                            {concept.contentAngles.map((angle, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                                <span>{angle}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Pro tip */}
                      {concept.proTip && (
                        <div className="rounded-xl border border-gold/30 bg-gold/5 p-3.5 flex items-start gap-2.5 text-xs sm:text-sm text-foreground/90">
                          <Lightbulb className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                          <span>{concept.proTip}</span>
                        </div>
                      )}

                      <Button
                        type="button"
                        size="lg"
                        onClick={handleUseInBrief}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2"
                      >
                        <Send className="h-4 w-4" />
                        {t.aiStudio.useInBrief}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="glass border-dashed border-border/60 p-8 sm:p-10 text-center space-y-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div className="max-w-md mx-auto space-y-2">
                      <h3 className="text-lg font-bold text-foreground">
                        Instant Creator Pitch Blueprint
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Enter your brand &amp; product on the left to generate 3 scroll-stopping TechVyro hooks (Instagram Reel, YouTube Short, and YouTube Review) plus a recommended collaboration package.
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setBrandName('Nothing India')
                          setProductName('Phone (3a) Pro')
                          setCategory('Smartphone / Gadget')
                          setGoal('Product Launch Buzz')
                        }}
                        className="text-xs px-3 py-1.5 rounded-full border border-border/60 bg-background/50 hover:border-primary/50 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Try example: Nothing Phone (3a) Pro
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setBrandName('boAt')
                          setProductName('Nirvana Ion ANC Pro')
                          setCategory('Audio / Wearables')
                          setGoal('High-Intent Sales & Clicks')
                        }}
                        className="text-xs px-3 py-1.5 rounded-full border border-border/60 bg-background/50 hover:border-primary/50 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Try example: boAt Nirvana ANC
                      </button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
