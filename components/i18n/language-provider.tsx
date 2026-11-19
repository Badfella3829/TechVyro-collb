"use client"

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { TRANSLATIONS, type Lang, type Translations } from '@/lib/i18n'

const STORAGE_KEY = 'tv_lang'

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  toggleLang: () => void
  t: Translations
  mounted: boolean
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  toggleLang: () => {},
  t: TRANSLATIONS.en,
  mounted: false,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'en' || saved === 'hi') {
        setLangState(saved)
        document.documentElement.lang = saved
      }
    } catch {}

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === 'en' || e.newValue === 'hi')) {
        setLangState(e.newValue)
        document.documentElement.lang = e.newValue
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
      document.documentElement.lang = next
    } catch {}
  }, [])

  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const next: Lang = prev === 'en' ? 'hi' : 'en'
      try {
        localStorage.setItem(STORAGE_KEY, next)
        document.documentElement.lang = next
      } catch {}
      return next
    })
  }, [])

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggleLang,
      t: TRANSLATIONS[lang],
      mounted,
    }),
    [lang, setLang, toggleLang, mounted]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}
