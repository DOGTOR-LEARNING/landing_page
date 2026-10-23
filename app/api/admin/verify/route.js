import { NextResponse } from 'next/server'
export async function POST() {
  return NextResponse.json({ success: false, message: '請改用員工帳號與密碼登入' }, { status: 410 })
}
