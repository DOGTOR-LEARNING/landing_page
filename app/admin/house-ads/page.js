'use client'
import { useCallback, useEffect, useState } from 'react'
import { Ban, CheckCircle2, Pencil, Plus, RefreshCw, X } from 'lucide-react'
import { useAdmin } from '../AdminWorkspace'
import styles from '../admin.module.css'
import page from './house-ads.module.css'
import Editor, { emptyForm, toForm } from './Editor'
import { PauseDialog, ReviewDialog } from './ReviewDialog'
import {
  COUNTY_LABELS, GRADE_LABELS, MARKETS, PLACEMENTS, REGION_LABELS, REVIEW_LABELS, api, jsonBody, labelOf, listText, showTime,
} from './shared'

function audienceText(row, isTw) {
  const parts = []
  if (row.target_grades?.length) parts.push(`年級：${listText(row.target_grades, GRADE_LABELS)}`)
  if (isTw && row.target_regions?.length) parts.push(`會考分區：${listText(row.target_regions, REGION_LABELS)}`)
  if (isTw && row.target_counties?.length) parts.push(`縣市：${listText(row.target_counties, COUNTY_LABELS)}`)
  return parts.length ? parts : ['所有人']
}

function statsText(row) {
  const ctr = (clicks, base) => (base ? `${((clicks / base) * 100).toFixed(1)}%` : '—')
  if (row.placement === 'hearts') {
    const lines = [`播放 ${row.views}・領獎 ${row.rewarded}`, `近 7 天 ${row.views_7d}・${row.rewarded_7d}`]
    if (row.click_url) lines.push(`連結點擊 ${row.clicks}（${ctr(row.clicks, row.views)}）`)
    return lines
  }
  return [`曝光 ${row.impressions}・點擊 ${row.clicks}（${ctr(row.clicks, row.impressions)}）`, `近 7 天 ${row.impressions_7d}・${row.clicks_7d}`]
}

function Preview({ row }) {
  if (row.placement === 'chapter_banner') {
    return <div className={page.bannerThumb}>{row.image_url && <img src={row.image_url} alt="" />}</div>
  }
  return <div className={page.videoThumb}>{row.video_url ? <video src={`${row.video_url}#t=1`} muted preload="metadata" /> : null}<span>{row.duration_seconds}s</span></div>
}

function Status({ row }) {
  const review = row.review_status || 'approved'
  return <div className={page.statusStack}>
    {row.admin_paused
      ? <span className={`${page.pill} ${page.pillDanger}`}>強制暫停</span>
      : review !== 'approved'
        ? <span className={`${page.pill} ${review === 'pending' ? page.pillWarn : page.pillDanger}`}>{REVIEW_LABELS[review]}</span>
        : <span className={`${page.pill} ${row.serving ? page.pillOk : ''}`}>{row.serving ? '投放中' : '已停用'}</span>}
    {row.admin_paused && row.paused_reason && <span className={page.reason}>原因：{row.paused_reason}</span>}
    {review === 'rejected' && row.review_note && <span className={page.reason}>退回：{row.review_note}</span>}
    {review === 'approved' && row.review_note && !row.admin_paused && <span className={page.muted}>備註：{row.review_note}</span>}
  </div>
}

export default function HouseAdsPage() {
  const { user } = useAdmin()
  const [market, setMarket] = useState('tw')
  const [filter, setFilter] = useState('all')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [form, setForm] = useState(null)
  const [reviewing, setReviewing] = useState(null)
  const [pausing, setPausing] = useState(null)

  const notify = useCallback((text, error = false) => setMessage({ text, error }), [])
  const load = useCallback(async (target = market) => {
    setLoading(true)
    try { setData(await api(target)) }
    catch (e) { setData(null); notify(e.message, true) }
    finally { setLoading(false) }
  }, [market, notify])
  useEffect(() => { load(market) }, [market, load])

  const viewer = data?.viewer || {}
  const advertiser = !!viewer.is_advertiser
  const mayEdit = row => viewer.can_manage || (viewer.can_submit && row.owner_admin_id === user.id)

  async function toggle(row) {
    try {
      await api(market, `/${row.id}/active`, jsonBody('POST', { active: !row.is_active }))
      notify(`「${row.name}」已${row.is_active ? '停用' : '啟用'}`)
      load()
    } catch (e) { notify(e.message, true) }
  }

  const isTw = market === 'tw'
  const all = data?.campaigns || []
  const pendingCount = all.filter(row => row.review_status === 'pending').length
  const filters = [['all', '全部'], ...PLACEMENTS, ...(viewer.can_review ? [['pending', `待審核${pendingCount ? `（${pendingCount}）` : ''}`]] : [])]
  const rows = all.filter(row => filter === 'all' || (filter === 'pending' ? row.review_status === 'pending' : row.placement === filter))
  const coverage = data?.geo_coverage || {}
  const geoUsers = Object.entries(coverage).filter(([county]) => county !== 'unknown').reduce((sum, [, n]) => sum + n, 0)
  const showActions = viewer.can_submit || viewer.can_manage || viewer.can_force_pause

  return <div className={page.root}>
    <div className={page.toolbar}>
      <div className={styles.langTabs}>{MARKETS.map(([code, text]) =>
        <button key={code} className={`${styles.langTab} ${market === code ? styles.langTabActive : ''}`} onClick={() => setMarket(code)}>{text}</button>)}
      </div>
      <span className={page.spacer} />
      <button className={styles.smallButton} onClick={() => load()} disabled={loading}><RefreshCw size={14} />重新整理</button>
      {viewer.can_submit && <button className={styles.btnPrimary} onClick={() => setForm(emptyForm(filter === 'chapter_banner' ? 'chapter_banner' : 'hearts'))}>
        <Plus size={16} />{advertiser ? '新增廣告申請' : '新增'}
      </button>}
    </div>
    <nav className={page.tabs} aria-label="篩選">{filters.map(([code, text]) =>
      <button key={code} className={`${page.tab} ${filter === code ? page.tabActive : ''}`} onClick={() => setFilter(code)} aria-current={filter === code ? 'page' : undefined}>{text}</button>)}
    </nav>
    {advertiser
      ? <p className={styles.hint}>
        你可以上傳自己的獎勵影片或關卡列表 banner，並選擇想投放的年級與地區。送出後由 Dogtor 審核，核准才會上線；
        之後修改內容也要重新審核。這裡只會列出你自己的廣告。
      </p>
      : <p className={styles.hint}>
        獎勵影片取代「體力不足 → 看廣告」的 AdMob 影片，最長 {data?.max_duration_seconds || 60} 秒，看滿 {data?.reward_after_seconds || 30} 秒（短片要看完）才發體力。
        關卡列表 banner 取代章節列表裡的 AdMob 橫幅。Pro 使用者兩種都看不到。年級和地區要同時符合才會投放。
        {isTw && <> 目前有 {geoUsers.toLocaleString()} 位使用者有 IP 推測縣市{geoUsers === 0 ? '（PostHog 同步尚未設定，縣市篩選暫時不會命中，會考分區不受影響）' : ''}。</>}
      </p>}
    {message && <p className={`${styles.inlineMessage} ${message.error ? page.errorMessage : ''}`} role="status">
      {message.text}<button className={page.dismiss} onClick={() => setMessage(null)} aria-label="關閉"><X size={14} /></button>
    </p>}

    {loading && !data ? <p className={page.muted}>載入中…</p> : !data ? <p className={page.muted}>載入失敗，請重新整理。</p> :
      <div className={styles.tableScroll}><table className={styles.dataTable}>
        <thead><tr><th>素材</th><th>名稱</th><th>狀態</th><th>流量</th><th>投放對象</th><th>期間（台灣時間）</th><th>成效</th>{showActions && <th />}</tr></thead>
        <tbody>{rows.length === 0
          ? <tr><td colSpan={8} className={page.muted}>{filter === 'pending' ? '沒有待審核的申請。' : advertiser ? '還沒有廣告。按「新增廣告申請」開始。' : '還沒有自家廣告。按「新增」建立第一則。'}</td></tr>
          : rows.map(row => {
            const editable = mayEdit(row)
            const canToggle = editable && !row.admin_paused && (viewer.can_manage || row.review_status === 'approved')
            return <tr key={row.id}>
              <td><Preview row={row} /></td>
              <td><strong>{row.name}</strong>
                <div className={page.muted}>{labelOf(Object.fromEntries(PLACEMENTS), row.placement)}</div>
                {!advertiser && row.created_by && <div className={page.muted}>申請人：{row.created_by}</div>}
              </td>
              <td><Status row={row} /></td>
              <td>{row.review_status === 'pending' && !row.traffic_percent ? '審核時設定' : `${row.traffic_percent}%`}{row.fill_when_no_admob && row.traffic_percent > 0 && <div className={page.muted}>＋補 AdMob 空缺</div>}</td>
              <td>{audienceText(row, isTw).map(line => <div key={line} className={page.audience}>{line}</div>)}</td>
              <td className={page.nowrap}>{row.starts_at || row.ends_at ? <>{showTime(row.starts_at) || '立即'}<br />～ {showTime(row.ends_at) || '不結束'}</> : '不限'}</td>
              <td className={page.nowrap}>{statsText(row).map(line => <div key={line}>{line}</div>)}</td>
              {showActions && <td><div className={page.rowActions}>
                {viewer.can_review && row.review_status === 'pending' && <button className={styles.btnPrimary} onClick={() => setReviewing(row)}><CheckCircle2 size={14} />審核</button>}
                {editable && <button className={styles.smallButton} onClick={() => setForm(toForm(row))}><Pencil size={14} />編輯</button>}
                {canToggle && <button className={styles.smallButton} onClick={() => toggle(row)}>{row.is_active ? '停用' : '啟用'}</button>}
                {viewer.can_force_pause && <button className={`${styles.smallButton} ${row.admin_paused ? '' : page.dangerButton}`} onClick={() => setPausing(row)}>
                  <Ban size={14} />{row.admin_paused ? '解除暫停' : '強制暫停'}
                </button>}
              </div></td>}
            </tr>
          })}
        </tbody>
      </table></div>}

    {form && data && <Editor market={market} form={form} setForm={setForm} meta={data} notify={notify}
      onClose={() => setForm(null)} onSaved={() => { setForm(null); load() }} />}
    {reviewing && <ReviewDialog market={market} row={reviewing} notify={notify}
      onClose={() => setReviewing(null)} onDone={() => { setReviewing(null); load() }} />}
    {pausing && <PauseDialog market={market} row={pausing} notify={notify}
      onClose={() => setPausing(null)} onDone={() => { setPausing(null); load() }} />}
  </div>
}
