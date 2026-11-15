/**
 * 拼音網址很長，外部網站、論壇和 AI 聊天機器人引用文章時常把 slug 抄錯
 * （例如 yue 打成 vue、少一段 yue-）。Search Console 裡這些錯字網址都是 404，
 * 等於白白浪費點擊和外部連結。這裡找出和錯字最接近的真實 slug，讓文章頁 308 轉過去。
 */

function editDistance(a, b) {
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0]
    prev[0] = i
    for (let j = 1; j <= b.length; j++) {
      const temp = prev[j]
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1))
      diag = temp
    }
  }
  return prev[b.length]
}

/**
 * 回傳最接近 `slug` 的真實 slug；差太多或有兩篇一樣接近時回傳 null，
 * 避免把不相干的網址導到錯的文章。
 */
export function closestSlug(slug, slugs) {
  const input = String(slug || '').toLowerCase().replace(/\/+$/, '')
  if (!input) return null
  // 容許的差異：至少 2 個字元，長網址最多約 15%
  const maxDistance = Math.max(2, Math.floor(input.length * 0.15))
  let best = null
  let bestDistance = Infinity
  let tie = false
  for (const candidate of slugs) {
    const d = editDistance(input, candidate)
    if (d < bestDistance) {
      best = candidate
      bestDistance = d
      tie = false
    } else if (d === bestDistance) {
      tie = true
    }
  }
  if (bestDistance > maxDistance || tie) return null
  return best
}
