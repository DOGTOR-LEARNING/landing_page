import { adminProxy } from '@/lib/adminProxy'

// Donated gift codes exist only on the tw backend (gift purchases are a
// Taiwan-only flow), which is also the employee-auth backend, so this keeps
// the default base. The backend checks grants.view / grants.manage itself.
async function forward(request, { params }) {
  const { path = [] } = await params
  const search = new URL(request.url).search
  return adminProxy(request, ['/admin/gifts', ...path.map(encodeURIComponent)].join('/') + search)
}
export const GET = forward
export const POST = forward
