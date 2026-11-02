import { adminProxy, authBackend } from '@/lib/adminProxy'

// The commit check waits for Team Lead's reply, which can take a minute or more.
export const maxDuration = 150

async function forward(request, { params }) {
  const { path = [] } = await params
  const search = new URL(request.url).search
  const slow = path.join('/') === 'commits/check'
  return adminProxy(request, ['/admin/todos', ...path.map(encodeURIComponent)].join('/') + search, authBackend(), slow ? { timeoutMs: 140000 } : {})
}
export const GET = forward
export const POST = forward
export const PATCH = forward
export const PUT = forward
export const DELETE = forward
