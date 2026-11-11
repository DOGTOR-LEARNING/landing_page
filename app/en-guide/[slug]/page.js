import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StoreButtons from '@/components/StoreButtons'
import RelatedArticles from '@/components/RelatedArticles'
import MarkdownContent from '@/components/MarkdownContent'
import {
  getAllGlobalArticles,
  getGlobalArticleBySlug,
  getGlobalArticleUrl,
  getRelatedGlobalArticles,
  GLOBAL_GUIDE_URL,
} from '@/lib/globalArticles'
import { MARKET_GLOBAL, siteUrl } from '@/lib/market'
import styles from '../../guide/[slug]/page.module.css'

// Served as global.superb-tutor.com/guide/<slug> (rewrite in next.config.js).

const BASE_URL = siteUrl(MARKET_GLOBAL)

export async function generateStaticParams() {
  return getAllGlobalArticles().map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const article = getGlobalArticleBySlug(slug)
  if (!article) return { title: 'Article not found - Dogtor' }

  const url = getGlobalArticleUrl(article.slug)
  return {
    title: `${article.title} - Dogtor`,
    description: article.description,
    keywords: article.tags,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.description,
      url,
      type: 'article',
      publishedTime: article.publishDate,
      modifiedTime: article.updateDate || article.publishDate,
      authors: ['Dogtor'],
      section: article.category,
      tags: article.tags,
      locale: 'en_US',
      siteName: 'Dogtor',
      images: ['/dogtor_cover.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
  }
}

export default async function GlobalGuideArticlePage({ params }) {
  const { slug } = await params
  const article = getGlobalArticleBySlug(slug)
  if (!article) notFound()

  const url = getGlobalArticleUrl(article.slug)
  const related = getRelatedGlobalArticles(article.slug, 3)
  const words = [article.content.intro, ...article.content.sections.map((s) => s.body)]
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length
  const readingMinutes = Math.max(3, Math.round(words / 220))

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.publishDate,
    dateModified: article.updateDate || article.publishDate,
    image: [`${BASE_URL}/dogtor_cover.png`],
    inLanguage: 'en',
    articleSection: article.category,
    keywords: (article.tags || []).join(', '),
    wordCount: words,
    author: { '@type': 'Organization', name: 'Dogtor', url: BASE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'Dogtor',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/dogtor_logo.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  }

  const faqJsonLd = article.faq?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: article.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      }
    : null

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: GLOBAL_GUIDE_URL },
      { '@type': 'ListItem', position: 3, name: article.title, item: url },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Header />
      <main className={styles.main}>
        <article className={styles.article}>
          <div className="container">
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span className={styles.breadcrumbSep}>/</span>
              <Link href="/guide">Guides</Link>
              <span className={styles.breadcrumbSep}>/</span>
              <span className={styles.breadcrumbCurrent}>{article.title}</span>
            </nav>

            <header className={styles.articleHeader}>
              <span className={styles.articleCategory}>{article.category}</span>
              <h1 className={styles.articleTitle}>{article.title}</h1>
              <div className={styles.articleMeta}>
                <time dateTime={article.updateDate || article.publishDate}>
                  {new Date(article.updateDate || article.publishDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <span>·</span>
                <span>{readingMinutes} min read</span>
              </div>
            </header>

            <div className={styles.articleBody}>
              <div className={styles.articleIntro}>
                <MarkdownContent>{article.content.intro}</MarkdownContent>
              </div>

              {article.content.sections.map((section, i) => (
                <section key={i} className={styles.articleSection}>
                  <h2>{section.h2}</h2>
                  <MarkdownContent>{section.body}</MarkdownContent>
                </section>
              ))}

              <div className={styles.ctaBlock}>
                <div className="article-cta">
                  <p>{article.cta}</p>
                  <StoreButtons location="guide_article" className="article-cta-buttons" />
                </div>
              </div>

              {article.faq?.length > 0 && (
                <section className={styles.faqSection}>
                  <h2>Frequently asked questions</h2>
                  <dl className={styles.faqList}>
                    {article.faq.map((item, i) => (
                      <div key={i} className={styles.faqItem}>
                        <dt>{item.question}</dt>
                        <dd>
                          <MarkdownContent>{item.answer}</MarkdownContent>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}

              {related.length > 0 && (
                <section className={styles.relatedSection}>
                  <RelatedArticles articles={related} heading="Keep reading" />
                </section>
              )}

              <p className={styles.disclaimer}>
                AP and SAT are registered trademarks of the College Board, which is not affiliated with and does
                not endorse Dogtor. Exam details can change; check the College Board&apos;s official exam pages
                for the current format before test day.
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
