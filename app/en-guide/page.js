import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getAllGlobalArticles, GLOBAL_GUIDE_URL } from '@/lib/globalArticles'
import { MARKET_GLOBAL, siteUrl } from '@/lib/market'
import styles from '../guide/page.module.css'

// Served as global.superb-tutor.com/guide (rewrite in next.config.js).

const TITLE = 'AP & SAT Study Guides | Practice Questions, Exam Format & Study Plans - Dogtor'
const DESCRIPTION =
  'Free AP and SAT study guides from Dogtor: exam formats and unit weights, practice questions with full explanations, and week-by-week self-study plans.'

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: GLOBAL_GUIDE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: GLOBAL_GUIDE_URL,
    type: 'website',
    locale: 'en_US',
    siteName: 'Dogtor',
    images: ['/dogtor_cover.png'],
  },
}

export default function GlobalGuideIndexPage() {
  const articles = getAllGlobalArticles()
  const base = siteUrl(MARKET_GLOBAL)

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AP & SAT Study Guides - Dogtor',
    description: DESCRIPTION,
    url: GLOBAL_GUIDE_URL,
    inLanguage: 'en',
    isPartOf: { '@type': 'WebSite', name: 'Dogtor', url: base },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: articles.length,
      itemListElement: articles.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${GLOBAL_GUIDE_URL}/${a.slug}`,
        name: a.title,
      })),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <Header />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>AP &amp; SAT Study Guides</h1>
            <p className={styles.pageSubtitle}>
              Exam formats, practice questions with full explanations, and study plans you can actually follow.
            </p>
          </div>

          <div className={styles.articleGrid}>
            {articles.map((article) => (
              <article key={article.slug} className={styles.articleCard}>
                <Link href={`/guide/${article.slug}`} className={styles.articleLink}>
                  <span className={styles.articleCategory}>{article.category}</span>
                  <h2 className={styles.articleTitle}>{article.title}</h2>
                  <p className={styles.articleExcerpt}>{article.excerpt}</p>
                  <div className={styles.articleMeta}>
                    <time dateTime={article.publishDate}>
                      {new Date(article.publishDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
