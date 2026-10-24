'use client'
import { useState } from 'react'
import { KeyRound, UserRound } from 'lucide-react'
import { useAdmin, adminFetch } from '../AdminWorkspace'
import styles from '../admin.module.css'

function ProfileCard() {
  const { user, setUser } = useAdmin()
  const [jobTitle, setJobTitle] = useState(user?.job_title || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(e) {
    e.preventDefault(); setBusy(true); setMessage('')
    try {
      const response = await adminFetch('/api/admin/auth/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ job_title: jobTitle, bio }) })
      const data = await response.json()
      if (!response.ok || !data.success) { setMessage(data.message || '儲存失敗'); return }
      setUser(data.data); setMessage('個人介紹已更新')
    } catch { setMessage('無法連線，請稍後再試') }
    finally { setBusy(false) }
  }
  return <section className={styles.settingsCard} style={{ marginBottom: 20 }}><UserRound size={28} /><h2>個人介紹</h2><p className={styles.hint}>會顯示在 AI Team 聊天室你的名字旁邊，也會提供給 AI，讓夥伴和 AI 知道你負責什麼、擅長哪些領域。</p><form className={styles.form} onSubmit={submit}>
    <div className={styles.fieldGroup}><label htmlFor="job-title" className={styles.label}>職稱</label><input id="job-title" className={styles.input} maxLength={80} placeholder="例如：CEO、教學總監、工程師" value={jobTitle} onChange={e => setJobTitle(e.target.value)} /></div>
    <div className={styles.fieldGroup}><label htmlFor="bio" className={styles.label}>自我介紹</label><textarea id="bio" className={styles.textarea} rows={4} maxLength={1000} placeholder="例如：多年國高中教學經驗，帶領教學團隊，負責課程與題庫方向。" value={bio} onChange={e => setBio(e.target.value)} /><p className={styles.hint}>{bio.length}/1000</p></div>
    {message && <p role="status" className={styles.hint}>{message}</p>}
    <button className={styles.btnPrimary} disabled={busy}>{busy ? '儲存中…' : '儲存個人介紹'}</button>
  </form></section>
}

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
  return <><ProfileCard /><section className={styles.settingsCard}><KeyRound size={28} /><h2>更新登入密碼</h2><p className={styles.hint}>{user?.email} · 更新後會登出所有裝置，請使用新密碼重新登入。</p><form className={styles.form} onSubmit={submit}>{[
    ['current', '目前密碼', current, setCurrent, 'current-password'], ['new', '新密碼', password, setPassword, 'new-password'], ['confirm', '再次輸入新密碼', confirmation, setConfirmation, 'new-password'],
  ].map(([id, label, value, setValue, autoComplete]) => <div className={styles.fieldGroup} key={id}><label htmlFor={id} className={styles.label}>{label}</label><input id={id} className={styles.input} type="password" required minLength={id === 'current' ? 1 : 8} autoComplete={autoComplete} value={value} onChange={e => setValue(e.target.value)} /></div>)}<p className={styles.hint}>新密碼至少 8 個字元。</p>{error && <p role="alert" className={styles.loginError}>{error}</p>}<button className={styles.btnPrimary} disabled={busy}>{busy ? '更新中…' : '更新密碼'}</button></form></section></>
}
