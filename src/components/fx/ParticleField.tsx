import React, { useMemo } from 'react'

type Orb = { x: number; y: number; size: number; hue: number }

type Props = {
  count?: number
  opacity?: number // 0..1
  sizeMin?: number
  sizeMax?: number
  hueMin?: number
  hueMax?: number
  zIndexClass?: string // mis. 'z-0' | 'z-10' | '-z-10'
  className?: string
}

const rand = (a: number, b: number) => Math.random() * (b - a) + a

export default function ParticleField({
  count = 24,
  opacity = 1,     // cukup pudar tapi masih terlihat
  sizeMin = 4,
  sizeMax = 8,
  hueMin = 205,
  hueMax = 230,
  zIndexClass = 'z-0', // pakai z-0 biar tidak ketumpuk background lain
  className,
}: Props) {
  const orbs = useMemo<Orb[]>(
    () =>
      Array.from({ length: count }, () => ({
        x: rand(4, 96),
        y: rand(4, 96),
        size: rand(sizeMin, sizeMax),
        hue: rand(hueMin, hueMax),
      })),
    [count, sizeMin, sizeMax, hueMin, hueMax]
  )

  return (
    <div
      className={`pointer-events-none fixed inset-0 ${zIndexClass} overflow-hidden ${className || ''}`}
      style={{ isolation: 'isolate' }} // bantu layer blending
      aria-hidden
    >
      {orbs.map((o, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${o.x}%`,
            top: `${o.y}%`,
            width: o.size,
            height: o.size,
            // pudar tapi terlihat; naikkan angka kalau masih kurang
            background: `radial-gradient(circle at 30% 30%,
              hsla(${o.hue}, 100%, 70%, 0.45),
              hsla(${o.hue}, 100%, 60%, 0.15) 60%,
              transparent 70%)`,
            filter: 'blur(0.8px)',
            mixBlendMode: 'screen',
            opacity,
          }}
        />
      ))}
    </div>
  )
}