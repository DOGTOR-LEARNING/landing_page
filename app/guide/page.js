import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getAllArticles } from '@/lib/articles'
import { getLocale } from '@/lib/i18n/getLocale'
import { getSiteMessages } from '@/lib/i18n/getSiteMessages'
import styles from './page.module.css'

export async function generateMetadata() {
  const locale = await getLocale()
  const m = getSiteMessages(locale)
  return {
    title: m.guide.metaTitle,
    description: m.guide.metaDescription,
    alternates: {
      canonical: 'https://dogtor.superb-tutor.com/guide',
    },
    openGraph: {
      title: m.guide.ogTitle,
      description: m.guide.ogDescription,
      url: 'https://dogtor.superb-tutor.com/guide',
      type: 'website',
      locale: m.openGraphLocale,
      siteName: m.brand,
      images: ['/dogtor_cover.png'],
    },
  }
}

export default async function GuideIndexPage({ searchParams }) {
  const locale = await getLocale()
  const m = getSiteMessages(locale)
  const resolved = searchParams ? await searchParams : {}
  const category = resolved?.category
  const allArticles = getAllArticles()
  const articles = category ? allArticles.filter((a) => a.category === category) : allArticles

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{m.guide.indexTitle}</h1>
            <p className={styles.pageSubtitle}>{m.guide.indexSubtitle}</p>
          </div>

          <div className={styles.categoryTabs}>
            {m.guide.categories.map((cat) => (
              <Link
                key={cat.id}
                href={cat.id === 'all' ? '/guide' : `/guide?category=${encodeURIComponent(cat.id)}`}
                className={styles.categoryTab}
              >
                {cat.label}
              </Link>
            ))}
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
                      {new Date(article.publishDate).toLocaleDateString(m.dateLocale, {
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
