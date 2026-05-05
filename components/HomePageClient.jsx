'use client'

import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useLocaleContext } from '@/components/LocaleProvider'
import { getFeaturedArticles } from '@/lib/articles'
import styles from '@/app/page.module.css'

const APP_STORE_URL = 'https://apps.apple.com/tw/app/dogtor-%E9%80%97%E8%AA%B2/id6751773627'
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.dogtor.superbFlutterApp'

export default function HomePageClient() {
  const { messages: m } = useLocaleContext()
  const featuredArticles = getFeaturedArticles(4)

  return (
    <>
      <Header />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroBackground}></div>
          <div className="container">
            <div className={styles.heroContainer}>
              <div className={styles.heroContent}>
                <div className={styles.badge}>{m.home.badge}</div>
                <h1 className={styles.heroTitle}>
                  {m.home.heroTitleLine1}
                  <br />
                  <span className="gradient-text">{m.home.heroTitleLine2}</span>
                </h1>
                <p className={styles.heroTagline}>{m.home.heroTagline}</p>
                <p className={styles.heroSubtitle}>{m.home.heroSubtitle}</p>
                <div className={styles.heroCta}>
                  <a href={APP_STORE_URL} className="appStoreButton" target="_blank" rel="noreferrer">
                    <span className="appStoreIcon" aria-hidden="true">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        width="1.25em"
                        height="1.25em"
                      >
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                      </svg>
                    </span>
                    <span className="appStoreText">
                      <span className="appStoreLabelPrimary">{m.store.appStorePrimary}</span>
                      <span className="appStoreLabelSecondary">{m.store.appStoreSecondary}</span>
                    </span>
                  </a>
                  <a href={PLAY_STORE_URL} className="appStoreButton" target="_blank" rel="noreferrer">
                    <span className="appStoreIcon" aria-hidden="true">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        width="1.25em"
                        height="1.25em"
                      >
                        <path d="M3.18 23.76c.35.2.76.22 1.12.03l12.72-7.27-2.8-2.8-11.04 10.04zM.5 1.18C.19 1.55 0 2.1 0 2.82v18.36c0 .72.19 1.27.5 1.64l.09.08 10.28-10.28v-.24L.59 1.1l-.09.08zM20.33 10.42l-2.82-1.61-3.13 3.13 3.13 3.14 2.84-1.63c.81-.46.81-1.21-.02-1.03zM4.3.21L17.02 7.5l-2.8 2.8L3.18.26C3.54.07 3.95.09 4.3.21z" />
                      </svg>
                    </span>
                    <span className="appStoreText">
                      <span className="appStoreLabelPrimary">{m.store.playPrimary}</span>
                      <span className="appStoreLabelSecondary">{m.store.playSecondary}</span>
                    </span>
                  </a>
                </div>
              </div>

              <div className={styles.heroMedia}>
                <div className={styles.phoneMockup}>
                  <div className={styles.phoneFrame}>
                    <Image
                      src="/dogtor_cover.png"
                      alt={m.home.phoneAlt}
                      width={300}
                      height={650}
                      priority
                      className={styles.screenImg}
                    />
                  </div>
                  <div className={styles.floatingCard}>
                    <Image
                      src="/question-corgi.png"
                      alt={m.home.floatMascotAlt}
                      width={60}
                      height={60}
                      className={styles.floatIcon}
                    />
                    <div className={styles.floatText}>
                      <span className={styles.floatTitle}>{m.home.floatTitle}</span>
                      <span className={styles.floatDesc}>{m.home.floatDesc}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.features} id="features">
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{m.home.featuresHeading}</h2>
              <p className={styles.sectionSubtitle}>{m.home.featuresSub}</p>
            </div>

            <div className={styles.featuresGrid}>
              <article className={`${styles.featureCard} card`}>
                <div className={styles.featureImageContainer}>
                  <Image
                    src="/feature_1.png"
                    alt={m.home.feature1Alt}
                    fill
                    className={styles.featureImage}
                  />
                </div>
                <div className={styles.featureOverlay}></div>
                <div className={styles.featureContent}>
                  <h3 className={styles.featureTitle}>{m.home.feature1Title}</h3>
                  <p className={styles.featureDesc}>{m.home.feature1Desc}</p>
                </div>
              </article>

              <article className={`${styles.featureCard} card`}>
                <div className={styles.featureImageContainer}>
                  <Image
                    src="/feature_2.png"
                    alt={m.home.feature2Alt}
                    fill
                    className={styles.featureImage}
                  />
                </div>
                <div className={styles.featureOverlay}></div>
                <div className={styles.featureContent}>
                  <h3 className={styles.featureTitle}>{m.home.feature2Title}</h3>
                  <p className={styles.featureDesc}>{m.home.feature2Desc}</p>
                </div>
              </article>

              <article className={`${styles.featureCard} card`}>
                <div className={styles.featureImageContainer}>
                  <Image
                    src="/home-background-sky.png"
                    alt={m.home.feature3Alt}
                    fill
                    className={styles.featureImage}
                  />
                </div>
                <div className={styles.featureOverlay}></div>
                <div className={styles.featureContent}>
                  <h3 className={styles.featureTitle}>{m.home.feature3Title}</h3>
                  <p className={styles.featureDesc}>{m.home.feature3Desc}</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {featuredArticles.length > 0 && (
          <section className={styles.guideSection}>
            <div className="container">
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{m.home.guideSectionTitle}</h2>
                <p className={styles.sectionSubtitle}>{m.home.guideSectionSub}</p>
              </div>
              <div className={styles.guideGrid}>
                {featuredArticles.map((article) => (
                  <Link key={article.slug} href={`/guide/${article.slug}`} className={styles.guideCard}>
                    <span className={styles.guideCategory}>{article.category}</span>
                    <h3 className={styles.guideTitle}>{article.title}</h3>
                    <p className={styles.guideExcerpt}>{article.excerpt}</p>
                  </Link>
                ))}
              </div>
              <div className={styles.guideCta}>
                <Link href="/guide" className="btn btn-secondary">
                  {m.home.guideViewAll}
                </Link>
              </div>
            </div>
          </section>
        )}

        <section className={styles.ctaSection}>
          <div className="container">
            <div className={styles.ctaContainer}>
              <h2 className={styles.ctaTitle}>{m.home.ctaTitle}</h2>
              <p className={styles.ctaSubtitle}>{m.home.ctaSubtitle}</p>
              <a href={APP_STORE_URL} className="appStoreButton" target="_blank" rel="noreferrer">
                <span className="appStoreIcon" aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="1.25em"
                    height="1.25em"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                </span>
                <span className="appStoreText">
                  <span className="appStoreLabelPrimary">{m.store.appStorePrimary}</span>
                  <span className="appStoreLabelSecondary">{m.store.appStoreSecondary}</span>
                </span>
              </a>
              <a href={PLAY_STORE_URL} className="appStoreButton" target="_blank" rel="noreferrer">
                <span className="appStoreIcon" aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width="1.25em"
                    height="1.25em"
                  >
                    <path d="M3.18 23.76c.35.2.76.22 1.12.03l12.72-7.27-2.8-2.8-11.04 10.04zM.5 1.18C.19 1.55 0 2.1 0 2.82v18.36c0 .72.19 1.27.5 1.64l.09.08 10.28-10.28v-.24L.59 1.1l-.09.08zM20.33 10.42l-2.82-1.61-3.13 3.13 3.13 3.14 2.84-1.63c.81-.46.81-1.21-.02-1.03zM4.3.21L17.02 7.5l-2.8 2.8L3.18.26C3.54.07 3.95.09 4.3.21z" />
                  </svg>
                </span>
                <span className="appStoreText">
                  <span className="appStoreLabelPrimary">{m.store.playPrimary}</span>
                  <span className="appStoreLabelSecondary">{m.store.playSecondary}</span>
                </span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
