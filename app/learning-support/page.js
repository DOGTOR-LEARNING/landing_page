import Image from 'next/image'
import { headers } from 'next/headers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LiteYouTube from '@/components/LiteYouTube'
import LearningSupportApplyButton from '@/components/LearningSupportApplyButton'
import { getMessages } from '@/lib/i18n/messages'
import { LEARNING_SUPPORT } from '@/lib/learningSupport'
import styles from './page.module.css'

export const metadata = {
  title: 'DOGTOR 學習支持計劃 - 免費一年 DOGTOR Pro | Dogtor 逗課',
  description: `DOGTOR 學習支持計劃提供 ${LEARNING_SUPPORT.seats} 個免費一年 DOGTOR Pro 名額，總價值 ${LEARNING_SUPPORT.totalValue / 10000} 萬元。填寫表單告訴我們你為什麼需要這個計劃，就有機會獲得資格。`,
  openGraph: {
    title: 'DOGTOR 學習支持計劃 - 免費一年 DOGTOR Pro',
    description: `${LEARNING_SUPPORT.seats} 個免費一年 DOGTOR Pro 名額，讓好的學習資源不再受限於任何條件。`,
    images: ['/dogtor_cover.png'],
  },
}

export default async function LearningSupport() {
  const h = await headers()
  const locale = h.get('x-locale') || 'zh-TW'
  const ls = getMessages(locale).learningSupport
  const { seats, totalValue, youtubeId, videoVertical } = LEARNING_SUPPORT

  const stats = [
    { label: ls.statSeats, value: ls.formatSeats(seats) },
    { label: ls.statDuration, value: ls.statDurationValue },
    { label: ls.statValue, value: ls.formatValue(totalValue) },
  ]

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.glow} aria-hidden="true" />
        <div className="container">
          {/* Hero */}
          <section className={styles.hero}>
            <span className={styles.badge}>{ls.badge}</span>
            <h1 className={styles.heroTitle}>
              {ls.heroTitle}
              <br />
              <span className="gradient-text">{ls.heroTitleHighlight}</span>
            </h1>
            <p className={styles.heroSubtitle}>{ls.heroSubtitle(seats)}</p>

            <div className={styles.stats}>
              {stats.map((s) => (
                <div key={s.label} className={styles.stat}>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>

            <div className={styles.heroCtas}>
              <LearningSupportApplyButton
                label={ls.applyButton}
                location="learning_support_hero"
                className={styles.applyButton}
              />
              <a href="#letter" className={styles.secondaryButton}>{ls.learnMore}</a>
            </div>
          </section>

          {/* 影片 */}
          {youtubeId && (
            <section className={`${styles.video} ${videoVertical ? styles.videoVertical : ''}`}>
              <LiteYouTube id={youtubeId} title={ls.videoTitle} vertical={videoVertical} playLabel={ls.play} autoplayDelay={2000} />
            </section>
          )}

          {/* 創辦人的話 */}
          <section id="letter" className={styles.letter}>
            <div className={styles.letterHeader}>
              <Image src="/question-corgi.png" alt="" width={56} height={50} className={styles.letterCorgi} />
              <h2 className={styles.letterTitle}>{ls.letterTitle}</h2>
            </div>
            <blockquote className={styles.pullQuote}>{ls.letterQuote}</blockquote>
            <div className={styles.letterBody}>
              {ls.letterParagraphs(seats).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <p className={styles.signature}>— {ls.letterSignature}</p>
          </section>

          {/* 申請步驟 */}
          <section className={styles.steps}>
            <h2 className={styles.sectionTitle}>{ls.stepsTitle}</h2>
            <ol className={styles.stepList}>
              {ls.steps.map((step, i) => (
                <li key={step.title} className={styles.stepCard}>
                  <span className={styles.stepNumber}>{i + 1}</span>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* CTA */}
          <section className={styles.cta}>
            <h2 className={styles.ctaTitle}>{ls.ctaTitle}</h2>
            <p className={styles.ctaText}>{ls.ctaText}</p>
            <LearningSupportApplyButton
              label={ls.applyButton}
              location="learning_support_bottom"
              className={styles.applyButton}
            />
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
