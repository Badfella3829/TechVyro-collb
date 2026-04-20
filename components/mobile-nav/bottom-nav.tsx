"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BarChart3, Briefcase, MessageCircle, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/analytics', label: 'Stats', icon: BarChart3 },
  { href: '/recommender', label: 'Match', icon: Sparkles, accent: true },
  { href: '/#portfolio', label: 'Work', icon: Briefcase },
  { href: '/#contact', label: 'Contact', icon: MessageCircle },
]

export function BottomNav() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border/50 bg-background/85 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="grid grid-cols-5">
        {items.map(({ href, label, icon: Icon, accent }) => {
          const cleanHref = href.split('#')[0] || '/'
          const active = cleanHref === '/' ? pathname === '/' && !href.includes('#') : pathname?.startsWith(cleanHref)
          return (
            <li key={href} className="flex">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] text-[11px] font-medium transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <span className={cn(
                  'h-10 w-10 rounded-full flex items-center justify-center',
                  accent && 'bg-gradient-to-br from-primary to-purple-500 text-white shadow-lg shadow-primary/30',
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
