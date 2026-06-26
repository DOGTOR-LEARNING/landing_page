'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useMessages } from '@/components/LocaleProvider'
import { trackPricingPlanClick } from '@/lib/analytics'
import styles from './page.module.css'

export default function Pricing() {
  const m = useMessages()
  const pr = m.pricing
  const pp = m.parentPro

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{pr.pageTitle}</h1>
            <p className={styles.pageSubtitle}>{pr.pageSubtitle}</p>
          </div>

          <div className={styles.pricingGrid}>
            {/* Free Plan */}
            <div className={styles.pricingCard}>
              <p className={styles.planLabel}>Dogtor</p>
              <h3 className={styles.planName}>{pr.freePlanName}</h3>
              <p className={styles.planPrice}>{pr.freePlanPrice}</p>
              <ul className={styles.planFeatures}>
                {pr.freePlanFeatures.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
              <Link href="/" className={`${styles.planBtn} ${styles.planBtnSecondary}`} onClick={() => trackPricingPlanClick('free')}>
                {pr.freePlanButton}
              </Link>
            </div>

            {/* Monthly Plan */}
            <div className={styles.pricingCard}>
              <p className={styles.planLabel}>{pr.parentProLabel}</p>
              <h3 className={styles.planName}>{pp.monthlyPlan}</h3>
              <p className={styles.planPrice}>{pp.monthlyPrice}</p>
              <ul className={styles.planFeatures}>
                {pp.planFeatures.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
              <Link href="/subscribe?plan=monthly" className={styles.planBtn} onClick={() => trackPricingPlanClick('monthly')}>
                {pp.subscribeButton}
              </Link>
            </div>

            {/* Yearly Plan */}
            <div className={`${styles.pricingCard} ${styles.pricingCardPopular}`}>
              <div className={styles.popularBadge}>{pp.yearlySave}</div>
              <p className={styles.planLabel}>{pr.parentProLabel}</p>
              <h3 className={styles.planName}>{pp.yearlyPlan}</h3>
              <p className={styles.planPrice}>{pp.yearlyPrice}</p>
              <p className={styles.planSave}>{pp.yearlySave}</p>
              <ul className={styles.planFeatures}>
                {pp.planFeatures.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
              <Link href="/subscribe?plan=yearly" className={styles.planBtn} onClick={() => trackPricingPlanClick('yearly')}>
                {pp.subscribeButton}
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
