import { NextResponse } from 'next/server'

export const ADMIN_COOKIE = 'dogtor_admin_session'
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
  maxAge: 12 * 60 * 60,
}

export function authBackend() {
  const base = process.env.ADMIN_AUTH_BACKEND_URL || process.env.BACKEND_Announcement_URL
  return base?.replace(/\/$/, '')
}

export function checkOrigin(request) {
  if (['GET', 'HEAD'].includes(request.method)) return true
  // Browser writes require an exact same-origin Origin; no permissive missing
  // Origin fallback, including login (prevents login CSRF).
  return request.headers.get('origin') === (process.env.ADMIN_PUBLIC_ORIGIN || new URL(request.url).origin)
}

export async function adminProxy(request, path, base = authBackend(), options = {}) {
  if (!checkOrigin(request)) return NextResponse.json({ success: false, message: '請從本站後台操作' }, { status: 403 })
  if (!base) return NextResponse.json({ success: false, message: '尚未設定後台服務連線' }, { status: 503 })
  const token = request.cookies.get(ADMIN_COOKIE)?.value
  if (!options.login && !token) return NextResponse.json({ success: false, message: '請先登入員工帳號' }, { status: 401 })
  try {
    const permission = path.startsWith('/announcements')
      ? `announcements.${request.method === 'GET' ? 'view' : 'manage'}`
      : ['/broadcast', '/send_to_emails'].includes(path) ? 'push.manage' : null
    if (permission) {
      const identity = await fetch(`${authBackend()}/admin/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }, cache: 'no-store',
        signal: AbortSignal.timeout(10000), redirect: 'error',
      })
      if (!identity.ok) return NextResponse.json({ success: false, message: '登入已失效或驗證服務無法使用' }, { status: identity.status })
      const profile = (await identity.json()).data
      if (!profile.permissions.includes('admin.access') || !profile.permissions.includes(permission)) {
        return NextResponse.json({ success: false, message: '你的帳號沒有此功能的權限' }, { status: 403 })
      }
    }
    const upstream = await fetch(`${base.replace(/\/$/, '')}${path}`, {
      method: request.method,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      ...(!['GET', 'HEAD'].includes(request.method) ? { body: await request.text() } : {}),
      cache: 'no-store',
      signal: AbortSignal.timeout(options.timeoutMs || 60000),
      redirect: 'error',
    })
    const data = await upstream.json()
    const sessionToken = data.session_token
    delete data.session_token
    if (!upstream.ok) {
      data.success = false
      data.message = typeof data.detail === 'string' ? data.detail : data.message || '操作失敗，請檢查輸入或稍後再試'
      delete data.detail
    }
    const response = NextResponse.json(data, { status: upstream.status, headers: { 'Cache-Control': 'no-store' } })
    if (options.login && upstream.ok && sessionToken) response.cookies.set(ADMIN_COOKIE, sessionToken, cookieOptions)
    if ((options.clear && upstream.ok) || upstream.status === 401) response.cookies.set(ADMIN_COOKIE, '', { ...cookieOptions, maxAge: 0 })
    return response
  } catch {
    return NextResponse.json({ success: false, message: '無法連線至後台服務，請稍後再試' }, { status: 502 })
  }
}
