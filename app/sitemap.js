import { getAllArticles, getArticleUrl } from '@/lib/articles'
import { MARKET_TW, siteUrl } from '@/lib/market'

export default function sitemap() {
  const baseUrl = siteUrl(MARKET_TW)

  const articles = getAllArticles()
  const guideUrls = articles.map((article) => ({
    url: getArticleUrl(article.slug),
    lastModified: article.updateDate || article.publishDate,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    {
      url: `${baseUrl}/`,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/guide`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/parent-pro`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/learning-support`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gift`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...guideUrls,
    {
      url: `${baseUrl}/faq`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/technology`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/reviews`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/news`,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/support`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
