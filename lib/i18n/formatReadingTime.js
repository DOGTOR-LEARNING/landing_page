/**
 * Keep reading-time formatting out of site messages objects so they stay serializable
 * when passed through React context to Client Components.
 */
export function formatGuideReadingTime(locale, minutes) {
  return locale === 'en' ? `${minutes} min read` : `約 ${minutes} 分鐘閱讀`
}
