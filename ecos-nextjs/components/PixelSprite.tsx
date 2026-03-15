import styles from './PixelSprite.module.css'

// Pixel grid: each cell is a CSS color string or null (transparent)
export type PixelGrid = (string | null)[][]

interface Props {
  grid: PixelGrid
  pixelSize?: number
  className?: string
  glow?: string
}

export default function PixelSprite({ grid, pixelSize = 4, className = '', glow }: Props) {
  const height = grid.length
  const width = grid[0]?.length ?? 0

  return (
    <div
      className={`${styles.sprite} ${className}`}
      style={{
        width: width * pixelSize,
        height: height * pixelSize,
        filter: glow ? `drop-shadow(0 0 6px ${glow})` : undefined,
      }}
    >
      {grid.map((row, y) =>
        row.map((color, x) =>
          color ? (
            <div
              key={`${x}-${y}`}
              className={styles.pixel}
              style={{
                left: x * pixelSize,
                top: y * pixelSize,
                width: pixelSize,
                height: pixelSize,
                background: color,
              }}
            />
          ) : null
        )
      )}
    </div>
  )
}
