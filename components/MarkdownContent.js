'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import remarkCjkFriendly from 'remark-cjk-friendly'
import styles from './MarkdownContent.module.css'

function MarkdownLink({ node, href, children, ...props }) {
  const isInternal = href && (href.startsWith('/') || href.startsWith('#'))
  if (isInternal) {
    return <Link href={href} {...props}>{children}</Link>
  }
  return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
}

export default function MarkdownContent({ children, className }) {
  if (!children) return null

  const wrapperClass = className
    ? `${styles.markdown} ${className}`
    : styles.markdown

  return (
    <div className={wrapperClass}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkCjkFriendly, remarkBreaks]}
        components={{
          a: MarkdownLink,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
