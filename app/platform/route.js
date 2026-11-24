import { PLATFORM_HTML } from './content'

// 只有直接輸入網址才能進入：不被索引、不留存快取副本、不帶 referrer 出站。
export const dynamic = 'force-static'

export function GET() {
  return new Response(PLATFORM_HTML, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
      'Referrer-Policy': 'no-referrer',
    },
  })
}
