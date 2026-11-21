import { createContext, useContext } from 'react'

export const LangContext = createContext('en')

// tr(value): value can be a plain string/number or { en, fr }
export function useT() {
  const lang = useContext(LangContext)
  const tr = (v) => {
    if (v == null) return ''
    if (typeof v === 'object' && !Array.isArray(v) && ('en' in v || 'fr' in v)) return v[lang] ?? v.en
    return v
  }
  return { lang, tr }
}
