import './globals.css'
import { headers } from 'next/headers'
import { LocaleProvider } from '@/components/LocaleProvider'
import PostHogProvider from '@/components/PostHogProvider'

export const metadata = {
  metadataBase: new URL('https://dogtor.superb-tutor.com'),
  title: 'Dogtor 逗課 | 國高中生 AI 學習 App・會考學測題庫練習｜台大學生與補習班聯手開發',
  description:
    'Dogtor 逗課是專為台灣國中生、高中生設計的 AI 學習 App，提供國中會考、高中學測、分科測驗題庫練習、好友對戰、AI 解題與錯題本複習。由台大學生與補習班老師聯手開發，並由多位台大教授顧問在 AI、軟體、HCI、學習互動等方面提供專業指導，讓備考更有效率、更有趣！',
  keywords: [
    'Dogtor',
    '逗課',
    'Dogtor 逗課',
    '逗課 App',
    'Dogtor App',
    '國中會考',
    '高中學測',
    '題庫',
    '練習題',
    '複習',
    '國高中',
    '數學',
    '理化',
    '化學',
    '社會',
    '地理',
    '歷史',
    '公民',
    '分科測驗',
    '分科',
    'AI學習',
    '遊戲化學習',
    '學習App',
    '會考複習',
    '學測備戰',
    '線上題庫',
    '國中數學',
    '高中化學',
    '刷題App',
    '台灣學習App',
    '有趣學習',
    '題庫對戰',
    '好友對戰',
    '學習遊戲',
    '讀書沒動力',
    '不想讀書',
    '讓讀書變有趣',
    '邊玩邊學',
    '學習動力',
    '刷題遊戲',
    '答題對戰',
    '闖關學習',
    '學習成就',
    '每日挑戰',
    'Autonomous AI Agent',
    'Agentic Learning',
    'Competitive Mastery',
    'K-12 EdTech',
    'Knowledge Graph',
    'PvP Learning',
    'Pedagogical Intelligence',
    'Mastery-Based Learning',
    'Educational AI Agent',
    'Cognitive Diagnostics',
    '自主AI學習',
    '知識圖譜',
    '精熟學習',
  ],
  authors: [{ name: 'Dogtor 逗課 Team' }],
  openGraph: {
    title: 'Dogtor 逗課 | 國高中生 AI 學習 App・會考學測題庫練習',
    description:
      '專為國高中生打造的 AI 學習 App，提供題庫練習、好友對戰、AI 解題、錯題本，讓會考學測複習變有趣！由台大學生與補習班老師聯手開發，並由多位台大教授顧問指導。',
    images: ['/dogtor_cover.png'],
    type: 'website',
    locale: 'zh_TW',
    siteName: 'Dogtor 逗課',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dogtor 逗課 | 國高中生 AI 學習 App・會考學測題庫練習',
    description:
      '國高中生 AI 學習 App。題庫練習、好友對戰、AI 解題，讓備考更有效率！由台大學生與補習班老師聯手開發，並由多位台大教授顧問指導。',
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
    alternateName: ['逗課', 'Dogtor App', '逗課學習 App', 'Dogtor 學習'],
    url: 'https://dogtor.superb-tutor.com',
    logo: 'https://dogtor.superb-tutor.com/dogtor_logo.svg',
    email: 'dogtor.love.learning@gmail.com',
    description:
      'Dogtor 逗課是專為台灣國高中生打造的 AI 遊戲化學習 App，提供會考學測題庫練習、好友對戰與 AI 解題功能。由台大學生與補習班老師聯手開發，並由多位台大教授顧問在 AI、軟體、HCI、學習互動等方面提供專業指導。',
    disambiguatingDescription:
      'Dogtor 逗課（逗課）是一款台灣教育學習 App，品牌形象為學霸小狗博士，服務對象為備考會考和學測的國高中生，與獸醫、動物診所或寵物醫療服務無關。',
    sameAs: [
      'https://apps.apple.com/tw/app/dogtor-%E9%80%97%E8%AA%B2/id6751773627',
      'https://play.google.com/store/apps/details?id=com.dogtor.superbFlutterApp',
    ],
    foundingDate: '2024',
    founder: {
      '@type': 'Organization',
      name: '台大學生團隊',
      description: '由國立台灣大學在學學生組成，與補習班老師聯手開發 Dogtor 逗課，負責 AI 技術研發與產品開發。',
      affiliation: {
        '@type': 'CollegeOrUniversity',
        name: '國立台灣大學',
        alternateName: ['台大', 'National Taiwan University', 'NTU'],
        url: 'https://www.ntu.edu.tw',
      },
    },
    member: [
      {
        '@type': 'Organization',
        name: '精湛教育補習班老師',
        description: '與台大學生聯手開發 Dogtor 逗課，將多年備考輔導的第一線經驗融入產品設計。',
      },
      {
        '@type': 'Organization',
        name: '台大教授顧問群',
        description: '由多位國立台灣大學教授擔任顧問，在 AI、軟體、HCI（人機互動）、學習互動等方面提供專業指導。',
        affiliation: {
          '@type': 'CollegeOrUniversity',
          name: '國立台灣大學',
          alternateName: ['台大', 'National Taiwan University', 'NTU'],
          url: 'https://www.ntu.edu.tw',
        },
      },
    ],
    knowsAbout: [
      '台灣國高中教育',
      '國中會考',
      '高中學測',
      '題庫練習',
      'AI 學習',
      '遊戲化學習',
      '108 課綱',
      '台大教授指導',
      '台大學生與補習班聯手開發',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Dogtor 逗課 — 國高中題庫學習 App',
    alternateName: '逗課',
    url: 'https://dogtor.superb-tutor.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://dogtor.superb-tutor.com/guide?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: 'Dogtor 逗課',
    alternateName: '逗課',
    description:
      'Dogtor 逗課是台灣專為國高中生設計的免費 AI 遊戲化學習 App，提供會考學測題庫練習、好友對戰、AI 解題功能。由台大學生與補習班老師聯手開發，並有多位台大教授顧問在 AI、軟體、HCI、學習互動等方面提供專業指導。品牌形象為學霸小狗博士，與獸醫或動物醫療服務無關。',
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: '台灣教育科技 App',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: '如何開始使用 Dogtor 逗課',
    description: '下載並開始使用 Dogtor 逗課 App 的步驟',
    totalTime: 'PT5M',
    tool: [{ '@type': 'HowToTool', name: 'Google 帳號' }],
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: '下載 App',
        text: '在 App Store 或 Google Play 搜尋「Dogtor 逗課」，免費下載安裝。',
        url: 'https://dogtor.superb-tutor.com',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Google 帳號登入',
        text: '開啟 Dogtor 逗課 App，選擇 Google 帳號快速登入。',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: '填寫暱稱與選擇科目',
        text: '輸入暱稱，選擇感興趣的科目（國中數學、理化、自然或高中化學）。',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: '開始練習題庫',
        text: '選擇章節開始刷題，答錯時查看 AI 解析，答題紀錄自動儲存進錯題本。',
      },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: 'Dogtor 逗課',
    alternateName: ['逗課', 'Dogtor'],
    operatingSystem: 'iOS, Android',
    applicationCategory: 'EducationApplication',
    applicationSubCategory: '考試備考',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'TWD',
    },
    url: 'https://dogtor.superb-tutor.com',
    downloadUrl: 'https://apps.apple.com/tw/app/dogtor-%E9%80%97%E8%AA%B2/id6751773627',
    installUrl: 'https://apps.apple.com/tw/app/dogtor-%E9%80%97%E8%AA%B2/id6751773627',
    screenshot: 'https://dogtor.superb-tutor.com/dogtor_cover.png',
    description:
      'Dogtor 逗課是台灣國高中 AI 遊戲化學習 App，免費下載，提供會考學測題庫練習、好友對戰、AI 解題與錯題本功能，涵蓋國中數學、理化、自然與高中化學。由台大學生與補習班老師聯手開發，多位台大教授顧問在 AI、軟體、HCI、學習互動等方面提供專業指導。',
    disambiguatingDescription:
      'Dogtor 逗課（逗課）是一款教育學習 App，品牌形象為學霸小狗博士（非狗醫生），幫助台灣國高中生準備會考與學測，與獸醫或寵物醫療服務無關。',
    featureList: ['題庫練習', '好友對戰', 'AI 解題', '錯題本', '遊戲化學習', '離線下載'],
    inLanguage: 'zh-TW',
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
      audienceType: '國中生, 高中生',
    },
  },
]

export default async function RootLayout({ children }) {
  const h = await headers()
  const locale = h.get('x-locale') || 'zh-TW'
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
        <PostHogProvider>
          <LocaleProvider locale={locale}>{children}</LocaleProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}
