/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  // PostHog 反向代理：把事件經由自家網域送出，避免被 LINE / IG / Threads
  // 等 in-app 瀏覽器與擋追蹤器攔掉 us.i.posthog.com 的請求。
  // posthog-js 會打 /ingest/e/（帶尾斜線）。Next 內建的尾斜線正規化會先回 308，
  // 而離站事件是用 sendBeacon 在 unload 當下送出的，多一次往返很可能就送不到，
  // 所以關掉內建正規化。
  skipTrailingSlashRedirect: true,
  // 但關掉是全站生效的，會讓 /pricing 和 /pricing/ 都回 200。本站沒有 canonical
  // 標籤，等於製造重複內容，所以這裡把頁面的正規化補回來，只排除 /ingest。
  async redirects() {
    return [
      {
        source: '/:path((?!ingest/).+)/',
        destination: '/:path',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
    ]
  },
}

module.exports = nextConfig
