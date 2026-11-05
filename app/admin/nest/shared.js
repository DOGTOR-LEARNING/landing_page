'use client'
import { useRef, useState } from 'react'
import { ImageUp } from 'lucide-react'
import { adminFetch } from '../AdminWorkspace'
import styles from '../admin.module.css'
import page from './nest.module.css'

// Pet nest admin (docs/PET_NEST_SPEC.md §14). Each market has its own catalog
// in its own database; requests go through /api/admin/nest/<market>/… to that
// market's backend (backend/app/routers/admin_nest.py).

export const MARKETS = [['tw', '台灣'], ['en', 'International']]
export const ASSET_BASE = 'https://storage.googleapis.com/dogtor_asset/nest'

export const RARITIES = [['common', '普通'], ['rare', '稀有'], ['epic', '史詩'], ['legendary', '傳說']]
export const SOURCES = [['shop', '商店'], ['default', '預設（第一次打開就有）'], ['streak', '連續學習'], ['ranked', '競技場段位'], ['achievement', '成就'], ['event', '活動'], ['pro', 'Pro']]
export const SLOT_KINDS = [['background', '背景'], ['left_tall', '左側高櫃'], ['wall', '牆面'], ['rug', '地毯'], ['toy', '地板小物'], ['right_large', '右側大型']]
export const MOTIONS = [['static', '靜態'], ['ambient', '環境動態'], ['particle', '粒子特效']]
export const PRESETS = {
  ambient: [['sway', '搖擺'], ['bob', '上下漂浮'], ['glow_pulse', '發光呼吸'], ['spin_slow', '慢速旋轉']],
  particle: [['sparkle', '閃光'], ['snow', '下雪'], ['petals', '花瓣'], ['bubbles', '泡泡'], ['fireflies', '螢火蟲']],
}
export const POSES = [['sit', '坐著'], ['happy', '開心'], ['eat', '吃東西'], ['sleep', '睡覺'], ['weak', '虛弱'], ['avatar', '頭像']]
export const RULE_TYPES = [['', '無（只能從商店或直接獎勵取得）'], ['streak', '連續學習 N 天'], ['ranked_tier', '競技場達到段位'], ['achievement', '解鎖成就'], ['pro', 'Pro 限定'], ['event', '活動限定（v2）']]

export const label = (list, value) => (list.find(([code]) => code === value) || [value, value])[1]

export async function nestApi(market, path, options = {}) {
  const response = await adminFetch(`/api/admin/nest/${market}${path}`, options)
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.success === false) {
    throw new Error(data.message || data.detail || '操作失敗，請稍後再試')
  }
  return data
}

export const jsonBody = (method, body) => ({
  method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
})

/** Upload one WebP; the backend checks format, transparency, size and weight. */
export async function uploadAsset(market, { kind, targetId, pose, file }) {
  const form = new FormData()
  form.append('kind', kind)
  form.append('target_id', targetId)
  if (pose) form.append('pose', pose)
  form.append('file', file)
  const data = await nestApi(market, '/assets', { method: 'POST', body: form })
  return data.url
}

export function Field({ label: text, hint, children }) {
  return <div className={styles.fieldGroup}><span className={styles.label}>{text}</span>{children}{hint && <p className={styles.hint}>{hint}</p>}</div>
}

export function Select({ value, onChange, options, disabled }) {
  return <select className={styles.input} value={value ?? ''} disabled={disabled} onChange={e => onChange(e.target.value)}>
    {options.map(([code, text]) => <option key={code} value={code}>{text}</option>)}
  </select>
}

/** Image preview with an upload button; `size` is [width, height] in pixels. */
export function ImageField({ market, url, onUploaded, kind, targetId, pose, size, title, disabled, checker }) {
  const input = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function pick(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setBusy(true); setError('')
    try { onUploaded(await uploadAsset(market, { kind, targetId, pose, file })) }
    catch (e) { setError(`圖片不符合規格：${e.message}`) }
    finally { setBusy(false) }
  }
  return <div className={page.imageField}>
    <div className={`${page.imageBox} ${checker ? page.checker : ''}`}>{url ? <img src={url} alt={title} /> : <span>尚未上傳</span>}</div>
    <div className={page.imageMeta}>
      <strong>{title}</strong>
      {size && <span>{size[0]}×{size[1]} WebP</span>}
      <button type="button" className={styles.smallButton} disabled={disabled || busy || !targetId} onClick={() => input.current?.click()}>
        <ImageUp size={14} />{busy ? '上傳中…' : '上傳'}
      </button>
      {!targetId && <span className={page.warn}>先填代號</span>}
      {error && <span className={page.error}>{error}</span>}
    </div>
    <input ref={input} type="file" accept="image/webp" hidden onChange={pick} />
  </div>
}

/** unlock_rule as a form (spec §8.3); null when there is none. */
export function RuleEditor({ rule, onChange, options, forSpecies }) {
  const type = rule?.type || ''
  const set = patch => onChange({ ...rule, ...patch })
  return <div className={page.ruleBox}>
    <Select value={type} options={RULE_TYPES} onChange={value => onChange(value ? { type: value } : null)} />
    {type === 'streak' && <input className={styles.input} type="number" min={1} placeholder="天數，例如 30" value={rule.days ?? ''} onChange={e => set({ days: e.target.value ? Number(e.target.value) : undefined })} />}
    {type === 'ranked_tier' && <Select value={rule.tier || ''} onChange={tier => set({ tier })} options={[['', '選擇段位'], ...(options?.tiers || []).map(t => [t.key, t.name])]} />}
    {type === 'achievement' && <Select value={rule.id ? String(rule.id) : ''} onChange={id => set({ id: id ? Number(id) : undefined })} options={[['', '選擇成就'], ...(options?.achievements || []).map(a => [String(a.id), `${a.title}（${a.category} ${a.requirement}）`])]} />}
    {type === 'pro' && forSpecies && <input className={styles.input} type="number" min={2024} placeholder="年份，例如 2026（每年一隻 Pro 寵物）" value={rule.year ?? ''} onChange={e => set({ year: e.target.value ? Number(e.target.value) : undefined })} />}
    {type === 'event' && <div className={page.inlineFields}>
      <input className={styles.input} type="date" value={rule.starts_on || ''} onChange={e => set({ starts_on: e.target.value })} aria-label="開始日" />
      <input className={styles.input} type="date" value={rule.ends_before || ''} onChange={e => set({ ends_before: e.target.value })} aria-label="結束日（不含）" />
      <input className={styles.input} type="number" min={0} placeholder="對戰勝場" value={rule.battle_wins ?? ''} onChange={e => set({ battle_wins: Number(e.target.value) })} />
    </div>}
  </div>
}

export function ruleText(rule, options) {
  if (!rule) return '—'
  if (rule.type === 'streak') return `連續學習 ${rule.days} 天`
  if (rule.type === 'ranked_tier') return `段位：${options?.tiers?.find(t => t.key === rule.tier)?.name || rule.tier}`
  if (rule.type === 'achievement') return `成就：${options?.achievements?.find(a => a.id === rule.id)?.title || rule.id}`
  if (rule.type === 'pro') return rule.year ? `Pro ${rule.year}` : 'Pro'
  if (rule.type === 'event') return `活動 ${rule.starts_on || ''}～${rule.ends_before || ''}`
  return rule.type
}

/** "" means not for sale. */
export const priceInput = value => (value === '' || value === null || value === undefined ? null : Number(value))
