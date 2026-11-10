import { adminProxy } from '@/lib/adminProxy'

// Sets another employee's title and introduction (users.manage); unlike
// PUT /api/admin/users/[id] it does not sign them out.
export async function PUT(request, { params }) {
  const { id } = await params
  return adminProxy(request, `/admin/users/${encodeURIComponent(id)}/profile`)
}
