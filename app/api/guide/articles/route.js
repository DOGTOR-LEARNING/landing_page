import { getAllArticles, getArticleUrl } from '@/lib/articles'

/**
 * 機器可讀的文章索引，供 AI 爬蟲與搜尋引擎使用
 * GET /api/guide/articles
 */
export async function GET() {
  const articles = getAllArticles()
  const baseUrl = 'https://dogtor.superb-tutor.com'

  const index = articles.map((a) => ({
    title: a.title,
    description: a.description,
    url: getArticleUrl(a.slug),
    slug: a.slug,
    publishDate: a.publishDate,
    category: a.category,
    tags: a.tags,
    excerpt: a.excerpt,
  }))

  return Response.json(
    {
      source: 'Dogtor 逗課 學習指南',
      url: `${baseUrl}/guide`,
      total: index.length,
      articles: index,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
      },
    }
  )
}
