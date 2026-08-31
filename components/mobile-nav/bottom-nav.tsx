"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, BarChart3, Briefcase, MessageCircle, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MouseEvent } from 'react'

const items = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/#stats', label: 'Stats', icon: BarChart3 },
  { href: '/match', label: 'Match', icon: Sparkles, accent: true },
  { href: '/#portfolio', label: 'Work', icon: Briefcase },
  { href: '/#contact', label: 'Contact', icon: MessageCircle },
]

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  if (pathname?.startsWith('/admin')) return null

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    // Handle hash links - smooth scroll if on same page, otherwise navigate
    if (href.includes('#')) {
      const [path, hash] = href.split('#')
      const targetPath = path || '/'
      if (pathname === targetPath) {
        e.preventDefault()
        const el = document.getElementById(hash)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      } else {
        e.preventDefault()
        router.push(`${targetPath}#${hash}`)
      }
    }
  }

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border/50 bg-background/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="grid grid-cols-5">
        {items.map(({ href, label, icon: Icon, accent }) => {
          const hasHash = href.includes('#')
          const cleanHref = hasHash ? (href.split('#')[0] || '/') : href
          const active = !hasHash && (cleanHref === '/'
            ? pathname === '/'
            : pathname?.startsWith(cleanHref))
          return (
            <li key={href} className="flex">
              <Link
                href={href}
                onClick={(e) => handleClick(e, href)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] text-[11px] font-medium transition-colors active:scale-95',
                  active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <span className={cn(
                  'h-9 w-9 rounded-full flex items-center justify-center transition-all',
                   accent && 'nav-3d-button',
                  active && !accent && 'bg-primary/10'
                )}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="leading-none">{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
