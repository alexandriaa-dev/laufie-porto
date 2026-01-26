import { useRef, useEffect } from 'react'
import { m } from 'framer-motion'

export default function ConstructionAlert() {
  const alertRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Set CSS variable untuk tinggi alert agar progress bar bisa menggunakannya
    if (alertRef.current) {
      const height = alertRef.current.offsetHeight
      document.documentElement.style.setProperty('--alert-height', `${height}px`)
    }
  }, [])

  return (
    <m.div
      ref={alertRef}
      data-construction-alert
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none"
    >
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 backdrop-blur-sm border-b border-amber-400/30 shadow-lg">
        <div className="container mx-auto px-4 py-1 text-center">
          <p className="text-xs sm:text-sm font-semibold text-white tracking-wide">
            ⚠️ Web Under Construction ⚠️
          </p>
        </div>
      </div>
    </m.div>
  )
}
