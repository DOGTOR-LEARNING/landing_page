import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { passphrase, ...broadcastPayload } = body

    // 再次驗證通關密語
    const adminPassphrase = process.env.ADMIN_PASSPHRASE
    if (!adminPassphrase || passphrase !== adminPassphrase) {
      return NextResponse.json({ success: false, message: '你真的是管理員嗎...' }, { status: 401 })
    }

    const backendBase = process.env.BACKEND_NOTIFICATIONS_URL
    if (!backendBase) {
      console.error('[admin/broadcast] BACKEND_NOTIFICATIONS_URL env var not set')
      return NextResponse.json({ success: false, message: '伺服器設定錯誤' }, { status: 500 })
    }

    const response = await fetch(`${backendBase}/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(broadcastPayload),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.detail || '廣播失敗', data },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('[admin/broadcast] Error:', err)
    return NextResponse.json({ success: false, message: `廣播失敗: ${err.message}` }, { status: 500 })
  }
}
