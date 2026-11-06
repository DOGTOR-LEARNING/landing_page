/**
 * Site-wide metadata and structured data for the international site. The
 * Taiwan site's equivalents live in app/layout.js; they describe a different
 * app (Taiwanese exams, LINE, Parent Pro), so nothing is shared beyond the
 * company record.
 */
import { COMPANY } from './company'
import { MARKET_GLOBAL, siteUrl, storeLinks } from './market'

const SITE = siteUrl(MARKET_GLOBAL)
const STORES = storeLinks(MARKET_GLOBAL)

const TITLE = 'Dogtor | AI study app for AP, SAT & GRE prep'
const DESCRIPTION =
  'Dogtor is a free AI study app for AP, SAT and GRE prep. Clear bite-sized practice levels, get every miss explained by an AI tutor, turn your own notes into quizzes and battle your friends — ten minutes a day.'

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
    sameAs: [STORES.appStore, STORES.googlePlay],
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
