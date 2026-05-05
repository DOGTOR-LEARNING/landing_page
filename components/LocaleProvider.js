'use client'

import { createContext, useContext } from 'react'
import { getMessages } from '@/lib/i18n/messages'

const LocaleContext = createContext('zh-TW')

export function LocaleProvider({ locale, children }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  return useContext(LocaleContext)
}

export function useMessages() {
  const locale = useLocale()
  return getMessages(locale)
}
