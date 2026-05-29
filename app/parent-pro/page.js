'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useMessages } from '@/components/LocaleProvider'
import styles from './page.module.css'

const LINE_BOT_URL = process.env.NEXT_PUBLIC_LINE_BOT_URL

export default function ParentPro() {
  const m = useMessages()
  const pp = m.parentPro
  const sub = m.subscribe

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          {/* Hero */}
          <section className={styles.hero}>
            <h1 className={styles.heroTitle}>
              {pp.heroTitle}
              <br />
              <span className="gradient-text">{pp.heroTitleHighlight}</span>
            </h1>
            <p className={styles.heroDesc}>{pp.heroDesc}</p>
          </section>

          {/* Features */}
          <section className={styles.featuresSection}>
            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>📊</div>
                <h3 className={styles.featureTitle}>{pp.feature1Title}</h3>
                <p className={styles.featureDesc}>{pp.feature1Desc}</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🎯</div>
                <h3 className={styles.featureTitle}>{pp.feature2Title}</h3>
                <p className={styles.featureDesc}>{pp.feature2Desc}</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🤖</div>
                <h3 className={styles.featureTitle}>{pp.feature3Title}</h3>
                <p className={styles.featureDesc}>{pp.feature3Desc}</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>💬</div>
                <h3 className={styles.featureTitle}>{pp.feature4Title}</h3>
                <p className={styles.featureDesc}>{pp.feature4Desc}</p>
              </div>
            </div>
          </section>

          {/* LINE Section */}
          <section className={styles.lineSection}>
            <h2 className={styles.lineTitle}>{pp.lineTitle}</h2>
            <p className={styles.lineDesc}>{pp.lineDesc}</p>
            <a
              href={LINE_BOT_URL}
              className={styles.lineButton}
              target="_blank"
              rel="noreferrer"
            >
              {pp.lineButton}
            </a>
          </section>

          {/* Pricing */}
          <section className={styles.pricingSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{pp.pricingTitle}</h2>
              <p className={styles.sectionSubtitle}>{pp.pricingSubtitle}</p>
            </div>

            <div className={styles.pricingGrid}>
              <div className={styles.pricingCard}>
                <h3 className={styles.planName}>{pp.monthlyPlan}</h3>
                <p className={styles.planPrice}>{pp.monthlyPrice}</p>
                <ul className={styles.planFeatures}>
                  {pp.planFeatures.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
                <Link href="/subscribe?plan=monthly" className={styles.subscribeBtn}>
                  {pp.subscribeButton}
                </Link>
              </div>

              <div className={`${styles.pricingCard} ${styles.pricingCardPopular}`}>
                <div className={styles.popularBadge}>{pp.yearlySave}</div>
                <h3 className={styles.planName}>{pp.yearlyPlan}</h3>
                <p className={styles.planPrice}>{pp.yearlyPrice}</p>
                <p className={styles.planSave}>{pp.yearlySave}</p>
                <ul className={styles.planFeatures}>
                  {pp.planFeatures.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
                <Link href="/subscribe?plan=yearly" className={styles.subscribeBtn}>
                  {pp.subscribeButton}
                </Link>
              </div>
            </div>
            <p className={styles.manageLink}>
              {pp.alreadySubscribed}{' '}
              <Link href="/subscribe/manage">{pp.manageLink}</Link>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
