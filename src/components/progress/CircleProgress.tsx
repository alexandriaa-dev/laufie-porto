import React, { useEffect, useState } from 'react'
import useScrollProgress from '@/hooks/useScrollProgress'
import { formatPercent } from '@/lib/utils'

export default function CircleProgress() {
  const p = useScrollProgress()

  // responsive: smaller on mobile, original on md+
  const getIsMdUp = () =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : false
  const [isMdUp, setIsMdUp] = useState(getIsMdUp())

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mql = window.matchMedia('(min-width: 768px)')
    const handler = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsMdUp('matches' in e ? e.matches : (e as MediaQueryList).matches)

    // init + subscribe
    handler(mql)
    if (mql.addEventListener) mql.addEventListener('change', handler as EventListener)
    else mql.addListener(handler as any)
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', handler as EventListener)
      else mql.removeListener(handler as any)
    }
  }, [])

  const size = isMdUp ? 56 : 42
  const stroke = isMdUp ? 2.4 : 2
  const r = (size - stroke) / 2
  const C = 2 * Math.PI * r
  const offset = C * (1 - p)

  return (
    <button
      aria-label="Scroll progress"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="
        fixed z-40 grid place-items-center rounded-full border border-white/10 bg-black/40 backdrop-blur-xl
        bottom-4 right-4 p-1
        md:bottom-6 md:right-6 md:p-1.5
      "
      title={`Scroll to top • ${formatPercent(p)}`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(255,255,255,.12)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#grad4)"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={C}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
        <defs>
          {/* gunakan gradasi tema: c2 → c3 → c4 */}
          <linearGradient id="grad4" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--c2)" />
            <stop offset="60%" stopColor="var(--c3)" />
            <stop offset="100%" stopColor="var(--c4)" />
          </linearGradient>
        </defs>
      </svg>
      <span
        className="
          absolute font-semibold text-white/80
          text-[11px] md:text-[12px]
        "
      >
        {formatPercent(p)}
      </span>
    </button>
  )
}