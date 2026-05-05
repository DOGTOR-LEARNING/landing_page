import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getLocale } from '@/lib/i18n/getLocale'
import { getSiteMessages } from '@/lib/i18n/getSiteMessages'
import styles from './page.module.css'

const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.dogtor.superbFlutterApp'

export async function generateMetadata() {
  const locale = await getLocale()
  const m = getSiteMessages(locale)
  return {
    title: m.apkPage.metaTitle,
    description: m.apkPage.metaDescription,
  }
}

export default async function AndroidDownload() {
  const m = getSiteMessages(await getLocale())
  const p = m.apkPage

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{p.title}</h1>
            <p className={styles.pageSubtitle}>{p.subtitle}</p>
          </div>

          <div className={styles.content}>
            <div className={styles.downloadBox}>
              <p className={styles.downloadText}>{p.playCtaLine}</p>
              <a href={PLAY_STORE_URL} className="btn btn-primary" target="_blank" rel="noreferrer">
                {p.playButton}
              </a>
            </div>

            <div className={styles.ctaBox}>
              <p className={styles.ctaText}>{p.iosHint}</p>
              <a
                href="https://apps.apple.com/tw/app/dogtor-%E9%80%97%E8%AA%B2/id6751773627"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
              >
                {p.iosButton}
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
