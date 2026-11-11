'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { useMessages } from '@/components/LocaleProvider'
import AnimatedIcon from '@/components/AnimatedIcons'
import Header from '@/components/Header'
import { trackSubscribeClick, trackEvent } from '@/lib/analytics'
import styles from './page.module.css'

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID
const PADDLE_CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
const PADDLE_SANDBOX = process.env.NEXT_PUBLIC_PADDLE_SANDBOX === 'true'
const PADDLE_PRICE_MONTHLY = process.env.NEXT_PUBLIC_PADDLE_PRICE_MONTHLY
const PADDLE_PRICE_YEARLY = process.env.NEXT_PUBLIC_PADDLE_PRICE_YEARLY
// Same plans without the 3-day trial, for parents who already had one: a
// Paddle price gives its trial to every new subscription, so the backend
// decides which price this parent gets (GET /paddle/trial_eligibility).
// Unset means every parent keeps the trial price, as before.
const PADDLE_PRICE_MONTHLY_NO_TRIAL = process.env.NEXT_PUBLIC_PADDLE_PRICE_MONTHLY_NO_TRIAL
const PADDLE_PRICE_YEARLY_NO_TRIAL = process.env.NEXT_PUBLIC_PADDLE_PRICE_YEARLY_NO_TRIAL
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
const TRIAL_CHECK_TIMEOUT_MS = 5000
// Single shared promo campaign surfaced from LINE (e.g. an expiry-reminder
// push). The `?discount=` value must match this code before the mapped
// Paddle discount ID gets pre-applied, so a stray/mistyped query param does
// nothing rather than silently discounting checkout.
const PADDLE_PROMO_DISCOUNT_CODE = process.env.NEXT_PUBLIC_PADDLE_PROMO_DISCOUNT_CODE
const PADDLE_PROMO_DISCOUNT_ID = process.env.NEXT_PUBLIC_PADDLE_PROMO_DISCOUNT_ID

// Identifier attached to checkouts opened from the LINE-less preview flow.
// Used by the payment provider to review the purchase flow end-to-end.
const PREVIEW_IDENTIFIER = 'paddle-review-preview'

const DISCOUNT_STORAGE_KEY = 'dogtor_subscribe_discount'
const PLANS = ['monthly', 'yearly']

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
  // null until the backend has answered; checkout waits for it so a parent
  // cannot reach the trial price by tapping before the answer arrives.
  const [trialEligible, setTrialEligible] = useState(null)

  const isCanceled = searchParams.get('canceled') === '1'

  // LINE login sends the parent back to the LIFF endpoint without our query
  // string, so a promo link's ?discount= is kept in sessionStorage across it.
  const [discountParam, setDiscountParam] = useState(searchParams.get('discount'))
  useEffect(() => {
    if (discountParam) return
    try {
      const saved = sessionStorage.getItem(DISCOUNT_STORAGE_KEY)
      if (saved) setDiscountParam(saved)
    } catch {}
  }, [discountParam])
  const promoDiscountId =
    discountParam &&
    PADDLE_PROMO_DISCOUNT_CODE &&
    discountParam.toUpperCase() === PADDLE_PROMO_DISCOUNT_CODE.toUpperCase()
      ? PADDLE_PROMO_DISCOUNT_ID
      : undefined

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
          const discount = new URLSearchParams(window.location.search).get('discount')
          if (discount) {
            try {
              sessionStorage.setItem(DISCOUNT_STORAGE_KEY, discount)
            } catch {}
          }
          liff.login({ redirectUri: window.location.href })
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

  useEffect(() => {
    if (!lineUserId) return
    const noTrialConfigured = PADDLE_PRICE_MONTHLY_NO_TRIAL && PADDLE_PRICE_YEARLY_NO_TRIAL
    if (previewMode || !noTrialConfigured || !API_BASE) {
      setTrialEligible(true)
      return
    }

    // Fails open: if the backend is slow or down, keep the trial price.
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TRIAL_CHECK_TIMEOUT_MS)
    fetch(
      `${API_BASE}/paddle/trial_eligibility?parent_identifier=${encodeURIComponent(lineUserId)}`,
      { signal: controller.signal }
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => {
        const eligible = body?.data?.trial_eligible !== false
        setTrialEligible(eligible)
        trackEvent('subscribe_trial_eligibility', { eligible })
      })
      .catch(() => setTrialEligible(true))
      .finally(() => clearTimeout(timer))

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [lineUserId, previewMode])

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

  // 只有上一頁確實是站內頁面時才回上一頁。從 LINE 官方帳號選單開啟時沒有
  // 上一頁，而 LIFF 登入會在 history 留下 access.line.me——兩種情況直接
  // history.back() 不是沒反應就是重新觸發登入。
  const goBack = useCallback(() => {
    let sameOrigin = false
    try {
      sameOrigin =
        !!document.referrer &&
        new URL(document.referrer).origin === window.location.origin
    } catch {
      sameOrigin = false
    }

    if (sameOrigin) {
      window.history.back()
    } else {
      window.location.href = '/parent-pro'
    }
  }, [])

  const handleSubscribe = useCallback(async () => {
    if (!lineUserId || submitting || trialEligible === null) return

    setSubmitting(true)
    localStorage.setItem('dogtor_parent_id', lineUserId)
    trackSubscribeClick(plan, !!promoDiscountId)

    try {
      const priceId = trialEligible
        ? plan === 'monthly' ? PADDLE_PRICE_MONTHLY : PADDLE_PRICE_YEARLY
        : plan === 'monthly' ? PADDLE_PRICE_MONTHLY_NO_TRIAL : PADDLE_PRICE_YEARLY_NO_TRIAL
      window.Paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        ...(promoDiscountId ? { discountId: promoDiscountId } : {}),
        customData: {
          parent_identifier: lineUserId,
          parent_type: previewMode ? 'preview' : 'line',
          plan_type: plan,
          trial: trialEligible,
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
  }, [lineUserId, plan, submitting, previewMode, promoDiscountId, trialEligible])

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
      <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.canceled}>
            <h1 className={styles.canceledTitle}>{sub.canceled}</h1>
            <p className={styles.canceledDesc}>{sub.canceledDesc}</p>
          </div>
        </div>
      </main>
      </>
    )
  }

  if (error === 'liff' || !liffReady) {
    return (
      <>
      <Header />
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
      </>
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
        <button className={styles.backBtn} onClick={goBack}>
          ← {sub.back}
        </button>
        <h1 className={styles.title}>{sub.choosePlan}</h1>

        {/* 標價跟 parent-pro 同步：原價劃掉、顯示特價；帶有效優惠碼時再打 9 折。
            優惠碼要在結帳前就看得到，否則家長要到 Paddle 視窗裡才發現有折扣。 */}
        <p className={styles.promoNotice}>
          {promoDiscountId ? sub.promoNotice : pp.promoNotice}
        </p>

        <div className={styles.planGrid} role="radiogroup" aria-label={sub.choosePlan}>
          {PLANS.map((key) => {
            const isMonthly = key === 'monthly'
            const selected = plan === key
            const badge = isMonthly
              ? (promoDiscountId ? sub.promoBadge : pp.promoBadge)
              : (promoDiscountId ? sub.promoYearlySave : pp.yearlySave)
            return (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={selected}
                className={`${styles.planCard} ${selected ? styles.planCardSelected : ''}`}
                onClick={() => {
                  setPlan(key)
                  trackEvent('subscribe_plan_toggle', { plan: key })
                }}
              >
                <span className={isMonthly ? styles.planBadgeSale : styles.planBadgeSave}>
                  {badge}
                </span>
                <span className={styles.planRadio} aria-hidden="true" />
                <span className={styles.planName}>{isMonthly ? pp.monthlyPlan : pp.yearlyPlan}</span>
                <span className={styles.planPriceOriginal}>
                  {isMonthly ? pp.monthlyOriginalPrice : pp.yearlyOriginalPrice}
                </span>
                <span className={styles.planPrice}>
                  {promoDiscountId
                    ? (isMonthly ? sub.promoMonthlyPrice : sub.promoYearlyPrice)
                    : (isMonthly ? sub.monthlyPrice : sub.yearlyPrice)}
                </span>
                <span className={styles.planDaily}>
                  {promoDiscountId
                    ? (isMonthly ? sub.promoMonthlyDailyPrice : sub.promoYearlyDailyPrice)
                    : (isMonthly ? pp.monthlyDailyPrice : pp.yearlyDailyPrice)}
                </span>
              </button>
            )
          })}
        </div>

        {/* Submit */}
        <button
          className={styles.subscribeBtn}
          onClick={handleSubscribe}
          disabled={submitting || !paddleReady || trialEligible === null}
        >
          {submitting
            ? sub.subscribing
            : trialEligible === false ? sub.subscribeNoTrial : sub.subscribe}
        </button>
        {sub.trialNote && (
          <p className={styles.trialNote}>
            {trialEligible === false
              ? promoDiscountId ? sub.promoNoTrialNote : sub.noTrialNote
              : promoDiscountId ? sub.promoTrialNote : sub.trialNote}
          </p>
        )}

        <div className={styles.planFeatures}>
          <p className={styles.planFeaturesTitle}>{sub.featuresTitle}</p>
          {pp.planFeatures.map((f, i) => (
            <div
              key={i}
              className={`${styles.planFeature} ${f.important ? styles.planFeatureImportant : ''}`}
            >
              <AnimatedIcon name={f.icon} size={f.important ? 22 : 20} color={f.color} />
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
    </>
  )
}
