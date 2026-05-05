'use client'

import Link from 'next/link'
import { useMessages } from './LocaleProvider'
import styles from './Footer.module.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const m = useMessages()

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContainer}>
          <div className={styles.footerLeft}>
            <p className={styles.footerBrand}>Dogtor 逗課</p>
            <p className={styles.footerCopy}>{m.footer.copyright(currentYear)}</p>
            <p className={styles.footerContact}>
              {m.footer.contact}{' '}
              <a href="mailto:dogtor.love.learning@gmail.com">dogtor.love.learning@gmail.com</a>
            </p>
          </div>

          <div className={styles.footerLinks}>
            <Link href="/guide">{m.footer.links.guide}</Link>
            <a
              href="https://play.google.com/store/apps/details?id=com.dogtor.superbFlutterApp"
              target="_blank"
              rel="noreferrer"
            >
              Android Google Play
            </a>
            <Link href="/terms">{m.footer.links.terms}</Link>
            <Link href="/privacy">{m.footer.links.privacy}</Link>
            <Link href="/support">{m.footer.links.support}</Link>
            <Link href="/faq">{m.footer.links.faq}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
