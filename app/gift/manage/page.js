'use client'

import { Suspense, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { useMessages } from '@/components/LocaleProvider'
import Header from '@/components/Header'
import { trackEvent } from '@/lib/analytics'
import styles from '../../subscribe/page.module.css'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

// /subscribe/manage finds the payer through their LINE login. A gift buyer
// may have no LINE account, so this page is reached from the link in their
// gift emails, which carries the purchase token instead.
function GiftManage() {
  const m = useMessages()
  const g = m.gift
  const token = useSearchParams().get('token')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(token ? null : g.missingToken)

  const handleManage = useCallback(async () => {
    if (!token || loading) return
    setLoading(true)
    setError(null)
    trackEvent('gift_manage_click')
    try {
      const res = await fetch(`${API_BASE}/gift/${encodeURIComponent(token)}/portal`, {
        method: 'POST',
      })
      const data = await res.json().catch(() => null)
      if (data?.success && data.data?.portal_url) {
        window.location.href = data.data.portal_url
        return
      }
      setError(data?.success === false && res.ok ? g.notRecurring : g.portalError)
    } catch (err) {
      console.error('Gift portal error:', err)
      setError(g.portalError)
    } finally {
      setLoading(false)
    }
  }, [token, loading, g])

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>{g.manageTitle}</h1>
          <p className={styles.notInLineDesc}>{g.manageDesc}</p>
          {token && (
            <button
              className={styles.subscribeBtn}
              onClick={handleManage}
              disabled={loading}
              style={{ marginTop: 'var(--space-xl)' }}
            >
              {loading ? g.portalLoading : g.manageButton}
            </button>
          )}
          {error && (
            <div className={styles.error} style={{ marginTop: 'var(--space-lg)' }}>
              <p>{error}</p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}

export default function GiftManagePage() {
  return (
    <Suspense fallback={null}>
      <GiftManage />
    </Suspense>
  )
}
