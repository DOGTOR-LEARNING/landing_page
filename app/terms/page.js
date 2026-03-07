import Header from '@/components/Header'
import Footer from '@/components/Footer'
import styles from '../legal.module.css'

export const metadata = {
  title: '服務條款 - Dogtor 逗課',
  description: 'Dogtor 逗課 App 的使用條款和服務協議。',
}

export default function Terms() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>服務條款</h1>
            <p className={styles.updateDate}>最後更新：2026 年 2 月</p>
          </div>

          <div className={styles.content}>
            <section className={styles.section}>
              <h2>1. 服務協議</h2>
              <p>
                歡迎使用 Dogtor 逗課 App！使用本服務即表示你同意遵守以下條款和條件。請仔細閱讀這些條款。如果你不同意這些條款，請勿使用本服務。
              </p>
            </section>

            <section className={styles.section}>
              <h2>2. 服務使用</h2>
              <p>
                Dogtor 逗課 App 提供教育學習平台服務。你同意：
              </p>
              <ul>
                <li>以負責任且合法的方式使用本服務</li>
                <li>不從事任何可能損害其他用戶或平台的活動</li>
                <li>不嘗試未經授權存取系統或其他用戶的帳戶</li>
                <li>不上傳或分享不當、非法或侵權的內容</li>
                <li>遵守所有適用的法律和法規</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>3. 帳戶責任</h2>
              <p>
                當你建立 Dogtor 逗課 帳戶時，你有責任：
              </p>
              <ul>
                <li>保護你的帳戶憑證並保持其機密性</li>
                <li>對使用你帳戶進行的所有活動負責</li>
                <li>立即通知我們任何未經授權的使用或安全漏洞</li>
                <li>提供準確且最新的資訊</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>4. 內容與智慧財產權</h2>
              <p>
                Dogtor 逗課 App 上的所有內容，包括但不限於文字、圖形、標誌、圖片、音訊、影片和軟體，均為 Dogtor 逗課 或其內容供應商的財產，受版權和其他智慧財產權法律保護。
              </p>
              <p>
                你被授予有限、非專屬、不可轉讓的許可，僅用於個人、非商業目的使用本服務。
              </p>
            </section>

            <section className={styles.section}>
              <h2>5. 用戶生成內容</h2>
              <p>
                對於你透過本服務提交或分享的任何內容，你授予 Dogtor 逗課 全球性、非專屬、免版稅的許可，以使用、複製、修改、改編、發布和展示該內容，用於提供和改進本服務。
              </p>
              <p>
                你保證你擁有或擁有必要的權利來授予此許可，並且你的內容不侵犯任何第三方權利。
              </p>
            </section>

            <section className={styles.section}>
              <h2>6. 終止</h2>
              <p>
                我們保留隨時暫停或終止你的帳戶和存取權限的權利，如果我們認為你違反了這些條款或從事可能損害本服務或其他用戶的行為。
              </p>
              <p>
                你可以隨時透過聯絡我們的支援團隊來終止你的帳戶。
              </p>
            </section>

            <section className={styles.section}>
              <h2>7. 免責聲明</h2>
              <p>
                Dogtor 逗課 App 依「現狀」和「可用」基礎提供。我們不保證服務將不間斷、安全或無錯誤。我們不對服務內容的準確性、完整性或可靠性作任何保證。
              </p>
              <p>
                在法律允許的最大範圍內，Dogtor 逗課 不承擔任何明示或暗示的保證，包括但不限於適銷性、特定用途適用性和非侵權的保證。
              </p>
            </section>

            <section className={styles.section}>
              <h2>8. 責任限制</h2>
              <p>
                在法律允許的最大範圍內，Dogtor 逗課 及其董事、員工、合作夥伴或代理人不對任何間接、附帶、特殊、後果性或懲罰性損害，或任何利潤、收入、資料或使用損失負責。
              </p>
            </section>

            <section className={styles.section}>
              <h2>9. 條款變更</h2>
              <p>
                我們保留隨時修改這些條款的權利。我們會在本頁面上發布更新的條款，並註明「最後更新」日期。繼續使用本服務即表示你接受修訂後的條款。
              </p>
            </section>

            <section className={styles.section}>
              <h2>10. 適用法律</h2>
              <p>
                這些條款受你所在司法管轄區的法律管轄並按其解釋。任何爭議應透過友好協商解決。
              </p>
            </section>

            <section className={styles.section}>
              <h2>11. 聯絡我們</h2>
              <p>
                如果你對這些服務條款有任何問題或疑慮，請透過以下方式聯絡我們：
              </p>
              <p className={styles.contactEmail}>
                <strong>Email:</strong>{' '}
                <a href="mailto:dogtor.love.learning@gmail.com">dogtor.love.learning@gmail.com</a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
