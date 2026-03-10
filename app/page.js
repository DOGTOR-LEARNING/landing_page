'use client'

import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getFeaturedArticles } from '@/lib/articles'
import styles from './page.module.css'

const APP_STORE_URL = 'https://apps.apple.com/tw/app/dogtor-%E9%80%97%E8%AA%B2/id6751773627'

export default function Home() {
  const featuredArticles = getFeaturedArticles(4)

  return (
    <>
      <Header />
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroBackground}></div>
          <div className="container">
            <div className={styles.heroContainer}>
              <div className={styles.heroContent}>
                <div className={styles.badge}>全新發佈</div>
                <h1 className={styles.heroTitle}>
                  精通知識，<br />
                  <span className="gradient-text">征服島嶼！</span>
                </h1>
                <p className={styles.heroTagline}>
                  國高中題庫練習 &middot; 會考學測分科複習 &middot; AI 解題助手
                </p>
                <p className={styles.heroSubtitle}>
                  和 Dogtor 逗課 一起冒險，輕鬆練習題目，與好友對戰，同時學習成長。
                </p>
                <div className={styles.heroCta}>
                  <a
                    href={APP_STORE_URL}
                    className="appStoreButton"
                    target="_blank"
                    rel="noreferrer"
                  >
                  <span className="appStoreIcon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1.25em" height="1.25em">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                  </span>
                  <span className="appStoreText">
                    <span className="appStoreLabelPrimary">Download on the</span>
                    <span className="appStoreLabelSecondary">App Store</span>
                  </span>
                  </a>
                  <Link href="#features" className="btn btn-secondary">
                    查看特色
                  </Link>
                </div>
              </div>

              <div className={styles.heroMedia}>
                <div className={styles.phoneMockup}>
                  <div className={styles.phoneFrame}>
                    <Image
                      src="/dogtor_cover.png"
                      alt="Dogtor 逗課 App 畫面 — 國高中題庫練習與學習島嶼"
                      width={300}
                      height={650}
                      priority
                      className={styles.screenImg}
                    />
                  </div>
                  <div className={styles.floatingCard}>
                    <Image
                      src="/question-corgi.png"
                      alt="Dogtor 逗課的學習小狗 — 每日挑戰提醒"
                      width={60}
                      height={60}
                      className={styles.floatIcon}
                    />
                    <div className={styles.floatText}>
                      <span className={styles.floatTitle}>每日挑戰</span>
                      <span className={styles.floatDesc}>完成15天連勝！</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.features} id="features">
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>為什麼選擇 Dogtor 逗課？</h2>
              <p className={styles.sectionSubtitle}>
                我們結合教育與娛樂，讓學習變成你真正想做的事。
              </p>
            </div>

            <div className={styles.featuresGrid}>
              <article className={`${styles.featureCard} card`}>
                <div className={styles.featureImageContainer}>
                  <Image
                    src="/feature_1.png"
                    alt="Dogtor 逗課好友對戰功能 — 國高中生會考學測複習與朋友互相挑戰練習題"
                    fill
                    className={styles.featureImage}
                  />
                </div>
                <div className={styles.featureOverlay}></div>
                <div className={styles.featureContent}>
                  <h3 className={styles.featureTitle}>社群學習</h3>
                  <p className={styles.featureDesc}>
                    和朋友一起學習！互相挑戰、分享進度，在有趣且支持的環境中一起成長。
                  </p>
                </div>
              </article>

              <article className={`${styles.featureCard} card`}>
                <div className={styles.featureImageContainer}>
                  <Image
                    src="/feature_2.png"
                    alt="Dogtor 逗課遊戲化成就系統 — 會考學測刷題蒐集星星解鎖成就"
                    fill
                    className={styles.featureImage}
                  />
                </div>
                <div className={styles.featureOverlay}></div>
                <div className={styles.featureContent}>
                  <h3 className={styles.featureTitle}>遊戲化成就</h3>
                  <p className={styles.featureDesc}>
                    蒐集星星、解鎖成就，並同時掌握新科目。學習從未如此令人上癮。
                  </p>
                </div>
              </article>

              <article className={`${styles.featureCard} card`}>
                <div className={styles.featureImageContainer}>
                  <Image
                    src="/home-background-sky.png"
                    alt="Dogtor 逗課 AI 個人化學習計畫 — 錯題本與歷屆試題推薦"
                    fill
                    className={styles.featureImage}
                  />
                </div>
                <div className={styles.featureOverlay}></div>
                <div className={styles.featureContent}>
                  <h3 className={styles.featureTitle}>個人化學習計畫</h3>
                  <p className={styles.featureDesc}>
                    AI 驅動的推薦系統根據你的步調和目標量身打造學習體驗，確保你始終保持在正軌上。
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* 精選學習攻略 */}
        {featuredArticles.length > 0 && (
          <section className={styles.guideSection}>
            <div className="container">
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>精選學習攻略</h2>
                <p className={styles.sectionSubtitle}>
                  會考學測準備、讀書方法、通勤學習，一次掌握。
                </p>
              </div>
              <div className={styles.guideGrid}>
                {featuredArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/guide/${article.slug}`}
                    className={styles.guideCard}
                  >
                    <span className={styles.guideCategory}>{article.category}</span>
                    <h3 className={styles.guideTitle}>{article.title}</h3>
                    <p className={styles.guideExcerpt}>{article.excerpt}</p>
                  </Link>
                ))}
              </div>
              <div className={styles.guideCta}>
                <Link href="/guide" className="btn btn-secondary">
                  查看全部學習指南
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className="container">
            <div className={styles.ctaContainer}>
              <h2 className={styles.ctaTitle}>準備好開始你的學習冒險了嗎？</h2>
              <p className={styles.ctaSubtitle}>
                立即下載 Dogtor 逗課 App，免費開始練習國高中題庫，和同學一起備戰會考學測。
              </p>
              <a
                href={APP_STORE_URL}
                className="appStoreButton"
                target="_blank"
                rel="noreferrer"
              >
                <span className="appStoreIcon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1.25em" height="1.25em">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                  </span>
                <span className="appStoreText">
                  <span className="appStoreLabelPrimary">Download on the</span>
                  <span className="appStoreLabelSecondary">App Store</span>
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
