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

function AppStoreIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

// Google Play 四色三角形
function GooglePlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#00D7FE" d="M3.6 1.8 13.4 12l-9.8 10.2c-.4-.2-.6-.7-.6-1.2V3c0-.5.2-1 .6-1.2z" />
      <path fill="#00F076" d="M16.8 8.6 13.4 12 3.6 1.8c.2-.1.4-.1.6-.1.3 0 .5.1.8.2l11.8 6.7z" />
      <path fill="#FF3A44" d="M16.8 15.4 5 22.1c-.3.2-.5.2-.8.2-.2 0-.4 0-.6-.1l9.8-10.2 3.4 3.4z" />
      <path fill="#FFD400" d="m20.4 13.4-3.6 2-3.4-3.4 3.4-3.4 3.6 2c.8.5.8 2.3 0 2.8z" />
    </svg>
  )
}

const STORES = [
  { key: 'appStore', name: 'App Store', Icon: AppStoreIcon },
  { key: 'googlePlay', name: 'Google Play', Icon: GooglePlayIcon },
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
          <h1 className="visually-hidden">{m.reviews.pageTitle}</h1>

          {ratedStores.length > 0 && (
            <section className={`${styles.section} ${styles.ratingSection}`} aria-label={m.reviews.storeTitle}>
              <div className={styles.ratingGrid}>
                {ratedStores.map(({ key, name, Icon }) => {
                  const store = ratings[key]
                  return (
                    <a key={key} href={store.url} className={styles.ratingCard} target="_blank" rel="noreferrer">
                      <span className={styles.ratingIcon}>
                        <Icon />
                      </span>
                      <span className={styles.ratingStore}>{name}</span>
                      <span className={styles.ratingValue}>{store.rating.toFixed(1)}</span>
                      <span className={styles.ratingStars}>
                        <Stars rating={store.rating} />
                      </span>
                      {store.count != null && (
                        <span className={styles.ratingCount}>{m.reviews.ratingsCount(store.count)}</span>
                      )}
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
