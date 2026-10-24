'use client'
import { useEffect, useState } from 'react'
import { KeyRound, UserRound, BellRing } from 'lucide-react'
import { useAdmin, adminFetch } from '../AdminWorkspace'
import styles from '../admin.module.css'

const urlKey = base64 => {
  const raw = atob((base64 + '='.repeat((4 - base64.length % 4) % 4)).replace(/-/g, '+').replace(/_/g, '/'))
  return Uint8Array.from(raw, c => c.charCodeAt(0))
}

function PushCard() {
  const [config, setConfig] = useState(null)
  const [subscribed, setSubscribed] = useState(false)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  // Browser capabilities are only known after mount (the page is also rendered on the server).
  const [env, setEnv] = useState({ supported: false, standalone: true, ios: false })
  const { supported, standalone, ios } = env
  useEffect(() => {
    setEnv({
      supported: 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window,
      standalone: window.matchMedia('(display-mode: standalone)').matches || Boolean(window.navigator.standalone),
      ios: /iPhone|iPad|iPod/.test(navigator.userAgent),
    })
  }, [])
  async function refresh() {
    try {
      const data = await (await adminFetch('/api/admin/notifications/config')).json()
      setConfig(data.data)
      if (supported) {
        const reg = await navigator.serviceWorker.getRegistration('/admin/')
        setSubscribed(Boolean(await reg?.pushManager.getSubscription()))
      }
    } catch { setMessage('讀取通知設定失敗') }
  }
  useEffect(() => { refresh() }, [supported])
  async function enable() {
    setBusy(true); setMessage('')
    try {
      if (await Notification.requestPermission() !== 'granted') { setMessage('瀏覽器沒有允許通知，請到瀏覽器或系統設定開啟。'); return }
      const reg = await navigator.serviceWorker.register('/admin-sw.js', { scope: '/admin/' })
      await navigator.serviceWorker.ready
      const subscription = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlKey(config.vapid_public_key) })
      const response = await adminFetch('/api/admin/notifications/subscriptions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(subscription.toJSON()) })
      const data = await response.json()
      setMessage(data.message || (response.ok ? '已開啟' : '開啟失敗')); await refresh()
    } catch (e) { setMessage(`開啟失敗：${e.message || e}`) }
    finally { setBusy(false) }
  }
  async function disable() {
    setBusy(true); setMessage('')
    try {
      const reg = await navigator.serviceWorker.getRegistration('/admin/')
      const subscription = await reg?.pushManager.getSubscription()
      if (subscription) {
        await adminFetch('/api/admin/notifications/subscriptions/remove', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(subscription.toJSON()) })
        await subscription.unsubscribe()
      }
      setMessage('這個裝置已關閉推播通知'); await refresh()
    } catch { setMessage('關閉失敗，請稍後再試') }
    finally { setBusy(false) }
  }
  async function test() {
    const data = await (await adminFetch('/api/admin/notifications/test', { method: 'POST' })).json()
    setMessage(data.message || '已送出')
  }
  return <section id="notifications" className={styles.settingsCard} style={{ marginBottom: 20 }}><BellRing size={28} /><h2>推播通知</h2>
    <p className={styles.hint}>有人在 AI Team @你、Team Lead 請你決策，或有待辦指派給你時，會通知這個裝置。右上角的鈴鐺隨時都看得到通知。</p>
    {!config ? <p className={styles.hint}>載入中…</p>
      : !config.push_configured ? <p className={styles.hint}>⚠️ 後端還沒設定推播金鑰（VAPID），目前只有後台內的鈴鐺通知。</p>
        : !supported ? <p className={styles.hint}>{ios && !standalone ? '在 iPhone／iPad 上，請先用 Safari 的「分享 → 加入主畫面」，再從主畫面打開「Dogtor 團隊」開啟通知（需 iOS 16.4 以上）。' : '這個瀏覽器不支援推播通知。'}</p>
          : <div className={styles.form}>
            <p className={styles.hint}>這個裝置：{subscribed ? '已開啟 ✅' : '尚未開啟'}　·　你共有 {config.devices} 個裝置開啟推播</p>
            <div className={styles.modalActions} style={{ justifyContent: 'flex-start' }}>
              {subscribed ? <button className={styles.btnSecondary} onClick={disable} disabled={busy}>關閉這個裝置的通知</button>
                : <button className={styles.btnPrimary} onClick={enable} disabled={busy}>{busy ? '設定中…' : '在這個裝置開啟通知'}</button>}
              {subscribed && <button className={styles.btnSecondary} onClick={test}>傳送測試通知</button>}
            </div>
          </div>}
    {message && <p role="status" className={styles.hint}>{message}</p>}
    {!standalone && <p className={styles.hint}>小提醒：在手機瀏覽器選「加入主畫面」、在電腦 Chrome 網址列點「安裝」，就能像 App 一樣打開團隊工作台。</p>}
  </section>
}

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
  return <><ProfileCard /><PushCard /><section className={styles.settingsCard}><KeyRound size={28} /><h2>更新登入密碼</h2><p className={styles.hint}>{user?.email} · 更新後會登出所有裝置，請使用新密碼重新登入。</p><form className={styles.form} onSubmit={submit}>{[
    ['current', '目前密碼', current, setCurrent, 'current-password'], ['new', '新密碼', password, setPassword, 'new-password'], ['confirm', '再次輸入新密碼', confirmation, setConfirmation, 'new-password'],
  ].map(([id, label, value, setValue, autoComplete]) => <div className={styles.fieldGroup} key={id}><label htmlFor={id} className={styles.label}>{label}</label><input id={id} className={styles.input} type="password" required minLength={id === 'current' ? 1 : 8} autoComplete={autoComplete} value={value} onChange={e => setValue(e.target.value)} /></div>)}<p className={styles.hint}>新密碼至少 8 個字元。</p>{error && <p role="alert" className={styles.loginError}>{error}</p>}<button className={styles.btnPrimary} disabled={busy}>{busy ? '更新中…' : '更新密碼'}</button></form></section></>
}
