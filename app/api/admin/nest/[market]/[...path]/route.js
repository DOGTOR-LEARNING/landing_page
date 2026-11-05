import { NextResponse } from 'next/server'
import { ADMIN_COOKIE, adminProxy, checkOrigin } from '@/lib/adminProxy'
import { getAnnouncementBackendBase } from '@/lib/backendConfig'

// The pet nest catalog lives in each market's own database, so requests go to
// that market's backend (backend/app/routers/admin_nest.py). Every backend
// checks the employee session against the central auth service and requires
// nest.manage itself.
const MARKETS = { tw: 'zh', en: 'en' }

// Image uploads are multipart; adminProxy only forwards JSON.
async function forwardUpload(request, base, path) {
  if (!checkOrigin(request)) return NextResponse.json({ success: false, message: '請從本站後台操作' }, { status: 403 })
  const token = request.cookies.get(ADMIN_COOKIE)?.value
  if (!token) return NextResponse.json({ success: false, message: '請先登入員工帳號' }, { status: 401 })
  try {
    const upstream = await fetch(`${base.replace(/\/$/, '')}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': request.headers.get('content-type') || '', Authorization: `Bearer ${token}` },
      body: await request.arrayBuffer(),
      cache: 'no-store',
      signal: AbortSignal.timeout(60000),
      redirect: 'error',
    })
    const data = await upstream.json().catch(() => ({}))
    if (!upstream.ok) {
      data.success = false
      data.message = typeof data.detail === 'string' ? data.detail : data.message || '上傳失敗，請檢查圖片規格'
      delete data.detail
    }
    return NextResponse.json(data, { status: upstream.status, headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json({ success: false, message: '無法連線至後台服務，請稍後再試' }, { status: 502 })
  }
}

async function forward(request, { params }) {
  const { market, path = [] } = await params
  if (!MARKETS[market]) return NextResponse.json({ success: false, message: '沒有這個市場' }, { status: 404 })
  const base = getAnnouncementBackendBase(MARKETS[market])
  if (!base) return NextResponse.json({ success: false, message: '尚未設定這個市場的後台服務連線' }, { status: 503 })
  const target = ['/admin/nest', ...path.map(encodeURIComponent)].join('/') + new URL(request.url).search
  if (request.method === 'POST' && path[0] === 'assets') return forwardUpload(request, base, target)
  return adminProxy(request, target, base)
}

export const GET = forward
export const POST = forward
export const PUT = forward
