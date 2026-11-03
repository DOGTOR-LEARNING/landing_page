'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale, useMessages } from './LocaleProvider'
import { trackDownloadClick, trackNavClick } from '@/lib/analytics'
import styles from './Header.module.css'

const APP_STORE_URL = 'https://apps.apple.com/tw/app/dogtor-%E9%80%97%E8%AA%B2/id6751773627'

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" />
    </svg>
  )
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const navRef = useRef(null)
  const locale = useLocale()
  const m = useMessages()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!openDropdown) return

    const handlePointerDown = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenDropdown(null)
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpenDropdown(null)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [openDropdown])

  const aboutLinks = [
    { href: '/about', label: m.header.about, key: 'about' },
    { href: '/technology', label: m.header.technology, key: 'technology' },
  ]

  const helpLinks = [
    { href: '/guide', label: m.header.guide, key: 'guide' },
    { href: '/faq', label: m.header.faq, key: 'faq' },
    { href: '/support', label: m.header.support, key: 'support' },
  ]

  const renderDropdown = (key, label, links) => {
    const isOpen = openDropdown === key
    return (
      <div
        className={styles.dropdown}
        onMouseEnter={() => setOpenDropdown(key)}
        onMouseLeave={() => setOpenDropdown(null)}
      >
        <button
          className={`${styles.navLink} ${styles.dropdownToggle}`}
          onClick={() => setOpenDropdown(isOpen ? null : key)}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {label}
          <span className={`${styles.caret} ${isOpen ? styles.caretOpen : ''}`} aria-hidden="true" />
        </button>
        <div className={`${styles.dropdownMenu} ${isOpen ? styles.dropdownMenuOpen : ''}`}>
          {links.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={styles.dropdownItem}
              onClick={() => { setOpenDropdown(null); trackNavClick(link.key) }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    )
  }

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

          <nav ref={navRef} className={styles.desktopNav}>
            {renderDropdown('about', m.header.about, aboutLinks)}
            <Link href="/reviews" className={styles.navLink} onClick={() => trackNavClick('reviews')}>{m.header.reviews}</Link>
            <Link href="/news" className={styles.navLink} onClick={() => trackNavClick('news')}>{m.header.news}</Link>
            {renderDropdown('help', m.header.helpMenu, helpLinks)}
            <button
              className={styles.langSwitch}
              onClick={switchLocale}
              aria-label={m.common.langSwitch}
              title={m.common.langSwitch}
            >
              <GlobeIcon />
              <span>{m.common.langShort}</span>
            </button>
            <a
              href={APP_STORE_URL}
              className={styles.downloadBtn}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackDownloadClick('app_store', 'header')}
            >
              {m.common.downloadApp}
            </a>
            <Link href="/parent-pro" className={styles.parentProBtn} onClick={() => trackNavClick('parent_pro')}>
              {m.header.parentPro}
            </Link>
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
            <Link href="/about" className={styles.mobileNavLink} onClick={closeMenu}>
              {m.header.about}
            </Link>
            <Link href="/technology" className={styles.mobileNavLink} onClick={closeMenu}>
              {m.header.technology}
            </Link>
            <Link href="/reviews" className={styles.mobileNavLink} onClick={closeMenu}>
              {m.header.reviews}
            </Link>
            <Link href="/news" className={styles.mobileNavLink} onClick={closeMenu}>
              {m.header.news}
            </Link>
            <p className={styles.mobileGroupLabel}>{m.header.helpMenu}</p>
            {helpLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={`${styles.mobileNavLink} ${styles.mobileSubLink}`}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
            <button
              className={styles.mobileLangSwitch}
              onClick={() => { closeMenu(); switchLocale() }}
            >
              <GlobeIcon />
              {m.common.langSwitch}
            </button>
            <a
              href={APP_STORE_URL}
              className={styles.mobileDownloadBtn}
              onClick={() => { closeMenu(); trackDownloadClick('app_store', 'mobile_nav') }}
              target="_blank"
              rel="noreferrer"
            >
              {m.common.downloadApp}
            </a>
            <Link
              href="/parent-pro"
              className={styles.mobileParentProBtn}
              onClick={closeMenu}
            >
              {m.header.parentPro}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
