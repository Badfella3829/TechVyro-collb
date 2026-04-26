"use client"

import { useEffect, useState } from 'react'
import { Languages, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useI18n } from '@/lib/i18n/i18n-context'

export function LangToggle() {
  const { locale, setLocale } = useI18n()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.documentElement.lang = locale
  }, [locale])

  if (!mounted) return <div className="w-20 h-9" aria-hidden />

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-2.5 rounded-lg gap-1.5 text-xs font-semibold"
        >
          <Languages className="h-3.5 w-3.5" />
          {locale === 'en' ? 'EN' : 'हिंदी'}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass border-border/50">
        <DropdownMenuItem
          onClick={() => setLocale('en')}
          className={locale === 'en' ? 'bg-primary/10 text-primary' : ''}
        >
          <span className="mr-2">🇬🇧</span>
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLocale('hi')}
          className={locale === 'hi' ? 'bg-primary/10 text-primary' : ''}
        >
          <span className="mr-2">🇮🇳</span>
          हिंदी (Hindi)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
