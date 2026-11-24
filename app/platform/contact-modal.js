// 「聯絡我們」彈窗：左邊是超棒軟體官網同一份洽詢表單（送到 /api/platform-contact 寄 email），
// 右邊是其他聯絡方式。頁面上任何帶 data-contact 的按鈕都會打開它。

// LINE 與 IG 填了才會顯示按鈕；url 為 null 時整列不出現。
export const PLATFORM_CONTACT = {
  email: 'hello@superb-tutor.com',
  phone: { display: '0963-779-263', href: '+886963779263' },
  line: null, // 例：{ label: '@superb', url: 'https://lin.ee/xxxx' }
  instagram: null, // 例：{ label: '@superb.software', url: 'https://www.instagram.com/superb.software' }
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
  globe: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
}

function channel(kind, href, title, sub, external) {
  const ext = external ? ' target="_blank" rel="noopener noreferrer"' : ''
  return `<a class="cm-ch cm-${kind}" href="${esc(href)}"${ext} data-channel="${kind}"><span class="cm-ic">${ICONS[kind === 'site' ? 'globe' : kind]}</span><span class="cm-ct"><b>${esc(title)}</b><span>${esc(sub)}</span></span><span class="cm-go">›</span></a>`
}

export function contactModal(target) {
  const c = PLATFORM_CONTACT
  const channels = [
    c.line ? channel('line', c.line.url, 'LINE', c.line.label, true) : '',
    channel('mail', `mailto:${c.email}`, 'Email', c.email, false),
    c.instagram ? channel('ig', c.instagram.url, 'Instagram', c.instagram.label, true) : '',
    channel('phone', `tel:${c.phone.href}`, '電話', c.phone.display, false),
  ].join('')

  const css = `<style>
.cm-wrap{position:fixed;inset:0;z-index:100;display:none;align-items:center;justify-content:center;padding:24px;background:rgba(10,22,26,.55);backdrop-filter:blur(3px)}
.cm-wrap.open{display:flex}
.cm-dlg [hidden]{display:none!important}
.cm-dlg{width:min(980px,100%);max-height:calc(100vh - 48px);overflow:hidden;background:var(--card);color:var(--ink);border-radius:20px;box-shadow:0 24px 60px rgba(0,0,0,.25);display:grid;grid-template-columns:1.45fr 1fr;position:relative}
.cm-x{position:absolute;top:14px;right:14px;width:36px;height:36px;border-radius:50%;border:0;background:rgba(255,255,255,.18);color:#fff;font-size:20px;line-height:1;cursor:pointer;z-index:2}
.cm-x:hover{background:rgba(255,255,255,.3)}
.cm-x:focus-visible,.cm-dlg button:focus-visible,.cm-dlg a:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
.cm-l{padding:30px 34px;overflow-y:auto;max-height:calc(100vh - 48px);box-sizing:border-box}
.cm-l h2{font-family:var(--display);font-size:26px;margin:0}
.cm-sub{color:var(--muted);font-size:15px;margin:6px 0 18px}
.cm-f{display:flex;flex-direction:column;gap:12px}
.cm-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.cm-fld{display:flex;flex-direction:column;gap:5px}
.cm-fld>label,.cm-lg{font-size:14px;font-weight:700}
.cm-req{margin-left:6px;font-size:12px;font-weight:600;color:var(--accent)}
.cm-opt{margin-left:6px;font-size:12px;font-weight:500;color:var(--muted)}
.cm-dlg input[type=text],.cm-dlg input[type=email],.cm-dlg textarea{font:inherit;font-size:15px;color:var(--ink);background:var(--card);border:1.5px solid var(--rule);border-radius:10px;padding:10px 12px;width:100%;box-sizing:border-box}
.cm-dlg input:focus,.cm-dlg textarea:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 4px color-mix(in srgb,var(--accent) 18%,transparent)}
.cm-dlg textarea{min-height:104px;resize:vertical}
.cm-dlg .bad input,.cm-dlg .bad textarea{border-color:#c23b3b}
.cm-err{font-size:13px;color:#c23b3b;min-height:0}
.cm-types{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.cm-types label{display:flex;align-items:center;gap:8px;border:1.5px solid var(--rule);border-radius:10px;padding:8px 12px;cursor:pointer;font-size:14.5px}
.cm-types label:has(input:checked){border-color:var(--accent);background:var(--accent-soft);color:var(--accent);font-weight:700}
.cm-types input{accent-color:var(--accent);margin:0}
.cm-cnt{font-size:12px;color:var(--muted);text-align:right}
.cm-cs{display:flex;gap:10px;align-items:flex-start;font-size:14px;cursor:pointer}
.cm-cs input{margin-top:3px;width:18px;height:18px;accent-color:var(--accent);flex:none}
.cm-cs a{color:var(--accent);font-weight:700}
.cm-hp{position:absolute;left:-9999px;width:0;height:0;overflow:hidden}
.cm-sb{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.cm-btn{font:inherit;font-weight:700;font-size:16px;background:#2769a9;color:#fff;border:0;border-radius:999px;padding:12px 28px;cursor:pointer}
.cm-btn[disabled]{opacity:.6;cursor:wait}
.cm-fail{background:#fbe7e7;color:#8c2a2a;border-radius:10px;padding:10px 14px;font-size:14px}
.cm-fail a{color:inherit;font-weight:700}
.cm-done{display:flex;flex-direction:column;align-items:flex-start;gap:10px;padding:24px 0}
.cm-done h3{font-size:22px;margin:0}
.cm-done p{color:var(--muted);margin:0;font-size:15px}
.cm-r{background:#2769a9;color:#fff;padding:34px 30px;display:flex;flex-direction:column;gap:14px;overflow-y:auto;max-height:calc(100vh - 48px);box-sizing:border-box}
.cm-r h3{font-size:20px;margin:0}
.cm-r>p{font-size:15px;line-height:1.7;color:rgba(255,255,255,.9);margin:0}
.cm-chs{display:flex;flex-direction:column;gap:8px;margin-top:4px}
.cm-ch{display:flex;align-items:center;gap:12px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.22);border-radius:12px;padding:10px 12px;color:#fff;text-decoration:none}
.cm-ch:hover{background:rgba(255,255,255,.2)}
.cm-ic{width:36px;height:36px;border-radius:10px;background:#fff;color:#2769a9;display:grid;place-items:center;flex:none}
.cm-ic svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.cm-line .cm-ic{background:#06c755;color:#fff}
.cm-ct{display:flex;flex-direction:column;flex:1;min-width:0;line-height:1.35}
.cm-ct b{font-size:14px}.cm-ct span{font-size:13px;color:rgba(255,255,255,.85);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cm-go{font-size:20px;opacity:.7}
.cm-co{margin-top:auto;padding-top:14px;border-top:1px solid rgba(255,255,255,.22);font-size:13px;color:rgba(255,255,255,.85);display:flex;flex-direction:column;gap:2px}
.cm-co a{color:#fff;font-weight:700}
body.cm-lock{overflow:hidden}
</style>`

  const org = target ? esc(target) : ''
  const markup = `<div class="cm-wrap" id="cm-wrap" aria-hidden="true">
<div class="cm-dlg" role="dialog" aria-modal="true" aria-labelledby="cm-title">
<button type="button" class="cm-x" id="cm-x" aria-label="關閉">×</button>
<div class="cm-l">
<div id="cm-body">
<h2 id="cm-title">跟我們聊聊</h2>
<p class="cm-sub">想了解哪些模組適合你、費用怎麼算，或任何其他想做的事，都可以直接寫下來。</p>
<form class="cm-f" id="cm-form" novalidate>
<div class="cm-row">
<div class="cm-fld" data-f="name"><label for="cm-name">姓名／稱呼<span class="cm-req">必填</span></label><input type="text" id="cm-name" name="name" autocomplete="name" placeholder="怎麼稱呼你？" maxlength="80"><div class="cm-err" id="cm-name-err"></div></div>
<div class="cm-fld" data-f="email"><label for="cm-email">Email<span class="cm-req">必填</span></label><input type="email" id="cm-email" name="email" autocomplete="email" inputmode="email" placeholder="name@example.com"><div class="cm-err" id="cm-email-err"></div></div>
</div>
<div class="cm-fld" data-f="organization"><label for="cm-org">補習班／單位<span class="cm-opt">選填</span></label><input type="text" id="cm-org" name="organization" autocomplete="organization" placeholder="補習班或公司名稱" value="${org}" maxlength="120"><div class="cm-err" id="cm-organization-err"></div></div>
<fieldset class="cm-fld" data-f="inquiryType" style="border:0;padding:0;margin:0"><legend class="cm-lg">洽詢類型<span class="cm-req">必填</span></legend>
<div class="cm-types"><label><input type="radio" name="inquiryType" value="education" checked>教育機構合作</label><label><input type="radio" name="inquiryType" value="product">產品／技術合作</label><label><input type="radio" name="inquiryType" value="media">媒體／活動邀請</label><label><input type="radio" name="inquiryType" value="other">其他</label></div><div class="cm-err" id="cm-inquiryType-err"></div></fieldset>
<div class="cm-fld" data-f="message"><label for="cm-msg">訊息內容<span class="cm-req">必填</span></label><textarea id="cm-msg" name="message" maxlength="3000" placeholder="例如：我們有兩間分校，想先了解 AI 客服和點名通知；或是任何其他想做的系統，也都可以聊。"></textarea><div class="cm-cnt"><span id="cm-cnt">0</span> / 3000 字</div><div class="cm-err" id="cm-message-err"></div></div>
<div class="cm-hp" aria-hidden="true"><label for="cm-website">請勿填寫此欄位</label><input id="cm-website" name="website" tabindex="-1" autocomplete="off"></div>
<div class="cm-fld" data-f="consent"><label class="cm-cs"><input type="checkbox" id="cm-consent" name="consent"><span>我已閱讀並同意<a href="${esc(PLATFORM_CONTACT.privacy)}" target="_blank" rel="noopener noreferrer">隱私權政策</a>，同意超棒軟體使用上述資料回覆此次洽詢。<span class="cm-req">必填</span></span></label><div class="cm-err" id="cm-consent-err"></div></div>
<div class="cm-fail" id="cm-fail" role="alert" hidden></div>
<div class="cm-sb"><button type="submit" class="cm-btn" id="cm-submit">送出訊息</button></div>
</form>
</div>
<div class="cm-done" id="cm-done" hidden tabindex="-1"><h3>訊息已成功送出！</h3><p>感謝你的來信，我們會在確認內容後儘快回覆。</p><button type="button" class="cm-btn" id="cm-again">再寄一則訊息</button></div>
</div>
<aside class="cm-r">
<h3>其他聯絡方式</h3>
<p>任何時間都可以找我們。不只是這個平台，補習班或教育上任何想做的事，都歡迎跟我們說。</p>
<div class="cm-chs">${channels}</div>
<div class="cm-co"><b>${esc(c.company)}</b><span>SuperB Software Technology Co., Ltd.</span><a href="${esc(c.site)}" target="_blank" rel="noopener noreferrer">前往超棒軟體官網 ›</a></div>
</aside>
</div>
</div>`

  const script = `<script>
(function(){
  var wrap=document.getElementById('cm-wrap');if(!wrap)return;
  var form=document.getElementById('cm-form'),body=document.getElementById('cm-body'),done=document.getElementById('cm-done');
  var fail=document.getElementById('cm-fail'),submit=document.getElementById('cm-submit'),msg=document.getElementById('cm-msg'),cnt=document.getElementById('cm-cnt');
  var TARGET=${JSON.stringify(target || '').replace(/</g, '\\u003c')},EMAIL=${JSON.stringify(PLATFORM_CONTACT.email)};
  var ERR={nameRequired:'請填寫姓名或稱呼。',nameTooLong:'姓名請在 80 字以內。',emailRequired:'請填寫 Email。',emailInvalid:'Email 格式似乎不正確，請確認後再試一次。',organizationTooLong:'單位名稱請在 120 字以內。',typeRequired:'請選擇洽詢類型。',messageRequired:'請填寫訊息內容。',messageTooShort:'訊息內容請至少 10 個字，讓我們更了解你的需求。',messageTooLong:'訊息內容請在 3000 字以內。',consentRequired:'請勾選同意隱私權政策，我們才能回覆你的洽詢。'};
  var F=form.elements,startedAt=0,lastFocus=null,submitted=false;
  function track(e,p){try{if(window.posthog&&posthog.capture)posthog.capture(e,p||{});}catch(x){}}
  function open(src){lastFocus=document.activeElement;wrap.classList.add('open');wrap.setAttribute('aria-hidden','false');document.body.classList.add('cm-lock');if(!startedAt)startedAt=Date.now();setTimeout(function(){(done.hidden?document.getElementById('cm-name'):done).focus();},30);track('web_platform_contact_open',{placement:src||'unknown'});}
  function close(){wrap.classList.remove('open');wrap.setAttribute('aria-hidden','true');document.body.classList.remove('cm-lock');if(lastFocus&&lastFocus.focus)lastFocus.focus();}
  document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-contact]');if(t){e.preventDefault();open(t.getAttribute('data-contact'));}});
  document.getElementById('cm-x').addEventListener('click',close);
  wrap.addEventListener('mousedown',function(e){if(e.target===wrap)close();});
  document.addEventListener('keydown',function(e){
    if(!wrap.classList.contains('open'))return;
    if(e.key==='Escape'){close();return;}
    if(e.key==='Tab'){var f=[].slice.call(wrap.querySelectorAll('a[href],button:not([disabled]),input:not([tabindex="-1"]),textarea')).filter(function(el){return el.offsetParent!==null;});if(!f.length)return;var a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus();}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();}}
  });
  wrap.querySelectorAll('.cm-ch').forEach(function(a){a.addEventListener('click',function(){track('web_platform_contact_channel',{channel:a.getAttribute('data-channel')});});});
  msg.addEventListener('input',function(){cnt.textContent=msg.value.length;});
  function values(){var t=form.querySelector('input[name=inquiryType]:checked');return{name:F.name.value.trim(),email:F.email.value.trim(),organization:F.organization.value.trim(),inquiryType:t?t.value:'',message:F.message.value.trim(),consent:F.consent.checked};}
  function validate(v){var e={};if(!v.name)e.name='nameRequired';else if(v.name.length>80)e.name='nameTooLong';if(!v.email)e.email='emailRequired';else if(!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v.email))e.email='emailInvalid';if(v.organization.length>120)e.organization='organizationTooLong';if(!v.inquiryType)e.inquiryType='typeRequired';if(!v.message)e.message='messageRequired';else if(v.message.length<10)e.message='messageTooShort';else if(v.message.length>3000)e.message='messageTooLong';if(!v.consent)e.consent='consentRequired';return e;}
  function show(errs){['name','email','organization','inquiryType','message','consent'].forEach(function(f){var box=form.querySelector('[data-f='+f+']'),el=document.getElementById('cm-'+f+'-err');el.textContent=errs[f]?ERR[errs[f]]||'':'';box.classList.toggle('bad',!!errs[f]);});}
  form.addEventListener('input',function(){if(submitted)show(validate(values()));});
  form.addEventListener('change',function(){if(submitted)show(validate(values()));});
  form.addEventListener('submit',function(e){
    e.preventDefault();if(submit.disabled)return;submitted=true;fail.hidden=true;
    var v=values(),errs=validate(v);show(errs);
    var first=Object.keys(errs)[0];if(first){var el=form.querySelector('[data-f='+first+'] input,[data-f='+first+'] textarea');if(el)el.focus();return;}
    submit.disabled=true;submit.textContent='送出中…';
    v.website=document.getElementById('cm-website').value;v.startedAt=startedAt;v.target=TARGET;
    fetch('/api/platform-contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(v)})
      .then(function(r){return r.json().catch(function(){return{ok:false,reason:'server'};});})
      .then(function(res){
        if(res.ok){track('web_platform_contact_submit_success',{type:v.inquiryType});body.hidden=true;done.hidden=false;done.focus();return;}
        if(res.reason==='validation'&&res.fieldErrors){show(res.fieldErrors);return;}
        fail.innerHTML=(res.reason==='rate_limited'?'短時間內送出次數過多，請稍候幾分鐘再試。':'傳送時發生問題，你填寫的內容都已保留，請稍後再試一次。')+' 也可以直接寄信至 <a href="mailto:'+EMAIL+'">'+EMAIL+'</a>。';fail.hidden=false;
      })
      .catch(function(){fail.innerHTML='網路連線似乎中斷了。你填寫的內容都已保留，請確認連線後重新送出，或直接寄信至 <a href="mailto:'+EMAIL+'">'+EMAIL+'</a>。';fail.hidden=false;})
      .then(function(){submit.disabled=false;submit.textContent='送出訊息';});
  });
  document.getElementById('cm-again').addEventListener('click',function(){form.reset();if(TARGET)F.organization.value=TARGET;cnt.textContent='0';submitted=false;show({});startedAt=Date.now();done.hidden=true;body.hidden=false;document.getElementById('cm-name').focus();});
})();
</script>`

  return { css, markup, script }
}
