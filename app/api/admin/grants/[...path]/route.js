import { adminProxy } from '@/lib/adminProxy'

// Potion / Pro grants exist only on the tw backend, which is also the
// employee-auth backend, so this goes to the default base, not the per-language
// notifications backend. The backend checks grants.view / grants.manage itself.
async function forward(request, { params }) {
  const { path = [] } = await params
  const search = new URL(request.url).search
  return adminProxy(request, ['/admin/grants', ...path.map(encodeURIComponent)].join('/') + search)
}
export const GET = forward
export const POST = forward
