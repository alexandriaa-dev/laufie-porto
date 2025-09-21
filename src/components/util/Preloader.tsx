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
  minDurationMs = 3000,     // 3 seconds to ensure full 0-100% progression
  timeoutMs = 10000,
  extraHoldMs = 800,        // hold at 100% for 800ms before exit
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

  // 1) Guaranteed 0-100% progression with controlled timing
  const loaderPromise = useMemo(() => {
    const startTime = performance.now()
    const guaranteedMinTime = 2500 // 2.5 seconds minimum for guaranteed smooth progression
    
    // Create a controlled progression that ALWAYS goes 0-100%
    const createControlledProgression = () => {
      return new Promise<void>((resolve) => {
        const progressionSteps = [
          { target: 0.15, delay: 200 },   // 0-15% in 200ms
          { target: 0.35, delay: 400 },  // 15-35% in 400ms  
          { target: 0.55, delay: 600 },  // 35-55% in 600ms
          { target: 0.75, delay: 500 },  // 55-75% in 500ms
          { target: 0.90, delay: 400 },  // 75-90% in 400ms
          { target: 1.00, delay: 400 },  // 90-100% in 400ms
        ]
        
        let currentStep = 0
        const totalSteps = progressionSteps.length
        
        const executeStep = () => {
          if (currentStep >= totalSteps) {
            resolve()
            return
          }
          
          const step = progressionSteps[currentStep]
          setTarget(step.target)
          
          setTimeout(() => {
            currentStep++
            executeStep()
          }, step.delay)
        }
        
        // Start progression after a small delay
        setTimeout(executeStep, 100)
      })
    }

    // Track actual resources in background (but don't let them control the progression)
    const trackResources = () => {
      const imgs = Array.from(document.images || []) as HTMLImageElement[]
      
      // Track images silently
      imgs.forEach((img) => {
        if (!img.complete || img.naturalWidth === 0) {
          img.addEventListener('load', () => {}, { once: true })
          img.addEventListener('error', () => {}, { once: true })
        }
      })

      // Track fonts silently
      if (waitFonts && 'fonts' in document && (document as any).fonts?.ready) {
        (document as any).fonts.ready.catch(() => {})
      }
    }

    // Start resource tracking in background
    trackResources()
    
    // Return the controlled progression promise
    return createControlledProgression()
  }, [waitFonts])

  // 2) smoothing progress (lerp) + ensure exact 0-100% progression
  useEffect(() => {
    let raf: number
    const step = () => {
      setProgress((prev) => {
        const diff = target - prev
        // Ensure minimum step size for smooth progression
        const minStep = 0.008 // slightly faster minimum step
        const maxStep = 0.12 // slightly slower maximum step for smoother animation
        const next = prev + Math.max(Math.min(diff * 0.16, maxStep), diff > 0 ? minStep : 0)
        // Ensure we reach exactly 100% when target is 1.0
        return next >= 1.0 ? 1.0 : next
      })
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target])

  // Ensure progress starts from 0% and progresses smoothly
  useEffect(() => {
    // Reset progress to 0 when component mounts
    setProgress(0)
    setTarget(0)
  }, [])

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

  // exit ONLY when progress reaches exactly 100% + min hold terpenuhi
  useEffect(() => {
    if (finishedRef.current) return
    // Only exit when progress is exactly 100% (not 99.9%)
    if (progress >= 1.0 && performance.now() >= minHoldAtRef.current) {
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
      className={`fixed inset-0 ${zIndexClass} grid place-items-center transition-all duration-500 ${
        phase === 'enter' ? 'opacity-0 scale-[0.95]' : phase === 'show' ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.05]'
      }`}
      style={{
        background: `
          radial-gradient(1200px 800px at 70% -10%, rgba(0,98,255,.15), transparent 70%) no-repeat,
          radial-gradient(900px 600px at 20% 20%, rgba(0,19,190,.12), transparent 60%) no-repeat,
          hsl(220 15% 7%)
        `,
      }}
      aria-label="Loading"
      role="status"
      aria-busy="true"
    >
      <style>{`@keyframes preloader-rotate { to { transform: rotate(360deg); } }`}</style>

      {/* Ambient background elements similar to website */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="amb-aurora amb-a1-fast" />
        <div className="amb-flow amb-flow-fast" />
        <div className="amb-beam amb-beam1-fast" />
      </div>

      <div className="relative glass p-8 rounded-2xl">
        <div className="grid place-items-center gap-4">
        <div className="relative" style={{ width: size, height: size }}>
          {/* Outer glow effect using website colors */}
          <div
            className="absolute inset-0 rounded-full opacity-40 blur-xl"
            style={{
              background: 'radial-gradient(70% 70% at 50% 50%, rgba(0,98,255, 0.3) 0%, transparent 70%)',
              animation: 'pulse 2s ease-in-out infinite',
            }}
            aria-hidden
          />
          
          {/* Inner glow effect using website colors */}
          <div
            className="absolute inset-2 rounded-full opacity-20 blur-lg"
            style={{
              background: 'radial-gradient(60% 60% at 50% 50%, rgba(96,165,250, 0.4) 0%, transparent 70%)',
            }}
            aria-hidden
          />

        {/* SVG ring dengan styling modern */}
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="relative block drop-shadow-2xl" aria-hidden>
          {/* Track dengan gradient */}
          <defs>
            <linearGradient id="track-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.12)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
            </linearGradient>
            <linearGradient id="progress-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#EEF4FF" />
              <stop offset="33%" stopColor="#60A5FA" />
              <stop offset="66%" stopColor="#0062FF" />
              <stop offset="100%" stopColor="#0013BE" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Track */}
          <circle 
            cx={size / 2} 
            cy={size / 2} 
            r={r} 
            stroke="url(#track-grad)" 
            strokeWidth={stroke} 
            fill="none" 
            opacity="0.6"
          />
          
          {/* Progress arc dengan efek modern */}
          <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            <g style={{ transformOrigin: '50% 50%', animation: `preloader-rotate ${spinMs}ms linear infinite` }}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke="url(#progress-grad)"
                strokeWidth={stroke}
                fill="none"
                strokeDasharray={C}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                filter="url(#glow)"
                opacity="0.9"
              />
            </g>
          </g>
        </svg>

          {/* Logo di tengah dengan efek modern */}
          <div className="absolute inset-0 grid place-items-center">
            <div 
              className="relative"
              style={{
                animation: 'pulse 3s ease-in-out infinite',
              }}
            >
              <img
                src={logoSrc}
                alt="Logo"
                className="opacity-95"
                style={{
                  width: logoSize,
                  height: logoSize,
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 4px 20px rgba(0,98,255, 0.4)) brightness(1.1)',
                }}
              />
              {/* Subtle glow behind logo using website colors */}
              <div
                className="absolute inset-0 rounded-full opacity-30 blur-md"
                style={{
                  background: 'radial-gradient(50% 50% at 50% 50%, rgba(96,165,250, 0.2) 0%, transparent 70%)',
                  width: logoSize * 1.5,
                  height: logoSize * 1.5,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                aria-hidden
              />
            </div>
          </div>
        </div>

        {/* Persentase dengan styling modern menggunakan website colors */}
        <div className="text-sm font-medium text-white/90 tabular-nums tracking-wide">
          {pct}%
        </div>
        </div>
      </div>
    </div>
  )
}