export default function robots() {
  const baseUrl = 'https://dogtor.superb-tutor.com'

  // 對所有 AI / 搜尋爬蟲全面開放（含訓練用途），僅封鎖後台與後台 API。
  // 採「明確列出主流 AI 爬蟲」的策略：wildcard 已涵蓋全部，
  // 逐一列出是為了清楚宣示「歡迎抓取」並避免未來誤封。
  const allowAll = {
    allow: '/',
    disallow: ['/admin', '/api/admin'],
  }

  const aiBots = [
    // OpenAI
    'GPTBot',
    'ChatGPT-User',
    'OAI-SearchBot',
    // Anthropic / Claude
    'ClaudeBot',
    'Claude-Web',
    'Claude-User',
    'Claude-SearchBot',
    'anthropic-ai',
    // Google（Gemini / AI Overviews 訓練與接地）
    'Googlebot',
    'Google-Extended',
    'GoogleOther',
    // Microsoft / Copilot
    'Bingbot',
    'Adidxbot',
    // Perplexity
    'PerplexityBot',
    'Perplexity-User',
    // Apple Intelligence
    'Applebot',
    'Applebot-Extended',
    // 其他主流 AI 代理 / 助理
    'Amazonbot',
    'Meta-ExternalAgent',
    'Meta-ExternalFetcher',
    'cohere-ai',
    'DuckAssistBot',
    'YouBot',
    'Bytespider',
    'Diffbot',
  ]

  return {
    rules: [
      // AdMob app-ads.txt 驗證：明確允許 Google-adstxt 爬蟲
      { userAgent: 'Google-adstxt', disallow: [''] },
      // 預設：所有爬蟲皆可抓取（已涵蓋上面未列出的任何 AI 代理）
      { userAgent: '*', ...allowAll },
      // 明確逐一宣示歡迎主流 AI 爬蟲
      ...aiBots.map((userAgent) => ({ userAgent, ...allowAll })),
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
