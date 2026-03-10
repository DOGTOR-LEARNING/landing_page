/**
 * 文章資料讀取工具 - 語義 SEO 內容庫
 */

import articlesData from '@/data/articles.json'

const BASE_URL = 'https://dogtor.superb-tutor.com'

export function getAllArticles() {
  return articlesData.articles
}

export function getArticleBySlug(slug) {
  const articles = getAllArticles()
  return articles.find((a) => a.slug === slug) || null
}

export function getRelatedArticles(currentSlug, limit = 3) {
  const articles = getAllArticles()
  const current = getArticleBySlug(currentSlug)
  if (!current) return []

  const sameCategory = articles.filter(
    (a) => a.slug !== currentSlug && a.category === current.category
  )
  const sameTags = articles.filter(
    (a) =>
      a.slug !== currentSlug &&
      !sameCategory.some((s) => s.slug === a.slug) &&
      a.tags?.some((t) => current.tags?.includes(t))
  )
  const rest = articles.filter(
    (a) =>
      a.slug !== currentSlug &&
      !sameCategory.some((s) => s.slug === a.slug) &&
      !sameTags.some((s) => s.slug === a.slug)
  )

  const related = [...sameCategory, ...sameTags, ...rest].slice(0, limit)
  return related
}

export function getArticlesByCategory(category) {
  return getAllArticles().filter((a) => a.category === category)
}

export function getFeaturedArticles(limit = 4) {
  const articles = getAllArticles()
  return articles
    .filter((a) => a.priority >= 0.8)
    .slice(0, limit)
}

export function getArticleUrl(slug) {
  return `${BASE_URL}/guide/${slug}`
}
