'use client'

import { useEffect, useRef } from 'react'

interface Props {
  mode?: 'normal' | 'anti'
  lite?: boolean
}

export default function StarField({ mode = 'normal', lite = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId = 0
    let W = 0, H = 0
    let frameCount = 0
    let isVisible = false

    type Star = {
      x: number; y: number; r: number
      alpha: number; alphaDir: number
      gold: boolean
    }
    type Shooter = {
      x: number; y: number; len: number
      speed: number; alpha: number; angle: number
    }

    let stars: Star[] = []
    let shooters: Shooter[] = []

    function resize() {
      const rect = canvas!.parentElement?.getBoundingClientRect()
      W = canvas!.width = rect?.width ?? window.innerWidth
      H = canvas!.height = rect?.height ?? window.innerHeight
      buildStars()
    }

    function buildStars() {
      const divisor = lite ? 8000 : 3500
      const count = Math.floor((W * H) / divisor)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.8 + 0.2,
        alpha: Math.random(),
        alphaDir: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.006 + 0.001),
        gold: mode === 'normal' ? Math.random() < 0.15 : false,
      }))
    }

    function spawnShooter() {
      if (!lite && Math.random() < 0.003) {
        shooters.push({
          x: Math.random() * W * 0.7,
          y: Math.random() * H * 0.4,
          len: Math.random() * 130 + 60,
          speed: Math.random() * 7 + 4,
          alpha: 1,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
        })
      }
    }

    function draw() {
      frameCount++
      if (lite && frameCount % 2 !== 0) {
        animId = requestAnimationFrame(draw)
        return
      }

      ctx!.clearRect(0, 0, W, H)

      for (const s of stars) {
        s.alpha += s.alphaDir
        if (s.alpha > 1) { s.alpha = 1; s.alphaDir *= -1 }
        if (s.alpha < 0) { s.alpha = 0; s.alphaDir *= -1 }

        ctx!.beginPath()
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2)

        if (mode === 'anti') {
          ctx!.fillStyle = `rgba(180, 120, 255, ${s.alpha})`
        } else if (s.gold) {
          ctx!.fillStyle = `rgba(240, 200, 80, ${s.alpha})`
        } else {
          ctx!.fillStyle = `rgba(200, 220, 255, ${s.alpha})`
        }
        ctx!.fill()

        if (s.r > 1.2) {
          const c = mode === 'anti'
            ? `rgba(180,120,255,${s.alpha * 0.35})`
            : s.gold
              ? `rgba(240,200,80,${s.alpha * 0.3})`
              : `rgba(200,220,255,${s.alpha * 0.3})`
          ctx!.strokeStyle = c
          ctx!.lineWidth = 0.5
          ctx!.beginPath()
          ctx!.moveTo(s.x - s.r * 3, s.y)
          ctx!.lineTo(s.x + s.r * 3, s.y)
          ctx!.stroke()
          ctx!.beginPath()
          ctx!.moveTo(s.x, s.y - s.r * 3)
          ctx!.lineTo(s.x, s.y + s.r * 3)
          ctx!.stroke()
        }
      }

      spawnShooter()
      for (let i = shooters.length - 1; i >= 0; i--) {
        const s = shooters[i]
        const ex = s.x + Math.cos(s.angle) * s.len
        const ey = s.y + Math.sin(s.angle) * s.len
        const grad = ctx!.createLinearGradient(s.x, s.y, ex, ey)
        if (mode === 'anti') {
          grad.addColorStop(0, `rgba(180, 100, 255, ${s.alpha})`)
        } else {
          grad.addColorStop(0, `rgba(255, 248, 200, ${s.alpha})`)
        }
        grad.addColorStop(1, 'rgba(0,0,0,0)')
        ctx!.beginPath()
        ctx!.moveTo(s.x, s.y)
        ctx!.lineTo(ex, ey)
        ctx!.strokeStyle = grad
        ctx!.lineWidth = 1.5
        ctx!.stroke()
        s.x += Math.cos(s.angle) * s.speed
        s.y += Math.sin(s.angle) * s.speed
        s.alpha -= 0.018
        if (s.alpha <= 0 || s.x > W || s.y > H) shooters.splice(i, 1)
      }

      animId = requestAnimationFrame(draw)
    }

    function start() {
      if (animId === 0) draw()
    }

    function stop() {
      if (animId !== 0) {
        cancelAnimationFrame(animId)
        animId = 0
      }
    }

    // Pause when scrolled out of view
    const io = new IntersectionObserver(
      entries => {
        isVisible = entries[0].isIntersecting
        isVisible ? start() : stop()
      },
      { threshold: 0.01 }
    )
    io.observe(canvas.parentElement ?? canvas)

    // Pause when tab is hidden
    function onVisibilityChange() {
      if (document.hidden) stop()
      else if (isVisible) start()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement ?? canvas)
    resize()

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [mode, lite])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        willChange: 'transform',
      }}
    />
  )
}
