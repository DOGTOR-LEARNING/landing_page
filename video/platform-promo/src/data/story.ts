// 影片用的大模組與流程資料（內容取自 /platform 頁面，版面為影片重新設計）
export const PAPER = '#f4f7f6';
export const INK = '#16252b';
export const MUTED = '#58686d';

const mix = (a: string, b: string, t: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const A = p(a), B = p(b);
  return '#' + A.map((v, i) => Math.round(v * t + B[i] * (1 - t)).toString(16).padStart(2, '0')).join('');
};

// code：大模組編號（中文數字）；items[].mod：小模組編號（阿拉伯數字，與網頁的模組 01–13 一致）
export type Pillar = { id: string; c: string; pc: string; ps: string; bg: string; code: string; name: string; items: { name: string; desc: string; mod: string }[] };
const MODS: Record<string, string[]> = { ai: ['01', '01', '01'], source: ['02', '02', '02'], crm: ['03', '03', '03'], family: ['04', '05', '06', '07'], daily: ['08', '09', '10'], manage: ['11', '12', '13'] };
const P = (id: string, c: string, pc: string, ps: string, code: string, name: string, items: [string, string][]): Pillar =>
  ({ id, c, pc, ps, bg: mix(ps, PAPER, 0.55), code, name, items: items.map(([n, d], k) => ({ name: n, desc: d, mod: MODS[id][k] })) });

export const PILLARS: Pillar[] = [
  P('ai', 'c1', '#2769a9', '#e4eef8', '一', 'AI 客服', [['AI 家長客服', '依你提供的課程資料回答'], ['課程與方案管理', '學費、優惠、名額、試聽時段集中管理'], ['真人接手收件匣', 'AI 轉過來的問題集中在一個收件匣']]),
  P('source', 'c2', '#0e7c86', '#ddf1f2', '二', '招生來源追溯', [['好友來源名單', '每一位新加入的 LINE 好友'], ['來源連結與 QR Code', '每個招生活動產生專屬連結與 QR Code'], ['來源成效報表', '各來源的報名數與每筆報名成本']]),
  P('crm', 'c3', '#5b4fc9', '#ebe8fb', '三', '招生 CRM', [['招生總覽與跟進清單', '一眼看到每個階段有多少人'], ['名單看板與名單卡片', '家長在 LINE 留下的資料自動建成名單'], ['試聽預約與試聽回饋', '家長選時段，老師在手機上點選評估']]),
  P('family', 'c4', '#2e7d4f', '#e3f2e8', '四', '學生與家長服務', [['學生檔案與家長綁定', '一位學生可綁多位家長與學生本人'], ['作業成績與家長查詢', '老師登錄作業與成績'], ['AI 月學習報告', 'AI 依出缺勤、作業、成績寫好月報草稿'], ['公告與聯絡簿', '一句話產生公告']]),
  P('daily', 'c5', '#b26a00', '#fdf0dc', '五', '出缺勤與日常行政', [['到班點名與通知', '老師用手機掃 QR 點名'], ['LINE 請假', '家長或學生在 LINE 說一聲就能請假'], ['補課安排', '選擇你的補課制度']]),
  P('manage', 'c6', '#a8326e', '#f8e4ee', '六', '續班與經營管理', [['續班與繳費提醒', '依名單與日期自動提醒'], ['流失預警', '從缺課、作業、成績與家長詢問中提早發現'], ['多分校管理', '集團、分校、班級三層管理']]),
];

// 補習班流程：8 個環節，以及每個環節由哪些功能幫忙（顏色＝所屬大模組）
export const BANDS = [{ name: '招生期', from: 0, to: 3 }, { name: '在學期間', from: 4, to: 6 }, { name: '續班', from: 7, to: 7 }];
export const STAGES: { name: string; chips: { code: string; name: string; p: number }[] }[] = [
  { name: '招生曝光', chips: [{ code: '02', name: '來源連結與 QR', p: 1 }, { code: '02', name: '好友來源名單', p: 1 }] },
  { name: '問班諮詢', chips: [{ code: '01', name: 'AI 家長客服', p: 0 }, { code: '01', name: '課程與方案', p: 0 }, { code: '01', name: '真人接手', p: 0 }, { code: '03', name: '跟進清單', p: 2 }] },
  { name: '試聽', chips: [{ code: '03', name: '試聽預約與回饋', p: 2 }, { code: '03', name: '名單看板', p: 2 }] },
  { name: '報名', chips: [{ code: '04', name: '學生與家長綁定', p: 3 }, { code: '02', name: '來源成效', p: 1 }] },
  { name: '開課', chips: [{ code: '07', name: '公告與聯絡簿', p: 3 }, { code: '13', name: '多分校管理', p: 5 }] },
  { name: '日常上課', chips: [{ code: '08', name: '到班點名', p: 4 }, { code: '09', name: 'LINE 請假', p: 4 }, { code: '10', name: '補課安排', p: 4 }] },
  { name: '學習追蹤', chips: [{ code: '05', name: '作業成績查詢', p: 3 }, { code: '06', name: 'AI 月學習報告', p: 3 }] },
  { name: '續班或流失', chips: [{ code: '11', name: '續班提醒', p: 5 }, { code: '12', name: '流失預警', p: 5 }] },
];

// 給字型預先載入用
export const STORY_TEXT = JSON.stringify([PILLARS, BANDS, STAGES]) + '模組一二三四五六';
