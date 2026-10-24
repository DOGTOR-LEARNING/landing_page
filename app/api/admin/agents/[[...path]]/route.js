import { adminProxy } from '@/lib/adminProxy'

async function forward(request, { params }) {
  const { path = [] } = await params
  return adminProxy(request, ['/admin/agents', ...path.map(encodeURIComponent)].join('/'))
}
export const GET = forward
export const PUT = forward
export const POST = forward
export const DELETE = forward
