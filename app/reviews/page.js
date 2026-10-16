import { headers } from 'next/headers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StoreButtons from '@/components/StoreButtons'
import FacebookPosts from '@/components/FacebookPosts'
import { getMessages } from '@/lib/i18n/messages'
import { STORE_REVIEWS, FACEBOOK_POSTS } from '@/data/reviews'
import { getStoreRatings, combineRatings } from '@/lib/storeRatings'
import styles from './page.module.css'

const TITLE = '網友評價 - Dogtor 逗課 | App Store、Google Play 評分與親子教育作家推薦'
const DESCRIPTION =
  '看看學生和家長怎麼評價 Dogtor 逗課：App Store 與 Google Play 的評分和評論，以及親子教育作家在臉書上的推薦。'

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/reviews',
    images: ['/dogtor_cover.png'],
    type: 'website',
    locale: 'zh_TW',
    siteName: 'Dogtor 逗課',
  },
}

function ratingJsonLd(ratings) {
  const combined = combineRatings(ratings)
  if (!combined) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: 'Dogtor 逗課',
    alternateName: ['逗課', 'Dogtor'],
    operatingSystem: 'iOS, Android',
    applicationCategory: 'EducationApplication',
    url: 'https://dogtor.superb-tutor.com',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'TWD' },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: combined.rating,
      ratingCount: combined.count,
      bestRating: 5,
      worstRating: 1,
    },
  }
}

const STORES = [
  { key: 'appStore', name: 'App Store' },
  { key: 'googlePlay', name: 'Google Play' },
]

function Stars({ rating }) {
  const full = Math.round(rating)
  return (
    <span className={styles.stars} aria-label={`${rating} / 5`}>
      {'★'.repeat(full)}
      <span className={styles.starsEmpty}>{'★'.repeat(5 - full)}</span>
    </span>
  )
}

export default async function Reviews() {
  const h = await headers()
  const locale = h.get('x-locale') || 'zh-TW'
  const m = getMessages(locale)

  const ratings = await getStoreRatings()
  const ratedStores = STORES.filter((s) => ratings[s.key].rating != null)
  const jsonLd = ratingJsonLd(ratings)

  return (
    <>
      <Header />
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <main className={styles.main}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{m.reviews.pageTitle}</h1>
            <p className={styles.pageSubtitle}>{m.reviews.pageSubtitle}</p>
          </div>

          {ratedStores.length > 0 && (
            <section className={styles.section} aria-label={m.reviews.storeTitle}>
              <div className={styles.ratingGrid}>
                {ratedStores.map(({ key, name }) => {
                  const store = ratings[key]
                  return (
                    <a key={key} href={store.url} className={styles.ratingCard} target="_blank" rel="noreferrer">
                      <span className={styles.ratingStore}>{name}</span>
                      <span className={styles.ratingValue}>{store.rating.toFixed(1)}</span>
                      <Stars rating={store.rating} />
                      {store.count != null && (
                        <span className={styles.ratingCount}>{m.reviews.ratingsCount(store.count)}</span>
                      )}
                      <span className={styles.ratingLink}>{m.reviews.viewInStore} →</span>
                    </a>
                  )
                })}
              </div>
            </section>
          )}

          {STORE_REVIEWS.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{m.reviews.storeReviewsTitle}</h2>
              <div className={styles.masonry}>
                {STORE_REVIEWS.map((review, i) => (
                  <figure key={i} className={styles.reviewCard}>
                    <div className={styles.reviewMeta}>
                      <Stars rating={review.rating} />
                      <span className={styles.reviewStore}>
                        {STORES.find((s) => s.key === review.store)?.name}
                      </span>
                    </div>
                    <blockquote className={styles.reviewText}>{review.text}</blockquote>
                    <figcaption className={styles.reviewAuthor}>
                      {review.author}
                      {review.date && <span className={styles.reviewDate}> · {review.date}</span>}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}

          {FACEBOOK_POSTS.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{m.reviews.fbTitle}</h2>
              <FacebookPosts
                posts={FACEBOOK_POSTS}
                locale={locale}
                viewOriginalLabel={m.reviews.fbViewOriginal}
                sponsoredLabel={m.reviews.sponsoredLabel}
                className={styles.fbGrid}
                itemClassName={styles.fbItem}
                captionClassName={styles.fbCaption}
                badgeClassName={styles.sponsoredBadge}
              />
            </section>
          )}

          <section className={styles.ctaSection}>
            <h2 className={styles.ctaTitle}>{m.reviews.ctaTitle}</h2>
            <p className={styles.ctaText}>{m.reviews.ctaText}</p>
            <StoreButtons location="reviews_cta" className={styles.ctaButtons} />
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
