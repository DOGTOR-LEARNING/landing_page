import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, colorScheme: 'light' });
await p.goto('http://localhost:3000/platform', { waitUntil: 'networkidle' });
const info = await p.evaluate(() => {
  const r = (el) => { const b = el.getBoundingClientRect(); return [Math.round(b.width), Math.round(b.height)]; };
  const out = { main: r(document.querySelector('main.content')), flow: r(document.querySelector('.flow2')) };
  out.pillars = [...document.querySelectorAll('section.pillar')].map(s => ({
    id: s.id, cls: s.className, size: r(s), banner: r(s.querySelector('.pl-banner')),
    subs: [...s.querySelectorAll('.subf')].map(f => ({ id: f.id, size: r(f),
      figs: [...f.querySelectorAll('figure')].map(g => g.className + ' ' + r(g).join('x') + ' | ' + (g.querySelector('figcaption')?.innerText || '').replace(/\n/g, ' ').slice(0, 60)) }))
  }));
  return out;
});
console.log(JSON.stringify(info, null, 1));
await b.close();
