import './globals.css'
import { LocaleProvider } from '@/components/LocaleProvider'
import { buildJsonLd } from '@/lib/i18n/buildJsonLd'
import { getLocale } from '@/lib/i18n/getLocale'
import { getSiteMessages } from '@/lib/i18n/getSiteMessages'

export async function generateMetadata() {
  const locale = await getLocale()
  const m = getSiteMessages(locale)
  const authorName = locale === 'en' ? 'Dogtor Team' : 'Dogtor 逗課 Team'
  const ogSiteName = locale === 'en' ? 'Dogtor' : 'Dogtor 逗課'

  return {
    metadataBase: new URL('https://dogtor.superb-tutor.com'),
    title: m.home.metaTitle,
    description: m.home.metaDescription,
    keywords: m.home.metaKeywords,
    authors: [{ name: authorName }],
    openGraph: {
      title: m.home.metaTitle,
      description: m.home.ogDescription,
      images: ['/dogtor_cover.png'],
      type: 'website',
      locale: m.openGraphLocale,
      siteName: ogSiteName,
    },
    twitter: {
      card: 'summary_large_image',
      title: m.home.twitterTitle,
      description: m.home.twitterDescription,
      images: ['/dogtor_cover.png'],
    },
    icons: {
      icon: '/app_icon.png',
    },
  }
}

export const viewport = {
  themeColor: '#1e374b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default async function RootLayout({ children }) {
  const locale = await getLocale()
  const messages = getSiteMessages(locale)
  const jsonLd = buildJsonLd(locale)

  return (
    <html lang={locale}>
      <head>
        <meta
          name="google-site-verification"
          content="I_Hcgwx2ddbvZetJlUgo0sOhZ86r3qc8J4scuXRY-tE"
        />
        <link rel="llms-txt" type="text/plain" href="/llms.txt" />
        {jsonLd.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body>
        <LocaleProvider locale={locale} messages={messages}>
          {children}
        </LocaleProvider>
      </body>
    </html>
  )
}
