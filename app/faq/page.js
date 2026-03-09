import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Accordion from '@/components/Accordion'
import styles from './page.module.css'

export const metadata = {
  title: '常見問題 - Dogtor 逗課 | 國高中題庫學習 App FAQ',
  description:
    '關於 Dogtor 逗課的常見問題解答，包括國中會考、高中學測題庫使用方式、支援科目、好友對戰功能介紹和技術支援。',
}

const faqData = [
  {
    question: 'App 是免費的嗎？',
    answer:
      '是的！Dogtor 逗課 App 可以免費下載和使用。我們未來可能會提供進階功能，但核心體驗將永遠免費。',
  },
  {
    question: '我可以和朋友一起玩嗎？',
    answer:
      '當然可以。社群學習是 Dogtor 逗課 的核心功能。你可以挑戰朋友進行測驗對戰，並獲得成就稱號。',
  },
  {
    question: '涵蓋哪些科目？',
    answer:
      '我們目前涵蓋國中數學、自然和高中化學，並會根據用戶回饋持續新增更多科目。',
  },
  {
    question: '題目來源？',
    answer:
      '我們整理了眾多公開的學習資源與課綱，為所有章節整理對應的知識點，並透過多種大型語言模型（LLM）依照這些知識點生成題目，之後再由我們反覆審查與調整題型，確保內容正確且符合教學目標。',
  },
  {
    question: '什麼時候會有其他科目？',
    answer:
      '我們目前正在尋找其他科目的合作教育者。Dogtor 逗課 已經建立一套可以為不同科目生成、審查並上架題目的流程，但我們更重視題目的教育品質，因此會與專業老師合作一同打造內容。如果你有意願合作，歡迎透過支援中心或寄信至 dogtor.love.learning@gmail.com 與我們聯繫。',
  },
  {
    question: '我的資料安全嗎？',
    answer:
      '是的，我們非常重視隱私。你的資料都經過加密，我們絕不會將你的個人資訊出售給第三方。',
  },
  {
    question: 'App 一直閃退，該怎麼辦？',
    answer:
      '請先嘗試更新到最新版本。如果問題持續存在，請透過下方的支援中心聯絡我們的團隊。',
  },
  {
    question: '如何刪除我的帳號？',
    answer:
      '如果你想刪除帳號，請透過支援中心傳送請求給我們，我們會在 1-3 個工作天內處理。',
  },
  {
    question: '可以在 Android 上使用嗎？',
    answer:
      '目前我們專注於 iOS 版本，但 Android 版本也在規劃中。請關注我們的更新！',
  },
  {
    question: '如何回報問題或建議新功能？',
    answer:
      '我們很樂意聽到你的意見！請透過支援中心聯絡我們，或直接寄信至 dogtor.love.learning@gmail.com。',
  },
  {
    question: '我的學習進度會同步嗎？',
    answer:
      '是的，你的所有學習進度、成就和島嶼設定都會自動同步到雲端，確保你在不同裝置上都能繼續學習。',
  },
  {
    question: '為什麼每次開啟 App 都要重新填寫暱稱或興趣？或是能量恢復顯示異常？',
    answer:
      '這通常是因為帳號在當時的註冊流程中沒有完整建立成功，導致系統無法正常讀取您的使用資料。建議依照以下步驟操作：\n\n1. 在 App 內登出帳號\n2. 重新使用 Google 帳號登入\n3. 重新登入後需要再填寫一次暱稱與興趣表單是正常的\n\n完成後帳號通常即可恢復正常使用。若問題仍持續，請再登出一次，並嘗試改用其他 Google 帳號登入。如仍無法解決，歡迎透過支援中心聯絡我們，我們會盡快協助處理。',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqData.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}

export default function FAQ() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>常見問題</h1>
            <p className={styles.pageSubtitle}>
              關於 Dogtor 逗課 的所有疑問，在這裡找到答案。
            </p>
          </div>

          <div className={styles.content}>
            <Accordion items={faqData} />

            <div className={styles.ctaBox}>
              <p className={styles.ctaText}>還有其他問題嗎？</p>
              <Link href="/support" className="btn btn-secondary">
                聯絡支援中心
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
