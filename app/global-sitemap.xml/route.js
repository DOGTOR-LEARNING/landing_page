import { GLOBAL_PATHS, MARKET_GLOBAL, siteUrl } from '@/lib/market'
import { getAllGlobalArticles } from '@/lib/globalArticles'
import { AP_CALCULATORS, CALCULATOR_BASE_PATH } from '@/lib/apScoreCalculators'

/**
 * Sitemap of the international host. next.config.js rewrites
 * global.superb-tutor.com/sitemap.xml here; app/sitemap.js stays the Taiwan
 * site's, whose pages this host does not serve.
 */
// /download is noindex (it just bounces to the right store) and /invite is a
// personal link; listing noindex pages here sends Search Console conflicting signals.
const NOT_INDEXED = new Set(['/invite', '/download'])
const PRIORITY = { '/': 1, '/guide': 0.8, '/faq': 0.8, '/about': 0.7, '/technology': 0.7, '/support': 0.6, '/ap-score-calculator': 0.9 }

export function GET() {
  const base = siteUrl(MARKET_GLOBAL)
  const pageUrls = GLOBAL_PATHS.filter((path) => !NOT_INDEXED.has(path))
    .map((path) => {
      const priority = PRIORITY[path] ?? 0.3
      return `  <url><loc>${base}${path}</loc><priority>${priority}</priority></url>`
    })
  const articleUrls = getAllGlobalArticles().map(
    (a) => `  <url><loc>${base}/guide/${a.slug}</loc><lastmod>${a.updateDate || a.publishDate}</lastmod><priority>${a.priority ?? 0.6}</priority></url>`
  )
  const calculatorUrls = AP_CALCULATORS.map(
    (c) => `  <url><loc>${base}${CALCULATOR_BASE_PATH}/${c.slug}</loc><priority>0.9</priority></url>`
  )
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...pageUrls, ...calculatorUrls, ...articleUrls].join('\n')}\n</urlset>\n`
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
