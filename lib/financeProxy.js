import { NextResponse } from 'next/server'
import { ADMIN_COOKIE, authBackend, checkOrigin } from './adminProxy'

// Server-side bridge from /admin/finance to the backend's /finance endpoints.
// The browser proves who it is with the employee session cookie; only this
// server holds FINANCE_API_KEY, so the key never reaches the client bundle.

export async function requireEmployee(request, permission) {
  if (!checkOrigin(request)) return NextResponse.json({ success: false, message: 'FORBIDDEN' }, { status: 403 })
  const token = request.cookies.get(ADMIN_COOKIE)?.value
  if (!token || !authBackend()) return NextResponse.json({ success: false, message: 'UNAUTHORIZED' }, { status: 401 })
  try {
    const identity = await fetch(`${authBackend()}/admin/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }, cache: 'no-store',
      signal: AbortSignal.timeout(10000), redirect: 'error',
    })
    if (!identity.ok) return NextResponse.json({ success: false, message: 'UNAUTHORIZED' }, { status: 401 })
    const { permissions = [] } = (await identity.json()).data || {}
    if (!permissions.includes('admin.access') || !permissions.includes(permission)) {
      return NextResponse.json({ success: false, message: 'FORBIDDEN' }, { status: 403 })
    }
    return null
  } catch {
    return NextResponse.json({ success: false, message: 'BACKEND_UNREACHABLE' }, { status: 502 })
  }
}

export async function forwardToFinance(path, init = {}, timeoutMs = 110_000) {
  const base = process.env.FINANCE_BACKEND_URL || process.env.API_BASE_URL
  // Falls back to the legacy passphrase, which the backend also accepts.
  const key = process.env.FINANCE_API_KEY || process.env.ADMIN_PASSPHRASE
  if (!base || !key) {
    console.error('[admin/finance] API_BASE_URL / FINANCE_API_KEY not set')
    return NextResponse.json({ success: false, message: 'FINANCE_NOT_CONFIGURED' }, { status: 503 })
  }
  try {
    const response = await fetch(`${base.replace(/\/$/, '')}/finance${path}`, {
      ...init,
      headers: { ...(init.headers || {}), 'X-Finance-Key': key },
      cache: 'no-store',
      signal: AbortSignal.timeout(timeoutMs),
    })
    const data = await response.json().catch(() => ({ success: false, message: 'BAD_BACKEND_RESPONSE' }))
    return NextResponse.json(data, { status: response.status })
  } catch (err) {
    console.error('[admin/finance] backend unreachable:', err?.name)
    return NextResponse.json({ success: false, message: 'BACKEND_UNREACHABLE' }, { status: 502 })
  }
}
