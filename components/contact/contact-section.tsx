"use client"

import { useEffect, useRef, useState, useMemo } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Send,
  Mail,
  MessageSquare,
  Clock,
  Calendar,
  Building2,
  Target,
  Wallet,
  FileText,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  User,
  Globe,
  Phone,
  Sparkles,
  Copy,
  ExternalLink,
  Check,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCombinedStats, formatBig } from '@/hooks/use-combined-stats'
import { PACKAGE_SELECTED_EVENT, mapPackageToCollabType, type SelectedPackage } from '@/lib/select-package'

const COLLAB_EMAIL = 'collab@techvyro.com'
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
const DRAFT_KEY = 'techvyro:collab-draft:v1'

const budgetRanges = [
  'Under ₹10,000',
  '₹10,000 – ₹25,000',
  '₹25,000 – ₹50,000',
  '₹50,000 – ₹1,00,000',
  '₹1,00,000 – ₹3,00,000',
  '₹3,00,000+',
  'Open / let’s discuss',
]

const collabTypes = [
  'Dedicated Video',
  'Integrated Sponsorship',
  'Product Review',
  'Instagram Reel',
  'YouTube Short',
  'Social Media Post',
  'Live Stream',
  'Brand Ambassador',
  'Bundle Package',
  'Other',
]

const campaignGoals = [
  'Brand Awareness',
  'Product Launch',
  'Sales / Conversions',
  'App Downloads',
  'Lead Generation',
  'Community Building',
  'Other',
]

const deliverableOptions = [
  'YouTube Long Video',
  'YouTube Short',
  'Instagram Reel',
  'Instagram Post',
  'Instagram Story Set',
  'Facebook Reel',
  'Facebook Post',
  'Cross-platform Bundle',
]

const timelineOptions = [
  'ASAP (within 7 days)',
  '2 – 4 weeks',
  '1 – 2 months',
  'Flexible',
]

type FormState = {
  brandName: string
  contactName: string
  email: string
  phone: string
  website: string
  campaignGoal: string
  collabType: string
  deliverables: string[]
  budget: string
  timeline: string
  startDate: string
  message: string
}

const emptyForm: FormState = {
  brandName: '',
  contactName: '',
  email: '',
  phone: '',
  website: '',
  campaignGoal: '',
  collabType: '',
  deliverables: [],
  budget: '',
  timeline: '',
  startDate: '',
  message: '',
}

const stepLabels = ['About Brand', 'Campaign', 'Brief', 'Review']

export function ContactSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const { totals, ready } = useCombinedStats()

  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [reference, setReference] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [draftSaved, setDraftSaved] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<SelectedPackage | null>(null)

  // Restore draft from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed === 'object') {
          setForm((prev) => ({ ...prev, ...parsed }))
        }
      }
    } catch {}
  }, [])

  // Listen for package selection from Packages section
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<SelectedPackage>
      const pkg = ce.detail
      if (!pkg) return
      setSelectedPackage(pkg)
      const mappedType = mapPackageToCollabType(pkg.name)
      const featureLines = pkg.features?.length
        ? `\n\nWhat's included in this package:\n${pkg.features.map((f) => `• ${f}`).join('\n')}`
        : ''
      const prefilledMessage = `Hi! I'd like a quote for the "${pkg.name}" package${pkg.category ? ` (${pkg.category})` : ''}.\n\n${pkg.description}${featureLines}\n\nPlease share pricing, availability, and next steps.`
      setForm((prev) => ({
        ...prev,
        collabType: mappedType,
        // Only overwrite message if it's empty or also auto-generated previously
        message: prev.message && !prev.message.startsWith("Hi! I'd like a quote") ? prev.message : prefilledMessage,
      }))
      setErrors({})
      // Start from About Brand step so user fills brand details first
      setStep(0)
    }
    window.addEventListener(PACKAGE_SELECTED_EVENT, handler as EventListener)
    return () => window.removeEventListener(PACKAGE_SELECTED_EVENT, handler as EventListener)
  }, [])

  // Save draft on change (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(form))
        setDraftSaved(true)
        setTimeout(() => setDraftSaved(false), 1500)
      } catch {}
    }, 600)
    return () => clearTimeout(t)
  }, [form])

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const toggleDeliverable = (item: string) => {
    setForm((prev) => ({
      ...prev,
      deliverables: prev.deliverables.includes(item)
        ? prev.deliverables.filter((d) => d !== item)
        : [...prev.deliverables, item],
    }))
  }

  // Brand-fit score: simple heuristic 0-100 based on completeness + match
  const fitScore = useMemo(() => {
    let s = 0
    if (form.brandName) s += 10
    if (form.contactName) s += 5
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) s += 15
    if (form.website) s += 5
    if (form.campaignGoal) s += 10
    if (form.collabType) s += 10
    if (form.deliverables.length > 0) s += 10 + Math.min(form.deliverables.length * 3, 15)
    if (form.budget) s += 10
    if (form.timeline) s += 5
    if (form.message.length > 50) s += 10
    if (form.message.length > 200) s += 5
    return Math.min(100, s)
  }, [form])

  const fitLabel =
    fitScore >= 80 ? 'Excellent fit' : fitScore >= 60 ? 'Strong fit' : fitScore >= 30 ? 'Looking good' : 'Tell me more'
  const fitColor =
    fitScore >= 80 ? 'text-emerald-400' : fitScore >= 60 ? 'text-primary' : fitScore >= 30 ? 'text-amber-400' : 'text-muted-foreground'

  // Validation per step
  const validateStep = (s: number): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {}
    if (s === 0) {
      if (!form.brandName.trim()) newErrors.brandName = 'Brand name is required'
      if (!form.contactName.trim()) newErrors.contactName = 'Your name is required'
      if (!form.email.trim()) newErrors.email = 'Email is required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Enter a valid email'
    }
    if (s === 1) {
      if (!form.campaignGoal) newErrors.campaignGoal = 'Pick a campaign goal'
      if (!form.collabType) newErrors.collabType = 'Pick a collab type'
    }
    if (s === 2) {
      if (!form.message.trim() || form.message.trim().length < 20)
        newErrors.message = 'Tell me a bit more (at least 20 characters)'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const next = () => {
    if (validateStep(step)) setStep((s) => Math.min(stepLabels.length - 1, s + 1))
  }
  const back = () => setStep((s) => Math.max(0, s - 1))

  const buildSummary = () => {
    return [
      `New collab inquiry from ${form.brandName}`,
      ``,
      `Contact: ${form.contactName} <${form.email}>${form.phone ? ` • ${form.phone}` : ''}`,
      form.website ? `Website / Social: ${form.website}` : '',
      ``,
      `Campaign Goal: ${form.campaignGoal}`,
      `Collab Type: ${form.collabType}`,
      form.deliverables.length ? `Deliverables: ${form.deliverables.join(', ')}` : '',
      form.budget ? `Budget: ${form.budget}` : '',
      form.timeline ? `Timeline: ${form.timeline}` : '',
      form.startDate ? `Preferred Start: ${form.startDate}` : '',
      ``,
      `Brief:`,
      form.message,
    ]
      .filter(Boolean)
      .join('\n')
  }

  const submit = async () => {
    if (!validateStep(0) || !validateStep(1) || !validateStep(2)) {
      const firstBad = !validateStep(0) ? 0 : !validateStep(1) ? 1 : 2
      setStep(firstBad)
      return
    }
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, fitScore }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data?.fieldErrors && typeof data.fieldErrors === 'object') {
          setErrors(data.fieldErrors)
        }
        throw new Error(data?.error || 'Submission failed')
      }
      setReference(data.reference || null)
      setIsSubmitted(true)
      try { localStorage.removeItem(DRAFT_KEY) } catch {}
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const mailtoLink = `mailto:${COLLAB_EMAIL}?subject=${encodeURIComponent(
    `Collab inquiry – ${form.brandName || 'Brand'}`
  )}&body=${encodeURIComponent(buildSummary())}`

  const whatsappLink = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(buildSummary())}`
    : ''

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(buildSummary())
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  return (
    <section id="contact" className="py-24 sm:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-background" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-semibold tracking-wider uppercase">
            Let&apos;s Work Together
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 mb-4">
            Book a
            <span className="gradient-text"> Collaboration</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A quick 4-step brief — tell me about your brand and campaign, and I&apos;ll
            personally reply within 24 hours with the perfect plan.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1 space-y-4 lg:sticky lg:top-24 self-start"
          >
            {/* Live reach card */}
            <Card className="glass border-primary/30 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Live Audience
                  </span>
                </div>
                <p className="text-2xl font-bold gradient-text">
                  {ready ? formatBig(totals.followers) : '—'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Followers across IG + FB + YT
                </p>
                <div className="mt-3 pt-3 border-t border-border/40 flex justify-between text-xs">
                  <span className="text-muted-foreground">Total Views</span>
                  <span className="font-semibold text-foreground">
                    {ready ? formatBig(totals.totalViews) : '—'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Brand fit gauge */}
            <Card className="glass border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Brand Fit Score
                  </span>
                  <span className={`text-sm font-semibold ${fitColor}`}>{fitLabel}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary via-secondary to-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${fitScore}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  More details = faster, better matched response.
                </p>
              </CardContent>
            </Card>

            {/* Contact methods */}
            <Card className="glass border-border/50">
              <CardContent className="p-5 space-y-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Prefer another channel?
                </p>
                <a
                  href={mailtoLink}
                  className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="truncate">{COLLAB_EMAIL}</span>
                  <ExternalLink className="h-3 w-3 ml-auto opacity-60" />
                </a>
                {WHATSAPP_NUMBER && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm hover:text-accent transition-colors"
                  >
                    <MessageSquare className="h-4 w-4 shrink-0" />
                    <span>WhatsApp Business</span>
                    <ExternalLink className="h-3 w-3 ml-auto opacity-60" />
                  </a>
                )}
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>Replies within 24 hours</span>
                </div>
              </CardContent>
            </Card>

            {draftSaved && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-muted-foreground flex items-center gap-2"
              >
                <Check className="h-3 w-3 text-emerald-400" />
                Draft saved
              </motion.p>
            )}
          </motion.aside>

          {/* Wizard form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="glass border-border/50 overflow-hidden">
              <CardContent className="p-0">
                {isSubmitted ? (
                  <SuccessView
                    brandName={form.brandName}
                    reference={reference}
                    mailtoLink={mailtoLink}
                    whatsappLink={whatsappLink}
                    onReset={() => {
                      setForm(emptyForm)
                      setStep(0)
                      setIsSubmitted(false)
                      setReference(null)
                    }}
                  />
                ) : (
                  <>
                    {/* Selected package banner */}
                    <AnimatePresence>
                      {selectedPackage && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mx-6 sm:mx-8 mt-6 rounded-xl border border-primary/40 bg-gradient-to-r from-primary/15 via-secondary/10 to-transparent p-4 flex items-start gap-3">
                            <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs uppercase tracking-wider text-primary font-semibold">
                                Package Selected
                              </p>
                              <p className="text-sm font-bold text-foreground mt-0.5 truncate">
                                {selectedPackage.name}
                              </p>
                              {selectedPackage.category && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {selectedPackage.category} • Auto-filled in your brief below
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedPackage(null)
                                setForm((prev) => ({
                                  ...prev,
                                  collabType: '',
                                  message: prev.message.startsWith("Hi! I'd like a quote") ? '' : prev.message,
                                }))
                              }}
                              className="text-muted-foreground hover:text-foreground text-xs underline shrink-0"
                            >
                              Clear
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Stepper */}
                    <div className="px-6 sm:px-8 pt-6">
                      <div className="flex items-center gap-2">
                        {stepLabels.map((label, i) => (
                          <div key={label} className="flex-1 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => i < step && setStep(i)}
                              className={`flex items-center gap-2 text-xs font-medium transition-colors ${
                                i === step
                                  ? 'text-primary'
                                  : i < step
                                  ? 'text-foreground hover:text-primary cursor-pointer'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              <span
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                                  i === step
                                    ? 'bg-primary text-primary-foreground border-primary scale-110'
                                    : i < step
                                    ? 'bg-primary/20 text-primary border-primary/40'
                                    : 'bg-muted/40 text-muted-foreground border-border'
                                }`}
                              >
                                {i < step ? <Check className="h-3 w-3" /> : i + 1}
                              </span>
                              <span className="hidden sm:inline">{label}</span>
                            </button>
                            {i < stepLabels.length - 1 && (
                              <div
                                className={`flex-1 h-px transition-colors ${
                                  i < step ? 'bg-primary/40' : 'bg-border'
                                }`}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 sm:p-8">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={step}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.25 }}
                        >
                          {step === 0 && (
                            <div className="space-y-5">
                              <div className="grid sm:grid-cols-2 gap-4">
                                <Field
                                  id="brandName"
                                  label="Brand Name"
                                  required
                                  icon={Building2}
                                  error={errors.brandName}
                                >
                                  <Input
                                    id="brandName"
                                    placeholder="e.g. Acme Corp"
                                    value={form.brandName}
                                    onChange={(e) => update('brandName', e.target.value)}
                                    className="bg-background/50"
                                  />
                                </Field>
                                <Field
                                  id="contactName"
                                  label="Contact Person"
                                  required
                                  icon={User}
                                  error={errors.contactName}
                                >
                                  <Input
                                    id="contactName"
                                    placeholder="Your full name"
                                    value={form.contactName}
                                    onChange={(e) => update('contactName', e.target.value)}
                                    className="bg-background/50"
                                  />
                                </Field>
                              </div>
                              <div className="grid sm:grid-cols-2 gap-4">
                                <Field
                                  id="email"
                                  label="Work Email"
                                  required
                                  icon={Mail}
                                  error={errors.email}
                                >
                                  <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@company.com"
                                    value={form.email}
                                    onChange={(e) => update('email', e.target.value)}
                                    className="bg-background/50"
                                  />
                                </Field>
                                <Field id="phone" label="Phone (optional)" icon={Phone}>
                                  <Input
                                    id="phone"
                                    placeholder="+91 98xxxxxxxx"
                                    value={form.phone}
                                    onChange={(e) => update('phone', e.target.value)}
                                    className="bg-background/50"
                                  />
                                </Field>
                              </div>
                              <Field id="website" label="Website / Social Handle" icon={Globe}>
                                <Input
                                  id="website"
                                  placeholder="@yourbrand or yourbrand.com"
                                  value={form.website}
                                  onChange={(e) => update('website', e.target.value)}
                                  className="bg-background/50"
                                />
                              </Field>
                            </div>
                          )}

                          {step === 1 && (
                            <div className="space-y-5">
                              <div className="grid sm:grid-cols-2 gap-4">
                                <Field
                                  id="goal"
                                  label="Campaign Goal"
                                  required
                                  icon={Target}
                                  error={errors.campaignGoal}
                                >
                                  <Select
                                    value={form.campaignGoal}
                                    onValueChange={(v) => update('campaignGoal', v)}
                                  >
                                    <SelectTrigger className="bg-background/50">
                                      <SelectValue placeholder="Select goal" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {campaignGoals.map((g) => (
                                        <SelectItem key={g} value={g}>
                                          {g}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </Field>
                                <Field
                                  id="type"
                                  label="Preferred Collab Type"
                                  required
                                  icon={FileText}
                                  error={errors.collabType}
                                >
                                  <Select
                                    value={form.collabType}
                                    onValueChange={(v) => update('collabType', v)}
                                  >
                                    <SelectTrigger className="bg-background/50">
                                      <SelectValue placeholder="Pick a format" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {collabTypes.map((t) => (
                                        <SelectItem key={t} value={t}>
                                          {t}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </Field>
                              </div>

                              <div>
                                <Label className="text-sm mb-3 inline-block">Deliverables (pick all that apply)</Label>
                                <div className="flex flex-wrap gap-2">
                                  {deliverableOptions.map((d) => {
                                    const active = form.deliverables.includes(d)
                                    return (
                                      <button
                                        type="button"
                                        key={d}
                                        role="checkbox"
                                        aria-checked={active}
                                        aria-pressed={active}
                                        aria-label={`Deliverable: ${d}`}
                                        onClick={() => toggleDeliverable(d)}
                                        className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                                          active
                                            ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20'
                                            : 'bg-background/40 text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                                        }`}
                                      >
                                        {active && <Check className="h-3 w-3 inline mr-1" />}
                                        {d}
                                      </button>
                                    )
                                  })}
                                </div>
                              </div>

                              <Field id="budget" label="Budget Range" icon={Wallet}>
                                <Select
                                  value={form.budget}
                                  onValueChange={(v) => update('budget', v)}
                                >
                                  <SelectTrigger className="bg-background/50">
                                    <SelectValue placeholder="Select budget" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {budgetRanges.map((r) => (
                                      <SelectItem key={r} value={r}>
                                        {r}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </Field>
                            </div>
                          )}

                          {step === 2 && (
                            <div className="space-y-5">
                              <div className="grid sm:grid-cols-2 gap-4">
                                <Field id="timeline" label="Timeline" icon={Clock}>
                                  <Select
                                    value={form.timeline}
                                    onValueChange={(v) => update('timeline', v)}
                                  >
                                    <SelectTrigger className="bg-background/50">
                                      <SelectValue placeholder="When do you want to launch?" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {timelineOptions.map((t) => (
                                        <SelectItem key={t} value={t}>
                                          {t}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </Field>
                                <Field id="startDate" label="Preferred Start Date" icon={Calendar}>
                                  <Input
                                    id="startDate"
                                    type="date"
                                    value={form.startDate}
                                    onChange={(e) => update('startDate', e.target.value)}
                                    className="bg-background/50"
                                    min={new Date().toISOString().slice(0, 10)}
                                  />
                                </Field>
                              </div>
                              <Field
                                id="message"
                                label="Campaign Brief"
                                required
                                icon={FileText}
                                error={errors.message}
                              >
                                <Textarea
                                  id="message"
                                  rows={6}
                                  placeholder="Tell me about your product, audience you want to reach, key messages, and anything else that matters..."
                                  value={form.message}
                                  onChange={(e) => update('message', e.target.value)}
                                  className="bg-background/50 resize-none"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                  {form.message.length}/2000 characters
                                </p>
                              </Field>
                            </div>
                          )}

                          {step === 3 && (
                            <div className="space-y-5">
                              <div className="rounded-xl border border-border/50 bg-background/40 p-5 space-y-4">
                                <ReviewRow label="Brand" value={form.brandName} />
                                <ReviewRow label="Contact" value={`${form.contactName} • ${form.email}${form.phone ? ` • ${form.phone}` : ''}`} />
                                {form.website && <ReviewRow label="Website / Social" value={form.website} />}
                                <ReviewRow label="Goal" value={form.campaignGoal} />
                                <ReviewRow label="Collab Type" value={form.collabType} />
                                {form.deliverables.length > 0 && (
                                  <ReviewRow label="Deliverables" value={form.deliverables.join(', ')} />
                                )}
                                {form.budget && <ReviewRow label="Budget" value={form.budget} />}
                                {form.timeline && <ReviewRow label="Timeline" value={form.timeline} />}
                                {form.startDate && <ReviewRow label="Start Date" value={form.startDate} />}
                                <div>
                                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Brief</p>
                                  <p className="text-sm whitespace-pre-wrap text-foreground">{form.message}</p>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={copySummary}
                                  className="gap-2"
                                >
                                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                                  {copied ? 'Copied' : 'Copy summary'}
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  asChild
                                  className="gap-2"
                                >
                                  <a href={mailtoLink}>
                                    <Mail className="h-3.5 w-3.5" />
                                    Open in Email
                                  </a>
                                </Button>
                                {WHATSAPP_NUMBER && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="gap-2"
                                  >
                                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                                      <MessageSquare className="h-3.5 w-3.5" />
                                      Send via WhatsApp
                                    </a>
                                  </Button>
                                )}
                              </div>

                              {submitError && (
                                <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                                  <AlertCircle className="h-4 w-4 shrink-0" />
                                  {submitError}
                                </div>
                              )}
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Footer nav */}
                    <div className="px-6 sm:px-8 py-5 border-t border-border/40 bg-muted/10 flex items-center justify-between gap-3">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={back}
                        disabled={step === 0}
                        className="gap-1"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Back
                      </Button>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        Step {step + 1} of {stepLabels.length}
                      </div>

                      {step < stepLabels.length - 1 ? (
                        <Button
                          type="button"
                          onClick={next}
                          size="sm"
                          className="gap-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={submit}
                          size="sm"
                          disabled={isSubmitting}
                          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground neon-glow-cyan"
                        >
                          {isSubmitting ? (
                            <>
                              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                              Sending…
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4" />
                              Send Inquiry
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Field({
  id,
  label,
  required,
  icon: Icon,
  error,
  children,
}: {
  id: string
  label: string
  required?: boolean
  icon?: React.ComponentType<{ className?: string }>
  error?: string
  children: React.ReactNode
}) {
  const errorId = error ? `${id}-error` : undefined
  return (
    <div className="space-y-2">
      <Label id={`${id}-label`} htmlFor={id} className="flex items-center gap-2 text-sm">
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
        {label}
        {required && <span className="text-primary" aria-hidden="true">*</span>}
        {required && <span className="sr-only">(required)</span>}
      </Label>
      <div
        aria-labelledby={`${id}-label`}
        aria-invalid={!!error}
        aria-describedby={errorId}
      >
        {children}
      </div>
      {error && (
        <p id={errorId} className="text-xs text-red-400 flex items-center gap-1" role="alert">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
      <span className="text-xs uppercase tracking-wider text-muted-foreground sm:w-32 shrink-0">
        {label}
      </span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  )
}

function SuccessView({
  brandName,
  reference,
  mailtoLink,
  whatsappLink,
  onReset,
}: {
  brandName: string
  reference: string | null
  mailtoLink: string
  whatsappLink: string
  onReset: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center px-6 sm:px-10 py-14"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 220 }}
        className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-5"
      >
        <CheckCircle2 className="h-8 w-8 text-emerald-400" />
      </motion.div>
      <h3 className="text-2xl font-bold mb-2">
        {brandName ? `Thanks, ${brandName}!` : 'Inquiry received!'}
      </h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-2">
        Your collab brief has landed. I&apos;ll review it personally and get back to you
        within <span className="text-foreground font-semibold">24 hours</span>.
      </p>
      {reference && (
        <p className="text-xs text-muted-foreground mb-6">
          Reference: <span className="font-mono text-primary">{reference}</span>
        </p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
        <Button variant="outline" size="sm" asChild className="gap-2">
          <a href={mailtoLink}>
            <Mail className="h-4 w-4" />
            Email me too
          </a>
        </Button>
        {whatsappLink && (
          <Button variant="outline" size="sm" asChild className="gap-2">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageSquare className="h-4 w-4" />
              Ping on WhatsApp
            </a>
          </Button>
        )}
      </div>
      <Button onClick={onReset} variant="ghost" size="sm">
        Send another inquiry
      </Button>
    </motion.div>
  )
}
