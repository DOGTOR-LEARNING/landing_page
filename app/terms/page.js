import { headers } from 'next/headers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LegalContent from '@/components/LegalContent'
import { getLegalMessages } from '@/lib/i18n/legalMessages'
import styles from '../legal.module.css'

export const metadata = {
  title: '服務條款 - Dogtor 逗課',
  description: 'Dogtor 逗課 App 的使用條款和服務協議。',
}

export default async function Terms() {
  const h = await headers()
  const locale = h.get('x-locale') || 'zh-TW'
  const legal = getLegalMessages(locale)
  const page = legal.terms

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
            <LegalContent sections={page.sections} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
