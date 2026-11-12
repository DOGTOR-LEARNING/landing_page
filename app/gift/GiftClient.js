'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { useSearchParams } from 'next/navigation'
import { Gift, HeartHandshake, Mail, Check } from 'lucide-react'
import { useMessages } from '@/components/LocaleProvider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { trackEvent } from '@/lib/analytics'
import styles from './gift.module.css'

const BULK_CONTACT_EMAIL = 'dogtor@superb-tutor.com'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
const PADDLE_CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
const PADDLE_SANDBOX = process.env.NEXT_PUBLIC_PADDLE_SANDBOX === 'true'

// Read by /gift/success. Kept per purchase rather than per browser: the
// success page is reached by a hard navigation and needs no login.
export const GIFT_TOKEN_KEY = 'dogtor_gift_token'

const DURATIONS = [30, 90, 365]
// Monthly equivalent shown under each length; only the year is cheaper.
const PER_MONTH = { 30: 300, 90: 300, 365: 250 }

const MODES = [
  { key: 'gift', icon: Gift },
  { key: 'donate', icon: HeartHandshake },
]

// Unlike /subscribe, no LIFF login: the buyer is not the report recipient and
// may have no LINE account. The backend hands out the Paddle price for the
// chosen options and checks it again when the payment comes in, so the price
// is never chosen here.
export default function GiftClient() {
  const m = useMessages()
  const g = m.gift
  const searchParams = useSearchParams()

  const [mode, setMode] = useState(
    searchParams.get('mode') === 'donate' ? 'donate' : 'gift'
  )
  const [duration, setDuration] = useState(90)
  const [renew, setRenew] = useState(false)
  const [paddleReady, setPaddleReady] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const donated = mode === 'donate'
  const steps = donated ? g.donateSteps : g.giftSteps

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

  const modeText = {
    gift: [g.modeGift, g.modeGiftDesc],
    donate: [g.modeDonate, g.modeDonateDesc],
  }

  return (
    <>
      <Header />
      <Script src="https://cdn.paddle.com/paddle/v2/paddle.js" onLoad={initPaddle} />
      <main className={styles.main}>
        <div className={styles.glow} aria-hidden="true" />
        <div className="container">
          <section className={styles.hero}>
            <span className={styles.badge}>{g.badge}</span>
            <h1 className={styles.heroTitle}>
              {g.heroTitle}
              <br />
              <span className="gradient-text">{g.heroTitleHighlight}</span>
            </h1>
            <p className={styles.heroSubtitle}>{g.heroSubtitle}</p>
          </section>

          <section className={styles.panel}>
            <div className={styles.stepHeader}>
              <span className={styles.stepNumber}>1</span>
              <h2 className={styles.stepTitle}>{g.stepMode}</h2>
            </div>
            <div className={styles.modeGrid} role="radiogroup" aria-label={g.stepMode}>
              {MODES.map(({ key, icon: Icon }) => {
                const selected = mode === key
                return (
                  <button
                    key={key}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    className={`${styles.option} ${selected ? styles.optionSelected : ''}`}
                    onClick={() => setMode(key)}
                  >
                    <span className={styles.modeIcon}>
                      <Icon size={26} strokeWidth={2.2} aria-hidden="true" />
                    </span>
                    <span className={styles.optionName}>{modeText[key][0]}</span>
                    <span className={styles.optionDesc}>{modeText[key][1]}</span>
                    {selected && (
                      <span className={styles.check} aria-hidden="true">
                        <Check size={16} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
            {donated && (
              <p className={styles.inlineNote}>
                <Link href="/learning-support" className={styles.inlineLink}>
                  {g.donateLinkText} →
                </Link>
              </p>
            )}

            <div className={styles.stepHeader}>
              <span className={styles.stepNumber}>2</span>
              <h2 className={styles.stepTitle}>{g.stepDuration}</h2>
            </div>
            <div className={styles.planGrid} role="radiogroup" aria-label={g.stepDuration}>
              {DURATIONS.map((days) => {
                const selected = duration === days
                return (
                  <button
                    key={days}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    className={`${styles.option} ${styles.planOption} ${selected ? styles.optionSelected : ''}`}
                    onClick={() => setDuration(days)}
                  >
                    {days === 365 && <span className={styles.saveTag}>{g.saveTag}</span>}
                    <span className={styles.planMeta}>
                      <span className={styles.planName}>{g.plans[days].name}</span>
                      <span className={styles.optionDesc}>{g.perMonth(PER_MONTH[days])}</span>
                    </span>
                    <span className={styles.planPrice}>{g.plans[days].price}</span>
                  </button>
                )
              })}
            </div>

            <label className={`${styles.renewRow} ${donated ? styles.renewDisabled : ''}`}>
              <input
                type="checkbox"
                className={styles.switchInput}
                checked={renew && !donated}
                disabled={donated}
                onChange={(e) => setRenew(e.target.checked)}
              />
              <span className={styles.switch} aria-hidden="true" />
              <span className={styles.renewText}>
                <span className={styles.renewLabel}>{g.renewLabel}</span>
                <span className={styles.renewDesc}>
                  {donated ? g.renewDonateNote : g.renewDesc}
                </span>
              </span>
            </label>

            <button
              type="button"
              className={styles.submit}
              onClick={handleSubmit}
              disabled={submitting || !paddleReady}
            >
              {submitting ? g.submitting : `${g.submit} · ${g.plans[duration].price}`}
            </button>
            <p className={styles.note}>
              {donated ? g.donateClockNote : renew ? g.recurringClockNote : g.clockNote}
            </p>

            {error && (
              <div className={styles.error} role="alert">
                {error}
              </div>
            )}
          </section>

          <section className={styles.how}>
            <h2 className={styles.sectionTitle}>{g.howTitle}</h2>
            <ol className={styles.howList}>
              {steps.map((step, i) => (
                <li key={step.title} className={styles.howCard}>
                  <span className={styles.stepNumber}>{i + 1}</span>
                  <h3 className={styles.howTitle}>{step.title}</h3>
                  <p className={styles.howDesc}>{step.desc}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className={styles.bulk}>
            <span className={styles.bulkIcon}>
              <Mail size={22} strokeWidth={2.2} aria-hidden="true" />
            </span>
            <div>
              <h2 className={styles.bulkTitle}>{g.bulkTitle}</h2>
              <p className={styles.bulkText}>
                {g.bulkNote}{' '}
                <a href={`mailto:${BULK_CONTACT_EMAIL}`} className={styles.inlineLink}>
                  {BULK_CONTACT_EMAIL}
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
