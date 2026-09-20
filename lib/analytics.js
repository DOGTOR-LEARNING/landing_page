import posthog from 'posthog-js'

const PREFIX = 'web_'

// 點下去會離開／凍結目前頁面的事件（App Store、Google Play、LINE 深連結等）。
// 預設的批次佇列在 in-app 瀏覽器把 WebView 交給系統時常常來不及送出，
// 這些事件改用 sendBeacon 並跳過佇列，確保離開前就已經發出去。
const LEAVING_PAGE = { transport: 'sendBeacon', send_instantly: true }

/**
 * 辨識常見的 in-app 瀏覽器。posthog-js 的 UA parser 認不出 LINE / Instagram /
 * Threads，一律歸類成 $browser = "Other"，所以自己標一個屬性出來。
 */
export function detectInAppBrowser() {
  if (typeof navigator === 'undefined') return null

  const ua = navigator.userAgent || ''

  if (/\bLine\//i.test(ua) || /\bLIFF\//i.test(ua)) return 'line'
  if (/Instagram/i.test(ua)) return 'instagram'
  if (/Barcelona/i.test(ua)) return 'threads'
  // MicroMessenger（微信）必須排在 Messenger 前面，否則會被誤判。
  if (/MicroMessenger/i.test(ua)) return 'wechat'
  // Messenger 也要排在 FBAN 前面：它的 UA 是 [FBAN/MessengerForiOS;...]。
  if (/MessengerForiOS|FB_IAB\/MESSENGER|\bMessenger\b/i.test(ua)) return 'messenger'
  if (/FBAN|FBAV|FB_IAB/i.test(ua)) return 'facebook'
  if (/Twitter/i.test(ua)) return 'twitter'
  if (/TikTok|BytedanceWebview/i.test(ua)) return 'tiktok'

  return null
}

export function trackEvent(eventName, properties = {}, options) {
  if (typeof window === 'undefined') return
  posthog.capture(PREFIX + eventName, properties, options)
}

/** 給「點完就離開頁面」的連結用，避免事件卡在批次佇列裡被丟掉。 */
export function trackLeavingEvent(eventName, properties = {}) {
  trackEvent(eventName, properties, LEAVING_PAGE)
}

export function trackDownloadClick(store, location) {
  trackLeavingEvent('app_download_click', { store, location })
}

export function trackCTAClick(ctaType, location) {
  trackEvent('cta_click', { cta_type: ctaType, location })
}

export function trackSubscribeClick(plan, discountApplied) {
  trackEvent('subscribe_click', { plan, discount_applied: !!discountApplied })
}

export function trackGuideArticleClick(slug, category) {
  trackEvent('guide_article_click', { slug, category })
}

export function trackPricingPlanClick(plan) {
  trackEvent('pricing_plan_click', { plan })
}

export function trackInvitePageVisit(inviter) {
  trackEvent('invite_page_visit', { inviter: inviter || 'direct' })
}

export function trackNavClick(destination) {
  trackEvent('nav_click', { destination })
}

export function trackExternalLinkClick(url, location) {
  trackLeavingEvent('external_link_click', { url, location })
}
