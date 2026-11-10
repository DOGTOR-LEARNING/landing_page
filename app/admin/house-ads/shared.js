'use client'
import { adminFetch } from '../AdminWorkspace'
import styles from '../admin.module.css'
import page from './house-ads.module.css'

// House ads (backend/docs/house-ads.md in dogtor_app): our own reward videos
// and chapter-list banners, shown in place of AdMob for a share of traffic in
// chosen regions and grades. Each market has its own campaigns in its own
// database; requests go through /api/admin/house-ads/<market>/… to
// backend/app/routers/admin_house_ads.py.

export const MARKETS = [['tw', '台灣'], ['en', 'International']]
export const PLACEMENTS = [['hearts', '獎勵影片'], ['chapter_banner', '關卡列表 banner']]

export const REGION_LABELS = {
  jibei: '北北基', taolian: '桃園・連江', zhumiao: '竹苗', zhongtou: '中投', changhua: '彰化', yunlin: '雲林',
  chiayi: '嘉義', tainan: '台南', kaohsiung: '高雄', pingtung: '屏東', yilan: '宜蘭', hualien: '花蓮',
  taitung: '台東', penghu: '澎湖', kinmen: '金門', overseas: '海外／其他',
}
export const COUNTY_LABELS = {
  TPE: '台北市', NWT: '新北市', KEE: '基隆市', TAO: '桃園市', LIE: '連江縣', HSZ: '新竹市', HSQ: '新竹縣',
  MIA: '苗栗縣', TXG: '台中市', NAN: '南投縣', CHA: '彰化縣', YUN: '雲林縣', CYI: '嘉義市', CYQ: '嘉義縣',
  TNN: '台南市', KHH: '高雄市', PIF: '屏東縣', ILA: '宜蘭縣', HUA: '花蓮縣', TTT: '台東縣', PEN: '澎湖縣', KIN: '金門縣',
}
export const GRADE_LABELS = {
  G1: '小一', G2: '小二', G3: '小三', G4: '小四', G5: '小五', G6: '小六', G7: '國一', G8: '國二', G9: '國三',
  G10: '高一', G11: '高二', G12: '高三', university: '大學', master: '碩士', other: '其他', teacher: '老師', parent: '家長',
}
export const GRADE_PRESETS = [['國小', ['G1', 'G2', 'G3', 'G4', 'G5', 'G6']], ['國中', ['G7', 'G8', 'G9']], ['高中', ['G10', 'G11', 'G12']]]
export const REVIEW_LABELS = { pending: '待審核', approved: '已核准', rejected: '已退回' }

// A YouTube page is not a video file, and its player would let students skip.
export const YOUTUBE = /^https:\/\/([a-z0-9-]+\.)*(youtube\.com|youtu\.be)\//i

export const labelOf = (map, key) => map[key] || key
export const listText = (keys, map) => keys.map(k => labelOf(map, k)).join('、')

export async function api(market, path = '', options = {}) {
  const response = await adminFetch(`/api/admin/house-ads/${market}${path}`, options)
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.success === false) {
    const detail = Array.isArray(data.detail) ? data.detail.map(d => d.msg).join('；') : data.detail
    throw new Error(data.message || detail || '操作失敗，請稍後再試')
  }
  return data.data
}
export const jsonBody = (method, body) => ({ method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

const EXTENSION_TYPES = { mp4: 'video/mp4', m4v: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' }

/** The file's type, falling back to its extension (some browsers leave .mov blank). */
export function fileType(file) {
  if (file.type) return file.type
  return EXTENSION_TYPES[file.name.split('.').pop()?.toLowerCase()] || ''
}

/**
 * Uploads a file straight to Cloud Storage through a resumable session the
 * backend opens for this page's origin (the admin's own host has a small
 * request limit, so files never pass through it). Returns the object path
 * to hand to /media/video or /media/image.
 */
export async function uploadToStorage(market, kind, file, onProgress) {
  const contentType = fileType(file)
  const session = await api(market, '/media/session', jsonBody('POST', {
    kind, content_type: contentType, size_bytes: file.size, origin: window.location.origin,
  }))
  await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', session.upload_url)
    xhr.setRequestHeader('Content-Type', contentType)
    xhr.upload.onprogress = event => { if (event.lengthComputable) onProgress?.(event.loaded / event.total) }
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`上傳失敗（${xhr.status}），請重試`)))
    xhr.onerror = () => reject(new Error('上傳中斷，請檢查網路後重試'))
    xhr.send(file)
  })
  return session.object
}

// The backend stores UTC without an offset; the form works in Taiwan time.
const TAIPEI = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
export const toLocalInput = iso => (iso ? TAIPEI.format(new Date(`${iso}Z`)).replace(' ', 'T') : '')
export const fromLocalInput = value => (value ? `${value}:00+08:00` : null)
export const showTime = iso => (iso ? TAIPEI.format(new Date(`${iso}Z`)) : '')

export const clock = seconds => {
  const s = Math.max(0, Math.round(seconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
export const megabytes = bytes => (bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`)

export function Field({ label, hint, children }) {
  return <div className={styles.fieldGroup}><span className={styles.label}>{label}</span>{children}{hint && <p className={styles.hint}>{hint}</p>}</div>
}

export function Chips({ keys, labels, value, onChange, disabled }) {
  const toggle = key => onChange(value.includes(key) ? value.filter(k => k !== key) : [...value, key])
  return <div className={page.chips}>{keys.map(key =>
    <button key={key} type="button" disabled={disabled} aria-pressed={value.includes(key)}
      className={`${page.chip} ${value.includes(key) ? page.chipOn : ''}`} onClick={() => toggle(key)}>{labelOf(labels, key)}</button>)}
  </div>
}
