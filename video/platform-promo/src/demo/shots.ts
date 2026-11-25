// 依 SCRIPT.md 的分段：每段一個鏡頭，以補習班人員的操作為主線。
// f = 這個鏡頭中第幾個畫面（figs 的位置），at = 鏡頭內第幾格（30fps）。
import type { Cur, Op, Shot, Tap } from './engine';

const B = '.ph-body > *';
const show = (f: number, sel: string, at: number, i?: number | number[]): Op => ({ f, sel, i, do: 'show', at });
const gone = (f: number, sel: string, i?: number | number[], at = -1): Op => ({ f, sel, i, do: 'gone', at });
const type = (f: number, sel: string, at: number, dur: number, v?: string, i?: number): Op => ({ f, sel, i, do: 'type', at, dur, v });
const text = (f: number, sel: string, at: number, v: string, i?: number): Op => ({ f, sel, i, do: 'text', at, v });
const cls = (f: number, sel: string, at: number, add: string, rm?: string, i?: number): Op[] => [
  ...(rm ? [{ f, sel, i, do: 'rm', at, v: rm } as Op] : []), ...(add ? [{ f, sel, i, do: 'add', at, v: add } as Op] : [])];
const hl = (f: number, sel: string, at: number, dur = 50, i?: number): Op => ({ f, sel, i, do: 'hl', at, dur });
const press = (f: number, sel: string, at: number, i?: number): Op => ({ f, sel, i, do: 'press', at });
const count = (f: number, sel: string, at: number, i?: number, from = 0, dur = 24): Op => ({ f, sel, i, do: 'count', at, from, dur });
const seq = (f: number, sel: string, idxs: number[], start: number, step: number): Op[] => idxs.map((i, n) => show(f, sel, start + n * step, i));
// 指向（不點擊）：停在元素右下角外側，不擋住內容
const go = (f: number, sel: string, at: number, i?: number): Cur => ({ f, sel, i, at, ax: 0.97, ay: 1.08 });
const click = (f: number, sel: string, at: number, i?: number): Cur => ({ f, sel, i, at, click: true });
const tap = (f: number, sel: string, at: number, i?: number): Tap => ({ f, sel, i, at });
const range = (a: number, b: number) => Array.from({ length: b - a }, (_, k) => a + k);

// 輸入框打字再送出的組合（AI 試問、AI 問報表）
const ask = (f: number, q: string, at: number): Op[] => [type(f, '.ai-in span', at, Math.round(q.length * 1.3), q), text(f, '.ai-in span', at + Math.round(q.length * 1.3) + 8, '輸入問題試試看…')];

export const SEGMENTS: { pillar: number; shot: Shot }[] = [
  // 1. 知識庫：補寫文件 → 試問 AI → 發布
  { pillar: 0, shot: {
    figs: [['ai-service', 1]], dur: 240, views: [{ at: 0, show: [0] }],
    ops: [
      gone(0, '.kb-ai .q', 0), gone(0, '.kb-ai .a', 0), gone(0, '.kb-ai .src', [0, 1]), gone(0, '.kb-ai .btn'), gone(0, '.doc .caret'),
      hl(0, '.pg-h .tag.warn', 6, 26),
      show(0, '.doc .h.new', 44), type(0, '.doc .typing', 50, 54),
      ...ask(0, '可以只上半期嗎', 118),
      show(0, '.kb-ai .q', 138, 1),
      show(0, '.kb-ai .a', 150, 1), ...cls(0, '.kb-ai .a', 150, '', 'miss', 1), type(0, '.kb-ai .a', 150, 34, '目前不開放只上半期，第 4 週前可以插班，學費依剩餘週數計算。', 1),
      { f: 0, sel: '.kb-ai', do: 'append', at: 186, v: '<div class="src">引用：國二理化 › 半期與插班</div>' },
      hl(0, '.kb-ai .a', 188, 26, 1),
      press(0, '.pg-h .btn:not(.ghost)', 214),
      text(0, '.meta-row .tag', 218, '已發布・剛剛'), ...cls(0, '.meta-row .tag', 218, 'ok', 'warn'), text(0, '.pg-h .tag.warn', 218, '待補充問題 2'),
    ],
    cur: [go(0, '.pg-h .tag.warn', 14), click(0, '.t-c.on', 30), click(0, '.doc .typing', 46), go(0, '.doc .typing', 100), click(0, '.ai-in', 116), click(0, '.ai-in i', 136),
      go(0, '.kb-ai .a', 176, 1), click(0, '.pg-h .btn:not(.ghost)', 214)],
  } },
  // 2. AI 回覆設定
  { pillar: 0, shot: {
    figs: [['ai-service', 2]], dur: 180, views: [{ at: 0, show: [0] }],
    ops: [
      ...cls(0, '.rad', -1, '', 'on', 1), ...cls(0, '.rad', -1, 'on', '', 0), ...cls(0, '.rad', 30, '', 'on', 0), ...cls(0, '.rad', 30, 'on', '', 1),
      ...range(0, 6).map((k): Op => ({ f: 0, sel: '.wk-r .hm', i: k, do: 'grow', at: 36 + k * 3, dur: 16 })),
      ...cls(0, '.tgl', -1, '', 'on', 0), ...cls(0, '.tgl', 92, 'on', '', 0), ...seq(0, '.who3 > div', [0, 1, 2], 98, 6),
      press(0, '.pg-h .btn', 150),
    ],
    cur: [click(0, '.rad', 30, 1), go(0, '.wk', 60), click(0, '.tgl', 92, 0), go(0, '.who3', 118), click(0, '.pg-h .btn', 150)],
  } },
  // 3. 課程與方案：設定優惠 → 試問 → 沒設定的分期會轉真人
  { pillar: 0, shot: {
    figs: [['offers', 1]], dur: 240, views: [{ at: 0, show: [0] }],
    ops: [
      gone(0, '.kb2-l .pn'), gone(0, '.kb-ai .btn'),
      show(0, '.tb .tag.ok', 26, 0), hl(0, '.tb .tag.ok', 30, 30, 0),
      ...ask(0, '國二數學現在報名有優惠嗎？', 70),
      show(0, '.kb-ai .q', 108, 0),
      show(0, '.kb-ai .a', 116, 0), type(0, '.kb-ai .a', 116, 30, undefined, 0),
      show(0, '.kb-ai .src', 148), hl(0, '.kb-ai .src', 150, 22),
      ...ask(0, '學費可以分期嗎', 168),
      show(0, '.kb-ai .q', 192, 1),
      show(0, '.kb-ai .a', 202, 1), hl(0, '.kb-ai .a', 206, 30, 1),
    ],
    cur: [click(0, '.tb tr:nth-child(2) td:last-child', 22), click(0, '.ai-in', 66), click(0, '.ai-in i', 104), click(0, '.ai-in', 164), click(0, '.ai-in i', 188)],
  } },
  // 4. 收件匣：接手 → 暫停 AI → 用草稿回覆 → 爸爸手機收到
  { pillar: 0, shot: {
    figs: [['inbox', 0], ['inbox', 1]], dur: 240, views: [{ at: 0, show: [0] }, { at: 192, show: [0, 1], focus: 1 }],
    ops: [
      ...cls(0, '.ib-i', -1, '', 'on', 0), show(0, '.ib-i', 14, 0), hl(0, '.ib-i', 20, 14, 0),
      ...cls(0, '.ib-i', 38, 'on', '', 0), show(0, '.ib-chat', 40), { f: 0, sel: '.cm.s', do: 'show', at: 176 }, show(0, '.banner', 84),
      gone(0, '.pz-menu'), { f: 0, sel: '.pz-menu', do: 'css', at: 62, v: 'display:flex' }, { f: 0, sel: '.pz-menu', do: 'css', at: 82, v: 'display:none' },
      text(0, '.kv.pz .dd', -1, 'AI 回覆中 ▾'), text(0, '.kv.pz .dd', 80, '暫停至今天 18:00 ▾'),
      show(0, '.draftbox', 100), hl(0, '.draftbox', 104, 16),
      type(0, '.composer2 .ph', 126, 26, '小明爸爸您好，我是林主任，我先看了小明這學期的小考成績……'), { f: 0, sel: '.composer2 .ph', do: 'css', at: 126, v: 'color:#16252b' }, gone(0, '.draftbox', undefined, 126),
      press(0, '.composer2 .btn', 168), text(0, '.composer2 .ph', 172, '輸入訊息…'), { f: 0, sel: '.composer2 .ph', do: 'css', at: 172, v: 'color:' },
      show(1, B, 214, 4),
    ],
    cur: [click(0, '.ib-i', 36, 0), click(0, '.kv.pz .dd', 60), click(0, '.pz-menu .on', 80), click(0, '.draftbox', 122), click(0, '.composer2 .btn', 168)],
  } },
  // 5. 歡迎訊息設定 → 家長掃傳單加入 → 名單上來源自動標好
  { pillar: 1, shot: {
    figs: [['links', 1], ['links', 0], ['friends', 0]], dur: 270, max: 1.7,
    views: [{ at: 0, show: [0] }, { at: 56, show: [0, 1], focus: 1 }, { at: 186, show: [2] }],
    ops: [
      ...cls(0, '.wm-r', -1, '', 'on', 0), ...cls(0, '.wm-r', 24, 'on', '', 0),
      ...seq(1, B, [0, 1, 2, 3], 76, 12), show(1, B, 140, 4), show(1, B, 156, 5),
      // 名單最上面一筆換成剛掃傳單加入的家長
      text(2, '.tb tr:nth-child(2) td', -1, '11/24 19:02', 0), text(2, '.tb tr:nth-child(2) td b', -1, '許媽媽'),
      text(2, '.tb tr:nth-child(2) .srcb', -1, '傳單・小高一試聽班'), ...cls(2, '.tb tr:nth-child(2) .srcb', -1, 'flyer', 'meta'),
      text(2, '.tb tr:nth-child(2) td', -1, '本部', 3), text(2, '.tb tr:nth-child(2) .stg2', -1, '問班中'),
      show(2, '.tb tr', 204, 1), hl(2, '.tb tr:nth-child(2) .srcb', 214, 46),
    ],
    cur: [click(0, '.wm-r', 24, 0)],
    taps: [tap(1, '.quick span', 132, 0)],
  } },
  // 6. 來源成效 → 儀表板問 AI
  { pillar: 1, shot: {
    figs: [['roi', 0], ['roi', 1]], dur: 240, views: [{ at: 0, show: [0] }, { at: 96, show: [1] }],
    ops: [
      ...range(0, 4).map((k): Op => count(0, '.src-t tr td:nth-child(8)', 8 + k * 5, k, 0, 26)),
      ...range(0, 4).map((k): Op => count(0, '.src-t tr td:nth-child(6)', 8 + k * 5, k, 0, 20)),
      hl(0, '.good', 44, 40),
      ...range(0, 8).map((k): Op => count(1, '.kpi4 b', 100 + k * 2, k, 0, 24)),
      ...range(0, 6).map((k): Op => ({ f: 1, sel: '.vbars i', i: k, do: 'grow', prop: 'height', at: 104 + k * 3, dur: 16 })),
      ...range(0, 8).map((k): Op => ({ f: 1, sel: '.hb i', i: k, do: 'grow', at: 106 + k * 2, dur: 16 })),
      { f: 1, sel: '.meter i', do: 'grow', at: 110, dur: 20 },
      gone(1, '.kb-ai .src'), gone(1, '.kb-ai .btn'),
      type(1, '.ai-in span', 146, 26, '這個月板橋問班為什麼變少？'), text(1, '.ai-in span', 180, '問報表任何問題…'),
      show(1, '.kb-ai .q', 180),
      show(1, '.kb-ai .a', 190), type(1, '.kb-ai .a', 190, 40),
    ],
    cur: [click(1, '.ai-in', 142), click(1, '.ai-in i', 176)],
  } },
  // 7. 今日跟進
  { pillar: 2, shot: {
    figs: [['followup', 0]], dur: 150, views: [{ at: 0, show: [0] }],
    ops: [...range(0, 6).map((k): Op => count(0, '.pp b', 6 + k * 4, k, 0, 20)), show(0, '.fu-h', 40), ...seq(0, '.fu-r', [0, 1, 2, 3], 46, 7), hl(0, '.fu-r', 80, 34, 0)],
    cur: [click(0, '.fu-r .btn', 130, 0)],
  } },
  // 8. 名單卡片：AI 整理好資料與草稿 → 送出 → 看板上移到「已聯絡」
  { pillar: 2, shot: {
    figs: [['pipeline', 1], ['pipeline', 0]], dur: 210, views: [{ at: 0, show: [0] }, { at: 160, show: [1] }],
    ops: [
      ...range(0, 8).map((k): Op => show(0, '.ffx b', 6 + k * 3, k)), ...seq(0, '.cares span', [0, 1, 2], 32, 4), show(0, '.tl2.done', 44),
      { f: 0, sel: '.draft', do: 'type', at: 54, dur: 60, excl: '.ai-tag, .chk, .rp-act' }, show(0, '.chk.ok', 116), show(0, '.chk.warn', 122),
      press(0, '.rp-act .btn:not(.ghost)', 146),
      { f: 1, sel: '.kc.hot', do: 'move', at: 184, v: '.col:nth-child(2)' }, gone(1, '.kc.hot .warn', undefined, 184),
      text(1, '.col-h i', 184, '2', 0), text(1, '.col-h i', 184, '3', 1), hl(1, '.kc.hot', 190, 20),
    ],
    cur: [go(0, '.ffx', 30), go(0, '.draft', 92), click(0, '.rp-act .btn:not(.ghost)', 146)],
  } },
  // 9. 試聽：家長預約 → 老師評估 → 家長收到回饋
  { pillar: 2, shot: {
    figs: [['trial', 0], ['trial', 1], ['trial', 2]], dur: 240,
    views: [{ at: 0, show: [0, 1, 2], focus: 0 }, { at: 80, show: [0, 1, 2], focus: 1 }, { at: 196, show: [0, 1, 2], focus: 2 }],
    ops: [
      ...cls(0, '.bk-seg i', -1, '', 'on', 1), ...cls(0, '.bk-seg i', 18, 'on', '', 1),
      ...cls(0, '.bk-days > div', -1, '', 'on', 1), ...cls(0, '.bk-days > div', 36, 'on', '', 1), show(0, '.bk-time', 40),
      press(0, '.bk-btn', 60), text(0, '.bk-btn', 64, '✓ 已預約・11/21（五）19:00'),
      { f: 1, sel: '.fb-opt i.on, .fb-tags i.on', do: 'rm', at: -1, v: 'on' },
      ...([['.fb-opt i', 1, 98], ['.fb-opt i', 3, 112], ['.fb-opt i', 6, 126], ['.fb-tags i', 0, 140], ['.fb-tags i', 1, 152]] as const).flatMap(([s, i, at]) => cls(1, s, at, 'on', '', i)),
      type(1, '.fb-note', 160, 20), press(1, '.bk-btn', 186),
      show(2, '.flex', 206),
    ],
    taps: [tap(0, '.bk-seg i', 18, 1), tap(0, '.bk-days > div', 36, 1), tap(0, '.bk-btn', 60), tap(1, '.fb-opt i', 98, 1), tap(1, '.fb-opt i', 112, 3),
      tap(1, '.fb-opt i', 126, 6), tap(1, '.fb-tags i', 140, 0), tap(1, '.fb-tags i', 152, 1), tap(1, '.bk-btn', 186)],
  } },
  // 10. 家長綁定
  { pillar: 3, shot: {
    figs: [['students', 0], ['students', 1]], dur: 210, views: [{ at: 0, show: [0] }, { at: 60, show: [0, 1], focus: 1 }, { at: 150, show: [0, 1], focus: 0 }],
    ops: [
      { f: 0, sel: '.pg-h', do: 'append', at: 30, v: '<span class="tag ok" style="font-size:13px">家長綁定碼 A7K2Q9・11/25 到期</span>' },
      { f: 0, sel: '.bind tr', i: 1, do: 'css', at: -1, v: 'display:none' }, { f: 0, sel: '.bind tr', i: 1, do: 'css', at: 158, v: 'display:table-row' }, show(0, '.bind tr', 158, 1),
      hl(0, '.bind tr', 166, 40, 1),
      ...range(0, 6).map((k): Op => ({ f: 1, sel: '.otp i', i: k, do: 'type', at: 80 + k * 6, dur: 2 })),
      press(1, '.lf-btn', 124), show(1, '.ok-card', 132, 0), gone(1, '.ok-card', 1), gone(1, '.lf-link'),
    ],
    cur: [click(0, '.pg-h .btn.ghost', 26, 0)],
    taps: [tap(1, '.otp', 78), tap(1, '.lf-btn', 124)],
  } },
  // 11. 成績：拍照匯入 → 儲存 → 家長查得到
  { pillar: 3, shot: {
    figs: [['grades', 0], ['grades', 1]], dur: 180, views: [{ at: 0, show: [0] }, { at: 100, show: [0, 1], focus: 1 }],
    ops: [
      gone(0, '.rule'),
      ...([['88', 0], ['93', 1], ['60', 2], ['81', 3]] as const).map(([v, i], n): Op => type(0, '.tb .edit', 30 + n * 6, 3, v, i)),
      { f: 0, sel: '.tb .edit', do: 'css', at: 30, v: 'background:#e3f2e8' },
      press(0, '.pg-h .btn:not(.ghost)', 80),
      { f: 1, sel: '.spark circle', do: 'css', at: -1, v: 'visibility:hidden' }, { f: 1, sel: '.spark circle', do: 'css', at: 124, v: 'visibility:visible' },
      { f: 1, sel: '.spk-l span', i: 3, do: 'show', at: 124 }, hl(1, '.spark', 126, 40),
    ],
    cur: [click(0, '.pg-h .btn.ghost', 22, 0), click(0, '.pg-h .btn:not(.ghost)', 80)],
  } },
  // 12. 月報
  { pillar: 3, shot: {
    figs: [['reports', 0], ['reports', 1]], dur: 180, views: [{ at: 0, show: [0] }, { at: 128, show: [0, 1], focus: 1 }],
    ops: [
      { f: 0, sel: '.rp-txt', do: 'type', at: 8, dur: 48, excl: '.ai-tag' },
      type(0, '.rp-add span', 70, 18),
      press(0, '.rp-act .btn:not(.ghost)', 100), text(0, '.rp-i.on', 104, '王小明 ✓'), ...cls(0, '.rp-i.on', 104, 'ok'),
      text(0, '.pg-h .tag', 104, '已確認 13 / 20'), text(0, '.pg-h .btn', 104, '送出已確認的 13 份'), press(0, '.pg-h .btn', 118),
      ...seq(1, B, range(0, 5), 140, 5),
    ],
    cur: [click(0, '.rp-add', 66), click(0, '.rp-act .btn:not(.ghost)', 100), click(0, '.pg-h .btn', 118)],
  } },
  // 13. 公告
  { pillar: 3, shot: {
    figs: [['notices', 0], ['notices', 1]], dur: 180, views: [{ at: 0, show: [0] }, { at: 128, show: [0, 1], focus: 1 }],
    ops: [
      type(0, '.ailine b', 12, 24), press(0, '.ailine .btn', 44),
      ...seq(0, '.fl .in', [0, 1, 2], 52, 4), type(0, '.fl .in', 62, 22, undefined, 3), show(0, '.fl .in', 64, 4), show(0, '.ck', 70),
      count(0, '.q-big', 84, undefined, 0, 20), { f: 0, sel: '.nt-q .meter i', do: 'grow', at: 84, dur: 20 }, hl(0, '.nt-q', 96, 22),
      press(0, '.pg-h .btn:not(.ghost)', 118),
      show(1, '.flex', 144), gone(1, '.msg'),
    ],
    cur: [click(0, '.ailine b', 10), click(0, '.ailine .btn', 44), click(0, '.pg-h .btn:not(.ghost)', 118)],
  } },
  // 14. 點名：晚到自動標記 → 老師掃 QR → 家長只收到到班通知
  { pillar: 4, shot: {
    figs: [['attendance', 0], ['attendance', 2], ['attendance', 3]], dur: 240, views: [{ at: 0, show: [0] }, { at: 96, show: [1, 2], focus: 0 }, { at: 168, show: [1, 2], focus: 1 }],
    ops: [
      { f: 0, sel: '.attt tr:nth-child(4) td:nth-child(2) .eta, .attt tr:nth-child(4) td:nth-child(2) small', do: 'show', at: 24 },
      text(0, '.attt tr:nth-child(4) .st', -1, '未到應到時間'), ...cls(0, '.attt tr:nth-child(4) .st', -1, '', 'warn'),
      text(0, '.attt tr:nth-child(4) .st', 24, '晚到中'), ...cls(0, '.attt tr:nth-child(4) .st', 24, 'warn'),
      hl(0, '.attt tr:nth-child(4)', 28, 50),
      ...seq(1, '.ap-li', [0, 1, 2, 3], 104, 4),
      text(1, '.ap-li i', 150, '已到 19:18', 1), ...cls(1, '.ap-li i', 150, 'ok', 'lvq', 1), hl(1, '.ap-li', 152, 26, 1),
      show(2, '.push', 176), show(2, '.lock-note', 200),
    ],
    taps: [tap(1, '.scan-box', 144)],
  } },
  // 15. 請假：學生請假 → 家長確認 → 自動寫進出缺勤
  { pillar: 4, shot: {
    figs: [['leave', 1], ['leave', 3], ['leave', 0]], dur: 180, views: [{ at: 0, show: [0, 1], focus: 0 }, { at: 44, show: [0, 1], focus: 1 }, { at: 120, show: [2] }],
    ops: [
      show(0, B, 6, 0), show(0, B, 20, 1), show(0, B, 32, 2), gone(0, B, 3),
      show(1, B, 54, 0), press(1, '.fx-btn', 84, 0), show(1, B, 90, 1), show(1, B, 100, 2),
      text(2, '.tb tr:nth-child(4) .tag', -1, '等待家長確認'),
      text(2, '.tb tr:nth-child(4) .tag', 140, '已登記出缺勤'), ...cls(2, '.tb tr:nth-child(4) .tag', 140, 'ok', 'warn'),
      { f: 2, sel: '.tb tr:nth-child(4) td:last-child', do: 'html', at: 146, v: '<span class="tag">已轉補課安排</span>' },
      hl(2, '.tb tr:nth-child(4)', 142, 32),
    ],
    taps: [tap(1, '.fx-btn', 84, 0)],
  } },
  // 16. 補課
  { pillar: 4, shot: {
    figs: [['makeup', 0], ['makeup', 1]], dur: 180, views: [{ at: 0, show: [0] }, { at: 76, show: [0, 1], focus: 1 }],
    ops: [
      ...cls(0, '.mode', -1, '', 'on', [0, 1] as unknown as number), ...cls(0, '.mode', 22, 'on', '', 0), ...cls(0, '.mode', 40, 'on', '', 1),
      ...cls(1, '.mk-opt.on', -1, '', 'on'), ...seq(1, B, range(0, 9), 88, 3),
      ...cls(1, '.mk-opt', 130, 'on', '', 0), press(1, '.bk-btn', 152), text(1, '.bk-btn', 156, '✓ 已安排・11/22（六）14:00'),
    ],
    cur: [click(0, '.mode', 22, 0), click(0, '.mode', 40, 1)],
    taps: [tap(1, '.mk-opt', 130, 0), tap(1, '.bk-btn', 152)],
  } },
  // 17. 續班提醒
  { pillar: 5, shot: {
    figs: [['renewal', 0], ['renewal', 1]], dur: 210, views: [{ at: 0, show: [0] }, { at: 60, show: [0, 1], focus: 1 }, { at: 136, show: [0, 1], focus: 0 }],
    ops: [
      ...range(0, 3).map((k): Op => count(0, '.kpis3 b', 4 + k * 3, k, 0, 22)),
      text(0, '.tb tr:nth-child(2) .tag', -1, '未回覆'), ...cls(0, '.tb tr:nth-child(2) .tag', -1, 'bad', 'ok'),
      press(0, '.pg-h .btn', 40),
      show(1, B, 74, 0), press(1, '.fx-btn', 104, 0), show(1, B, 110, 1), show(1, B, 122, 2),
      text(0, '.tb tr:nth-child(2) .tag', 146, '已確認'), ...cls(0, '.tb tr:nth-child(2) .tag', 146, 'ok', 'bad'), text(0, '.tb tr:nth-child(2) td', 146, '12/04', 3),
      text(0, '.kpis3 b', 146, '49', 0), text(0, '.kpis3 b', 146, '22', 2), hl(0, '.tb tr:nth-child(2)', 148, 40), hl(0, '.kpis3 > div', 148, 40, 0),
    ],
    cur: [click(0, '.pg-h .btn', 40)],
    taps: [tap(1, '.fx-btn', 104, 0)],
  } },
  // 18. 流失預警
  { pillar: 5, shot: {
    figs: [['retention', 0]], dur: 210, views: [{ at: 0, show: [0] }],
    ops: [
      ...seq(0, '.rk-r', [0, 1, 2, 3], 8, 7), ...seq(0, '.sig span', range(0, 5), 30, 4), hl(0, '.rk-r .sig', 64, 50, 0),
      press(0, '.rk-r .btn', 140, 0), text(0, '.rk-r .btn', 144, '林老師 處理中', 0),
      { f: 0, sel: '.rk-r .btn', i: 0, do: 'css', at: 144, v: 'background:#f8e4ee;color:#a8326e;border-color:transparent' }, text(0, '.seg i', 144, '待處理 5', 0),
    ],
    cur: [go(0, '.rk-r b', 120, 0), click(0, '.rk-r .btn', 140, 0)],
  } },
  // 19. 多分校：總部分派 → 板橋主任只看得到板橋
  { pillar: 5, shot: {
    figs: [['branches', 0], ['branches', 1]], dur: 210, views: [{ at: 0, show: [0] }, { at: 100, show: [1] }],
    ops: [
      press(0, '.pool-r .sel', 44, 0), { f: 0, sel: '.pool-r .sel', i: 0, do: 'html', at: 48, v: '<span class="br-b ty">桃園</span>' }, text(0, '.pool b', 48, '待分派 1'),
      hl(0, '.tb', 60, 30),
      ...seq(1, '.tb tr', [1, 2], 112, 6), hl(1, '.brsw', 124, 40), hl(1, '.rule', 172, 30),
    ],
    cur: [click(0, '.pool-r .sel', 44, 0)],
  } },
];
