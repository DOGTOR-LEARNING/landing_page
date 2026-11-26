import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StoreButtons from '@/components/StoreButtons'
import { AP_CALCULATORS, CALCULATOR_BASE_PATH, EXAM_YEAR, frqTotal } from '@/lib/apScoreCalculators'
import { MARKET_GLOBAL, siteUrl } from '@/lib/market'
import styles from './page.module.css'

const BASE_URL = siteUrl(MARKET_GLOBAL)
const PAGE_URL = `${BASE_URL}${CALCULATOR_BASE_PATH}`
const TITLE = `AP Score Calculators ${EXAM_YEAR}: APES, AP Bio, AP Psych and AP Gov`
const DESCRIPTION = `Free AP score calculators for the ${EXAM_YEAR} exams. Estimate your AP Environmental Science, AP Biology, AP Psychology and AP U.S. Government score from your multiple-choice and free-response results.`

export const metadata = {
  title: `${TITLE} - Dogtor`,
  description: DESCRIPTION,
  keywords: ['AP score calculator', `AP score calculator ${EXAM_YEAR}`, ...AP_CALCULATORS.map((c) => `${c.shortName} score calculator`)],
  alternates: { canonical: PAGE_URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PAGE_URL, type: 'website', locale: 'en_US', siteName: 'Dogtor', images: ['/dogtor_cover.png'] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

export default function ApScoreCalculatorsIndex() {
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'AP Score Calculators',
    itemListElement: AP_CALCULATORS.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${c.shortName} Score Calculator`,
      url: `${PAGE_URL}/${c.slug}`,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <Header />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.page}>
            <header className={styles.header}>
              <p className={styles.eyebrow}>Free tools · {EXAM_YEAR} exams</p>
              <h1 className={styles.title}>AP Score Calculators</h1>
              <p className={styles.lead}>
                Plug in a practice test and see where you stand. Each calculator uses the official section weights and
                point values and estimates your AP score from 1 to 5, plus how many more points you need for the next score.
              </p>
            </header>

            <ul className={styles.linkGrid}>
              {AP_CALCULATORS.map((c) => (
                <li key={c.slug}>
                  <Link href={`${CALCULATOR_BASE_PATH}/${c.slug}`} className={styles.linkCard}>
                    <span className={styles.linkCardTitle}>{c.shortName} Score Calculator</span>
                    <span className={styles.linkCardMeta}>
                      {c.name} · {c.mcq.count} MCQ + {c.frqs.length} FRQ ({frqTotal(c)} pts)
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <section className={styles.ctaBlock}>
              <h2>Then make the practice fun</h2>
              <p>
                Dogtor has practice levels for every subject here, real-time quiz battles with friends, a cute corgi study
                buddy and an AI tutor that explains every miss and finds your weak units for you. Free on iOS and Android.
              </p>
              <StoreButtons location="ap_calculator_index" className="article-cta-buttons" />
            </section>

            <p className={styles.footnote}>
              AP and Advanced Placement are registered trademarks of the College Board, which was not involved in the
              production of, and does not endorse, these calculators. Score conversions are estimates.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
