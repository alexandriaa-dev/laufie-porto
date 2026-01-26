import { useEffect, useState } from 'react'
import useScrollProgress from '@/hooks/useScrollProgress'
import { m } from 'framer-motion'

export default function TopProgressBar() {
  const p = useScrollProgress()
  const [top, setTop] = useState(0)

  useEffect(() => {
    const updateTop = () => {
      // Cari alert element dan ambil tingginya
      const alertEl = document.querySelector('[data-construction-alert]')
      if (alertEl) {
        const height = (alertEl as HTMLElement).offsetHeight
        setTop(height)
      } else {
        // Fallback: coba ambil dari CSS variable
        const alertHeight = parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue('--alert-height') || '0'
        )
        if (alertHeight > 0) {
          setTop(alertHeight)
        } else {
          // Final fallback: estimasi tinggi alert (py-1 + text + border)
          setTop(24)
        }
      }
    }

    // Update setelah alert selesai animasi (400ms)
    const timeout1 = setTimeout(updateTop, 500)
    // Update juga saat resize
    window.addEventListener('resize', updateTop)
    // Update juga dengan interval untuk memastikan
    const interval = setInterval(updateTop, 100)
    
    return () => {
      clearTimeout(timeout1)
      clearInterval(interval)
      window.removeEventListener('resize', updateTop)
    }
  }, [])

  if (top === 0) return null // Jangan render sampai kita tahu posisinya

  return (
    <div 
      className="pointer-events-none fixed left-0 right-0 z-[9998] h-1 bg-transparent" 
      style={{ top: `${top}px` }}
    >
      <m.div
        style={{ scaleX: p }}
        className="origin-left h-full w-full bg-grad-4"
      />
    </div>
  )
}