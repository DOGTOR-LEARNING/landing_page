import { adminProxy } from '@/lib/adminProxy'
export const GET = request => adminProxy(request, '/admin/users')
export const POST = request => adminProxy(request, '/admin/users')
