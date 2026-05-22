'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale, useMessages } from './LocaleProvider'
import styles from './Header.module.css'

const APP_STORE_URL = 'https://apps.apple.com/tw/app/dogtor-%E9%80%97%E8%AA%B2/id6751773627'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const locale = useLocale()
  const m = useMessages()

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

  const switchLocale = () => {
    const newLocale = locale === 'zh-TW' ? 'en' : 'zh-TW'
    const url = new URL(window.location.href)
    url.searchParams.set('lang', newLocale)
    window.location.href = url.toString()
  }

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className="container">
        <div className={styles.headerContainer}>
          <Link href="/" className={styles.logo} onClick={closeMenu}>
            <div className={styles.logoMarks}>
              <Image
                src="/dogtor_eng_logo.svg"
                alt="Dogtor 逗課 logo"
                width={120}
                height={28}
                className={styles.logoImgEn}
                priority
              />
              <Image
                src="/dogtor_logo.svg"
                alt="Dogtor 逗課 國高中題庫學習 App 中文標誌"
                width={110}
                height={28}
                className={styles.logoImgCn}
                priority
              />
            </div>
          </Link>

          <nav className={styles.desktopNav}>
            <Link href="/guide" className={styles.navLink}>{m.header.guide}</Link>
            <Link href="/faq" className={styles.navLink}>{m.header.faq}</Link>
            <Link href="/about" className={styles.navLink}>{m.header.about}</Link>
            <Link href="/support" className={styles.navLink}>{m.header.support}</Link>
            <Link href="/parent-pro" className={styles.navLink}>{m.header.parentPro}</Link>
            <button
              className={styles.langSwitch}
              onClick={switchLocale}
              aria-label={m.common.langSwitch}
            >
              {m.common.langSwitch}
            </button>
            <a
              href={APP_STORE_URL}
              className={styles.downloadBtn}
              target="_blank"
              rel="noreferrer"
            >
              {m.common.downloadApp}
            </a>
          </nav>

          <button
            className={`${styles.mobileMenuToggle} ${isMenuOpen ? styles.open : ''}`}
            onClick={toggleMenu}
            aria-label={m.header.menuLabel}
            aria-expanded={isMenuOpen}
          >
            <span className={styles.menuIcon}></span>
          </button>

          <div className={`${styles.mobileNav} ${isMenuOpen ? styles.open : ''}`}>
            <Link href="/guide" className={styles.mobileNavLink} onClick={closeMenu}>
              {m.header.guide}
            </Link>
            <Link href="/faq" className={styles.mobileNavLink} onClick={closeMenu}>
              {m.header.faq}
            </Link>
            <Link href="/about" className={styles.mobileNavLink} onClick={closeMenu}>
              {m.header.about}
            </Link>
            <Link href="/support" className={styles.mobileNavLink} onClick={closeMenu}>
              {m.header.support}
            </Link>
            <Link href="/parent-pro" className={styles.mobileNavLink} onClick={closeMenu}>
              {m.header.parentPro}
            </Link>
            <button
              className={styles.mobileLangSwitch}
              onClick={() => { closeMenu(); switchLocale() }}
            >
              {m.common.langSwitch}
            </button>
            <a
              href={APP_STORE_URL}
              className={styles.mobileDownloadBtn}
              onClick={closeMenu}
              target="_blank"
              rel="noreferrer"
            >
              {m.common.downloadApp}
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
