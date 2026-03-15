'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { translations, Lang, TranslationKey } from '@/lib/translations'

interface LanguageContextType {
  lang: Lang
  t: (key: TranslationKey) => string
  toggleLang: () => void
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('pt')

  const t = (key: TranslationKey): string => translations[lang][key] ?? key

  const toggleLang = () => setLang(l => l === 'pt' ? 'en' : 'pt')

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
