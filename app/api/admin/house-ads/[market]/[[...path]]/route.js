import { NextResponse } from 'next/server'
import { adminProxy } from '@/lib/adminProxy'
import { getAnnouncementBackendBase } from '@/lib/backendConfig'

// House ad campaigns (reward videos and chapter-list banners) live in each
// market's own database, so requests go to that market's backend
// (backend/app/routers/admin_house_ads.py), which checks ads.view /
// ads.manage / ads.submit itself. Files never pass through here: the browser
// uploads them straight to Cloud Storage, and media/video only asks the
// backend to cut and compress the uploaded object, which can take minutes.
const MARKETS = { tw: 'zh', en: 'en' }

export const maxDuration = 300

async function forward(request, { params }) {
  const { market, path = [] } = await params
  if (!MARKETS[market]) return NextResponse.json({ success: false, message: '沒有這個市場' }, { status: 404 })
  const base = getAnnouncementBackendBase(MARKETS[market])
  if (!base) return NextResponse.json({ success: false, message: '尚未設定這個市場的後台服務連線' }, { status: 503 })
  const target = ['/admin/house-ads', ...path.map(encodeURIComponent)].join('/')
  const slow = path[0] === 'media' && path[1] === 'video'
  return adminProxy(request, target, base, slow ? { timeoutMs: 290000 } : {})
}

export const GET = forward
export const POST = forward
export const PUT = forward
