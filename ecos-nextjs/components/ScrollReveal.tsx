'use client'

import { useEffect } from 'react'

export default function ScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))

    // CSS [data-reveal] already hides elements — just add inline transition to override CSS Modules
    els.forEach(el => {
      el.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
    })

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        const el = entry.target as HTMLElement
        const delay = parseInt(el.dataset.delay || '0')

        setTimeout(() => {
          el.style.opacity = '1'
          el.style.transform = 'none'
          // After transition: remove data-reveal attribute (CSS selector no longer applies)
          // and all inline styles so CSS module hover effects work normally
          setTimeout(() => {
            el.removeAttribute('data-reveal')
            el.style.removeProperty('opacity')
            el.style.removeProperty('transform')
            el.style.removeProperty('transition')
          }, 660)
        }, delay)

        observer.unobserve(el)
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' })

    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return null
}
