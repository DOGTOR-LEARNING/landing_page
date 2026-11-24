import { PLATFORM_HTML } from './content'
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

// 頁面裡的後台示意圖是寬版排版，手機寬度會擠壞。比這個窄就整頁換成
// 「請用平板或電腦開啟」。1024px 起才放得下側欄和後台示意，iPad 需橫放。
export const MIN_WIDTH = 1024

function narrowGate() {
  const max = MIN_WIDTH - 1
  return `<style>
#narrow-gate{display:none}
@media (max-width:${max}px){
  body>*:not(#narrow-gate){display:none!important}
  #narrow-gate{display:flex;min-height:100vh;min-height:100dvh;align-items:center;justify-content:center;padding:24px 20px;box-sizing:border-box;background:var(--paper);color:var(--ink);font-family:var(--body)}
  .ng-box{max-width:360px;display:flex;flex-direction:column;gap:14px;text-align:center;align-items:center}
  .ng-ic{width:64px;height:64px;color:var(--accent)}
  .ng-box h1{font-family:var(--display);font-size:24px;margin:0}
  .ng-box p{margin:0;color:var(--muted);font-size:15px;line-height:1.7}
  .ng-copy{font:inherit;font-weight:700;font-size:15px;background:var(--accent);color:#fff;border:0;border-radius:999px;padding:11px 24px;cursor:pointer}
  .ng-copy:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
  .ng-fine{font-size:13px!important}
}
</style>`
}

function narrowGateMarkup() {
  return `<div id="narrow-gate" role="dialog" aria-labelledby="ng-title">
<div class="ng-box">
<svg class="ng-ic" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="12" width="40" height="28" rx="3"/><path d="M18 50h16M26 40v10"/><rect x="42" y="24" width="16" height="28" rx="3" fill="var(--paper)"/></svg>
<h1 id="ng-title">請用電腦或橫放的平板開啟</h1>
<p>這份介紹有完整的後台畫面示意，目前的螢幕寬度不夠，畫面會擠在一起。請改用電腦開啟，或把平板橫放。</p>
<button class="ng-copy" type="button" id="ng-copy">複製網址</button>
<p class="ng-fine" id="ng-msg" aria-live="polite">複製後貼到電腦瀏覽器即可開啟</p>
</div>
</div>
<script>
(function(){
  var btn=document.getElementById('ng-copy'),msg=document.getElementById('ng-msg');
  btn.addEventListener('click',function(){
    var url=location.href;
    function done(){msg.textContent='已複製網址';btn.textContent='已複製';}
    function fallback(){var t=document.createElement('textarea');t.value=url;t.setAttribute('readonly','');t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();try{document.execCommand('copy');done();}catch(e){msg.textContent=url;}document.body.removeChild(t);}
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(url).then(done,fallback);}else{fallback();}
    if(window.posthog)posthog.capture('web_platform_copy_link');
  });
})();
</script>`
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
  var blocked=window.matchMedia&&matchMedia('(max-width:${MIN_WIDTH - 1}px)').matches;
  props.platform_blocked=!!blocked;
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
  html = html.replace('</head>', `${narrowGate()}\n${modal.css}\n${trackingScript(target)}\n</head>`)
  // 用函式當替換值，避免內容裡的 $ 被當成替換樣式。
  html = html.replace(/<\/body>(?![\s\S]*<\/body>)/, () => `${modal.markup}\n${modal.script}\n</body>`)
  html = html.replace('<body>', `<body>\n${narrowGateMarkup()}`)
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
