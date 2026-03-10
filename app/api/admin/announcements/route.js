import { NextResponse } from 'next/server'

function getBackendBase() {
  const backendBase = process.env.BACKEND_Announcement_URL
  if (!backendBase) {
    console.error('[admin/announcements] BACKEND_Announcement_URL env var not set')
    return null
  }
  return backendBase
}

export async function GET() {
  try {
    const backendBase = getBackendBase()
    if (!backendBase) {
      return NextResponse.json({ success: false, message: '伺服器設定錯誤' }, { status: 500 })
    }
    const response = await fetch(`${backendBase}/announcements`)
    const data = await response.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('[admin/announcements] GET Error:', err)
    return NextResponse.json({ success: false, message: `連線失敗: ${err.message}` }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const backendBase = getBackendBase()
    if (!backendBase) {
      return NextResponse.json({ success: false, message: '伺服器設定錯誤' }, { status: 500 })
    }
    const body = await request.json()
    const key = request.headers.get('X-Announcements-Key') || ''
    const response = await fetch(`${backendBase}/announcements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Announcements-Key': key },
      body: JSON.stringify(body),
    })
    const data = await response.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('[admin/announcements] POST Error:', err)
    return NextResponse.json({ success: false, message: `連線失敗: ${err.message}` }, { status: 500 })
  }
}
