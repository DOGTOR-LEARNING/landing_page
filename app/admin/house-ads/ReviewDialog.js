'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import styles from '../admin.module.css'
import page from './house-ads.module.css'
import { COUNTY_LABELS, Field, GRADE_LABELS, REGION_LABELS, api, clock, jsonBody, listText, showTime } from './shared'

function Creative({ row }) {
  return <div className={page.reviewCreative}>
    {row.placement === 'hearts'
      ? <><video className={page.videoPreview} src={row.video_url} controls preload="metadata" /><span className={page.muted}>{clock(row.duration_seconds || 0)}</span></>
      : <div className={page.bannerPreview}><img src={row.image_url} alt="banner" /></div>}
    <dl className={page.facts}>
      <dt>申請人</dt><dd>{row.created_by || '—'}</dd>
      <dt>點擊連結</dt><dd>{row.click_url ? <a href={row.click_url} target="_blank" rel="noreferrer noopener">{row.click_url}</a> : '無'}</dd>
      <dt>年級</dt><dd>{row.target_grades?.length ? listText(row.target_grades, GRADE_LABELS) : '不限'}</dd>
      <dt>會考分區</dt><dd>{row.target_regions?.length ? listText(row.target_regions, REGION_LABELS) : '不限'}</dd>
      <dt>縣市</dt><dd>{row.target_counties?.length ? listText(row.target_counties, COUNTY_LABELS) : '不限'}</dd>
      <dt>期間</dt><dd>{showTime(row.starts_at) || '核准後立刻'} ～ {showTime(row.ends_at) || '不結束'}</dd>
    </dl>
  </div>
}

/** ads.manage: approve (setting the traffic share) or reject with a note. */
export function ReviewDialog({ market, row, onClose, onDone, notify }) {
  const [traffic, setTraffic] = useState(row.traffic_percent || 10)
  const [fill, setFill] = useState(row.fill_when_no_admob)
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function decide(decision) {
    if (decision === 'reject' && !note.trim()) { setError('退回時請寫原因，申請人會看到'); return }
    if (decision === 'approve' && !(Number(traffic) > 0 && Number(traffic) <= 100)) { setError('流量比例要在 1–100 之間'); return }
    setBusy(true); setError('')
    try {
      await api(market, `/${row.id}/review`, jsonBody('POST', {
        decision, note: note.trim() || null,
        traffic_percent: decision === 'approve' ? Number(traffic) : null,
        fill_when_no_admob: decision === 'approve' ? fill : null,
      }))
      notify(decision === 'approve' ? `已核准「${row.name}」並上線` : `已退回「${row.name}」`)
      onDone()
    } catch (e) { setError(e.message) }
    finally { setBusy(false) }
  }

  return <div className={styles.modalOverlay}>
    <section className={`${styles.modal} ${page.editor}`} role="dialog" aria-modal="true" aria-labelledby="house-ad-review-title">
      <button className={styles.modalClose} disabled={busy} onClick={onClose} aria-label="關閉"><X size={20} /></button>
      <h2 id="house-ad-review-title">審核「{row.name}」</h2>
      <p className={styles.hint}>確認素材、連結和投放對象沒問題後核准。核准會立刻上線（若有設定開始時間則從那時開始）。</p>
      <div className={styles.form}>
        <Creative row={row} />
        <div className={styles.formColumns}>
          <Field label="流量比例（%）" hint="核准時設定，之後也可以在編輯裡調整">
            <input className={styles.input} type="number" min={1} max={100} value={traffic} onChange={e => setTraffic(e.target.value)} />
          </Field>
        </div>
        <label className={page.checkRow}><input type="checkbox" checked={fill} onChange={e => setFill(e.target.checked)} />AdMob 沒有廣告時也用這則補上</label>
        <Field label="給申請人的備註" hint="退回時必填">
          <textarea className={styles.textarea} rows={3} maxLength={500} value={note} onChange={e => setNote(e.target.value)} placeholder="例：影片第 12 秒的字幕有錯字，請修正後重新送出" />
        </Field>
        {error && <p className={styles.errorMsg} role="alert">{error}</p>}
        <div className={styles.modalActions}>
          <button type="button" className={`${styles.btnSecondary} ${page.dangerButton}`} disabled={busy} onClick={() => decide('reject')}>退回</button>
          <button type="button" className={styles.btnPrimary} disabled={busy} onClick={() => decide('approve')}>{busy ? '處理中…' : '核准並上線'}</button>
        </div>
      </div>
    </section>
  </div>
}

/** Admins: force-pause a campaign (its owner cannot resume it) or release it. */
export function PauseDialog({ market, row, onClose, onDone, notify }) {
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const pausing = !row.admin_paused

  async function submit() {
    if (pausing && !reason.trim()) { setError('請寫暫停原因，廣告主會看到'); return }
    setBusy(true); setError('')
    try {
      await api(market, `/${row.id}/force-pause`, jsonBody('POST', { paused: pausing, reason: reason.trim() || null }))
      notify(pausing ? `已強制暫停「${row.name}」` : `已解除「${row.name}」的強制暫停`)
      onDone()
    } catch (e) { setError(e.message) }
    finally { setBusy(false) }
  }

  return <div className={styles.modalOverlay}>
    <section className={`${styles.modal} ${page.smallDialog}`} role="dialog" aria-modal="true" aria-labelledby="house-ad-pause-title">
      <button className={styles.modalClose} disabled={busy} onClick={onClose} aria-label="關閉"><X size={20} /></button>
      <h2 id="house-ad-pause-title">{pausing ? `強制暫停「${row.name}」` : `解除「${row.name}」的強制暫停`}</h2>
      <p className={styles.hint}>{pausing
        ? '暫停後這則廣告立刻停止投放，廣告主或其他人都無法自行恢復，只有管理員可以解除。'
        : `暫停原因：${row.paused_reason || '—'}。解除後會回到暫停前的狀態（啟用中的會繼續投放）。`}</p>
      <div className={styles.form}>
        {pausing && <Field label="暫停原因" hint="廣告主會看到">
          <textarea className={styles.textarea} rows={3} maxLength={500} value={reason} onChange={e => setReason(e.target.value)} placeholder="例：收到家長反映內容不適合國中生，先暫停檢查" />
        </Field>}
        {error && <p className={styles.errorMsg} role="alert">{error}</p>}
        <div className={styles.modalActions}>
          <button type="button" className={styles.btnSecondary} disabled={busy} onClick={onClose}>取消</button>
          <button type="button" className={`${styles.btnPrimary} ${pausing ? page.dangerFill : ''}`} disabled={busy} onClick={submit}>{busy ? '處理中…' : pausing ? '強制暫停' : '解除暫停'}</button>
        </div>
      </div>
    </section>
  </div>
}
