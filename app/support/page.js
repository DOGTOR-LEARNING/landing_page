import { headers } from 'next/headers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getMessages } from '@/lib/i18n/messages'
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
import styles from './page.module.css'

export const metadata = {
  title: '支援中心 - Dogtor 逗課',
  description: '需要協助嗎？在這裡找到聯絡方式和常見問題的快速解決方案。',
}

export default async function Support() {
  const h = await headers()
  const locale = h.get('x-locale') || 'zh-TW'
  const m = getMessages(locale)
  const s = m.support

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{s.pageTitle}</h1>
            <p className={styles.pageSubtitle}>{s.pageSubtitle}</p>
          </div>

          <div className={styles.content}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{s.contactTitle}</h2>
              <p className={styles.text}>
                {s.contactTextPre} <strong>{s.contactDays}</strong> {s.contactTextPost}
              </p>
              <div className={styles.contactBox}>
                <div className={styles.contactItem}>
                  <Email className={styles.contactIcon} />
                  <div>
                    <p className={styles.contactLabel}>{s.emailLabel}</p>
                    <a
                      href="mailto:dogtor.love.learning@gmail.com"
                      className={styles.contactValue}
                    >
                      dogtor.love.learning@gmail.com
                    </a>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <AccessTime className={styles.contactIcon} />
                  <div>
                    <p className={styles.contactLabel}>{s.responseLabel}</p>
                    <p className={styles.contactValue}>{s.responseDays}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{s.quickActionsTitle}</h2>
              <p className={styles.text}>{s.quickActionsText}</p>
              <div className={styles.quickActions}>
                <a href="/faq" className={styles.actionCard}>
                  <HelpOutline className={styles.actionIcon} />
                  <h3 className={styles.actionTitle}>{s.actions.faq.title}</h3>
                  <p className={styles.actionDesc}>{s.actions.faq.desc}</p>
                </a>
                <a
                  href={`mailto:dogtor.love.learning@gmail.com?subject=${encodeURIComponent(s.emailSubjects.bug)}`}
                  className={styles.actionCard}
                >
                  <BugReport className={styles.actionIcon} />
                  <h3 className={styles.actionTitle}>{s.actions.bug.title}</h3>
                  <p className={styles.actionDesc}>{s.actions.bug.desc}</p>
                </a>
                <a
                  href={`mailto:dogtor.love.learning@gmail.com?subject=${encodeURIComponent(s.emailSubjects.login)}`}
                  className={styles.actionCard}
                >
                  <Lock className={styles.actionIcon} />
                  <h3 className={styles.actionTitle}>{s.actions.login.title}</h3>
                  <p className={styles.actionDesc}>{s.actions.login.desc}</p>
                </a>
                <a
                  href={`mailto:dogtor.love.learning@gmail.com?subject=${encodeURIComponent(s.emailSubjects.billing)}`}
                  className={styles.actionCard}
                >
                  <CreditCard className={styles.actionIcon} />
                  <h3 className={styles.actionTitle}>{s.actions.billing.title}</h3>
                  <p className={styles.actionDesc}>{s.actions.billing.desc}</p>
                </a>
                <a
                  href={`mailto:dogtor.love.learning@gmail.com?subject=${encodeURIComponent(s.emailSubjects.delete)}`}
                  className={styles.actionCard}
                >
                  <Delete className={styles.actionIcon} />
                  <h3 className={styles.actionTitle}>{s.actions.delete.title}</h3>
                  <p className={styles.actionDesc}>{s.actions.delete.desc}</p>
                </a>
                <a
                  href={`mailto:dogtor.love.learning@gmail.com?subject=${encodeURIComponent(s.emailSubjects.feature)}`}
                  className={styles.actionCard}
                >
                  <Lightbulb className={styles.actionIcon} />
                  <h3 className={styles.actionTitle}>{s.actions.feature.title}</h3>
                  <p className={styles.actionDesc}>{s.actions.feature.desc}</p>
                </a>
              </div>
            </section>

            <section className={styles.tipSection}>
              <h3 className={styles.tipTitle}>
                <Lightbulb
                  sx={{ fontSize: '1.25rem', verticalAlign: 'middle', marginRight: '0.5rem' }}
                />
                {s.tipTitle}
              </h3>
              <ul className={styles.tipList}>
                {s.tipItems.map((item, i) => (
                  <li key={i}>{item}</li>
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
