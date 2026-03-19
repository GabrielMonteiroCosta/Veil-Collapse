'use client'
import type { CityTheme } from '@/data/cities'
import {
  Star,
  Sunset,
  Zap,
  Anchor,
  Moon,
  Cog,
  FlaskConical,
  Crown,
} from 'lucide-react'

interface Props {
  theme: CityTheme
  color: string
  glow: string
  size?: number
  className?: string
}

const ICONS: Record<CityTheme, React.ElementType> = {
  normal:    Star,
  western:   Sunset,
  cyberpunk: Zap,
  pirate:    Anchor,
  witch:     Moon,
  mechanic:  Cog,
  science:   FlaskConical,
  steampunk: Crown,
}

export default function CityIcon({ theme, color, glow, size = 80, className }: Props) {
  const Icon = ICONS[theme]
  return (
    <Icon
      size={size}
      color={color}
      strokeWidth={1.5}
      style={{ filter: `drop-shadow(0 0 10px ${glow})` }}
      className={className}
    />
  )
}
