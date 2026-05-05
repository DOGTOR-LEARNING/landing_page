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
  Lightbulb,
} from '@mui/icons-material'
import { getLocale } from '@/lib/i18n/getLocale'
import { getSiteMessages } from '@/lib/i18n/getSiteMessages'
import styles from './page.module.css'

export async function generateMetadata() {
  const locale = await getLocale()
  const m = getSiteMessages(locale)
  return {
    title: m.supportPage.metaTitle,
    description: m.supportPage.metaDescription,
  }
}

export default async function Support() {
  const locale = await getLocale()
  const m = getSiteMessages(locale)
  const s = m.supportPage

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{s.title}</h1>
            <p className={styles.pageSubtitle}>{s.subtitle}</p>
          </div>

          <div className={styles.content}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{s.contactTitle}</h2>
              <p className={styles.text}>
                {s.contactIntroPrefix}
                <strong>{s.contactIntroBold}</strong>
                {s.contactIntroSuffix}
              </p>
              <div className={styles.contactBox}>
                <div className={styles.contactItem}>
                  <Email className={styles.contactIcon} />
                  <div>
                    <p className={styles.contactLabel}>{s.emailLabel}</p>
                    <a href="mailto:dogtor.love.learning@gmail.com" className={styles.contactValue}>
                      dogtor.love.learning@gmail.com
                    </a>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <AccessTime className={styles.contactIcon} />
                  <div>
                    <p className={styles.contactLabel}>{s.replyTimeLabel}</p>
                    <p className={styles.contactValue}>{s.replyTimeValue}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{s.quickTitle}</h2>
              <p className={styles.text}>{s.quickIntro}</p>
              <div className={styles.quickActions}>
                <Link href="/faq" className={styles.actionCard}>
                  <HelpOutline className={styles.actionIcon} />
                  <h3 className={styles.actionTitle}>{s.actionFaqTitle}</h3>
                  <p className={styles.actionDesc}>{s.actionFaqDesc}</p>
                </Link>
                <a
                  href={`mailto:dogtor.love.learning@gmail.com?subject=${encodeURIComponent(s.mailSubjectBug)}`}
                  className={styles.actionCard}
                >
                  <BugReport className={styles.actionIcon} />
                  <h3 className={styles.actionTitle}>{s.actionBugTitle}</h3>
                  <p className={styles.actionDesc}>{s.actionBugDesc}</p>
                </a>
                <a
                  href={`mailto:dogtor.love.learning@gmail.com?subject=${encodeURIComponent(s.mailSubjectLogin)}`}
                  className={styles.actionCard}
                >
                  <Lock className={styles.actionIcon} />
                  <h3 className={styles.actionTitle}>{s.actionLoginTitle}</h3>
                  <p className={styles.actionDesc}>{s.actionLoginDesc}</p>
                </a>
                <a
                  href={`mailto:dogtor.love.learning@gmail.com?subject=${encodeURIComponent(s.mailSubjectBilling)}`}
                  className={styles.actionCard}
                >
                  <CreditCard className={styles.actionIcon} />
                  <h3 className={styles.actionTitle}>{s.actionBillingTitle}</h3>
                  <p className={styles.actionDesc}>{s.actionBillingDesc}</p>
                </a>
                <a
                  href={`mailto:dogtor.love.learning@gmail.com?subject=${encodeURIComponent(s.mailSubjectDelete)}`}
                  className={styles.actionCard}
                >
                  <Delete className={styles.actionIcon} />
                  <h3 className={styles.actionTitle}>{s.actionDeleteTitle}</h3>
                  <p className={styles.actionDesc}>{s.actionDeleteDesc}</p>
                </a>
                <a
                  href={`mailto:dogtor.love.learning@gmail.com?subject=${encodeURIComponent(s.mailSubjectIdea)}`}
                  className={styles.actionCard}
                >
                  <Lightbulb className={styles.actionIcon} />
                  <h3 className={styles.actionTitle}>{s.actionIdeaTitle}</h3>
                  <p className={styles.actionDesc}>{s.actionIdeaDesc}</p>
                </a>
              </div>
            </section>

            <section className={styles.tipSection}>
              <h3 className={styles.tipTitle}>
                <Lightbulb sx={{ fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '0.5rem' }} />
                {s.tipHeading}
              </h3>
              <ul className={styles.tipList}>
                {s.tipItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className={styles.tipNote}>{s.tipNote}</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
