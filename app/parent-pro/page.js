'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useMessages } from '@/components/LocaleProvider'
import AnimatedIcon from '@/components/AnimatedIcons'
import styles from './page.module.css'

const LINE_BOT_URL = process.env.NEXT_PUBLIC_LINE_BOT_URL
const DAILY_CARDS = [1, 2, 3, 4]

export default function ParentPro() {
  const m = useMessages()
  const pp = m.parentPro
  const sub = m.subscribe
  const dailyReportsRef = useRef(null)
  const stageRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    let rafId = 0
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4)

    const update = () => {
      const section = dailyReportsRef.current
      if (!section) return

      const rect = section.getBoundingClientRect()
      const total = section.offsetHeight - window.innerHeight
      let p = 0
      if (total > 0) {
        p = Math.max(0, Math.min(1, -rect.top / total))
      }

      const N = DAILY_CARDS.length

      cardsRef.current.forEach((card, i) => {
        if (!card) return
        
        // Calculate relative progress for this card
        const cp = p * (N - 1) - i
        
        let x = 0
        let y = 0
        let scale = 1
        let opacity = 1
        let zIndex = 10 - i
        
        if (cp <= 0) {
          // Upcoming cards (stacked to the right)
          const dist = -cp
          x = dist * 40
          y = dist * 15
          scale = 1 - dist * 0.05
          opacity = 1 - dist * 0.1
        } else {
          // Active & past cards (moving to the left non-linearly)
          const easeCp = Math.min(1, cp)
          const moveProgress = easeOutQuart(easeCp)
          
          x = -moveProgress * (card.offsetWidth * 1.5)
          y = 0
          scale = 1 + moveProgress * 0.05
          opacity = 1 - moveProgress * 1.5
        }
        
        card.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        card.style.opacity = Math.max(0, opacity)
        card.style.zIndex = zIndex
      })
    }

    const onScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = 0
        update()
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          {/* Hero */}
          <section className={styles.hero}>
            <div className={styles.heroBadge}>{pp.heroBadge}</div>

            <div className={styles.heroTitleRow}>
              <h1 className={styles.heroTitle}>
                {pp.heroTitle}
                <br />
                <span className="gradient-text">{pp.heroTitleHighlight}</span>
              </h1>
              <div className={styles.heroCorgi} aria-hidden="true">
                <div className={styles.heroCorgiAura} />
                <div className={styles.heroCorgiSparkle} data-sparkle="1" />
                <div className={styles.heroCorgiSparkle} data-sparkle="2" />
                <div className={styles.heroCorgiSparkle} data-sparkle="3" />
                <div className={styles.heroCorgiImgWrap}>
                  <Image
                    src="/question-corgi.png"
                    alt=""
                    width={320}
                    height={285}
                    className={styles.heroCorgiImg}
                    priority
                  />
                </div>
              </div>
            </div>

            <p className={styles.heroDesc}>{pp.heroDesc}</p>

            <div className={styles.heroBenefits}>
              {pp.planFeatures.slice(0, 4).map((f, i) => (
                <div key={i} className={styles.heroBenefit}>
                  <AnimatedIcon name={f.icon} size={18} color={f.color} strokeWidth={2.5} />
                  <span>{f.text}</span>
                </div>
              ))}
            </div>

            <div className={styles.heroCtas}>
              <a href="#pricing" className={styles.heroCtaPrimary}>
                {pp.subscribeButton}
              </a>
              <a href="#features" className={styles.heroCtaSecondary}>
                {pp.viewPlansButton}
              </a>
            </div>

            <p className={styles.heroPriceHint}>{pp.heroPriceHint}</p>
          </section>

          {/* Section 1: Core Feature (LINE Reports) */}
          <section
            id="features"
            ref={dailyReportsRef}
            className={styles.dailyReportsSection}
          >
            <div className={styles.dailyReportsSticky}>
              <div className={styles.dailyReportsLayout}>
                <div className={styles.splitText}>
                  <div className={`${styles.sectionBadge} ${styles.badgeGreen}`}>
                    {pp.coreFeatureBadge}
                  </div>
                  <h2 className={styles.splitTitle}>{pp.coreFeatureTitle}</h2>
                  <p className={styles.splitDesc}>{pp.coreFeatureDesc}</p>
                </div>
                <div ref={stageRef} className={styles.dailyCardsStage} aria-hidden="true">
                  <div className={styles.dailyCardsStrip}>
                    {DAILY_CARDS.map((idx, i) => (
                      <div 
                        key={idx} 
                        className={styles.dailyCard}
                        ref={(el) => (cardsRef.current[i] = el)}
                      >
                        <Image
                          src={`/daily-card-${idx}.png`}
                          alt=""
                          width={663}
                          height={858}
                          className={styles.dailyCardImg}
                          priority={i < 2}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 2: Supercharged Learning (Centered Block) */}
              <div className={styles.centeredSection} style={{ marginTop: 'var(--space-2xl)' }}>
                <div className={`${styles.sectionBadge} ${styles.badgeOrange}`}>
                  Power Up
                </div>
                <h2 className={styles.splitTitle} style={{ textAlign: 'center' }}>
                  {m.locale === 'en' ? 'Supercharged Learning' : '全面升級學習動力'}
                </h2>
                <p className={styles.splitDesc} style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto var(--space-lg)' }}>
                  {m.locale === 'en' 
                    ? 'Equip your child with unlimited resources to keep the momentum going without any interruptions.'
                    : '提供孩子無限的學習資源，讓探索知識的動能持續不中斷。'}
                </p>
                
                <div className={styles.featureList} style={{ width: '100%', alignItems: 'center' }}>
                  <div className={styles.featureItem} style={{ maxWidth: '550px', width: '100%' }}>
                    <div className={styles.featureItemIcon}>
                      <AnimatedIcon name="BatteryCharging" size={24} color="#FFD166" strokeWidth={2} variant="float" />
                    </div>
                    <div className={styles.featureItemText} style={{ textAlign: 'left' }}>
                      <h3 className={styles.featureItemTitle}>{pp.featureEnergyTitle}</h3>
                      <p className={styles.featureItemDesc}>{pp.featureEnergyDesc}</p>
                    </div>
                  </div>
                </div>
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
                    <AnimatedIcon name="Camera" size={24} color="#118AB2" strokeWidth={2} variant="float" />
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
          </section>

          {/* Bottom Banners */}
          <section className={styles.bottomBanners}>
            {/* Ad-Free Banner */}
            <div className={styles.adFreeBanner}>
              <div className={styles.adFreeBannerContent}>
                <AnimatedIcon name="ShieldCheck" size={48} color="#EF476F" strokeWidth={1.5} variant="bounce" />
                <h2 className={styles.adFreeTitle}>{pp.featureAdFreeTitle}</h2>
                <p className={styles.adFreeDesc}>{pp.featureAdFreeDesc}</p>
              </div>
            </div>

            {/* LINE Section */}
            <div className={styles.lineBanner}>
              <div className={styles.lineBannerContent}>
                <AnimatedIcon name="MessageCircle" size={48} color="#06C755" strokeWidth={1.5} variant="bounce" />
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
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section id="pricing" className={styles.pricingSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{pp.pricingTitle}</h2>
              <p className={styles.sectionSubtitle}>{pp.pricingSubtitle}</p>
            </div>

            <div className={styles.pricingFeatures}>
              {pp.planFeatures.map((f, i) => (
                <div key={i} className={`${styles.featureItemRow} ${f.important ? styles.featureItemImportant : ''}`}>
                  <AnimatedIcon name={f.icon} size={f.important ? 28 : 24} color={f.color} />
                  <span>{f.text}</span>
                </div>
              ))}
            </div>

            <div className={styles.pricingGrid}>
              <div className={styles.pricingCard}>
                <h3 className={styles.planName}>{pp.monthlyPlan}</h3>
                <p className={styles.planPrice}>{pp.monthlyPrice}</p>
                <p className={styles.planDailyPrice}>{pp.monthlyDailyPrice}</p>
                <div style={{ flexGrow: 1 }} />
                <Link href="/subscribe?plan=monthly" className={styles.subscribeBtn}>
                  {pp.subscribeButton}
                </Link>
              </div>

              <div className={`${styles.pricingCard} ${styles.pricingCardPopular}`}>
                <div className={styles.popularBadge}>{pp.yearlySave}</div>
                <h3 className={styles.planName}>{pp.yearlyPlan}</h3>
                <p className={styles.planPrice}>{pp.yearlyPrice}</p>
                <p className={styles.planDailyPrice}>{pp.yearlyDailyPrice}</p>
                <div style={{ flexGrow: 1 }} />
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
