import { adminProxy } from '@/lib/adminProxy'

async function forward(request, { params }) {
  const { path = [] } = await params
  const search = new URL(request.url).search
  return adminProxy(request, ['/admin/todos', ...path.map(encodeURIComponent)].join('/') + search)
}
export const GET = forward
export const POST = forward
export const PATCH = forward
export const PUT = forward
export const DELETE = forward
