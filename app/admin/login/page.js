'use client'
import { useState } from 'react'
import Link from 'next/link'
import CompanyLink from '@/components/CompanyLink'
import { useRouter } from 'next/navigation'
import { ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react'
import { useAdmin } from '../AdminWorkspace'
import styles from '../admin.module.css'

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useAdmin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  async function submit(e) {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const response = await fetch('/api/admin/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
      const data = await response.json()
      if (!response.ok || !data.success) { setError(data.message || '登入失敗'); return }
      setPassword(''); setUser(data.data); router.replace('/admin')
    } catch { setError('無法連線，請稍後再試') }
    finally { setLoading(false) }
  }
  return <main className={styles.loginPage}>
    <div className={styles.loginStory}><Link href="/" className={styles.brand}><img src="/dogtor_eng_logo.svg" alt="Dogtor" /><img src="/dogtor_logo.svg" alt="逗課" /><span className={styles.brandCaption}>TEAM WORKSPACE</span></Link><div className={styles.loginStoryBody}><p className={styles.eyebrow}>DOGTOR 團隊工作台</p><h1>一起，把好點子<br /><em>變成每天的進步。</em></h1><p>歡迎回到團隊工作台。<br />讓每一個小小的行動，都成為學習路上的助力。</p><div className={styles.loginIllustration}><img src="/question-corgi.png" alt="Dogtor 小狗夥伴" /></div></div><span className={styles.loginCopyright}>© {new Date().getFullYear()} Dogtor · <CompanyLink>超棒軟體科技</CompanyLink></span></div>
    <div className={styles.loginFormSide}><div className={styles.loginCard}><div className={styles.loginIconWrap}><ShieldCheck size={25} /></div><p className={styles.eyebrow}>WELCOME BACK</p><h2 className={styles.loginTitle}>登入團隊工作台</h2><p className={styles.loginSubtitle}>使用你的員工帳號，開始今天的工作。</p><form onSubmit={submit} className={styles.loginForm}>
      <div className={styles.fieldGroup}><label className={styles.label} htmlFor="email">員工 Email</label><input id="email" className={styles.input} type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" /></div>
      <div className={styles.fieldGroup}><label className={styles.label} htmlFor="password">密碼</label><div className={styles.passwordField}><input id="password" className={styles.input} type={visible ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="輸入你的密碼" /><button type="button" aria-label={visible ? '隱藏密碼' : '顯示密碼'} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
      {error && <p role="alert" className={styles.loginError}>{error}</p>}
      <button className={styles.btnPrimary} disabled={loading}>{loading ? '登入中…' : <>登入工作台<ArrowRight size={18} /></>}</button>
    </form><p className={styles.loginHelp}>還沒有帳號或忘記密碼？請聯絡團隊管理員。</p><Link className={styles.backLink} href="/">← 返回 Dogtor 官網</Link></div></div>
  </main>
}
