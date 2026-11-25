import { PLATFORM_DESKTOP_MIN_WIDTH, PLATFORM_HTML } from './content'
import { contactModal } from './contact-modal'

const DEMO_NAME = '示範教育'
// 與 components/PostHogProvider.js 同一個台灣 PostHog 專案，走 /ingest 反向代理。
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || 'phc_knXIVReoLEjO8tNZv7HhKW4WatiktXTwOXkTV8dYbqI'
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || '/ingest'

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
}

// 網址最後一段就是送出對象的補習班名稱（/platform/大明補習班），
// 頁面上的「示範教育」會換成它，PostHog 事件也會帶上 platform_target。
export function normalizeTarget(raw) {
  if (!raw) return null
  // Next 通常已解碼過；若還是 %E5… 形式就再解一次，解不開就用原字串。
  let name = raw
  try { name = decodeURIComponent(raw) } catch {}
  name = name.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 40)
  return name || null
}

function trackingScript(target) {
  // JSON 進 <script> 前把 < 轉義，避免名稱裡的 </script> 跳出去。
  const props = JSON.stringify({ platform_target: target || '(none)' }).replace(/</g, '\\u003c')
  return `<script>
!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once unregister identify reset get_distinct_id".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
(function(){
  var h=location.hostname;
  if(h==='localhost'||h==='127.0.0.1'||/\\.localhost$/.test(h))return;
  var props=${props};
  posthog.init(${JSON.stringify(POSTHOG_KEY)},{api_host:${JSON.stringify(POSTHOG_HOST)},ui_host:'https://us.posthog.com',defaults:'2025-05-24',capture_pageleave:true,persistence:'localStorage+cookie',cross_subdomain_cookie:true,session_recording:{maskAllInputs:true}});
  props.platform_compact=matchMedia('(width < ${PLATFORM_DESKTOP_MIN_WIDTH}px)').matches;
  props.platform_blocked=false;
  posthog.register(props);
  posthog.capture('web_platform_view',props);
})();
</script>`
}

export function platformResponse(target) {
  let html = PLATFORM_HTML
  if (target) {
    const safe = escapeHtml(target)
    html = html.split(DEMO_NAME).join(safe)
    // LINE 聊天畫面頂端的頭像字也跟著換成名稱第一個字。
    html = html.split('<span class="av">示</span>').join(`<span class="av">${escapeHtml(Array.from(target)[0])}</span>`)
    html = html.replace(/<title>([^<]*)<\/title>/, `<title>$1｜${safe}</title>`)
  }
  const modal = contactModal(target)
  html = html.replace('</head>', `${modal.css}\n${trackingScript(target)}\n</head>`)
  // 用函式當替換值，避免內容裡的 $ 被當成替換樣式。
  html = html.replace(/<\/body>(?![\s\S]*<\/body>)/, () => `${modal.markup}\n${modal.script}\n</body>`)
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
      'Referrer-Policy': 'no-referrer',
      // 每個名稱的內容不同，不讓 CDN 混用快取。
      'Cache-Control': 'private, no-store',
    },
  })
}
