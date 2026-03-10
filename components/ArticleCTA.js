import Link from 'next/link'

const APP_STORE_URL = 'https://apps.apple.com/tw/app/dogtor-%E9%80%97%E8%AA%B2/id6751773627'

export default function ArticleCTA({ painPoint, scene }) {
  return (
    <div className="article-cta">
      <p>
        如果你也在煩惱 <strong>{painPoint}</strong>，其實市面上已經有針對{' '}
        <strong>{scene}</strong> 設計的專用工具。例如我們的{' '}
        <Link href="/">
          <strong>Dogtor 逗課</strong>
        </Link>{' '}
        提供的免費題庫與錯題紀錄功能，就是為了幫學生省下整理時間，把精力放在理解與複習上。涵蓋國中數學、理化、自然與高中化學，符合 108 課綱。立即免費下載，利用通勤時間開始刷題。
      </p>
      <div className="article-cta-buttons">
        <a
          href={APP_STORE_URL}
          className="appStoreButton"
          target="_blank"
          rel="noreferrer"
        >
          <span className="appStoreIcon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1.25em" height="1.25em">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
          </span>
          <span className="appStoreText">
            <span className="appStoreLabelPrimary">Download on the</span>
            <span className="appStoreLabelSecondary">App Store</span>
          </span>
        </a>
        <Link href="/apk" className="btn btn-secondary">
          Android APK 下載
        </Link>
      </div>
    </div>
  )
}
