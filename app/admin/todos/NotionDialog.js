'use client'
import { useEffect, useState } from 'react'
import { X, RefreshCw, ExternalLink, Unplug } from 'lucide-react'
import { adminFetch } from '../AdminWorkspace'
import styles from '../admin.module.css'
import page from './todos.module.css'

const FIELDS = [['title', '標題'], ['status', '狀態'], ['assignee', '負責人'], ['due', '期限'], ['priority', '優先'], ['description', '說明']]
const LOCAL = { todo: '待辦', doing: '進行中', done: '完成', cancelled: '取消' }

async function api(url, options) {
  const response = await adminFetch(url, options)
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.success === false) throw new Error(data.message || data.detail || '操作失敗，請稍後再試')
  return data
}
const send = (url, method, body) => api(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) })

export function ago(iso) {
  if (!iso) return '尚未同步'
  const minutes = Math.round((Date.now() - new Date(iso + (iso.endsWith('Z') ? '' : 'Z')).getTime()) / 60000)
  return minutes < 1 ? '剛剛' : minutes < 60 ? `${minutes} 分鐘前` : minutes < 1440 ? `${Math.round(minutes / 60)} 小時前` : `${Math.round(minutes / 1440)} 天前`
}

function result(r) {
  if (!r) return ''
  const parts = [r.imported && `匯入 ${r.imported} 筆`, r.updated && `更新 ${r.updated} 筆`, r.removed && `關閉 ${r.removed} 筆（Notion 已刪除）`].filter(Boolean)
  return parts.length ? parts.join('、') : '沒有新的變更'
}

export default function NotionDialog({ people, canManage, onClose, onSynced }) {
  const [state, setState] = useState(null)
  const [link, setLink] = useState('')
  const [mapping, setMapping] = useState({})
  const [userMap, setUserMap] = useState({})
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [note, setNote] = useState('')

  function apply(data) {
    setState(data); setMapping(data.mapping || {}); setUserMap(data.user_map || {})
  }
  useEffect(() => { api('/api/admin/todos/notion?details=true').then(d => apply(d.data)).catch(e => setError(e.message)) }, [])

  async function run(label, fn) {
    setBusy(label); setError(''); setNote('')
    try { await fn() } catch (e) { setError(e.message) } finally { setBusy('') }
  }
  const connect = () => run('connect', async () => { apply((await send('/api/admin/todos/notion/connect', 'POST', { link })).data); setLink('') })
  const save = enabled => run('save', async () => {
    apply((await send('/api/admin/todos/notion', 'PUT', { mapping, user_map: userMap, ...(enabled !== undefined ? { enabled } : {}) })).data)
    if (enabled) await sync(true, false)
    else setNote('設定已儲存')
  })
  async function sync(full, wrap = true) {
    const go = async () => {
      const data = (await send(`/api/admin/todos/notion/sync${full ? '?full=true' : ''}`, 'POST')).data
      const details = (await api('/api/admin/todos/notion?details=true')).data
      apply(details)
      setNote(`同步完成：${result(data.pulled)}${data.pushed.created || data.pushed.updated ? `；寫入 Notion ${data.pushed.created + data.pushed.updated} 筆` : ''}`)
      onSynced()
    }
    return wrap ? run(full ? 'full' : 'sync', go) : go()
  }
  const disconnect = () => run('off', async () => {
    if (!window.confirm('停止和 Notion 同步？看板上的待辦都會保留，Notion 也不會被刪除。')) return
    await api('/api/admin/todos/notion', { method: 'DELETE' })
    apply((await api('/api/admin/todos/notion?details=true')).data); onSynced()
  })

  const columns = state?.columns || []
  const configured = state && state.mapping
  return <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="notion-title"><div className={`${styles.modal} ${styles.employeeModal}`}>
    <button type="button" className={styles.modalClose} onClick={onClose} aria-label="關閉"><X size={18} /></button>
    <h2 id="notion-title">Notion 待辦同步</h2>
    {!state ? <p className={styles.hint}>{error || '讀取中…'}</p> : <>
      <p className={styles.hint}>連接後，Notion 待辦資料庫和這個看板會雙向同步：Notion 的事項會出現在看板上，在看板或 AI Team 裡新增、完成、改負責人，也會寫回 Notion。Team Lead 可以幫忙整理重複、過時和沒人負責的事項。</p>
      {!state.token_configured && <p className={page.warn}>⚠️ 後端還沒有設定 NOTION_TOKEN（和財務報帳共用同一個 Notion integration）。</p>}

      {configured && <div className={page.syncStatus}>
        <div><strong>{state.title}</strong>{state.url && <a href={state.url} target="_blank" rel="noreferrer"><ExternalLink size={13} />在 Notion 打開</a>}</div>
        {state.connected ? <>
          <div>上次同步：{ago(state.last_pull_at)}{state.last_result ? ` · ${result(state.last_result)}` : ''}</div>
          <div>已連結 {state.linked} 筆{state.pending ? ` · ${state.pending} 筆等待寫入 Notion` : ''}</div>
        </> : <div>{state.last_pull_at ? '目前已停止同步。' : '已讀到這個資料庫。'}確認下面的欄位對應後，按「開始同步」。</div>}
        {state.last_error && <div className={page.warn}>上次錯誤：{state.last_error}</div>}
      </div>}

      {canManage && <details className={page.steps} open={!configured}>
        <summary>{configured ? '換一個 Notion 資料庫' : '怎麼連接'}</summary>
        <ol>
          <li>在 Notion 打開放待辦的資料庫（表格或看板）頁面。</li>
          <li>右上角「⋯」→「連線（Connections）」→ 加入公司的 integration（就是財務報帳用的那一個）。</li>
          <li>右上角「分享」→「複製連結」，貼到下面。</li>
        </ol>
        <div className={page.linkRow}>
          <input className={styles.input} placeholder="https://www.notion.so/…" value={link} onChange={e => setLink(e.target.value)} />
          <button type="button" className={styles.btnPrimary} disabled={!link.trim() || !!busy} onClick={connect}>{busy === 'connect' ? '讀取中…' : '連接'}</button>
        </div>
      </details>}

      {configured && <>
        <h3 className={page.subhead}>欄位對應</h3>
        <p className={styles.hint}>系統已依欄位名稱自動判斷，不對的地方可以改。沒有的欄位選「不同步」。</p>
        <div className={page.mapGrid}>{FIELDS.map(([field, label]) => <label key={field}>
          <span>{label}</span>
          <select className={styles.input} disabled={!canManage} value={mapping[field] || ''} onChange={e => setMapping({ ...mapping, [field]: e.target.value || null })}>
            {field !== 'title' && <option value="">不同步</option>}
            {columns.filter(c => (state.field_types?.[field] || []).includes(c.type)).map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
        </label>)}</div>
        {state.status_options?.length > 0 && <p className={styles.hint}>狀態對應：{state.status_options.map(o => `${o.name} → ${LOCAL[o.local]}`).join('、')}</p>}

        {state.notion_users?.length > 0 && <>
          <h3 className={page.subhead}>Notion 成員對應</h3>
          <p className={styles.hint}>預設用 email 或名字自動配對；名字不一樣的同事在這裡選。沒有對應的人會顯示為「（Notion）」負責人。</p>
          <div className={page.mapGrid}>{state.notion_users.map(u => <label key={u.id}>
            <span title={u.email}>{u.name || u.email}</span>
            <select className={styles.input} disabled={!canManage} value={userMap[u.id] || ''} onChange={e => setUserMap({ ...userMap, [u.id]: e.target.value ? Number(e.target.value) : undefined })}>
              <option value="">自動配對</option>
              {people.people.map(p => <option key={p.id} value={p.id}>{p.display_name}</option>)}
            </select>
          </label>)}</div>
        </>}
      </>}

      {note && <p role="status" className={page.ok}>{note}</p>}
      {error && <p role="alert" className={styles.loginError}>{error}</p>}
      <div className={styles.modalActions} style={{ flexWrap: 'wrap' }}>
        {state.connected && canManage && <button type="button" className={styles.btnSecondary} onClick={disconnect} disabled={!!busy}><Unplug size={14} />停止同步</button>}
        {state.connected && <button type="button" className={styles.btnSecondary} onClick={() => sync(true)} disabled={!!busy} title="重新讀取整個資料庫，並關閉 Notion 已刪除的事項">{busy === 'full' ? '同步中…' : '全部重新同步'}</button>}
        {state.connected && <button type="button" className={styles.btnSecondary} onClick={() => sync(false)} disabled={!!busy}><RefreshCw size={14} />{busy === 'sync' ? '同步中…' : '立即同步'}</button>}
        {configured && canManage && (state.connected
          ? <button type="button" className={styles.btnPrimary} onClick={() => save()} disabled={!!busy}>{busy === 'save' ? '儲存中…' : '儲存設定'}</button>
          : <button type="button" className={styles.btnPrimary} onClick={() => save(true)} disabled={!!busy || !mapping.title}>{busy === 'save' ? '匯入中…（事項多會需要一點時間）' : '開始同步'}</button>)}
      </div>
    </>}
  </div></div>
}
