import { adminProxy } from '@/lib/adminProxy'
export async function PUT(request, { params }) {
  const { id } = await params
  return adminProxy(request, `/admin/users/${encodeURIComponent(id)}`)
}
