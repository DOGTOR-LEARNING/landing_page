import { headers } from 'next/headers'

export const DEFAULT_LOCALE = 'zh-TW'

/** @returns {Promise<'zh-TW' | 'en'>} */
export async function getLocale() {
  const h = await headers()
  return h.get('x-locale') === 'en' ? 'en' : DEFAULT_LOCALE
}
