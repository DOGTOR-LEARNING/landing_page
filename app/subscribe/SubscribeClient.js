'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { useMessages } from '@/components/LocaleProvider'
import AnimatedIcon from '@/components/AnimatedIcons'
import { trackSubscribeClick, trackEvent } from '@/lib/analytics'
import styles from './page.module.css'

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID
const PADDLE_CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
const PADDLE_SANDBOX = process.env.NEXT_PUBLIC_PADDLE_SANDBOX === 'true'
const PADDLE_PRICE_MONTHLY = process.env.NEXT_PUBLIC_PADDLE_PRICE_MONTHLY
const PADDLE_PRICE_YEARLY = process.env.NEXT_PUBLIC_PADDLE_PRICE_YEARLY

// Identifier attached to checkouts opened from the LINE-less preview flow.
// Used by the payment provider to review the purchase flow end-to-end.
const PREVIEW_IDENTIFIER = 'paddle-review-preview'

export default function SubscribeClient({ previewMode = false }) {
  const searchParams = useSearchParams()
  const m = useMessages()
  const sub = m.subscribe
  const pp = m.parentPro

  const [liffReady, setLiffReady] = useState(false)
  const [lineUserId, setLineUserId] = useState(null)
  const [plan, setPlan] = useState(searchParams.get('plan') || 'monthly')
  const [paddleReady, setPaddleReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const isCanceled = searchParams.get('canceled') === '1'

  useEffect(() => {
    // Preview flow: skip LINE sign-in entirely so the checkout is reachable
    // outside the LIFF context (e.g. for payment-provider review).
    if (previewMode) {
      setLineUserId(PREVIEW_IDENTIFIER)
      setLiffReady(true)
      setLoading(false)
      return
    }

    async function initLiff() {
      try {
        const liff = (await import('@line/liff')).default
        await liff.init({ liffId: LIFF_ID })

        if (!liff.isLoggedIn()) {
          liff.login()
          return
        }

        const profile = await liff.getProfile()
        setLineUserId(profile.userId)

        const pendingRedirect = localStorage.getItem('liff_redirect')
        if (pendingRedirect && pendingRedirect !== window.location.pathname) {
          localStorage.removeItem('liff_redirect')
          window.location.href = pendingRedirect
          return
        }
        localStorage.removeItem('liff_redirect')

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
  }, [previewMode])

  const initPaddle = useCallback(() => {
    if (window.Paddle) {
      if (PADDLE_SANDBOX) {
        window.Paddle.Environment.set('sandbox')
      }
      window.Paddle.Initialize({
        token: PADDLE_CLIENT_TOKEN,
        eventCallback: function (event) {
          if (event.name === 'checkout.completed') {
            trackEvent('subscribe_checkout_completed', { plan })
            window.location.href = '/subscribe/success'
          } else if (event.name === 'checkout.error') {
            trackEvent('subscribe_checkout_error', {
              plan,
              preview: previewMode,
              paddle_error: event?.error?.code || event?.error?.type,
              detail: event?.error?.detail,
            })
          }
        },
      })
      setPaddleReady(true)
    }
  }, [plan, previewMode])

  const handleSubscribe = useCallback(async () => {
    if (!lineUserId || submitting) return

    setSubmitting(true)
    localStorage.setItem('dogtor_parent_id', lineUserId)
    trackSubscribeClick(plan)

    try {
      const priceId = plan === 'monthly' ? PADDLE_PRICE_MONTHLY : PADDLE_PRICE_YEARLY
      window.Paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customData: {
          parent_identifier: lineUserId,
          parent_type: previewMode ? 'preview' : 'line',
          plan_type: plan,
        },
      })
    } catch (err) {
      console.error('Subscribe error:', err)
      trackEvent('subscribe_checkout_error', {
        plan,
        preview: previewMode,
        paddle_error: err?.message || 'checkout_open_failed',
      })
    }
    setSubmitting(false)
  }, [lineUserId, plan, submitting, previewMode])

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

  if (isCanceled) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.canceled}>
            <h1 className={styles.canceledTitle}>{sub.canceled}</h1>
            <p className={styles.canceledDesc}>{sub.canceledDesc}</p>
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

  return (
    <>
    <Script
      src="https://cdn.paddle.com/paddle/v2/paddle.js"
      onLoad={initPaddle}
    />
    <main className={styles.main}>
      <div className={styles.container}>
        {previewMode && (
          <p
            style={{
              margin: '0 0 16px',
              padding: '8px 12px',
              borderRadius: 8,
              background: '#FFF4E5',
              color: '#8a5a00',
              fontSize: 13,
              textAlign: 'center',
            }}
          >
            Preview mode — LINE sign-in bypassed for checkout review.
          </p>
        )}
        <button className={styles.backBtn} onClick={() => window.history.back()}>
          ← {sub.back}
        </button>
        <h1 className={styles.title}>{sub.choosePlan}</h1>

        {/* Plan Toggle */}
        <div className={styles.planToggle}>
          <button
            className={`${styles.planOption} ${plan === 'monthly' ? styles.planOptionActive : ''}`}
            onClick={() => { setPlan('monthly'); trackEvent('subscribe_plan_toggle', { plan: 'monthly' }) }}
          >
            {sub.monthly}
          </button>
          <button
            className={`${styles.planOption} ${plan === 'yearly' ? styles.planOptionActive : ''}`}
            onClick={() => { setPlan('yearly'); trackEvent('subscribe_plan_toggle', { plan: 'yearly' }) }}
          >
            {sub.yearly}
          </button>
        </div>

        {/* Plan Details */}
        <div className={styles.planDetails}>
          <p className={styles.planPrice}>
            {plan === 'monthly' ? sub.monthlyPrice : sub.yearlyPrice}
          </p>
          {plan === 'yearly' && (
            <p className={styles.planSave}>{sub.yearlySave}</p>
          )}
          <ul className={styles.planFeatures}>
            {pp.planFeatures.map((f, i) => (
              <li key={i}>{typeof f === 'string' ? f : f.text}</li>
            ))}
          </ul>
        </div>

        {/* Submit */}
        <button
          className={styles.subscribeBtn}
          onClick={handleSubscribe}
          disabled={submitting || !paddleReady}
        >
          {submitting ? sub.subscribing : sub.subscribe}
        </button>

      </div>
    </main>
    </>
  )
}
