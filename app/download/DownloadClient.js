'use client'

import { useEffect, useState } from 'react'
import { STORE_LINKS, normalizeMarket } from '../../lib/market'
import { trackDownloadClick, trackLeavingEvent } from '../../lib/analytics'

// Play passes `referrer` through to install attribution; the App Store needs a
// provider token for campaign links, so iOS gets the plain link.
function playUrl(base, from) {
  const referrer = `utm_source=dogtor_link&utm_campaign=${from}`
  return `${base}&referrer=${encodeURIComponent(referrer)}`
}

function detectPlatform() {
  const ua = navigator.userAgent || ''
  if (/android/i.test(ua)) return 'android'
  // iPadOS reports itself as a Mac; touch support tells the two apart.
  if (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return 'ios'
  return 'other'
}

const COPY = {
  tw: { title: '下載 DOGTOR', choose: '選擇你的手機商店：', going: '正在前往商店…沒有跳轉的話請點下方按鈕' },
  global: { title: 'Get DOGTOR', choose: 'Choose your app store:', going: "Opening the store… tap below if nothing happens." },
}

export default function DownloadClient({ marketKey, from }) {
  const market = normalizeMarket(marketKey)
  const links = STORE_LINKS[market]
  const copy = COPY[market] || COPY.tw
  const safeFrom = String(from).replace(/[^\w-]/g, '').slice(0, 40) || 'direct'
  const appStore = links.appStore
  const play = playUrl(links.googlePlay, safeFrom)
  const [platform, setPlatform] = useState(null)

  useEffect(() => {
    const detected = detectPlatform()
    setPlatform(detected)
    if (detected === 'other') return
    const store = detected === 'ios' ? 'app_store' : 'google_play'
    trackLeavingEvent('app_download_redirect', { store, from: safeFrom })
    window.location.replace(detected === 'ios' ? appStore : play)
  }, [appStore, play, safeFrom])

  return (
    <main
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: 24,
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: 22, margin: 0 }}>{copy.title}</h1>
      <p style={{ margin: 0, opacity: 0.8 }}>
        {platform === null || platform === 'other' ? copy.choose : copy.going}
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        {platform !== 'android' && (
          <a href={appStore} className="appStoreButton" onClick={() => trackDownloadClick('app_store', `download_${safeFrom}`)}>
            <span className="appStoreText">
              <span className="appStoreLabelPrimary">Download on the</span>
              <span className="appStoreLabelSecondary">App Store</span>
            </span>
          </a>
        )}
        {platform !== 'ios' && (
          <a href={play} className="appStoreButton" onClick={() => trackDownloadClick('google_play', `download_${safeFrom}`)}>
            <span className="appStoreText">
              <span className="appStoreLabelPrimary">Get it on</span>
              <span className="appStoreLabelSecondary">Google Play</span>
            </span>
          </a>
        )}
      </div>
    </main>
  )
}
