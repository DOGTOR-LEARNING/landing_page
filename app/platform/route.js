import { platformResponse } from './render'

// 只有直接輸入網址才能進入：不被索引、不留存快取副本、不帶 referrer 出站。
export function GET() {
  return platformResponse(null)
}
