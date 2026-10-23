'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import styles from '../admin.module.css'
export default function ActivatePage() {
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    setToken(new URLSearchParams(window.location.hash.slice(1)).get('token') || '')
    window.history.replaceState(null, '', '/admin/activate')
  }, [])
  async function submit(event) {
    event.preventDefault(); setMessage('')
    if (password !== confirmation) { setMessage('兩次密碼不一致'); return }
    setBusy(true)
    try {
      const response = await fetch('/api/admin/auth/activate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, password }) })
      const data = await response.json()
      if (!response.ok || !data.success) { setMessage(data.message || '啟用失敗'); return }
      setSuccess(true); setToken(''); setPassword(''); setConfirmation(''); setMessage(data.message)
    } catch { setMessage('無法連線，請稍後再試') }
    finally { setBusy(false) }
  }
  return <main className={styles.sessionLoading}><section className={styles.settingsCard}><ShieldCheck size={28} /><h1>設定你的員工密碼</h1><p className={styles.hint}>歡迎加入 Dogtor 團隊。啟用連結僅能使用一次。</p>{success ? <><p role="status">{message}</p><Link href="/admin/login" className={styles.btnPrimary}>前往登入</Link></> : <form className={styles.form} onSubmit={submit}>{[['activate-password', '登入密碼', password, setPassword], ['activate-confirm', '再次輸入密碼', confirmation, setConfirmation]].map(([id, label, value, setter]) => <div className={styles.fieldGroup} key={id}><label className={styles.label} htmlFor={id}>{label}</label><input className={styles.input} id={id} type="password" autoComplete="new-password" minLength={8} required value={value} onChange={e => setter(e.target.value)} /></div>)}<p className={styles.hint}>至少 8 個字元。</p>{message && <p role="alert" className={styles.loginError}>{message}</p>}<button className={styles.btnPrimary} disabled={busy || !token}>{busy ? '啟用中…' : '啟用帳號'}</button>{!token && <p className={styles.hint}>請從管理員提供的完整啟用連結開啟此頁。</p>}</form>}</section></main>
}
