'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { useMessages } from '@/components/LocaleProvider'
import styles from './page.module.css'

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID
const PADDLE_CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
const PADDLE_SANDBOX = process.env.NEXT_PUBLIC_PADDLE_SANDBOX === 'true'
const PADDLE_PRICE_MONTHLY = process.env.NEXT_PUBLIC_PADDLE_PRICE_MONTHLY
const PADDLE_PRICE_YEARLY = process.env.NEXT_PUBLIC_PADDLE_PRICE_YEARLY

export default function Subscribe() {
  const searchParams = useSearchParams()
  const m = useMessages()
  const sub = m.subscribe
  const pp = m.parentPro
  const formRef = useRef(null)

  const [liffReady, setLiffReady] = useState(false)
  const [lineUserId, setLineUserId] = useState(null)
  const [plan, setPlan] = useState(searchParams.get('plan') || 'monthly')
  const [paymentMethod, setPaymentMethod] = useState(PADDLE_CLIENT_TOKEN ? 'paddle' : 'ecpay')
  const [paddleReady, setPaddleReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const isCanceled = searchParams.get('canceled') === '1'

  useEffect(() => {
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
  }, [])

  const initPaddle = useCallback(() => {
    if (window.Paddle) {
      if (PADDLE_SANDBOX) {
        window.Paddle.Environment.set('sandbox')
      }
      window.Paddle.Initialize({
        token: PADDLE_CLIENT_TOKEN,
        eventCallback: function (event) {
          if (event.name === 'checkout.completed') {
            window.location.href = '/subscribe/success'
          }
        },
      })
      setPaddleReady(true)
    }
  }, [])

  const handleSubscribe = useCallback(async () => {
    if (!lineUserId || submitting) return

    setSubmitting(true)
    localStorage.setItem('dogtor_parent_id', lineUserId)

    try {
      if (paymentMethod === 'paddle') {
        const priceId = plan === 'monthly' ? PADDLE_PRICE_MONTHLY : PADDLE_PRICE_YEARLY
        window.Paddle.Checkout.open({
          items: [{ priceId, quantity: 1 }],
          customData: {
            parent_identifier: lineUserId,
            parent_type: 'line',
            plan_type: plan,
          },
        })
        setSubmitting(false)
      } else if (paymentMethod === 'ecpay') {
        const res = await fetch('/api/subscribe/ecpay-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lineUserId, planType: plan }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)

        const form = formRef.current
        form.action = data.url
        form.innerHTML = ''
        for (const [key, value] of Object.entries(data.params)) {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = value
          form.appendChild(input)
        }
        form.submit()
      } else {
        const res = await fetch('/api/subscribe/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lineUserId, planType: plan }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)

        window.location.href = data.url
      }
    } catch (err) {
      console.error('Subscribe error:', err)
      setSubmitting(false)
    }
  }, [lineUserId, plan, paymentMethod, submitting])

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
            <div className={styles.notInLineIcon}>📱</div>
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
        <button className={styles.backBtn} onClick={() => window.history.back()}>
          ← {sub.back}
        </button>
        <h1 className={styles.title}>{sub.choosePlan}</h1>

        {/* Plan Toggle */}
        <div className={styles.planToggle}>
          <button
            className={`${styles.planOption} ${plan === 'monthly' ? styles.planOptionActive : ''}`}
            onClick={() => setPlan('monthly')}
          >
            {sub.monthly}
          </button>
          <button
            className={`${styles.planOption} ${plan === 'yearly' ? styles.planOptionActive : ''}`}
            onClick={() => setPlan('yearly')}
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
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>

        {/* Payment Method */}
        <div className={styles.paymentMethodSection}>
          <p className={styles.paymentMethodLabel}>{sub.paymentMethod}</p>
          <div className={styles.paymentMethods}>
            <button
              className={`${styles.paymentMethodOption} ${paymentMethod === 'paddle' ? styles.paymentMethodActive : ''}`}
              onClick={() => setPaymentMethod('paddle')}
            >
              <span className={styles.paymentMethodName}>{sub.paddle}</span>
              <span className={styles.paymentMethodDesc}>{sub.paddleDesc}</span>
            </button>
            <button
              className={`${styles.paymentMethodOption} ${paymentMethod === 'ecpay' ? styles.paymentMethodActive : ''}`}
              onClick={() => setPaymentMethod('ecpay')}
            >
              <span className={styles.paymentMethodName}>{sub.ecpay}</span>
              <span className={styles.paymentMethodDesc}>{sub.ecpayDesc}</span>
            </button>
            <button
              className={`${styles.paymentMethodOption} ${paymentMethod === 'stripe' ? styles.paymentMethodActive : ''}`}
              onClick={() => setPaymentMethod('stripe')}
            >
              <span className={styles.paymentMethodName}>{sub.stripe}</span>
              <span className={styles.paymentMethodDesc}>{sub.stripeDesc}</span>
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          className={styles.subscribeBtn}
          onClick={handleSubscribe}
          disabled={submitting || (paymentMethod === 'paddle' && !paddleReady)}
        >
          {submitting ? sub.subscribing : sub.subscribe}
        </button>

        {/* Hidden form for ECPay POST submission */}
        <form ref={formRef} method="POST" style={{ display: 'none' }} />
      </div>
    </main>
    </>
  )
}
