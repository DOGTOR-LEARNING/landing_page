'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useMessages } from '@/components/LocaleProvider'
import styles from '../page.module.css'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
const MAX_RETRIES = 5
const RETRY_INTERVAL = 2000

export default function SubscribeSuccess() {
  const searchParams = useSearchParams()
  const m = useMessages()
  const sub = m.subscribe

  const [authCode, setAuthCode] = useState(null)
  const [expiresAt, setExpiresAt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [copied, setCopied] = useState(false)

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
            if (data.success && data.data?.auth_code) {
              setAuthCode(data.data.auth_code)
              setExpiresAt(data.data.expires_at)
              setLoading(false)
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

  const handleCopy = async () => {
    if (!authCode) return
    try {
      await navigator.clipboard.writeText(authCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = authCode
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
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
        <div className={styles.successIcon}>🎉</div>
        <h1 className={styles.successTitle}>{sub.successTitle}</h1>
        <p className={styles.successDesc}>{sub.successDesc}</p>

        <div className={styles.codeBox}>
          <p className={styles.codeLabel}>{sub.authCode}</p>
          <p className={styles.codeValue}>{authCode}</p>
          <button
            className={`${styles.copyBtn} ${copied ? styles.copiedBtn : ''}`}
            onClick={handleCopy}
          >
            {copied ? sub.copied : sub.copyCode}
          </button>
        </div>

        <p className={styles.codeExpiry}>{sub.codeExpiry}</p>

        <div className={styles.steps}>
          <h3 className={styles.stepsTitle}>{sub.stepTitle}</h3>
          <ol className={styles.stepsList}>
            <li>{sub.step1}</li>
            <li>{sub.step2}</li>
            <li>{sub.step3}</li>
          </ol>
        </div>
      </div>
    </main>
  )
}
