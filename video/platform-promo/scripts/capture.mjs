// 從本機 /platform 頁面截取影片素材：每個「場景」把頁面上的一段內容複製到獨立舞台，
// 用 2x 解析度截圖，並記錄舞台內各元素的座標（CSS px，以舞台左上為原點）。
// 用法：node scripts/capture.mjs [只重拍的場景名...]
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE || 'http://localhost:3000/platform';
const OUT = path.resolve('public/tex');
fs.mkdirSync(OUT, { recursive: true });
const only = process.argv.slice(2);

const PILLARS = [
  { id: 'ai', c: 'c1' }, { id: 'source', c: 'c2' }, { id: 'crm', c: 'c3' },
  { id: 'family', c: 'c4' }, { id: 'daily', c: 'c5' }, { id: 'manage', c: 'c6' },
];

// 場景定義：src 為要複製的元素，wrap 為舞台外層 class（決定配色變數），
// width 為內容寬度（與頁面上相同，排版才會一致）。
const scenes = [];
const sec = (name, src, width = 1240, pad = 56) => scenes.push({ name, src, wrap: '', width, pad, bg: 'var(--paper)' });
sec('hero', '#home');
sec('why', '#why');
sec('overview', '#overview');
sec('modules', '#modules');
for (const p of PILLARS) {
  scenes.push({ name: `head-${p.id}`, src: `#${p.id}`, head: true, wrap: `pillar ${p.c}`, width: 1176, pad: 0 });
  scenes.push({ name: `flow-${p.id}`, src: '#overview .flow2-wrap', extra: '#overview .legend2', wrap: p.c, width: 1240, pad: 56, bg: 'color-mix(in srgb,var(--ps) 55%,var(--paper))', flowOf: p.c });
}
for (const p of PILLARS) scenes.push({ subsOf: p });
sec('security', '#security');
sec('onboarding', '#onboarding');
sec('pricing', '#pricing');
sec('contact', '#contact');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2, colorScheme: 'light' });
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.addStyleTag({ content: `
  #narrow-gate,.topbar,header,.sidebar,.scrim{display:none!important}
  *{animation:none!important;transition:none!important;caret-color:transparent}
  .caret{display:inline-block!important;opacity:1!important}
  body.vcap>*:not(#vstage){display:none!important}
  body.vcap{margin:0;background:transparent}
  #vstage{position:relative;box-sizing:border-box}
  #vstage.hide-reveal [data-rv]{visibility:hidden!important}
  #vstage.dim .hc:not(.keep),#vstage.dim .fst:not(.keep),#vstage.dim .pband,#vstage.dim .fper,#vstage.dim .lg2:not(.keep),#vstage.dim .legend2>span{opacity:.22;filter:grayscale(1)}
`});
await page.waitForTimeout(600);

// 在頁面中建立舞台並回傳座標
async function build(sc) {
  return page.evaluate((sc) => {
    document.getElementById('vstage')?.remove();
    document.body.classList.add('vcap');
    const st = document.createElement('div');
    st.id = 'vstage';
    st.className = sc.wrap || '';
    st.style.cssText = `width:${sc.width + sc.pad * 2}px;padding:${sc.pad}px;margin:0;background:${sc.bg || ''};`;
    if (sc.wrap.startsWith('pillar')) st.style.cssText += 'border-radius:0;box-shadow:none;margin:0;';
    const src = document.querySelector(sc.src);
    const clone = src.cloneNode(true);
    clone.removeAttribute('id');
    clone.style.margin = '0';
    if (sc.head) {
      // 大模組封面：只留橫幅、包含功能、以前/用了平台
      clone.querySelectorAll('.subf').forEach((n) => n.remove());
      clone.style.borderRadius = '24px';
      clone.style.width = sc.width + 'px';
      clone.style.boxSizing = 'border-box';
      clone.style.paddingBottom = '36px';
    }
    if (sc.subf) { clone.style.width = sc.width + 'px'; clone.style.boxSizing = 'border-box'; }
    st.appendChild(clone);
    if (sc.extra) { const ex = document.querySelector(sc.extra).cloneNode(true); ex.style.marginTop = '28px'; st.appendChild(ex); }
    document.body.appendChild(st);
    // 拿掉 hero 的 min-height 之類讓舞台變大的設定
    if (sc.name === 'hero') { clone.style.minHeight = '0'; }

    const base = st.getBoundingClientRect();
    const R = (el) => { const b = el.getBoundingClientRect(); return [Math.round(b.left - base.left), Math.round(b.top - base.top), Math.round(b.width), Math.round(b.height)]; };
    const txt = (el) => (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 50);

    // 逐一出現的元素：手機對話、流程圖功能、改變卡片…
    let rv = [];
    const mark = (sel) => st.querySelectorAll(sel).forEach((el) => { el.setAttribute('data-rv', rv.length); rv.push(el); });
    mark('.ph-body > *');
    if (sc.name === 'overview') mark('.hc');
    if (sc.name === 'why') mark('.claim, .simc');
    if (sc.name === 'security') mark('.scard');
    if (sc.name === 'onboarding') mark('.tl3');
    if (sc.name === 'pricing') mark('.pcard');
    if (sc.name === 'modules') mark('.mcard');

    if (sc.flowOf) {
      st.querySelectorAll('.hc.' + sc.flowOf).forEach((el) => { el.classList.add('keep'); el.closest('.fcol').querySelector('.fst').classList.add('keep'); });
      st.querySelectorAll('.lg2.' + sc.flowOf).forEach((el) => el.classList.add('keep'));
    }

    const q = (sel) => [...st.querySelectorAll(sel)].map((el) => ({ r: R(el), t: txt(el), c: el.className }));
    const figs = [...st.querySelectorAll('figure.shot')].map((f) => {
      const ph = f.querySelector('.phone');
      return {
        r: R(f), kind: f.className.replace('shot', '').trim(), cap: txt(f.querySelector('figcaption') || f),
        phone: ph ? R(ph) : null,
        rv: [...f.querySelectorAll('[data-rv]')].map((el) => +el.getAttribute('data-rv')),
        // 鼠標候選：按鈕、選取中、強調、警示…
        hot: [...f.querySelectorAll('.btn:not(.ghost), .btn-p, .on, .hl, .new, .typing, .tag.warn, .tgl, .chip.on, .msg.p:last-of-type, .card.on, .act, .sel, .badge, .pri, mark, .lk, .qr')]
          .filter((el) => el.getBoundingClientRect().width > 6).slice(0, 12).map((el) => ({ r: R(el), t: txt(el), c: el.className, tag: el.tagName })),
      };
    });
    return {
      size: [Math.round(base.width), Math.round(base.height)],
      rv: rv.map((el) => R(el)),
      figs,
      top: q('.sf-top, .sf-desc, .tiles, .pl-banner, .inc-row, .ba2, .sec-h, .h-text, .h-vis, .claims, .sim, .flow2, .legend2, .mbase, .madd, .sec6, .tline, .price3, .cta-band, .ct-band'),
      hc: q('.hc'), fst: q('.fst'), lg2: q('.lg2'), inc: q('.inc2'), mcard: q('.mcard, .mbase'), btn: q('.btn-p, .btn-s'),
    };
  }, sc);
}

async function shoot(sc, layout) {
  const el = await page.$('#vstage');
  const file = (suf) => path.join(OUT, `${sc.name}${suf}.png`);
  await el.screenshot({ path: file(''), animations: 'disabled' });
  if (layout.rv.length) {
    await page.evaluate(() => document.getElementById('vstage').classList.add('hide-reveal'));
    await el.screenshot({ path: file('-base'), animations: 'disabled' });
    await page.evaluate(() => document.getElementById('vstage').classList.remove('hide-reveal'));
  }
  if (sc.flowOf) {
    await page.evaluate(() => document.getElementById('vstage').classList.add('dim'));
    await el.screenshot({ path: file('-dim'), animations: 'disabled' });
  }
}

const layoutPath = path.join(OUT, 'layout.json');
const all = fs.existsSync(layoutPath) ? JSON.parse(fs.readFileSync(layoutPath, 'utf8')) : {};
for (const sc0 of scenes) {
  const list = sc0.subsOf
    ? (await page.$$eval(`#${sc0.subsOf.id} .subf`, (els) => els.map((e) => e.id))).map((id) => ({
      name: `sub-${id}`, src: `#${id}`, subf: true, wrap: `pillar ${sc0.subsOf.c}`, width: 1120, pad: 64, pillar: sc0.subsOf.id,
    }))
    : [sc0];
  for (const sc of list) {
    if (only.length && !only.includes(sc.name)) continue;
    const layout = await build(sc);
    await shoot(sc, layout);
    all[sc.name] = { ...layout, pillar: sc.pillar || null };
    console.log(sc.name, layout.size.join('x'), 'figs', layout.figs.length, 'rv', layout.rv.length);
  }
}
fs.writeFileSync(layoutPath, JSON.stringify(all, null, 1));
await browser.close();
