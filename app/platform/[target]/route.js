import { platformResponse, normalizeTarget } from '../render'

// /platform/<補習班名稱>：每家送出對象一個網址，用來在 PostHog 計算各自的造訪人數。
export async function GET(request, { params }) {
  const { target } = await params
  return platformResponse(normalizeTarget(target))
}
