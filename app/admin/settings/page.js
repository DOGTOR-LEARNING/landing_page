'use client'
import { useState } from 'react'
import { KeyRound } from 'lucide-react'
import { useAdmin, adminFetch } from '../AdminWorkspace'
import styles from '../admin.module.css'
export default function SettingsPage() {
  const { user } = useAdmin()
  const [current, setCurrent] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(e) {
    e.preventDefault(); setError('')
    if (password !== confirmation) { setError('兩次新密碼不一致'); return }
    setBusy(true)
    try {
      const response = await adminFetch('/api/admin/auth/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ current_password: current, password }) })
      const data = await response.json()
      if (!response.ok || !data.success) { setError(data.message || '更新失敗'); return }
      window.dispatchEvent(new Event('admin-session-expired'))
    } catch { setError('無法連線，請稍後再試') }
    finally { setBusy(false) }
  }
  return <section className={styles.settingsCard}><KeyRound size={28} /><h2>更新登入密碼</h2><p className={styles.hint}>{user?.email} · 更新後會登出所有裝置，請使用新密碼重新登入。</p><form className={styles.form} onSubmit={submit}>{[
    ['current', '目前密碼', current, setCurrent, 'current-password'], ['new', '新密碼', password, setPassword, 'new-password'], ['confirm', '再次輸入新密碼', confirmation, setConfirmation, 'new-password'],
  ].map(([id, label, value, setValue, autoComplete]) => <div className={styles.fieldGroup} key={id}><label htmlFor={id} className={styles.label}>{label}</label><input id={id} className={styles.input} type="password" required minLength={id === 'current' ? 1 : 8} autoComplete={autoComplete} value={value} onChange={e => setValue(e.target.value)} /></div>)}<p className={styles.hint}>新密碼至少 8 個字元。</p>{error && <p role="alert" className={styles.loginError}>{error}</p>}<button className={styles.btnPrimary} disabled={busy}>{busy ? '更新中…' : '更新密碼'}</button></form></section>
}
