import { NextResponse } from 'next/server'
import { isGlobalHost, requestHost } from '@/lib/appHosts'

const COOKIE_NAME = 'dogtor_locale'

// Server-only secret. When ?preview=<token> on /subscribe matches this, the
// middleware flags the request so the subscribe page skips the LINE sign-in
// gate — used to hand the payment provider a reachable checkout URL for review.
const PADDLE_PREVIEW_TOKEN = process.env.PADDLE_PREVIEW_TOKEN

function normalizeLocale(raw) {
  if (!raw) return null
  const v = String(raw).toLowerCase()
  if (v === 'en' || v === 'en-us' || v === 'en-gb') return 'en'
  if (v === 'zh' || v === 'zh-tw' || v === 'zh-hant') return 'zh-TW'
  return null
}

function localeFromAcceptLanguage(headerValue) {
  if (!headerValue) return null
  // e.g. "zh-TW,zh;q=0.9,en;q=0.8"
  const first = headerValue.split(',')[0]?.trim()
  return normalizeLocale(first)
}

// The international host only serves invite links and the legal pages the
// en app points at; everything else on it is the Taiwan site.
const GLOBAL_HOST_PATHS = ['/invite', '/privacy', '/terms', '/support']

export function middleware(request) {
  const url = request.nextUrl
  const globalHost = isGlobalHost(requestHost(request.headers))

  if (globalHost && !GLOBAL_HOST_PATHS.includes(url.pathname)) {
    return NextResponse.redirect(new URL('/invite', url))
  }
  const langParam = url.searchParams.get('lang')
  const cookieLocale = request.cookies.get(COOKIE_NAME)?.value

  const locale = globalHost
    ? 'en'
    : normalizeLocale(langParam) ||
    normalizeLocale(cookieLocale) ||
    localeFromAcceptLanguage(request.headers.get('accept-language')) ||
    'zh-TW'

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-admin-workspace', url.pathname === '/admin' || url.pathname.startsWith('/admin/') ? '1' : '0')
  requestHeaders.set('x-locale', locale)
  // Set here rather than trusted from the client, like x-paddle-preview below.
  requestHeaders.set('x-app-market', globalHost ? 'global' : 'tw')

  // Never trust an inbound x-paddle-preview header; only the middleware may set it.
  requestHeaders.delete('x-paddle-preview')
  if (
    PADDLE_PREVIEW_TOKEN &&
    url.pathname === '/subscribe' &&
    url.searchParams.get('preview') === PADDLE_PREVIEW_TOKEN
  ) {
    requestHeaders.set('x-paddle-preview', '1')
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  // Persist locale in cookie when explicitly set via ?lang= param
  if (!globalHost && normalizeLocale(langParam)) {
    response.cookies.set(COOKIE_NAME, locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
    })
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/|ingest/|favicon.ico|robots.txt|sitemap.xml|llms.txt|.*\\..*).*)'],
}
