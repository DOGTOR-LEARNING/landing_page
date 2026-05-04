import { NextResponse } from 'next/server'

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

export function middleware(request) {
  const url = request.nextUrl
  const langParam = url.searchParams.get('lang')
  const locale =
    normalizeLocale(langParam) ||
    localeFromAcceptLanguage(request.headers.get('accept-language')) ||
    'zh-TW'

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-locale', locale)

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: ['/((?!_next/|favicon.ico|robots.txt|sitemap.xml|llms.txt|.*\\..*).*)'],
}

