'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Megaphone, Mail, ClipboardList, Users, ShieldCheck, Settings, LogOut, ReceiptText, ArrowUpRight, Menu, X, ChevronRight } from 'lucide-react'
import styles from './admin.module.css'

const AdminContext = createContext(null)
export const useAdmin = () => useContext(AdminContext)
export const NAV = [
  { href: '/admin', title: '工作總覽', icon: LayoutDashboard, permission: 'admin.access', desc: '從這裡開始今天的工作' },
  { href: '/admin/push', title: '系統廣播', icon: Megaphone, permission: 'push.view', desc: '讓重要消息，準時抵達每一位用戶' },
  { href: '/admin/email', title: '指定用戶通知', icon: Mail, permission: 'push.view', desc: '把合適的消息，傳給需要的人' },
  { href: '/admin/announcements', title: 'App 公告', icon: ClipboardList, permission: 'announcements.view', desc: '管理公告、發布狀態與版本更新' },
  { href: '/admin/finance', title: '財務報帳', icon: ReceiptText, permission: 'finance.view', desc: '說明＋收據交給 AI 記帳，自動存 Drive、寫 Notion' },
  { href: '/admin/team/users', title: '員工管理', icon: Users, permission: 'users.view', desc: '讓每位夥伴都有自己的工作入口' },
  { href: '/admin/team/roles', title: '角色與權限', icon: ShieldCheck, permission: 'users.view', desc: '清楚掌握團隊的功能存取範圍' },
  { href: '/admin/settings', title: '帳號設定', icon: Settings, permission: 'admin.access', desc: '管理你的個人登入密碼' },
]

export async function adminFetch(url, options) {
  const response = await fetch(url, options)
  if (response.status === 401 && !url.endsWith('/login')) window.dispatchEvent(new Event('admin-session-expired'))
  return response
}

export default function AdminWorkspace({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [serviceError, setServiceError] = useState('')
  const [loggingOut, setLoggingOut] = useState(false)
  const login = pathname === '/admin/login' || pathname === '/admin/activate'

  useEffect(() => {
    let active = true
    async function check() {
      try {
        const response = await fetch('/api/admin/auth/me', { cache: 'no-store' })
        const data = await response.json()
        if (!active) return
        if (response.ok && data.success) { setUser(data.data); setServiceError('') }
        else if (response.status === 401) { setUser(null); if (!login) router.replace('/admin/login') }
        else { setUser(null); setServiceError(data.message || '後台服務暫時無法使用') }
      } catch { if (active) { setUser(null); setServiceError('無法連線至後台服務') } }
      finally { if (active) setLoading(false) }
    }
    check()
    const timer = setInterval(check, 60000)
    const expire = () => { setUser(null); router.replace('/admin/login') }
    window.addEventListener('admin-session-expired', expire)
    return () => { active = false; clearInterval(timer); window.removeEventListener('admin-session-expired', expire) }
  }, [login, router])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  async function logout() {
    setLoggingOut(true)
    try {
      const response = await fetch('/api/admin/auth/logout', { method: 'POST' })
      if (!response.ok && response.status !== 401) { setServiceError('登出未完成，請重試'); return }
      setUser(null); router.replace('/admin/login')
    } catch { setServiceError('無法連線，請重試登出') }
    finally { setLoggingOut(false) }
  }
  if (login) return <div className={styles.workspace}><AdminContext.Provider value={{ user, setUser }}>{children}</AdminContext.Provider></div>
  if (loading || !user) return <div className={styles.workspace}><div className={styles.sessionLoading} role="status">{serviceError || '正在確認登入狀態…'}{serviceError && <button className={styles.btnSecondary} onClick={() => window.location.reload()}>重新連線</button>}</div></div>
  const current = NAV.find(item => item.href === pathname) || NAV[0]
  const allowed = user.permissions.includes(current.permission)

  return <AdminContext.Provider value={{ user, setUser }}>
    <div className={styles.workspace}>
      {mobileOpen && <button className={styles.mobileScrim} onClick={() => setMobileOpen(false)} aria-label="關閉導航" />}
      <aside className={`${styles.sidebar} ${mobileOpen ? styles.sidebarOpen : ''}`}>
        <Link href="/admin" className={styles.brand}><img src="/dogtor_eng_logo.svg" alt="Dogtor" /><img src="/dogtor_logo.svg" alt="逗課" /><span className={styles.brandCaption}>TEAM WORKSPACE</span></Link>
        <button className={styles.mobileClose} aria-label="關閉導航" onClick={() => setMobileOpen(false)}><X size={20} /></button>
        <p className={styles.navLabel}>工作空間</p>
        <nav aria-label="後台導航" className={styles.navList}>
          {NAV.filter(item => user.permissions.includes(item.permission)).map(({ href, title, icon: Icon }) => <Link key={href} href={href} className={`${styles.navItem} ${pathname === href ? styles.navActive : ''}`} aria-current={pathname === href ? 'page' : undefined}><Icon size={19} /><span>{title}</span>{pathname === href && <ChevronRight size={16} />}</Link>)}
        </nav>
        <div className={styles.sidebarFoot}>
          <Link href="/" className={styles.websiteLink}>前往 Dogtor 官網<ArrowUpRight size={16} /></Link>
          <div className={styles.profile}><span className={styles.avatar}>{user.display_name.slice(0, 1)}</span><div><strong>{user.display_name}</strong><span>{({ super_admin: '超級管理員', admin: '管理員', staff: '團隊成員' })[user.role]}</span></div><button onClick={logout} disabled={loggingOut} aria-label="登出" title="登出"><LogOut size={18} /></button></div>
        </div>
      </aside>
      <div className={styles.workArea}>
        <header className={styles.topbar}><div><button className={styles.mobileMenu} onClick={() => setMobileOpen(true)} aria-label="開啟導航"><Menu size={21} /></button><span>團隊工作台</span><ChevronRight size={14} /><strong>{current.title}</strong></div><span className={styles.internalBadge}><span />內部管理系統</span></header>
        <main className={styles.workMain} id="admin-content">
          <div className={styles.pageHeading}><div><p className={styles.eyebrow}>DOGTOR / WORKSPACE</p><h1>{current.title}</h1><p>{current.desc}</p></div><span className={styles.dateLabel}>{new Intl.DateTimeFormat('zh-TW', { timeZone: 'Asia/Taipei', month: 'long', day: 'numeric', weekday: 'long' }).format(new Date())}</span></div>
          {serviceError && <p role="alert" className={styles.loginError}>{serviceError}</p>}
          {allowed ? children : <div className={styles.emptyState}><ShieldCheck size={32} /><h2>此功能尚未開放給你的帳號</h2><p>請聯絡管理員調整存取權限。</p><Link href="/admin">回工作總覽</Link></div>}
          <p className={styles.workspaceFooter}>Dogtor 逗課 · 讓學習更有趣，也讓工作更輕鬆。</p>
        </main>
      </div>
    </div>
  </AdminContext.Provider>
}
