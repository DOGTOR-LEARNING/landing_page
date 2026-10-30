import { adminProxy } from '@/lib/adminProxy'

// Both markets' product documents live in one Cloud Storage bucket, so the
// default (tw, employee-auth) backend reads and writes either one. The backend
// checks knowledge.view / knowledge.manage itself.
async function forward(request, { params }) {
  const { market } = await params
  return adminProxy(request, `/admin/product-info/${encodeURIComponent(market)}`)
}
export const GET = forward
export const PUT = forward
