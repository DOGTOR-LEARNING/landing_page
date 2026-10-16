import Image from 'next/image'
import { headers } from 'next/headers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StoreButtons from '@/components/StoreButtons'
import LiteYouTube from '@/components/LiteYouTube'
import { getMessages } from '@/lib/i18n/messages'
import { NEWS_CATEGORIES, NEWS_ITEMS } from '@/data/news'
import styles from './page.module.css'

const TITLE = '逗課動態 - Dogtor 逗課 | 得獎紀錄、媒體採訪、Podcast、演講與街頭訪問'
const DESCRIPTION =
  'Dogtor 逗課的最新動態：得獎紀錄、媒體與 Podcast 採訪、團隊演講分享、街頭訪問、App 展示影片與活動花絮。'

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/news',
    images: ['/dogtor_cover.png'],
    type: 'website',
    locale: 'zh_TW',
    siteName: 'Dogtor 逗課',
  },
}

const ABOUT_DOGTOR = { '@type': 'MobileApplication', name: 'Dogtor 逗課', url: 'https://dogtor.superb-tutor.com' }

// 影片和 Podcast 輸出 VideoObject／PodcastEpisode，只收有填日期的（日期是必填欄位）。
function newsJsonLd() {
  const videos = NEWS_ITEMS.filter((v) => v.youtubeId && v.date).map((v) => ({
    '@type': 'VideoObject',
    name: v.title,
    description: v.description || v.title,
    uploadDate: v.date,
    thumbnailUrl: `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`,
    embedUrl: `https://www.youtube.com/embed/${v.youtubeId}`,
    contentUrl: `https://www.youtube.com/watch?v=${v.youtubeId}`,
    about: ABOUT_DOGTOR,
  }))
  const podcasts = NEWS_ITEMS.filter((v) => v.spotifyEpisodeId && v.date).map((v) => ({
    '@type': 'PodcastEpisode',
    name: v.title,
    description: v.description || v.title,
    datePublished: v.date,
    url: v.url || `https://open.spotify.com/episode/${v.spotifyEpisodeId}`,
    ...(v.image && { image: `https://dogtor.superb-tutor.com${v.image}` }),
    about: ABOUT_DOGTOR,
  }))
  const items = [...videos, ...podcasts]
  if (items.length === 0) return null
  return { '@context': 'https://schema.org', '@graph': items }
}

function byDateDesc(a, b) {
  if (!a.date) return 1
  if (!b.date) return -1
  return b.date.localeCompare(a.date)
}

function formatDate(date) {
  return date ? date.slice(0, 7).replace('-', '.') : null
}

function NewsMedia({ item, m }) {
  if (item.youtubeId) {
    return <LiteYouTube id={item.youtubeId} title={item.title} vertical={item.vertical} playLabel={m.news.play} />
  }
  if (item.spotifyEpisodeId) {
    // 有自己的照片就用照片當主視覺，配精簡版播放器；沒有的話用 Spotify 大尺寸播放器（內含封面）。
    return (
      <>
        {item.image && (
          <div className={`${styles.imageFrame} ${styles.imageSquare}`}>
            <Image src={item.image} alt={item.title} fill sizes="(max-width: 480px) 100vw, 360px" className={styles.image} />
          </div>
        )}
        <iframe
          src={`https://open.spotify.com/embed/episode/${item.spotifyEpisodeId}`}
          title={item.title}
          height={item.image ? 152 : 352}
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          className={styles.spotify}
        />
      </>
    )
  }
  if (item.image) {
    return (
      <a href={item.url || item.image} className={styles.imageFrame} target="_blank" rel="noreferrer">
        <Image src={item.image} alt={item.title} fill sizes="(max-width: 480px) 100vw, 360px" className={styles.image} />
      </a>
    )
  }
  return null
}

function NewsCard({ item, m }) {
  const hasMedia = item.youtubeId || item.spotifyEpisodeId || item.image
  return (
    <article className={`${styles.card} ${hasMedia ? '' : styles.textCard}`}>
      <NewsMedia item={item} m={m} />
      <div className={styles.cardBody}>
        {item.date && <time className={styles.cardDate} dateTime={item.date}>{formatDate(item.date)}</time>}
        <h3 className={styles.cardTitle}>{item.title}</h3>
        {item.description && <p className={styles.cardDesc}>{item.description}</p>}
        {item.url && (
          <a href={item.url} className={styles.cardLink} target="_blank" rel="noreferrer">
            {m.news.readMore} ↗
          </a>
        )}
      </div>
    </article>
  )
}

export default async function News() {
  const h = await headers()
  const locale = h.get('x-locale') || 'zh-TW'
  const m = getMessages(locale)
  const jsonLd = newsJsonLd()

  // 直式影片和其他內容分開排，免得一張 9:16 的卡片把整排撐得很高。
  const sections = NEWS_CATEGORIES.map((category) => {
    const items = NEWS_ITEMS.filter((v) => v.category === category).sort(byDateDesc)
    return {
      category,
      wide: items.filter((v) => !(v.youtubeId && v.vertical)),
      vertical: items.filter((v) => v.youtubeId && v.vertical),
    }
  }).filter((s) => s.wide.length + s.vertical.length > 0)

  return (
    <>
      <Header />
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <main className={styles.main}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{m.news.pageTitle}</h1>
            <p className={styles.pageSubtitle}>{m.news.pageSubtitle}</p>
          </div>

          {sections.length > 1 && (
            <nav className={styles.chips} aria-label={m.news.pageTitle}>
              {sections.map(({ category }) => (
                <a key={category} href={`#${category}`} className={styles.chip}>
                  {m.news.categories[category]}
                </a>
              ))}
            </nav>
          )}

          {sections.map(({ category, wide, vertical }) => (
            <section key={category} id={category} className={styles.section}>
              <h2 className={styles.sectionTitle}>{m.news.categories[category]}</h2>
              {wide.length > 0 && (
                <div className={styles.wideGrid}>
                  {wide.map((item) => <NewsCard key={item.title} item={item} m={m} />)}
                </div>
              )}
              {vertical.length > 0 && (
                <div className={styles.verticalGrid}>
                  {vertical.map((item) => <NewsCard key={item.youtubeId} item={item} m={m} />)}
                </div>
              )}
            </section>
          ))}

          <section className={styles.ctaSection}>
            <h2 className={styles.ctaTitle}>{m.news.ctaTitle}</h2>
            <p className={styles.ctaText}>{m.news.ctaText}</p>
            <StoreButtons location="news_cta" className={styles.ctaButtons} />
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
