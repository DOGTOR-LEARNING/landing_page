// 「預約了解」彈窗包含洽詢表單（送到 /api/platform-contact 寄 email）和其他聯絡方式。
// 頁面上任何帶 data-contact 的按鈕都會打開它。
// 表單只分兩種：對這個平台有興趣（可勾選模組），或其他合作；重點是留下聯絡方式，訊息選填。
import { BASE_MODULE, PLATFORM_MODULES } from './modules'

// LINE 與 IG 填了才會顯示按鈕；為 null 時整列不出現。
export const PLATFORM_CONTACT = {
  email: 'hello@superb-tutor.com',
  phone: { display: '0963-779-263', href: '+886963779263' },
  line: { label: '加好友直接聊', url: 'https://line.me/ti/p/XdShbGSKSI' },
  instagram: { label: '@dogtor_learning', url: 'https://www.instagram.com/dogtor_learning/' },
  site: 'https://official.superb-tutor.com/zh-TW',
  privacy: 'https://official.superb-tutor.com/zh-TW/privacy',
  company: '超棒軟體科技有限公司',
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
}

const ICONS = {
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
  line: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3C6.5 3 2 6.6 2 11c0 3.9 3.5 7.2 8.3 7.9.3.1.8.2.9.5.1.3.1.7 0 1l-.1.9c0 .3-.2 1 .9.6 1.1-.5 6-3.5 8.2-6 1.5-1.6 2.2-3.3 2.2-5C22 6.6 17.5 3 12 3Z" fill="currentColor" stroke="none"/></svg>',
  ig: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
}

function channel(kind, href, title, sub, external) {
  const ext = external ? ' target="_blank" rel="noopener noreferrer"' : ''
  return `<a class="cm-ch cm-${kind}" href="${esc(href)}"${ext} data-channel="${kind}"><span class="cm-ic">${ICONS[kind]}</span><span class="cm-ct"><b>${esc(title)}</b><span>${esc(sub)}</span></span><span class="cm-go">›</span></a>`
}

export function contactModal(target) {
  const c = PLATFORM_CONTACT
  const channels = [
    c.line ? channel('line', c.line.url, 'LINE', c.line.label, true) : '',
    c.instagram ? channel('ig', c.instagram.url, 'Instagram', c.instagram.label, true) : '',
    channel('phone', `tel:${c.phone.href}`, '電話', c.phone.display, false),
    channel('mail', `mailto:${c.email}`, 'Email', c.email, false),
  ].join('')

  const modules = PLATFORM_MODULES.map((m) => {
    const base = m.code === BASE_MODULE
    const dep = base ? '基本模組・一定包含' : m.requires.length ? `需搭配 ${m.requires.join('、')}` : '可單獨使用'
    return `<label class="cm-mod${base ? ' base' : ''}"><input type="checkbox" name="modules" value="${m.code}" data-req="${m.requires.join(',')}"${base ? ' checked disabled' : ''}><i>${m.code}</i><span><b>${esc(m.name)}</b><small>${dep}</small></span></label>`
  }).join('')

  const css = `<style>
.cm-wrap{position:fixed;inset:0;z-index:100;display:none;align-items:center;justify-content:center;padding:24px;background:rgba(10,22,26,.55);backdrop-filter:blur(3px)}
.cm-wrap.open{display:flex}
.cm-dlg [hidden]{display:none!important}
.cm-dlg{width:min(1000px,100%);height:min(max(520px,58vh),calc(100vh - 48px));overflow:hidden;background:var(--card);color:var(--ink);border-radius:12px;box-shadow:0 24px 60px rgba(0,0,0,.25);display:grid;grid-template-columns:1.55fr 1fr;position:relative}
.cm-x{position:absolute;top:14px;right:14px;width:36px;height:36px;border-radius:50%;border:0;background:rgba(255,255,255,.18);color:#fff;font-size:20px;line-height:1;cursor:pointer;z-index:2}
.cm-x:hover{background:rgba(255,255,255,.3)}
.cm-x:focus-visible,.cm-dlg button:focus-visible,.cm-dlg a:focus-visible,.cm-dlg label:has(input:focus-visible){outline:3px solid var(--accent);outline-offset:2px}
.cm-l{display:flex;flex-direction:column;min-height:0;height:100%;box-sizing:border-box}
#cm-body{display:flex;flex-direction:column;min-height:0;flex:1}
.cm-scroll{flex:1;min-height:0;overflow-y:auto;padding:26px 30px 16px}
.cm-foot{flex:none;border-top:1px solid var(--rule);background:var(--card);padding:12px 30px 14px;display:flex;flex-direction:column;gap:8px}
.cm-foot-r{display:flex;align-items:center;gap:16px}
.cm-foot-r .cm-fld{flex:1}
.cm-l h2{font-family:var(--display);font-size:26px;margin:0}
.cm-sub{color:var(--muted);font-size:15px;margin:4px 0 0}
.cm-f{display:flex;flex-direction:column;gap:16px}
.cm-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.cm-fld{display:flex;flex-direction:column;gap:6px;border:0;padding:0;margin:0;min-width:0}
.cm-fld>label,.cm-lg{font-size:14px;font-weight:700;padding:0}
.cm-req{margin-left:6px;font-size:12px;font-weight:600;color:var(--accent)}
.cm-opt{margin-left:6px;font-size:12px;font-weight:500;color:var(--muted)}
.cm-dlg input[type=text],.cm-dlg input[type=email],.cm-dlg input[type=tel],.cm-dlg textarea{font:inherit;font-size:15px;color:var(--ink);background:var(--card);border:1.5px solid var(--rule);border-radius:10px;padding:9px 12px;width:100%;box-sizing:border-box}
.cm-dlg input:focus,.cm-dlg textarea:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 4px color-mix(in srgb,var(--accent) 18%,transparent)}
.cm-dlg textarea{min-height:76px;resize:vertical}
.cm-dlg .bad input[type=text],.cm-dlg .bad input[type=email],.cm-dlg .bad input[type=tel],.cm-dlg .bad textarea,.cm-dlg .bad .cm-kind label{border-color:#c23b3b}
.cm-err{font-size:13px;color:#c23b3b}
.cm-err:empty{display:none}
.cm-kind{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.cm-kind label{display:flex;gap:10px;align-items:flex-start;border:1.5px solid var(--rule);border-radius:6px;padding:11px 14px;cursor:pointer}
.cm-kind label:has(input:checked){border-color:var(--accent);background:var(--accent-soft)}
.cm-kind input{accent-color:var(--accent);margin:3px 0 0;flex:none}
.cm-kind b{display:block;font-size:15px}
.cm-kind small{display:block;font-size:12.5px;color:var(--muted);margin-top:1px}
.cm-kind label:has(input:checked) b{color:var(--accent)}
.cm-mods{border-block:1px solid var(--rule);padding:12px 0;display:flex;flex-direction:column;gap:8px}
.cm-mods-h{display:flex;justify-content:space-between;align-items:baseline;font-size:13.5px;font-weight:700}
.cm-mods-h button{font:inherit;font-size:12.5px;font-weight:700;color:var(--accent);background:none;border:0;cursor:pointer;padding:0}
.cm-mod-g{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0 10px}
.cm-mod{display:flex;align-items:flex-start;gap:6px;border-top:1px solid var(--rule);padding:7px 4px;font-size:13px;cursor:pointer;line-height:1.4}
.cm-mod span{display:flex;flex-direction:column;min-width:0}
.cm-mod b{font-weight:inherit}
.cm-mod small{font-size:11px;color:var(--muted);font-weight:400}
.cm-mod.base{cursor:default;opacity:.85}
.cm-mod.auto{animation:cmflash 1.2s ease-out}
@keyframes cmflash{0%{box-shadow:0 0 0 4px color-mix(in srgb,var(--accent) 40%,transparent)}100%{box-shadow:0 0 0 0 transparent}}
@media (prefers-reduced-motion:reduce){.cm-mod.auto{animation:none}}
.cm-mods-note{font-size:12.5px;color:var(--accent);font-weight:700;min-height:0}
.cm-mods-note:empty{display:none}
.cm-mods-rule{font-size:12px;color:var(--muted)}
.cm-mod input{flex:none;width:14px;height:14px;margin:1px 0 0;accent-color:var(--accent)}
.cm-mod i{font-style:normal;font-size:11px;font-weight:700;color:var(--muted);font-variant-numeric:tabular-nums;padding-top:1px}
.cm-mod:has(input:checked){background:var(--accent-soft);color:var(--accent);font-weight:700}
.cm-mod:has(input:checked) i{color:var(--accent)}
.cm-ways{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.cm-way{position:relative}
.cm-way span{position:absolute;left:11px;top:50%;transform:translateY(-50%);width:22px;height:22px;border-radius:6px;display:grid;place-items:center;color:#fff;pointer-events:none}
.cm-way span svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.cm-way .w-line{background:#06c755}.cm-way .w-phone{background:#2769a9}.cm-way .w-ig{background:#c13584}.cm-way .w-mail{background:#58686d}
.cm-dlg .cm-way input{padding-left:42px}
.cm-hint{font-size:12.5px;color:var(--muted);font-weight:400;margin-left:6px}
.cm-cs{display:flex;gap:10px;align-items:flex-start;font-size:13.5px;cursor:pointer;font-weight:400!important}
.cm-cs input{margin-top:3px;width:18px;height:18px;accent-color:var(--accent);flex:none}
.cm-cs a{color:var(--accent);font-weight:700}
.cm-hp{position:absolute;left:-9999px;width:0;height:0;overflow:hidden}
.cm-btn{font:inherit;font-weight:700;font-size:16px;background:var(--action);color:#fff;border:0;border-radius:8px;padding:12px 30px;cursor:pointer;align-self:flex-start}
.cm-btn[disabled]{opacity:.6;cursor:wait}
.cm-fail{background:#fbe7e7;color:#8c2a2a;border-radius:10px;padding:10px 14px;font-size:14px}
.cm-fail a{color:inherit;font-weight:700}
.cm-done{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:10px;padding:30px;height:100%;box-sizing:border-box}
.cm-done h3{font-size:22px;margin:0}
.cm-done p{color:var(--muted);margin:0;font-size:15px}
.cm-r{background:var(--deep);color:#fff;padding:26px 26px 22px;display:flex;flex-direction:column;gap:12px;overflow-y:auto;box-sizing:border-box}
.cm-r h3{font-size:20px;margin:0}
.cm-r>p{font-size:14px;line-height:1.65;color:rgba(255,255,255,.9);margin:0}
.cm-chs{display:flex;flex-direction:column}
.cm-ch{display:flex;align-items:center;gap:12px;border-top:1px solid rgba(255,255,255,.22);padding:8px 4px;color:#fff;text-decoration:none}
.cm-ch:hover{background:rgba(255,255,255,.12)}
.cm-ic{width:32px;height:32px;border-radius:6px;background:#fff;color:#2769a9;display:grid;place-items:center;flex:none}
.cm-ic svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.cm-line .cm-ic{background:#06c755;color:#fff}
.cm-ig .cm-ic{background:linear-gradient(45deg,#f9a03f,#d62976 55%,#962fbf);color:#fff}
.cm-ct{display:flex;flex-direction:column;flex:1;min-width:0;line-height:1.35}
.cm-ct b{font-size:14px}.cm-ct span{font-size:13px;color:rgba(255,255,255,.85);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cm-go{font-size:20px;opacity:.7}
.cm-co{margin-top:auto;padding-top:14px;border-top:1px solid rgba(255,255,255,.22);display:flex;align-items:center;justify-content:space-between;gap:10px;color:#fff;text-decoration:none}
.cm-co img{height:38px;width:auto;display:block}
.cm-co span{font-size:12.5px;font-weight:700;white-space:nowrap;opacity:.9}
.cm-co:hover span{opacity:1;text-decoration:underline}
body.cm-lock{overflow:hidden}
@media (max-width:700px){
  .cm-wrap{padding:12px}
  .cm-dlg{display:block;width:min(520px,100%);height:auto;max-height:calc(100dvh - 24px);overflow-y:auto;overscroll-behavior:contain}
  .cm-x{position:sticky;top:8px;right:auto;display:block;margin:8px 8px -48px auto;width:44px;height:44px;background:var(--accent-soft);color:var(--accent)}
  .cm-x:hover{background:var(--accent-soft)}
  .cm-l{height:auto}
  .cm-scroll{overflow:visible;padding:18px 16px 16px}
  .cm-l h2{font-size:24px}
  .cm-sub{margin-top:10px}
  .cm-foot,.cm-r{padding:16px}
  .cm-r{overflow:visible}
  .cm-dlg input[type=text],.cm-dlg input[type=email],.cm-dlg input[type=tel],.cm-dlg textarea{font-size:16px}
}
@media (max-width:440px){
  .cm-row,.cm-ways{grid-template-columns:minmax(0,1fr)}
  .cm-kind,.cm-mod-g{grid-template-columns:repeat(2,minmax(0,1fr))}
  .cm-kind label{gap:6px;padding:8px}
  .cm-mods-h{flex-wrap:wrap;gap:4px 10px}
  .cm-foot-r{flex-direction:column;align-items:stretch;gap:12px}
  .cm-foot-r .cm-btn{align-self:stretch}
}
</style>`

  const org = target ? esc(target) : ''
  const way = (key, cls, icon, label, type, ph, extra = '') =>
    `<label class="cm-way"><span class="${cls}">${ICONS[icon]}</span><input type="${type}" name="${key}" placeholder="${ph}" aria-label="${label}"${extra}></label>`

  const markup = `<div class="cm-wrap" id="cm-wrap" aria-hidden="true">
<div class="cm-dlg" role="dialog" aria-modal="true" aria-labelledby="cm-title">
<button type="button" class="cm-x" id="cm-x" aria-label="關閉">×</button>
<div class="cm-l">
<form id="cm-body" novalidate>
<div class="cm-scroll"><div class="cm-f" id="cm-form-fields">
<div><h2 id="cm-title" tabindex="-1">預約了解</h2>
<p class="cm-sub">歡迎在下方留言提供幾個方便的時段，以及想見面的地點，或告訴我們你偏好線上會談。我們會與你約時間，了解補習班目前的做法，一起討論怎麼導入。</p></div>
<fieldset class="cm-fld" data-f="inquiryType"><legend class="cm-lg">你想了解的是<span class="cm-req">必填</span></legend>
<div class="cm-kind"><label><input type="radio" name="inquiryType" value="platform" checked><span><b>這個補習班平台</b><small>可選填感興趣的模組</small></span></label><label><input type="radio" name="inquiryType" value="other"><span><b>其他合作</b><small>客製系統、技術合作或任何想法</small></span></label></div>
<div class="cm-err" id="cm-inquiryType-err"></div></fieldset>
<div class="cm-row">
<div class="cm-fld" data-f="name"><label for="cm-name">怎麼稱呼你<span class="cm-req">必填</span></label><input type="text" id="cm-name" name="name" autocomplete="name" placeholder="例如：王主任" maxlength="80"><div class="cm-err" id="cm-name-err"></div></div>
<div class="cm-fld" data-f="organization"><label for="cm-org">補習班／單位<span class="cm-opt">選填</span></label><input type="text" id="cm-org" name="organization" autocomplete="organization" placeholder="補習班或公司名稱" value="${org}" maxlength="120"><div class="cm-err" id="cm-organization-err"></div></div>
</div>
<fieldset class="cm-fld" data-f="contact"><legend class="cm-lg">怎麼聯絡你<span class="cm-req">至少填一項</span><span class="cm-hint">我們會用你方便的方式聯繫</span></legend>
<div class="cm-ways">${way('line', 'w-line', 'line', 'LINE ID', 'text', 'LINE ID', ' maxlength="60"')}${way('phone', 'w-phone', 'phone', '電話', 'tel', '電話', ' autocomplete="tel" inputmode="tel" maxlength="30"')}${way('instagram', 'w-ig', 'ig', 'Instagram 帳號', 'text', 'Instagram 帳號', ' maxlength="60"')}${way('email', 'w-mail', 'mail', 'Email', 'email', 'Email', ' autocomplete="email" inputmode="email" maxlength="320"')}</div>
<div class="cm-err" id="cm-contact-err"></div></fieldset>
<div class="cm-fld" data-f="message"><label for="cm-msg">方便的時間、地點或其他補充<span class="cm-opt">選填</span></label><textarea id="cm-msg" name="message" maxlength="3000" placeholder="例如：週二或週四下午 2 點後方便，想約線上聊。"></textarea><div class="cm-err" id="cm-message-err"></div></div>
<div class="cm-mods" id="cm-mods"><div class="cm-mods-h"><span>有興趣的模組<span class="cm-opt">選填，可複選</span></span><button type="button" id="cm-all">全部都想了解</button></div><div class="cm-mods-rule">有些模組要搭配前面的模組才能使用，勾選時會自動一起勾上。</div><div class="cm-mod-g">${modules}</div><div class="cm-mods-note" id="cm-mods-note" aria-live="polite"></div></div>
<div class="cm-hp" aria-hidden="true"><label for="cm-website">請勿填寫此欄位</label><input id="cm-website" name="website" tabindex="-1" autocomplete="off"></div>
</div></div>
<div class="cm-foot"><div class="cm-foot-r"><div class="cm-fld" data-f="consent"><label class="cm-cs"><input type="checkbox" id="cm-consent" name="consent"><span>我同意超棒軟體依<a href="${esc(c.privacy)}" target="_blank" rel="noopener noreferrer">隱私權政策</a>使用以上資料與我聯繫。<span class="cm-req">必填</span></span></label><div class="cm-err" id="cm-consent-err"></div></div>
<button type="submit" class="cm-btn" id="cm-submit">送出</button></div>
<div class="cm-fail" id="cm-fail" role="alert" hidden></div></div>
</form>
<div class="cm-done" id="cm-done" hidden tabindex="-1"><h3>收到了，謝謝你！</h3><p>我們會用你留下的方式聯絡你，一起確認會談時間。</p><button type="button" class="cm-btn" id="cm-again">再送一則</button></div>
</div>
<aside class="cm-r">
<h3>也可以直接找我們</h3>
<p>可以直接約時間，也歡迎聊聊其他合作。</p>
<div class="cm-chs">${channels}</div>
<a class="cm-co" href="${esc(c.site)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(c.company)}官網"><img src="/superb-lockup-white.svg" alt="超棒軟體 SuperB Software" width="145" height="38"><span>前往官網 ›</span></a>
</aside>
</div>
</div>`

  const script = `<script>
(function(){
  var wrap=document.getElementById('cm-wrap');if(!wrap)return;
  var form=document.getElementById('cm-body'),F=form.elements,body=form,done=document.getElementById('cm-done');
  var fail=document.getElementById('cm-fail'),submit=document.getElementById('cm-submit'),mods=document.getElementById('cm-mods');
  var TARGET=${JSON.stringify(target || '').replace(/</g, '\\u003c')},EMAIL=${JSON.stringify(c.email)};
  var ERR={nameRequired:'請告訴我們怎麼稱呼你。',nameTooLong:'稱呼請在 80 字以內。',organizationTooLong:'單位名稱請在 120 字以內。',typeRequired:'請選擇你想了解的內容。',contactRequired:'請至少留一種聯絡方式：LINE、電話、Instagram 或 Email。',emailInvalid:'Email 格式似乎不正確，請確認後再試一次。',contactTooLong:'聯絡方式太長了，請確認後再試一次。',messageTooLong:'想說的話請在 3000 字以內。',consentRequired:'請勾選同意，我們才能用你留下的資料聯絡你。'};
  var FIELDS=['inquiryType','name','organization','contact','message','consent'];
  var startedAt=0,lastFocus=null,submitted=false;
  function track(e,p){try{if(window.posthog&&posthog.capture)posthog.capture(e,p||{});}catch(x){}}
  function open(src){lastFocus=document.activeElement;wrap.classList.add('open');wrap.setAttribute('aria-hidden','false');document.body.classList.add('cm-lock');if(!startedAt)startedAt=Date.now();(done.hidden?document.getElementById('cm-title'):done).focus();track('web_platform_contact_open',{placement:src||'unknown'});}
  function close(){wrap.classList.remove('open');wrap.setAttribute('aria-hidden','true');document.body.classList.remove('cm-lock');if(lastFocus&&lastFocus.focus)lastFocus.focus();}
  document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-contact]');if(t){e.preventDefault();open(t.getAttribute('data-contact'));}});
  document.getElementById('cm-x').addEventListener('click',close);
  wrap.addEventListener('mousedown',function(e){if(e.target===wrap)close();});
  document.addEventListener('keydown',function(e){
    if(!wrap.classList.contains('open'))return;
    if(e.key==='Escape'){close();return;}
    if(e.key==='Tab'){var f=[].slice.call(wrap.querySelectorAll('a[href],button:not([disabled]),input:not([tabindex="-1"]),textarea')).filter(function(el){return el.offsetParent!==null||el.type==='checkbox';});if(!f.length)return;var a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus();}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();}}
  });
  wrap.querySelectorAll('.cm-ch').forEach(function(a){a.addEventListener('click',function(){track('web_platform_contact_channel',{channel:a.getAttribute('data-channel')});});});
  function kind(){var t=form.querySelector('input[name=inquiryType]:checked');return t?t.value:'';}
  function syncKind(){mods.hidden=kind()!=='platform';}
  form.querySelectorAll('input[name=inquiryType]').forEach(function(r){r.addEventListener('change',syncKind);});
  var BOX={},note=document.getElementById('cm-mods-note');
  form.querySelectorAll('input[name=modules]').forEach(function(b){BOX[b.value]=b;});
  function reqOf(c){var r=BOX[c]&&BOX[c].getAttribute('data-req');return r?r.split(','):[];}
  function closure(c,acc){acc=acc||[];reqOf(c).forEach(function(d){if(acc.indexOf(d)<0){acc.push(d);closure(d,acc);}});return acc;}
  function flash(b){var l=b.closest('label');l.classList.remove('auto');void l.offsetWidth;l.classList.add('auto');}
  function nameOf(c){return c+' '+BOX[c].closest('label').querySelector('b').textContent;}
  form.querySelectorAll('input[name=modules]').forEach(function(b){b.addEventListener('change',function(){
    var c=b.value,added=[],removed=[];
    if(b.checked){closure(c).forEach(function(d){if(BOX[d]&&!BOX[d].checked){BOX[d].checked=true;added.push(d);flash(BOX[d]);}});}
    else{Object.keys(BOX).forEach(function(k){if(BOX[k].checked&&!BOX[k].disabled&&closure(k).indexOf(c)>=0){BOX[k].checked=false;removed.push(k);flash(BOX[k]);}});}
    added.sort();removed.sort();note.textContent=added.length?'已一起勾選 '+added.map(nameOf).join('、')+'（'+nameOf(c)+' 需要搭配）':removed.length?'已一起取消 '+removed.map(nameOf).join('、')+'（需要搭配 '+nameOf(c)+'）':'';
  });});
  document.getElementById('cm-all').addEventListener('click',function(){var boxes=[].filter.call(form.querySelectorAll('input[name=modules]'),function(b){return !b.disabled;}),all=boxes.every(function(b){return b.checked;});boxes.forEach(function(b){b.checked=!all;});note.textContent='';this.textContent=all?'全部都想了解':'清除全部';});
  function values(){return{inquiryType:kind(),modules:kind()==='platform'?[].map.call(form.querySelectorAll('input[name=modules]:checked'),function(b){return b.value;}):[],name:F.name.value.trim(),organization:F.organization.value.trim(),line:F.line.value.trim(),phone:F.phone.value.trim(),instagram:F.instagram.value.trim(),email:F.email.value.trim(),message:F.message.value.trim(),consent:F.consent.checked};}
  function validate(v){var e={};if(!v.inquiryType)e.inquiryType='typeRequired';if(!v.name)e.name='nameRequired';else if(v.name.length>80)e.name='nameTooLong';if(v.organization.length>120)e.organization='organizationTooLong';
    if(!v.line&&!v.phone&&!v.instagram&&!v.email)e.contact='contactRequired';else if(v.email&&!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v.email))e.contact='emailInvalid';
    if(v.message.length>3000)e.message='messageTooLong';if(!v.consent)e.consent='consentRequired';return e;}
  function show(errs){FIELDS.forEach(function(f){var box=form.querySelector('[data-f='+f+']'),el=document.getElementById('cm-'+f+'-err');el.textContent=errs[f]?ERR[errs[f]]||'':'';box.classList.toggle('bad',!!errs[f]);});}
  form.addEventListener('input',function(){if(submitted)show(validate(values()));});
  form.addEventListener('change',function(){if(submitted)show(validate(values()));});
  form.addEventListener('submit',function(e){
    e.preventDefault();if(submit.disabled)return;submitted=true;fail.hidden=true;
    var v=values(),errs=validate(v);show(errs);
    var first=FIELDS.filter(function(f){return errs[f];})[0];if(first){var el=form.querySelector('[data-f='+first+'] input,[data-f='+first+'] textarea');if(el)el.focus();return;}
    submit.disabled=true;submit.textContent='送出中…';
    v.website=document.getElementById('cm-website').value;v.startedAt=startedAt;v.target=TARGET;
    fetch('/api/platform-contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(v)})
      .then(function(r){return r.json().catch(function(){return{ok:false,reason:'server'};});})
      .then(function(res){
        if(res.ok){track('web_platform_contact_submit_success',{type:v.inquiryType,modules:v.modules.length});body.hidden=true;done.hidden=false;done.focus();return;}
        if(res.reason==='validation'&&res.fieldErrors){show(res.fieldErrors);return;}
        fail.innerHTML=(res.reason==='rate_limited'?'短時間內送出次數過多，請稍候幾分鐘再試。':'傳送時發生問題，你填寫的內容都已保留，請稍後再試一次。')+' 也可以加 LINE 或寄信至 <a href="mailto:'+EMAIL+'">'+EMAIL+'</a>。';fail.hidden=false;
      })
      .catch(function(){fail.textContent='網路連線似乎中斷了。你填寫的內容都已保留，請確認連線後重新送出，或直接加 LINE 找我們。';fail.hidden=false;})
      .then(function(){submit.disabled=false;submit.textContent='送出';});
  });
  document.getElementById('cm-again').addEventListener('click',function(){form.reset();note.textContent='';if(TARGET)F.organization.value=TARGET;syncKind();document.getElementById('cm-all').textContent='全部都想了解';submitted=false;show({});startedAt=Date.now();done.hidden=true;body.hidden=false;form.querySelector('input[name=inquiryType]:checked').focus();});
})();
</script>`

  return { css, markup, script }
}
