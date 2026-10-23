import { adminProxy } from '@/lib/adminProxy'
import { getAnnouncementBackendBase } from '@/lib/backendConfig'
export const GET = request => adminProxy(request, '/announcements/admin/all', getAnnouncementBackendBase(request.headers.get('X-App-Lang') || 'zh'))
