// Paddle discount codes a `?discount=` link may pre-apply on /parent-pro and
// /subscribe. Every code here discounts the first payment only (Paddle
// `recur: false`); renewals are billed at the regular price, and the copy
// says so.
//
// A code not listed here does nothing, so a stray or mistyped query param can
// never discount checkout. Paddle checks expiry again at checkout; `expiresAt`
// only hides the offer once it can no longer be redeemed.

export const BASE_PRICES = { monthly: 300, yearly: 3000 }

const STATIC_PROMOS = {
  // 2026 創新創業嘉年華 booth QR code.
  CARNIVAL7: {
    discountId: 'dsc_01m7s7qj5artvhkq53pjhhx193',
    percentOff: 30,
    expiresAt: '2026-11-26T15:59:59Z',
    event: { zh: '2026 創新創業嘉年華', en: '2026 Innovation & Entrepreneurship Carnival' },
  },
}

// The LINE newcomer offer (10% off), configured per deployment.
function envPromo() {
  const code = process.env.NEXT_PUBLIC_PADDLE_PROMO_DISCOUNT_CODE
  const discountId = process.env.NEXT_PUBLIC_PADDLE_PROMO_DISCOUNT_ID
  if (!code || !discountId) return {}
  return { [code.toUpperCase()]: { discountId, percentOff: 10 } }
}

const PROMOS = { ...envPromo(), ...STATIC_PROMOS }

export function findPromo(code, now = new Date()) {
  if (!code) return null
  const key = String(code).trim().toUpperCase()
  const promo = PROMOS[key]
  if (!promo) return null
  if (promo.expiresAt && now >= new Date(promo.expiresAt)) return null
  const factor = (100 - promo.percentOff) / 100
  return {
    ...promo,
    code: key,
    // 30% off reads as 「7 折」 in Chinese.
    zhe: String((100 - promo.percentOff) / 10).replace(/\.0$/, ''),
    prices: {
      monthly: Math.round(BASE_PRICES.monthly * factor),
      yearly: Math.round(BASE_PRICES.yearly * factor),
    },
  }
}

export function formatNtd(amount) {
  return amount.toLocaleString('en-US')
}

export function subscribeHref(plan, promo) {
  const params = new URLSearchParams({ plan })
  if (promo) params.set('discount', promo.code)
  return `/subscribe?${params}`
}

// What the copy templates in lib/i18n/messages.js (subscribe.promo*) need.
export function promoView(promo, locale) {
  if (!promo) return null
  return {
    code: promo.code,
    zhe: promo.zhe,
    percentOff: promo.percentOff,
    event: promo.event && (locale === 'en' ? promo.event.en : promo.event.zh),
    monthly: formatNtd(promo.prices.monthly),
    yearly: formatNtd(promo.prices.yearly),
    // Last day the code works, in Taiwan time, e.g. 11/26.
    deadline:
      promo.expiresAt &&
      new Date(promo.expiresAt).toLocaleDateString('en-US', {
        timeZone: 'Asia/Taipei',
        month: 'numeric',
        day: 'numeric',
      }),
  }
}
