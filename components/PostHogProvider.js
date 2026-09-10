'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { detectInAppBrowser } from '@/lib/analytics'

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || 'phc_knXIVReoLEjO8tNZv7HhKW4WatiktXTwOXkTV8dYbqI'
// 預設走 next.config.js 的 /ingest 反向代理（同源，不容易被 in-app 瀏覽器擋）。
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || '/ingest'

if (typeof window !== 'undefined' && POSTHOG_KEY) {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    // PostHog 網頁介面的位置。api_host 走代理後要另外指明，工具列與連結才會正確。
    ui_host: 'https://us.posthog.com',
    // 沒有這行時 capture_pageview 會退回舊行為：只在整頁載入時送一次 $pageview，
    // Next App Router 的 <Link> 換頁完全不計。設了才會變成 'history_change'。
    defaults: '2025-05-24',
    capture_pageleave: true,
    persistence: 'localStorage+cookie',
    cross_subdomain_cookie: true,
    loaded: (ph) => {
      const inApp = detectInAppBrowser()
      // 設成 super property，之後每個事件（含 $pageview）都會帶上，
      // 可以直接在 PostHog 依 in_app_browser 拆分 LINE / IG / Threads 流量。
      ph.register({
        in_app_browser: inApp,
        is_in_app_browser: inApp !== null,
      })
    },
  })
}

export default function PostHogProviderWrapper({ children }) {
  if (!POSTHOG_KEY) return children

  return (
    <PHProvider client={posthog}>
      {children}
    </PHProvider>
  )
}
