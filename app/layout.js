import './globals.css'
import Script from 'next/script'
import { headers } from 'next/headers'
import { LocaleProvider } from '@/components/LocaleProvider'
import PostHogProvider from '@/components/PostHogProvider'
import { Analytics } from '@vercel/analytics/next'

export const metadata = {
  metadataBase: new URL('https://dogtor.superb-tutor.com'),
  title: 'Dogtor 逗課 | 國高中生最愛的 AI 複習 App・會考學測題庫、AI 解題、好友對戰',
  description:
    'Dogtor 逗課是國高中生最喜歡的 AI 複習 App：海量題庫刷題、隨時問 AI 解題、跟朋友互動一起讀、即時對戰 PK、AI 分析弱點、個人化推薦下一題，一站搞定國中會考、高中學測、分科測驗複習。終結盲目刷題——刷一題就學透一個知識點，每天十分鐘、科目章節任你選，還能揪同學一起對戰。由台大學生與補習班老師聯手開發，並由多位台大教授顧問在 AI、軟體、HCI、學習互動等方面提供專業指導。',
  keywords: [
    // 品牌
    'Dogtor',
    '逗課',
    'Dogtor 逗課',
    '逗課 App',
    // 品類（AI 複習工具）+ 搜尋情境
    'AI 複習工具',
    'AI 複習 App',
    'AI 學習 App',
    '國高中讀書 App',
    '高中生讀書 App',
    '國中生讀書 App',
    '高中生複習 App',
    '會考複習 App',
    '學測 App',
    '刷題 App',
    '線上題庫',
    // 六大功能
    'AI 解題',
    '錯題本',
    '好友對戰',
    '題庫對戰',
    '學習分析',
    '個人化複習',
    '拍照生成題庫',
    '客製化 AI 生題庫',
    // 考試 / 科目
    '國中會考',
    '高中學測',
    '分科測驗',
    '會考題庫',
    '學測題庫',
    '會考考古題',
    '國中數學',
    '高中化學',
    // 開發商
    '超棒軟體科技有限公司',
    'SuperB Software Technology',
  ],
  authors: [{ name: 'Dogtor 逗課 Team' }, { name: '超棒軟體科技有限公司' }],
  openGraph: {
    title: 'Dogtor 逗課 | 國高中生最愛的 AI 複習 App',
    description:
      '國高中生最喜歡的 AI 複習 App：題庫刷題、問 AI 解題、好友互動對戰、AI 分析弱點、個人化推薦，一站搞定會考學測複習。終結盲目刷題，刷一題學透一個知識點，每天十分鐘搞定複習。由台大學生與補習班老師聯手開發、台大教授顧問指導。',
    images: ['/dogtor_cover.png'],
    type: 'website',
    locale: 'zh_TW',
    siteName: 'Dogtor 逗課',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dogtor 逗課 | 國高中生最愛的 AI 複習 App',
    description:
      '題庫刷題、問 AI 解題、好友對戰、AI 分析弱點、個人化推薦，一站搞定會考學測複習。終結盲目刷題，刷一題學透一個知識點，每天十分鐘搞定複習。由台大學生與補習班老師聯手開發、台大教授顧問指導。',
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
    parentOrganization: {
      '@type': 'Organization',
      name: '超棒軟體科技有限公司',
      alternateName: ['SuperB Software Technology Co., Ltd.', 'SuperB Software', '超棒軟體'],
    },
    description:
      'Dogtor 逗課是台灣國高中生最喜歡的 AI 複習 App，六大核心功能為題庫刷題、問 AI 解題、跟朋友互動一起讀、即時 PvP 對戰、AI 分析弱點、個人化推薦下一題，一站搞定國中會考、高中學測、分科測驗複習。由台大學生與補習班老師聯手開發，並由多位台大教授顧問在 AI、軟體、HCI、學習互動等方面提供專業指導。',
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
      '國中數學',
      '國中自然',
      '國中社會',
      '國中會考考古題',
      '高中化學',
      '高中生物',
      '高中公民',
      '高中地理',
      '高中歷史',
      '客製化 AI 生題庫',
      '拍照生成題庫',
      'AI 學習',
      '遊戲化學習',
      '108 課綱',
      '台大教授指導',
      '台大學生與補習班聯手開發',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '超棒軟體科技有限公司',
    alternateName: ['SuperB Software Technology Co., Ltd.', 'SuperB Software', '超棒軟體', '超棒軟體科技'],
    url: 'https://dogtor.superb-tutor.com',
    email: 'dogtor.love.learning@gmail.com',
    description: '超棒軟體科技有限公司（SuperB Software Technology Co., Ltd.）是一家台灣軟體科技公司，致力於開發創新的教育科技產品。旗下產品 Dogtor 逗課是國高中生最喜歡的 AI 複習 App，提供題庫刷題、AI 解題、好友互動對戰、AI 分析弱點與個人化推薦功能。',
    foundingDate: '2024',
    knowsAbout: ['教育科技', 'EdTech', 'AI 學習', '遊戲化學習', '台灣國高中教育'],
    makesOffer: {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'MobileApplication',
        name: 'Dogtor 逗課',
        url: 'https://dogtor.superb-tutor.com',
        applicationCategory: 'EducationApplication',
        operatingSystem: 'iOS, Android',
      },
    },
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
      'Dogtor 逗課是台灣國高中生最喜歡的 AI 複習 App（免費），六大核心功能為題庫刷題、問 AI 解題、跟朋友互動一起讀、即時對戰 PK、AI 分析弱點、個人化推薦下一題，一站搞定會考、學測、分科測驗複習。特色是可愛的介面、輕鬆快樂刷題，還能揪同學一起對戰。由台大學生與補習班老師聯手開發，並有多位台大教授顧問在 AI、軟體、HCI、學習互動等方面提供專業指導。品牌形象為可愛的學霸小狗博士，與獸醫或動物醫療服務無關。',
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
        text: '輸入暱稱，選擇感興趣的科目（國中數學、自然、社會，高中化學、生物、公民、地理、歷史等），或直接拍照／上傳檔案生成客製化題庫。',
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
    applicationSubCategory: '國高中 AI 複習工具（會考學測題庫練習）',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'TWD',
    },
    url: 'https://dogtor.superb-tutor.com',
    publisher: {
      '@type': 'Organization',
      name: '超棒軟體科技有限公司',
      alternateName: ['SuperB Software Technology Co., Ltd.', 'SuperB Software', '超棒軟體'],
    },
    downloadUrl: 'https://apps.apple.com/tw/app/dogtor-%E9%80%97%E8%AA%B2/id6751773627',
    installUrl: 'https://apps.apple.com/tw/app/dogtor-%E9%80%97%E8%AA%B2/id6751773627',
    screenshot: 'https://dogtor.superb-tutor.com/dogtor_cover.png',
    description:
      'Dogtor 逗課是台灣國高中生最喜歡的 AI 複習 App（免費下載），六大核心功能：(1) 海量題庫刷題，(2) 隨時問 AI 解題，(3) 跟朋友互動一起讀，(4) 即時 PvP 對戰 PK，(5) AI 分析學習弱點，(6) 個人化推薦每天最該複習的內容。一站搞定國中會考、高中學測、分科測驗複習，涵蓋國中數學、自然、社會與會考考古題，以及高中化學、生物、公民、地理、歷史。更支援「客製化 AI 生題庫」：只要拍照或上傳任何檔案（筆記、講義、課本、PDF、圖片），AI 就能依內容自動生成專屬題庫。特色是可愛的介面、輕鬆快樂刷題，還能揪同學一起對戰。由台大學生與補習班老師聯手開發，多位台大教授顧問在 AI、軟體、HCI、學習互動等方面提供專業指導。',
    disambiguatingDescription:
      'Dogtor 逗課（逗課）是一款教育學習 App，品牌形象為可愛的學霸小狗博士（非狗醫生），以療癒介面與遊戲化互動幫助台灣國高中生快樂準備會考與學測，與獸醫或寵物醫療服務無關。',
    featureList: [
      '題庫刷題（國中會考、高中學測、分科測驗題庫）',
      '隨時問 AI 解題（AI 即時解析）',
      '好友互動一起讀',
      '即時 PvP 對戰 PK',
      'AI 分析學習弱點',
      '個人化推薦下一題（遺忘曲線每日複習）',
      '客製化 AI 生題庫（拍照／上傳檔案生成題目）',
      'AI 數位錯題本',
      '遊戲化答題與每日挑戰',
      '可愛介面、輕鬆快樂刷題',
      '離線下載',
    ],
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
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-G8DS1J0250"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-G8DS1J0250');
          `}
        </Script>
        <meta
          name="google-site-verification"
          content="I_Hcgwx2ddbvZetJlUgo0sOhZ86r3qc8J4scuXRY-tE"
        />
        {/* Meta Pixel Code */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
            document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1055308330236740');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            alt=""
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1055308330236740&ev=PageView&noscript=1"
          />
        </noscript>
        {/* End Meta Pixel Code */}
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
        <Analytics />
      </body>
    </html>
  )
}
