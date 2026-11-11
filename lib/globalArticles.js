/**
 * English guide library of the international site (global.superb-tutor.com/guide).
 * Separate from lib/articles.js, which holds the Taiwan site's Chinese guides
 * about Taiwanese exams; the two libraries share no articles.
 */

import articlesData from '@/data/articles-global.json'
import { MARKET_GLOBAL, siteUrl } from './market'

const BASE_URL = siteUrl(MARKET_GLOBAL)

export function getAllGlobalArticles() {
  return [...articlesData.articles].sort((a, b) => {
    const dateCompare = new Date(b.publishDate) - new Date(a.publishDate)
    if (dateCompare !== 0) return dateCompare
    return (b.priority || 0) - (a.priority || 0)
  })
}

export function getGlobalArticleBySlug(slug) {
  return getAllGlobalArticles().find((a) => a.slug === slug) || null
}

export function getRelatedGlobalArticles(currentSlug, limit = 3) {
  const articles = getAllGlobalArticles()
  const current = getGlobalArticleBySlug(currentSlug)
  if (!current) return []

  const others = articles.filter((a) => a.slug !== currentSlug)
  const sameCategory = others.filter((a) => a.category === current.category)
  const rest = others.filter((a) => a.category !== current.category)
  return [...sameCategory, ...rest].slice(0, limit)
}

export function getGlobalArticleUrl(slug) {
  return `${BASE_URL}/guide/${slug}`
}

export const GLOBAL_GUIDE_URL = `${BASE_URL}/guide`
