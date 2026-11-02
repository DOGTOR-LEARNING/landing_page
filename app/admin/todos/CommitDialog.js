'use client'
import { useEffect, useState } from 'react'
import { X, GitCommitHorizontal, RotateCcw, ExternalLink } from 'lucide-react'
import { adminFetch } from '../AdminWorkspace'
import styles from '../admin.module.css'
import page from './todos.module.css'
import { ago } from './NotionDialog'

async function api(url, options) {
  const response = await adminFetch(url, options)
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.success === false) throw new Error(data.message || data.detail || '操作失敗，請稍後再試')
  return data
}
const send = (url, method, body) => api(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) })

function Commits({ commits }) {
  return <span className={page.commitRefs}>{commits.map(c => <a key={c.repo + c.sha} href={c.url} target="_blank" rel="noreferrer" title={c.title}>
    {c.repo.split('/').pop()}@{c.sha}<ExternalLink size={10} /></a>)}</span>
}

// Team Lead reads recent commits in the configured repos and closes the to-dos they finish.
export default function CommitDialog({ canManage, onClose, onChanged }) {
  const [state, setState] = useState(null)
  const [repos, setRepos] = useState('')
  const [days, setDays] = useState(14)
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [undone, setUndone] = useState({})

  function apply(data) { setState(data); setRepos(data.repos.join('\n')); setDays(data.days) }
  useEffect(() => { api('/api/admin/todos/commits').then(d => apply(d.data)).catch(e => setError(e.message)) }, [])

  async function run(label, fn) {
    setBusy(label); setError('')
    try { await fn() } catch (e) { setError(e.message) } finally { setBusy('') }
  }
  const settings = () => ({ repos: repos.split(/[\n,]/).map(r => r.trim()).filter(Boolean), days: Number(days) || 14 })
  const dirty = state && (settings().repos.join('\n') !== state.repos.join('\n') || settings().days !== state.days)
  const check = () => run('check', async () => {
    if (dirty) apply((await send('/api/admin/todos/commits', 'PUT', settings())).data)
    const data = (await send('/api/admin/todos/commits/check', 'POST')).data
    setResult(data); setUndone({})
    apply((await api('/api/admin/todos/commits')).data)
    if (data.closed.length) onChanged()
  })
  const undo = item => run(`undo-${item.id}`, async () => {
    await send(`/api/admin/todos/events/${item.event_id}/undo`, 'POST')
    setUndone({ ...undone, [item.id]: true }); onChanged()
  })

  return <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="commit-title"><div className={`${styles.modal} ${styles.employeeModal}`}>
    <button type="button" className={styles.modalClose} onClick={onClose} aria-label="關閉"><X size={18} /></button>
    <h2 id="commit-title">從 commit 檢查完成的待辦</h2>
    {!state ? <p className={styles.hint}>{error || '讀取中…'}</p> : <>
      <p className={styles.hint}>Team Lead 會讀這些 repo 預設分支最近的 commit，對照未完成的待辦：明確做完的直接改成「完成」（說明欄會註明依據的 commit，可以復原），只做一部分或不確定的列在下面請你確認。</p>
      {!state.token && <p className={page.warn}>⚠️ 後端還沒有設定 GITHUB_TOKEN，只能讀公開的 repo。</p>}
      {state.last_run && <div className={page.syncStatus}>
        <div>上次檢查：{ago(state.last_run.at)}{state.last_run.by ? `（${state.last_run.by}）` : ''} · 讀了 {state.last_run.commits} 個 commit，關閉 {state.last_run.closed} 筆，待確認 {state.last_run.maybe} 筆</div>
        {state.last_run.errors?.length > 0 && <div className={page.warn}>讀取失敗：{state.last_run.errors.join('、')}</div>}
      </div>}

      <div className={styles.formColumns}>
        <div className={styles.fieldGroup}><label className={styles.label} htmlFor="commit-repos">Repo（一行一個，擁有者/名稱）</label>
          <textarea id="commit-repos" className={styles.textarea} rows={3} disabled={!canManage} value={repos} onChange={e => setRepos(e.target.value)} placeholder="DOGTOR-LEARNING/dogtor_app" /></div>
        <div className={styles.fieldGroup}><label className={styles.label} htmlFor="commit-days">看最近幾天</label>
          <input id="commit-days" type="number" min={1} max={60} className={styles.input} disabled={!canManage} value={days} onChange={e => setDays(e.target.value)} /></div>
      </div>

      {result && <div className={page.commitResult}>
        <p className={styles.hint}>讀了 {result.commits} 個 commit{result.repos.filter(r => r.error).map(r => `；${r.repo} 讀取失敗：${r.error}`).join('')}</p>
        <h3 className={page.subhead}>已改成完成（{result.closed.length}）</h3>
        {!result.closed.length && <p className={styles.hint}>沒有找到可以確定完成的待辦。</p>}
        <ul>{result.closed.map(item => <li key={item.id}>
          <div><strong>#{item.id} {item.title}</strong>{undone[item.id] ? <em>已復原</em> : canManage &&
            <button type="button" onClick={() => undo(item)} disabled={!!busy}><RotateCcw size={11} />復原</button>}</div>
          <span>{item.reason}</span><Commits commits={item.commits} />
        </li>)}</ul>
        {result.maybe.length > 0 && <>
          <h3 className={page.subhead}>請你確認（{result.maybe.length}）</h3>
          <ul>{result.maybe.map(item => <li key={item.id}>
            <div><strong>#{item.id} {item.title}</strong></div>
            <span>{item.reason}</span>{item.commits.length > 0 && <Commits commits={item.commits} />}
          </li>)}</ul>
        </>}
      </div>}

      {error && <p role="alert" className={styles.loginError}>{error}</p>}
      <div className={styles.modalActions}>
        <button type="button" className={styles.btnSecondary} onClick={onClose}>關閉</button>
        {canManage && <button type="button" className={styles.btnPrimary} onClick={check} disabled={!!busy}>
          <GitCommitHorizontal size={15} />{busy === 'check' ? 'Team Lead 檢查中…（約 30 秒）' : '開始檢查'}</button>}
      </div>
    </>}
  </div></div>
}
