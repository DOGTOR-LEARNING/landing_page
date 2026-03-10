import { NextResponse } from 'next/server'

function getBackendBase() {
  const backendBase = process.env.BACKEND_Announcement_URL
  if (!backendBase) {
    console.error('[admin/announcements/[id]] BACKEND_Announcement_URL env var not set')
    return null
  }
  return backendBase
}

export async function GET(request, { params }) {
  try {
    const backendBase = getBackendBase()
    if (!backendBase) {
      return NextResponse.json({ success: false, message: '伺服器設定錯誤' }, { status: 500 })
    }
    const { id } = await params
    const key = request.headers.get('X-Announcements-Key') || ''
    const response = await fetch(`${backendBase}/announcements/${id}`, {
      headers: { 'X-Announcements-Key': key },
    })
    const data = await response.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('[admin/announcements/[id]] GET Error:', err)
    return NextResponse.json({ success: false, message: `連線失敗: ${err.message}` }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const backendBase = getBackendBase()
    if (!backendBase) {
      return NextResponse.json({ success: false, message: '伺服器設定錯誤' }, { status: 500 })
    }
    const { id } = await params
    const body = await request.json()
    const key = request.headers.get('X-Announcements-Key') || ''
    const response = await fetch(`${backendBase}/announcements/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Announcements-Key': key },
      body: JSON.stringify(body),
    })
    const data = await response.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('[admin/announcements/[id]] PUT Error:', err)
    return NextResponse.json({ success: false, message: `連線失敗: ${err.message}` }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const backendBase = getBackendBase()
    if (!backendBase) {
      return NextResponse.json({ success: false, message: '伺服器設定錯誤' }, { status: 500 })
    }
    const { id } = await params
    const key = request.headers.get('X-Announcements-Key') || ''
    const response = await fetch(`${backendBase}/announcements/${id}`, {
      method: 'DELETE',
      headers: { 'X-Announcements-Key': key },
    })
    const data = await response.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('[admin/announcements/[id]] DELETE Error:', err)
    return NextResponse.json({ success: false, message: `連線失敗: ${err.message}` }, { status: 500 })
  }
}
