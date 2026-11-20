import { adminProxy } from '@/lib/adminProxy'

export async function GET(request, { params }) {
  const { market } = await params
  return adminProxy(request, `/admin/product-info/${encodeURIComponent(market)}/versions`)
}
