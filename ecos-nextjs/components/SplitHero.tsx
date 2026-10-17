'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import GlitchText from './GlitchText'
import StarField from './StarField'
import NotifyModal from './NotifyModal'
import styles from './SplitHero.module.css'

const INITIAL_X = 55

export default function SplitHero() {
  const { t } = useLanguage()
  const [hinted, setHinted]   = useState(false)
  const [dragging, setDragging] = useState(false)
  const [notify, setNotify]   = useState(false)

  const containerRef    = useRef<HTMLDivElement>(null)
  const normalLayerRef  = useRef<HTMLDivElement>(null)
  const antiLayerRef    = useRef<HTMLDivElement>(null)
  const dividerElRef    = useRef<HTMLDivElement>(null)
  const dividerXRef     = useRef(INITIAL_X)
  const draggingRef     = useRef(false)
  const visibleRef      = useRef(true)
  const animRef         = useRef(0)

  // Direct DOM update — no React state, no re-render
  const applyX = useCallback((x: number) => {
    dividerXRef.current = x
    const xp = `${x}%`
    if (normalLayerRef.current)
      normalLayerRef.current.style.clipPath = `polygon(0 0, ${xp} 0, ${xp} 100%, 0 100%)`
    if (antiLayerRef.current)
      antiLayerRef.current.style.clipPath = `polygon(${xp} 0, 100% 0, 100% 100%, ${xp} 100%)`
    if (dividerElRef.current)
      dividerElRef.current.style.left = xp
  }, [])

  // RAF animation loop — only runs when hero is visible and not dragging
  useEffect(() => {
    function animate() {
      if (!draggingRef.current && visibleRef.current) {
        const next = dividerXRef.current + Math.sin(Date.now() / 3000) * 0.08
        applyX(Math.max(20, Math.min(80, next)))
      }
      animRef.current = requestAnimationFrame(animate)
    }

    const io = new IntersectionObserver(
      entries => { visibleRef.current = entries[0].isIntersecting },
      { threshold: 0.01 }
    )
    if (containerRef.current) io.observe(containerRef.current)

    animRef.current = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(animRef.current)
      io.disconnect()
    }
  }, [applyX])

  // Hint animation on mount
  useEffect(() => {
    const id = setTimeout(() => setHinted(true), 1200)
    return () => clearTimeout(id)
  }, [])

  const getX = useCallback((e: MouseEvent | TouchEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return dividerXRef.current
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    return Math.max(15, Math.min(85, ((clientX - rect.left) / rect.width) * 100))
  }, [])

  const onDragStart = useCallback(() => {
    draggingRef.current = true
    setDragging(true)
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (draggingRef.current) applyX(getX(e))
    }
    const onUp = () => {
      draggingRef.current = false
      setDragging(false)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [applyX, getX])

  const initClip = `polygon(0 0, ${INITIAL_X}% 0, ${INITIAL_X}% 100%, 0 100%)`
  const initClipAnti = `polygon(${INITIAL_X}% 0, 100% 0, 100% 100%, ${INITIAL_X}% 100%)`

  return (
    <section className={styles.hero} ref={containerRef}>
      {/* Normal universe layer */}
      <div ref={normalLayerRef} className={styles.layer} style={{ clipPath: initClip }}>
        <StarField mode="normal" />
        <div className={styles.moon} />
        <div className={styles.crack} style={{ left: '10%' }} />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>{t('hero.eyebrow')}</p>
          <h1 className={styles.title}>
            <span className={styles.titleLine1}>{t('hero.title1')}</span>
            <span className={`${styles.titleLine2} ${styles.gold}`}>
              {t('hero.title2')}
            </span>
          </h1>
          <p className={styles.tagline}>{t('hero.tagline')}</p>
          <div className={styles.btns}>
            <button className="btn btn-primary" onClick={() => setNotify(true)}>{t('hero.btn.story')}</button>
            <a href="#cidades" className="btn btn-secondary">{t('hero.btn.chars')}</a>
          </div>
        </div>
        <div className={styles.worldLabel} style={{ left: '5%' }}>
          {t('hero.split.normal')}
        </div>
      </div>

      {/* Anti-universe layer */}
      <div ref={antiLayerRef} className={`${styles.layer} ${styles.layerAnti}`} style={{ clipPath: initClipAnti }}>
        <StarField mode="anti" />
        <div className={styles.voidGlow} />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow} style={{ color: 'var(--rift-bright)' }}>
            {t('hero.eyebrow')}
          </p>
          <h1 className={styles.title}>
            <span className={styles.titleLine1} style={{ color: 'var(--rift-bright)' }}>
              {t('hero.title1')}
            </span>
            <GlitchText
              normal={t('hero.title2')}
              anti={['C̴o̷l̸l̶a̵p̷s̵e̴', '崩壊']}
              holdMs={700}
              as="span"
              className={`${styles.titleLine2} ${styles.rift}`}
              intensity="medium"
            />
          </h1>
          <p className={styles.tagline} style={{ color: 'var(--rift-bright)' }}>
            {t('hero.tagline')}
          </p>
          <div className={styles.btns}>
            <button className={`btn ${styles.btnRift}`} onClick={() => setNotify(true)}>{t('hero.btn.story')}</button>
            <a href="#cidades" className="btn btn-secondary">{t('hero.btn.chars')}</a>
          </div>
        </div>
        <div className={`${styles.worldLabel} ${styles.worldLabelAnti}`} style={{ right: '5%', left: 'auto' }}>
          {t('hero.split.anti')}
        </div>
      </div>

      {/* Divider */}
      <div
        ref={dividerElRef}
        className={`${styles.divider} ${dragging ? styles.dragging : ''}`}
        style={{ left: `${INITIAL_X}%` }}
        onMouseDown={onDragStart}
        onTouchStart={onDragStart}
      >
        <div className={styles.dividerLine} />
        <div className={styles.dividerHandle}>
          <span className={styles.handleArrow}>◀</span>
          <span className={styles.handleIcon}>✦</span>
          <span className={styles.handleArrow}>▶</span>
        </div>
        {!dragging && hinted && (
          <div className={styles.dividerHint}>{t('hero.split.hint')}</div>
        )}
      </div>

      {/* Scroll hint */}
      <div className={styles.scrollHint}>▼</div>

      {notify && <NotifyModal onClose={() => setNotify(false)} />}
    </section>
  )
}
