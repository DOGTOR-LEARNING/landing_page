import { adminProxy } from '@/lib/adminProxy'
import { getAnnouncementBackendBase } from '@/lib/backendConfig'
async function handle(request, { params }) {
  const { id } = await params
  return adminProxy(request, `/announcements/${encodeURIComponent(id)}`, getAnnouncementBackendBase(request.headers.get('X-App-Lang') || 'zh'))
}
export const PUT = handle
export const DELETE = handle
