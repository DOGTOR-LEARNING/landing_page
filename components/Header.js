'use client'

import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useSearchParams } from 'next/navigation'
import { useLocaleContext } from '@/components/LocaleProvider'
import styles from './Header.module.css'

const APP_STORE_URL = 'https://apps.apple.com/tw/app/dogtor-%E9%80%97%E8%AA%B2/id6751773627'

function buildLangHref(pathname, searchParams, lang) {
  const p = new URLSearchParams(searchParams?.toString?.() || '')
  p.set('lang', lang === 'en' ? 'en' : 'zh-TW')
  const qs = p.toString()
  return qs ? `${pathname}?${qs}` : `${pathname}`
}

function HeaderChrome({ hrefZh, hrefEn }) {
  const { locale, messages: m } = useLocaleContext()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className="container">
        <div className={styles.headerContainer}>
          <Link href="/" className={styles.logo} onClick={closeMenu}>
            <div className={styles.logoMarks}>
              <Image
                src="/dogtor_eng_logo.svg"
                alt={m.logos.altEn}
                width={120}
                height={28}
                className={styles.logoImgEn}
                priority
              />
              <Image
                src="/dogtor_logo.svg"
                alt={m.logos.altZh}
                width={110}
                height={28}
                className={styles.logoImgCn}
                priority
              />
            </div>
          </Link>

          <nav className={styles.desktopNav}>
            <Link href="/guide" className={styles.navLink}>
              {m.nav.guide}
            </Link>
            <Link href="/faq" className={styles.navLink}>
              {m.nav.faq}
            </Link>
            <Link href="/about" className={styles.navLink}>
              {m.nav.about}
            </Link>
            <Link href="/support" className={styles.navLink}>
              {m.nav.support}
            </Link>
            <div className={styles.langSwitch} role="group" aria-label={m.lang.switch}>
              {/* Use <a> so each switch is a full navigation; <Link> soft-nav can reuse stale RSC/cache. */}
              <a
                href={hrefZh}
                className={`${styles.langLink} ${locale === 'zh-TW' ? styles.langLinkActive : ''}`}
                aria-current={locale === 'zh-TW' ? 'true' : undefined}
              >
                {m.lang.zh}
              </a>
              <a
                href={hrefEn}
                className={`${styles.langLink} ${locale === 'en' ? styles.langLinkActive : ''}`}
                aria-current={locale === 'en' ? 'true' : undefined}
              >
                {m.lang.en}
              </a>
            </div>
            <a href={APP_STORE_URL} className={styles.downloadBtn} target="_blank" rel="noreferrer">
              {m.nav.downloadApp}
            </a>
          </nav>

          <button
            className={`${styles.mobileMenuToggle} ${isMenuOpen ? styles.open : ''}`}
            onClick={toggleMenu}
            aria-label={m.nav.menu}
            aria-expanded={isMenuOpen}
          >
            <span className={styles.menuIcon}></span>
          </button>

          <div className={`${styles.mobileNav} ${isMenuOpen ? styles.open : ''}`}>
            <Link href="/guide" className={styles.mobileNavLink} onClick={closeMenu}>
              {m.nav.guide}
            </Link>
            <Link href="/faq" className={styles.mobileNavLink} onClick={closeMenu}>
              {m.nav.faq}
            </Link>
            <Link href="/about" className={styles.mobileNavLink} onClick={closeMenu}>
              {m.nav.about}
            </Link>
            <Link href="/support" className={styles.mobileNavLink} onClick={closeMenu}>
              {m.nav.support}
            </Link>
            <div className={styles.mobileLangRow}>
              <a
                href={hrefZh}
                className={`${styles.mobileLangBtn} ${locale === 'zh-TW' ? styles.mobileLangBtnActive : ''}`}
                onClick={closeMenu}
              >
                {m.lang.zh}
              </a>
              <a
                href={hrefEn}
                className={`${styles.mobileLangBtn} ${locale === 'en' ? styles.mobileLangBtnActive : ''}`}
                onClick={closeMenu}
              >
                {m.lang.en}
              </a>
            </div>
            <a
              href={APP_STORE_URL}
              className={styles.mobileDownloadBtn}
              onClick={closeMenu}
              target="_blank"
              rel="noreferrer"
            >
              {m.nav.downloadApp}
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

function HeaderWithSearchParams() {
  const pathname = usePathname() || '/'
  const searchParams = useSearchParams()
  const hrefZh = buildLangHref(pathname, searchParams, 'zh-TW')
  const hrefEn = buildLangHref(pathname, searchParams, 'en')
  return <HeaderChrome hrefZh={hrefZh} hrefEn={hrefEn} />
}

function HeaderFallback() {
  const pathname = usePathname() || '/'
  const hrefZh = `${pathname}?lang=zh-TW`
  const hrefEn = `${pathname}?lang=en`
  return <HeaderChrome hrefZh={hrefZh} hrefEn={hrefEn} />
}

export default function Header() {
  return (
    <Suspense fallback={<HeaderFallback />}>
      <HeaderWithSearchParams />
    </Suspense>
  )
}
