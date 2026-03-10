import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ArticleCTA from '@/components/ArticleCTA'
import RelatedArticles from '@/components/RelatedArticles'
import {
  getArticleBySlug,
  getAllArticles,
  getRelatedArticles,
  getArticleUrl,
} from '@/lib/articles'
import styles from './page.module.css'

const BASE_URL = 'https://dogtor.superb-tutor.com'

export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return { title: '文章不存在' }

  return {
    title: `${article.title} - Dogtor 逗課 學習指南`,
    description: article.description,
    keywords: [
      ...(article.tags || []),
      '會考',
      '學測',
      '108課綱',
      '歷屆試題',
      '錯題本',
      '讀書計畫',
      'Dogtor 逗課',
    ],
    alternates: {
      canonical: getArticleUrl(article.slug),
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url: getArticleUrl(article.slug),
      type: 'article',
      publishedTime: article.publishDate,
      locale: 'zh_TW',
      siteName: 'Dogtor 逗課',
      images: ['/dogtor_cover.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
  }
}

export default async function GuideArticlePage({ params }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()

  const related = getRelatedArticles(article.slug, 3)

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.publishDate,
    author: {
      '@type': 'Organization',
      name: 'Dogtor 逗課',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Dogtor 逗課',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/dogtor_logo.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': getArticleUrl(article.slug),
    },
  }

  const faqJsonLd = article.faq?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: article.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }
    : null

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首頁', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: '學習指南', item: `${BASE_URL}/guide` },
      { '@type': 'ListItem', position: 3, name: article.title, item: getArticleUrl(article.slug) },
    ],
  }

  const readingTime = Math.max(3, Math.ceil((article.content?.intro?.length || 0) / 200 + (article.content?.sections?.length || 0) * 2))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />
      <main className={styles.main}>
        <article className={styles.article}>
          <div className="container">
            <nav className={styles.breadcrumb} aria-label="麵包屑">
              <Link href="/">首頁</Link>
              <span className={styles.breadcrumbSep}>/</span>
              <Link href="/guide">學習指南</Link>
              <span className={styles.breadcrumbSep}>/</span>
              <span className={styles.breadcrumbCurrent}>{article.title}</span>
            </nav>

            <header className={styles.articleHeader}>
              <span className={styles.articleCategory}>{article.category}</span>
              <h1 className={styles.articleTitle}>{article.title}</h1>
              <div className={styles.articleMeta}>
                <time dateTime={article.publishDate}>
                  {new Date(article.publishDate).toLocaleDateString('zh-TW', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <span>·</span>
                <span>約 {readingTime} 分鐘閱讀</span>
              </div>
            </header>

            <div className={styles.articleBody}>
              <p className={styles.articleIntro}>{article.content.intro}</p>

              {article.content.sections?.map((section, i) => (
                <section key={i} className={styles.articleSection}>
                  <h2>{section.h2}</h2>
                  <p>{section.body}</p>
                </section>
              ))}

              <article className={styles.ctaBlock}>
                <ArticleCTA
                  painPoint={article.ctaPainPoint}
                  scene={article.ctaScene}
                />
              </article>

              {article.faq?.length > 0 && (
                <section className={styles.faqSection}>
                  <h2>常見問題</h2>
                  <dl className={styles.faqList}>
                    {article.faq.map((item, i) => (
                      <div key={i} className={styles.faqItem}>
                        <dt>{item.question}</dt>
                        <dd>{item.answer}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}

              {related.length > 0 && (
                <section className={styles.relatedSection}>
                  <RelatedArticles articles={related} />
                </section>
              )}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
