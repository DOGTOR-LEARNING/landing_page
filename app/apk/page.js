import Header from '@/components/Header'
import Footer from '@/components/Footer'
import styles from './page.module.css'

// APK 託管於 GitHub Releases，請在建立 release 後更新此 URL
const APK_DOWNLOAD_URL =
  'https://github.com/DOGTOR-LEARNING/landing_page/releases/latest/download/app-release.apk'

export const metadata = {
  title: '下載 APK - Dogtor 逗課 | Android 搶先體驗',
  description:
    'Android 用戶可在此下載 Dogtor 逗課 APK 版本，搶先體驗國高中題庫學習、好友對戰與 AI 解題功能。',
}

export default function APKDownload() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>下載 Android 版</h1>
            <p className={styles.pageSubtitle}>
              安卓用戶可以點擊下方按鈕下載 APK 版，搶先使用 Dogtor 逗課。
            </p>
          </div>

          <div className={styles.content}>
            <div className={styles.downloadBox}>
              <p className={styles.downloadText}>
                點擊下載 Dogtor 逗課 Android 版
              </p>
              <a
                href={APK_DOWNLOAD_URL}
                download="Dogtor-逗課.apk"
                className="btn btn-primary"
                target="_blank"
                rel="noreferrer"
              >
                下載 APK
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
