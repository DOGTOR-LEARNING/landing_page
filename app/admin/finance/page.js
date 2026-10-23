"use client"
import FinancePanel from '../FinancePanel'
import { useAdmin } from '../AdminWorkspace'
import styles from '../admin.module.css'
export default function Page() {
  const { user } = useAdmin()
  return user ? <section className={styles.settingsCard} style={{ maxWidth: 'none' }}><FinancePanel /></section> : null
}
