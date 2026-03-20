'use client'

import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import type { Lang } from '@/lib/translations'
import { useAuth } from '@/context/AuthContext'
import { Bell } from 'lucide-react'
import LoginModal from './LoginModal'
import LoginTransition from './LoginTransition'
import LogoutTransition from './LogoutTransition'
import styles from './Nav.module.css'

const links = [
  { href: '#rift-cards',  keyPt: 'Universo',     keyEn: 'Universe' },
  { href: '/lore',        keyPt: 'Lore',         keyEn: 'Lore',    page: true },
  { href: '#personagens', keyPt: 'Personagens',  keyEn: 'Characters' },
  { href: '#cidades',     keyPt: 'Cidades',      keyEn: 'Cities' },
  { href: '/classes',     keyPt: 'Classes',      keyEn: 'Classes',  page: true },
  { href: '#apoie',       keyPt: 'Apoie',        keyEn: 'Support' },
  { href: '#faq',         keyPt: 'FAQ',          keyEn: 'FAQ' },
]

type Notification = {
  id: number
  message_pt: string
  message_en: string
  read_at: string | null
  created_at: string
}

export default function Nav() {
  const { t, lang, setLang } = useLanguage()
  const { user, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [transition, setTransition] = useState<{ active: boolean; username: string }>({ active: false, username: '' })
  const [logoutConfirm, setLogoutConfirm] = useState(false)
  const [logoutTransition, setLogoutTransition] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const langRef = useRef<HTMLDivElement>(null)
  const bellRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.read_at).length

  const languages: { code: Lang; flag: string; label: string }[] = [
    { code: 'pt', flag: '🇧🇷', label: 'PT' },
    { code: 'en', flag: '🇺🇸', label: 'EN' },
  ]

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
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!user) return
    fetch('/api/notifications')
      .then(r => r.json())
      .then(data => setNotifications(data.notifications ?? []))
      .catch(() => {})
  }, [user])

  async function handleMarkAllRead() {
    await fetch('/api/notifications/read-all', { method: 'POST' })
    setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })))
  }

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
              onClick={l.page ? undefined : (e => { e.preventDefault(); scrollTo(l.href.slice(1)) })}>
              {lang === 'pt' ? l.keyPt : l.keyEn}
            </a>
          ))}
        </div>

        <div className={styles.right}>
          {user && (
            <div className={styles.bellMenu} ref={bellRef}>
              <button
                className={styles.bellBtn}
                onClick={() => setBellOpen(o => !o)}
                aria-label="Notificações"
              >
                <Bell size={18} strokeWidth={1.5} />
                {unreadCount > 0 && <span className={styles.bellBadge} />}
              </button>
              {bellOpen && (
                <div className={styles.bellDropdown}>
                  <div className={styles.bellHeader}>
                    <span className={styles.bellTitle}>
                      {lang === 'pt' ? 'Notificações' : 'Notifications'}
                    </span>
                    {unreadCount > 0 && (
                      <button className={styles.bellMarkAll} onClick={handleMarkAllRead}>
                        {lang === 'pt' ? 'Marcar todas' : 'Mark all'}
                      </button>
                    )}
                  </div>
                  <div className={styles.bellList}>
                    {notifications.length === 0 ? (
                      <p className={styles.bellEmpty}>
                        {lang === 'pt' ? 'Nenhuma notificação' : 'No notifications'}
                      </p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          className={`${styles.bellItem} ${!n.read_at ? styles.bellItemUnread : ''}`}
                        >
                          {!n.read_at && <span className={styles.bellDot} />}
                          <span className={styles.bellMsg}>
                            {lang === 'pt' ? n.message_pt : n.message_en}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className={styles.langMenu} ref={langRef}>
            <button
              className={styles.langBtn}
              onClick={() => setLangOpen(o => !o)}
              aria-expanded={langOpen}
            >
              {lang.toUpperCase()}
              <span className={styles.langChevron}>{langOpen ? '▲' : '▼'}</span>
            </button>
            {langOpen && (
              <div className={styles.langDropdown}>
                {languages.map(l => (
                  <button
                    key={l.code}
                    className={`${styles.langOption} ${lang === l.code ? styles.langOptionActive : ''}`}
                    onClick={() => { setLang(l.code); setLangOpen(false) }}
                  >
                    <span className={styles.langFlag}>{l.flag}</span>
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>
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
                    onClick={() => { setDropdownOpen(false); setLogoutConfirm(true) }}
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
                onClick={l.page ? () => setOpen(false) : (e => { e.preventDefault(); scrollTo(l.href.slice(1)); setOpen(false) })}
              >
                {lang === 'pt' ? l.keyPt : l.keyEn}
              </a>
            ))}

            {/* Language selector inside mobile menu */}
            <div className={styles.mobileLangRow}>
              {languages.map(l => (
                <button
                  key={l.code}
                  className={`${styles.mobileLangBtn} ${lang === l.code ? styles.mobileLangBtnActive : ''}`}
                  onClick={() => { setLang(l.code); setOpen(false) }}
                >
                  {l.flag} {l.label}
                </button>
              ))}
            </div>

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
                <button className={styles.mobileLinkBtn} onClick={() => { setOpen(false); setLogoutConfirm(true) }}>
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

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLoginSuccess={username => {
          setLoginOpen(false)
          setTransition({ active: true, username })
        }}
        lang={lang}
      />

      {transition.active && (
        <LoginTransition
          username={transition.username}
          lang={lang}
          onComplete={() => setTransition({ active: false, username: '' })}
        />
      )}

      {logoutTransition && (
        <LogoutTransition
          lang={lang}
          onComplete={async () => {
            await logout()
            window.location.reload()
          }}
        />
      )}

      {/* Logout confirmation */}
      {logoutConfirm && (
        <div className={styles.logoutOverlay} onClick={() => setLogoutConfirm(false)}>
          <div className={styles.logoutModal} onClick={e => e.stopPropagation()}>
            <p className={styles.logoutTag}>⟷ RIFT</p>
            <h2 className={styles.logoutTitle}>
              {lang === 'pt' ? 'Dessincronizar?' : 'Desync?'}
            </h2>
            <p className={styles.logoutText}>
              {lang === 'pt'
                ? 'Tem certeza que deseja dessincronizar o seu Rift?'
                : 'Are you sure you want to desync your Rift?'}
            </p>
            <div className={styles.logoutBtns}>
              <button
                className={styles.logoutConfirmBtn}
                onClick={() => {
                  setLogoutConfirm(false)
                  setLogoutTransition(true)
                }}
              >
                {lang === 'pt' ? 'Sim, sair' : 'Yes, sign out'}
              </button>
              <button
                className={styles.logoutCancelBtn}
                onClick={() => setLogoutConfirm(false)}
              >
                {lang === 'pt' ? 'Cancelar' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

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
