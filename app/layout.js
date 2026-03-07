import './globals.css'

export const metadata = {
  metadataBase: new URL('https://dogtor.superb-tutor.com'),
  title: 'Dogtor 逗課 | 國高中題庫練習・會考學測複習・AI 學習小狗',
  description:
    'Dogtor 逗課是專為國中生、高中生打造的 AI 學習 App。提供國中會考、高中學測題庫與練習題，涵蓋數學、理化、化學等科目。支援好友對戰、AI 解題、錯題本複習，遊戲化學習讓備考更有趣！',
  keywords: [
    '國中會考',
    '高中學測',
    '題庫',
    '練習題',
    '複習',
    '國高中',
    '數學',
    '理化',
    '化學',
    'AI學習',
    '遊戲化學習',
    'Dogtor',
    '逗課',
    '學習App',
    '會考複習',
    '學測備戰',
    '線上題庫',
    '國中數學',
    '高中化學',
  ],
  authors: [{ name: 'Dogtor 逗課 Team' }],
  openGraph: {
    title: 'Dogtor 逗課 | 國高中題庫練習・會考學測複習・AI 學習小狗',
    description:
      '專為國高中生打造的遊戲化學習 App。題庫練習、好友對戰、AI 解題，讓會考學測複習變有趣！',
    images: ['/dogtor_cover.png'],
    type: 'website',
    locale: 'zh_TW',
    siteName: 'Dogtor 逗課',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dogtor 逗課 | 國高中題庫練習・會考學測複習',
    description:
      '專為國高中生打造的遊戲化學習 App。題庫練習、好友對戰、AI 解題，讓備考更有趣！',
    images: ['/dogtor_cover.png'],
  },
  icons: {
    icon: '/app_icon.png',
  },
}

export const viewport = {
  themeColor: '#1e374b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Dogtor 逗課',
    url: 'https://dogtor.superb-tutor.com',
    logo: 'https://dogtor.superb-tutor.com/dogtor_logo.svg',
    email: 'dogtor.love.learning@gmail.com',
    description:
      'Dogtor 逗課是專為國高中生打造的 AI 遊戲化學習平台，提供題庫練習、好友對戰與 AI 解題功能。',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Dogtor 逗課',
    url: 'https://dogtor.superb-tutor.com',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Dogtor 逗課',
    operatingSystem: 'iOS',
    applicationCategory: 'EducationApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'TWD',
    },
    installUrl:
      'https://apps.apple.com/tw/app/dogtor-%E9%80%97%E8%AA%B2/id6751773627',
    description:
      '國高中題庫練習 App，涵蓋數學、理化、化學，支援會考學測複習、好友對戰與 AI 解題。',
  },
]

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <head>
        <meta
          name="google-site-verification"
          content="I_Hcgwx2ddbvZetJlUgo0sOhZ86r3qc8J4scuXRY-tE"
        />
        {jsonLd.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body>{children}</body>
    </html>
  )
}
