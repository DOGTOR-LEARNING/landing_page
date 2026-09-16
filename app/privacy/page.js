import { headers } from 'next/headers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LegalContent from '@/components/LegalContent'
import { getLegalMessages } from '@/lib/i18n/legalMessages'
import styles from '../legal.module.css'

export const metadata = {
  title: '隱私權政策 - Dogtor 逗課',
  description: '了解 Dogtor 逗課 App 如何收集、使用和保護你的個人資料。',
}

export default async function Privacy() {
  const h = await headers()
  const locale = h.get('x-locale') || 'zh-TW'
  const legal = getLegalMessages(locale)
  const page = legal.privacy

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{page.pageTitle}</h1>
            <p className={styles.updateDate}>{page.updateDate}</p>
          </div>

          <div className={styles.content}>
            <LegalContent sections={page.sections} locale={locale} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
