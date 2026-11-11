'use client'

import posthog from 'posthog-js'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { detectInAppBrowser } from '@/lib/analytics'
import { isGlobalHost } from '@/lib/appHosts'

// Each market has its own PostHog project, matching the app (config/<flavor>.json).
// One deployment serves both hosts, so the key is picked from the hostname at runtime.
const POSTHOG_KEY_TW = process.env.NEXT_PUBLIC_POSTHOG_KEY || 'phc_knXIVReoLEjO8tNZv7HhKW4WatiktXTwOXkTV8dYbqI'
const POSTHOG_KEY_GLOBAL = process.env.NEXT_PUBLIC_POSTHOG_KEY_GLOBAL || 'phc_xSqVLkhSEYHqDsMEagGEWXijNaDkxg6Ao8khbqf54DCW'
// Defaults to the /ingest reverse proxy in next.config.js (same origin, so in-app browsers block it less often).
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || '/ingest'

function posthogKeyForHost(hostname) {
  // Local dev (localhost, global.localhost) must not write into the live projects.
  if (hostname === 'localhost' || hostname.endsWith('.localhost') || hostname === '127.0.0.1') return null
  return isGlobalHost(hostname) ? POSTHOG_KEY_GLOBAL : POSTHOG_KEY_TW
}

const POSTHOG_KEY = typeof window !== 'undefined' ? posthogKeyForHost(window.location.hostname.toLowerCase()) : null

if (POSTHOG_KEY) {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    // PostHog 網頁介面的位置。api_host 走代理後要另外指明，工具列與連結才會正確。
    ui_host: 'https://us.posthog.com',
    // 沒有這行時 capture_pageview 會退回舊行為：只在整頁載入時送一次 $pageview，
    // Next App Router 的 <Link> 換頁完全不計。設了才會變成 'history_change'。
    defaults: '2025-05-24',
    capture_pageleave: true,
    // Employee pages can contain private content and single-use activation links.
    before_send: event => window.location.pathname.startsWith('/admin') ? null : event,
    disable_session_recording: window.location.pathname.startsWith('/admin'),
    session_recording: { maskAllInputs: true },
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
  const pathname = usePathname()
  useEffect(() => { if (POSTHOG_KEY && pathname.startsWith('/admin')) posthog.stopSessionRecording() }, [pathname])

  // Always render the provider: the key is only known in the browser, and
  // skipping it there but not on the server would change the tree between
  // server render and hydration. Captures are no-ops while posthog is not initialised.
  return (
    <PHProvider client={posthog}>
      {children}
    </PHProvider>
  )
}
