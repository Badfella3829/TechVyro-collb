"use client"

import { Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/components/i18n/language-provider'

export function LangToggle() {
  const { lang, toggleLang, mounted } = useLanguage()

  if (!mounted) return <div className="w-12 h-9" aria-hidden />

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={toggleLang}
      data-lang={lang}
      aria-label={lang === 'en' ? 'Switch language to Hindi / Hinglish' : 'Switch language to English'}
      title={lang === 'en' ? 'Switch to हिंदी / Hinglish' : 'Switch to English'}
      className="h-9 px-2.5 rounded-lg gap-1.5 text-xs font-semibold border border-border/40 bg-muted/20 hover:bg-muted/50 hover:border-primary/40 transition-colors"
    >
      <Languages className="h-3.5 w-3.5 text-primary" />
      <span>{lang === 'en' ? 'EN' : 'हिं'}</span>
    </Button>
  )
}
