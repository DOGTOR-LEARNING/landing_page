'use client'

import { trackExternalLinkClick } from '@/lib/analytics'
import styles from './LineCtaButton.module.css'

const LINE_BOT_URL = process.env.NEXT_PUBLIC_LINE_BOT_URL

/**
 * 綠色的「加入 LINE」CTA，首頁 hero 與 parent-pro hero 共用。
 * location 會帶進 PostHog 的 web_external_link_click，用來分辨是哪一頁點的。
 * 沒設定 NEXT_PUBLIC_LINE_BOT_URL 時整顆不渲染。
 */
export default function LineCtaButton({ label, location, className }) {
  if (!LINE_BOT_URL || !label) return null

  return (
    <a
      href={LINE_BOT_URL}
      className={className ? `${styles.lineCta} ${className}` : styles.lineCta}
      target="_blank"
      rel="noreferrer"
      onClick={() => trackExternalLinkClick(LINE_BOT_URL, location)}
    >
      <span className={styles.lineCtaIcon} aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width="1.15em"
          height="1.15em"
        >
          <path d="M12 2C6.48 2 2 5.66 2 10.17c0 4.04 3.55 7.42 8.35 8.06.32.07.76.21.87.49.1.25.07.65.03.9l-.14.85c-.04.25-.2.98.86.53s5.7-3.36 7.78-5.75C21.1 13.7 22 12.03 22 10.17 22 5.66 17.52 2 12 2M7.75 12.9H5.76a.53.53 0 0 1-.53-.53V8.4c0-.29.24-.53.53-.53s.53.24.53.53v3.44h1.46c.29 0 .53.24.53.53s-.24.53-.53.53m2.07-.53a.53.53 0 0 1-1.06 0V8.4a.53.53 0 0 1 1.06 0zm4.78 0a.53.53 0 0 1-.36.5.5.5 0 0 1-.17.03.53.53 0 0 1-.43-.21l-2.04-2.78v2.46a.53.53 0 0 1-1.06 0V8.4c0-.23.15-.43.36-.5a.53.53 0 0 1 .6.18l2.04 2.78V8.4a.53.53 0 0 1 1.06 0zm3.21-2.51c.29 0 .53.24.53.53s-.24.53-.53.53h-1.46v.93h1.46c.29 0 .53.24.53.53s-.24.53-.53.53h-1.99a.53.53 0 0 1-.53-.53V8.4c0-.29.24-.53.53-.53h1.99c.29 0 .53.24.53.53s-.24.53-.53.53h-1.46v.93z" />
        </svg>
      </span>
      <span>{label}</span>
    </a>
  )
}
