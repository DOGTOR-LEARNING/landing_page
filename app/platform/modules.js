// /platform 介紹頁的模組清單，聯絡表單（勾選有興趣的模組）與寄信 API 共用。
// requires 與頁面「模組總覽」的「需搭配」一致：勾了後面的模組，前面依賴的模組會一起被勾選。
// 01 AI 客服是基本模組，每家補習班都包含，表單上固定勾選。
export const BASE_MODULE = '01'
export const PLATFORM_MODULES = [
  { code: '01', name: 'AI 客服', requires: [] },
  { code: '02', name: '招生來源追溯', requires: [] },
  { code: '03', name: '招生 CRM', requires: [] },
  { code: '04', name: '學生檔案與家長綁定', requires: [] },
  { code: '05', name: '作業成績與家長查詢', requires: ['04'] },
  { code: '06', name: 'AI 月學習報告', requires: ['04', '05'] },
  { code: '07', name: '公告與聯絡簿', requires: ['04'] },
  { code: '08', name: '到班點名與通知', requires: ['04'] },
  { code: '09', name: 'LINE 請假', requires: ['04', '08'] },
  { code: '10', name: '補課安排', requires: ['09'] },
  { code: '11', name: '續班與繳費提醒', requires: ['04'] },
  { code: '12', name: '流失預警', requires: ['05', '08'] },
  { code: '13', name: '多分校管理', requires: [] },
]

const BY_CODE = Object.fromEntries(PLATFORM_MODULES.map((m) => [m.code, m]))

/** 補上所有（含間接）依賴的模組，並一定包含基本模組，依編號排序 */
export function withDependencies(codes) {
  const out = new Set([BASE_MODULE])
  const visit = (c) => {
    if (!BY_CODE[c] || out.has(c)) return
    out.add(c)
    BY_CODE[c].requires.forEach(visit)
  }
  codes.forEach((c) => {
    if (BY_CODE[c]) BY_CODE[c].requires.forEach(visit)
    visit(c)
  })
  out.add(BASE_MODULE)
  return [...out].filter((c) => BY_CODE[c]).sort()
}
