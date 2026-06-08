import Header from '@/components/Header'
import Footer from '@/components/Footer'
import styles from './partnership.module.css'

export const metadata = {
  title: '長期合夥協作協議書 - Dogtor 逗課',
  description: 'Dogtor 逗課長期合夥協作協議書',
  robots: { index: false, follow: false },
}

export default function Partnership() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <article className={styles.contract}>
            <div className={styles.contractHeader}>
              <h1 className={styles.title}>長期合夥協作協議書</h1>
              <p className={styles.subtitle}>Dogtor 逗課</p>
            </div>

            <section className={styles.section}>
              <h2>立協議書人</h2>
              <div className={styles.partyBlock}>
                <p>
                  <span className={styles.partyLabel}>甲方：</span>
                  超棒軟體科技有限公司（SuperB Software Technology Co., Ltd.），以下簡稱甲方
                </p>
              </div>
              <div className={styles.partyBlock}>
                <p>
                  <span className={styles.partyLabel}>乙方：</span>
                  李宜嘉，以下簡稱乙方
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2>前言</h2>
              <p className={styles.preamble}>
                緣甲乙雙方前於 2026 年 4 月 5 日簽訂「專案合夥協作協議書」，約定為期兩個月之合夥觀察期（2026 年 4 月 5 日至 2026 年 6 月 4 日）。觀察期間雙方合作順利並達成共識，茲依前約之約定，雙方同意正式建立長期合夥關係。為確立雙方於長期合作期間之權利義務，雙方於
                {' '}2026 年 6 月 5 日（以下稱「生效日」）訂立如下條款：
              </p>
            </section>

            <section className={styles.section}>
              <h2>一、合作內容</h2>
              <p>乙方以正式合夥人身分參與甲方營運，負責主導並執行以下業務：</p>
              <ol className={styles.clauseList}>
                <li className={styles.clauseItem}>
                  <div className={styles.clauseItemTitle}>行政事務管理</div>
                  <div className={styles.clauseItemBody}>
                    負責公司日常行政事務之統籌與執行，包括但不限於文件管理、會議安排、政府補助申請書撰寫、企劃書製作及相關行政流程之處理。
                  </div>
                </li>
                <li className={styles.clauseItem}>
                  <div className={styles.clauseItemTitle}>行銷公司對接</div>
                  <div className={styles.clauseItemBody}>
                    擔任甲方與外部行銷公司之主要聯繫窗口，負責行銷策略之溝通協調、專案進度追蹤、成效評估報告彙整及相關事宜之對接與回報。
                  </div>
                </li>
                <li className={styles.clauseItem}>
                  <div className={styles.clauseItemTitle}>產品決策參與</div>
                  <div className={styles.clauseItemBody}>
                    持續參與 Dogtor App 優化討論、商業模式開發及公司經營方向之決議。
                  </div>
                </li>
                <li className={styles.clauseItem}>
                  <div className={styles.clauseItemTitle}>同步會議</div>
                  <div className={styles.clauseItemBody}>
                    每週參與一次核心成員同步會議（原則上以實體進行，視情況調整為線上）。
                  </div>
                </li>
              </ol>
            </section>

            <section className={styles.section}>
              <h2>二、合作期間</h2>
              <ul className={styles.orderedList}>
                <li>
                  本長期合作協議自 <span className={styles.highlight}>2026 年 6 月 5 日</span> 起生效，除依本協議第六條規定解除外，持續有效。
                </li>
                <li>
                  工作型態採責任制，由乙方彈性安排時間完成約定事項。
                </li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>三、股權分配與歸屬</h2>
              <ul className={styles.orderedList}>
                <li>
                  <span className={styles.highlight}>股權授予：</span>甲方同意授予乙方超棒軟體科技有限公司{' '}
                  <span className={styles.highlight}>4%</span> 之股權，作為長期合夥之對價。
                </li>
                <li>
                  <span className={styles.highlight}>分期歸屬（Vesting）：</span>前述股權自生效日起，以{' '}
                  <span className={styles.highlight}>一年（12 個月）</span>為歸屬期間，按月等比例歸屬。即每滿一個月歸屬
                  {' '}4% &divide; 12 &asymp; 0.3333% 之股權，一年期滿後完整歸屬 4%。
                </li>
                <li>
                  <span className={styles.highlight}>歸屬條件：</span>股權之歸屬以乙方持續履行本協議之合作義務為前提。若乙方於歸屬期間內依第六條解除合作關係，僅就已歸屬之股權享有權利，未歸屬部分自動失效。
                </li>
                <li>
                  <span className={styles.highlight}>股東權利：</span>已歸屬之股權享有相應之股東權利，包括但不限於年度利潤分配權及重大事項表決參與權，具體細節依公司章程及股東協議辦理。
                </li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>四、保密義務與智慧財產權</h2>
              <ul className={styles.orderedList}>
                <li>
                  <span className={styles.highlight}>保密義務：</span>乙方對於因本合作知悉之甲方營運資訊、產品架構、技術秘密、客戶資料及商業策略等，負有永久保密義務，非經甲方書面同意不得向第三方揭露。
                </li>
                <li>
                  <span className={styles.highlight}>智財歸屬：</span>乙方於合作期間為本專案所產出之各項企劃、素材、研究報告及相關產出，其智慧財產權均歸甲方所有。
                </li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>五、競業禁止</h2>
              <p>
                乙方於合作期間內，未經甲方書面同意，不得從事與 Dogtor 產品服務直接競爭之業務。
              </p>
            </section>

            <section className={styles.section}>
              <h2>六、合作關係之解除</h2>
              <ul className={styles.orderedList}>
                <li>
                  任一方擬解除本協議，應於 <span className={styles.highlight}>三十日前</span> 以書面通知他方。
                </li>
                <li>
                  解除後，乙方僅就已歸屬之股權保有權利，未歸屬部分自動失效。
                </li>
                <li>
                  保密義務及競業禁止條款於合作關係解除後仍持續有效。
                </li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>七、法律適用與管轄</h2>
              <p>
                本協議受中華民國法律管轄。若因本協議產生爭議，雙方應本於合夥精神誠信協商；若協商不成，同意以臺灣臺北地方法院為第一審管轄法院。
              </p>
            </section>

            <div className={styles.signatureArea}>
              <h2>協議書簽署</h2>
              <div className={styles.signatureGrid}>
                <div className={styles.signatureCard}>
                  <h3>甲方</h3>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>公司名稱</span>
                    <span className={styles.infoValue}>超棒軟體科技有限公司</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>統一編號</span>
                    <span className={styles.infoValue}>62214225</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>代表人</span>
                    <span className={styles.infoValue}>丁崇耘</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>地址</span>
                    <span className={styles.infoValue}>臺北市中正區金山北路1號5樓之6</span>
                  </div>
                  <div className={styles.signatureLine}>
                    <span>簽章：</span>
                    <div className={styles.line} />
                  </div>
                </div>

                <div className={styles.signatureCard}>
                  <h3>乙方</h3>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>姓名</span>
                    <span className={styles.infoValue}>李宜嘉</span>
                  </div>
                  <div className={styles.signatureLine}>
                    <span>簽章：</span>
                    <div className={styles.line} />
                  </div>
                </div>
              </div>

              <p className={styles.dateRow}>
                訂立日期：中華民國 115 年 6 月 8 日
              </p>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  )
}
