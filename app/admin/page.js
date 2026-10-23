'use client'
import Link from 'next/link'
import { ArrowUpRight, Sun, ShieldCheck } from 'lucide-react'
import { NAV, useAdmin } from './AdminWorkspace'
import styles from './admin.module.css'
export default function Overview() {
  const { user } = useAdmin()
  if (!user) return null
  return <>
    <section className={styles.welcomeCard}><div><span className={styles.welcomeTag}><Sun size={15} />新的一天，一起前進</span><h2><em>{user.display_name}</em>，歡迎回來。</h2><p>重要的消息、團隊的夥伴，都在這裡。<br />選擇一項工作，從容開始。</p></div><img src="/question-corgi.png" alt="" /></section>
    <div className={styles.sectionHeading}><h2>今天要做些什麼？</h2><span>常用工作入口</span></div>
    <div className={styles.quickGrid}>{NAV.filter(item => item.href !== '/admin' && item.href !== '/admin/settings' && item.href !== '/admin/team/roles' && user.permissions.includes(item.permission)).map(({ href, title, desc, icon: Icon }) => <Link href={href} key={href} className={styles.quickCard}><div className={styles.quickTop}><span><Icon size={23} /></span><ArrowUpRight size={19} /></div><h3>{title}</h3><p>{desc}</p><span className={styles.quickCta}>開啟功能 <span>→</span></span></Link>)}</div>
    <section className={styles.workspaceNote}><ShieldCheck size={22} /><div><h3>每位夥伴，自己的工作空間</h3><p>你目前以{({ super_admin: '超級管理員', admin: '管理員', staff: '團隊成員' })[user.role]}身分登入。左側選單會顯示你可以使用的功能。</p></div><Link href="/admin/settings">帳號設定 →</Link></section>
  </>
}
