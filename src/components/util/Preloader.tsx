import React, { useEffect, useMemo, useRef, useState } from 'react'

type Props = {
  onDone: () => void
  // timing
  minDurationMs?: number
  timeoutMs?: number
  extraHoldMs?: number
  waitFonts?: boolean
  exitMs?: number
  // visual
  zIndexClass?: string
  sizeMobile?: number
  sizeDesktop?: number
  strokeMobile?: number
  strokeDesktop?: number
  logoSrc?: string
  logoRatio?: number // 0..1 (proporsi logo terhadap inner diameter ring)
}

export default function Preloader({
  onDone,
  minDurationMs = 700,
  timeoutMs = 10000,
  extraHoldMs = 320,
  waitFonts = true,
  exitMs = 360,
  zIndexClass = 'z-[999]',
  sizeMobile = 72,           // kecil
  sizeDesktop = 88,
  strokeMobile = 3,        // sedikit lebih tebal dari sebelumnya
  strokeDesktop = 4,
  logoSrc = '/laufie.svg',
  logoRatio = 1.5,          // logo sedikit lebih kecil → jarak ring lebih rapat
}: Props) {
  const [phase, setPhase] = useState<'enter' | 'show' | 'exit' | 'done'>('enter')
  const [target, setTarget] = useState(0)   // 0..1 dari loader
  const [progress, setProgress] = useState(0) // 0..1 smoothed

  // responsive breakpoint (md ≥ 768)
  const getIsMdUp = () =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : false
  const [isMdUp, setIsMdUp] = useState(getIsMdUp())
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mql = window.matchMedia('(min-width: 768px)')
    const handler = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsMdUp('matches' in e ? e.matches : (e as MediaQueryList).matches)
    handler(mql)
    if (mql.addEventListener) mql.addEventListener('change', handler as EventListener)
    else mql.addListener(handler as any)
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', handler as EventListener)
      else mql.removeListener(handler as any)
    }
  }, [])

  const size = isMdUp ? sizeDesktop : sizeMobile
  const stroke = isMdUp ? strokeDesktop : strokeMobile

  // metrik lingkaran
  const r = (size - stroke) / 2
  const C = 2 * Math.PI * r
  const dash = C
  const dashOffset = C * (1 - progress)

  // ukuran logo agar jarak ring rapat
  const innerDiameter = size - stroke * 2
  const logoSize = Math.max(10, Math.floor(innerDiameter * logoRatio))

  // timing
  const startRef = useRef<number>(performance.now())
  const minHoldAtRef = useRef<number>(startRef.current + minDurationMs)
  const finishedRef = useRef(false)

  // 1) track semua <img> + (opsional) fonts
  const loaderPromise = useMemo(() => {
    const imgs = Array.from(document.images || []) as HTMLImageElement[]
    const total = imgs.length
    let loaded = 0

    const track = () => {
      loaded += 1
      const t = loaded / Math.max(total, 1)
      setTarget((prev) => (t > prev ? t : prev))
    }

    const ps = imgs.map((img) => {
      if (img.complete && img.naturalWidth > 0) {
        track()
        return Promise.resolve(true)
      }
      return new Promise<boolean>((resolve) => {
        const onLoad = () => { cleanup(); track(); resolve(true) }
        const onError = () => { cleanup(); track(); resolve(false) }
        const cleanup = () => {
          img.removeEventListener('load', onLoad)
          img.removeEventListener('error', onError)
        }
        img.addEventListener('load', onLoad, { once: true })
        img.addEventListener('error', onError, { once: true })
      })
    })

    const fontsReady =
      waitFonts && 'fonts' in document && (document as any).fonts?.ready
        ? (document as any).fonts.ready.catch(() => {})
        : Promise.resolve()

    return Promise.allSettled([...ps, fontsReady]).finally(() => setTarget(1))
  }, [waitFonts])

  // 2) smoothing progress (lerp) + tetap bergerak
  useEffect(() => {
    let raf: number
    const step = () => {
      setProgress((prev) => {
        const diff = target - prev
        const next = prev + Math.max(diff * 0.16, diff > 0 ? 0.006 : 0) // smooth + min step
        return next >= 0.999 ? 1 : next
      })
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target])

  // 3) lifecycle: fade-in/out
  useEffect(() => {
    const id = requestAnimationFrame(() => setPhase('show'))
    return () => cancelAnimationFrame(id)
  }, [])

  // bailout
  useEffect(() => {
    const to = setTimeout(() => beginExit(), timeoutMs)
    return () => clearTimeout(to)
  }, [timeoutMs])

  // exit ketika penuh + min hold terpenuhi
  useEffect(() => {
    if (finishedRef.current) return
    if (progress >= 0.999 && performance.now() >= minHoldAtRef.current) {
      const id = setTimeout(() => beginExit(), extraHoldMs)
      return () => clearTimeout(id)
    }
  }, [progress, extraHoldMs])

  function beginExit() {
    if (finishedRef.current) return
    finishedRef.current = true
    setPhase('exit')
    setTimeout(() => {
      setPhase('done')
      onDone()
    }, exitMs)
  }

  if (phase === 'done') return null

  const pct = Math.round(progress * 100)
  const spinMs = 1300 // sedikit lebih cepat

  return (
    <div
      className={`fixed inset-0 ${zIndexClass} grid place-items-center bg-[rgb(6,10,18)] transition-all duration-300 ${
        phase === 'enter' ? 'opacity-0 scale-[0.98]' : phase === 'show' ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
      }`}
      style={{
        backgroundImage:
          'radial-gradient(1000px 700px at 50% 10%, rgba(255,255,255,0.04), transparent 60%)',
      }}
      aria-label="Loading"
      role="status"
      aria-busy="true"
    >
      <style>{`@keyframes preloader-rotate { to { transform: rotate(360deg); } }`}</style>

      <div className="grid place-items-center gap-3">
        <div className="relative" style={{ width: size, height: size }}>
          {/* glow lembut */}
          <div
            className="absolute inset-0 rounded-full opacity-35 blur-lg"
            style={{
              background:
                'radial-gradient(60% 60% at 50% 50%, color-mix(in oklab, var(--c3) 28%, transparent) 0%, transparent 70%)',
            }}
            aria-hidden
          />

        {/* SVG ring */}
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="relative block" aria-hidden>
          {/* Track */}
          <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.14)" strokeWidth={stroke} fill="none" />
          {/* Progress arc (sesuai persen) sambil diputar */}
          <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            <g style={{ transformOrigin: '50% 50%', animation: `preloader-rotate ${spinMs}ms linear infinite` }}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke="url(#preloader-grad)"
                strokeWidth={stroke}
                fill="none"
                strokeDasharray={C}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
              />
            </g>
          </g>
          <defs>
            <linearGradient id="preloader-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--c2)" />
              <stop offset="60%" stopColor="var(--c3)" />
              <stop offset="100%" stopColor="var(--c4)" />
            </linearGradient>
          </defs>
        </svg>

          {/* Logo di tengah (lebih kecil) */}
          <div className="absolute inset-0 grid place-items-center">
            <img
              src={logoSrc}
              alt="Logo"
              className="opacity-90"
              style={{
                width: logoSize,
                height: logoSize,
                objectFit: 'contain',
                filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.35))',
              }}
            />
          </div>
        </div>

        {/* Persentase */}
        <div className="text-xs font-semibold text-white/80 tabular-nums">{pct}%</div>

        {/* Tombol Skip */}
        <button
          type="button"
          onClick={beginExit}
          className="rounded-md border border-white/15 px-3 py-1.5 text-xs text-white/80 hover:bg-white/5"
        >
          Skip
        </button>
      </div>
    </div>
  )
}