import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StoreButtons from '@/components/StoreButtons'
import MarkdownContent from '@/components/MarkdownContent'
import ApScoreCalculator from '@/components/ApScoreCalculator'
import {
  AP_CALCULATORS,
  CALCULATOR_BASE_PATH,
  EXAM_YEAR,
  calculatorFaq,
  frqPointInMcq,
  frqTotal,
  getCalculator,
} from '@/lib/apScoreCalculators'
import { MARKET_GLOBAL, siteUrl } from '@/lib/market'
import styles from '../page.module.css'

// International site only (global.superb-tutor.com); the middleware sends the
// Taiwan host to the same path on the international one.

const BASE_URL = siteUrl(MARKET_GLOBAL)

export function generateStaticParams() {
  return AP_CALCULATORS.map((c) => ({ subject: c.slug }))
}

export const dynamicParams = false

function pageTitle(calc) {
  return `${calc.shortName} Score Calculator ${EXAM_YEAR}: Estimate Your ${calc.name} Score`
}

function pageDescription(calc) {
  return `Free ${calc.name} score calculator for ${EXAM_YEAR}. Enter your multiple-choice and free-response scores to estimate your AP score from 1 to 5, see your weighted percentage and how many points you need for the next score.`
}

export async function generateMetadata({ params }) {
  const { subject } = await params
  const calc = getCalculator(subject)
  if (!calc) return { title: 'Calculator not found - Dogtor' }
  const url = `${BASE_URL}${CALCULATOR_BASE_PATH}/${calc.slug}`
  return {
    title: `${pageTitle(calc)} - Dogtor`,
    description: pageDescription(calc),
    keywords: [
      `${calc.shortName} score calculator`,
      `${calc.name} score calculator`,
      `${calc.shortName} score calculator ${EXAM_YEAR}`,
      `${calc.shortName} curve`,
      `how is ${calc.shortName} scored`,
      'AP score calculator',
    ],
    alternates: { canonical: url },
    openGraph: {
      title: pageTitle(calc),
      description: pageDescription(calc),
      url,
      type: 'website',
      locale: 'en_US',
      siteName: 'Dogtor',
      images: ['/dogtor_cover.png'],
    },
    twitter: { card: 'summary_large_image', title: pageTitle(calc), description: pageDescription(calc) },
  }
}

function formatTable(calc) {
  const mcqPct = Math.round(calc.mcq.weight * 100)
  const rows = [
    '| Section | Questions | Points | Time | Weight |',
    '|---|---|---|---|---|',
    `| I: Multiple choice | ${calc.mcq.count} | ${calc.mcq.count} (1 per correct answer) | ${calc.mcq.minutes} min | ${mcqPct}% |`,
    `| II: Free response | ${calc.frqs.length} | ${frqTotal(calc)} | ${calc.frqMinutes} min | ${100 - mcqPct}% |`,
  ]
  const frqRows = ['| Free-response question | Points |', '|---|---|', ...calc.frqs.map((f) => `| ${f.label} | ${f.max} |`)]
  return `${rows.join('\n')}\n\nThere is no penalty for wrong answers, so never leave a multiple-choice question blank.\n\n${frqRows.join('\n')}`
}

function cutoffTable(calc) {
  const c = calc.cutoffs
  return [
    '| AP score | Meaning | Estimated weighted score |',
    '|---|---|---|',
    `| 5 | Extremely well qualified | ${c[5]}% and up |`,
    `| 4 | Very well qualified | ${c[4]}–${c[5] - 1}% |`,
    `| 3 | Qualified | ${c[3]}–${c[4] - 1}% |`,
    `| 2 | Possibly qualified | ${c[2]}–${c[3] - 1}% |`,
    `| 1 | No recommendation | below ${c[2]}% |`,
  ].join('\n')
}

export default async function ApScoreCalculatorPage({ params }) {
  const { subject } = await params
  const calc = getCalculator(subject)
  if (!calc) notFound()

  const url = `${BASE_URL}${CALCULATOR_BASE_PATH}/${calc.slug}`
  const faq = calculatorFaq(calc)
  const others = AP_CALCULATORS.filter((c) => c.slug !== calc.slug)

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: `${calc.shortName} Score Calculator`,
      url,
      description: pageDescription(calc),
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Any (web browser)',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      inLanguage: 'en',
      about: { '@type': 'Thing', name: `${calc.name} exam` },
      provider: { '@type': 'Organization', name: 'Dogtor', url: BASE_URL },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'AP Score Calculators', item: `${BASE_URL}${CALCULATOR_BASE_PATH}` },
        { '@type': 'ListItem', position: 3, name: `${calc.shortName} Score Calculator`, item: url },
      ],
    },
  ]

  return (
    <>
      {jsonLd.map((data, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
      ))}
      <Header />
      <main className={styles.main}>
        <div className="container">
          <article className={styles.page}>
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span className={styles.breadcrumbSep}>/</span>
              <Link href={CALCULATOR_BASE_PATH}>AP Score Calculators</Link>
              <span className={styles.breadcrumbSep}>/</span>
              <span className={styles.breadcrumbCurrent}>{calc.shortName}</span>
            </nav>

            <header className={styles.header}>
              <p className={styles.eyebrow}>Free AP score calculator · {EXAM_YEAR} exam</p>
              <h1 className={styles.title}>{calc.shortName} Score Calculator</h1>
              <p className={styles.lead}>
                Enter how many {calc.name} multiple-choice questions you got right and your free-response points.
                The calculator applies the official section weights and estimates your AP score from 1 to 5.
              </p>
            </header>

            <ApScoreCalculator calc={calc} />

            <section className={styles.section}>
              <h2>How the {calc.name} exam is scored</h2>
              <MarkdownContent>{formatTable(calc)}</MarkdownContent>
              <p className={styles.text}>
                With these weights, <strong>one free-response point is worth about {frqPointInMcq(calc).toFixed(1)}{' '}
                multiple-choice questions</strong>. {calc.tip}
              </p>
              <p className={styles.text}>
                Full breakdown of units and question types:{' '}
                <Link href={`/guide/${calc.guide.slug}`}>{calc.guide.title}</Link>.
              </p>
            </section>

            <section className={styles.section}>
              <h2>{calc.shortName} score ranges (estimated)</h2>
              <MarkdownContent>{cutoffTable(calc)}</MarkdownContent>
              <p className={styles.text}>
                The College Board converts composite scores to AP scores with cut points it sets after each exam and
                does not publish. These ranges are approximations based on released scoring worksheets and typical score
                distributions, so use them to set targets, not to predict your exact result.
              </p>
            </section>

            <section className={styles.ctaBlock}>
              <h2>Raise your {calc.shortName} score without hating it</h2>
              <p>
                Dogtor turns {calc.name} review into a game: bite-sized practice levels, a cute corgi study buddy,
                real-time quiz battles with friends and an AI tutor that explains every miss. Every answer maps to a
                concept, so while you play, Dogtor finds the units you&apos;re weakest on and sends you more of those. Free
                on iOS and Android.
              </p>
              <StoreButtons location={`ap_calculator_${calc.slug}`} className="article-cta-buttons" />
            </section>

            <section className={styles.section}>
              <h2>Frequently asked questions</h2>
              <dl className={styles.faqList}>
                {faq.map((item) => (
                  <div key={item.question} className={styles.faqItem}>
                    <dt>{item.question}</dt>
                    <dd>{item.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className={styles.section}>
              <h2>Other AP score calculators</h2>
              <ul className={styles.linkGrid}>
                {others.map((c) => (
                  <li key={c.slug}>
                    <Link href={`${CALCULATOR_BASE_PATH}/${c.slug}`} className={styles.linkCard}>
                      <span className={styles.linkCardTitle}>{c.shortName} Score Calculator</span>
                      <span className={styles.linkCardMeta}>{c.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <p className={styles.footnote}>
              AP and Advanced Placement are registered trademarks of the College Board, which was not involved in the
              production of, and does not endorse, this calculator.
            </p>
          </article>
        </div>
      </main>
      <Footer />
    </>
  )
}
