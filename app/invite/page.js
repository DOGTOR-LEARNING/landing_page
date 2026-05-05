'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useLocaleContext } from '@/components/LocaleProvider'
import styles from './page.module.css'

const APP_STORE_URL = 'https://apps.apple.com/tw/app/dogtor-%E9%80%97%E8%AA%B2/id6751773627'

function buildAppInviteUrl(inviter) {
  const q = inviter != null && inviter !== '' ? `?inviter=${encodeURIComponent(inviter)}` : ''
  return `dogtor://invite${q}`
}

function InviteContent() {
  const searchParams = useSearchParams()
  const inviter = searchParams.get('inviter')
  const appInviteUrl = buildAppInviteUrl(inviter)
  const { messages: m } = useLocaleContext()
  const i = m.invitePage

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{inviter ? i.titleWithInviter : i.titleDefault}</h1>
            <p className={styles.pageSubtitle}>{inviter ? i.subtitleWithInviter : i.subtitleDefault}</p>
          </div>

          <section className={styles.ctaSection}>
            <p className={styles.ctaText}>{i.ctaLine}</p>
            <div className={styles.ctaButtons}>
              <a href={APP_STORE_URL} className="appStoreButton" target="_blank" rel="noreferrer">
                <span className="appStoreIcon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1.25em" height="1.25em">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                </span>
                <span className="appStoreText">
                  <span className="appStoreLabelPrimary">{m.store.appStorePrimary}</span>
                  <span className="appStoreLabelSecondary">{m.store.appStoreSecondary}</span>
                </span>
              </a>
              <a href={appInviteUrl} className="btn btn-secondary">
                {i.addFriend}
              </a>
              <Link href="/" className="btn btn-secondary">
                {i.backHome}
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
  const { messages: m } = useLocaleContext()
  const i = m.invitePage

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{i.titleDefault}</h1>
            <p className={styles.pageSubtitle}>{i.subtitleDefault}</p>
          </div>
          <section className={styles.ctaSection}>
            <p className={styles.ctaText}>{i.ctaLine}</p>
            <div className={styles.ctaButtons}>
              <a href={APP_STORE_URL} className="appStoreButton" target="_blank" rel="noreferrer">
                <span className="appStoreIcon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1.25em" height="1.25em">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                </span>
                <span className="appStoreText">
                  <span className="appStoreLabelPrimary">{m.store.appStorePrimary}</span>
                  <span className="appStoreLabelSecondary">{m.store.appStoreSecondary}</span>
                </span>
              </a>
              <a href="dogtor://invite" className="btn btn-secondary">
                {i.addFriend}
              </a>
              <Link href="/" className="btn btn-secondary">
                {i.backHome}
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
