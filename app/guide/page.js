import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getAllArticles } from '@/lib/articles'
import styles from './page.module.css'

export const metadata = {
  title: '國高中學習指南｜會考學測必備攻略 - Dogtor 逗課',
  description:
    'Dogtor 逗課學習指南：會考怎麼準備、學測倒數衝刺、國中生讀書方法、家長如何幫孩子、通勤學習 App 推薦。涵蓋錯題本、歷屆試題、番茄鐘、108課綱等實用攻略。',
  alternates: {
    canonical: 'https://dogtor.superb-tutor.com/guide',
  },
  openGraph: {
    title: '國高中學習指南｜會考學測必備攻略 - Dogtor 逗課',
    description:
      '會考學測準備、讀書方法、家長指南、App 推薦。錯題本、歷屆試題、番茄鐘、通勤學習完整攻略。',
    url: 'https://dogtor.superb-tutor.com/guide',
    type: 'website',
    locale: 'zh_TW',
    siteName: 'Dogtor 逗課',
    images: ['/dogtor_cover.png'],
  },
}

const CATEGORIES = [
  { id: 'all', label: '全部' },
  { id: '會考準備', label: '會考準備' },
  { id: '學測攻略', label: '學測攻略' },
  { id: '讀書方法', label: '讀書方法' },
  { id: '家長指南', label: '家長指南' },
  { id: 'App 推薦', label: 'App 推薦' },
]

export default async function GuideIndexPage({ searchParams }) {
  const resolved = searchParams ? await searchParams : {}
  const category = resolved?.category
  const allArticles = getAllArticles()
  const articles = category
    ? allArticles.filter((a) => a.category === category)
    : allArticles

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>國高中學習指南</h1>
            <p className={styles.pageSubtitle}>
              會考學測必備攻略、讀書方法、家長指南、App 推薦。解決學習過程中的焦慮與效率問題。
            </p>
          </div>

          <div className={styles.categoryTabs}>
            {CATEGORIES.map((cat) => (
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
                      {new Date(article.publishDate).toLocaleDateString('zh-TW', {
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
