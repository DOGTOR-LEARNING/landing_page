'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLocale, useMessages } from './LocaleProvider'
import { COMPANY, getCompanyAddress, getCompanyPhone } from '@/lib/company'
import styles from './Footer.module.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const m = useMessages()
  const locale = useLocale()

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
        <div className={styles.footerCompany}>
          <p className={styles.footerCompanyName}>
            {COMPANY.nameZh} {COMPANY.nameEn}
          </p>
          <p className={styles.footerCompanyMeta}>
            {m.company.taxIdLabel} {COMPANY.taxId}
            <span className={styles.footerDivider} aria-hidden="true">｜</span>
            {m.company.representativeLabel} {COMPANY.representative}
          </p>
          <p className={styles.footerCompanyMeta}>
            {getCompanyAddress(locale)}
            <span className={styles.footerDivider} aria-hidden="true">｜</span>
            {m.company.phoneLabel}{' '}
            <a href={`tel:${COMPANY.phoneHref}`} className={styles.footerCompanyLink}>
              {getCompanyPhone(locale)}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
