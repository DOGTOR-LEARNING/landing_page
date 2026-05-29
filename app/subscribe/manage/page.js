'use client'

import { useState, useEffect, useCallback } from 'react'
import { useMessages } from '@/components/LocaleProvider'
import styles from '../page.module.css'

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export default function ManageSubscription() {
  const m = useMessages()
  const sub = m.subscribe

  const [liffReady, setLiffReady] = useState(false)
  const [lineUserId, setLineUserId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [portalLoading, setPortalLoading] = useState(false)
  const [portalError, setPortalError] = useState(null)

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

  const handleManage = useCallback(async () => {
    if (!lineUserId || portalLoading) return

    setPortalLoading(true)
    setPortalError(null)

    try {
      const res = await fetch(`${API_BASE}/paddle/portal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parent_identifier: lineUserId }),
      })
      const data = await res.json()

      if (data.success && data.data?.portal_url) {
        window.location.href = data.data.portal_url
      } else {
        setPortalError(data.message || sub.portalError)
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
            <div className={styles.notInLineIcon}>📱</div>
            <h1 className={styles.notInLineTitle}>{sub.notInLine}</h1>
            <p className={styles.notInLineDesc}>{sub.notInLineDesc}</p>
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
