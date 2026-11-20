import { adminProxy } from '@/lib/adminProxy'

export async function GET(request, { params }) {
  const { market, generation } = await params
  return adminProxy(request, `/admin/product-info/${encodeURIComponent(market)}/versions/${encodeURIComponent(generation)}`)
}
