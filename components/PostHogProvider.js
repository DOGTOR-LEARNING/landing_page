'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react'
import { Suspense, useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

if (typeof window !== 'undefined' && POSTHOG_KEY) {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false,
    capture_pageleave: true,
    persistence: 'localStorage+cookie',
    cross_subdomain_cookie: true,
  })
}

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const ph = usePostHog()
  const lastCaptured = useRef('')

  useEffect(() => {
    if (!ph || !pathname) return

    const url = window.origin + pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')

    if (url === lastCaptured.current) return
    lastCaptured.current = url

    const properties = { $current_url: url }

    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
    const utmProps = {}
    let hasUtm = false
    for (const key of utmKeys) {
      const val = searchParams?.get(key)
      if (val) {
        utmProps[key] = val
        hasUtm = true
      }
    }

    if (hasUtm) {
      Object.assign(properties, utmProps)
      ph.setPersonProperties(utmProps)
    }

    const ref = searchParams?.get('ref')
    if (ref) {
      properties.referral_source = ref
    }

    ph.capture('web_pageview', properties)
  }, [pathname, searchParams, ph])

  return null
}

export default function PostHogProviderWrapper({ children }) {
  if (!POSTHOG_KEY) return children

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  )
}
