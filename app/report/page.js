import Image from 'next/image'
import Link from 'next/link'
import { headers } from 'next/headers'
import styles from './page.module.css'
import { getReportMessages } from '@/lib/i18n/reportMessages'

async function pickLocaleFromRequest() {
  const h = await headers()
  const v = h.get('x-locale')
  return v === 'en' ? 'en' : 'zh-TW'
}

function localeHref(nextLocale) {
  return nextLocale === 'en' ? '/report?lang=en' : '/report?lang=zh-TW'
}

export const metadata = {
  title: 'Dogtor | Report',
  description: 'Daily learning report for parents.',
}

export default async function ReportPage() {
  const locale = await pickLocaleFromRequest()
  const t = getReportMessages(locale)

  // Static mock data (later can be fed by backend/app link params)
  const studentName = locale === 'en' ? 'Pierre Chen' : 'Pierre Chen'
  const date = '2026/05/04'

  const today = {
    cardsCompleted: 12,
    accuracy: 78,
    streakDays: 7,
  }

  const mistakeBook = {
    newToday: 6,
    reviewed: 14,
    mastered: 9,
  }

  const mistakesMade = [
    {
      id: 'mitosis-spindle-fibers',
      question: 'What is the role of the spindle fibers during mitosis?',
      choices: [
        { key: 'A', text: 'To replicate chromosomes' },
        { key: 'B', text: 'To hold organelles in place' },
        { key: 'C', text: 'To separate sister chromatids' },
        { key: 'D', text: 'To dissolve the nuclear envelope' },
      ],
      picked: 'A',
      correct: 'C',
      explainEn:
        'Spindle fibers attach to chromosomes and pull sister chromatids apart so each daughter cell gets one copy.',
      explainZh:
        '紡錘絲會連接染色體並把姐妹染色分體拉開，讓兩個新細胞各分到一份。',
    },
    {
      id: 'signaling-paracrine',
      question: 'Which type of signaling involves a cell releasing a signal that affects nearby cells?',
      choices: [
        { key: 'A', text: 'Endocrine' },
        { key: 'B', text: 'Autocrine' },
        { key: 'C', text: 'Paracrine' },
        { key: 'D', text: 'Synaptic' },
      ],
      picked: 'A',
      correct: 'C',
      explainEn: 'Paracrine signaling is local—signals act on nearby target cells.',
      explainZh: '旁分泌是「局部」訊號，主要影響附近的細胞。',
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
              <Link
                href={localeHref('zh-TW')}
                className={`${styles.langButton} ${locale === 'zh-TW' ? styles.langButtonActive : ''}`}
                aria-current={locale === 'zh-TW' ? 'page' : undefined}
              >
                {t.zh}
              </Link>
              <Link
                href={localeHref('en')}
                className={`${styles.langButton} ${locale === 'en' ? styles.langButtonActive : ''}`}
                aria-current={locale === 'en' ? 'page' : undefined}
              >
                {t.en}
              </Link>
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
            <div className={styles.sectionTitle}>📊 {t.todaySummary}</div>
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
            <div className={styles.sectionTitle}>📝 {t.mistakeBook}</div>
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
            <div className={styles.sectionTitle}>❌ {t.mistakesMade}</div>
            <div className={styles.divider} />
            <div className={styles.mistakesList}>
              {mistakesMade.map((m) => {
                const picked = m.choices.find((c) => c.key === m.picked)
                const correct = m.choices.find((c) => c.key === m.correct)
                const explanation = locale === 'en' ? m.explainEn : m.explainZh

                return (
                  <div key={m.id} className={styles.mistakeCard}>
                    <div className={styles.mistakeQ}>{m.question}</div>
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
                            <span className={styles.choiceText}>{c.text}</span>
                          </div>
                        )
                      })}
                    </div>

                    <div className={styles.answerRow}>
                      <div className={styles.answerItem}>
                        <div className={styles.answerLabel}>{t.yourAnswer}</div>
                        <div className={styles.answerValueBad}>
                          {m.picked}. {picked?.text}
                        </div>
                      </div>
                      <div className={styles.answerItem}>
                        <div className={styles.answerLabel}>{t.correctAnswer}</div>
                        <div className={styles.answerValueGood}>
                          {m.correct}. {correct?.text}
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
            <div className={styles.sectionTitle}>💡 {t.learningAdvice}</div>
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

