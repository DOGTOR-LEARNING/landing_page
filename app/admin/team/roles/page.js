'use client'
import Link from 'next/link'
import { ShieldCheck, ArrowRight } from 'lucide-react'
import styles from '../../admin.module.css'
export default function RolesPage() {
  return <><section className={styles.tableCard}><div className={styles.tableToolbar}><div><h2>團隊角色</h2><p>角色建立基本身分，功能權限可針對每位員工個別設定。</p></div><ShieldCheck size={26} /></div><div className={styles.roleGrid}>{[
    ['super_admin', '超級管理員', '擁有所有後台權限，可管理其他管理員。系統會保護最後一位啟用中的超級管理員。'],
    ['admin', '管理員', '負責日常管理。可使用的功能依員工設定授予，不會自動取得全部操作權限。'],
    ['staff', '團隊成員', '新帳號預設僅能進入後台。由管理員勾選可檢視及操作的功能。'],
  ].map(([code, name, desc]) => <article key={code} className={styles.roleCard}><span className={styles.roleCode}>{code}</span><h3>{name}</h3><p>{desc}</p></article>)}</div><div className={styles.permissionHelp}><h3>檢視與操作，分開授權</h3><p>推播通知、App 公告、員工管理皆可分別設定「檢視」和「操作」。授予操作權限時，會同時開啟檢視權限。更新員工設定後，該員工需重新登入。</p><Link href="/admin/team/users">前往員工管理調整權限 <ArrowRight size={16} /></Link></div></section></>
}
