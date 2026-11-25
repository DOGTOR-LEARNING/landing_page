// 匯出 /platform 頁面上每個小模組的示意畫面（手機、後台）HTML 與頁面 CSS，給影片「活的」重建使用
import { chromium } from 'playwright';
import fs from 'node:fs';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, colorScheme: 'light' });
await p.goto(process.env.BASE || 'http://localhost:3000/platform', { waitUntil: 'networkidle' });
const data = await p.evaluate(() => {
  const css = [...document.querySelectorAll('head style')].map((s) => s.textContent).filter((t) => !t.includes('#narrow-gate')).join('\n');
  const subs = {};
  document.querySelectorAll('section.pillar').forEach((sec) => {
    const c = [...sec.classList].find((x) => /^c\d$/.test(x));
    sec.querySelectorAll('.subf').forEach((sf) => {
      subs[sf.id] = { pillar: sec.id, c, title: sf.querySelector('.sf-top h4')?.innerText,
        figs: [...sf.querySelectorAll('figure.shot')].map((f) => ({ cls: f.className, w: Math.round(f.getBoundingClientRect().width), h: Math.round(f.getBoundingClientRect().height), html: f.outerHTML })) };
    });
  });
  return { css, subs };
});
fs.writeFileSync('public/platform.css', data.css);
fs.writeFileSync('src/data/figs.json', JSON.stringify(data.subs));
// 給人讀的版本
let txt = '';
for (const [id, s] of Object.entries(data.subs)) {
  txt += `\n\n######## ${id} (${s.pillar} ${s.c}) ${s.title}\n`;
  s.figs.forEach((f, i) => { txt += `\n--- fig ${i} [${f.cls}] ${f.w}x${f.h}\n` + f.html.replace(/></g, '>\n<') + '\n'; });
}
fs.writeFileSync('out/figs-readable.html', txt);
console.log(Object.keys(data.subs).length, 'subs', data.css.length, 'css chars', txt.split('\n').length, 'lines');
await b.close();
