'use client'
import { Suspense, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Plus, Bot, CalendarDays, Hash, X, RotateCcw, Play, Check, RefreshCw, ExternalLink, CloudOff } from 'lucide-react'
import { adminFetch, useAdmin } from '../AdminWorkspace'
import styles from '../admin.module.css'
import page from './todos.module.css'
import NotionDialog, { ago } from './NotionDialog'

const COLUMNS = [['todo', '待辦'], ['doing', '進行中'], ['done', '完成']]
const STATUS = { todo: '待辦', doing: '進行中', done: '完成', cancelled: '取消' }
const PRIORITY = { high: '高', normal: '中', low: '低' }
const FIELD = { title: '標題', description: '說明', status: '狀態', priority: '優先', assignee_user_id: '負責員工', assignee_agent_id: '負責 AI', due_date: '期限', external_assignee: '負責人（Notion）' }
const EMPTY = { title: '', description: '', status: 'todo', priority: 'normal', assignee: '', due_date: '' }

async function api(url, options) {
  const response = await adminFetch(url, options)
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.success === false) throw new Error(data.message || data.detail || '操作失敗，請稍後再試')
  return data
}
const send = (url, method, body) => api(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
const today = () => new Date(Date.now() + 8 * 3600 * 1000).toISOString().slice(0, 10)

function assigneeValue(todo) {
  return todo.assignee ? `${todo.assignee.type}:${todo.assignee.id ?? ''}` : ''
}
const toEditing = t => ({ ...t, assignee: assigneeValue(t), due_date: t.due_date || '', external_name: t.assignee?.type === 'external' ? t.assignee.name : null })
function assigneeName(assignee) {
  if (!assignee) return '未指派'
  return assignee.type === 'agent' ? `AI ${assignee.name}` : assignee.type === 'external' ? `${assignee.name}（Notion）` : assignee.name
}
function assigneeFields(value) {
  const [type, id] = value.split(':')
  return { assignee_user_id: type === 'user' ? Number(id) : null, assignee_agent_id: type === 'agent' ? Number(id) : null }
}

export default function TodosPageWithParams() {
  return <Suspense fallback={null}><TodosPage /></Suspense>
}

function TodosPage() {
  const { user } = useAdmin()
  const params = useSearchParams()
  const [todos, setTodos] = useState([])
  const [people, setPeople] = useState({ people: [], agents: [] })
  const [mine, setMine] = useState(false)
  const [showCancelled, setShowCancelled] = useState(false)
  const [editing, setEditing] = useState(null)
  const [message, setMessage] = useState('')
  const [notion, setNotion] = useState(null)
  const [notionOpen, setNotionOpen] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const canManage = user.permissions.includes('todos.manage')

  const load = useCallback(async () => {
    try {
      const data = await api(`/api/admin/todos?${new URLSearchParams({ mine: String(mine) })}`)
      setTodos(data.data)
    } catch (e) { setMessage(e.message) }
  }, [mine])
  useEffect(() => { load(); const timer = setInterval(load, 15000); return () => clearInterval(timer) }, [load])
  useEffect(() => { api('/api/admin/todos/assignees').then(d => setPeople(d.data)).catch(() => {}) }, [])
  // With Notion connected, pull its edits when the board opens and every minute while it stays open.
  const syncNotion = useCallback(async (quiet = true) => {
    setSyncing(true)
    try {
      const data = (await api('/api/admin/todos/notion/sync', { method: 'POST' })).data
      setNotion(data.status)
      if (data.pulled.imported || data.pulled.updated || data.pulled.removed || data.pushed.created) await load()
    } catch (e) { if (!quiet) setMessage(e.message) } finally { setSyncing(false) }
  }, [load])
  useEffect(() => {
    let timer
    api('/api/admin/todos/notion').then(d => {
      setNotion(d.data)
      if (d.data.connected) { syncNotion(); timer = setInterval(syncNotion, 60000) }
    }).catch(() => {})
    return () => clearInterval(timer)
  }, [syncNotion])
  useEffect(() => {
    const wanted = Number(params.get('todo'))
    const found = wanted && todos.find(t => t.id === wanted)
    if (found && !editing) setEditing(toEditing(found))
  }, [params, todos]) // eslint-disable-line react-hooks/exhaustive-deps

  async function move(todo, status) {
    try { await send(`/api/admin/todos/${todo.id}`, 'PATCH', { status }); await load() } catch (e) { setMessage(e.message) }
  }

  const visible = todos.filter(t => showCancelled || t.status !== 'cancelled')
  return <>
    <div className={page.toolbar}>
      <div className={styles.langTabs}>{[[false, '全部'], [true, '指派給我']].map(([value, label]) => <button key={label} className={`${styles.langTab} ${mine === value ? styles.langTabActive : ''}`} onClick={() => setMine(value)}>{label}</button>)}</div>
      <label className={page.check}><input type="checkbox" checked={showCancelled} onChange={e => setShowCancelled(e.target.checked)} />顯示已取消</label>
      {notion && (notion.connected
        ? <button className={page.notionChip} onClick={() => setNotionOpen(true)} title={notion.last_error || ''}>
          <span className={notion.last_error ? page.dotError : page.dotOk} />Notion · {syncing ? '同步中…' : ago(notion.last_pull_at)}
          <RefreshCw size={13} className={syncing ? page.spin : ''} onClick={e => { e.stopPropagation(); syncNotion(false) }} aria-label="立即同步" />
        </button>
        : canManage && <button className={page.notionChip} onClick={() => setNotionOpen(true)}><CloudOff size={13} />連接 Notion</button>)}
      {canManage && <button className={styles.btnPrimary} onClick={() => setEditing({ ...EMPTY })}><Plus size={16} />新增待辦</button>}
    </div>
    {message && <p className={styles.inlineMessage} role="status">{message}<button className={page.dismiss} onClick={() => setMessage('')} aria-label="關閉"><X size={14} /></button></p>}
    <div className={page.board}>
      {COLUMNS.map(([status, label]) => {
        const items = visible.filter(t => t.status === status || (status === 'done' && t.status === 'cancelled'))
        return <section key={status} className={page.column}>
          <header><span>{label}</span><span className={styles.countBadge}>{items.length}</span></header>
          {!items.length && <p className={page.empty}>{status === 'todo' ? '沒有待辦。討論後 Team Lead 也會幫忙建立。' : '—'}</p>}
          {items.map(t => {
            const overdue = t.due_date && t.status !== 'done' && t.status !== 'cancelled' && t.due_date < today()
            return <article key={t.id} className={`${page.card} ${t.status === 'cancelled' ? page.cancelled : ''}`} onClick={() => setEditing(toEditing(t))}>
              <div className={page.cardTop}><span className={page.id}>#{t.id}</span>{t.priority !== 'normal' && <span className={`${page.priority} ${page[t.priority]}`}>{PRIORITY[t.priority]}</span>}{t.created_by_ai && <span className={page.ai}><Bot size={11} />AI 建立</span>}{t.status === 'cancelled' && <span className={page.priority}>已取消</span>}{t.notion_url && <a className={page.notion} href={t.notion_url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} title={t.notion_pending ? '還沒寫入 Notion，稍後會自動同步' : '在 Notion 打開'}>N{t.notion_pending ? '…' : ''}</a>}</div>
              <h3>{t.title}</h3>
              <div className={page.meta}>
                <span className={page.who}>{assigneeName(t.assignee)}</span>
                {t.due_date && <span className={overdue ? page.overdue : ''}><CalendarDays size={12} />{t.due_date.slice(5).replace('-', '/')}</span>}
                {t.room_name && <span><Hash size={12} />{t.room_name}</span>}
              </div>
              {canManage && (t.status === 'todo' || t.status === 'doing') && <div className={page.quick} onClick={e => e.stopPropagation()}>
                {t.status === 'todo' && <button onClick={() => move(t, 'doing')}><Play size={11} />開始</button>}
                <button onClick={() => move(t, 'done')}><Check size={12} />完成</button>
              </div>}
            </article>
          })}
        </section>
      })}
    </div>
    {editing && <TodoDialog todo={editing} setTodo={setEditing} people={people} canManage={canManage} onSaved={async text => { setEditing(null); setMessage(text); await load() }} />}
    {notionOpen && <NotionDialog people={people} canManage={canManage} onClose={() => setNotionOpen(false)}
      onSynced={async () => { setNotion((await api('/api/admin/todos/notion')).data); await load() }} />}
  </>
}

function TodoDialog({ todo, setTodo, people, canManage, onSaved }) {
  const [events, setEvents] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const loadEvents = useCallback(() => {
    if (todo.id) api(`/api/admin/todos/${todo.id}/events`).then(d => setEvents(d.data)).catch(() => {})
  }, [todo.id])
  useEffect(() => { loadEvents() }, [loadEvents])
  const names = { user: Object.fromEntries(people.people.map(p => [p.id, p.display_name])), agent: Object.fromEntries(people.agents.map(a => [a.id, a.display_name])) }
  const show = (key, value) => value === null || value === '' || value === undefined ? '（空）'
    : key === 'status' ? STATUS[value] : key === 'priority' ? PRIORITY[value] : key === 'assignee_user_id' ? names.user[value] || `#${value}`
      : key === 'assignee_agent_id' ? `AI ${names.agent[value] || value}` : String(value).slice(0, 40)
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('')
    // A Notion-only assignee stays as it is unless someone else is picked.
    const keepExternal = (todo.assignee || '').startsWith('external:')
    const body = { title: todo.title, description: todo.description || null, status: todo.status, priority: todo.priority, due_date: todo.due_date || null, ...(keepExternal ? {} : assigneeFields(todo.assignee || '')) }
    try {
      if (todo.id) await send(`/api/admin/todos/${todo.id}`, 'PATCH', body)
      else await send('/api/admin/todos', 'POST', body)
      onSaved(todo.id ? '待辦已更新' : '待辦已新增')
    } catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  async function undo(event) {
    try { await send(`/api/admin/todos/events/${event.id}/undo`, 'POST', {}); onSaved('已復原這次變更') } catch (err) { setError(err.message) }
  }
  const disabled = !canManage
  return <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="todo-title"><form className={`${styles.modal} ${styles.employeeModal}`} onSubmit={submit}>
    <button type="button" className={styles.modalClose} onClick={() => setTodo(null)} aria-label="關閉"><X size={18} /></button>
    <h2 id="todo-title">{todo.id ? `待辦 #${todo.id}` : '新增待辦'}</h2>
    {todo.id && <p className={styles.hint}>由 {todo.created_by || '—'} 建立{todo.room_id && <> · 來自 <Link href={`/admin/ai-team?room=${todo.room_id}&message=${todo.source_message_id || ''}`}>#{todo.room_name}</Link></>}{todo.notion_url && <> · <a href={todo.notion_url} target="_blank" rel="noreferrer">在 Notion 打開 <ExternalLink size={12} /></a></>}</p>}
    <fieldset className={styles.form} disabled={disabled} style={{ border: 0 }}>
      <div className={styles.fieldGroup}><label className={styles.label} htmlFor="todo-name">標題</label><input id="todo-name" className={styles.input} required maxLength={200} value={todo.title} onChange={e => setTodo({ ...todo, title: e.target.value })} /></div>
      <div className={styles.fieldGroup}><label className={styles.label} htmlFor="todo-desc">說明</label><textarea id="todo-desc" className={styles.textarea} rows={3} maxLength={4000} value={todo.description || ''} onChange={e => setTodo({ ...todo, description: e.target.value })} /></div>
      <div className={styles.formColumns}>
        <div className={styles.fieldGroup}><label className={styles.label} htmlFor="todo-who">負責人</label><select id="todo-who" className={styles.input} value={todo.assignee || ''} onChange={e => setTodo({ ...todo, assignee: e.target.value })}>
          <option value="">未指派</option>
          {todo.assignee?.startsWith?.('external:') && <option value={todo.assignee}>{assigneeName({ type: 'external', name: todo.external_name })}</option>}
          <optgroup label="同事">{people.people.map(p => <option key={p.id} value={`user:${p.id}`}>{p.display_name}{p.job_title ? `（${p.job_title}）` : ''}</option>)}</optgroup>
          <optgroup label="AI 角色">{people.agents.map(a => <option key={a.id} value={`agent:${a.id}`}>AI {a.display_name}</option>)}</optgroup>
        </select></div>
        <div className={styles.fieldGroup}><label className={styles.label} htmlFor="todo-due">期限</label><input id="todo-due" type="date" className={styles.input} value={todo.due_date || ''} onChange={e => setTodo({ ...todo, due_date: e.target.value })} /></div>
      </div>
      <div className={styles.formColumns}>
        <div className={styles.fieldGroup}><label className={styles.label} htmlFor="todo-status">狀態</label><select id="todo-status" className={styles.input} value={todo.status} onChange={e => setTodo({ ...todo, status: e.target.value })}>{Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
        <div className={styles.fieldGroup}><label className={styles.label} htmlFor="todo-priority">優先順序</label><select id="todo-priority" className={styles.input} value={todo.priority} onChange={e => setTodo({ ...todo, priority: e.target.value })}>{Object.entries(PRIORITY).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
      </div>
    </fieldset>
    {events.length > 0 && <div className={page.history}><h3>變更紀錄</h3><ul>{events.map(ev => <li key={ev.id}>
      <span className={ev.by_ai ? page.ai : page.human}>{ev.by_ai && <Bot size={11} />}{ev.actor || (ev.action === 'imported' || ev.action === 'synced' ? 'Notion' : '系統')}</span>
      <span>{ev.action === 'created' ? '建立' : ev.action === 'imported' ? '從 Notion 匯入' : Object.entries(ev.changes).map(([k, [a, b]]) => `${FIELD[k] || k}：${show(k, a)} → ${show(k, b)}`).join('；')}</span>
      {ev.undone ? <em>已復原</em> : canManage && <button type="button" onClick={() => undo(ev)}><RotateCcw size={11} />{ev.action === 'created' || ev.action === 'imported' ? '取消這個待辦' : '復原'}</button>}
    </li>)}</ul></div>}
    {error && <p role="alert" className={styles.loginError}>{error}</p>}
    <div className={styles.modalActions}><button type="button" className={styles.btnSecondary} onClick={() => setTodo(null)}>關閉</button>{canManage && <button className={styles.btnPrimary} disabled={busy}>{busy ? '儲存中…' : '儲存'}</button>}</div>
  </form></div>
}
