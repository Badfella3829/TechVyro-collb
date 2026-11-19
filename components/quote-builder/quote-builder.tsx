"use client"

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Calculator,
  Check,
  Clock,
  Copy,
  Eye,
  FileDown,
  Minus,
  Plus,
  RotateCcw,
  Send,
  Sparkles,
  Tag,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { convertInrToUsd, formatCurrencyAmount, type Currency } from '@/lib/pricing'
import {
  QUOTE_CATALOG,
  DEFAULT_QUOTE_SELECTION,
  calculateQuoteSummary,
  decodeQuoteFromQuery,
  encodeQuoteToQuery,
  formatViewsCompact,
  type QuoteSelection,
} from '@/lib/quote-builder'
import { selectPackage } from '@/lib/select-package'
import { useLanguage } from '@/components/i18n/language-provider'

export function QuoteBuilder() {
  const { t } = useLanguage()
  const [selection, setSelection] = useState<QuoteSelection>(DEFAULT_QUOTE_SELECTION)
  const [currency, setCurrency] = useState<Currency>('INR')
  const [brandName, setBrandName] = useState('')
  const [copiedLink, setCopiedLink] = useState(false)

  // Restore shareable quote link from URL query params on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    const decoded = decodeQuoteFromQuery(window.location.search)
    if (decoded.selection) {
      setSelection(decoded.selection)
      setCurrency(decoded.currency)
      if (decoded.brandName) setBrandName(decoded.brandName)
    }
  }, [])

  const summary = useMemo(
    () => calculateQuoteSummary(selection, currency),
    [selection, currency]
  )

  const queryString = useMemo(
    () => encodeQuoteToQuery(selection, currency, brandName),
    [selection, currency, brandName]
  )

  const proposalHref = `/api/proposal?${queryString}`

  const updateQty = (id: string, delta: number, maxQty: number) => {
    setSelection((prev) => {
      const next = Math.max(0, Math.min(maxQty, (prev[id] ?? 0) + delta))
      return { ...prev, [id]: next }
    })
  }

  const toggleAddon = (id: string) => {
    setSelection((prev) => ({
      ...prev,
      [id]: prev[id] ? 0 : 1,
    }))
  }

  const handleReset = () => {
    setSelection(DEFAULT_QUOTE_SELECTION)
    setBrandName('')
  }

  const handleCopyShareLink = async () => {
    if (typeof window === 'undefined') return
    const shareUrl = `${window.location.origin}/?${queryString}#quote-builder`
    try {
      await navigator.clipboard.writeText(shareUrl)
      window.history.replaceState({}, '', `/?${queryString}#quote-builder`)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    } catch {
      window.history.replaceState({}, '', `/?${queryString}#quote-builder`)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    }
  }

  const handleBookCustomPack = () => {
    if (summary.lines.length === 0) return
    const featureLines = summary.lines.map(
      (line) => `${line.qty}× ${line.item.name} (${line.item.platform})`
    )
    if (summary.discountPercent > 0) {
      featureLines.push(`Bundle Discount Applied: ${summary.discountPercent}% OFF`)
    }
    featureLines.push(`Estimated Investment: ${summary.totalDisplay} (${currency})`)
    if (summary.estimatedViews > 0) {
      featureLines.push(
        `Projected Reach: ${formatViewsCompact(summary.estimatedViews)} views · Est. Turnaround: ${summary.turnaroundDays} days`
      )
    }

    selectPackage({
      name: brandName.trim()
        ? `Custom Campaign (${brandName.trim()})`
        : 'Custom Campaign Bundle',
      description: `Custom mix of ${summary.deliverableCount} deliverable(s) built via the Interactive Quote Builder.`,
      features: featureLines,
      category: 'Bundle Package',
    })
  }

  const deliverables = QUOTE_CATALOG.filter((i) => !i.isAddon)
  const addons = QUOTE_CATALOG.filter((i) => i.isAddon)

  const formatItemRate = (priceInr: number) =>
    formatCurrencyAmount(
      currency === 'USD' ? convertInrToUsd(priceInr) : priceInr,
      currency
    )

  return (
    <section id="quote-builder" className="py-12 sm:py-16 lg:py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

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
            <Calculator className="h-4 w-4" />
            {t.quoteBuilder.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 mb-3">
            {t.quoteBuilder.headingPrefix}
            <span className="gradient-text">{t.quoteBuilder.headingAccent}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            {t.quoteBuilder.subtitle}
          </p>

          {/* Controls row: Brand name + Currency + Reset */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
            <Input
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder={t.quoteBuilder.brandPlaceholder}
              aria-label="Brand name for custom proposal"
              className="bg-background/60 border-border/60 h-10 sm:max-w-xs"
            />

            <div
              className="inline-flex items-center rounded-full border border-border/60 bg-muted/30 p-1"
              role="group"
              aria-label="Quote builder currency"
            >
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                aria-pressed={currency === 'INR'}
                className={cn(
                  'px-3.5 py-1 rounded-full text-xs font-semibold transition-all min-h-[34px]',
                  currency === 'INR'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                INR (₹)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                aria-pressed={currency === 'USD'}
                className={cn(
                  'px-3.5 py-1 rounded-full text-xs font-semibold transition-all min-h-[34px]',
                  currency === 'USD'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                USD ($)
              </button>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-foreground gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {t.quoteBuilder.reset}
            </Button>
          </div>
        </motion.div>

        {/* Builder 2-column layout */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 max-w-6xl mx-auto items-start">
          {/* Left: Deliverables & Add-Ons */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              {deliverables.map((item) => {
                const qty = selection[item.id] ?? 0
                const active = qty > 0
                return (
                  <Card
                    key={item.id}
                    className={cn(
                      'glass transition-all duration-200',
                      active
                        ? 'border-primary/60 bg-primary/5 shadow-md shadow-primary/10'
                        : 'border-border/50 hover:border-border'
                    )}
                  >
                    <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full gap-4">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-primary">
                            {item.platform}
                          </span>
                          <span className="text-sm font-bold text-foreground">
                            {formatItemRate(item.priceInr)}
                          </span>
                        </div>
                        <h3 className="font-semibold text-base text-foreground leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border/40">
                        <span className="text-[11px] text-muted-foreground">
                          {item.estViews > 0
                            ? `~${formatViewsCompact(item.estViews)} views`
                            : 'Paid ad creative'}
                        </span>

                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, -1, item.maxQty)}
                            disabled={qty === 0}
                            aria-label={`Decrease ${item.name} quantity`}
                            className="h-8 w-8 rounded-lg border border-border/60 bg-background/60 flex items-center justify-center hover:border-primary/60 disabled:opacity-35 transition-colors"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span
                            data-testid={`qty-${item.id}`}
                            className="w-6 text-center text-sm font-bold tabular-nums"
                          >
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, 1, item.maxQty)}
                            disabled={qty >= item.maxQty}
                            aria-label={`Increase ${item.name} quantity`}
                            className="h-8 w-8 rounded-lg border border-primary/50 bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground disabled:opacity-35 transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Optional Power Add-ons */}
            <div className="grid sm:grid-cols-2 gap-4">
              {addons.map((addon) => {
                const active = Boolean(selection[addon.id])
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddon(addon.id)}
                    aria-pressed={active}
                    className={cn(
                      'glass rounded-xl p-4 border text-left transition-all flex items-start justify-between gap-3',
                      active
                        ? 'border-accent bg-accent/10 shadow-md shadow-accent/10'
                        : 'border-border/50 hover:border-accent/50'
                    )}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-accent" />
                        <span className="text-sm font-semibold text-foreground">
                          {addon.name}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {addon.description}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-accent block">
                        +{formatItemRate(addon.priceInr)}
                      </span>
                      <span
                        className={cn(
                          'mt-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px]',
                          active
                            ? 'bg-accent text-background border-accent'
                            : 'border-border/60 text-transparent'
                        )}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right: Live Proposal Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <Card className="glass border-primary/40 shadow-xl shadow-primary/10 overflow-hidden">
              <CardHeader className="border-b border-border/40 bg-gradient-to-r from-primary/10 via-secondary/5 to-transparent pb-4">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    {t.quoteBuilder.summaryTitle}
                  </CardTitle>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/30">
                    {summary.deliverableCount} item{summary.deliverableCount === 1 ? '' : 's'}
                  </span>
                </div>
                {brandName.trim() && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Prepared for <span className="text-foreground font-semibold">{brandName.trim()}</span>
                  </p>
                )}
              </CardHeader>

              <CardContent className="p-5 sm:p-6 space-y-5">
                {/* Tiered bundle banner */}
                {summary.discountPercent === 15 ? (
                  <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 text-xs font-semibold text-emerald-400 flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 shrink-0" />
                    {t.quoteBuilder.discountBanner5}
                  </div>
                ) : summary.discountPercent === 10 ? (
                  <div className="rounded-lg bg-primary/10 border border-primary/30 px-3 py-2 text-xs font-semibold text-primary flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 shrink-0" />
                    {t.quoteBuilder.discountBanner3}
                  </div>
                ) : (
                  <div className="rounded-lg bg-muted/30 border border-border/50 px-3 py-2 text-xs text-muted-foreground">
                    Add {Math.max(1, 3 - summary.deliverableCount)} more deliverable
                    {3 - summary.deliverableCount === 1 ? '' : 's'} to unlock{' '}
                    <span className="text-primary font-semibold">10% bundle savings</span> (5+ unlocks 15%).
                  </div>
                )}

                {/* KPI trio */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="rounded-xl bg-background/50 border border-border/50 p-3 text-center">
                    <Eye className="h-3.5 w-3.5 text-primary mx-auto mb-1" />
                    <div className="text-sm sm:text-base font-bold text-foreground tabular-nums">
                      {summary.estimatedViews > 0
                        ? formatViewsCompact(summary.estimatedViews)
                        : '—'}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {t.quoteBuilder.estimatedReach}
                    </div>
                  </div>
                  <div className="rounded-xl bg-background/50 border border-border/50 p-3 text-center">
                    <TrendingUp className="h-3.5 w-3.5 text-secondary mx-auto mb-1" />
                    <div className="text-sm sm:text-base font-bold text-foreground tabular-nums">
                      {summary.blendedCpmDisplay}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {t.quoteBuilder.blendedCpm}
                    </div>
                  </div>
                  <div className="rounded-xl bg-background/50 border border-border/50 p-3 text-center">
                    <Clock className="h-3.5 w-3.5 text-accent mx-auto mb-1" />
                    <div className="text-sm sm:text-base font-bold text-foreground tabular-nums">
                      {summary.turnaroundDays > 0 ? `${summary.turnaroundDays}d` : '—'}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {t.quoteBuilder.turnaround}
                    </div>
                  </div>
                </div>

                {/* Line items */}
                {summary.lines.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6 border border-dashed border-border/60 rounded-xl">
                    {t.quoteBuilder.emptyState}
                  </p>
                ) : (
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {summary.lines.map((line) => {
                      const amt =
                        currency === 'USD'
                          ? convertInrToUsd(line.lineTotalInr)
                          : line.lineTotalInr
                      return (
                        <div
                          key={line.item.id}
                          className="flex items-center justify-between gap-2 text-sm py-1.5 border-b border-border/30 last:border-0"
                        >
                          <span className="text-muted-foreground truncate">
                            <span className="text-foreground font-semibold">
                              {line.qty}×
                            </span>{' '}
                            {line.item.name}
                          </span>
                          <span className="font-mono text-xs sm:text-sm font-semibold text-foreground shrink-0">
                            {formatCurrencyAmount(amt, currency)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Totals */}
                <div className="space-y-1.5 pt-3 border-t border-border/50 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t.quoteBuilder.subtotal}</span>
                    <span className="font-mono">{summary.subtotalDisplay}</span>
                  </div>
                  {summary.discountPercent > 0 && (
                    <div className="flex justify-between text-emerald-400 font-medium">
                      <span>
                        {t.quoteBuilder.bundleDiscount} ({summary.discountPercent}%)
                      </span>
                      <span className="font-mono">−{summary.discountDisplay}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline pt-2 border-t border-border/40">
                    <span className="font-semibold text-foreground">
                      {t.quoteBuilder.totalEstimate}
                    </span>
                    <span
                      data-testid="quote-total"
                      className="text-2xl font-bold gradient-text tabular-nums"
                    >
                      {summary.totalDisplay}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2.5 pt-1">
                  <Button
                    type="button"
                    size="lg"
                    disabled={summary.lines.length === 0}
                    onClick={handleBookCustomPack}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {t.quoteBuilder.bookCustomPack}
                  </Button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={summary.lines.length === 0}
                      onClick={handleCopyShareLink}
                      className="gap-1.5 h-10 text-xs"
                    >
                      {copiedLink ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      {copiedLink ? t.quoteBuilder.copiedLink : t.quoteBuilder.copyLink}
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className={cn(
                        'gap-1.5 h-10 text-xs',
                        summary.lines.length === 0 && 'pointer-events-none opacity-50'
                      )}
                    >
                      <a
                        href={proposalHref}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileDown className="h-3.5 w-3.5" />
                        {t.quoteBuilder.downloadProposal}
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
