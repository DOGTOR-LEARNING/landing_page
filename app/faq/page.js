import Link from 'next/link'
import { headers } from 'next/headers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Accordion from '@/components/Accordion'
import { getMessages } from '@/lib/i18n/messages'
import styles from './page.module.css'

export const metadata = {
  title: '常見問題 - Dogtor 逗課 | 國高中題庫學習 App FAQ',
  description:
    'Dogtor 逗課是台灣國高中生學習 App（非獸醫服務）。常見問題解答：App 是否免費？支援哪些科目（國中數學、理化、自然、高中化學）？Android Google Play 如何下載？好友對戰怎麼玩？AI 解題怎麼用？',
  alternates: {
    canonical: 'https://dogtor.superb-tutor.com/faq',
  },
  openGraph: {
    title: '常見問題 FAQ - Dogtor 逗課',
    description:
      'Dogtor 逗課常見問題解答：免費下載、支援科目、好友對戰、AI 解題、帳號管理等問題一次說清楚。',
    url: 'https://dogtor.superb-tutor.com/faq',
    type: 'website',
    locale: 'zh_TW',
    siteName: 'Dogtor 逗課',
    images: ['/dogtor_cover.png'],
  },
}

export default async function FAQ() {
  const h = await headers()
  const locale = h.get('x-locale') || 'zh-TW'
  const m = getMessages(locale)
  const faqData = m.faq.items

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{m.faq.pageTitle}</h1>
            <p className={styles.pageSubtitle}>{m.faq.pageSubtitle}</p>
          </div>

          <div className={styles.content}>
            <Accordion items={faqData} />

            <div className={styles.ctaBox}>
              <p className={styles.ctaText}>{m.faq.ctaText}</p>
              <Link href="/support" className="btn btn-secondary">
                {m.faq.contactSupport}
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
