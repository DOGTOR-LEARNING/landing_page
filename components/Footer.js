import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContainer}>
          <div className={styles.footerLeft}>
            <p className={styles.footerBrand}>Dogtor 逗課</p>
            <p className={styles.footerCopy}>
              © {currentYear} Dogtor 逗課. 版權所有。
            </p>
            <p className={styles.footerContact}>
              聯絡信箱：<a href="mailto:dogtor.love.learning@gmail.com">dogtor.love.learning@gmail.com</a>
            </p>
          </div>
          
          <div className={styles.footerLinks}>
            <Link href="/terms">服務條款</Link>
            <Link href="/privacy">隱私權政策</Link>
            <Link href="/support">支援中心</Link>
            <Link href="/faq">常見問題</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
