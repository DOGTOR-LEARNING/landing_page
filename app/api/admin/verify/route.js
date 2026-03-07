import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { passphrase } = await request.json()

    if (!passphrase) {
      return NextResponse.json({ success: false, message: '請輸入通關密語' }, { status: 400 })
    }

    const adminPassphrase = process.env.ADMIN_PASSPHRASE
    if (!adminPassphrase) {
      console.error('[admin/verify] ADMIN_PASSPHRASE env var not set')
      return NextResponse.json({ success: false, message: '伺服器設定錯誤' }, { status: 500 })
    }

    if (passphrase === adminPassphrase) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, message: '你真的是管理員嗎...' }, { status: 401 })
    }
  } catch (err) {
    console.error('[admin/verify] Error:', err)
    return NextResponse.json({ success: false, message: '伺服器錯誤' }, { status: 500 })
  }
}
