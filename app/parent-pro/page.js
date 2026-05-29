'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useMessages } from '@/components/LocaleProvider'
import AnimatedIcon from '@/components/AnimatedIcons'
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

          {/* Section 1: Core Feature (LINE Reports) */}
          <section className={styles.splitSection}>
            <div className={styles.splitText}>
              <div className={`${styles.sectionBadge} ${styles.badgeGreen}`}>
                {pp.coreFeatureBadge}
              </div>
              <h2 className={styles.splitTitle}>{pp.coreFeatureTitle}</h2>
              <p className={styles.splitDesc}>{pp.coreFeatureDesc}</p>
            </div>
            <div className={styles.splitImage}>
              <div className={styles.imagePlaceholder}>
                <AnimatedIcon name="LineChart" size={64} color="#06C755" strokeWidth={1.5} variant="float" />
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Image Placeholder (e.g., LINE Bot Screenshot)</span>
              </div>
            </div>
          </section>

          {/* Section 2: Supercharged Learning (Zig-Zag Reverse) */}
          <section className={`${styles.splitSection} ${styles.splitSectionReverse}`}>
            <div className={styles.splitText}>
              <div className={`${styles.sectionBadge} ${styles.badgeOrange}`}>
                Power Up
              </div>
              <h2 className={styles.splitTitle}>{m.locale === 'en' ? 'Supercharged Learning' : '全面升級學習動力'}</h2>
              <p className={styles.splitDesc}>
                {m.locale === 'en' 
                  ? 'Equip your child with unlimited resources to keep the momentum going without any interruptions.'
                  : '提供孩子無限的學習資源，讓探索知識的動能持續不中斷。'}
              </p>
              
              <div className={styles.featureList}>
                <div className={styles.featureItem}>
                  <div className={styles.featureItemIcon}>
                    <AnimatedIcon name="BatteryCharging" size={24} color="#FFD166" strokeWidth={2} variant="float" />
                  </div>
                  <div className={styles.featureItemText}>
                    <h3 className={styles.featureItemTitle}>{pp.featureEnergyTitle}</h3>
                    <p className={styles.featureItemDesc}>{pp.featureEnergyDesc}</p>
                  </div>
                </div>
                
                <div className={styles.featureItem}>
                  <div className={styles.featureItemIcon}>
                    <AnimatedIcon name="Database" size={24} color="#06D6A0" strokeWidth={2} variant="float" />
                  </div>
                  <div className={styles.featureItemText}>
                    <h3 className={styles.featureItemTitle}>{pp.featureBankTitle}</h3>
                    <p className={styles.featureItemDesc}>{pp.featureBankDesc}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.splitImage}>
              <div className={styles.imagePlaceholder}>
                <AnimatedIcon name="BatteryCharging" size={64} color="#FFD166" strokeWidth={1.5} variant="float" />
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Image Placeholder (e.g., App Island/Energy UI)</span>
              </div>
            </div>
          </section>

          {/* Section 3: Personalized & Focused */}
          <section className={styles.splitSection}>
            <div className={styles.splitText}>
              <div className={`${styles.sectionBadge} ${styles.badgeBlue}`}>
                Focused
              </div>
              <h2 className={styles.splitTitle}>{m.locale === 'en' ? 'Personalized AI Guidance' : 'AI 精準客製化學習'}</h2>
              <p className={styles.splitDesc}>
                {m.locale === 'en' 
                  ? 'Leverage advanced AI to tailor every exam and answer every question instantly, turning weaknesses into strengths.'
                  : '運用先進 AI 技術為孩子量身打造專屬試卷，並即時解答疑惑，將弱點徹底轉化為強項。'}
              </p>
              
              <div className={styles.featureList}>
                <div className={styles.featureItem}>
                  <div className={styles.featureItemIcon}>
                    <AnimatedIcon name="FileEdit" size={24} color="#118AB2" strokeWidth={2} variant="float" />
                  </div>
                  <div className={styles.featureItemText}>
                    <h3 className={styles.featureItemTitle}>{pp.featureCustomTitle}</h3>
                    <p className={styles.featureItemDesc}>{pp.featureCustomDesc}</p>
                  </div>
                </div>
                
                <div className={styles.featureItem}>
                  <div className={styles.featureItemIcon}>
                    <AnimatedIcon name="Sparkles" size={24} color="#EF476F" strokeWidth={2} variant="float" />
                  </div>
                  <div className={styles.featureItemText}>
                    <h3 className={styles.featureItemTitle}>{pp.featureNotebookTitle}</h3>
                    <p className={styles.featureItemDesc}>{pp.featureNotebookDesc}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.splitImage}>
              <div className={styles.imagePlaceholder}>
                <AnimatedIcon name="Sparkles" size={64} color="#118AB2" strokeWidth={1.5} variant="float" />
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Image Placeholder (e.g., Custom Exam / Mistake UI)</span>
              </div>
            </div>
          </section>

          {/* Ad-Free Banner */}
          <section className={styles.adFreeBanner}>
            <div className={styles.adFreeBannerContent}>
              <AnimatedIcon name="ShieldCheck" size={48} color="#EF476F" strokeWidth={1.5} variant="bounce" />
              <h2 className={styles.adFreeTitle}>{pp.featureAdFreeTitle}</h2>
              <p className={styles.adFreeDesc}>{pp.featureAdFreeDesc}</p>
            </div>
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
                <div className={styles.planSave}>&nbsp;</div>
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
