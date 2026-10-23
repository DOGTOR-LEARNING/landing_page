'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import remarkCjkFriendly from 'remark-cjk-friendly'
import { Bot, Hash, Lock, Plus, Send, Square, RotateCcw, Users, X, ChevronUp, Info, Sparkles } from 'lucide-react'
import { adminFetch, useAdmin } from '../AdminWorkspace'
import styles from '../admin.module.css'
import chat from './ai-team.module.css'

const MAX_CHARS = 4000
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const POLL_MS = 3000
const ERRORS = {
  provider_not_configured: 'AI 服務尚未設定（後端缺少 OPENAI_API_KEY）。',
  provider_timeout: 'AI 回覆逾時，請重試。',
  provider_rate_limited: 'AI 服務目前忙碌，請稍後重試。',
  provider_error: 'AI 服務發生錯誤，請重試。',
  provider_not_supported: '這個 AI 角色設定的服務尚未支援。',
  empty_reply: 'AI 沒有回覆內容，請重試。',
  reply_too_long: '回覆超過長度上限，請把問題拆小或請管理員調高上限。',
  timeout: '回覆沒有完成（可能是發問的頁面被關閉），請重試。',
  agent_disabled: '這個 AI 角色已被停用。',
  internal_error: '系統發生錯誤，請重試。',
  cancelled: '已停止。',
}
const newRequestId = () => crypto.randomUUID().replace(/-/g, '')
const timeLabel = iso => new Intl.DateTimeFormat('zh-TW', { timeZone: 'Asia/Taipei', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))

async function api(url, options) {
  const response = await adminFetch(url, options)
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.success === false) throw new Error(data.message || data.detail || '操作失敗，請稍後再試')
  return data.data
}
const post = (url, body) => api(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body ?? {}) })

function mergeMessages(list, incoming) {
  if (!incoming.length) return list
  const byId = new Map(list.filter(m => m.id).map(m => [m.id, m]))
  const pending = list.filter(m => !m.id)
  for (const message of incoming) byId.set(message.id, message)
  const confirmed = new Set(incoming.map(m => m.client_request_id).filter(Boolean))
  return [...[...byId.values()].sort((a, b) => a.id - b.id), ...pending.filter(m => !confirmed.has(m.client_request_id))]
}

export default function AiTeamPage() {
  const { user } = useAdmin()
  const [rooms, setRooms] = useState([])
  const [roomId, setRoomId] = useState(null)
  const [agents, setAgents] = useState([])
  const [messages, setMessages] = useState([])
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [draft, setDraft] = useState('')
  const [mention, setMention] = useState(null)
  const [roomForm, setRoomForm] = useState(null)
  const [membersOpen, setMembersOpen] = useState(false)
  const cursor = useRef({ lastId: 0, since: null })
  const listRef = useRef(null)
  const stickToBottom = useRef(true)
  const canPost = user.permissions.includes('chat.post')
  const canManage = user.permissions.includes('chat.manage')
  const room = rooms.find(r => r.id === roomId)

  const loadRooms = useCallback(async () => {
    const data = await api('/api/admin/chat/rooms')
    setRooms(data)
    setRoomId(current => current && data.some(r => r.id === current) ? current : data[0]?.id ?? null)
  }, [])

  useEffect(() => {
    Promise.all([loadRooms(), api('/api/admin/agents').then(list => setAgents(list.filter(a => a.is_enabled)))])
      .catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [loadRooms])

  // Initial page of the selected room.
  useEffect(() => {
    if (!roomId) return
    let active = true
    setMessages([]); setHasMore(false); setError('')
    cursor.current = { lastId: 0, since: null }
    stickToBottom.current = true
    api(`/api/admin/chat/rooms/${roomId}/messages`).then(data => {
      if (!active) return
      setMessages(data.messages); setHasMore(data.has_more)
      cursor.current = { lastId: data.messages.at(-1)?.id || 0, since: data.server_time }
    }).catch(e => active && setError(e.message))
    return () => { active = false }
  }, [roomId])

  // Short polling: new rows after lastId, plus earlier rows changed since the
  // previous poll (agent replies finishing). Slower while the tab is hidden.
  useEffect(() => {
    if (!roomId) return
    let timer
    let stopped = false
    async function poll() {
      try {
        const { lastId, since } = cursor.current
        const params = new URLSearchParams({ after_id: String(lastId) })
        if (since) params.set('changed_since', since)
        const data = await api(`/api/admin/chat/rooms/${roomId}/messages?${params}`)
        if (stopped) return
        const incoming = [...data.changed, ...data.messages]
        if (incoming.length) setMessages(list => mergeMessages(list, incoming))
        cursor.current = { lastId: data.messages.at(-1)?.id || lastId, since: data.server_time }
      } catch { /* keep polling; the session handler redirects on 401 */ }
      if (!stopped) timer = setTimeout(poll, document.hidden ? POLL_MS * 4 : POLL_MS)
    }
    timer = setTimeout(poll, POLL_MS)
    return () => { stopped = true; clearTimeout(timer) }
  }, [roomId])

  useEffect(() => {
    const list = listRef.current
    if (list && stickToBottom.current) list.scrollTop = list.scrollHeight
  }, [messages])

  async function loadOlder() {
    const first = messages.find(m => m.id)
    if (!first) return
    const list = listRef.current
    const height = list.scrollHeight
    stickToBottom.current = false
    const data = await api(`/api/admin/chat/rooms/${roomId}/messages?before_id=${first.id}`).catch(e => { setError(e.message); return null })
    if (!data) return
    setMessages(current => mergeMessages(current, data.messages)); setHasMore(data.has_more)
    requestAnimationFrame(() => { list.scrollTop = list.scrollHeight - height })
  }

  // Each execute call advances a run by one step (a single reply, or one
  // turn of an @Team discussion); keep calling until it finishes. A fast
  // answer with no progress means someone else holds the step, so wait.
  const driving = useRef(new Set())
  const driveRun = useCallback(async runId => {
    if (driving.current.has(runId)) return
    driving.current.add(runId)
    try {
      for (let i = 0; i < 40; i++) {
        const started = Date.now()
        const state = await post(`/api/admin/chat/runs/${runId}/execute`)
        setMessages(list => mergeMessages(list, state.messages))
        if (state.run.finished) break
        if (Date.now() - started < 800) await sleep(1500)
      }
    } catch (e) { setError(e.message) }
    finally { driving.current.delete(runId) }
  }, [])
  const runAction = useCallback(async (runId, action) => {
    try {
      const state = await post(`/api/admin/chat/runs/${runId}/${action}`)
      setMessages(list => mergeMessages(list, state.messages))
      if (action === 'retry') driveRun(runId)
    } catch (e) { setError(e.message) }
  }, [driveRun])

  // After a reload, pick up runs this person started that are still going.
  useEffect(() => {
    for (const m of messages) {
      if (m.status === 'pending' && m.ai_run?.triggered_by_user_id === user.id && !driving.current.has(m.ai_run.id)) driveRun(m.ai_run.id)
    }
  }, [messages, user.id, driveRun])

  async function send(text, requestId = newRequestId()) {
    const content = text.trim()
    if (!content || !roomId) return
    stickToBottom.current = true
    const optimistic = { client_request_id: requestId, sender_type: 'human', sender_user_id: user.id, sender_name: user.display_name, content, status: 'sending', created_at: new Date().toISOString() }
    setMessages(list => [...list.filter(m => m.client_request_id !== requestId || m.id), optimistic])
    setDraft(''); setMention(null)
    try {
      const data = await post(`/api/admin/chat/rooms/${roomId}/messages`, { content, client_request_id: requestId })
      setMessages(list => mergeMessages(list, [data.message, ...data.agent_messages]))
      for (const reply of data.agent_messages) {
        if (reply.status === 'pending' && reply.ai_run?.triggered_by_user_id === user.id) driveRun(reply.ai_run.id)
      }
    } catch (e) {
      setMessages(list => list.map(m => m.client_request_id === requestId && !m.id ? { ...m, status: 'error', error: e.message } : m))
    }
  }

  function onDraftChange(value, caret) {
    setDraft(value)
    const match = value.slice(0, caret).match(/(^|\s)@([\w-]*)$/)
    setMention(match ? match[2].toLowerCase() : null)
  }
  const suggestions = useMemo(() => mention === null ? [] : agents.filter(a => a.slug.startsWith(mention) || a.display_name.toLowerCase().startsWith(mention)), [agents, mention])
  function insertMention(agent) {
    const name = agent.kind === 'lead' ? 'Team' : agent.display_name
    setDraft(current => current.replace(/(^|\s)@([\w-]*)$/, `$1@${name} `))
    setMention(null)
  }
  function onKeyDown(e) {
    if (e.nativeEvent.isComposing) return
    if (suggestions.length && (e.key === 'Tab' || e.key === 'Enter')) { e.preventDefault(); insertMention(suggestions[0]); return }
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (draft.length <= MAX_CHARS) send(draft) }
    if (e.key === 'Escape') setMention(null)
  }

  if (loading) return <p className={styles.hint}>載入聊天室…</p>
  return <div className={chat.shell}>
    <aside className={chat.rooms}>
      <div className={chat.roomsHead}><span>聊天室</span>{canManage && <button className={chat.iconButton} onClick={() => setRoomForm({ name: '', visibility: 'public', member_ids: [] })} aria-label="新增聊天室" title="新增聊天室"><Plus size={17} /></button>}</div>
      <nav className={chat.roomList}>{rooms.map(r => <button key={r.id} className={`${chat.roomItem} ${r.id === roomId ? chat.roomActive : ''}`} onClick={() => setRoomId(r.id)}>{r.visibility === 'private' ? <Lock size={15} /> : <Hash size={15} />}<span>{r.name}</span></button>)}</nav>
      <div className={chat.agentList}><span>AI 角色</span>{agents.map(a => <button key={a.id} type="button" className={a.kind === 'lead' ? chat.leadChip : ''} disabled={!canPost} onClick={() => setDraft(d => `${d}${d && !d.endsWith(' ') ? ' ' : ''}@${a.kind === 'lead' ? a.slug.replace(/^./, c => c.toUpperCase()) : a.display_name} `)} title={a.description}>{a.kind === 'lead' ? <Sparkles size={14} /> : <Bot size={14} />}{a.kind === 'lead' ? '@Team 團隊討論' : a.display_name}</button>)}</div>
    </aside>
    <section className={chat.main}>
      {!room ? <div className={styles.emptyState}><Hash size={30} /><p>目前沒有可進入的聊天室。</p></div> : <>
        <header className={chat.roomHeader}>
          <div><h2>{room.visibility === 'private' ? <Lock size={17} /> : <Hash size={17} />}{room.name}</h2><p>{room.visibility === 'private' ? '私人聊天室：只有成員看得到' : '公開聊天室：具聊天權限的夥伴都看得到'}</p></div>
          {room.visibility === 'private' && <button className={styles.smallButton} onClick={() => setMembersOpen(true)}><Users size={14} />成員</button>}
        </header>
        <div className={chat.messages} ref={listRef} onScroll={e => { const el = e.currentTarget; stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80 }} aria-live="polite">
          {hasMore && <button className={chat.older} onClick={loadOlder}><ChevronUp size={15} />載入更早的訊息</button>}
          {!messages.length && <div className={chat.welcome}><Bot size={30} /><h3>開始聊天吧</h3><p>輸入 <strong>@Finance</strong>、<strong>@Marketing</strong>、<strong>@Operations</strong> 或 <strong>@Engineering</strong> 請單一角色回覆；跨部門的問題輸入 <strong>@Team</strong>，由 Team Lead 安排角色討論並整理結論。</p></div>}
          {messages.map(m => <Message key={m.id || m.client_request_id} message={m} mine={m.sender_type === 'human' && m.sender_user_id === user.id} canPost={canPost} canManage={canManage} userId={user.id} onRun={runAction} onResend={() => send(m.content, m.client_request_id)} />)}
        </div>
        {error && <p role="alert" className={chat.error}>{error}<button onClick={() => setError('')} aria-label="關閉"><X size={14} /></button></p>}
        {canPost ? <form className={chat.composer} onSubmit={e => { e.preventDefault(); send(draft) }}>
          {suggestions.length > 0 && <ul className={chat.suggestions} role="listbox">{suggestions.map(a => <li key={a.id}><button type="button" onMouseDown={e => { e.preventDefault(); insertMention(a) }}>{a.kind === 'lead' ? <Sparkles size={15} /> : <Bot size={15} />}<strong>@{a.kind === 'lead' ? 'Team' : a.display_name}</strong><span>{a.description}</span></button></li>)}</ul>}
          <textarea value={draft} rows={2} maxLength={MAX_CHARS + 200} placeholder="輸入訊息，@角色 請 AI 回覆，@Team 啟動團隊討論（Enter 送出，Shift+Enter 換行）" onChange={e => onDraftChange(e.target.value, e.target.selectionStart)} onKeyDown={onKeyDown} aria-label="訊息內容" />
          <div className={chat.composerFoot}><span className={draft.length > MAX_CHARS ? chat.over : ''}><Info size={13} />AI 只提供建議，不會執行任何操作 · {draft.length}/{MAX_CHARS}</span><button className={styles.btnPrimary} disabled={!draft.trim() || draft.length > MAX_CHARS}><Send size={16} />送出</button></div>
        </form> : <p className={chat.readOnly}>你的帳號只有檢視權限，無法在聊天室發言。</p>}
      </>}
    </section>
    {roomForm && <RoomDialog form={roomForm} setForm={setRoomForm} onCreated={async created => { setRoomForm(null); await loadRooms(); setRoomId(created.id) }} />}
    {membersOpen && room && <MembersDialog room={room} canManage={canManage} onClose={() => setMembersOpen(false)} />}
  </div>
}

const STEP_LABEL = { plan: '分派任務', summary: '彙整結論' }

function Message({ message: m, mine, canPost, canManage, userId, onRun, onResend }) {
  const run = m.ai_run
  const isAgent = m.sender_type === 'agent'
  const owner = run && (run.triggered_by_user_id === userId || canManage)
  const team = run?.mode === 'team'
  const stepLabel = team && m.step ? STEP_LABEL[m.step.kind] || `第 ${m.step.round} 輪` : null
  const errorCode = m.step?.error_code || run?.error_code
  const tokens = (m.step?.token_input || 0) + (m.step?.token_output || 0)
  // A failed member turn inside a finished discussion cannot be retried on its own.
  const canRetry = canPost && run && ['failed', 'cancelled'].includes(run.status)
  return <article className={`${chat.message} ${mine ? chat.mine : ''} ${isAgent ? chat.agent : ''} ${m.step?.kind === 'summary' ? chat.summary : ''}`}>
    <div className={chat.meta}>{isAgent && <span className={chat.aiBadge}>{m.agent_slug === 'team' ? <Sparkles size={12} /> : <Bot size={12} />}AI</span>}<strong>{m.sender_name}</strong>{stepLabel && <span className={chat.stepBadge}>{stepLabel}</span>}{m.created_at && <time>{timeLabel(m.created_at)}</time>}</div>
    <div className={chat.bubble}>
      {m.status === 'pending' ? <span className={chat.typing}><i /><i /><i />{m.step?.kind === 'plan' || (team && !m.step && m.agent_slug === 'team') ? 'Team Lead 正在安排討論…' : `${m.sender_name} 正在思考…`}</span>
        : m.status === 'failed' || m.status === 'cancelled' ? <span className={chat.failed}>{ERRORS[errorCode] || '回覆失敗，請重試。'}</span>
          : isAgent ? <div className={chat.markdown}><ReactMarkdown remarkPlugins={[remarkGfm, remarkCjkFriendly, remarkBreaks]}>{m.content}</ReactMarkdown></div>
            : <p className={chat.text}>{m.content}</p>}
    </div>
    <div className={chat.footer}>
      {m.status === 'sending' && <span>傳送中…</span>}
      {m.status === 'error' && <><span className={chat.failedText}>{m.error || '傳送失敗'}</span><button onClick={onResend}><RotateCcw size={12} />重新傳送</button></>}
      {isAgent && run && <span title={`${m.step?.token_input || 0} 輸入 / ${m.step?.token_output || 0} 輸出 tokens`}>{run.model}{m.status === 'sent' && tokens ? ` · ${tokens} tokens` : ''}</span>}
      {m.status === 'pending' && owner && canPost && <button onClick={() => onRun(run.id, 'cancel')}><Square size={11} />{team ? '停止討論' : '停止'}</button>}
      {(m.status === 'failed' || m.status === 'cancelled') && canRetry && <button onClick={() => onRun(run.id, 'retry')}><RotateCcw size={12} />{team ? '繼續討論' : '重試'}</button>}
    </div>
  </article>
}

function RoomDialog({ form, setForm, onCreated }) {
  const [people, setPeople] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => { api('/api/admin/chat/people').then(setPeople).catch(() => {}) }, [])
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('')
    try { onCreated(await post('/api/admin/chat/rooms', form)) } catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  const toggle = id => setForm({ ...form, member_ids: form.member_ids.includes(id) ? form.member_ids.filter(x => x !== id) : [...form.member_ids, id] })
  return <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="room-title"><form className={`${styles.modal} ${styles.employeeModal}`} onSubmit={submit}>
    <button type="button" className={styles.modalClose} onClick={() => setForm(null)} aria-label="關閉"><X size={18} /></button>
    <h2 id="room-title">新增聊天室</h2><p className={styles.hint}>例如「產品」、「行銷」、「行政」。</p>
    <div className={styles.form}>
      <div className={styles.fieldGroup}><label className={styles.label} htmlFor="room-name">名稱</label><input id="room-name" className={styles.input} required maxLength={80} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
      <div className={styles.fieldGroup}><span className={styles.label}>誰可以進入</span><div className={chat.choice}>{[['public', '公開', '所有具聊天權限的夥伴'], ['private', '私人', '只有指定成員']].map(([value, title, desc]) => <label key={value} className={form.visibility === value ? chat.choiceActive : ''}><input type="radio" name="visibility" checked={form.visibility === value} onChange={() => setForm({ ...form, visibility: value })} /><strong>{title}</strong><span>{desc}</span></label>)}</div></div>
      {form.visibility === 'private' && <div className={styles.fieldGroup}><span className={styles.label}>成員（你會自動加入）</span><div className={chat.people}>{people.map(p => <label key={p.id}><input type="checkbox" checked={form.member_ids.includes(p.id)} onChange={() => toggle(p.id)} />{p.display_name}</label>)}</div></div>}
      {error && <p role="alert" className={styles.loginError}>{error}</p>}
      <div className={styles.modalActions}><button type="button" className={styles.btnSecondary} onClick={() => setForm(null)}>取消</button><button className={styles.btnPrimary} disabled={busy}>{busy ? '建立中…' : '建立聊天室'}</button></div>
    </div>
  </form></div>
}

function MembersDialog({ room, canManage, onClose }) {
  const [members, setMembers] = useState(null)
  const [people, setPeople] = useState([])
  const [selected, setSelected] = useState([])
  const [message, setMessage] = useState('')
  useEffect(() => {
    api(`/api/admin/chat/rooms/${room.id}/members`).then(d => { setMembers(d.members); setSelected(d.members.map(m => m.id)) }).catch(e => setMessage(e.message))
    if (canManage) api('/api/admin/chat/people').then(setPeople).catch(() => {})
  }, [room.id, canManage])
  async function save() {
    try { await api(`/api/admin/chat/rooms/${room.id}/members`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ member_ids: selected }) }); setMessage('成員已更新') } catch (e) { setMessage(e.message) }
  }
  return <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="members-title"><div className={`${styles.modal} ${styles.employeeModal}`}>
    <button type="button" className={styles.modalClose} onClick={onClose} aria-label="關閉"><X size={18} /></button>
    <h2 id="members-title">{room.name} 的成員</h2>
    {!members ? <p className={styles.hint}>載入中…</p> : canManage
      ? <div className={chat.people}>{people.map(p => <label key={p.id}><input type="checkbox" checked={selected.includes(p.id)} onChange={() => setSelected(s => s.includes(p.id) ? s.filter(x => x !== p.id) : [...s, p.id])} />{p.display_name}</label>)}</div>
      : <ul className={chat.memberList}>{members.map(m => <li key={m.id}>{m.display_name}</li>)}</ul>}
    {message && <p className={styles.hint} role="status">{message}</p>}
    <div className={styles.modalActions}><button className={styles.btnSecondary} onClick={onClose}>關閉</button>{canManage && <button className={styles.btnPrimary} onClick={save}>儲存成員</button>}</div>
  </div></div>
}
