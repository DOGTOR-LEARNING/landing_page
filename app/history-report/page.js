import Image from 'next/image'
import { headers } from 'next/headers'
import styles from '../report/page.module.css'
import { getHistoryReportMessages } from '@/lib/i18n/historyReportMessages'
import AnimatedIcon from '@/components/AnimatedIcons'

async function pickLocaleFromRequest() {
  const h = await headers()
  const v = h.get('x-locale')
  return v === 'en' ? 'en' : 'zh-TW'
}

function localeHref(nextLocale) {
  return nextLocale === 'en' ? '/history-report?lang=en' : '/history-report?lang=zh-TW'
}

export async function generateMetadata() {
  const locale = await pickLocaleFromRequest()
  const t = getHistoryReportMessages(locale)
  return {
    title: t.pageTitle,
    description: locale === 'en' ? 'Daily history learning report for parents.' : '家長版歷史科每日學習報告。',
  }
}

export default async function HistoryReportPage() {
  const locale = await pickLocaleFromRequest()
  const t = getHistoryReportMessages(locale)

  // Static mock data (later can be fed by backend/app link params)
  const studentName = 'Pierre Chen'
  const date = '2026/05/04'

  const today = {
    cardsCompleted: 8,
    accuracy: 75,
    streakDays: 7,
  }

  const mistakeBook = {
    newToday: 3,
    reviewed: 10,
    mastered: 6,
  }

  const mistakesMade = [
    {
      id: 'tw-history-kogakko',
      questionEn:
        'In early Japanese rule, which school did the Japanese government set up across Taiwan as primary schools for Taiwanese children to promote Japanese-language education and basic knowledge?',
      questionZh:
        '日治初期，日本政府為了普及日語教育與基礎知識，在各地設立了「＿＿＿」作為臺籍學童的初等教育場所。',
      choices: [
        { key: 'A', textEn: 'Primary school (shōgakkō)', textZh: '小學校' },
        { key: 'B', textEn: 'Common school (kōgakkō)', textZh: '公學校' },
        { key: 'C', textEn: 'University', textZh: '大學校' },
        { key: 'D', textEn: 'Academy (shūin)', textZh: '書院' },
      ],
      picked: 'A',
      correct: 'B',
      explainEn:
        'During early Japanese rule, “kōgakkō” (common schools) were established widely as primary education institutions mainly for Taiwanese children, aiming to promote Japanese-language education and basic knowledge.',
      explainZh:
        '日治初期「公學校」是日本政府在臺灣各地設立、以臺籍學童為主要對象的初等教育機構，目的在推廣日語教育與基礎知識（相對地，「小學校」多以日本人子弟為主）。',
    },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.topBar}>
          <div className={styles.brand}>
            <div className={styles.avatar} aria-hidden="true">
              <Image src="/app_icon.png" alt="" width={34} height={34} priority />
            </div>
            <div className={styles.brandText}>
              <div className={styles.titleRow}>
                <div className={styles.title}>{t.pageTitle}</div>
                <div className={styles.pill}>{t.parentViewLabel}</div>
              </div>
              <div className={styles.meta}>
                <span>
                  {t.studentLabel}: {studentName}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  {t.dateLabel}: {date}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.langToggle}>
            <span className={styles.langLabel}>{t.localeSwitchLabel}</span>
            <div className={styles.langButtons} role="group" aria-label={t.localeSwitchLabel}>
              <a
                href={localeHref('zh-TW')}
                className={`${styles.langButton} ${locale === 'zh-TW' ? styles.langButtonActive : ''}`}
                aria-current={locale === 'zh-TW' ? 'page' : undefined}
              >
                {t.zh}
              </a>
              <a
                href={localeHref('en')}
                className={`${styles.langButton} ${locale === 'en' ? styles.langButtonActive : ''}`}
                aria-current={locale === 'en' ? 'page' : undefined}
              >
                {t.en}
              </a>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderTitle}>{t.pageTitle}</div>
            <div className={styles.cardHeaderSub}>
              <span>
                {t.studentLabel}: {studentName}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {t.dateLabel}: {date}
              </span>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}><AnimatedIcon name="BarChart3" size={20} color="#4A90D9" />{t.todaySummary}</div>
            <div className={styles.divider} />
            <div className={styles.metricGrid}>
              <div className={styles.metric}>
                <div className={styles.metricValue}>{today.cardsCompleted}</div>
                <div className={styles.metricLabel}>{t.cardsCompleted}</div>
              </div>
              <div className={styles.metric}>
                <div className={`${styles.metricValue} ${styles.metricValueGreen}`}>{today.accuracy}%</div>
                <div className={styles.metricLabel}>{t.accuracy}</div>
              </div>
              <div className={styles.metric}>
                <div className={`${styles.metricValue} ${styles.metricValueOrange}`}>
                  {today.streakDays} {t.daysUnit}
                </div>
                <div className={styles.metricLabel}>{t.streak}</div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}><AnimatedIcon name="BookOpen" size={20} color="#f59b03" />{t.mistakeBook}</div>
            <div className={styles.divider} />
            <div className={styles.threeCol}>
              <div className={styles.metric}>
                <div className={`${styles.metricValue} ${styles.metricValueOrange}`}>{mistakeBook.newToday}</div>
                <div className={styles.metricLabel}>{t.newToday}</div>
              </div>
              <div className={styles.metric}>
                <div className={`${styles.metricValue}`}>{mistakeBook.reviewed}</div>
                <div className={styles.metricLabel}>{t.reviewed}</div>
              </div>
              <div className={styles.metric}>
                <div className={`${styles.metricValue} ${styles.metricValueGreen}`}>{mistakeBook.mastered}</div>
                <div className={styles.metricLabel}>{t.mastered}</div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}><AnimatedIcon name="XCircle" size={20} color="#E84855" />{t.mistakesMade}</div>
            <div className={styles.divider} />
            <div className={styles.mistakesList}>
              {mistakesMade.map((m) => {
                const picked = m.choices.find((c) => c.key === m.picked)
                const correct = m.choices.find((c) => c.key === m.correct)
                const explanation = locale === 'en' ? m.explainEn : m.explainZh
                const question = locale === 'en' ? m.questionEn : m.questionZh

                return (
                  <div key={m.id} className={styles.mistakeCard}>
                    <div className={styles.mistakeQ}>{question}</div>
                    <div className={styles.choiceGrid}>
                      {m.choices.map((c) => {
                        const isPicked = c.key === m.picked
                        const isCorrect = c.key === m.correct
                        const cls = [
                          styles.choice,
                          isCorrect ? styles.choiceCorrect : '',
                          isPicked ? styles.choicePicked : '',
                        ]
                          .filter(Boolean)
                          .join(' ')
                        return (
                          <div key={c.key} className={cls}>
                            <span className={styles.choiceKey} aria-hidden="true">
                              {c.key}
                            </span>
                            <span className={styles.choiceText}>{locale === 'en' ? c.textEn : c.textZh}</span>
                          </div>
                        )
                      })}
                    </div>

                    <div className={styles.answerRow}>
                      <div className={styles.answerItem}>
                        <div className={styles.answerLabel}>{t.yourAnswer}</div>
                        <div className={styles.answerValueBad}>
                          {m.picked}. {locale === 'en' ? picked?.textEn : picked?.textZh}
                        </div>
                      </div>
                      <div className={styles.answerItem}>
                        <div className={styles.answerLabel}>{t.correctAnswer}</div>
                        <div className={styles.answerValueGood}>
                          {m.correct}. {locale === 'en' ? correct?.textEn : correct?.textZh}
                        </div>
                      </div>
                    </div>

                    <div className={styles.mistakeExplain}>{explanation}</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}><AnimatedIcon name="Lightbulb" size={20} color="#f59b03" />{t.learningAdvice}</div>
            <div className={styles.divider} />
            <p className={styles.bulletIntro}>{t.adviceIntro}</p>
            <ul className={styles.bullets}>
              {t.adviceBullets.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>

            <div className={styles.unitBlock}>
              <div className={styles.unitTitle}>{t.unitOverviewTitle}</div>
              <div className={styles.unitBody}>{t.unitOverviewBody}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

