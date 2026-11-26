#!/usr/bin/env node
/**
 * 把兩個網站 sitemap 裡的所有網址送給 IndexNow（Bing、Yandex、Naver、Seznam 共用）。
 * ChatGPT 搜尋、Copilot 等 AI 搜尋多半用 Bing 的索引，所以新文章送 IndexNow 能讓 AI 更快看到。
 *
 * 用法（部署完成後執行）：
 *   node scripts/indexnow.mjs            # 兩個網站都送
 *   node scripts/indexnow.mjs global     # 只送國際站
 *
 * 金鑰是公開的（IndexNow 用 https://<host>/<key>.txt 驗證網站擁有權），不是秘密。
 * 檔案在 public/55d7c601d2e347c3ac0b4fc730d81fe7.txt；換金鑰時兩邊要一起改。
 */
const KEY = '55d7c601d2e347c3ac0b4fc730d81fe7'

const SITES = {
  tw: 'https://dogtor.superb-tutor.com',
  global: 'https://global.superb-tutor.com',
}

async function urlsFromSitemap(base) {
  const res = await fetch(`${base}/sitemap.xml`)
  if (!res.ok) throw new Error(`${base}/sitemap.xml → HTTP ${res.status}`)
  const xml = await res.text()
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim())
}

async function submit(base) {
  const host = new URL(base).host
  const urlList = await urlsFromSitemap(base)
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host, key: KEY, keyLocation: `${base}/${KEY}.txt`, urlList }),
  })
  // 200／202 都代表收到；403 通常是金鑰檔還沒部署上線
  console.log(`${host}: ${urlList.length} 個網址 → HTTP ${res.status}`)
}

const only = process.argv[2]
for (const [name, base] of Object.entries(SITES)) {
  if (!only || only === name) await submit(base)
}
