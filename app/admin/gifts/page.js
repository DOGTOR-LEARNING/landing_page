'use client'
import { useCallback, useEffect, useState } from 'react'
import { Gift, HandHeart, RefreshCw, X } from 'lucide-react'
import { adminFetch, useAdmin } from '../AdminWorkspace'
import styles from '../admin.module.css'

// Donated gift codes: plans the public bought and handed to us to pass on.
// An employee picks one, types who it is going to, and gives them the code.
// Nothing is looked up or synced; the note is the record. Matching resets the
// code's redemption window to 90 days and mails the donor a thank-you that
// never names the student (backend/app/routers/admin_gifts.py).
const LENGTHS = { 30: '1 個月', 90: '3 個月', 365: '1 年' }

async function api(url, options) {
  const response = await adminFetch(url, options)
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.success === false) {
    throw new Error(data.message || data.detail || '操作失敗，請稍後再試')
  }
  return data
}

const formatTime = value =>
  value ? new Date(value).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }) : '—'

export default function GiftsPage() {
  const { user } = useAdmin()
  const canManage = user?.permissions.includes('grants.manage')
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [showMatched, setShowMatched] = useState(false)
  const [matching, setMatching] = useState(null)
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState('')
  const [handed, setHanded] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api('/api/admin/gifts/donations')
      setDonations(data.data.donations)
      setMessage('')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => { load() }, [load])

  async function match(event) {
    event.preventDefault()
    setBusy(true)
    setFormError('')
    try {
      const data = await api(`/api/admin/gifts/donations/${matching.id}/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient_note: note.trim() }),
      })
      setHanded({ note: note.trim(), code: data.data.auth_code, expires: data.data.code_expires_at })
      setMatching(null)
      await load()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (!user) return null
  const unmatched = donations.filter(d => !d.matched_at)
  const shown = showMatched ? donations : unmatched

  return <>
    <section className={styles.tableCard}>
      <div className={styles.tableToolbar}>
        <div>
          <h2>待配對的捐贈 <span className={styles.countBadge}>{unmatched.length}</span></h2>
          <p>民眾捐出的 DOGTOR Pro 授權碼。配對時填寫交給誰，系統會把兌換期限重設為 90 天，並寄信感謝捐贈人（信中不會透露學生是誰）。</p>
        </div>
      </div>
      <div className={styles.searchRow}>
        <label className={styles.hint}>
          <input type="checkbox" checked={showMatched} onChange={e => setShowMatched(e.target.checked)} /> 顯示已配對
        </label>
        <button className={styles.btnSecondary} onClick={load} disabled={loading}><RefreshCw size={16} />重新整理</button>
      </div>
      {message && <p role="status" className={styles.inlineMessage}>{message}</p>}
      <div className={styles.tableScroll}>
        <table className={styles.dataTable}>
          <thead><tr>
            <th>方案</th><th>捐贈人</th><th>捐贈時間</th><th>授權碼</th><th>交給</th>
            {canManage && <th />}
          </tr></thead>
          <tbody>{shown.map(d => <tr key={d.id}>
            <td>{LENGTHS[d.duration_days] || `${d.duration_days} 天`}</td>
            <td><div><strong>{d.donor_name || '—'}</strong><br /><span className={styles.hint}>{d.donor_email || '（尚未取得 Email）'}</span></div></td>
            <td>{formatTime(d.donated_at)}</td>
            <td><code>{d.auth_code}</code>{d.redeemed && <><br /><span className={styles.statusBadge}>已兌換</span></>}</td>
            <td>{d.matched_at
              ? <div>{d.recipient_note}<br /><span className={styles.hint}>{formatTime(d.matched_at)}{d.donor_notified ? '・已通知捐贈人' : ''}</span></div>
              : <span className={styles.hint}>尚未配對</span>}</td>
            {canManage && <td>{!d.matched_at &&
              <button className={styles.smallButton} onClick={() => { setMatching(d); setNote(''); setFormError('') }}>
                <HandHeart size={14} />配對
              </button>}</td>}
          </tr>)}</tbody>
        </table>
      </div>
      {loading && <p className={styles.emptyState} role="status">正在載入捐贈…</p>}
      {!loading && !shown.length && <div className={styles.emptyState}><Gift size={28} /><p>{showMatched ? '還沒有任何捐贈' : '目前沒有待配對的捐贈'}</p></div>}
    </section>

    {matching && <div className={styles.modalOverlay}>
      <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="match-title">
        <button className={styles.modalClose} disabled={busy} onClick={() => setMatching(null)} aria-label="關閉"><X size={20} /></button>
        <h2 id="match-title">配對捐贈：{LENGTHS[matching.duration_days]}</h2>
        <p className={styles.hint}>配對後無法更改，請確認接收者。這段文字只留在後台，不會寄給捐贈人。</p>
        <form onSubmit={match} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label htmlFor="recipient-note" className={styles.label}>交給誰</label>
            <input id="recipient-note" required maxLength={255} autoFocus className={styles.input}
              placeholder="例如：XX 國中 王同學（社工轉介）"
              value={note} onChange={e => setNote(e.target.value)} />
          </div>
          {formError && <p role="alert" className={styles.inlineMessage}>{formError}</p>}
          <button type="submit" className={styles.btnPrimary} disabled={busy || !note.trim()}>{busy ? '配對中…' : '確認配對'}</button>
        </form>
      </section>
    </div>}

    {handed && <div className={styles.modalOverlay}>
      <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="handed-title">
        <button className={styles.modalClose} onClick={() => setHanded(null)} aria-label="關閉"><X size={20} /></button>
        <h2 id="handed-title">已配對</h2>
        <p>請把這組授權碼交給 {handed.note}：</p>
        <p><code style={{ fontSize: '1.6rem', letterSpacing: '0.15em' }}>{handed.code}</code></p>
        <p className={styles.hint}>在 DOGTOR App 輸入後開通，請於 {formatTime(handed.expires)} 前使用。捐贈人感謝信正在寄出。</p>
        <button className={styles.btnPrimary} onClick={() => setHanded(null)}>完成</button>
      </section>
    </div>}
  </>
}
