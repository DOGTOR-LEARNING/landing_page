'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import remarkCjkFriendly from 'remark-cjk-friendly'
import styles from './MarkdownContent.module.css'

/**
 * 渲染 Markdown 文字，支援 GFM（表格、刪除線、任務清單等）
 * 及 remark-breaks（單個換行 \n 直接轉為 <br>）。
 *
 * remark-cjk-friendly 讓 **粗體** / *斜體* 緊鄰中文標點（如 **重點：**）
 * 時也能正確渲染——CommonMark 原本的 flanking 規則對全形標點不友善，
 * 會導致 `**標題：**內文` 的粗體失效。
 *
 * 元件自帶完整的 Markdown 樣式（MarkdownContent.module.css），
 * 因此放在前言、章節、FAQ 或任何分享文章的位置都能正確顯示。
 *
 * 連結一律在新分頁開啟，並加上安全的 rel 屬性。
 */
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
          a: ({ node, ...props }) => (
            <a target="_blank" rel="noopener noreferrer" {...props} />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
