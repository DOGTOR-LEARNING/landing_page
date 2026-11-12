'use client'

import { useState, useEffect } from 'react'
import { useMessages } from '@/components/LocaleProvider'
import AnimatedIcon from '@/components/AnimatedIcons'
import { trackEvent } from '@/lib/analytics'
import { GIFT_TOKEN_KEY } from '../GiftClient'
import styles from '../../subscribe/page.module.css'
import giftStyles from '../gift.module.css'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
// The webhook usually lands within seconds; give it the same ~30 s as
// /subscribe/success before telling the buyer to check their email.
const MAX_RETRIES = 15
const RETRY_INTERVAL = 2000

export default function GiftSuccess() {
  const m = useMessages()
  const g = m.gift

  const [gift, setGift] = useState(null)
  const [token, setToken] = useState(null)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const t = localStorage.getItem(GIFT_TOKEN_KEY)
    if (!t) {
      setError(g.missingToken)
      return undefined
    }
    setToken(t)

    let cancelled = false
    async function poll() {
      for (let i = 0; i < MAX_RETRIES && !cancelled; i++) {
        try {
          const res = await fetch(`${API_BASE}/gift/${encodeURIComponent(t)}`)
          if (res.ok) {
            const data = await res.json()
            if (data.success && data.data.status !== 'pending') {
              setGift(data.data)
              trackEvent('gift_success', { status: data.data.status })
              return
            }
          } else if (res.status === 404) {
            setError(g.missingToken)
            return
          }
        } catch {
          // A dropped request is retried like a pending one.
        }
        await new Promise((r) => setTimeout(r, RETRY_INTERVAL))
      }
      if (!cancelled) setError(g.errorCode)
    }
    poll()
    return () => {
      cancelled = true
    }
  }, [g])

  const handleCopy = async () => {
    trackEvent('gift_code_copy')
    try {
      await navigator.clipboard.writeText(gift.auth_code)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = gift.auth_code
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (error) {
    return (
      <main className={styles.main}>
        <div className={styles.successContainer}>
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        </div>
      </main>
    )
  }

  if (!gift) {
    return (
      <main className={styles.main}>
        <div className={styles.successContainer}>
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>{g.loadingCode}</p>
          </div>
        </div>
      </main>
    )
  }

  const manageHref = `/gift/manage?token=${encodeURIComponent(token)}`

  if (gift.status === 'donated') {
    return (
      <main className={styles.main}>
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>
            <AnimatedIcon name="Sparkles" size={72} color="#e17055" strokeWidth={1.4} variant="bounce" />
          </div>
          <h1 className={styles.successTitle}>{g.donatedTitle}</h1>
          <p className={styles.successDesc}>{g.donatedDesc}</p>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <div className={styles.successContainer}>
        <div className={styles.successIcon}>
          <AnimatedIcon name="PartyPopper" size={72} color="#f59b03" strokeWidth={1.4} variant="bounce" />
        </div>
        <h1 className={styles.successTitle}>{g.successTitle}</h1>
        <p className={styles.successDesc}>{g.successDesc}</p>

        <div className={styles.codeBox}>
          <p className={styles.codeLabel}>
            {g.authCode}
            <span className={styles.codePlanBadge}>{g.plans[gift.duration_days]?.name}</span>
          </p>
          <p className={styles.codeValue}>{gift.auth_code}</p>
          <button
            className={`${styles.copyBtn} ${copied ? styles.copiedBtn : ''}`}
            onClick={handleCopy}
          >
            {copied ? g.copied : g.copyCode}
          </button>
        </div>

        <p className={styles.codeExpiry}>{g.codeExpiry}</p>

        {gift.is_recurring && (
          <p className={styles.codeExpiry}>
            {g.recurringNote}
            <br />
            <a className={giftStyles.manageLink} href={manageHref}>{g.manageLink}</a>
          </p>
        )}

        <div className={styles.steps}>
          <h3 className={styles.stepsTitle}>{g.stepTitle}</h3>
          <ol className={styles.stepsList}>
            <li>{g.step1}</li>
            <li>{g.step2}</li>
            <li>{g.step3}</li>
          </ol>
        </div>
      </div>
    </main>
  )
}
