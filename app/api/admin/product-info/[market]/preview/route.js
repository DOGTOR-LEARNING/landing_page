import { adminProxy } from '@/lib/adminProxy'

export const maxDuration = 45

export async function POST(request, { params }) {
  const { market } = await params
  return adminProxy(request, `/admin/product-info/${encodeURIComponent(market)}/preview`)
}
