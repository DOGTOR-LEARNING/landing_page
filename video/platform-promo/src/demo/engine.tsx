// 「活的」示意畫面：把 /platform 頁面上的手機與後台 HTML 放進影片，每一格從原始 HTML 重建，
// 再套用到這一格為止的所有操作（確定性，任何一格都能單獨渲染）。
// 版面：每段由數個「畫面」組成（後台、手機），依 views 切換顯示哪幾個；畫面停住時位置與縮放完全固定。
import React, { useLayoutEffect, useRef } from 'react';
import { continueRender, delayRender, Easing } from 'remotion';
import FIGS from '../data/figs.json';

export type Op = {
  at: number; f?: number; sel: string; i?: number | number[];
  do: 'show' | 'hide' | 'type' | 'add' | 'rm' | 'text' | 'html' | 'append' | 'move' | 'press' | 'count' | 'grow' | 'css' | 'hl' | 'gone';
  v?: string; dur?: number; from?: number; excl?: string; prop?: 'width' | 'height';
};
// 滑鼠（只用在後台）：依序移到元素並點擊；間隔 70 格以上視為另一段操作（中間會淡出）
export type Cur = { at: number; f?: number; sel: string; i?: number; click?: boolean; ax?: number; ay?: number };
// 手指點擊（只用在手機）
export type Tap = { at: number; f: number; sel: string; i?: number };
export type View = { at: number; show: number[]; focus?: number };
export type Shot = { figs: [string, number][]; dur: number; views: View[]; ops: Op[]; cur?: Cur[]; taps?: Tap[]; max?: number };

type FigData = { cls: string; w: number; h: number; html: string };
const DATA = FIGS as unknown as Record<string, { c: string; figs: FigData[] }>;

export const W = 1920, H = 1080;
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const outBack = Easing.bezier(0.34, 1.4, 0.64, 1);
const outCubic = Easing.out(Easing.cubic);
const moveEase = Easing.bezier(0.45, 0, 0.2, 1);
const travelEase = Easing.bezier(0.4, 0, 0.2, 1);
const VIEW_T = 16; // 版面切換的影格數
const GROUP = 70;

const pick = (root: Element, sel: string, i?: number | number[]) => {
  const all = Array.from(root.querySelectorAll<HTMLElement>(sel));
  if (i === undefined) return all;
  return (Array.isArray(i) ? i : [i]).map((k) => all[k < 0 ? all.length + k : k]).filter(Boolean);
};

function textNodes(el: Element, excl?: string): Text[] {
  const out: Text[] = [];
  const walk = (n: Node) => {
    if (n.nodeType === 3) { out.push(n as Text); return; }
    if (n.nodeType === 1 && excl && (n as Element).matches(excl)) return;
    n.childNodes.forEach(walk);
  };
  walk(el);
  return out;
}

function fmtLike(sample: string, v: number) {
  const dec = (sample.split('.')[1] || '').length;
  const s = v.toFixed(dec);
  return sample.includes(',') ? Number(s).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) : s;
}
const hex2 = (a: number) => Math.round(clamp01(a) * 255).toString(16).padStart(2, '0');

function apply(root: HTMLElement, op: Op, f: number, color: string) {
  const els = pick(root, op.sel, op.i);
  const t = (d: number) => clamp01((f - op.at) / d);
  for (const el of els) {
    switch (op.do) {
      case 'show': {
        if (f < op.at) { el.style.visibility = 'hidden'; break; }
        const k = t(10);
        if (k < 1) {
          el.style.opacity = String(Math.min(1, k * 1.6));
          el.style.transform = `translateY(${Math.round((1 - outBack(k)) * 10)}px)`;
        }
        break;
      }
      case 'gone': if (f >= op.at) el.style.display = 'none'; break;
      case 'hide': if (f >= op.at) { const k = t(6); if (k >= 1) el.style.visibility = 'hidden'; else el.style.opacity = String(1 - k); } break;
      case 'type': {
        if (op.v !== undefined && f >= op.at) el.textContent = op.v;
        const nodes = textNodes(el, op.excl);
        const full = nodes.map((n) => n.data);
        const L = full.reduce((a, s) => a + s.length, 0);
        const dur = op.dur ?? Math.max(10, L * 1.2);
        if (f < op.at && op.v !== undefined) break; // 打字前保留原本內容（例如輸入框的提示字）
        let n = f < op.at ? 0 : Math.floor(L * t(dur));
        let caretAt: Text | null = null;
        nodes.forEach((nd, k) => { const take = Math.max(0, Math.min(full[k].length, n)); nd.data = full[k].slice(0, take); n -= take; if (take > 0) caretAt = nd; });
        if (f >= op.at && f < op.at + dur + 6) {
          const c = document.createElement('span'); c.className = 'demo-caret';
          if (caretAt) (caretAt as Text).after(c); else el.prepend(c);
        }
        break;
      }
      case 'add': if (f >= op.at) el.classList.add(...(op.v || '').split(' ')); break;
      case 'rm': if (f >= op.at) el.classList.remove(...(op.v || '').split(' ')); break;
      case 'text': if (f >= op.at) el.textContent = op.v ?? ''; break;
      case 'html': if (f >= op.at) el.innerHTML = op.v ?? ''; break;
      case 'append': {
        const tmp = document.createElement('div'); tmp.innerHTML = op.v ?? '';
        const node = tmp.firstElementChild as HTMLElement | null;
        if (!node) break;
        el.appendChild(node);
        if (f < op.at) node.style.visibility = 'hidden';
        else if (t(10) < 1) { node.style.opacity = String(t(10)); node.style.transform = `translateY(${Math.round((1 - outBack(t(10))) * 10)}px)`; }
        break;
      }
      case 'move': {
        if (f < op.at) break;
        const target = root.querySelector(op.v ?? '');
        if (target) target.insertBefore(el, target.children[1] ?? null);
        if (t(10) < 1) { el.style.opacity = String(t(10)); el.style.transform = `translateY(${Math.round((1 - outBack(t(10))) * 14)}px)`; }
        break;
      }
      case 'css': if (f >= op.at) el.style.cssText += ';' + (op.v ?? ''); break;
      case 'press': { const d = f - op.at; if (d >= 0 && d <= 8) el.style.filter = `brightness(${d < 5 ? 0.85 : 1})`; break; }
      case 'count': {
        const tn = textNodes(el).find((n) => /\d/.test(n.data));
        if (!tn) break;
        const m = tn.data.match(/[\d,]+(\.\d+)?/);
        if (!m) break;
        const target = parseFloat(m[0].replace(/,/g, ''));
        const from = op.from ?? 0;
        const v = f < op.at ? from : from + (target - from) * outCubic(t(op.dur ?? 24));
        tn.data = tn.data.replace(m[0], fmtLike(m[0], v));
        break;
      }
      case 'grow': {
        const prop = op.prop ?? 'width';
        const orig = el.style[prop];
        const num = parseFloat(orig);
        if (isNaN(num)) break;
        const unit = orig.replace(String(num), '') || '%';
        el.style[prop] = `${f < op.at ? 0 : num * outCubic(t(op.dur ?? 20))}${unit}`;
        break;
      }
      case 'hl': {
        // 重點外框：淡入、停留、淡出（不移動、不縮放）
        const dur = op.dur ?? 50;
        const a = f < op.at ? 0 : Math.min(t(6), 1 - clamp01((f - op.at - dur) / 8));
        if (a > 0) {
          el.style.boxShadow = `0 0 0 3px ${color}${hex2(a)}, 0 0 0 8px ${color}${hex2(a * 0.18)}`;
          if (!el.style.borderRadius) el.style.borderRadius = '6px';
          el.style.position = el.style.position || 'relative';
          el.style.zIndex = '2';
        }
        break;
      }
    }
  }
}

// 依顯示的畫面算出版面：一排置中；有焦點時焦點畫面放大、其他縮小當配角
function layout(figs: FigData[], show: number[], max: number, focus?: number) {
  const gap = 72;
  const fitS = (i: number) => Math.min((H * 0.84) / figs[i].h, max);
  const hasF = focus !== undefined && show.includes(focus) && show.length > 1;
  let sc = show.map((i) => (hasF ? (i === focus ? fitS(i) : fitS(focus!) * 0.6) : fitS(i)));
  if (!hasF) { const m = Math.min(...sc); sc = sc.map(() => m); }
  const rowW = show.reduce((a, i, n) => a + figs[i].w * sc[n], 0) + gap * (show.length - 1);
  const k = Math.min(1, (W * 0.9 - gap * (show.length - 1)) / (rowW - gap * (show.length - 1)));
  sc = sc.map((v) => v * k);
  const total = show.reduce((a, i, n) => a + figs[i].w * sc[n], 0) + gap * (show.length - 1);
  let x = (W - total) / 2;
  const pos: Record<number, { x: number; y: number; s: number }> = {};
  show.forEach((i, n) => { pos[i] = { x, y: (H - figs[i].h * sc[n]) / 2 + 10, s: sc[n] }; x += figs[i].w * sc[n] + gap; });
  return pos;
}

export const DemoShot: React.FC<{ shot: Shot; f: number; color: string; c: string }> = ({ shot, f, color, c }) => {
  const figs = shot.figs.map(([sub, k]) => DATA[sub].figs[k]);
  const max = shot.max ?? 1.7;

  let vi = 0;
  shot.views.forEach((v, k) => { if (f >= v.at) vi = k; });
  const cur = shot.views[vi], prev = shot.views[vi - 1];
  const tv = prev ? moveEase(clamp01((f - cur.at) / VIEW_T)) : 1;
  const pc = layout(figs, cur.show, max, cur.focus), pp = prev ? layout(figs, prev.show, max, prev.focus) : pc;
  const place = figs.map((_, i) => {
    const a = pp[i], b = pc[i];
    const opA = a ? (prev?.focus !== undefined && prev.focus !== i ? 0.55 : 1) : 0;
    const opB = b ? (cur.focus !== undefined && cur.focus !== i ? 0.55 : 1) : 0;
    const A = a ?? (b ? { ...b, x: b.x + 90 } : undefined), B = b ?? (a ? { ...a, x: a.x - 90 } : undefined);
    if (!A || !B) return null;
    const lerp = (p: number, q: number) => p + (q - p) * tv;
    const still = tv >= 1;
    return {
      x: still ? Math.round(B.x) : lerp(A.x, B.x), y: still ? Math.round(B.y) : lerp(A.y, B.y),
      s: still ? B.s : Math.exp(lerp(Math.log(A.s), Math.log(B.s))), op: lerp(opA, opB),
    };
  });

  const stage = useRef<HTMLDivElement>(null);
  const roots = useRef<(HTMLDivElement | null)[]>([]);
  const arrow = useRef<HTMLDivElement>(null);
  const tapRef = useRef<HTMLDivElement>(null);

  const run = () => {
    roots.current.forEach((r, k) => {
      if (!r) return;
      r.innerHTML = figs[k].html;
      const cap = r.querySelector('figcaption');
      if (cap) cap.childNodes.forEach((n) => { if (n.nodeType === 3) n.textContent = ''; });
      const fig = r.querySelector<HTMLElement>('figure');
      if (fig) fig.style.width = figs[k].w + 'px';
    });
    for (const op of shot.ops) { const r = roots.current[op.f ?? 0]; if (r) apply(r, op, f, color); }

    const st = stage.current!.getBoundingClientRect();
    if (st.width === 0) return false;
    const kk = st.width / W;
    const rectOf = (fi: number, sel: string, i?: number) => {
      const r = roots.current[fi];
      const el = r ? pick(r, sel, i ?? 0)[0] : undefined;
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { x: (b.left - st.left) / kk, y: (b.top - st.top) / kk, w: b.width / kk, h: b.height / kk };
    };

    // 滑鼠
    const ws = shot.cur ?? [];
    let ax = 0, ay = 0, aop = 0, press = 1;
    if (ws.length) {
      const pt = (w: Cur): [number, number] => {
        const r = rectOf(w.f ?? 0, w.sel, w.i);
        if (!r) return [W / 2, H / 2];
        const fx = w.ax ?? (r.w > 260 ? 40 / r.w : 0.5);
        return [r.x + r.w * fx, r.y + r.h * (w.ay ?? 0.55)];
      };
      let i = ws.findIndex((w) => w.at > f);
      if (i === -1) i = ws.length;
      const a = ws[i - 1], b = ws[i];
      const newGroup = !!b && (!a || b.at - a.at >= GROUP);
      if (a && (!b || newGroup)) {
        // 一段操作結束：停在最後一點，之後淡出
        [ax, ay] = pt(a);
        aop = 1 - clamp01((f - a.at - 24) / 10);
      } else if (a && b) {
        const tr = Math.min(18, Math.max(8, b.at - a.at - 4));
        const tt = travelEase(clamp01((f - (b.at - tr)) / tr));
        const pa = pt(a), pb = pt(b);
        ax = pa[0] + (pb[0] - pa[0]) * tt; ay = pa[1] + (pb[1] - pa[1]) * tt; aop = 1;
      }
      if (newGroup && f >= b.at - 24 && (!a || f > a.at + 34)) {
        // 新一段操作：從右下方滑進來
        const p = pt(b);
        const tt = travelEase(clamp01((f - (b.at - 24)) / 24));
        ax = p[0] + 150 * (1 - tt); ay = p[1] + 200 * (1 - tt); aop = clamp01((f - (b.at - 24)) / 8);
      }
      if (a?.click) { const d = f - a.at; if (d >= 0 && d < 10) press = d < 3 ? 0.84 : 0.84 + 0.16 * clamp01((d - 3) / 6); }
    }
    if (arrow.current) Object.assign(arrow.current.style, { left: ax - 4 + 'px', top: ay - 3 + 'px', opacity: String(aop), transform: `scale(${press})` });

    // 手指點擊
    let tp = { x: 0, y: 0, a: 0, r: 0 };
    for (const tap of shot.taps ?? []) {
      const d = f - tap.at;
      if (d >= -5 && d < 20) {
        const r = rectOf(tap.f, tap.sel, tap.i);
        if (r) tp = { x: r.x + r.w / 2, y: r.y + r.h / 2, a: d < 0 ? (d + 5) / 5 : 1 - clamp01((d - 8) / 12), r: d < 0 ? 20 : 20 + 24 * outCubic(clamp01(d / 20)) };
      }
    }
    if (tapRef.current) Object.assign(tapRef.current.style, { left: tp.x - tp.r + 'px', top: tp.y - tp.r + 'px', width: tp.r * 2 + 'px', height: tp.r * 2 + 'px', opacity: String(tp.a) });
    return true;
  };

  useLayoutEffect(() => {
    if (run()) return;
    const h = delayRender('demo layout');
    let n = 0;
    const tick = () => { if (run() || ++n > 60) continueRender(h); else requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });

  return (
    <div ref={stage} className="demo-stage" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {figs.map((g, k) => {
        const p = place[k];
        return (
          <div key={k} className={`pillar ${c}`} style={{ position: 'absolute', left: 0, top: 0, width: g.w, opacity: p ? p.op : 0, visibility: p && p.op > 0.01 ? 'visible' : 'hidden',
            transform: p ? `translate(${p.x}px, ${p.y}px) scale(${p.s})` : undefined, transformOrigin: '0 0', background: 'none', padding: 0, margin: 0, boxShadow: 'none', border: 0, borderRadius: 0 }}>
            <div className="subf" style={{ background: 'none', padding: 0, margin: 0, width: g.w, borderRadius: 0 }} ref={(el) => { roots.current[k] = el; }} />
          </div>
        );
      })}
      <div ref={tapRef} style={{ position: 'absolute', borderRadius: '50%', background: 'rgba(22,37,43,.16)', border: '3px solid rgba(255,255,255,.95)', boxShadow: '0 2px 10px rgba(0,0,0,.25)', opacity: 0 }} />
      <div ref={arrow} style={{ position: 'absolute', transformOrigin: '4px 3px', opacity: 0 }}>
        <svg width="40" height="40" viewBox="0 0 28 28" style={{ overflow: 'visible', filter: 'drop-shadow(0 3px 5px rgba(0,0,0,.35))' }}>
          <path d="M3 2 L3 22 L8.2 17.4 L11.6 25.2 L15.2 23.6 L11.9 16 L19 16 Z" fill="#fff" stroke="#111" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};
