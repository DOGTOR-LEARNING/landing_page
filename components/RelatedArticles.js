import Link from 'next/link'

export default function RelatedArticles({ articles }) {
  if (!articles.length) return null

  return (
    <aside className="related-articles">
      <h3>延伸閱讀</h3>
      <ul>
        {articles.map((article) => (
          <li key={article.slug}>
            <Link href={`/guide/${article.slug}`}>{article.title}</Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}
