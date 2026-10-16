import { STORE_RATINGS } from '@/data/reviews'

const APP_STORE_ID = '6751773627'

// App Store 的評分從 Apple 公開的 iTunes Lookup API 抓，每天更新一次。
// Google Play 沒有公開的評分 API，只能用 data/reviews.js 裡手動填的數字。
// 抓不到（逾時、API 掛掉）時退回手動填的數字，不讓整頁壞掉。
async function fetchAppStoreRating() {
  try {
    const res = await fetch(`https://itunes.apple.com/lookup?id=${APP_STORE_ID}&country=tw`, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(3000),
    })
    if (!res.ok) return null
    const app = (await res.json()).results?.[0]
    if (!app?.averageUserRating) return null
    return { rating: app.averageUserRating, count: app.userRatingCount ?? null }
  } catch {
    return null
  }
}

// 兩個商店的評分依評分數加權平均，給結構化資料用。
export function combineRatings(ratings) {
  const stores = Object.values(ratings).filter((s) => s.rating != null && s.count)
  const count = stores.reduce((sum, s) => sum + s.count, 0)
  if (count === 0) return null
  const rating = stores.reduce((sum, s) => sum + s.rating * s.count, 0) / count
  return { rating: Math.round(rating * 10) / 10, count }
}

export async function getStoreRatings() {
  const appStore = await fetchAppStoreRating()
  return {
    appStore: { ...STORE_RATINGS.appStore, ...appStore },
    googlePlay: STORE_RATINGS.googlePlay,
  }
}
