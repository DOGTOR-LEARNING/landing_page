'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

/**
 * 渲染 Markdown 文字，支援 GFM（表格、刪除線、任務清單等）
 * 及 remark-breaks（單個換行 \n 直接轉為 <br>）。
 */
export default function MarkdownContent({ children, className }) {
  if (!children) return null

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
