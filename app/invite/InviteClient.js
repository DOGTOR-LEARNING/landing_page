'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { trackInvitePageVisit, trackDownloadClick, trackEvent, trackLeavingEvent } from '@/lib/analytics'
import styles from './page.module.css'

// Store links, deeplink scheme and copy per app. The international app is
// iOS-only until its Play listing exists, so it has no Play link yet.
const MARKETS = {
  tw: {
    appStoreUrl: 'https://apps.apple.com/tw/app/dogtor-%E9%80%97%E8%AA%B2/id6751773627',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.dogtor.superbFlutterApp',
    scheme: 'dogtor',
    showSiteChrome: true,
    copy: {
      titleInvited: '朋友邀請你加入 Dogtor 逗課',
      title: '加入 Dogtor 逗課',
      subtitleInvited: '一起冒險、解題、與好友對戰，讓學習變有趣！下載 App 即可加入。',
      subtitle: '和 Dogtor 逗課 一起冒險，輕鬆解決問題、與好友對戰，同時學習成長。',
      cta: '立即下載 App，開始你的學習冒險',
      join: '已安裝 App？加入好友',
      home: '回首頁',
      codeLabel: '朋友的邀請碼',
      copy: '複製',
      copied: '已複製',
      codeHint: '下載後在 App 的新手引導輸入這組邀請碼，你和朋友都能獲得一支體力恢復劑！',
      noCodeHint: (
        <>
          下載後在 App 的新手引導輸入朋友訊息裡的<strong>邀請碼</strong>，你和朋友都能獲得一支體力恢復劑！
        </>
      ),
    },
  },
  global: {
    appStoreUrl: 'https://apps.apple.com/app/id6805425251',
    playStoreUrl: null,
    scheme: 'dogtorglobal',
    // The Taiwan site's header and footer link to pages this host does not serve.
    showSiteChrome: false,
    copy: {
      titleInvited: 'Your friend invited you to Dogtor',
      title: 'Join Dogtor',
      subtitleInvited: 'Practice, solve problems and battle your friends. Download the app to join.',
      subtitle: 'Practice, solve problems and battle your friends while you learn.',
      cta: 'Download the app to get started',
      join: 'Already have the app? Add friend',
      home: null,
      codeLabel: "Your friend's invite code",
      copy: 'Copy',
      copied: 'Copied',
      codeHint: 'Enter this code during onboarding in the app, and you and your friend each get an energy refill!',
      noCodeHint: (
        <>
          Enter the <strong>invite code</strong> from your friend&apos;s message during onboarding in the app, and you
          and your friend each get an energy refill!
        </>
      ),
    },
  },
}

// Loose shape check only; the backend is the one that validates the checksum.
const INVITE_CODE_PATTERN = /^[A-Z0-9]{3,20}$/

function buildAppInviteUrl(scheme, inviter) {
  const q = inviter != null && inviter !== '' ? `?inviter=${encodeURIComponent(inviter)}` : ''
  return `${scheme}://invite${q}`
}

function normalizeInviteCode(raw) {
  const code = (raw || '').trim().toUpperCase()
  return INVITE_CODE_PATTERN.test(code) ? code : null
}

// Runs after mount so the server render and the first client render agree.
function usePlatform() {
  const [platform, setPlatform] = useState('unknown')
  useEffect(() => {
    const ua = navigator.userAgent || ''
    if (/android/i.test(ua)) {
      setPlatform('android')
    } else if (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) {
      // iPadOS reports itself as a Mac; touch support tells the two apart.
      setPlatform('ios')
    }
  }, [])
  return platform
}

function AppStoreButton({ url }) {
  return (
    <a
      href={url}
      className="appStoreButton"
      target="_blank"
      rel="noreferrer"
      onClick={() => trackDownloadClick('app_store', 'invite')}
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
  )
}

function GooglePlayButton({ url }) {
  return (
    <a
      href={url}
      className="appStoreButton"
      target="_blank"
      rel="noreferrer"
      onClick={() => trackDownloadClick('google_play', 'invite')}
    >
      <span className="appStoreIcon" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1.25em" height="1.25em">
          <path d="M3.18 23.76c.35.2.76.22 1.12.03l12.72-7.27-2.8-2.8-11.04 10.04zM.5 1.18C.19 1.55 0 2.1 0 2.82v18.36c0 .72.19 1.27.5 1.64l.09.08 10.28-10.28v-.24L.59 1.1l-.09.08zM20.33 10.42l-2.82-1.61-3.13 3.13 3.13 3.14 2.84-1.63c.81-.46.81-1.21-.02-1.03zM4.3.21L17.02 7.5l-2.8 2.8L3.18.26C3.54.07 3.95.09 4.3.21z" />
        </svg>
      </span>
      <span className="appStoreText">
        <span className="appStoreLabelPrimary">Get it on</span>
        <span className="appStoreLabelSecondary">Google Play</span>
      </span>
    </a>
  )
}

function StoreButtons({ platform, market }) {
  const appStore = <AppStoreButton url={market.appStoreUrl} />
  const play = market.playStoreUrl ? <GooglePlayButton url={market.playStoreUrl} /> : null
  // Only the matching store on a phone; both on desktop or an unknown device.
  if (platform === 'ios') return appStore
  if (platform === 'android' && play) return play
  return (
    <>
      {appStore}
      {play}
    </>
  )
}

function InviteCodeCard({ code, copy }) {
  const [copied, setCopied] = useState(false)

  if (!code) {
    return (
      <div className={styles.codeCard}>
        <p className={styles.codeHint}>{copy.noCodeHint}</p>
      </div>
    )
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      trackEvent('invite_code_copy', { result: 'ok' })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access is blocked in some in-app browsers; the code is
      // still on screen and selectable.
      trackEvent('invite_code_copy', { result: 'blocked' })
    }
  }

  return (
    <div className={styles.codeCard}>
      <p className={styles.codeLabel}>{copy.codeLabel}</p>
      <div className={styles.codeRow}>
        <span className={styles.codeValue}>{code}</span>
        <button type="button" className={styles.copyButton} onClick={handleCopy}>
          {copied ? copy.copied : copy.copy}
        </button>
      </div>
      <p className={styles.codeHint}>{copy.codeHint}</p>
    </div>
  )
}

function InviteBody({ market, inviter, code }) {
  const platform = usePlatform()
  const appInviteUrl = buildAppInviteUrl(market.scheme, inviter)
  const { copy } = market

  return (
    <>
      {market.showSiteChrome && <Header />}
      <main className={styles.main}>
        <div className="container">
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{inviter ? copy.titleInvited : copy.title}</h1>
            <p className={styles.pageSubtitle}>{inviter ? copy.subtitleInvited : copy.subtitle}</p>
          </div>

          <section className={styles.ctaSection}>
            <InviteCodeCard code={code} copy={copy} />
            <p className={styles.ctaText}>{copy.cta}</p>
            <div className={styles.ctaButtons}>
              <StoreButtons platform={platform} market={market} />
            </div>
            <div className={`${styles.ctaButtons} ${styles.secondaryButtons}`}>
              <a
                href={appInviteUrl}
                className="btn btn-secondary"
                onClick={() => trackLeavingEvent('invite_join_friend_click', { inviter: inviter || 'direct' })}
              >
                {copy.join}
              </a>
              {copy.home && (
                <Link href="/" className="btn btn-secondary">
                  {copy.home}
                </Link>
              )}
            </div>
          </section>
        </div>
      </main>
      {market.showSiteChrome && <Footer />}
    </>
  )
}

function InviteContent({ market }) {
  const searchParams = useSearchParams()
  const inviter = searchParams.get('inviter')
  const code = normalizeInviteCode(searchParams.get('code'))

  useEffect(() => {
    trackInvitePageVisit(inviter)
  }, [inviter])

  return <InviteBody market={market} inviter={inviter} code={code} />
}

export default function InviteClient({ marketKey }) {
  const market = MARKETS[marketKey] || MARKETS.tw
  return (
    <Suspense fallback={<InviteBody market={market} inviter={null} code={null} />}>
      <InviteContent market={market} />
    </Suspense>
  )
}
