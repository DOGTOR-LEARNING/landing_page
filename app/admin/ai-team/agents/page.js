'use client'
import { useEffect, useState } from 'react'
import { Bot, Pencil, X } from 'lucide-react'
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
      <div className={styles.tableToolbar}><div><h2>AI 角色</h2><p>在聊天室輸入 @角色名稱 就會由該角色回覆；輸入 @Team 由 Team Lead 安排討論{usage ? `（最多 ${usage.limits.team_max_agents} 個角色、${usage.limits.team_max_rounds} 輪，每次討論上限 ${number(usage.limits.team_run_tokens)} tokens、${Math.round(usage.limits.team_run_seconds / 60)} 分鐘）` : ''}。系統指示只有具「AI 角色」權限的人看得到。</p></div></div>
      <div className={page.agentGrid}>{agents.map(a => <article key={a.id} className={page.agentCard}>
        <div className={page.agentTop}><span className={page.agentIcon}><Bot size={20} /></span><div><h3>{a.kind === 'lead' ? '@Team · Team Lead' : `@${a.display_name}`}</h3><p>{a.description}</p></div></div>
        <dl className={page.facts}><div><dt>模型</dt><dd>{providerLabel(providers, a.provider)} · {a.model}{providers.length > 0 && !providers.find(p => p.id === a.provider)?.configured && <span className={page.warn}>尚未設定金鑰</span>}</dd></div><div><dt>單次回覆上限</dt><dd>{number(a.max_output_tokens)} tokens</dd></div><div><dt>狀態</dt><dd><span className={`${styles.statusBadge} ${a.is_enabled ? '' : styles.statusDisabled}`}>{a.is_enabled ? '啟用中' : '已停用'}</span></dd></div></dl>
        {canManage && <button className={styles.smallButton} onClick={() => setEditing({ ...a })}><Pencil size={13} />編輯</button>}
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
    {editing && <AgentDialog agent={editing} providers={providers} setAgent={setEditing} onSaved={async () => { setEditing(null); setMessage('AI 角色已更新'); await load() }} />}
  </>
}

const providerLabel = (providers, id) => providers.find(p => p.id === id)?.label || id

function AgentDialog({ agent, providers, setAgent, onSaved }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('')
    const body = { display_name: agent.display_name, description: agent.description, instructions: agent.instructions, provider: agent.provider, model: agent.model, is_enabled: agent.is_enabled, max_output_tokens: Number(agent.max_output_tokens) }
    try { await api(`/api/admin/agents/${agent.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); onSaved() } catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  const provider = providers.find(p => p.id === agent.provider)
  const field = (key, label, props = {}) => <div className={styles.fieldGroup}><label className={styles.label} htmlFor={`agent-${key}`}>{label}</label><input id={`agent-${key}`} className={styles.input} value={agent[key]} onChange={e => setAgent({ ...agent, [key]: e.target.value })} {...props} /></div>
  return <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="agent-title"><form className={`${styles.modal} ${styles.employeeModal}`} onSubmit={submit}>
    <button type="button" className={styles.modalClose} onClick={() => setAgent(null)} aria-label="關閉"><X size={18} /></button>
    <h2 id="agent-title">編輯 @{agent.display_name}</h2><p className={styles.hint}>{agent.kind === 'lead' ? 'Team Lead 只負責分派與彙整，聊天室輸入 @Team 啟動。' : `改名後，聊天室要用新名字 @ 它（英文代號 @${agent.slug} 也一直有效）。`}</p>
    <div className={styles.form}>
      {field('display_name', '顯示名稱', { required: true, maxLength: 60 })}
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
