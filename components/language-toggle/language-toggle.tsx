"use client"

import { useState, useEffect, createContext, useContext } from 'react'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'

type Language = 'en' | 'hi'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (en: string, hi: string) => string
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    return { language: 'en' as Language, setLanguage: () => {}, t: (en: string) => en }
  }
  return context
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('techvyro-language') as Language | null
    if (saved) setLanguage(saved)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('techvyro-language', language)
    }
  }, [language, mounted])

  const t = (en: string, hi: string) => (language === 'hi' ? hi : en)

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
      className="gap-2 text-xs"
      title={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
    >
      <Globe className="h-4 w-4" />
      {language === 'en' ? 'हिंदी' : 'EN'}
    </Button>
  )
}

// Translations for common text
export const translations = {
  hero: {
    tagline: {
      en: "India's Premier Tech Content Creator",
      hi: "India का No.1 Tech Content Creator",
    },
    title: {
      en: 'We Make Brands Go Viral',
      hi: 'Brands Ko Viral Banate Hain',
    },
    subtitle: {
      en: 'Authentic tech reviews, unboxings, and brand collaborations that drive real engagement and conversions.',
      hi: 'Authentic tech reviews, unboxings, aur brand collaborations jo real engagement aur conversions laate hain.',
    },
    cta: {
      en: 'Start Collaboration',
      hi: 'Collab Shuru Karein',
    },
  },
  stats: {
    followers: { en: 'Followers', hi: 'Followers' },
    views: { en: 'Views', hi: 'Views' },
    posts: { en: 'Posts', hi: 'Posts' },
  },
  sections: {
    work: {
      en: 'Featured Productions',
      hi: 'Best Content',
    },
    testimonials: {
      en: 'Brands & Press Speak',
      hi: 'Brands Kya Kehte Hain',
    },
    packages: {
      en: 'Pick Your Growth Pack',
      hi: 'Apna Package Chunein',
    },
    contact: {
      en: 'Start Your Campaign',
      hi: 'Campaign Shuru Karein',
    },
  },
  cta: {
    bookCall: { en: 'Book a Call', hi: 'Call Book Karein' },
    viewWork: { en: 'View Our Work', hi: 'Humara Kaam Dekhein' },
    sendBrief: { en: 'Send Brief', hi: 'Brief Bhejein' },
    downloadKit: { en: 'Download Media Kit', hi: 'Media Kit Download' },
  },
  contact: {
    name: { en: 'Your Name', hi: 'Aapka Naam' },
    email: { en: 'Email Address', hi: 'Email Address' },
    company: { en: 'Company/Brand', hi: 'Company/Brand' },
    budget: { en: 'Budget Range', hi: 'Budget Range' },
    message: { en: 'Tell us about your campaign', hi: 'Apne campaign ke baare mein batayein' },
    submit: { en: 'Send Brief', hi: 'Brief Bhejein' },
  },
}
