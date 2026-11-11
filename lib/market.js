/**
 * The site serves two markets, one per host (see lib/appHosts.js): the Taiwan
 * app on dogtor.superb-tutor.com and the international app on
 * global.superb-tutor.com. The market decides content, not the language: the
 * Taiwan site also has an English translation, which still describes the
 * Taiwan app.
 */
import { GLOBAL_HOST } from './appHosts'

export const MARKET_TW = 'tw'
export const MARKET_GLOBAL = 'global'

export const SITE_URLS = {
  [MARKET_TW]: 'https://dogtor.superb-tutor.com',
  [MARKET_GLOBAL]: `https://${GLOBAL_HOST}`,
}

export const STORE_LINKS = {
  [MARKET_TW]: {
    appStore: 'https://apps.apple.com/tw/app/dogtor-%E9%80%97%E8%AA%B2/id6751773627',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.dogtor.superbFlutterApp',
  },
  [MARKET_GLOBAL]: {
    appStore: 'https://apps.apple.com/us/app/dogtor-daily-ap-sat-prep/id6805425251',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.dogtor.global',
  },
}

/**
 * Pages the international host serves. Everything else on the site (parent
 * plan, subscriptions, LINE reports, learning support, Taiwan news, reviews
 * and exam guides) only exists for the Taiwan app; the middleware sends those
 * paths to the international home page instead.
 */
export const GLOBAL_PATHS = [
  '/',
  '/about',
  '/faq',
  '/support',
  '/technology',
  '/privacy',
  '/terms',
  '/invite',
  '/guide',
]

/**
 * Path prefixes the international host serves in addition to GLOBAL_PATHS.
 * /guide/<slug> is the English guide library (app/en-guide, rewritten in
 * next.config.js), not the Taiwan one.
 */
export const GLOBAL_PATH_PREFIXES = ['/guide/']

export function isGlobalPath(pathname) {
  return GLOBAL_PATHS.includes(pathname) || GLOBAL_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export function normalizeMarket(raw) {
  return raw === MARKET_GLOBAL ? MARKET_GLOBAL : MARKET_TW
}

export function storeLinks(market) {
  return STORE_LINKS[normalizeMarket(market)]
}

export function siteUrl(market) {
  return SITE_URLS[normalizeMarket(market)]
}
