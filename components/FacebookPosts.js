'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'

// 用臉書官方 SDK 嵌入貼文，高度才會跟著內容自動撐開（純 iframe 做不到）。
// SDK 被擋掉時，blockquote 裡的連結就是後備內容。
export default function FacebookPosts({ posts, locale, viewOriginalLabel, sponsoredLabel, className, itemClassName, captionClassName, badgeClassName }) {
  const containerRef = useRef(null)
  const sdkLocale = locale === 'en' ? 'en_US' : 'zh_TW'

  // 從別頁用 client-side 導覽進來時 SDK 已經載過，要手動再掃一次。
  useEffect(() => {
    if (window.FB) window.FB.XFBML.parse(containerRef.current)
  }, [posts])

  return (
    <>
      <Script
        src={`https://connect.facebook.net/${sdkLocale}/sdk.js#xfbml=1&version=v21.0`}
        strategy="lazyOnload"
        crossOrigin="anonymous"
      />
      <div ref={containerRef} className={className}>
        {posts.map((post) => (
          <figure key={post.url} className={itemClassName}>
            {post.author && (
              <figcaption className={captionClassName}>
                <strong>
                  {post.author}
                  {post.sponsored && <span className={badgeClassName}>{sponsoredLabel}</span>}
                </strong>
                {post.summary && <span>{post.summary}</span>}
              </figcaption>
            )}
            <div className="fb-post" data-href={post.url} data-width="auto" data-show-text="true">
              <blockquote cite={post.url} className="fb-xfbml-parse-ignore">
                <a href={post.url} target="_blank" rel="noreferrer">{viewOriginalLabel}</a>
              </blockquote>
            </div>
          </figure>
        ))}
      </div>
    </>
  )
}
