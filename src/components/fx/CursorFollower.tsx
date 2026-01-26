import { m, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'

// Ukuran cursors (tetap seperti sebelumnya)
const DOT_SIZE = 10          // lingkaran kecil (filled)
const RING_SIZE = 28         // trailing ring (lebih kecil)

// Elemen interaktif (untuk efek scale)
const interactiveSelector =
  'a,button,[role="button"],input,textarea,select,summary,label,.interactive,.link,.cursor-pointer'

export default function CursorFollower() {
  // Posisi kursor mentah
  const rawX = useMotionValue(-1000)
  const rawY = useMotionValue(-1000)

  // Samakan karakter animasi seperti contoh:
  // Main cursor: spring cepat (stiffness 500, damping 28)
  const fastX = useSpring(rawX, { stiffness: 500, damping: 28, mass: 1 })
  const fastY = useSpring(rawY, { stiffness: 500, damping: 28, mass: 1 })

  // Trailing cursor: spring lebih lambat (stiffness 150, damping 15)
  const slowX = useSpring(rawX, { stiffness: 150, damping: 15, mass: 1 })
  const slowY = useSpring(rawY, { stiffness: 150, damping: 15, mass: 1 })

  // Pusatkan elemen di posisi kursor
  const ix = useTransform(fastX, (v) => v - DOT_SIZE / 2)
  const iy = useTransform(fastY, (v) => v - DOT_SIZE / 2)
  const ox = useTransform(slowX, (v) => v - RING_SIZE / 2)
  const oy = useTransform(slowY, (v) => v - RING_SIZE / 2)

  // Scale saat hover elemen interaktif (match contoh: 1.5 / 1.2)
  const scaleDot = useSpring(1, { stiffness: 500, damping: 28 })
  const scaleRing = useSpring(1, { stiffness: 150, damping: 15 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
    }
    const onOver = (e: Event) => {
      const el = e.target as Element | null
      const hot = !!el?.closest?.(interactiveSelector)
      scaleDot.set(hot ? 1.5 : 1)
      scaleRing.set(hot ? 1.2 : 1)
    }
    const onLeave = () => {
      scaleDot.set(1)
      scaleRing.set(1)
    }

    window.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('mouseover', onOver, true)
    document.addEventListener('mouseleave', onLeave, true)

    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', onOver, true)
      document.removeEventListener('mouseleave', onLeave, true)
    }
  }, [rawX, rawY, scaleDot, scaleRing])

  return (
    <>
      {/* Trailing cursor: ring abu-abu, mengikuti lebih lambat */}
      <m.div
        className="pointer-events-none fixed z-[45] rounded-full border border-white/20"
        style={{
          width: RING_SIZE,
          height: RING_SIZE,
          x: ox,
          y: oy,
          scale: scaleRing,
          background: 'transparent',
          pointerEvents: 'none',
          touchAction: 'none',
        }}
      />
      {/* Main cursor: dot abu-abu, mengikuti cepat */}
      <m.div
        className="pointer-events-none fixed z-[46] rounded-full bg-white/40"
        style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          x: ix,
          y: iy,
          scale: scaleDot,
          pointerEvents: 'none',
          touchAction: 'none',
        }}
      />
    </>
  )
}