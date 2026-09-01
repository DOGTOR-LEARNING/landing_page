import { NextResponse } from 'next/server'
import { getAnnouncementBackendBase } from '@/lib/backendConfig'

export async function GET(request) {
  try {
    const lang = request.headers.get('X-App-Lang') || 'zh'
    const backendBase = getAnnouncementBackendBase(lang)
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
    const lang = request.headers.get('X-App-Lang') || 'zh'
    const backendBase = getAnnouncementBackendBase(lang)
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
