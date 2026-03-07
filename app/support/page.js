import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  Email,
  AccessTime,
  HelpOutline,
  BugReport,
  Lock,
  CreditCard,
  Delete,
  Lightbulb
} from '@mui/icons-material'
import styles from './page.module.css'

export const metadata = {
  title: '支援中心 - Dogtor 逗課',
  description: '需要協助嗎？在這裡找到聯絡方式和常見問題的快速解決方案。',
}

export default function Support() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>支援中心</h1>
            <p className={styles.pageSubtitle}>
              我們隨時準備協助你回到學習的正軌。
            </p>
          </div>

          <div className={styles.content}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>聯絡我們</h2>
              <p className={styles.text}>
                如有任何問題、反饋或建議，請直接透過電子郵件聯絡我們。我們會在 <strong>1-3 個工作天內</strong>回覆。
              </p>
              <div className={styles.contactBox}>
                <div className={styles.contactItem}>
                  <Email className={styles.contactIcon} />
                  <div>
                    <p className={styles.contactLabel}>電子郵件</p>
                    <a href="mailto:dogtor.love.learning@gmail.com" className={styles.contactValue}>
                      dogtor.love.learning@gmail.com
                    </a>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <AccessTime className={styles.contactIcon} />
                  <div>
                    <p className={styles.contactLabel}>回覆時間</p>
                    <p className={styles.contactValue}>1-3 個工作天</p>
                  </div>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>快速操作</h2>
              <p className={styles.text}>
                以下是一些常見的支援項目，點擊即可快速處理：
              </p>
              <div className={styles.quickActions}>
                <a
                  href="/faq"
                  className={styles.actionCard}
                >
                  <HelpOutline className={styles.actionIcon} />
                  <h3 className={styles.actionTitle}>常見問題</h3>
                  <p className={styles.actionDesc}>查看常見問題解答</p>
                </a>
                <a
                  href="mailto:dogtor.love.learning@gmail.com?subject=錯誤回報"
                  className={styles.actionCard}
                >
                  <BugReport className={styles.actionIcon} />
                  <h3 className={styles.actionTitle}>回報錯誤</h3>
                  <p className={styles.actionDesc}>告訴我們遇到的問題</p>
                </a>
                <a
                  href="mailto:dogtor.love.learning@gmail.com?subject=帳號登入問題"
                  className={styles.actionCard}
                >
                  <Lock className={styles.actionIcon} />
                  <h3 className={styles.actionTitle}>帳號登入</h3>
                  <p className={styles.actionDesc}>無法登入或忘記密碼</p>
                </a>
                <a
                  href="mailto:dogtor.love.learning@gmail.com?subject=訂閱與退款"
                  className={styles.actionCard}
                >
                  <CreditCard className={styles.actionIcon} />
                  <h3 className={styles.actionTitle}>訂閱退款</h3>
                  <p className={styles.actionDesc}>關於訂閱和退款問題</p>
                </a>
                <a
                  href="mailto:dogtor.love.learning@gmail.com?subject=資料刪除請求"
                  className={styles.actionCard}
                >
                  <Delete className={styles.actionIcon} />
                  <h3 className={styles.actionTitle}>刪除資料</h3>
                  <p className={styles.actionDesc}>請求刪除帳號或資料</p>
                </a>
                <a
                  href="mailto:dogtor.love.learning@gmail.com?subject=功能建議"
                  className={styles.actionCard}
                >
                  <Lightbulb className={styles.actionIcon} />
                  <h3 className={styles.actionTitle}>功能建議</h3>
                  <p className={styles.actionDesc}>分享你的想法</p>
                </a>
              </div>
            </section>

            <section className={styles.tipSection}>
              <h3 className={styles.tipTitle}>
                <Lightbulb sx={{ fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '0.5rem' }} />
                寄信時請提供
              </h3>
              <ul className={styles.tipList}>
                <li>問題的詳細描述</li>
                <li>發生問題的時間</li>
                <li>你的裝置型號和 iOS 版本</li>
                <li>相關的螢幕截圖（如果可以的話）</li>
              </ul>
              <p className={styles.tipNote}>
                提供越詳細的資訊，我們就能越快幫你解決問題！
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
