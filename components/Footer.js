'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLocale, useMarket, useMessages } from './LocaleProvider'
import { MARKET_GLOBAL } from '@/lib/market'
import { COMPANY, getCompanyAddress } from '@/lib/company'
import CompanyLink from './CompanyLink'
import styles from './Footer.module.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const m = useMessages()
  const locale = useLocale()
  const isGlobal = useMarket() === MARKET_GLOBAL

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
              {!isGlobal && (
                <Image
                  src="/dogtor_logo.svg"
                  alt="逗課 logo"
                  width={110}
                  height={28}
                  className={styles.footerLogoImg}
                />
              )}
            </Link>
            <p className={styles.footerCopy}>{m.footer.copyright(currentYear)}</p>
            <p className={styles.footerContact}>
              {m.footer.contact}{' '}
              <a href="mailto:dogtor@superb-tutor.com">dogtor@superb-tutor.com</a>
            </p>
          </div>

          <div className={styles.footerLinks}>
            <Link href="/technology">{m.footer.links.technology}</Link>
            {/* Reviews, news and the web refund policy (Paddle) belong to the
                Taiwan app; international purchases go through the stores. */}
            {!isGlobal && <Link href="/reviews">{m.footer.links.reviews}</Link>}
            {!isGlobal && <Link href="/news">{m.footer.links.news}</Link>}
            <Link href="/terms">{m.footer.links.terms}</Link>
            <Link href="/privacy">{m.footer.links.privacy}</Link>
            {!isGlobal && <Link href="/refund">{m.footer.links.refund}</Link>}
            <Link href="/support">{m.footer.links.support}</Link>
            <Link href="/faq">{m.footer.links.faq}</Link>
          </div>
        </div>
        <div className={styles.footerCompany}>
          <p className={styles.footerCompanyName}>
            <CompanyLink className={styles.footerCompanyLink}>
              {isGlobal ? COMPANY.nameEn : `${COMPANY.nameZh} ${COMPANY.nameEn}`}
            </CompanyLink>
          </p>
          <p className={styles.footerCompanyMeta}>
            {m.company.taxIdLabel} {COMPANY.taxId}
            <span className={styles.footerDivider} aria-hidden="true">｜</span>
            {m.company.representativeLabel} {COMPANY.representative}
          </p>
          <p className={styles.footerCompanyMeta}>
            {getCompanyAddress(locale)}
          </p>
        </div>
      </div>
    </footer>
  )
}
