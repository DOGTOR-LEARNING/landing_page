'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { trackPricingPlanClick } from '@/lib/analytics'
import styles from './ParentProStickyCta.module.css'

/**
 * 手機版底部常駐 CTA。parent-pro 很長，捲過 hero 之後就沒有隨手可點的按鈕，
 * 這條 bar 補上那段空窗；捲到定價區時自動收起，避免同一畫面出現兩個主要 CTA。
 */
export default function ParentProStickyCta({ label, hint, buttonText }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const heroCta = document.getElementById('hero-cta')
    const pricing = document.getElementById('pricing')
    if (!heroCta) return

    let heroScrolledPast = false
    let pricingInView = false
    const apply = () => setVisible(heroScrolledPast && !pricingInView)

    // hero 的按鈕捲出畫面「上方」才顯示，往下捲還沒到 hero 時不要跳出來
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        heroScrolledPast = !entry.isIntersecting && entry.boundingClientRect.top < 0
        apply()
      },
      { threshold: 0 }
    )
    heroObserver.observe(heroCta)

    let pricingObserver
    if (pricing) {
      pricingObserver = new IntersectionObserver(
        ([entry]) => {
          pricingInView = entry.isIntersecting
          apply()
        },
        { threshold: 0 }
      )
      pricingObserver.observe(pricing)
    }

    return () => {
      heroObserver.disconnect()
      pricingObserver?.disconnect()
    }
  }, [])

  if (!label) return null

  return (
    <div
      className={`${styles.bar} ${visible ? styles.barVisible : ''}`}
      aria-hidden={visible ? undefined : 'true'}
    >
      <div className={styles.text}>
        <span className={styles.label}>{label}</span>
        {hint && <span className={styles.hint}>{hint}</span>}
      </div>
      <Link
        href="/subscribe?plan=monthly"
        className={styles.button}
        tabIndex={visible ? undefined : -1}
        onClick={() => trackPricingPlanClick('monthly_sticky')}
      >
        {buttonText}
      </Link>
    </div>
  )
}
