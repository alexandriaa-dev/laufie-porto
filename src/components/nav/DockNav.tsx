import { navItems } from '@/data/nav'
import { cn } from '@/lib/utils'
import { m, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import ThemeToggle from '@/components/common/ThemeToggle'

export default function DockNav({ activeId }: { activeId: string }) {
  const items = useMemo(() => navItems, [])
  const containerRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({})

  // Indikator: target posisi (x/y) – ukuran konstan
  const targetX = useMotionValue(0)
  const targetY = useMotionValue(0)
  const INDICATOR_SIZE = 38

  // Spring smooth (tanpa bounce)
  const springCfg = { stiffness: 280, damping: 40, mass: 1 }
  const x = useSpring(targetX, springCfg)
  const y = useSpring(targetY, springCfg)

  const [ready, setReady] = useState(false)

  const setItemRef =
    (id: string) =>
    (el: HTMLAnchorElement | null): void => {
      itemRefs.current[id] = el
    }

  const updateIndicator = () => {
    const cont = containerRef.current
    const anchor = itemRefs.current[activeId]
    if (!cont || !anchor) return

    // Posisi relatif ke container (offset)
    const left = anchor.offsetLeft
    const top = anchor.offsetTop
    const w = anchor.offsetWidth
    const h = anchor.offsetHeight

    const centerX = left + w / 2
    const centerY = top + h / 2

    targetX.set(centerX - INDICATOR_SIZE / 2)
    targetY.set(centerY - INDICATOR_SIZE / 2)

    if (!ready) setReady(true)
  }

  useEffect(() => {
    const raf = requestAnimationFrame(updateIndicator)
    const onResize = () => updateIndicator()
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId])

  // Smooth scroll saat klik navbar
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    // Gunakan scrollIntoView untuk hasil paling konsisten
    el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
    // Sinkronkan hash (tidak mengganggu scroll)
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <m.nav
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 40, opacity: 0 }}
      className="fixed inset-x-0 bottom-4 z-[50] flex justify-center"
      style={{ pointerEvents: 'auto' }}
    >
      <div
        ref={containerRef}
        className="glass shadow-rim relative flex items-center gap-2 rounded-2xl px-4 py-3 backdrop-blur-xl"
        style={{ position: 'relative' }}
      >
        {/* Indikator aktif: gradasi warna ke-2 → ke-3 (c2 → c3) */}
        <m.span
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-0 rounded-full bg-gradient-to-b from-[#60A5FA] to-[#0062FF] shadow-glow"
          style={{ width: INDICATOR_SIZE, height: INDICATOR_SIZE, x, y, opacity: ready ? 1 : 0 }}
        />

        {items.map((it) => {
          const Icon = it.icon
          const active = activeId === it.id
          return (
            <a
              key={it.id}
              ref={setItemRef(it.id)}
              href={`#${it.id}`}
              onClick={(e) => handleNavClick(e, it.id)}
              className={cn(
                'relative z-10 grid place-items-center rounded-xl p-2.5 transition-colors',
                active ? 'text-white' : 'text-white/55 hover:text-white',
              )}
              aria-label={it.label}
            >
              <Icon size={22} />
            </a>
          )
        })}

        {/* pemisah tipis */}
        <span className="mx-1 h-6 w-px bg-white/10" />

        {/* theme icon tanpa border/background */}
        <div className="relative z-10">
          <ThemeToggle variant="bare" />
        </div>
      </div>
    </m.nav>
  )
}