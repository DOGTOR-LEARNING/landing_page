import { adminProxy } from '@/lib/adminProxy'
import { getAnnouncementBackendBase } from '@/lib/backendConfig'
const handle = request => adminProxy(request, '/announcements', getAnnouncementBackendBase(request.headers.get('X-App-Lang') || 'zh'))
export const GET = handle
export const POST = handle
