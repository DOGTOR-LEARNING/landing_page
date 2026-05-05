'use client'

import Link from 'next/link'
import { useLocaleContext } from '@/components/LocaleProvider'
import styles from './Footer.module.css'

export default function Footer() {
  const { messages: m } = useLocaleContext()
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContainer}>
          <div className={styles.footerLeft}>
            <p className={styles.footerBrand}>{m.brand}</p>
            <p className={styles.footerCopy}>
              © {currentYear} {m.brand}. {m.footer.copyright}
            </p>
            <p className={styles.footerContact}>
              {m.footer.contactLabel}{' '}
              <a href="mailto:dogtor.love.learning@gmail.com">dogtor.love.learning@gmail.com</a>
            </p>
          </div>

          <div className={styles.footerLinks}>
            <Link href="/guide">{m.footer.guide}</Link>
            <a
              href="https://play.google.com/store/apps/details?id=com.dogtor.superbFlutterApp"
              target="_blank"
              rel="noreferrer"
            >
              {m.footer.androidPlay}
            </a>
            <Link href="/terms">{m.footer.terms}</Link>
            <Link href="/privacy">{m.footer.privacy}</Link>
            <Link href="/support">{m.footer.support}</Link>
            <Link href="/faq">{m.footer.faq}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
