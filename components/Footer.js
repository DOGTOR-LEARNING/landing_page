'use client'

import Link from 'next/link'
import Image from 'next/image'
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
            <Link href="/" className={styles.footerLogo}>
              <Image
                src="/dogtor_eng_logo.svg"
                alt="Dogtor logo"
                width={120}
                height={28}
                className={styles.footerLogoImg}
              />
              <Image
                src="/dogtor_logo.svg"
                alt="逗課 logo"
                width={110}
                height={28}
                className={styles.footerLogoImg}
              />
            </Link>
            <p className={styles.footerCopy}>{m.footer.copyright(currentYear)}</p>
            <p className={styles.footerContact}>
              {m.footer.contact}{' '}
              <a href="mailto:dogtor.love.learning@gmail.com">dogtor.love.learning@gmail.com</a>
            </p>
          </div>

          <div className={styles.footerLinks}>
            <Link href="/terms">{m.footer.links.terms}</Link>
            <Link href="/privacy">{m.footer.links.privacy}</Link>
            <Link href="/refund">{m.footer.links.refund}</Link>
            <Link href="/support">{m.footer.links.support}</Link>
            <Link href="/faq">{m.footer.links.faq}</Link>
          </div>
        </div>
        <p className={styles.footerCompany}>
          超棒軟體科技有限公司 SuperB Software Technology Co., Ltd.
        </p>
      </div>
    </footer>
  )
}
