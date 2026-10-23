import { NextResponse } from 'next/server'
import { adminProxy, authBackend } from '@/lib/adminProxy'

async function handle(request, { params }) {
  const { action } = await params
  const methods = { login: 'POST', logout: 'POST', me: 'GET', 'change-password': 'POST', activate: 'POST' }
  if (methods[action] !== request.method) return NextResponse.json({ success: false }, { status: 404 })
  return adminProxy(request, `/admin/auth/${action}`, authBackend(), {
    login: action === 'login' || action === 'activate', clear: action === 'logout' || action === 'change-password',
  })
}
export const GET = handle
export const POST = handle
