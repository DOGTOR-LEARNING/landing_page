import Link from 'next/link'

export default function RelatedArticles({ articles, heading = '延伸閱讀' }) {
  if (!articles.length) return null

  return (
    <aside className="related-articles">
      <h3>{heading}</h3>
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
