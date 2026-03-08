'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import styles from './page.module.css'

const APP_STORE_URL = 'https://apps.apple.com/tw/app/dogtor-%E9%80%97%E8%AA%B2/id6751773627'

function InviteContent() {
  const searchParams = useSearchParams()
  const inviter = searchParams.get('inviter')

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>
              {inviter ? '朋友邀請你加入 Dogtor 逗課' : '加入 Dogtor 逗課'}
            </h1>
            <p className={styles.pageSubtitle}>
              {inviter
                ? '一起冒險、解題、與好友對戰，讓學習變有趣！下載 App 即可加入。'
                : '和 Dogtor 逗課 一起冒險，輕鬆解決問題、與好友對戰，同時學習成長。'}
            </p>
          </div>

          <section className={styles.ctaSection}>
            <p className={styles.ctaText}>
              立即下載 App，開始你的學習冒險
            </p>
            <div className={styles.ctaButtons}>
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
              <Link href="/" className="btn btn-secondary">
                回首頁
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

function InviteFallback() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>加入 Dogtor 逗課</h1>
            <p className={styles.pageSubtitle}>
              和 Dogtor 逗課 一起冒險，輕鬆解決問題、與好友對戰，同時學習成長。
            </p>
          </div>
          <section className={styles.ctaSection}>
            <p className={styles.ctaText}>立即下載 App，開始你的學習冒險</p>
            <div className={styles.ctaButtons}>
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
              <Link href="/" className="btn btn-secondary">
                回首頁
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function InvitePage() {
  return (
    <Suspense fallback={<InviteFallback />}>
      <InviteContent />
    </Suspense>
  )
}
