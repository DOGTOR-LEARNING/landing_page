'use client'
import { useEffect, useState } from 'react'
import { Bot, Pencil, X, Plus, Brain, Trash2, Check } from 'lucide-react'
import { adminFetch, useAdmin } from '../../AdminWorkspace'
import styles from '../../admin.module.css'
import chat from '../ai-team.module.css'
import page from './agents.module.css'

const number = value => new Intl.NumberFormat('zh-TW').format(Math.round(value || 0))
const usd = value => `US$ ${Number(value || 0).toFixed(2)}`

async function api(url, options) {
  const response = await adminFetch(url, options)
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data.success === false) throw new Error(data.message || '操作失敗，請稍後再試')
  return data
}

export default function AgentsPage() {
  const { user } = useAdmin()
  const [agents, setAgents] = useState([])
  const [providers, setProviders] = useState([])
  const [usage, setUsage] = useState(null)
  const [editing, setEditing] = useState(null)
  const [remembering, setRemembering] = useState(null)
  const [message, setMessage] = useState('')
  const canManage = user.permissions.includes('agents.manage')
  async function load() {
    try {
      const [a, u] = await Promise.all([api('/api/admin/agents'), api('/api/admin/ai-usage')])
      setAgents(a.data); setProviders(a.providers || []); setUsage(u.data)
    } catch (e) { setMessage(e.message) }
  }
  useEffect(() => { load() }, [])

  return <>
    {message && <p className={styles.inlineMessage} role="status">{message}</p>}
    {usage && <section className={page.stats}>
      {[['今天 AI 回覆', number(usage.today.runs), `失敗 ${number(usage.today.failed)} 次`], ['今天用量', `${number(usage.today.token_input + usage.today.token_output)} tokens`, `每日上限 ${number(usage.limits.daily_tokens)}`],
        ['本月 AI 回覆', number(usage.month.runs), `失敗 ${number(usage.month.failed)} 次`], ['本月估算費用', usd(usage.month.estimated_cost), '依 AI_TEAM_PRICE_* 設定估算']].map(([label, value, note]) =>
        <div key={label} className={page.stat}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>)}
    </section>}
    <section className={styles.tableCard}>
      <div className={styles.tableToolbar}>{canManage && <button className={styles.btnPrimary} style={{ order: 2 }} onClick={() => setEditing({ ...NEW_AGENT, provider: providers[0]?.id || 'openai', model: providers[0]?.default_model || '' })}><Plus size={16} />新增 AI 角色</button>}<div><h2>AI 角色</h2><p>在聊天室輸入 @角色名稱 就會由該角色回覆；輸入 @Team 由 Team Lead 安排討論{usage ? `（最多 ${usage.limits.team_max_agents} 個角色、${usage.limits.team_max_rounds} 輪，每次討論上限 ${number(usage.limits.team_run_tokens)} tokens、${Math.round(usage.limits.team_run_seconds / 60)} 分鐘）` : ''}。系統指示只有具「AI 角色」權限的人看得到。</p></div></div>
      <div className={page.agentGrid}>{agents.map(a => <article key={a.id} className={page.agentCard}>
        <div className={page.agentTop}><span className={page.agentIcon}><Bot size={20} /></span><div><h3>{a.kind === 'lead' ? '@Team · Team Lead' : `@${a.display_name}`}</h3><p>{a.description}</p></div></div>
        <dl className={page.facts}><div><dt>模型</dt><dd>{providerLabel(providers, a.provider)} · {a.model}{providers.length > 0 && !providers.find(p => p.id === a.provider)?.configured && <span className={page.warn}>尚未設定金鑰</span>}</dd></div><div><dt>單次回覆上限</dt><dd>{number(a.max_output_tokens)} tokens</dd></div><div><dt>狀態</dt><dd><span className={`${styles.statusBadge} ${a.is_enabled ? '' : styles.statusDisabled}`}>{a.is_enabled ? '啟用中' : '已停用'}</span></dd></div></dl>
        <div className={page.cardActions}>{canManage && <button className={styles.smallButton} onClick={() => setEditing({ ...a })}><Pencil size={13} />編輯</button>}<button className={styles.smallButton} onClick={() => setRemembering(a)}><Brain size={13} />記憶</button></div>
      </article>)}</div>
    </section>
    {usage && <section className={styles.tableCard} style={{ marginTop: 20 }}>
      <div className={styles.tableToolbar}><div><h2>本月使用者用量</h2><p>每人每天最多 {usage.limits.daily_runs_per_user} 次 AI 回覆，可用 AI_TEAM_DAILY_RUNS_PER_USER 調整。</p></div></div>
      <div className={styles.tableScroll}><table className={styles.dataTable}><thead><tr><th>員工</th><th>AI 回覆次數</th><th>Tokens</th><th>估算費用</th></tr></thead>
        <tbody>{usage.people.length ? usage.people.map(p => <tr key={p.id}><td>{p.display_name}</td><td>{number(p.runs)}</td><td>{number(p.tokens)}</td><td>{usd(p.estimated_cost)}</td></tr>) : <tr><td colSpan={4}>本月還沒有 AI 使用紀錄。</td></tr>}</tbody></table></div>
    </section>}
    {usage?.models?.length > 0 && <section className={styles.tableCard} style={{ marginTop: 20 }}>
      <div className={styles.tableToolbar}><div><h2>本月各模型用量</h2><p>依實際回覆的模型統計（含 Claude 自動備援與 Gemini「latest」解析後的版本）。</p></div></div>
      <div className={styles.tableScroll}><table className={styles.dataTable}><thead><tr><th>服務</th><th>模型</th><th>回覆次數</th><th>輸入 / 輸出 tokens</th><th>估算費用</th></tr></thead>
        <tbody>{usage.models.map(m => <tr key={`${m.provider}-${m.model}`}><td>{providerLabel(providers, m.provider)}</td><td>{m.model}</td><td>{number(m.steps)}</td><td>{number(m.token_input)} / {number(m.token_output)}</td><td>{usd(m.estimated_cost)}</td></tr>)}</tbody></table></div>
    </section>}
    {editing && <AgentDialog agent={editing} providers={providers} setAgent={setEditing} onSaved={async () => { setEditing(null); setMessage(editing.id ? 'AI 角色已更新' : 'AI 角色已新增'); await load() }} />}
    {remembering && <MemoryDialog agent={remembering} canManage={canManage} onClose={() => setRemembering(null)} />}
  </>
}

const NEW_AGENT = { slug: '', display_name: '', description: '', instructions: '你的角色是 ', is_enabled: true, max_output_tokens: 2000, kind: 'member' }

function MemoryDialog({ agent, canManage, onClose }) {
  const [items, setItems] = useState(null)
  const [limit, setLimit] = useState(50)
  const [draft, setDraft] = useState('')
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')
  async function load() {
    try { const data = await api(`/api/admin/agents/${agent.id}/memories`); setItems(data.data); setLimit(data.limit) } catch (e) { setError(e.message) }
  }
  useEffect(() => { load() }, [agent.id])
  async function run(url, method, body) {
    setError('')
    try { await api(url, { method, headers: { 'Content-Type': 'application/json' }, body: body && JSON.stringify(body) }); await load(); return true } catch (e) { setError(e.message); return false }
  }
  const when = iso => new Intl.DateTimeFormat('zh-TW', { timeZone: 'Asia/Taipei', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
  return <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="memory-title"><div className={`${styles.modal} ${styles.employeeModal}`}>
    <button type="button" className={styles.modalClose} onClick={onClose} aria-label="關閉"><X size={18} /></button>
    <h2 id="memory-title">{agent.kind === 'lead' ? 'Team Lead' : agent.display_name} 的記憶</h2>
    <p className={styles.hint}>每次回覆都會參考這些記憶（當作資料，不是指令）。AI 在對話中也會自己記下重要事實，標示為「AI 記錄」。最多 {limit} 則。</p>
    {canManage && <form className={page.memoryAdd} onSubmit={async e => { e.preventDefault(); if (draft.trim() && await run(`/api/admin/agents/${agent.id}/memories`, 'POST', { content: draft })) setDraft('') }}><input className={styles.input} maxLength={500} placeholder="例如：2026/10 廣告實際支出 3 萬元" value={draft} onChange={e => setDraft(e.target.value)} /><button className={styles.btnPrimary} disabled={!draft.trim()}><Plus size={15} />新增</button></form>}
    {error && <p role="alert" className={styles.loginError}>{error}</p>}
    {!items ? <p className={styles.hint}>載入中…</p> : !items.length ? <p className={styles.hint}>還沒有記憶。</p> : <ul className={page.memoryList}>{items.map(m => <li key={m.id}>
      {editing?.id === m.id
        ? <form className={page.memoryAdd} onSubmit={async e => { e.preventDefault(); if (await run(`/api/admin/agents/memories/${m.id}`, 'PUT', { content: editing.content })) setEditing(null) }}><input className={styles.input} maxLength={500} value={editing.content} onChange={e => setEditing({ ...editing, content: e.target.value })} autoFocus /><button className={styles.smallButton}><Check size={13} />儲存</button></form>
        : <><p>{m.content}</p><small>{m.source === 'agent' ? 'AI 記錄' : '人工輸入'}{m.created_by ? ` · ${m.created_by}` : ''} · {when(m.updated_at)}</small>
          {canManage && <div className={page.cardActions}><button className={styles.smallButton} onClick={() => setEditing({ id: m.id, content: m.content })}><Pencil size={12} />修改</button><button className={styles.smallButton} onClick={() => confirm('確定刪除這則記憶？') && run(`/api/admin/agents/memories/${m.id}`, 'DELETE')}><Trash2 size={12} />刪除</button></div>}</>}
    </li>)}</ul>}
    <div className={styles.modalActions}><button className={styles.btnSecondary} onClick={onClose}>關閉</button></div>
  </div></div>
}

const providerLabel = (providers, id) => providers.find(p => p.id === id)?.label || id

function AgentDialog({ agent, providers, setAgent, onSaved }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('')
    const body = { display_name: agent.display_name, description: agent.description, instructions: agent.instructions, provider: agent.provider, model: agent.model, is_enabled: agent.is_enabled, max_output_tokens: Number(agent.max_output_tokens) }
    const creating = !agent.id
    try { await api(creating ? '/api/admin/agents' : `/api/admin/agents/${agent.id}`, { method: creating ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(creating ? { ...body, slug: agent.slug } : body) }); onSaved() } catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  const provider = providers.find(p => p.id === agent.provider)
  const field = (key, label, props = {}) => <div className={styles.fieldGroup}><label className={styles.label} htmlFor={`agent-${key}`}>{label}</label><input id={`agent-${key}`} className={styles.input} value={agent[key]} onChange={e => setAgent({ ...agent, [key]: e.target.value })} {...props} /></div>
  return <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="agent-title"><form className={`${styles.modal} ${styles.employeeModal}`} onSubmit={submit}>
    <button type="button" className={styles.modalClose} onClick={() => setAgent(null)} aria-label="關閉"><X size={18} /></button>
    <h2 id="agent-title">{agent.id ? `編輯 @${agent.display_name}` : '新增 AI 角色'}</h2><p className={styles.hint}>{agent.kind === 'lead' ? 'Team Lead 只負責分派與彙整，聊天室輸入 @Team 啟動。' : `改名後，聊天室要用新名字 @ 它（英文代號 @${agent.slug} 也一直有效）。`}</p>
    <div className={styles.form}>
      {agent.id ? field('display_name', '顯示名稱', { required: true, maxLength: 60 }) : <div className={styles.formColumns}>{field('display_name', '顯示名稱（聊天室用 @名稱 呼叫）', { required: true, maxLength: 60, placeholder: '例如：Engineering C' })}{field('slug', '英文代號（建立後不能改）', { required: true, maxLength: 40, pattern: '[a-z][a-z0-9-]*', placeholder: '例如：engineering-c' })}</div>}
      <div className={styles.formColumns}>
        <div className={styles.fieldGroup}><label className={styles.label} htmlFor="agent-provider">AI 服務</label><select id="agent-provider" className={styles.input} value={agent.provider} onChange={e => { const next = providers.find(p => p.id === e.target.value); setAgent({ ...agent, provider: e.target.value, model: next?.default_model || agent.model }) }}>{providers.map(p => <option key={p.id} value={p.id}>{p.label}{p.configured ? '' : '（尚未設定金鑰）'}</option>)}</select></div>
        {field('model', '模型', { required: true, maxLength: 80, pattern: '[A-Za-z0-9._:-]+', list: 'agent-model-options' })}
        <datalist id="agent-model-options">{(provider?.models || []).map(m => <option key={m} value={m} />)}</datalist>
      </div>
      {provider && !provider.configured && <p className={styles.hint} role="note">⚠️ 後端還沒有這個服務的 API 金鑰，儲存後這個角色的回覆會顯示「AI 服務尚未設定」，請先在 Cloud Run 設定對應的環境變數。</p>}
      {field('description', '簡介', { maxLength: 255 })}
      <div className={styles.fieldGroup}><label className={styles.label} htmlFor="agent-instructions">系統指示</label><textarea id="agent-instructions" className={styles.textarea} rows={8} required maxLength={8000} value={agent.instructions} onChange={e => setAgent({ ...agent, instructions: e.target.value })} /><p className={styles.hint}>只存在後端，一般員工看不到也改不了。</p></div>
      <div className={styles.formColumns}>{field('max_output_tokens', '單次回覆上限（tokens）', { type: 'number', min: 200, max: 8000, required: true })}
        <div className={styles.fieldGroup}><span className={styles.label}>狀態</span><label className={chat.people} style={{ gridTemplateColumns: '1fr', margin: 0 }}><span><input type="checkbox" checked={agent.is_enabled} onChange={e => setAgent({ ...agent, is_enabled: e.target.checked })} /> 啟用這個角色</span></label></div></div>
      {error && <p role="alert" className={styles.loginError}>{error}</p>}
      <div className={styles.modalActions}><button type="button" className={styles.btnSecondary} onClick={() => setAgent(null)}>取消</button><button className={styles.btnPrimary} disabled={busy}>{busy ? '儲存中…' : '儲存'}</button></div>
    </div>
  </form></div>
}
