import Link from 'next/link'
import { headers } from 'next/headers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getAllArticles, getFeaturedArticles } from '@/lib/articles'
import { getMessages } from '@/lib/i18n/messages'
import styles from './page.module.css'

export const metadata = {
  title: '國高中學習指南｜會考題庫練習・學測 AI 解題・分科測驗攻略 - Dogtor 逗課',
  description:
    'Dogtor 逗課學習指南：國中會考怎麼準備最有效率、會考題庫練習 App 推薦、學測 AI 解題 App、分科測驗題庫練習平台、家長如何幫孩子。涵蓋錯題本、歷屆試題、番茄鐘、108課綱等實用攻略。',
  keywords: [
    '會考題庫練習 app 推薦',
    '學測 ai 解題 app',
    '分科測驗題庫練習平台',
    '國中會考怎麼準備最有效率',
    '會考準備',
    '學測攻略',
    '分科測驗',
    '題庫練習',
    'AI解題',
    '錯題本',
    '歷屆試題',
    'Dogtor 逗課',
  ],
  alternates: {
    canonical: 'https://dogtor.superb-tutor.com/guide',
  },
  openGraph: {
    title: '國高中學習指南｜會考題庫練習・學測 AI 解題・分科測驗攻略 - Dogtor 逗課',
    description:
      '國中會考怎麼準備、會考題庫練習 App 推薦、學測 AI 解題、分科測驗題庫平台、家長指南。錯題本、歷屆試題、番茄鐘完整攻略。',
    url: 'https://dogtor.superb-tutor.com/guide',
    type: 'website',
    locale: 'zh_TW',
    siteName: 'Dogtor 逗課',
    images: ['/dogtor_cover.png'],
  },
}

const CATEGORY_KEYS = ['all', '會考準備', '學測攻略', '讀書方法', '家長指南', 'App 推薦']

export default async function GuideIndexPage({ searchParams }) {
  const h = await headers()
  const locale = h.get('x-locale') || 'zh-TW'
  const m = getMessages(locale)

  const resolved = searchParams ? await searchParams : {}
  const category = resolved?.category
  const allArticles = getAllArticles()
  const featured = getFeaturedArticles(4)
  const articles = category
    ? allArticles.filter((a) => a.category === category)
    : allArticles

  const dateLocale = locale === 'en' ? 'en-US' : 'zh-TW'
  const showFeatured = !category && featured.length > 0

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{m.guide.pageTitle}</h1>
            <p className={styles.pageSubtitle}>{m.guide.pageSubtitle}</p>
          </div>

          {showFeatured && (
            <section className={styles.featuredSection}>
              <h2 className={styles.featuredHeading}>{m.guide.featured || '精選文章'}</h2>
              <div className={styles.featuredGrid}>
                {featured.map((article, i) => (
                  <article key={article.slug} className={`${styles.featuredCard} ${i === 0 ? styles.featuredCardMain : ''}`}>
                    <Link href={`/guide/${article.slug}`} className={styles.featuredLink}>
                      <span className={styles.articleCategory}>{article.category}</span>
                      <h3 className={styles.featuredTitle}>{article.title}</h3>
                      <p className={styles.featuredExcerpt}>{article.excerpt}</p>
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}

          <div className={styles.categoryTabs}>
            {CATEGORY_KEYS.map((key) => (
              <Link
                key={key}
                href={key === 'all' ? '/guide' : `/guide?category=${encodeURIComponent(key)}`}
                className={styles.categoryTab}
              >
                {m.guide.categories[key] || key}
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
                      {new Date(article.publishDate).toLocaleDateString(dateLocale, {
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
