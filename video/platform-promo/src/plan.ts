// 時間軸：完全依照 SCRIPT.md 的分段與秒數
import { SEGMENTS } from './demo/shots';
import type { Shot } from './demo/engine';
import { PAPER, PILLARS } from './data/story';

export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const XF = 10; // 下一段淡入的影格數（疊在上一段結尾之後）

export type Scene = { key: string; kind: 'open' | 'cover' | 'demo' | 'end'; from: number; dur: number; bg: string; p?: number; shot?: Shot };
export const scenes: Scene[] = [];
let t = 0;
const add = (s: Omit<Scene, 'from'>) => { scenes.push({ ...s, from: t }); t += s.dur; };

add({ key: 'open', kind: 'open', dur: 150, bg: PAPER });
SEGMENTS.forEach((seg, n) => {
  if (n === 0 || SEGMENTS[n - 1].pillar !== seg.pillar) add({ key: `cover-${seg.pillar}`, kind: 'cover', p: seg.pillar, dur: 150, bg: PILLARS[seg.pillar].bg });
  add({ key: `seg-${n + 1}`, kind: 'demo', p: seg.pillar, shot: seg.shot, dur: seg.shot.dur, bg: PILLARS[seg.pillar].bg });
});
add({ key: 'end', kind: 'end', dur: 210, bg: PAPER });

export const TOTAL = t;
