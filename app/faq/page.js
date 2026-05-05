import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Accordion from '@/components/Accordion'
import { getLocale } from '@/lib/i18n/getLocale'
import { getSiteMessages } from '@/lib/i18n/getSiteMessages'
import { getFaqItems } from '@/lib/i18n/faqItems'
import styles from './page.module.css'

export async function generateMetadata() {
  const locale = await getLocale()
  const m = getSiteMessages(locale)
  return {
    title: m.faqPage.metaTitle,
    description: m.faqPage.metaDescription,
    alternates: {
      canonical: 'https://dogtor.superb-tutor.com/faq',
    },
    openGraph: {
      title: m.faqPage.ogTitle,
      description: m.faqPage.ogDescription,
      url: 'https://dogtor.superb-tutor.com/faq',
      type: 'website',
      locale: m.openGraphLocale,
      siteName: m.brand,
      images: ['/dogtor_cover.png'],
    },
  }
}

export default async function FAQ() {
  const locale = await getLocale()
  const m = getSiteMessages(locale)
  const faqData = getFaqItems(locale)

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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{m.faqPage.title}</h1>
            <p className={styles.pageSubtitle}>{m.faqPage.subtitle}</p>
          </div>

          <div className={styles.content}>
            <Accordion items={faqData} guidePrefix={m.accordion.guidePrefix} guideFallback={m.accordion.guideFallback} />

            <div className={styles.ctaBox}>
              <p className={styles.ctaText}>{m.faqPage.moreQuestions}</p>
              <Link href="/support" className="btn btn-secondary">
                {m.faqPage.contactSupport}
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
