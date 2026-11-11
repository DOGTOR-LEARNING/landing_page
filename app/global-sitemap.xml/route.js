import { GLOBAL_PATHS, MARKET_GLOBAL, siteUrl } from '@/lib/market'
import { getAllGlobalArticles } from '@/lib/globalArticles'

/**
 * Sitemap of the international host. next.config.js rewrites
 * global.superb-tutor.com/sitemap.xml here; app/sitemap.js stays the Taiwan
 * site's, whose pages this host does not serve.
 */
const PRIORITY = { '/': 1, '/guide': 0.8, '/faq': 0.8, '/about': 0.7, '/technology': 0.7, '/support': 0.6 }

export function GET() {
  const base = siteUrl(MARKET_GLOBAL)
  const lastmod = new Date().toISOString()
  const pageUrls = GLOBAL_PATHS.filter((path) => path !== '/invite')
    .map((path) => {
      const priority = PRIORITY[path] ?? 0.3
      return `  <url><loc>${base}${path === '/' ? '/' : path}</loc><lastmod>${lastmod}</lastmod><priority>${priority}</priority></url>`
    })
  const articleUrls = getAllGlobalArticles().map(
    (a) => `  <url><loc>${base}/guide/${a.slug}</loc><lastmod>${a.updateDate || a.publishDate}</lastmod><priority>${a.priority ?? 0.6}</priority></url>`
  )
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...pageUrls, ...articleUrls].join('\n')}\n</urlset>\n`
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
