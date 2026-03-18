'use client'

import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import LoginModal from './LoginModal'
import styles from './Nav.module.css'

const links = [
  { href: '#mundo',       keyPt: 'O Mundo',      keyEn: 'World' },
  { href: '#personagens', keyPt: 'Personagens',  keyEn: 'Characters' },
  { href: '#cidades',     keyPt: 'Cidades',      keyEn: 'Cities' },
  { href: '#devlog',      keyPt: 'Devlog',       keyEn: 'Devlog' },
  { href: '#apoie',       keyPt: 'Apoie',        keyEn: 'Support' },
  { href: '#faq',         keyPt: 'FAQ',          keyEn: 'FAQ' },
]

export default function Nav() {
  const { t, lang, toggleLang } = useLanguage()
  const { user, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function smoothScroll(target: number) {
    const start = window.scrollY
    const distance = target - start
    const duration = Math.min(Math.abs(distance) * 0.4, 900)
    let startTime: number | null = null

    function step(now: number) {
      if (!startTime) startTime = now
      const p = Math.min((now - startTime) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 4)
      window.scrollTo(0, start + distance * ease)
      if (p < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    smoothScroll(el.getBoundingClientRect().top + window.scrollY - 80)
  }

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.logo}>{t('nav.logo')}</div>

        {/* Desktop links */}
        <div className={styles.links}>
          {links.map(l => (
            <a key={l.href} href={l.href} className={styles.link}
              onClick={e => { e.preventDefault(); scrollTo(l.href.slice(1)) }}>
              {lang === 'pt' ? l.keyPt : l.keyEn}
            </a>
          ))}
        </div>

        <div className={styles.right}>
          {user ? (
            <div className={styles.userMenu} ref={dropdownRef}>
              <button
                className={styles.userBtn}
                onClick={() => setDropdownOpen(o => !o)}
              >
                <span className={styles.userDot} />
                {user.username}
                <span className={styles.userChevron}>{dropdownOpen ? '▲' : '▼'}</span>
              </button>
              {dropdownOpen && (
                <div className={styles.dropdown}>
                  <a
                    href="/perfil"
                    className={styles.dropdownItem}
                    onClick={() => setDropdownOpen(false)}
                  >
                    {lang === 'pt' ? '⚙ Configurações' : '⚙ Settings'}
                  </a>
                  {!!user.is_admin && (
                    <a
                      href="/admin/doacoes"
                      className={`${styles.dropdownItem} ${styles.dropdownAdmin}`}
                      onClick={() => setDropdownOpen(false)}
                    >
                      ✦ Admin
                    </a>
                  )}
                  <button
                    className={`${styles.dropdownItem} ${styles.dropdownLogout}`}
                    onClick={() => { logout(); setDropdownOpen(false) }}
                  >
                    {lang === 'pt' ? '↩ Sair' : '↩ Sign Out'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className={styles.loginBtn} onClick={() => setLoginOpen(true)}>
              {lang === 'pt' ? 'Entrar' : 'Sign In'}
            </button>
          )}
          <button className={styles.langBtn} onClick={toggleLang}>
            {t('nav.lang')}
          </button>
          <button
            className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
            onClick={() => setOpen(o => !o)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className={styles.mobileMenu}>
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                className={styles.mobileLink}
                onClick={e => { e.preventDefault(); scrollTo(l.href.slice(1)); setOpen(false) }}
              >
                {lang === 'pt' ? l.keyPt : l.keyEn}
              </a>
            ))}
            {user ? (
              <>
                <a href="/perfil" className={styles.mobileLink} onClick={() => setOpen(false)}>
                  {lang === 'pt' ? '⚙ Configurações' : '⚙ Settings'}
                </a>
                {!!user.is_admin && (
                  <a href="/admin/doacoes" className={`${styles.mobileLink} ${styles.mobileLinkAdmin}`} onClick={() => setOpen(false)}>
                    ✦ Admin
                  </a>
                )}
                <button className={styles.mobileLinkBtn} onClick={() => { logout(); setOpen(false) }}>
                  {lang === 'pt' ? '↩ Sair' : '↩ Sign Out'}
                </button>
              </>
            ) : (
              <button className={styles.mobileLinkBtn} onClick={() => { setLoginOpen(true); setOpen(false) }}>
                {lang === 'pt' ? 'Entrar' : 'Sign In'}
              </button>
            )}
          </div>
        )}
      </nav>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} lang={lang} />

      {/* Voltar ao topo */}
      <button
        className={`${styles.backToTop} ${scrolled ? styles.backToTopVisible : ''}`}
        onClick={() => smoothScroll(0)}
        aria-label="Voltar ao topo"
      >
        ▲
      </button>
    </>
  )
}
