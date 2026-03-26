export default function robots() {
  const baseUrl = 'https://dogtor.superb-tutor.com'

  return {
    rules: [
      // AdMob app-ads.txt 驗證：明確允許 Google-adstxt 爬蟲（見 Google 說明）
      {
        userAgent: 'Google-adstxt',
        disallow: [''],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/admin'],
      },
      {
        userAgent: 'GPTBot',
        allow: ['/', '/guide', '/guide/*', '/faq', '/about', '/api/guide/articles'],
        disallow: ['/admin', '/api/admin'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: ['/', '/guide', '/guide/*', '/faq', '/about', '/api/guide/articles'],
        disallow: ['/admin', '/api/admin'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: ['/', '/guide', '/guide/*', '/faq', '/about', '/api/guide/articles'],
        disallow: ['/admin', '/api/admin'],
      },
      {
        userAgent: 'Claude-Web',
        allow: ['/', '/guide', '/guide/*', '/faq', '/about', '/api/guide/articles'],
        disallow: ['/admin', '/api/admin'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
