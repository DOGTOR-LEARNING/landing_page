'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import styles from '../admin.module.css'
import page from './house-ads.module.css'
import { BannerCrop, VideoUpload } from './MediaUpload'
import {
  COUNTY_LABELS, Chips, Field, GRADE_LABELS, GRADE_PRESETS, MARKETS, PLACEMENTS, REGION_LABELS, YOUTUBE,
  api, clock, fromLocalInput, jsonBody, megabytes, toLocalInput,
} from './shared'

export const emptyForm = placement => ({
  isNew: true, name: '', placement, video_url: '', duration_seconds: '', image_url: '', click_url: '',
  traffic_percent: 10, fill_when_no_admob: true, target_regions: [], target_counties: [], target_grades: [],
  starts_at: '', ends_at: '', is_active: false,
})

export const toForm = row => ({
  ...row, isNew: false, video_url: row.video_url || '', duration_seconds: row.duration_seconds ?? '',
  image_url: row.image_url || '', click_url: row.click_url || '',
  starts_at: toLocalInput(row.starts_at), ends_at: toLocalInput(row.ends_at),
})

export const toBody = form => ({
  name: form.name.trim(), placement: form.placement,
  video_url: form.placement === 'hearts' ? form.video_url.trim() : null,
  duration_seconds: form.placement === 'hearts' ? Number(form.duration_seconds) || null : null,
  image_url: form.placement === 'chapter_banner' ? form.image_url.trim() : null,
  click_url: form.click_url.trim() || null,
  traffic_percent: Number(form.traffic_percent) || 0, fill_when_no_admob: form.fill_when_no_admob,
  target_regions: form.target_regions, target_counties: form.target_counties, target_grades: form.target_grades,
  starts_at: fromLocalInput(form.starts_at), ends_at: fromLocalInput(form.ends_at), is_active: form.is_active,
})

function validate(form, { max, advertiser }) {
  if (!form.name.trim()) return '請填名稱'
  if (form.placement === 'hearts') {
    const videoUrl = form.video_url.trim()
    if (!videoUrl) return '請上傳影片'
    if (!videoUrl.startsWith('https://')) return '影片網址要是 https:// 開頭的影片檔（mp4）'
    if (YOUTUBE.test(videoUrl)) return 'YouTube 連結不能直接播放，請改用「選擇影片檔」上傳'
    const seconds = Number(form.duration_seconds)
    if (!(seconds >= 1)) return '請填影片秒數（上傳後會自動帶入）'
    if (seconds > max) return `影片最長 ${max} 秒`
  } else if (!form.image_url.trim()) {
    return '請上傳 banner 圖片'
  } else if (!form.image_url.trim().startsWith('https://')) {
    return '圖片網址要是 https:// 開頭'
  }
  if (form.click_url.trim() && !form.click_url.trim().startsWith('https://')) return '點擊連結要是 https:// 開頭，或留空'
  if (!advertiser) {
    const percent = Number(form.traffic_percent)
    if (!(percent >= 0 && percent <= 100)) return '流量比例要在 0–100 之間'
  }
  if (form.starts_at && form.ends_at && form.ends_at <= form.starts_at) return '結束時間要晚於開始時間'
  return ''
}

export default function Editor({ market, form, setForm, meta, onClose, onSaved, notify }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [manualUrl, setManualUrl] = useState(false)
  const [uploadInfo, setUploadInfo] = useState('')
  const viewer = meta.viewer || {}
  const advertiser = !!viewer.is_advertiser
  const isTw = market === 'tw'
  const max = meta.max_duration_seconds || 60
  const rewardAfter = meta.reward_after_seconds || 30
  const set = patch => { setError(''); setForm(f => ({ ...f, ...patch })) }

  async function submit(event) {
    event.preventDefault()
    const problem = validate(form, { max, advertiser })
    if (problem) { setError(problem); return }
    setBusy(true); setError('')
    try {
      if (form.isNew) await api(market, '', jsonBody('POST', toBody(form)))
      else await api(market, `/${form.id}`, jsonBody('PUT', toBody(form)))
      const name = form.name.trim()
      notify(advertiser ? `「${name}」已送出審核，通過後才會上線` : form.isNew ? `已新增「${name}」` : `已更新「${name}」`)
      onSaved()
    } catch (e) { setError(e.message) }
    finally { setBusy(false) }
  }

  const seconds = Number(form.duration_seconds)
  const rewardText = seconds >= rewardAfter
    ? `學生看滿 ${rewardAfter} 秒拿到體力並可關閉，也可以繼續看完`
    : seconds > 0 ? `短於 ${rewardAfter} 秒，學生要看完整支 ${seconds} 秒才拿到體力` : ''
  const resubmit = advertiser && !form.isNew && form.review_status === 'approved'

  return <div className={styles.modalOverlay}>
    <section className={`${styles.modal} ${page.editor}`} role="dialog" aria-modal="true" aria-labelledby="house-ad-editor-title">
      <button className={styles.modalClose} disabled={busy} onClick={onClose} aria-label="關閉"><X size={20} /></button>
      <h2 id="house-ad-editor-title">{form.isNew ? (advertiser ? '新增廣告申請' : '新增自家廣告') : `編輯「${form.name}」`}</h2>
      <p className={styles.hint}>
        {MARKETS.find(([code]) => code === market)?.[1]}市場。
        {advertiser
          ? '送出後由 Dogtor 審核，核准後才會上線，曝光比例也由審核人員設定。'
          : '儲存後下一次有人點廣告就生效；banner 在 App 每 10 分鐘更新一次。'}
      </p>
      {advertiser && form.review_status === 'rejected' && form.review_note && <p className={page.notice}>上次退回原因：{form.review_note}</p>}
      {resubmit && <p className={page.notice}>這則廣告已上線。修改後要重新審核，審核通過前會暫停投放。</p>}
      <form onSubmit={submit} className={styles.form}>
        <div className={styles.formColumns}>
          <Field label="名稱" hint="只有後台看得到"><input className={styles.input} maxLength={100} value={form.name} onChange={e => set({ name: e.target.value })} placeholder="例：高雄國三衝刺班影片" /></Field>
          <Field label="版位" hint={form.isNew ? '建立後不能改' : undefined}>
            <select className={styles.input} value={form.placement} disabled={!form.isNew} onChange={e => set({ placement: e.target.value })}>
              {PLACEMENTS.map(([code, text]) => <option key={code} value={code}>{text}</option>)}
            </select>
          </Field>
        </div>

        {form.placement === 'hearts' ? <Field label="影片" hint={`學生在體力不足時點「看廣告」看到。最長 ${max} 秒，超過的話上傳時選要保留的 ${max} 秒。`}>
          {form.video_url && <div className={page.currentMedia}>
            <video className={page.videoPreview} src={form.video_url} controls preload="metadata" />
            <span className={page.muted}>目前影片 · {clock(seconds || 0)}{uploadInfo ? ` · ${uploadInfo}` : ''}</span>
          </div>}
          <VideoUpload market={market} max={max} disabled={busy} onDone={result => {
            set({ video_url: result.url, duration_seconds: result.duration_seconds })
            setUploadInfo(`${result.width}×${result.height}，${megabytes(result.size_bytes)}`)
          }} />
          {!manualUrl
            ? <button type="button" className={page.linkButton} onClick={() => setManualUrl(true)}>已經有放在網路上的 mp4？改貼網址</button>
            : <div className={styles.formColumns}>
              <Field label="影片網址（mp4）"><input className={styles.input} value={form.video_url} onChange={e => set({ video_url: e.target.value })} placeholder="https://storage.googleapis.com/…/ad.mp4" /></Field>
              <Field label="影片秒數"><input className={styles.input} type="number" min={1} max={max} value={form.duration_seconds} onChange={e => set({ duration_seconds: e.target.value })} /></Field>
            </div>}
          {rewardText && <p className={styles.hint}>{rewardText}</p>}
        </Field> : <Field label="Banner 圖片" hint="出現在關卡列表的章節之間，App 裡是 4:1 的橫幅。選圖後拖動框框裁切。">
          {form.image_url && <div className={page.currentMedia}>
            <div className={page.bannerPreview}><img src={form.image_url} alt="目前的 banner" /></div>
            <span className={page.muted}>目前圖片{uploadInfo ? ` · ${uploadInfo}` : ''}</span>
          </div>}
          <BannerCrop market={market} disabled={busy} onDone={result => {
            set({ image_url: result.url })
            setUploadInfo(`${result.width}×${result.height}，${megabytes(result.size_bytes)}`)
          }} />
        </Field>}

        <Field label="點擊連結" hint={form.placement === 'hearts'
          ? '影片下方會有「了解更多」按鈕，學生點了用瀏覽器打開，影片暫停、回來後繼續播。留空就沒有按鈕。'
          : '學生點 banner 時用瀏覽器打開；留空表示不能點。'}>
          <input className={styles.input} value={form.click_url} onChange={e => set({ click_url: e.target.value })} placeholder="https://" />
        </Field>

        {!advertiser && <>
          <div className={styles.formColumns}>
            <Field label="流量比例（%）" hint={form.placement === 'hearts' ? '符合對象的人每次點「看廣告」，有這個機率播這支影片' : '符合對象的人每個 banner 位置，有這個機率放這張圖'}>
              <input className={styles.input} type="number" min={0} max={100} value={form.traffic_percent} onChange={e => set({ traffic_percent: e.target.value })} />
            </Field>
          </div>
          <label className={page.checkRow}><input type="checkbox" checked={form.fill_when_no_admob} onChange={e => set({ fill_when_no_admob: e.target.checked })} />AdMob 沒有廣告時也用這則補上</label>
        </>}

        <Field label="年級" hint="不選＝所有年級。選了之後，沒有填年級的使用者不會看到。">
          <div className={page.presetRow}>{GRADE_PRESETS.map(([text, keys]) =>
            <button key={text} type="button" className={styles.smallButton} onClick={() => set({ target_grades: [...new Set([...form.target_grades, ...keys])] })}>＋{text}</button>)}
            {form.target_grades.length > 0 && <button type="button" className={styles.smallButton} onClick={() => set({ target_grades: [] })}>清除</button>}
          </div>
          <Chips keys={meta.grade_keys || Object.keys(GRADE_LABELS)} labels={GRADE_LABELS} value={form.target_grades} onChange={target_grades => set({ target_grades })} />
        </Field>

        {isTw ? <>
          <Field label="會考分區" hint="學生自己填的分區優先；沒填的用 IP 推測的縣市換算。和縣市是「或」：符合任一個就投放。都不選＝全台。">
            <Chips keys={meta.region_keys || Object.keys(REGION_LABELS)} labels={REGION_LABELS} value={form.target_regions} onChange={target_regions => set({ target_regions })} />
          </Field>
          <Field label="縣市（IP 推測）" hint="只來自 PostHog 依 IP 推測的位置，行動網路常被判在台北，比較不準。">
            <Chips keys={Object.keys(meta.county_keys || COUNTY_LABELS)} labels={COUNTY_LABELS} value={form.target_counties} onChange={target_counties => set({ target_counties })} />
          </Field>
        </> : <p className={styles.hint}>國際版沒有會考分區和縣市，只能用年級篩選。</p>}

        <div className={styles.formColumns}>
          <Field label="開始時間（台灣時間）" hint="留空＝核准後立刻開始"><input className={styles.input} type="datetime-local" value={form.starts_at} onChange={e => set({ starts_at: e.target.value })} /></Field>
          <Field label="結束時間（台灣時間）" hint="留空＝不會自動結束"><input className={styles.input} type="datetime-local" value={form.ends_at} onChange={e => set({ ends_at: e.target.value })} /></Field>
        </div>
        {!advertiser && <label className={page.checkRow}><input type="checkbox" checked={form.is_active} onChange={e => set({ is_active: e.target.checked })} />啟用（關掉就完全不會出現）</label>}

        {error && <p className={styles.errorMsg} role="alert">{error}</p>}
        <div className={styles.modalActions}>
          <button type="button" className={styles.btnSecondary} disabled={busy} onClick={onClose}>取消</button>
          <button className={styles.btnPrimary} disabled={busy}>{busy ? '送出中…' : advertiser ? '送出審核' : '儲存'}</button>
        </div>
      </form>
    </section>
  </div>
}
