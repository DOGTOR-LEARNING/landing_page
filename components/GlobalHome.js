'use client'

import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StoreButtons from '@/components/StoreButtons'
import { useMessages } from '@/components/LocaleProvider'
import styles from '@/app/page.module.css'

/**
 * Home page of the international site. Shares the Taiwan home page's styles
 * but not its sections: there is no parent plan, learning-support programme,
 * LINE account or Chinese guide library behind this app.
 */
export default function GlobalHome() {
  const m = useMessages()
  const h = m.home

  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroBackground}></div>
          <div className="container">
            <div className={styles.heroContainer}>
              <div className={styles.heroContent}>
                <div className={styles.badgeRow}>
                  <span className={`${styles.badge} ${styles.badgeStatic}`}>{h.badge}</span>
                </div>
                <h1 className={styles.heroTitle}>
                  {h.heroTitle1}<br />
                  <span className="gradient-text">{h.heroTitle2}</span>
                </h1>
                <p className={styles.heroTagline}>{h.heroTagline}</p>
                <p className={styles.heroSubtitle}>{h.heroSubtitle}</p>
                <StoreButtons location="hero" className={styles.heroCta} />
              </div>

              <div className={styles.heroMedia}>
                {/* The Taiwan site shows an app screenshot here; it is in
                    Chinese, so this site uses the mascot until an English
                    screenshot is added. */}
                <div className={styles.heroIllustration}>
                  <Image
                    src="/feature_2.png"
                    alt={h.heroImgAlt}
                    width={656}
                    height={542}
                    priority
                    className={styles.heroIllustrationImg}
                  />
                  <div className={styles.floatingCard}>
                    <Image
                      src="/question-corgi.png"
                      alt={h.floatImgAlt}
                      width={60}
                      height={60}
                      className={styles.floatIcon}
                    />
                    <div className={styles.floatText}>
                      <span className={styles.floatTitle}>{h.floatTitle}</span>
                      <span className={styles.floatDesc}>{h.floatDesc}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.globalSubjects} id="subjects">
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{h.subjectsTitle}</h2>
              <p className={styles.sectionSubtitle}>{h.subjectsSubtitle}</p>
            </div>
            <ul className={styles.subjectChips}>
              {h.subjects.map((subject) => (
                <li key={subject} className={styles.subjectChip}>{subject}</li>
              ))}
            </ul>
            <p className={styles.subjectsNote}>{h.subjectsCustom}</p>
          </div>
        </section>

        <section className={styles.features} id="features">
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{h.featuresSectionTitle}</h2>
              <p className={styles.sectionSubtitle}>{h.featuresSectionSubtitle}</p>
              <Link href="/technology" className={styles.techLink}>{h.featuresTechLink}</Link>
            </div>

            <div className={styles.featuresGrid}>
              {h.features.map((feature) => (
                <article key={feature.title} className={`${styles.featureCard} card`}>
                  <div className={styles.featureImageContainer}>
                    <Image
                      src={feature.image}
                      alt={feature.imageAlt}
                      fill
                      className={styles.featureImage}
                    />
                  </div>
                  <div className={styles.featureOverlay}></div>
                  <div className={styles.featureContent}>
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                    <p className={styles.featureDesc}>{feature.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.ctaSection} id="download">
          <div className="container">
            <div className={styles.ctaContainer}>
              <h2 className={styles.ctaTitle}>{h.ctaTitle}</h2>
              <p className={styles.ctaSubtitle}>{h.ctaSubtitle}</p>
              <StoreButtons location="bottom_cta" className={styles.globalCtaButtons} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
