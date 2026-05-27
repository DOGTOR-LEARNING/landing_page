import { headers } from 'next/headers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LegalContent from '@/components/LegalContent'
import { getLegalMessages } from '@/lib/i18n/legalMessages'
import styles from '../legal.module.css'

export const metadata = {
  title: '退款政策 - Dogtor 逗課',
  description: 'Dogtor 逗課的退款政策，了解訂閱退款條件與流程。',
}

export default async function Refund() {
  const h = await headers()
  const locale = h.get('x-locale') || 'zh-TW'
  const legal = getLegalMessages(locale)
  const page = legal.refund

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
