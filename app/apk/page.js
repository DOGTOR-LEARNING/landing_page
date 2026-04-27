import Header from '@/components/Header'
import Footer from '@/components/Footer'
import styles from './page.module.css'

const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.dogtor.superbFlutterApp'

export const metadata = {
  title: '下載 Android 版 - Dogtor 逗課 | Google Play',
  description:
    'Dogtor 逗課已正式上架 Google Play！Android 用戶可免費下載，練習國高中題庫、好友對戰與 AI 解題功能。',
}

export default function AndroidDownload() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>下載 Android 版</h1>
            <p className={styles.pageSubtitle}>
              Dogtor 逗課已正式上架 Google Play，立即免費下載！
            </p>
          </div>

          <div className={styles.content}>
            <div className={styles.downloadBox}>
              <p className={styles.downloadText}>
                點擊前往 Google Play 下載 Dogtor 逗課 Android 版
              </p>
              <a
                href={PLAY_STORE_URL}
                className="btn btn-primary"
                target="_blank"
                rel="noreferrer"
              >
                前往 Google Play 下載
              </a>
            </div>

            <div className={styles.ctaBox}>
              <p className={styles.ctaText}>使用 iOS 裝置？</p>
              <a
                href="https://apps.apple.com/tw/app/dogtor-%E9%80%97%E8%AA%B2/id6751773627"
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
              >
                前往 App Store 下載
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
