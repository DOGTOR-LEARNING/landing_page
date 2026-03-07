import Header from '@/components/Header'
import Footer from '@/components/Footer'
import styles from '../legal.module.css'

export const metadata = {
  title: '隱私權政策 - Dogtor 逗課',
  description: '了解 Dogtor 逗課 App 如何收集、使用和保護你的個人資料。',
}

export default function Privacy() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>隱私權政策</h1>
            <p className={styles.updateDate}>最後更新：2026 年 2 月</p>
          </div>

          <div className={styles.content}>
            <section className={styles.section}>
              <h2>一、隱私權保護政策的適用範圍</h2>
              <p>
                本隱私權保護政策適用於 Dogtor 逗課（以下簡稱「本服務」或「我們」）所提供的所有服務，包括但不限於：
              </p>
              <ul>
                <li>Dogtor 逗課行動應用程式（App）</li>
                <li>Dogtor 逗課官方網站及相關網頁服務</li>
                <li>透過本服務提供的所有功能與服務</li>
              </ul>
              <p>
                當您使用本服務時，即表示您已閱讀、了解並同意接受本隱私權保護政策的內容。若您不同意本政策的內容，請立即停止使用本服務。
              </p>
            </section>

            <section className={styles.section}>
              <h2>二、個人資料的蒐集、處理及利用方式</h2>
              
              <h3>（一）個人資料的蒐集</h3>
              <p>
                為了提供您最佳的服務體驗，我們可能會蒐集以下類型的個人資料：
              </p>
              <ul>
                <li><strong>帳戶資訊：</strong>姓名、電子郵件地址、密碼、使用者名稱</li>
                <li><strong>個人基本資料：</strong>年齡、教育程度、學習偏好、學習目標</li>
                <li><strong>學習相關資料：</strong>學習進度、完成的課程、測驗結果、學習時間記錄</li>
                <li><strong>裝置資訊：</strong>裝置類型、作業系統版本、唯一裝置識別碼、IP 位址</li>
                <li><strong>使用行為資料：</strong>瀏覽記錄、點擊行為、功能使用情況、錯誤日誌</li>
                <li><strong>通訊內容：</strong>您透過客服系統、回饋表單或電子郵件發送的訊息</li>
                <li><strong>其他資料：</strong>您主動提供或上傳的內容、檔案、圖片等</li>
              </ul>

              <h3>（二）個人資料的處理</h3>
              <p>
                我們會以合法、公平且透明的方式處理您的個人資料，並僅在以下目的範圍內使用：
              </p>
              <ul>
                <li>提供、維護和改進本服務的功能與品質</li>
                <li>個人化您的學習體驗，包括內容推薦和學習路徑規劃</li>
                <li>處理您的註冊、登入、交易和相關服務請求</li>
                <li>發送服務通知、更新資訊、安全警報和管理訊息</li>
                <li>回應您的詢問、提供客戶支援和技術協助</li>
                <li>進行數據分析，以了解使用趨勢並改善服務品質</li>
                <li>偵測、預防和解決技術問題、安全威脅或詐騙行為</li>
                <li>遵守相關法律法規、法院命令或政府機關的要求</li>
                <li>進行學術研究或統計分析（資料將進行匿名化處理）</li>
              </ul>

              <h3>（三）個人資料的利用</h3>
              <p>
                我們會依據蒐集目的合理利用您的個人資料，並採取適當的安全措施保護您的資料。除非獲得您的明確同意或法律另有規定，我們不會將您的個人資料用於蒐集目的以外的用途。
              </p>

              <h3>（四）個人資料刪除請求</h3>
              <p>
                您有權隨時請求刪除您的個人資料。若您希望刪除您的個人資料，請透過以下方式與我們聯絡：
              </p>
              <p className={styles.contactEmail}>
                <strong>Email:</strong>{' '}
                <a href="mailto:dogtor.love.learning@gmail.com">dogtor.love.learning@gmail.com</a>
              </p>
              <p>
                我們會在收到您的請求後，於合理期間內（通常為 30 個工作天內）處理您的刪除請求。但請注意，若法律要求我們保留某些資料（例如交易記錄、法律爭議相關資料等），我們將依法保留該等資料。
              </p>
            </section>

            <section className={styles.section}>
              <h2>三、資料之保護與刪除</h2>
              
              <h3>（一）資料安全保護措施</h3>
              <p>
                我們非常重視您的個人資料安全，已採取以下技術上及組織上的必要措施，以防止個人資料被竊取、竄改、毀損、滅失或洩漏：
              </p>
              <ul>
                <li><strong>資料加密：</strong>對傳輸中及靜態儲存的敏感資料進行加密處理（使用 SSL/TLS 加密傳輸協定）</li>
                <li><strong>存取控制：</strong>嚴格限制對個人資料的存取權限，僅授權必要的工作人員存取，並建立存取日誌記錄</li>
                <li><strong>系統安全：</strong>使用安全的伺服器、防火牆、入侵偵測系統等安全設備，並定期進行安全更新與修補</li>
                <li><strong>定期稽核：</strong>定期進行安全評估、漏洞掃描和滲透測試，確保系統安全性</li>
                <li><strong>備份機制：</strong>建立完善的資料備份與災難復原機制，確保資料的完整性與可用性</li>
                <li><strong>員工訓練：</strong>定期對員工進行資料保護與資訊安全教育訓練</li>
                <li><strong>第三方審查：</strong>對合作的第三方服務提供商進行安全審查，確保其符合資料保護標準</li>
              </ul>

              <h3>（二）資料保留與刪除</h3>
              <p>
                我們僅在實現本政策所述目的所需的期間內保留您的個人資料，或依據法律規定必須保留的期間內保存。當保留期間屆滿或您請求刪除時，我們會以安全的方式刪除或匿名化您的個人資料。
              </p>
              <p>
                若您刪除帳戶，我們會在合理的時間內（通常為 30 個工作天內）刪除或匿名化您的個人資料，但以下情況除外：
              </p>
              <ul>
                <li>法律要求我們必須保留的資料（例如交易記錄、稅務資料等）</li>
                <li>正在進行中的法律程序或爭議解決所需</li>
                <li>為保護本服務或其他使用者的合法權益所必要</li>
              </ul>

              <h3>（三）安全責任聲明</h3>
              <p>
                儘管我們已採取上述安全措施，但網際網路環境並非絕對安全，我們無法保證資料傳輸或儲存的絕對安全。請您妥善保管您的帳號密碼，並避免在不安全的網路環境下使用本服務。
              </p>
            </section>

            <section className={styles.section}>
              <h2>四、網站對外的相關連結</h2>
              <p>
                本服務的網站或應用程式可能包含其他第三方網站或服務的連結。這些外部連結網站有其各自的隱私權保護政策，其內容、隱私權做法或資料處理方式均與本服務無關。
              </p>
              <p>
                <strong>重要提醒：</strong>當您點擊這些外部連結並離開本服務時，本隱私權保護政策將不再適用於該等外部網站。我們不對這些第三方網站的隱私權做法、內容或資料處理負任何責任。
              </p>
              <p>
                我們強烈建議您在造訪任何外部網站時，應仔細閱讀該網站的隱私權保護政策，以了解其如何蒐集、使用和保護您的個人資料。
              </p>
            </section>

            <section className={styles.section}>
              <h2>五、與第三人共用個人資料之政策</h2>
              <p>
                我們不會出售、出租或以其他方式交易您的個人資料。但在以下情況下，我們可能會與第三人共用您的個人資料：
              </p>

              <h3>（一）服務提供商</h3>
              <p>
                為了提供本服務，我們可能會與協助我們營運服務的第三方服務提供商分享必要的個人資料，包括：
              </p>
              <ul>
                <li>雲端儲存與主機服務提供商</li>
                <li>資料分析與統計服務提供商</li>
                <li>客戶支援與客服系統服務提供商</li>
                <li>電子郵件與訊息發送服務提供商</li>
                <li>支付處理服務提供商</li>
                <li>其他協助我們提供服務的技術服務提供商</li>
              </ul>
              <p>
                我們會要求所有第三方服務提供商遵守嚴格的資料保護標準，並僅允許其為提供服務之目的使用您的個人資料，不得用於其他用途。
              </p>

              <h3>（一之一）AI 服務提供商</h3>
              <p>
                <strong>Dogtor 使用第三方 AI 服務來提供智能學習輔助功能。</strong>當您使用 AI 相關功能時，部分資料將傳送至 AI 服務供應商。
              </p>
              
              <p><strong>使用的 AI 服務供應商：</strong></p>
              <ul>
                <li><strong>OpenAI API</strong>（ChatGPT）— 用於對話式學習輔助、內容生成與智能問答</li>
                <li><strong>Google Gemini API</strong> — 用於智能問題解析、學習建議與多元分析</li>
              </ul>

              <p><strong>傳送的資料內容：</strong></p>
              <ul>
                <li><strong>使用者對話訊息：</strong>您與 Dogtor AI 助理之間的聊天訊息內容</li>
                <li><strong>上傳的圖片：</strong>您透過聊天功能上傳的圖片（如題目照片、學習筆記等）</li>
                <li><strong>題目內容與作答記錄：</strong>您選擇的題目內容、作答結果、錯題記錄（用於錯題分析功能）</li>
                <li><strong>學習偏好資訊：</strong>年級、學習動機、習慣學習時段等（用於個人化推薦功能）</li>
              </ul>

              <p><strong>不傳送的資料：</strong></p>
              <ul>
                <li>我們<strong>不會</strong>傳送任何財務資訊、敏感個人資料（如密碼等）給 AI 服務供應商</li>
              </ul>

              <p><strong>資料使用目的：</strong></p>
              <ul>
                <li>傳送至 AI 服務的資料僅用於生成當次回應，提供您個人化的學習輔助與內容</li>
                <li>用於智能問題解析、學習建議與錯題分析</li>
                <li>用於個人化學習內容推薦與學習路徑規劃</li>
              </ul>

              <p><strong>資料處理方式：</strong></p>
              <ul>
                <li>根據我們的 API 使用條款，傳送至 AI 服務的資料<strong>不會被 AI 供應商用於訓練其模型</strong></li>
                <li>所有資料傳輸均透過 HTTPS 加密，確保傳輸過程的安全性</li>
                <li>我們不會主動向第三方出售或分享您的個人識別資訊</li>
              </ul>

              <p><strong>資料保護承諾：</strong></p>
              <p>
                OpenAI 與 Google Gemini 等 AI 服務供應商均承諾提供<strong>與我們同等或更高標準的資料保護措施</strong>，包括資料加密、存取控制與隱私保護機制。這些 AI 服務供應商各自遵循其隱私政策，並符合業界標準的資料保護規範。詳見各供應商官方隱私政策：
              </p>
              <ul>
                <li>OpenAI 隱私政策：<a href="https://openai.com/privacy" target="_blank" rel="noopener noreferrer">https://openai.com/privacy</a></li>
                <li>Google 隱私政策：<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a></li>
              </ul>

              <h3>（二）法律要求</h3>
              <p>
                在以下情況下，我們可能會依法向相關機關或第三人提供您的個人資料：
              </p>
              <ul>
                <li>應法院、檢察機關或其他政府機關的合法要求</li>
                <li>為遵守相關法律法規、法院判決或行政命令</li>
                <li>為保護本服務、使用者或公眾的權利、財產或安全</li>
                <li>為調查、預防或處理可能的違法行為、詐騙或安全威脅</li>
              </ul>

              <h3>（三）業務轉讓</h3>
              <p>
                若發生合併、收購、資產出售或其他業務轉讓情況，您的個人資料可能會被轉移給新的業務實體。我們會確保該等轉移符合本隱私權保護政策的要求，並在轉移前通知您。
              </p>

              <h3>（四）經您同意</h3>
              <p>
                在獲得您明確同意的情況下，我們可能會與第三人分享您的個人資料。
              </p>
            </section>

            <section className={styles.section}>
              <h2>六、Cookie 之使用</h2>
              <p>
                為了提供您更好的服務體驗，本服務的網站可能會使用 Cookie 技術來儲存或追蹤使用者的資料。
              </p>

              <h3>（一）什麼是 Cookie</h3>
              <p>
                Cookie 是網站伺服器存放在您裝置（電腦、手機、平板等）上的小型文字檔案，用於記錄您的瀏覽偏好、登入狀態或其他資訊。
              </p>

              <h3>（二）我們使用的 Cookie 類型</h3>
              <ul>
                <li><strong>必要 Cookie：</strong>這些 Cookie 是網站正常運作所必需的，用於維持您的登入狀態、記住您的偏好設定等。若停用這些 Cookie，可能會影響網站的功能。</li>
                <li><strong>功能 Cookie：</strong>用於記住您的個人偏好和設定（例如語言選擇、字體大小等），以提供更個人化的體驗。</li>
                <li><strong>分析 Cookie：</strong>用於收集和分析網站使用情況，幫助我們了解使用者如何與網站互動，以改善服務品質和使用者體驗。這些資料通常會進行匿名化處理。</li>
                <li><strong>行銷 Cookie：</strong>用於追蹤您的瀏覽行為，以提供更相關的廣告內容（若適用）。</li>
              </ul>

              <h3>（三）Cookie 的管理</h3>
              <p>
                您可以透過瀏覽器的設定來控制或刪除 Cookie。大多數瀏覽器都允許您：
              </p>
              <ul>
                <li>查看已儲存的 Cookie</li>
                <li>刪除特定的 Cookie 或所有 Cookie</li>
                <li>設定瀏覽器在收到 Cookie 時通知您</li>
                <li>完全停用 Cookie</li>
              </ul>
              <p>
                請注意，若您停用 Cookie，可能會影響本服務某些功能的正常運作，例如無法維持登入狀態、無法記住您的偏好設定等。
              </p>

              <h3>（四）其他追蹤技術</h3>
              <p>
                除了 Cookie 之外，我們也可能使用其他類似的追蹤技術，例如網站信標（Web Beacons）、像素標籤（Pixel Tags）等，用於收集使用資訊和改善服務。
              </p>
            </section>

            <section className={styles.section}>
              <h2>七、隱私權保護政策之修正</h2>
              <p>
                我們保留隨時修正本隱私權保護政策的權利，以反映服務變更、法律要求或最佳實務的更新。
              </p>

              <h3>（一）修正通知</h3>
              <p>
                當我們對本政策進行修正時，我們會：
              </p>
              <ul>
                <li>在本頁面上發布更新後的政策內容</li>
                <li>更新頁面頂部的「最後更新」日期</li>
                <li>對於重大變更，我們可能會透過電子郵件、應用程式內通知或其他顯著方式通知您</li>
              </ul>

              <h3>（二）您的權利</h3>
              <p>
                修正後的政策自發布之日起生效。若您繼續使用本服務，即表示您同意接受修正後的政策。若您不同意修正後的內容，請停止使用本服務，並可依本政策第二條第四項的規定請求刪除您的個人資料。
              </p>

              <h3>（三）建議定期查閱</h3>
              <p>
                我們建議您定期查閱本隱私權保護政策，以了解我們如何保護您的個人資料。您可以在本服務的網站或應用程式中隨時查看最新版本的政策。
              </p>
            </section>

            <section className={styles.section}>
              <h2>八、您的權利</h2>
              <p>
                根據個人資料保護相關法規，您對您的個人資料享有以下權利：
              </p>
              <ul>
                <li><strong>查詢權：</strong>您有權查詢我們是否持有您的個人資料，以及我們持有的個人資料內容</li>
                <li><strong>閱覽權：</strong>您有權請求閱覽我們持有的關於您的個人資料</li>
                <li><strong>製給複本權：</strong>您有權請求我們提供您的個人資料複本</li>
                <li><strong>補充或更正權：</strong>您有權請求補充或更正不完整或不正確的個人資料</li>
                <li><strong>停止蒐集、處理或利用權：</strong>您有權請求我們停止蒐集、處理或利用您的個人資料</li>
                <li><strong>刪除權：</strong>您有權請求刪除您的個人資料（但法律要求保留者除外）</li>
              </ul>
              <p>
                若您要行使上述任何權利，請透過以下方式與我們聯絡：
              </p>
              <p className={styles.contactEmail}>
                <strong>Email:</strong>{' '}
                <a href="mailto:dogtor.love.learning@gmail.com">dogtor.love.learning@gmail.com</a>
              </p>
              <p>
                我們會在收到您的請求後，於合理期間內（通常為 30 個工作天內）處理您的請求並回覆您。
              </p>
            </section>

            <section className={styles.section}>
              <h2>九、聯絡我們</h2>
              <p>
                如果您對本隱私權保護政策有任何疑問、意見、建議或需要行使您的權利，歡迎透過以下方式與我們聯絡：
              </p>
              <p className={styles.contactEmail}>
                <strong>Email:</strong>{' '}
                <a href="mailto:dogtor.love.learning@gmail.com">dogtor.love.learning@gmail.com</a>
              </p>
              <p>
                我們會盡快回應您的詢問，通常在 30 個工作天內回覆。感謝您對 Dogtor 逗課的支持與信任。
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
