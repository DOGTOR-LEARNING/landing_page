'use client'

import { useState, useEffect, useCallback } from 'react'
import { useMessages } from '@/components/LocaleProvider'
import AnimatedIcon from '@/components/AnimatedIcons'
import { trackEvent } from '@/lib/analytics'
import styles from '../page.module.css'

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
const SUBSCRIBE_REDIRECT_DELAY_MS = 1800

function isMissingSubscription(data) {
  if (!data) return false

  const responseText = JSON.stringify(data).toLowerCase().replaceAll('\\', '')
  const hasExplicitCode = [
    'no_subscription',
    'subscription_not_found',
    'customer_not_found',
  ].some((code) => responseText.includes(code))
  const isPaddleNotFound = /"code"\s*:\s*"not_found"/.test(responseText)
    && /(customer|subscription).{0,500}not found/.test(responseText)

  return hasExplicitCode || isPaddleNotFound
}

export default function ManageSubscription() {
  const m = useMessages()
  const sub = m.subscribe

  const [liffReady, setLiffReady] = useState(false)
  const [lineUserId, setLineUserId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [portalLoading, setPortalLoading] = useState(false)
  const [portalError, setPortalError] = useState(null)
  const [missingSubscription, setMissingSubscription] = useState(false)

  useEffect(() => {
    async function initLiff() {
      try {
        const liff = (await import('@line/liff')).default
        await liff.init({ liffId: LIFF_ID })

        if (!liff.isLoggedIn()) {
          localStorage.setItem('liff_redirect', '/subscribe/manage')
          liff.login()
          return
        }

        const profile = await liff.getProfile()
        setLineUserId(profile.userId)
        setLiffReady(true)
      } catch (err) {
        console.error('LIFF init error:', err)
        setError('liff')
      }
      setLoading(false)
    }

    if (LIFF_ID) {
      initLiff()
    } else {
      setLoading(false)
      setError('liff')
    }
  }, [])

  useEffect(() => {
    if (!missingSubscription) return undefined

    trackEvent('manage_subscription_not_found_redirect')
    const redirectTimer = window.setTimeout(() => {
      window.location.replace('/subscribe')
    }, SUBSCRIBE_REDIRECT_DELAY_MS)

    return () => window.clearTimeout(redirectTimer)
  }, [missingSubscription])

  const handleManage = useCallback(async () => {
    if (!lineUserId || portalLoading) return

    setPortalLoading(true)
    setPortalError(null)
    trackEvent('manage_subscription_click')

    try {
      const res = await fetch(`${API_BASE}/paddle/portal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parent_identifier: lineUserId }),
      })
      const data = await res.json().catch(() => null)

      if (data?.success && data.data?.portal_url) {
        window.location.href = data.data.portal_url
      } else if (isMissingSubscription(data)) {
        setMissingSubscription(true)
      } else {
        console.error('Portal API error:', data)
        setPortalError(sub.portalError)
      }
    } catch (err) {
      console.error('Portal error:', err)
      setPortalError(sub.portalError)
    } finally {
      setPortalLoading(false)
    }
  }, [lineUserId, portalLoading, sub])

  if (loading) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner} />
          </div>
        </div>
      </main>
    )
  }

  if (error === 'liff' || !liffReady) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.notInLine}>
            <div className={styles.notInLineIcon}>
              <AnimatedIcon name="Smartphone" size={52} color="#74b9ff" strokeWidth={1.4} variant="shake" />
            </div>
            <h1 className={styles.notInLineTitle}>{sub.notInLine}</h1>
            <p className={styles.notInLineDesc}>{sub.notInLineDesc}</p>
          </div>
        </div>
      </main>
    )
  }

  if (missingSubscription) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.canceled} role="status" aria-live="polite">
            <h1 className={styles.canceledTitle}>{sub.noSubscriptionTitle}</h1>
            <p className={styles.canceledDesc}>{sub.noSubscriptionDesc}</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>{sub.manageTitle}</h1>
        <p className={styles.notInLineDesc}>{sub.manageDesc}</p>

        <button
          className={styles.subscribeBtn}
          onClick={handleManage}
          disabled={portalLoading}
          style={{ marginTop: 'var(--space-xl)' }}
        >
          {portalLoading ? sub.portalLoading : sub.manageButton}
        </button>

        {portalError && (
          <div className={styles.error} style={{ marginTop: 'var(--space-lg)' }}>
            <p>{portalError}</p>
          </div>
        )}
      </div>
    </main>
  )
}
