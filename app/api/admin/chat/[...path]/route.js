import { adminProxy } from '@/lib/adminProxy'

// Model replies can take a while; the backend gives the provider 90 seconds.
export const maxDuration = 120

async function forward(request, { params }) {
  const { path } = await params
  const search = new URL(request.url).search
  const execute = path.at(-1) === 'execute'
  return adminProxy(request, `/admin/chat/${path.map(encodeURIComponent).join('/')}${search}`, undefined,
    execute ? { timeoutMs: 110000 } : {})
}
export const GET = forward
export const POST = forward
export const PUT = forward
export const DELETE = forward
