'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Header.module.css'

const APP_STORE_URL = 'https://apps.apple.com/tw/app/dogtor-%E9%80%97%E8%AA%B2/id6751773627'

export default function Header() {
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
                alt="Dogtor logo"
                width={120}
                height={28}
                className={styles.logoImgEn}
                priority
              />
              <Image
                src="/dogtor_logo.svg"
                alt="逗課 中文標誌"
                width={110}
                height={28}
                className={styles.logoImgCn}
                priority
              />
            </div>
          </Link>

          <nav className={styles.desktopNav}>
            <Link href="/faq" className={styles.navLink}>常見問題</Link>
            <Link href="/about" className={styles.navLink}>關於我們</Link>
            <Link href="/support" className={styles.navLink}>支援中心</Link>
            <a 
              href={APP_STORE_URL}
              className={styles.downloadBtn}
              target="_blank"
              rel="noreferrer"
            >
              下載 App
            </a>
          </nav>

          <button
            className={`${styles.mobileMenuToggle} ${isMenuOpen ? styles.open : ''}`}
            onClick={toggleMenu}
            aria-label="選單"
            aria-expanded={isMenuOpen}
          >
            <span className={styles.menuIcon}></span>
          </button>

          <div className={`${styles.mobileNav} ${isMenuOpen ? styles.open : ''}`}>
            <Link href="/faq" className={styles.mobileNavLink} onClick={closeMenu}>
              常見問題
            </Link>
            <Link href="/about" className={styles.mobileNavLink} onClick={closeMenu}>
              關於我們
            </Link>
            <Link href="/support" className={styles.mobileNavLink} onClick={closeMenu}>
              支援中心
            </Link>
            <a
              href={APP_STORE_URL}
              className={styles.mobileDownloadBtn}
              onClick={closeMenu}
              target="_blank"
              rel="noreferrer"
            >
              下載 App
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
