'use client'

import { createContext, useContext } from 'react'
import { getMessages } from '@/lib/i18n/messages'
import { MARKET_TW } from '@/lib/market'

const LocaleContext = createContext('zh-TW')
const MarketContext = createContext(MARKET_TW)

export function LocaleProvider({ locale, market = MARKET_TW, children }) {
  return (
    <MarketContext.Provider value={market}>
      <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
    </MarketContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}

/** `tw` or `global`: which app this page describes (see lib/market.js). */
export function useMarket() {
  return useContext(MarketContext)
}

export function useMessages() {
  return getMessages(useLocale(), useMarket())
}
