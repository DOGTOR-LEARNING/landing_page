'use client'
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import remarkCjkFriendly from 'remark-cjk-friendly'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { Bot, Hash, Lock, Plus, Send, Square, RotateCcw, Users, X, ChevronUp, Info, Sparkles, Download, Brain, ListTodo, UserRound, Gavel, HelpCircle, AtSign, Trash2 } from 'lucide-react'
import { adminFetch, useAdmin } from '../AdminWorkspace'
import styles from '../admin.module.css'
import chat from './ai-team.module.css'

const MAX_CHARS = 4000
// "@name" being typed at the caret: not after an ASCII letter/digit (emails), any script for the name.
const MENTION_TAIL = /(^|[^A-Za-z0-9_.])@([^\s@]*)$/
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const POLL_MS = 3000
const ERRORS = {
  provider_not_configured: '這個角色使用的 AI 服務尚未設定 API 金鑰，請管理員到「AI 角色與用量」調整。',
  refused: 'AI 服務基於安全政策拒絕回答這個問題，請換個方式描述。',
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

export default function AiTeamPageWithParams() {
  return <Suspense fallback={null}><AiTeamPage /></Suspense>
}

function AiTeamPage() {
  const params = useSearchParams()
  const focusMessage = Number(params.get('message')) || null
  const { user } = useAdmin()
  const [rooms, setRooms] = useState([])
  const [roomId, setRoomId] = useState(null)
  const [agents, setAgents] = useState([])
  const [people, setPeople] = useState([])
  const [quickTodo, setQuickTodo] = useState(null)
  const [messages, setMessages] = useState([])
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [draft, setDraft] = useState('')
  const [mention, setMention] = useState(null)
  const [roomForm, setRoomForm] = useState(null)
  const [membersOpen, setMembersOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  // The guide opens until someone closes it once; storage can be unavailable (private mode).
  useEffect(() => {
    try { if (!localStorage.getItem('aiTeamGuideSeen')) setHelpOpen(true) } catch { /* keep it closed */ }
  }, [])
  function closeGuide() {
    setHelpOpen(false)
    try { localStorage.setItem('aiTeamGuideSeen', '1') } catch { /* fine: it just opens again next time */ }
  }
  const cursor = useRef({ lastId: 0, since: null })
  const listRef = useRef(null)
  const inputRef = useRef(null)

  // Phones: pin the chat to the visible viewport. When the keyboard opens iOS
  // shrinks the visual viewport and scrolls the page; follow both so the
  // composer stays above the keyboard and nothing behind the app shows.
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const root = document.documentElement
    const fit = () => {
      root.style.setProperty('--app-vh', `${vv.height}px`)
      root.style.setProperty('--app-top', `${vv.offsetTop}px`)
    }
    fit()
    vv.addEventListener('resize', fit)
    vv.addEventListener('scroll', fit)
    return () => {
      vv.removeEventListener('resize', fit); vv.removeEventListener('scroll', fit)
      root.style.removeProperty('--app-vh'); root.style.removeProperty('--app-top')
    }
  }, [])
  const stickToBottom = useRef(true)
  const scrolledTo = useRef(null)
  const canPost = user.permissions.includes('chat.post')
  const canManage = user.permissions.includes('chat.manage')
  const room = rooms.find(r => r.id === roomId)

  const loadRooms = useCallback(async () => {
    const data = await api('/api/admin/chat/rooms')
    setRooms(data)
    const linked = Number(new URLSearchParams(window.location.search).get('room'))
    setRoomId(current => current && data.some(r => r.id === current) ? current : data.some(r => r.id === linked) ? linked : data[0]?.id ?? null)
  }, [])

  useEffect(() => {
    api('/api/admin/chat/mentionable').then(setPeople).catch(() => {})
    Promise.all([loadRooms(), api('/api/admin/agents').then(list => setAgents(list.filter(a => a.is_enabled)))])
      .catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [loadRooms])

  // A notification link can point at another room while the page is open.
  useEffect(() => {
    const linked = Number(params.get('room'))
    if (linked && rooms.some(r => r.id === linked)) setRoomId(linked)
  }, [params, rooms])

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
    const target = focusMessage && scrolledTo.current !== focusMessage && list?.querySelector(`[data-message-id="${focusMessage}"]`)
    if (target) { target.scrollIntoView({ block: 'center' }); scrolledTo.current = focusMessage; stickToBottom.current = false; return }
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

  async function removeMessage(messageId) {
    if (!window.confirm('確定刪除這則訊息？刪除後大家都看不到內容，AI 也不會再讀到它。')) return
    try {
      await api(`/api/admin/chat/messages/${messageId}`, { method: 'DELETE' })
      setMessages(list => list.map(m => m.id === messageId ? { ...m, status: 'deleted', content: '' } : m))
    } catch (e) { setError(e.message) }
  }

  async function undoTodo(messageId, eventId) {
    try {
      await api(`/api/admin/todos/events/${eventId}/undo`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
      setMessages(list => list.map(m => m.id === messageId ? { ...m, actions: (m.actions || []).map(a => a.event_id === eventId ? { ...a, undone: true } : a) } : m))
    } catch (e) { setError(e.message) }
  }

  async function forget(messageId, memoryId) {
    try {
      await api(`/api/admin/agents/memories/${memoryId}`, { method: 'DELETE' })
      setMessages(list => list.map(m => m.id === messageId ? { ...m, memories: (m.memories || []).filter(x => x.id !== memoryId) } : m))
    } catch (e) { setError(e.message) }
  }

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
    const match = value.slice(0, caret).match(MENTION_TAIL)
    setMention(match ? match[2].toLowerCase() : null)
  }
  // AI roles and people both answer to @; people get a notification.
  const suggestions = useMemo(() => {
    if (mention === null) return []
    const ai = agents.filter(a => a.slug.startsWith(mention) || a.display_name.toLowerCase().startsWith(mention)).map(a => ({ ...a, type: 'agent' }))
    const humans = people.filter(p => p.id !== user.id && p.display_name.toLowerCase().startsWith(mention)).map(p => ({ ...p, type: 'person' }))
    return [...ai, ...humans].slice(0, 8)
  }, [agents, people, mention, user.id])
  function insertMention(item) {
    const name = item.type === 'person' ? item.display_name : item.kind === 'lead' ? 'Team' : item.display_name
    setDraft(current => current.replace(MENTION_TAIL, `$1@${name} `))
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
      <nav className={chat.roomList}>{rooms.map(r => <button key={r.id} className={`${chat.roomItem} ${r.id === roomId ? chat.roomActive : ''}`} onClick={() => setRoomId(r.id)}>{r.visibility === 'private' ? <Lock size={15} /> : <Hash size={15} />}<span>{r.name}</span></button>)}{canManage && <button className={`${chat.iconButton} ${chat.roomAddInline}`} onClick={() => setRoomForm({ name: '', visibility: 'public', member_ids: [] })} aria-label="新增聊天室" title="新增聊天室"><Plus size={16} /></button>}</nav>
      <div className={chat.agentList}><span>AI 角色</span>{agents.map(a => <button key={a.id} type="button" className={a.kind === 'lead' ? chat.leadChip : ''} disabled={!canPost} onClick={() => setDraft(d => `${d}${d && !d.endsWith(' ') ? ' ' : ''}@${a.kind === 'lead' ? a.slug.replace(/^./, c => c.toUpperCase()) : a.display_name} `)} title={a.description}>{a.kind === 'lead' ? <Sparkles size={14} /> : <Bot size={14} />}{a.kind === 'lead' ? '@Team 團隊討論' : a.display_name}</button>)}</div>
    </aside>
    <section className={chat.main}>
      {!room ? <div className={styles.emptyState}><Hash size={30} /><p>目前沒有可進入的聊天室。</p></div> : <>
        <header className={chat.roomHeader}>
          <div><h2>{room.visibility === 'private' ? <Lock size={17} /> : <Hash size={17} />}{room.name}</h2><p>{room.visibility === 'private' ? '私人聊天室：只有成員看得到' : '公開聊天室：具聊天權限的夥伴都看得到'}</p></div>
          <div className={chat.headerActions}>{room.visibility === 'private' && <button className={styles.smallButton} onClick={() => setMembersOpen(true)} aria-label="成員"><Users size={14} /><span className={chat.btnText}>成員</span></button>}<button className={styles.smallButton} onClick={() => setHelpOpen(true)} aria-label="使用說明"><HelpCircle size={14} /><span className={chat.btnText}>使用說明</span></button></div>
        </header>
        <div className={chat.messages} ref={listRef} onScroll={e => { const el = e.currentTarget; stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80 }} aria-live="polite">
          {hasMore && <button className={chat.older} onClick={loadOlder}><ChevronUp size={15} />載入更早的訊息</button>}
          {!messages.length && <div className={chat.welcome}><Bot size={30} /><h3>開始聊天吧</h3><p>輸入 <strong>@Finance</strong>、<strong>@Marketing</strong>、<strong>@Operations</strong> 或 <strong>@Engineering</strong> 請單一角色回覆；跨部門的問題輸入 <strong>@Team</strong>，由 Team Lead 挑選角色討論，每輪結束後決定誰需要再發言（最多 3 輪），最後整理結論。想指定參與者就寫 <strong>@Team @Finance @Marketing</strong>。</p></div>}
          {messages.map(m => <Message key={m.id || m.client_request_id} focused={m.id === focusMessage} canTodo={user.permissions.includes('todos.manage')} onTodo={setQuickTodo} onUndoTodo={undoTodo} onDelete={removeMessage} message={m} mine={m.sender_type === 'human' && m.sender_user_id === user.id} canPost={canPost} canManage={canManage} userId={user.id} onRun={runAction} onForget={forget} canForget={m => user.permissions.includes('agents.manage') || m.ai_run?.triggered_by_user_id === user.id} onResend={() => send(m.content, m.client_request_id)} />)}
        </div>
        {error && <p role="alert" className={chat.error}>{error}<button onClick={() => setError('')} aria-label="關閉"><X size={14} /></button></p>}
        {canPost ? <form className={chat.composer} onSubmit={e => { e.preventDefault(); send(draft) }}>
          {suggestions.length > 0 && <ul className={chat.suggestions} role="listbox">{suggestions.map(a => <li key={`${a.type}-${a.id}`}><button type="button" onMouseDown={e => { e.preventDefault(); insertMention(a) }}>{a.type === 'person' ? <UserRound size={15} /> : a.kind === 'lead' ? <Sparkles size={15} /> : <Bot size={15} />}<strong>@{a.type === 'person' ? a.display_name : a.kind === 'lead' ? 'Team' : a.display_name}</strong><span>{a.type === 'person' ? `${a.job_title || '同事'} · 會收到通知` : a.description}</span></button></li>)}</ul>}
          <textarea ref={inputRef} value={draft} rows={2} maxLength={MAX_CHARS + 200} placeholder="輸入訊息…（@ 可以叫 AI 角色或同事）" onChange={e => onDraftChange(e.target.value, e.target.selectionStart)} onKeyDown={onKeyDown} aria-label="訊息內容" />
          <div className={chat.composerFoot}>
            <button type="button" className={chat.atButton} aria-label="選擇要 @ 的 AI 角色或同事" title="@ AI 角色或同事" onClick={() => {
              const next = `${draft}${draft && !draft.endsWith(' ') ? ' ' : ''}@`
              setDraft(next); setMention('')
              requestAnimationFrame(() => { inputRef.current?.focus(); inputRef.current?.setSelectionRange(next.length, next.length) })
            }}><AtSign size={15} />提及</button>
            <span className={`${chat.footHint} ${draft.length > MAX_CHARS * 0.75 ? chat.nearLimit : ''} ${draft.length > MAX_CHARS ? chat.over : ''}`}><Info size={13} /><span className={chat.btnText}>AI 只提供建議，不會執行任何操作 · </span>{draft.length}/{MAX_CHARS}</span>
            <button className={styles.btnPrimary} disabled={!draft.trim() || draft.length > MAX_CHARS} aria-label="送出"><Send size={16} /><span className={chat.btnText}>送出</span></button>
          </div>
        </form> : <p className={chat.readOnly}>你的帳號只有檢視權限，無法在聊天室發言。</p>}
      </>}
    </section>
    {quickTodo && <QuickTodo message={quickTodo} people={people} agents={agents} onClose={done => { setQuickTodo(null); if (done) setError(done) }} />}
    {roomForm && <RoomDialog form={roomForm} setForm={setRoomForm} onCreated={async created => { setRoomForm(null); await loadRooms(); setRoomId(created.id) }} />}
    {helpOpen && <GuideDialog onClose={closeGuide} />}
    {membersOpen && room && <MembersDialog room={room} canManage={canManage} onClose={() => setMembersOpen(false)} />}
  </div>
}

const STEP_LABEL = { plan: '分派任務', summary: '彙整結論' }
const STATUS_TEXT = { todo: '待辦', doing: '進行中', done: '完成', cancelled: '取消' }

function QuickTodo({ message, people, agents, onClose }) {
  const firstLine = message.content.replace(/[#*>`$_~-]/g, '').split('\n').map(l => l.trim()).find(Boolean) || ''
  const [title, setTitle] = useState(firstLine.slice(0, 120))
  const [assignee, setAssignee] = useState('')
  const [due, setDue] = useState('')
  const [error, setError] = useState('')
  async function submit(e) {
    e.preventDefault()
    const [type, id] = assignee.split(':')
    try {
      await api('/api/admin/todos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        title, source_message_id: message.id, due_date: due || null,
        assignee_user_id: type === 'user' ? Number(id) : null, assignee_agent_id: type === 'agent' ? Number(id) : null }) })
      onClose('已加入待辦')
    } catch (err) { setError(err.message) }
  }
  return <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="quick-todo"><form className={`${styles.modal} ${styles.employeeModal}`} onSubmit={submit}>
    <button type="button" className={styles.modalClose} onClick={() => onClose()} aria-label="關閉"><X size={18} /></button>
    <h2 id="quick-todo">加入待辦</h2><p className={styles.hint}>來自 {message.sender_name} 的訊息，待辦會連回這則訊息。</p>
    <div className={styles.form}>
      <div className={styles.fieldGroup}><label className={styles.label} htmlFor="qt-title">標題</label><input id="qt-title" className={styles.input} required maxLength={200} value={title} onChange={e => setTitle(e.target.value)} /></div>
      <div className={styles.formColumns}>
        <div className={styles.fieldGroup}><label className={styles.label} htmlFor="qt-who">負責人</label><select id="qt-who" className={styles.input} value={assignee} onChange={e => setAssignee(e.target.value)}><option value="">未指派</option><optgroup label="同事">{people.map(p => <option key={p.id} value={`user:${p.id}`}>{p.display_name}</option>)}</optgroup><optgroup label="AI 角色">{agents.map(a => <option key={a.id} value={`agent:${a.id}`}>AI {a.display_name}</option>)}</optgroup></select></div>
        <div className={styles.fieldGroup}><label className={styles.label} htmlFor="qt-due">期限</label><input id="qt-due" type="date" className={styles.input} value={due} onChange={e => setDue(e.target.value)} /></div>
      </div>
      {error && <p role="alert" className={styles.loginError}>{error}</p>}
      <div className={styles.modalActions}><button type="button" className={styles.btnSecondary} onClick={() => onClose()}>取消</button><button className={styles.btnPrimary}>加入待辦</button></div>
    </div>
  </form></div>
}
const REMARK = [remarkGfm, remarkCjkFriendly, remarkMath, remarkBreaks]
const REHYPE = [[rehypeKatex, { throwOnError: false, strict: 'ignore' }]]

// People and AI share one renderer: Markdown plus KaTeX ($...$ / $$...$$).
// No raw HTML is rendered and KaTeX runs untrusted, so messages cannot inject markup.
// Models often write "$$ formula" across lines with the closing $$ glued to
// the last line (inside a list item), which remark-math cannot parse; fold
// such a span onto one line. Real blocks ($$ on its own line) are untouched.
// Some models (e.g. DeepSeek) also write \[ \] / \( \) delimiters; turn those into $$ / $ first.
const foldDisplayMath = text => text
  .replace(/\\\[([\s\S]+?)\\\]/g, (_, body) => `$$${body}$$`)
  .replace(/\\\(([\s\S]+?)\\\)/g, (_, body) => `$${body}$`)
  .replace(/\$\$(?!\s*\n)([\s\S]+?)\$\$/g, (_, body) => `$$${body.replace(/\s*\n\s*/g, ' ')}$$`)

function ChatMarkdown({ children }) {
  return <div className={chat.markdown}><ReactMarkdown remarkPlugins={REMARK} rehypePlugins={REHYPE}>{foldDisplayMath(children)}</ReactMarkdown></div>
}

async function downloadReport(runId) {
  const data = await api(`/api/admin/chat/runs/${runId}/report`)
  const url = URL.createObjectURL(new Blob([data.markdown], { type: 'text/markdown;charset=utf-8' }))
  const link = Object.assign(document.createElement('a'), { href: url, download: data.filename })
  document.body.appendChild(link); link.click(); link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// Team Lead's planning and between-round decisions are for the AI roles, so the
// chat shows them as one line (details on tap) instead of a full bubble.
function teamLeadLine(m) {
  const names = [...(m.content || '').matchAll(/\*\*(.+?)\*\*/g)].map(x => x[1])
  if (m.status === 'pending') return m.step?.kind === 'review' ? `Team Lead 正在判斷第 ${m.step.round} 輪後誰要再發言…` : 'Team Lead 正在分工…'
  if (m.step?.kind === 'review') {
    return m.content.includes('由以下角色發言') ? `第 ${m.step.round} 輪後：請 ${names.join('、')} 再回應` : `第 ${m.step.round} 輪後：討論已足夠，開始彙整`
  }
  if (m.content.includes('由 Team Lead 直接回覆')) return 'Team Lead 直接處理這件事'
  return names.length ? `Team Lead 分工給 ${names.join('、')}` : 'Team Lead 已安排討論'
}

function Message({ message: m, mine, canPost, canManage, userId, onRun, onResend, onForget, canForget, focused, canTodo, onTodo, onUndoTodo, onDelete }) {
  const run = m.ai_run
  const isAgent = m.sender_type === 'agent'
  const owner = run && (run.triggered_by_user_id === userId || canManage)
  const team = run?.mode === 'team'
  const stepLabel = team && m.step ? (m.step.kind === 'review' ? `第 ${m.step.round} 輪後 · 安排下一步` : STEP_LABEL[m.step.kind] || `第 ${m.step.round} 輪`) : null
  const errorCode = m.step?.error_code || run?.error_code
  const tokens = (m.step?.token_input || 0) + (m.step?.token_output || 0)
  // A failed member turn inside a finished discussion cannot be retried on its own.
  const canRetry = canPost && run && ['failed', 'cancelled'].includes(run.status)
  const canDelete = m.id && m.status !== 'pending' && (canManage || mine)
  if (m.status === 'deleted') {
    return <article data-message-id={m.id} className={`${chat.message} ${mine ? chat.mine : ''} ${chat.deleted}`}><p><Trash2 size={12} />{m.sender_name} 的訊息已刪除</p></article>
  }
  const leadNote = team && m.agent_slug === 'team' && (['plan', 'review'].includes(m.step?.kind) || (m.status === 'pending' && !m.step))
  if (leadNote && m.status !== 'failed' && m.status !== 'cancelled') {
    return <article data-message-id={m.id || undefined} className={`${chat.leadNote} ${focused ? chat.focused : ''}`}>
      {m.status === 'pending' ? <p><span className={chat.typing}><i /><i /><i /></span>{teamLeadLine(m)}{owner && canPost && <button onClick={() => onRun(run.id, 'cancel')}><Square size={10} />停止討論</button>}</p>
        : <details><summary><Sparkles size={12} />{teamLeadLine(m)}</summary><div className={chat.leadDetail}><ChatMarkdown>{m.content}</ChatMarkdown></div></details>}
    </article>
  }
  return <article data-message-id={m.id || undefined} className={`${chat.message} ${focused ? chat.focused : ''} ${mine ? chat.mine : ''} ${isAgent ? chat.agent : ''} ${m.step?.kind === 'summary' ? chat.summary : ''} ${m.step?.kind === 'review' ? chat.review : ''}`}>
    <div className={chat.meta}>{isAgent && <span className={chat.aiBadge}>{m.agent_slug === 'team' ? <Sparkles size={12} /> : <Bot size={12} />}AI</span>}<strong title={m.sender_bio || undefined}>{m.sender_name}</strong>{m.sender_title && <span className={chat.titleBadge} title={m.sender_bio || undefined}>{m.sender_title}</span>}{stepLabel && <span className={chat.stepBadge}>{stepLabel}</span>}{m.created_at && <time>{timeLabel(m.created_at)}</time>}</div>
    <div className={chat.bubble}>
      {m.status === 'pending' ? <span className={chat.typing}><i /><i /><i />{m.step?.kind === 'plan' || (team && !m.step && m.agent_slug === 'team') ? 'Team Lead 正在安排討論…' : m.step?.kind === 'review' ? 'Team Lead 正在判斷誰需要再發言…' : m.step?.kind === 'summary' ? 'Team Lead 正在彙整結論…' : `${m.sender_name} 正在思考…`}</span>
        : m.status === 'failed' || m.status === 'cancelled' ? <span className={chat.failed}>{ERRORS[errorCode] || '回覆失敗，請重試。'}</span>
          : <ChatMarkdown>{m.content}</ChatMarkdown>}
    </div>
    {m.memories?.length > 0 && <ul className={chat.memories}>{m.memories.map(x => <li key={x.id}><Brain size={12} /><span>{m.sender_name} 記住了：{x.content}</span>{canForget(m) && <button onClick={() => onForget(m.id, x.id)}>撤銷</button>}</li>)}</ul>}
    {m.actions?.length > 0 && <ul className={chat.actions}>{m.actions.map((a, i) => <li key={i} className={a.undone ? chat.undone : ''}>
      {a.type === 'decision' ? <><Gavel size={12} /><span>已請 <strong>{a.who}</strong> 決策：{a.question}</span></>
        : <><ListTodo size={12} /><span>{a.type === 'todo_created' ? '新增待辦' : '更新待辦'} <Link href={`/admin/todos?todo=${a.todo_id}`}>#{a.todo_id} {a.title}</Link>{a.type === 'todo_updated' && a.changes.status ? `（${STATUS_TEXT[a.changes.status[0]]} → ${STATUS_TEXT[a.changes.status[1]]}）` : ''}{a.undone ? '（已復原）' : ''}</span>
          {canTodo && !a.undone && <button onClick={() => onUndoTodo(m.id, a.event_id)}>{a.type === 'todo_created' ? '取消' : '復原'}</button>}</>}
    </li>)}</ul>}
    <div className={chat.footer}>
      {m.status === 'sending' && <span>傳送中…</span>}
      {m.status === 'error' && <><span className={chat.failedText}>{m.error || '傳送失敗'}</span><button onClick={onResend}><RotateCcw size={12} />重新傳送</button></>}
      {isAgent && run && <span title={`${m.step?.token_input || 0} 輸入 / ${m.step?.token_output || 0} 輸出 tokens`}>{run.model}{m.status === 'sent' && tokens ? ` · ${tokens} tokens` : ''}</span>}
      {m.status === 'pending' && owner && canPost && <button onClick={() => onRun(run.id, 'cancel')}><Square size={11} />{team ? '停止討論' : '停止'}</button>}
      {(m.status === 'failed' || m.status === 'cancelled') && canRetry && <button onClick={() => onRun(run.id, 'retry')}><RotateCcw size={12} />{team ? '繼續討論' : '重試'}</button>}
      {m.status === 'sent' && run?.status === 'succeeded' && (team ? m.step?.kind === 'summary' : true) && <button onClick={() => downloadReport(run.id).catch(e => alert(e.message))}><Download size={12} />{team ? '下載最終結論 .md' : '下載 .md'}</button>}
      {canTodo && m.id && m.status === 'sent' && m.content && <button onClick={() => onTodo(m)} aria-label="加入待辦" title="加入待辦"><ListTodo size={12} /><span className={chat.btnText}>加入待辦</span></button>}
      {canDelete && <button className={chat.deleteButton} onClick={() => onDelete(m.id)} aria-label="刪除訊息" title="刪除訊息"><Trash2 size={12} /></button>}
    </div>
  </article>
}

const GUIDE = [
  ['💬 跟同事聊天', '像一般群組一樣直接打字。輸入 @同事名字 會通知他（例如「@Pierre 這個請你拍板」），他會在右上角鈴鐺和手機推播收到。'],
  ['🤖 問單一 AI 角色', '輸入 @Finance、@Marketing、@Operations、@Engineering 或 @Engineering B，該角色會讀這個聊天室最近的對話後回覆。打 @ 會跳出清單可以選。'],
  ['🧑‍🤝‍🧑 請 AI 團隊討論', '輸入 @Team 加上問題，Team Lead 會挑合適的角色討論，每輪結束後決定誰需要再回應，最多 3 輪，最後整理「結論／分歧／資料不足／建議下一步」，可下載成 .md。想指定參與者就寫「@Team @Finance @Marketing 問題」。'],
  ['✅ 決策與待辦', '做了決定後，直接請 Team Lead 排進待辦（例如「@Team 決定先做 A/B 測試，Alice 負責，下週五前」），它會建立待辦並通知負責人；也可以按任何訊息下方的「加入待辦」。待辦在左側「待辦」頁，AI 做的變更都可以復原。'],
  ['🧠 AI 會記住重要事實', 'AI 會把「本月花了多少」「已決定的事」這類事實記下來，換聊天室也記得；回覆下方會顯示「記住了：…」，記錯了可以按「撤銷」。'],
  ['📝 寫得越完整越好', 'AI 只看得到聊天室裡的文字，看不到 Notion、帳務或其他系統。把背景數字、限制、你想要的結果寫在同一則訊息裡，答案會更具體。支援 Markdown 與公式（$x^2$）。'],
  ['⚠️ 要記得', 'AI 只提供建議，不會寄信、付款或改任何系統資料（待辦除外）；重要決定請由負責的同事確認。發問後請不要馬上關掉頁面，AI 討論需要約 1～3 分鐘。'],
]

function GuideDialog({ onClose }) {
  return <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="guide-title" onClick={e => e.target === e.currentTarget && onClose()}><div className={`${styles.modal} ${styles.employeeModal} ${chat.guide}`}>
    <button type="button" className={styles.modalClose} onClick={onClose} aria-label="關閉"><X size={18} /></button>
    <h2 id="guide-title">AI Team 怎麼用？</h2>
    <p className={styles.hint}>這裡是夥伴和 AI 角色一起討論的地方。先到「帳號設定」填好職稱與自我介紹，AI 和同事就知道你負責什麼；也記得開啟推播通知。</p>
    <ol>{GUIDE.map(([title, text]) => <li key={title}><strong>{title}</strong><p>{text}</p></li>)}</ol>
    <div className={chat.guideExample}><span>試試看</span><code>@Team 下個月想花 5 萬元投 IG 廣告，目前月費 199、平均留存 6 個月，值得嗎？</code></div>
    <div className={styles.modalActions}><a className={styles.btnSecondary} href="/admin/settings">去填個人介紹</a><button className={styles.btnPrimary} onClick={onClose}>開始使用</button></div>
  </div></div>
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
