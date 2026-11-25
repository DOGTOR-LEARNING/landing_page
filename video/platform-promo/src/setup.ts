// 載入 /platform 頁面的 CSS 與字型（Noto Sans TC／Noto Serif TC），全部就緒才開始渲染
import { continueRender, delayRender, staticFile } from 'remotion';
import FIGS from './data/figs.json';
import { STORY_TEXT } from './data/story';

const OVERRIDE = `
*{animation:none!important;transition:none!important}
.demo-stage figcaption{display:flex!important;margin:0}
.demo-stage .shot{flex:none!important;margin:0!important;max-width:none!important;min-width:0!important}
.demo-caret{display:inline-block;width:2px;height:1.05em;background:currentColor;vertical-align:-2px;margin-left:1px}
`;

if (typeof document !== 'undefined' && !document.getElementById('platform-css')) {
  const h = delayRender('platform css + fonts');
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@700&display=block';
  document.head.appendChild(link);
  const st = document.createElement('style');
  st.id = 'platform-css';
  document.head.appendChild(st);
  const linkLoaded = new Promise<void>((res) => { link.onload = () => res(); link.onerror = () => res(); });
  fetch(staticFile('platform.css'))
    .then((r) => r.text())
    .then(async (css) => {
      st.textContent = css + OVERRIDE;
      await linkLoaded;
      // 把畫面上會出現的所有字都先載入（Google Fonts 依字元分段下載）
      const div = document.createElement('div');
      div.innerHTML = Object.values(FIGS as Record<string, { figs: { html: string }[] }>).flatMap((s) => s.figs.map((f) => f.html)).join('');
      const text = Array.from(new Set(((div.textContent || '') + STORY_TEXT).split(''))).join('') + '0123456789:✓✎→↑↓';
      await Promise.all([
        document.fonts.load('400 16px "Noto Sans TC"', text),
        document.fonts.load('500 16px "Noto Sans TC"', text),
        document.fonts.load('700 16px "Noto Sans TC"', text),
        document.fonts.load('700 16px "Noto Serif TC"', text),
      ]).catch(() => undefined);
      await document.fonts.ready;
      continueRender(h);
    })
    .catch(() => continueRender(h));
}
