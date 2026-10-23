import { timingSafeEqual } from 'crypto'
import { NextResponse } from 'next/server'

// Server-side bridge from /admin to the backend's /finance endpoints.
// The browser proves it is an admin with the passphrase; only this server
// holds FINANCE_API_KEY, so the key never reaches the client bundle.

function sameSecret(a, b) {
  const left = Buffer.from(String(a || ''))
  const right = Buffer.from(String(b || ''))
  return left.length === right.length && timingSafeEqual(left, right)
}

export function checkAdmin(request) {
  const expected = process.env.ADMIN_PASSPHRASE
  if (!expected) {
    return NextResponse.json({ success: false, message: 'ADMIN_NOT_CONFIGURED' }, { status: 500 })
  }
  if (!sameSecret(request.headers.get('x-admin-passphrase'), expected)) {
    return NextResponse.json({ success: false, message: 'UNAUTHORIZED' }, { status: 401 })
  }
  return null
}

export async function forwardToFinance(path, init = {}) {
  const base = process.env.FINANCE_BACKEND_URL || process.env.API_BASE_URL
  const key = process.env.FINANCE_API_KEY
  if (!base || !key) {
    console.error('[admin/finance] FINANCE_BACKEND_URL (or API_BASE_URL) / FINANCE_API_KEY not set')
    return NextResponse.json({ success: false, message: 'FINANCE_NOT_CONFIGURED' }, { status: 503 })
  }
  try {
    const response = await fetch(`${base.replace(/\/$/, '')}/finance${path}`, {
      ...init,
      headers: { ...(init.headers || {}), 'X-Finance-Key': key },
      cache: 'no-store',
      signal: AbortSignal.timeout(110_000),
    })
    const data = await response.json().catch(() => ({ success: false, message: 'BAD_BACKEND_RESPONSE' }))
    return NextResponse.json(data, { status: response.status })
  } catch (err) {
    console.error('[admin/finance] backend unreachable:', err?.name)
    return NextResponse.json({ success: false, message: 'BACKEND_UNREACHABLE' }, { status: 502 })
  }
}
