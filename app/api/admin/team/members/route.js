import { adminProxy } from '@/lib/adminProxy'
export const GET = request => adminProxy(request, '/admin/team/members')
