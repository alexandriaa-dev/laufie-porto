import { m, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import React, { useEffect, useMemo } from 'react'

type Props = {
  followCursor?: boolean
  pauseAnimation?: boolean
  intensity?: number
  disableOnCoarsePointer?: boolean
  className?: string
  // kontrol aurora
  auroraOpacity?: number          // 0..1
  auroraDurationSec?: number      // durasi animasi aurora (lebih kecil = lebih cepat)
  // (opsional) kontrol layer lain
  flowDurationSec?: number
  beamDurationSec?: number
}

export default function AmbientBackground({
  followCursor = false,
  pauseAnimation = false,           // animasi jalan by default
  intensity = 1,
  disableOnCoarsePointer = true,
  className = '',
  auroraOpacity = 0.7,             // lebih pudar
  auroraDurationSec = 3,           // lebih cepat (mis. 12s, sebelumnya mungkin 20s)
  flowDurationSec,
  beamDurationSec,
}: Props) {
  const shouldReduce = useReducedMotion()
  const isCoarse =
    typeof window !== 'undefined' && typeof matchMedia === 'function'
      ? matchMedia('(pointer: coarse)').matches
      : false

  const enableParallax = followCursor && !shouldReduce && !(disableOnCoarsePointer && isCoarse)

  const nx = useMotionValue<number>(0)
  const ny = useMotionValue<number>(0)

  useEffect(() => {
    if (!enableParallax) return
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      nx.set(((e.clientX - cx) / cx) * intensity)
      ny.set(((e.clientY - cy) / cy) * intensity)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [enableParallax, intensity, nx, ny])

  const px = useSpring(nx, { stiffness: 120, damping: 18, mass: 0.7 })
  const py = useSpring(ny, { stiffness: 120, damping: 18, mass: 0.7 })

  const a1x = useTransform(px, (v) => v * 40)
  const a1y = useTransform(py, (v) => v * 38)

  const flowX = useTransform(px, (v) => v * 16)
  const flowY = useTransform(py, (v) => v * 12)

  const b1x = useTransform(px, (v) => v * -8)
  const b1y = useTransform(py, (v) => v * 6)

  const pause = pauseAnimation || shouldReduce

  // Style umum (flow/beam): tetap jalan jika pause=false
  const commonAnimStyle = useMemo(
    () => ({
      animationPlayState: pause ? ('paused' as const) : ('running' as const),
    }),
    [pause]
  )

  return (
    <div className={`pointer-events-none fixed inset-0 -z-20 overflow-hidden ${className}`}>
      {/* Aurora: opacity + durasi override di sini */}
      <m.div style={{ x: a1x, y: a1y }} className="absolute inset-0">
        <div
          className="amb-aurora amb-a1-fast"
          style={{
            ...commonAnimStyle,
            opacity: auroraOpacity,                       // ≤— kurangi opacity di sini
            animationDuration: `${auroraDurationSec}s`,   // ≤— percepat animasi aurora
          }}
        />
      </m.div>

      {/* Flow overlay (opsional juga bisa dipercepat) */}
      <m.div style={{ x: flowX, y: flowY }} className="absolute inset-0">
        <div
          className="amb-flow amb-flow-fast"
          style={{
            ...commonAnimStyle,
            ...(flowDurationSec ? { animationDuration: `${flowDurationSec}s` } : null),
          }}
        />
      </m.div>

      {/* Beam (opsional) */}
      <m.div style={{ x: b1x, y: b1y }} className="absolute inset-0">
        <div
          className="amb-beam amb-beam1-fast"
          style={{
            ...commonAnimStyle,
            ...(beamDurationSec ? { animationDuration: `${beamDurationSec}s` } : null),
          }}
        />
      </m.div>
    </div>
  )
}