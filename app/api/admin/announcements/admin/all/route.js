import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const backendBase = process.env.BACKEND_Announcement_URL
    if (!backendBase) {
      console.error('[admin/announcements/admin/all] BACKEND_Announcement_URL env var not set')
      return NextResponse.json({ success: false, message: '伺服器設定錯誤' }, { status: 500 })
    }
    const key = request.headers.get('X-Announcements-Key') || ''
    const response = await fetch(`${backendBase}/announcements/admin/all`, {
      headers: { 'X-Announcements-Key': key },
    })
    const data = await response.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('[admin/announcements/admin/all] Error:', err)
    return NextResponse.json({ success: false, message: `連線失敗: ${err.message}` }, { status: 500 })
  }
}
