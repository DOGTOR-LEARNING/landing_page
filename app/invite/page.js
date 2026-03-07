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
                <span className="appStoreIcon"></span>
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
                <span className="appStoreIcon"></span>
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
