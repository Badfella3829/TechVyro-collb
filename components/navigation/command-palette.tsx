"use client"

import { useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  BarChart3,
  Briefcase,
  Calculator,
  Calendar,
  Check,
  Copy,
  FileDown,
  BookOpen,
  Mail,
  MessageCircle,
  Package,
  Search,
  Sparkles,
  User,
  Wand2,
} from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'

export const OPEN_COMMAND_PALETTE_EVENT = 'techvyro:open-command-palette'

export function openCommandPalette() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(OPEN_COMMAND_PALETTE_EVENT))
  }
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    const onOpenEvent = () => setOpen(true)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener(OPEN_COMMAND_PALETTE_EVENT, onOpenEvent)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener(OPEN_COMMAND_PALETTE_EVENT, onOpenEvent)
    }
  }, [])

  const goTo = useCallback(
    (href: string) => {
      setOpen(false)
      if (href.startsWith('#')) {
        if (pathname !== '/') {
          router.push(`/${href}`)
          return
        }
        const el = document.querySelector(href)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
        return
      }
      router.push(href)
    },
    [pathname, router]
  )

  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText('techvyro@gmail.com')
      setCopiedEmail(true)
      setTimeout(() => {
        setCopiedEmail(false)
        setOpen(false)
      }, 900)
    } catch {
      setOpen(false)
    }
  }, [])

  const handleDownloadMediaKit = useCallback(() => {
    setOpen(false)
    const link = document.createElement('a')
    link.href = '/api/media-kit'
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.click()
  }, [])

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Quick Navigation"
      description="Jump to any section, tool, or action across TechVyro."
      className="border-primary/30 bg-card/95 backdrop-blur-xl shadow-2xl shadow-primary/15 sm:max-w-xl"
    >
      <CommandInput placeholder="Search sections, packages, tools, actions..." />
      <CommandList className="max-h-[360px]">
        <CommandEmpty>No matching commands found.</CommandEmpty>

        <CommandGroup heading="Sections">
          <CommandItem onSelect={() => goTo('#stats')}>
            <BarChart3 className="h-4 w-4 text-primary" />
            <span>Reach &amp; Stats</span>
          </CommandItem>
          <CommandItem onSelect={() => goTo('#portfolio')}>
            <Briefcase className="h-4 w-4 text-primary" />
            <span>Featured Productions &amp; Portfolio</span>
          </CommandItem>
          <CommandItem onSelect={() => goTo('#packages')}>
            <Package className="h-4 w-4 text-primary" />
            <span>Collaboration Packages &amp; Pricing</span>
          </CommandItem>
          <CommandItem onSelect={() => goTo('#roi-calculator')}>
            <Calculator className="h-4 w-4 text-primary" />
            <span>ROI Calculator</span>
          </CommandItem>
          <CommandItem onSelect={() => goTo('#media-kit')}>
            <FileDown className="h-4 w-4 text-primary" />
            <span>Live Media Kit</span>
          </CommandItem>
          <CommandItem onSelect={() => goTo('#availability')}>
            <Calendar className="h-4 w-4 text-primary" />
            <span>Collab Availability Calendar</span>
          </CommandItem>
          <CommandItem onSelect={() => goTo('#contact')}>
            <Mail className="h-4 w-4 text-primary" />
            <span>Book a Collaboration / Send Brief</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Pages &amp; Tools">
          <CommandItem onSelect={() => goTo('/match')}>
            <Sparkles className="h-4 w-4 text-secondary" />
            <span>Brand Match Quiz</span>
          </CommandItem>
          <CommandItem onSelect={() => goTo('/recommender')}>
            <Wand2 className="h-4 w-4 text-secondary" />
            <span>Smart Package Recommender</span>
          </CommandItem>
          <CommandItem onSelect={() => goTo('/case-studies')}>
            <Briefcase className="h-4 w-4 text-secondary" />
            <span>Case Studies &amp; Playbooks</span>
          </CommandItem>
          <CommandItem onSelect={() => goTo('/blog')}>
            <BookOpen className="h-4 w-4 text-secondary" />
            <span>Creator Blog &amp; Insights</span>
          </CommandItem>
          <CommandItem onSelect={() => goTo('/about')}>
            <User className="h-4 w-4 text-secondary" />
            <span>About TechVyro</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={handleDownloadMediaKit}>
            <FileDown className="h-4 w-4 text-accent" />
            <span>Open Printable Media Kit</span>
          </CommandItem>
          <CommandItem onSelect={handleCopyEmail}>
            {copiedEmail ? (
              <Check className="h-4 w-4 text-emerald-400" />
            ) : (
              <Copy className="h-4 w-4 text-accent" />
            )}
            <span>{copiedEmail ? 'Copied techvyro@gmail.com!' : 'Copy Business Email (techvyro@gmail.com)'}</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setOpen(false)
              const link = document.createElement('a')
              link.href = 'https://wa.me/916396094707?text=Hi%20TechVyro%20Team!%20I%20would%20like%20to%20discuss%20a%20brand%20collaboration.'
              link.target = '_blank'
              link.rel = 'noopener noreferrer'
              link.click()
            }}
          >
            <MessageCircle className="h-4 w-4 text-emerald-400" />
            <span>Chat on WhatsApp (+91 63960 94707)</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
      <div className="flex items-center justify-between border-t border-border/50 bg-muted/20 px-3 py-2 text-[11px] text-muted-foreground">
        <span>↑↓ Navigate · ↵ Select</span>
        <span>Press Esc to close</span>
      </div>
    </CommandDialog>
  )
}

export function CommandPaletteTrigger({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={openCommandPalette}
      aria-label="Open quick command search (Ctrl+K)"
      className={
        className ||
        'inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-border/50 bg-muted/30 hover:bg-muted/60 hover:border-primary/40 text-xs text-muted-foreground hover:text-foreground transition-colors'
      }
    >
      <Search className="h-3.5 w-3.5 text-primary" />
      <span className="hidden lg:inline">Quick Jump</span>
      <kbd className="hidden xl:inline-flex items-center gap-0.5 rounded bg-background/80 border border-border/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
        ⌘K
      </kbd>
    </button>
  )
}
