'use client'
import { useEffect, useState } from 'react'
import { Plus, Search, Users, X, Pencil, RefreshCw } from 'lucide-react'
import { adminFetch, useAdmin } from '../../AdminWorkspace'
import styles from '../../admin.module.css'

const PERMISSION_GROUPS = [
  { title: '進入後台', view: 'admin.access' },
  { title: '推播通知', view: 'push.view', manage: 'push.manage' },
  { title: 'App 公告', view: 'announcements.view', manage: 'announcements.manage' },
  { title: '財務報帳', view: 'finance.view', manage: 'finance.manage' },
  { title: 'AI Team 聊天室（檢視／發言）', view: 'chat.view', manage: 'chat.post' },
  { title: '聊天室管理（建立、成員）', view: 'chat.manage' },
  { title: 'AI 角色與用量', view: 'agents.view', manage: 'agents.manage' },
  { title: '員工管理', view: 'users.view', manage: 'users.manage' },
]
const ROLE_NAMES = { super_admin: '超級管理員', admin: '管理員', staff: '團隊成員' }
const initial = { email: '', display_name: '', password: '', role: 'staff', status: 'active', permissions: ['admin.access'] }

export default function UsersPage() {
  const { user } = useAdmin()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [formError, setFormError] = useState('')
  const canManage = user?.permissions.includes('users.manage')
  async function load() {
    setLoading(true)
    try {
      const response = await adminFetch('/api/admin/users')
      const data = await response.json()
      if (!response.ok || !data.success) { setMessage(data.message || '載入失敗'); return }
      setUsers(data.data)
    } catch { setMessage('無法連線，請稍後再試') }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])
  function permission(code, checked) {
    setForm(current => {
      const values = new Set(current.permissions)
      if (checked) { values.add(code); if (code.endsWith('.manage')) values.add(code.replace('.manage', '.view')) }
      else { values.delete(code); if (code.endsWith('.view')) values.delete(code.replace('.view', '.manage')) }
      return { ...current, permissions: [...values] }
    })
  }
  async function save(event) {
    event.preventDefault(); setBusy(true); setFormError('')
    try {
      const response = await adminFetch(form.id ? `/api/admin/users/${form.id}` : '/api/admin/users', {
        method: form.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, password: form.password || undefined }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) { setFormError(data.message || '儲存失敗'); return }
      setMessage(data.message); setForm(null)
      if (form.id === user.id) { window.dispatchEvent(new Event('admin-session-expired')); return }
      await load()
    } catch { setFormError('無法連線，請稍後再試') }
    finally { setBusy(false) }
  }
  const filtered = users.filter(item => `${item.email} ${item.display_name}`.toLowerCase().includes(search.toLowerCase()))
  return <>
    <section className={styles.tableCard}>
      <div className={styles.tableToolbar}><div><h2>團隊夥伴 <span className={styles.countBadge}>{users.length}</span></h2><p>管理員工帳號、登入狀態與功能權限。</p></div>{canManage && <button className={styles.btnPrimary} onClick={() => { setForm({ ...initial }); setFormError('') }}><Plus size={17} />新增員工</button>}</div>
      <div className={styles.searchRow}><div className={styles.searchField}><Search size={18} /><input aria-label="搜尋員工" placeholder="搜尋姓名或 Email…" value={search} onChange={e => setSearch(e.target.value)} /></div><button className={styles.btnSecondary} onClick={load} disabled={loading}><RefreshCw size={16} />重新整理</button></div>
      {message && <p role="status" className={styles.inlineMessage}>{message}</p>}
      <div className={styles.tableScroll}><table className={styles.dataTable}><thead><tr><th>員工</th><th>角色</th><th>狀態</th><th>最後登入</th>{canManage && <th>管理</th>}</tr></thead><tbody>{filtered.map(item => <tr key={item.id}><td><div className={styles.employeeCell}><span className={styles.avatar}>{item.display_name.slice(0, 1)}</span><div><strong>{item.display_name}{item.id === user?.id && '（你）'}</strong><span>{item.email}</span></div></div></td><td>{ROLE_NAMES[item.role]}</td><td><span className={`${styles.statusBadge} ${item.status === 'disabled' ? styles.statusDisabled : ''}`}>{({ active: '啟用中', disabled: '已停用', invited: '待啟用' })[item.status]}</span></td><td>{item.last_login_at ? new Date(item.last_login_at.endsWith('Z') ? item.last_login_at : `${item.last_login_at}Z`).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }) : '尚未登入'}</td>{canManage && <td><button className={styles.smallButton} onClick={() => { setForm({ ...item, password: '' }); setFormError('') }}><Pencil size={14} />編輯</button></td>}</tr>)}</tbody></table></div>
      {loading && <p className={styles.emptyState} role="status">正在載入團隊資料…</p>}
      {!loading && !filtered.length && <div className={styles.emptyState}><Users size={28} /><p>沒有符合的員工資料</p></div>}
    </section>
    {form && <div className={styles.modalOverlay}><section className={`${styles.modal} ${styles.employeeModal}`} role="dialog" aria-modal="true" aria-labelledby="employee-title"><button className={styles.modalClose} disabled={busy} onClick={() => setForm(null)} aria-label="關閉"><X size={20} /></button><h2 id="employee-title">{form.id ? '編輯員工' : '新增團隊夥伴'}</h2><p className={styles.hint}>每位夥伴使用自己的 Email 與密碼登入。</p><form onSubmit={save} className={styles.form}>
      <div className={styles.fieldGroup}><label htmlFor="employee-name" className={styles.label}>姓名</label><input id="employee-name" required maxLength={100} className={styles.input} value={form.display_name} onChange={e => setForm({ ...form, display_name: e.target.value })} /></div>
      <div className={styles.fieldGroup}><label htmlFor="employee-email" className={styles.label}>Email</label><input id="employee-email" required type="email" autoComplete="off" disabled={!!form.id} className={styles.input} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
      <div className={styles.fieldGroup}><label htmlFor="employee-password" className={styles.label}>{form.id ? '重設密碼（留空則保留）' : '登入密碼'}</label><input id="employee-password" required={!form.id} minLength={8} type="password" autoComplete="new-password" className={styles.input} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /><p className={styles.hint}>至少 8 個字元。請私下提供給員工，登入後可自行修改。</p></div>
      <div className={styles.formColumns}><div className={styles.fieldGroup}><label htmlFor="employee-role" className={styles.label}>角色</label><select id="employee-role" className={styles.input} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>{Object.entries(ROLE_NAMES).filter(([code]) => code !== 'super_admin' || user?.role === 'super_admin' || form.role === 'super_admin').map(([code, name]) => <option key={code} value={code}>{name}</option>)}</select></div>{form.id && <div className={styles.fieldGroup}><label htmlFor="employee-status" className={styles.label}>帳號狀態</label><select id="employee-status" className={styles.input} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option value="active">啟用</option><option value="disabled">停用</option></select></div>}</div>
      <div className={styles.fieldGroup}><span className={styles.label}>功能權限</span>{form.role === 'super_admin' ? <p className={styles.hint}>超級管理員擁有全部功能權限。</p> : <table className={styles.permissionTable}><thead><tr><th>功能</th><th>檢視</th><th>操作</th></tr></thead><tbody>{PERMISSION_GROUPS.map(group => <tr key={group.view}><td>{group.title}</td>{[group.view, group.manage].map((code, i) => <td key={i}>{code ? <input aria-label={`${group.title}${i ? '操作' : '檢視'}`} type="checkbox" checked={form.permissions.includes(code)} disabled={user.role !== 'super_admin' && !user.permissions.includes(code)} onChange={e => permission(code, e.target.checked)} /> : '—'}</td>)}</tr>)}</tbody></table>}</div>
      {formError && <p role="alert" className={styles.loginError}>{formError}</p>}
      <div className={styles.modalActions}><button type="button" className={styles.btnSecondary} disabled={busy} onClick={() => setForm(null)}>取消</button><button className={styles.btnPrimary} disabled={busy}>{busy ? '儲存中…' : '儲存員工設定'}</button></div>
    </form></section></div>}
  </>
}
