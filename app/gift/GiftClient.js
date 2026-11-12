'use client'

import { useState, useCallback } from 'react'
import Script from 'next/script'
import { useMessages } from '@/components/LocaleProvider'
import Header from '@/components/Header'
import { trackEvent } from '@/lib/analytics'
import styles from '../subscribe/page.module.css'
import giftStyles from './gift.module.css'

const BULK_CONTACT_EMAIL = 'dogtor@superb-tutor.com'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
const PADDLE_CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
const PADDLE_SANDBOX = process.env.NEXT_PUBLIC_PADDLE_SANDBOX === 'true'

// Read by /gift/success. Kept per purchase rather than per browser: the
// success page is reached by a hard navigation and needs no login.
export const GIFT_TOKEN_KEY = 'dogtor_gift_token'

const DURATIONS = [30, 90, 365]

// Unlike /subscribe, no LIFF login: the buyer is not the report recipient and
// may have no LINE account. The backend hands out the Paddle price for the
// chosen options and checks it again when the payment comes in, so the price
// is never chosen here.
export default function GiftClient() {
  const m = useMessages()
  const g = m.gift

  const [mode, setMode] = useState('gift')
  const [duration, setDuration] = useState(90)
  const [renew, setRenew] = useState(false)
  const [paddleReady, setPaddleReady] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const donated = mode === 'donate'

  const initPaddle = useCallback(() => {
    if (!window.Paddle) return
    if (PADDLE_SANDBOX) window.Paddle.Environment.set('sandbox')
    window.Paddle.Initialize({
      token: PADDLE_CLIENT_TOKEN,
      eventCallback: (event) => {
        if (event.name === 'checkout.completed') {
          trackEvent('gift_checkout_completed')
          window.location.href = '/gift/success'
        } else if (event.name === 'checkout.error') {
          trackEvent('gift_checkout_error', {
            paddle_error: event?.error?.code || event?.error?.type,
          })
        }
      },
    })
    setPaddleReady(true)
  }, [])

  const handleSubmit = useCallback(async () => {
    if (submitting || !paddleReady) return
    setSubmitting(true)
    setError(null)
    trackEvent('gift_submit', { mode, duration_days: duration, renew: renew && !donated })

    try {
      const res = await fetch(`${API_BASE}/gift/checkout-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration_days: duration,
          is_donated: donated,
          is_recurring: renew && !donated,
        }),
      })
      const data = await res.json().catch(() => null)
      if (!data?.success) {
        setError(res.status === 503 ? g.errorUnavailable : g.errorIntent)
        return
      }

      localStorage.setItem(GIFT_TOKEN_KEY, data.data.token)
      window.Paddle.Checkout.open({
        items: [{ priceId: data.data.price_id, quantity: 1 }],
        customData: { kind: 'gift', gift_token: data.data.token },
      })
    } catch (err) {
      console.error('Gift checkout error:', err)
      setError(g.errorIntent)
    } finally {
      setSubmitting(false)
    }
  }, [submitting, paddleReady, mode, duration, renew, donated, g])

  return (
    <>
      <Header />
      <Script src="https://cdn.paddle.com/paddle/v2/paddle.js" onLoad={initPaddle} />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>{g.title}</h1>
          <p className={giftStyles.subtitle}>{g.subtitle}</p>

          <p className={giftStyles.sectionLabel}>{g.modeLabel}</p>
          <div className={styles.planGrid} role="radiogroup" aria-label={g.modeLabel}>
            {[
              ['gift', g.modeGift, g.modeGiftDesc],
              ['donate', g.modeDonate, g.modeDonateDesc],
            ].map(([key, name, desc]) => (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={mode === key}
                className={`${styles.planCard} ${mode === key ? styles.planCardSelected : ''}`}
                onClick={() => setMode(key)}
              >
                <span className={styles.planRadio} aria-hidden="true" />
                <span className={styles.planName}>{name}</span>
                <span className={styles.planDaily}>{desc}</span>
              </button>
            ))}
          </div>

          <p className={giftStyles.sectionLabel}>{g.durationLabel}</p>
          <div className={giftStyles.planGrid3} role="radiogroup" aria-label={g.durationLabel}>
            {DURATIONS.map((days) => (
              <button
                key={days}
                type="button"
                role="radio"
                aria-checked={duration === days}
                className={`${styles.planCard} ${duration === days ? styles.planCardSelected : ''}`}
                onClick={() => setDuration(days)}
              >
                <span className={styles.planRadio} aria-hidden="true" />
                <span className={styles.planName}>{g.plans[days].name}</span>
                <span className={styles.planPrice}>{g.plans[days].price}</span>
              </button>
            ))}
          </div>

          <label className={donated ? giftStyles.renewRowDisabled : giftStyles.renewRow}>
            <input
              type="checkbox"
              checked={renew && !donated}
              disabled={donated}
              onChange={(e) => setRenew(e.target.checked)}
            />
            <span className={giftStyles.renewText}>
              <span>{g.renewLabel}</span>
              <span className={giftStyles.renewDesc}>
                {donated ? g.renewDonateNote : g.renewDesc}
              </span>
            </span>
          </label>

          <button
            className={styles.subscribeBtn}
            onClick={handleSubmit}
            disabled={submitting || !paddleReady}
          >
            {submitting ? g.submitting : g.submit}
          </button>
          <p className={styles.trialNote}>
            {renew && !donated ? g.recurringClockNote : g.clockNote}
          </p>
          <p className={styles.trialNote}>
            {g.bulkNote}{' '}
            <a href={`mailto:${BULK_CONTACT_EMAIL}`}>{BULK_CONTACT_EMAIL}</a>
          </p>

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
