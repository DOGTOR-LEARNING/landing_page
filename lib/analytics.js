import posthog from 'posthog-js'

const PREFIX = 'web_'

export function trackEvent(eventName, properties = {}) {
  if (typeof window === 'undefined') return
  posthog.capture(PREFIX + eventName, properties)
}

export function trackDownloadClick(store, location) {
  trackEvent('app_download_click', { store, location })
}

export function trackCTAClick(ctaType, location) {
  trackEvent('cta_click', { cta_type: ctaType, location })
}

export function trackSubscribeClick(plan) {
  trackEvent('subscribe_click', { plan })
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
  trackEvent('external_link_click', { url, location })
}
