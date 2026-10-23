import { adminProxy } from '@/lib/adminProxy'
import { getNotificationsBackendBase } from '@/lib/backendConfig'
export async function POST(request) {
  return adminProxy(request, '/send_to_emails', getNotificationsBackendBase(request.headers.get('X-App-Lang') || 'zh'))
}
