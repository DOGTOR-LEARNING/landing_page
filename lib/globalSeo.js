/**
 * Site-wide metadata and structured data for the international site. The
 * Taiwan site's equivalents live in app/layout.js; they describe a different
 * app (Taiwanese exams, LINE, Parent Pro), so nothing is shared beyond the
 * company record.
 */
import { COMPANY } from './company'
import { MARKET_GLOBAL, MARKET_TW, siteUrl, storeLinks } from './market'

const SITE = siteUrl(MARKET_GLOBAL)
const STORES = storeLinks(MARKET_GLOBAL)
const TW_STORES = storeLinks(MARKET_TW)

// Lead with the fun/social angle: "AP prep app" alone is a head term owned by
// Khan Academy, College Board and Quizlet; "fun", "game" and "with friends" are
// what people search when they're tired of boring prep, and what sets Dogtor apart.
const TITLE = 'Dogtor: Fun AP & SAT Prep App with Quiz Battles and an AI Tutor'
const DESCRIPTION =
  'Make AP, SAT and GRE prep actually fun. Dogtor turns practice into a daily game: a cute corgi study buddy, bite-sized levels, real-time quiz battles with friends and an AI tutor that explains every miss and finds your weak spots. Free on iOS and Android.'

export const GLOBAL_METADATA = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'Dogtor',
    'AP prep app',
    'SAT prep app',
    'GRE vocabulary app',
    'AP Biology practice questions',
    'AP Psychology practice questions',
    'AP Environmental Science practice',
    'AP U.S. Government practice questions',
    'SAT Reading and Writing practice',
    'AI tutor',
    'AI study app',
    'study app for high school students',
    'quiz battle app',
    'turn notes into quizzes',
    'fun way to study for AP exams',
    'fun SAT prep',
    'AP study games',
    'SAT practice game',
    'study with friends app',
    'gamified study app',
  ],
  authors: [{ name: 'Dogtor Team' }, { name: COMPANY.nameEn, url: COMPANY.website }],
  alternates: { canonical: '/' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: ['/DOGTOR_banner.png'],
    type: 'website',
    locale: 'en_US',
    siteName: 'Dogtor',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/DOGTOR_banner.png'],
  },
  icons: {
    icon: '/app_icon.png',
  },
}

export const GLOBAL_JSON_LD = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Dogtor',
    // Same brand as the Taiwan app (Dogtor 逗課); linking the two lets search
    // engines and AI assistants treat them as one entity with two editions.
    alternateName: ['Dogtor 逗課', 'Dogtor Global', 'Dogtor: Daily AP & SAT Prep'],
    url: SITE,
    logo: `${SITE}/dogtor_eng_logo.svg`,
    email: COMPANY.email,
    parentOrganization: {
      '@type': 'Organization',
      name: COMPANY.nameEn,
      url: COMPANY.website,
    },
    description: DESCRIPTION,
    disambiguatingDescription:
      'Dogtor is an education app whose mascot is a study-whiz corgi. It is not related to veterinarians or pet care.',
    sameAs: [
      STORES.appStore,
      STORES.googlePlay,
      siteUrl(MARKET_TW),
      TW_STORES.appStore,
      TW_STORES.googlePlay,
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Dogtor',
    url: SITE,
    inLanguage: 'en',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: 'Dogtor: Daily AP & SAT Prep',
    alternateName: 'Dogtor',
    operatingSystem: 'iOS, Android',
    applicationCategory: 'EducationApplication',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    url: SITE,
    downloadUrl: STORES.appStore,
    installUrl: STORES.appStore,
    publisher: {
      '@type': 'Organization',
      name: COMPANY.nameEn,
      url: COMPANY.website,
    },
    description: DESCRIPTION,
    featureList: [
      'AP and SAT practice levels mapped to individual concepts',
      'GRE vocabulary practice',
      'AI tutor that explains any question, typed or photographed',
      'Custom quizzes generated from your own notes, handouts or PDFs',
      'Mistake book',
      'Real-time quiz battles and ranked matchmaking',
      'Daily streaks and achievements',
    ],
    inLanguage: 'en',
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
      audienceType: 'High school students preparing for AP exams and the SAT; students preparing for the GRE',
    },
  },
]
