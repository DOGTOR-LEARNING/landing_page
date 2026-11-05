import { adminProxy, authBackend } from '@/lib/adminProxy'
import { getAnnouncementBackendBase } from '@/lib/backendConfig'

// Potion / Pro grants are written to each market's own database. The zh tab
// keeps the default base (the tw backend, which is also the employee-auth
// backend); the en tab goes to the English backend, which checks the session
// against that same auth service. The backend checks grants.view / grants.manage.
async function forward(request, { params }) {
  const { path = [] } = await params
  const search = new URL(request.url).search
  const base = request.headers.get('X-App-Lang') === 'en' ? getAnnouncementBackendBase('en') : authBackend()
  return adminProxy(request, ['/admin/grants', ...path.map(encodeURIComponent)].join('/') + search, base)
}
export const GET = forward
export const POST = forward
