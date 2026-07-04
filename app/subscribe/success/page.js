'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useMessages } from '@/components/LocaleProvider'
import AnimatedIcon from '@/components/AnimatedIcons'
import { trackEvent } from '@/lib/analytics'
import styles from '../page.module.css'

const LINE_BOT_URL = process.env.NEXT_PUBLIC_LINE_BOT_URL

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
const MAX_RETRIES = 15
const RETRY_INTERVAL = 2000

const PLAN_LABELS = { monthly: '月訂閱', yearly: '年訂閱' }

export default function SubscribeSuccess() {
  const searchParams = useSearchParams()
  const m = useMessages()
  const sub = m.subscribe

  const [codes, setCodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState(-1)

  useEffect(() => {
    const parentId = localStorage.getItem('dogtor_parent_id')
    if (!parentId) {
      setError(true)
      setLoading(false)
      return
    }

    let retries = 0
    let cancelled = false

    async function pollAuthCode() {
      while (retries < MAX_RETRIES && !cancelled) {
        try {
          const res = await fetch(`${API_BASE}/parent/pending_code/${parentId}`)
          if (res.ok) {
            const data = await res.json()
            if (data.success && Array.isArray(data.data) && data.data.length > 0) {
              setCodes(data.data)
              setLoading(false)
              trackEvent('subscribe_success', { code_count: data.data.length })
              return
            }
          }
        } catch (err) {
          console.error('Poll auth code error:', err)
        }

        retries++
        if (retries < MAX_RETRIES && !cancelled) {
          await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL))
        }
      }

      if (!cancelled) {
        setError(true)
        setLoading(false)
      }
    }

    pollAuthCode()
    return () => { cancelled = true }
  }, [])

  const handleCopy = async (code, index) => {
    trackEvent('auth_code_copy', { plan_type: code.plan_type })
    try {
      await navigator.clipboard.writeText(code.auth_code)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = code.auth_code
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(-1), 2000)
  }

  if (loading) {
    return (
      <main className={styles.main}>
        <div className={styles.successContainer}>
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>{sub.loadingCode}</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className={styles.main}>
        <div className={styles.successContainer}>
          <div className={styles.error}>
            <p>{sub.errorCode}</p>
          </div>
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
        <h1 className={styles.successTitle}>{sub.successTitle}</h1>
        <p className={styles.successDesc}>{sub.successDesc}</p>

        {codes.map((code, i) => (
          <div key={i} className={styles.codeBox}>
            <p className={styles.codeLabel}>
              {sub.authCode}{codes.length > 1 ? ` ${i + 1}` : ''}
              {code.plan_type && (
                <span className={styles.codePlanBadge}>
                  {PLAN_LABELS[code.plan_type] || code.plan_type}
                </span>
              )}
            </p>
            <p className={styles.codeValue}>{code.auth_code}</p>
            <button
              className={`${styles.copyBtn} ${copiedIndex === i ? styles.copiedBtn : ''}`}
              onClick={() => handleCopy(code, i)}
            >
              {copiedIndex === i ? sub.copied : sub.copyCode}
            </button>
          </div>
        ))}

        <p className={styles.codeExpiry}>{sub.codeExpiry}</p>

        <div className={styles.lineCta}>
          <p className={styles.lineCtaTitle}>{sub.lineTitle}</p>
          <p className={styles.lineCtaDesc}>{sub.lineDesc}</p>
          <a
            href={LINE_BOT_URL}
            className={styles.lineCtaButton}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent('line_add_friend_click', { source: 'subscribe_success' })}
          >
            {sub.lineButton}
          </a>
        </div>

        <div className={styles.steps}>
          <h3 className={styles.stepsTitle}>{sub.stepTitle}</h3>
          <ol className={styles.stepsList}>
            <li>{sub.step1}</li>
            <li>{sub.step2}</li>
            <li>{sub.step3}</li>
          </ol>
          <img
            className={styles.tutorialImage}
            src="https://storage.googleapis.com/dogtor_asset/linebot/%E6%8E%88%E6%AC%8A%E7%A2%BC%E7%B6%81%E5%AE%9A%E6%95%99%E5%AD%B8.png"
            alt={sub.bindTutorialAlt}
          />
        </div>
      </div>
    </main>
  )
}
