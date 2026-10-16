'use client'

import { useEffect } from 'react'
import Script from 'next/script'

// 用 IG 官方 embed.js 嵌入 Reels，高度才會跟著內容自動撐開（純 iframe 做不到）。
// 腳本被擋掉時，blockquote 裡的連結就是後備內容。
export default function InstagramEmbed({ url, label }) {
  // 從別頁用 client-side 導覽進來時腳本已經載過，要手動再掃一次。
  useEffect(() => {
    window.instgrm?.Embeds.process()
  }, [url])

  return (
    <>
      <Script src="https://www.instagram.com/embed.js" strategy="lazyOnload" />
      <blockquote className="instagram-media" data-instgrm-permalink={url} data-instgrm-version="14">
        <a href={url} target="_blank" rel="noreferrer">{label}</a>
      </blockquote>
    </>
  )
}
