import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import styles from './page.module.css'

const APP_STORE_URL = 'https://apps.apple.com/tw/app/dogtor-%E9%80%97%E8%AA%B2/id6751773627'

export const metadata = {
  title: '關於我們 - Dogtor 逗課 | 國高中 AI 學習平台',
  description:
    'Dogtor 逗課由台大資管與高醫藥化系團隊打造，結合遊戲化學習與 AI 技術，讓國高中生的會考學測複習變有趣。',
}

export default function About() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>關於我們</h1>
            <p className={styles.pageSubtitle}>
              我們的使命是讓學習變成一場冒險。
            </p>
          </div>

          <div className={styles.content}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>我們的使命</h2>
              <p className={styles.text}>
                Dogtor 逗課 建立在一個簡單的信念上：教育不應該無聊。我們結合遊戲的吸引力與社群學習的力量，打造一個讓學生真正愛上學習的平台。
              </p>
              <p className={styles.text}>
                我們相信，當學習變得有趣時，學生會更投入、更有動力，並且能記住更多知識。透過遊戲化元素、社群互動和個人化學習路徑，我們正在重新定義教育的未來。
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>我們解決的問題</h2>
              <p className={styles.text}>
                傳統的學習方式往往讓人感到孤立和缺乏動力。學生們面對著枯燥的教材，缺少即時反饋和社群支持。這導致了學習效率低下，甚至讓許多人對學習產生抗拒。
              </p>
              <p className={styles.text}>
                Dogtor 逗課 透過引入遊戲化元素，將「學習」這件苦差事轉變為一種有趣的日常習慣。我們讓學習變得社交化、視覺化，並且充滿成就感。
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>團隊介紹</h2>
              <p className={styles.text}>
                我們是一群充來自國立台灣大學資訊管理學系和高雄醫學大學醫藥化學系的教育工作者和開發者，共同致力於重新定義教育科技的未來。我們來自不同背景，但都相信教育應該是每個人都能享受的權利，也堅信科技可以讓教育變得更好。
              </p>
              <p className={styles.text}>
                我們的團隊結合了教育專業知識、技術創新和使用者體驗設計，打造出真正能改變學習體驗的產品。我們持續傾聽用戶的反饋，不斷改進和創新。
              </p>
              <div className={styles.contactBox}>
                <p className={styles.contactLabel}>聯絡我們：</p>
                <a href="mailto:dogtor.love.learning@gmail.com" className={styles.contactEmail}>
                  dogtor.love.learning@gmail.com
                </a>
              </div>
            </section>

            <section className={styles.ctaSection}>
              <h2 className={styles.ctaTitle}>加入我們的學習冒險</h2>
              <p className={styles.ctaText}>
                準備好體驗全新的學習方式了嗎？立即下載 Dogtor 逗課 App，開始你的島嶼冒險！
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
                <Link href="/support" className="btn btn-secondary">
                  聯絡支援
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
