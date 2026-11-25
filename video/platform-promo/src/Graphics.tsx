// 影片專用的大模組封面與流程圖（不照搬網頁，沿用網頁的字型與色彩）
import React from 'react';
import { AbsoluteFill, Easing, interpolate } from 'remotion';
import { BANDS, INK, MUTED, PAPER, PILLARS, STAGES } from './data/story';

const SANS = '"Noto Sans TC","PingFang TC",sans-serif';
const SERIF = '"Noto Serif TC","Songti TC",serif';
const ease = Easing.bezier(0.2, 0.8, 0.2, 1);
const k = (f: number, a: number, d = 14) => ease(interpolate(f, [a, a + d], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
// 只用位移與透明度進場，停住後完全靜止（文字不會抖）
const rise = (t: number, dy = 36): React.CSSProperties => ({ opacity: t, transform: t >= 1 ? undefined : `translateY(${Math.round((1 - t) * dy)}px)` });

export const Cover: React.FC<{ p: number; f: number }> = ({ p, f }) => {
  const P = PILLARS[p];
  return (
    <AbsoluteFill style={{ background: P.pc, fontFamily: SANS, color: '#fff' }}>
      <div style={{ position: 'absolute', left: 150, top: 0, bottom: 0, width: 760, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ ...rise(k(f, 6)), fontFamily: SERIF, fontWeight: 700, fontSize: 230, lineHeight: 1 }}>{P.code}</div>
        <div style={{ ...rise(k(f, 12)), fontFamily: SERIF, fontWeight: 700, fontSize: 88, lineHeight: 1.2, marginTop: 28 }}>{P.name}</div>
      </div>
      <div style={{ position: 'absolute', left: 1000, right: 150, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
        {P.items.map((it, i) => (
          <div key={i} style={{ ...rise(k(f, 18 + i * 6), 30), background: '#fff', color: INK, borderRadius: 22, padding: '26px 34px', boxShadow: '0 18px 40px -24px rgba(0,0,0,.45)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 36, fontWeight: 700, lineHeight: 1.3 }}>
              <span style={{ background: P.pc, color: '#fff', borderRadius: 9, padding: '2px 12px', fontSize: 22, flex: 'none' }}>模組 {it.mod}</span>{it.name}
            </div>
            <div style={{ fontSize: 24, color: MUTED, marginTop: 6, lineHeight: 1.4 }}>{it.desc}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// mode: 'build' 開場逐格長出、'hi' 只亮某個大模組、'all' 全部亮起
export const Flow: React.FC<{ f: number; mode: 'build' | 'hi' | 'all'; p?: number; bg?: string }> = ({ f, mode, p = 0, bg = PAPER }) => {
  const SW = 212, GAP = 6, X0 = Math.round((1920 - (8 * SW + 7 * GAP)) / 2), Y = 360;
  const sx = (i: number) => X0 + i * (SW + GAP);
  const pc = mode === 'hi' ? PILLARS[p].pc : INK;
  return (
    <AbsoluteFill style={{ background: bg, fontFamily: SANS }}>
      {BANDS.map((b, i) => {
        const t = mode === 'build' ? k(f, 2 + i * 8) : 1;
        return (
          <div key={i} style={{ position: 'absolute', left: sx(b.from), width: sx(b.to) + SW - sx(b.from), top: Y - 86, height: 56, borderRadius: 14,
            background: 'rgba(22,37,43,.06)', color: MUTED, fontSize: 26, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: 4, opacity: t }}>{b.name}</div>
        );
      })}
      {STAGES.map((s, i) => {
        const mine = s.chips.some((c) => c.p === p);
        const appear = mode === 'build' ? k(f, 10 + i * 7) : 1;
        // 'hi'：先全部灰階，再點亮本模組負責的環節
        const lit = mode === 'all' ? 1 : mode === 'build' ? k(f, 10 + i * 7 + 6, 10) : mine ? k(f, 8, 12) : 0;
        const fill = mode === 'hi' && !mine ? '#e3e8e7' : lit > 0.5 ? (mode === 'hi' ? pc : INK) : '#fff';
        const color = mode === 'hi' && !mine ? '#9aa7aa' : lit > 0.5 ? '#fff' : INK;
        const notch = 'polygon(0 0, calc(100% - 22px) 0, 100% 50%, calc(100% - 22px) 100%, 0 100%' + (i ? ', 22px 50%)' : ')');
        return (
          <div key={i} style={{ position: 'absolute', left: sx(i), top: Y, width: SW + (i < 7 ? 14 : 0), height: 92, ...rise(appear, 24) }}>
            <div style={{ position: 'absolute', inset: 0, clipPath: notch, background: fill, transition: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 8, paddingLeft: i ? 32 : 18, color, fontSize: 25, fontWeight: 700, whiteSpace: 'nowrap' }}>
              <span style={{ width: 30, height: 30, borderRadius: 15, flex: 'none', background: lit > 0.5 && !(mode === 'hi' && !mine) ? 'rgba(255,255,255,.25)' : 'rgba(22,37,43,.08)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{i + 1}</span>
              {s.name}
            </div>
          </div>
        );
      })}
      {STAGES.map((s, i) => s.chips.map((c, j) => {
        const show = mode === 'hi' ? c.p === p : true;
        if (!show) return null;
        const row = mode === 'hi' ? s.chips.filter((x) => x.p === p).indexOf(c) : j;
        const t = mode === 'build' ? k(f, 70 + i * 5 + j * 3, 12) : mode === 'hi' ? k(f, 20 + row * 5, 14) : 1;
        const col = PILLARS[c.p].pc;
        return (
          <div key={`${i}-${j}`} style={{ position: 'absolute', left: sx(i), top: Y + 124 + row * 74, width: SW, height: 60, borderRadius: 14, background: '#fff',
            boxShadow: `inset 4px 0 0 ${col}, 0 10px 24px -18px rgba(0,0,0,.4)`, display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px 0 14px', fontSize: 19, fontWeight: 700, color: INK, ...rise(t, 18) }}>
            <span style={{ background: col, color: '#fff', borderRadius: 7, padding: '1px 6px', fontSize: 16, flex: 'none' }}>{c.code}</span>
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
          </div>
        );
      }))}
    </AbsoluteFill>
  );
};
