'use client'

import Link from 'next/link'
import { useLocaleContext } from '@/components/LocaleProvider'

const APP_STORE_URL = 'https://apps.apple.com/tw/app/dogtor-%E9%80%97%E8%AA%B2/id6751773627'
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.dogtor.superbFlutterApp'

export default function ArticleCTA({ painPoint, scene }) {
  const { messages: m } = useLocaleContext()
  const c = m.articleCta

  return (
    <div className="article-cta">
      <p>
        {c.lineBeforePain}
        <strong>{painPoint}</strong>
        {c.lineBetweenPainScene}
        <strong>{scene}</strong>
        {c.lineBetweenSceneBrand}
        <Link href="/">
          <strong>{c.brandLinkText}</strong>
        </Link>
        {c.lineAfterBrand}
      </p>
      <div className="article-cta-buttons">
        <a href={APP_STORE_URL} className="appStoreButton" target="_blank" rel="noreferrer">
          <span className="appStoreIcon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1.25em" height="1.25em">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
          </span>
          <span className="appStoreText">
            <span className="appStoreLabelPrimary">{m.store.appStorePrimary}</span>
            <span className="appStoreLabelSecondary">{m.store.appStoreSecondary}</span>
          </span>
        </a>
        <a href={PLAY_STORE_URL} className="appStoreButton" target="_blank" rel="noreferrer">
          <span className="appStoreIcon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1.25em" height="1.25em">
              <path d="M3.18 23.76c.35.2.76.22 1.12.03l12.72-7.27-2.8-2.8-11.04 10.04zM.5 1.18C.19 1.55 0 2.1 0 2.82v18.36c0 .72.19 1.27.5 1.64l.09.08 10.28-10.28v-.24L.59 1.1l-.09.08zM20.33 10.42l-2.82-1.61-3.13 3.13 3.13 3.14 2.84-1.63c.81-.46.81-1.21-.02-1.03zM4.3.21L17.02 7.5l-2.8 2.8L3.18.26C3.54.07 3.95.09 4.3.21z" />
            </svg>
          </span>
          <span className="appStoreText">
            <span className="appStoreLabelPrimary">{m.store.playPrimary}</span>
            <span className="appStoreLabelSecondary">{m.store.playSecondary}</span>
          </span>
        </a>
      </div>
    </div>
  )
}
