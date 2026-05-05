import { NextResponse } from 'next/server'

const LOCALE_COOKIE = 'dogtor_locale'

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
  const cookieLocale = normalizeLocale(request.cookies.get(LOCALE_COOKIE)?.value)
  const locale =
    normalizeLocale(langParam) ||
    cookieLocale ||
    localeFromAcceptLanguage(request.headers.get('accept-language')) ||
    'zh-TW'

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-locale', locale)

  const res = NextResponse.next({
    request: { headers: requestHeaders },
  })

  const paramNorm = normalizeLocale(langParam)
  if (paramNorm) {
    res.cookies.set(LOCALE_COOKIE, paramNorm, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/|favicon.ico|robots.txt|sitemap.xml|llms.txt|.*\\..*).*)'],
}

