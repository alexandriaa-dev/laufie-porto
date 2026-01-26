import React, { useEffect, useId, useMemo, useRef, useState } from 'react'
import { navItems } from '@/data/nav'
import { cn } from '@/lib/utils'
import { m, AnimatePresence, useReducedMotion } from 'framer-motion'
import type { Transition, Variants } from 'framer-motion'
import { Menu, Sun, Moon, X } from 'lucide-react'

type Props = {
  activeId?: string
  className?: string
}

export default function MobileNav({ activeId, className }: Props) {
  const items = useMemo(() => navItems, [])
  const active = items.find((n) => n.id === activeId) || items[0]
  const ActiveIcon = active.icon

  const [open, setOpen] = useState(false)
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document === 'undefined') return true
    return document.documentElement.classList.contains('dark')
  })

  const shouldReduceMotion = useReducedMotion()

  const dialogId = useId()
  const titleId = useId()
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)

  const scrollToId = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
    history.replaceState(null, '', `#${id}`)
  }

  const toggleTheme = () => {
    const root = document.documentElement
    root.classList.toggle('dark')
    setIsDark(root.classList.contains('dark'))
  }

  // Body scroll lock + focus
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => closeBtnRef.current?.focus(), 30)
    return () => {
      document.body.style.overflow = prev
      clearTimeout(t)
    }
  }, [open])

  // Close on ESC
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Motion configs (typed)
  const sheetTransition: Transition = shouldReduceMotion
    ? { duration: 0.15, ease: [0.22, 1, 0.36, 1] }
    : { type: 'spring', stiffness: 420, damping: 34, mass: 0.8 }

  const orchestrate: Transition = shouldReduceMotion
    ? { duration: 0.12 }
    : { staggerChildren: 0.05, delayChildren: 0.03 }

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 6 },
    show: {
      opacity: 1,
      y: 0,
      transition: orchestrate,
    },
  }

  const tileVariants: Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 10,
      scale: shouldReduceMotion ? 1 : 0.98,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <m.nav
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 40, opacity: 0 }}
      className={cn('fixed inset-x-0 bottom-0 z-[80] md:hidden', className)}
      style={{ pointerEvents: 'auto' }}
      aria-label="Mobile navigation"
    >
      {/* Dock tray */}
      <div
        className="pointer-events-none mx-auto mb-3 flex w-full items-center justify-center"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="pointer-events-auto inline-flex items-center gap-2.5">
          {/* Active chip (pill) — match height with menu button (h-12) */}
          <div
            className="
              relative inline-flex h-12 items-center rounded-full
              border border-white/15 bg-black/40 px-4
              backdrop-blur-xl
              shadow-[0_12px_30px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)]
            "
          >
            {/* soft glow */}
            <span
              aria-hidden
              className="absolute -inset-1 rounded-full opacity-40 blur-lg"
              style={{
                background:
                  'radial-gradient(40% 60% at 50% 50%, color-mix(in oklab, var(--c3) 45%, transparent) 0%, transparent 60%)',
              }}
            />
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={active.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-[1] flex items-center gap-2.5"
              >
                <ActiveIcon size={16} className="text-white/90" />
                <span className="text-sm font-semibold text-white">{active.label}</span>
              </m.div>
            </AnimatePresence>
          </div>

          {/* Menu button (h-12 w-12) */}
          <m.button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls={dialogId}
            whileTap={{ scale: 0.96 }}
            className="
              relative grid h-12 w-12 place-items-center overflow-hidden rounded-full text-white
              ring-1 ring-white/20
              transition-transform duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40
            "
            style={{ background: 'linear-gradient(135deg, var(--c2), var(--c3))' }}
          >
            {/* aura glow */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-[1] rounded-full opacity-60 blur-xl"
              style={{
                background:
                  'radial-gradient(60% 60% at 50% 50%, color-mix(in oklab, var(--c3) 45%, transparent) 0%, transparent 70%)',
              }}
            />
            <Menu size={20} />
          </m.button>
        </div>
      </div>

      {/* Sheet */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-[2px]"
              onClick={() => setOpen(false)}
            />

            {/* Floating bottom panel - centered via inset-x-0 + mx-auto */}
            <m.div
              key="sheet"
              initial={{ y: shouldReduceMotion ? 0 : 28, opacity: 0.98 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: shouldReduceMotion ? 0 : 26, opacity: 0.98 }}
              transition={sheetTransition}
              drag={!shouldReduceMotion ? 'y' : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.06}
              onDragEnd={(_, info) => {
                const shouldClose = info.offset.y > 110 || info.velocity.y > 800
                if (shouldClose) setOpen(false)
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              id={dialogId}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                'fixed inset-x-0 z-[95] mx-auto',
                'w:[min(600px,calc(100vw-24px))] sm:w-[min(600px,calc(100vw-24px))]',
                'rounded-[22px] border border-white/10',
                'bg-black/90 backdrop-saturate-150',
                'shadow-[0_-20px_50px_rgba(0,0,0,0.6)]',
                'p-4'
              )}
              style={{
                bottom: 'calc(env(safe-area-inset-bottom, 0px) + 14px)',
                backgroundImage:
                  'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0) 18%), radial-gradient(120% 140% at 50% 120%, color-mix(in oklab, var(--c4) 8%, transparent) 0%, transparent 50%)',
                backgroundBlendMode: 'overlay, normal',
              }}
            >
              {/* Top inner highlight border */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-[1] rounded-[22px]"
                style={{
                  boxShadow:
                    'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(255,255,255,0.02)',
                }}
              />

              {/* Header */}
              <div className="mb-4 flex items-center justify-between px-1">
                <h3 id={titleId} className="text-lg font-semibold">
                  Navigation
                </h3>
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="
                    grid h-8 w-8 place-items-center rounded-lg
                    border border-white/10 bg-white/5 text-white/85
                    hover:bg-white/[0.08]
                    transition-colors
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40
                  "
                >
                  <X size={16} />
                </button>
              </div>

              {/* Grid tiles 2 kolom */}
              <m.ul
                role="menu"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 gap-3"
              >
                {items.map((it) => {
                  const Icon = it.icon
                  const isActive = activeId === it.id

                  return (
                    <m.li key={it.id} variants={tileVariants}>
                      <a
                        href={`#${it.id}`}
                        aria-current={isActive ? 'page' : undefined}
                        role="menuitem"
                        onClick={(e) => {
                          e.preventDefault()
                          setOpen(false)
                          setTimeout(() => scrollToId(it.id), 10)
                        }}
                        className={cn(
                          'group relative block overflow-hidden rounded-2xl p-5 text-center',
                          'bg-white/[0.06] ring-1 ring-inset ring-white/12',
                          'transition-all duration-200 will-change-transform',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40',
                          isActive ? 'text-white' : 'text-white/90'
                        )}
                        style={
                          isActive
                            ? {
                                background:
                                  'linear-gradient(155deg, var(--c2) 0%, var(--c3) 55%, var(--c4) 100%)',
                              }
                            : undefined
                        }
                      >
                        {/* Sheen diagonal */}
                        <span
                          aria-hidden
                          className={cn(
                            'pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-200',
                            isActive ? 'opacity-70' : 'group-hover:opacity-40'
                          )}
                          style={{
                            background:
                              'linear-gradient(120deg, rgba(255,255,255,0.36) 0%, rgba(255,255,255,0.14) 28%, rgba(255,255,255,0) 55%)',
                            mixBlendMode: 'screen',
                          }}
                        />

                        {!isActive && (
                          <span
                            aria-hidden
                            className="pointer-events-none absolute inset-0 rounded-2xl"
                            style={{
                              boxShadow:
                                'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.25)',
                            }}
                          />
                        )}

                        <div className="relative z-[1] flex flex-col items-center gap-2">
                          <m.span
                            whileHover={{ y: -1 }}
                            transition={{ duration: 0.18 }}
                            className={cn(
                              'grid h-10 w-10 place-items-center rounded-xl',
                              isActive ? 'bg-black/10' : 'bg-white/5'
                            )}
                          >
                            <Icon size={20} />
                          </m.span>
                          <span className={cn('text-base', isActive && 'font-semibold')}>
                            {it.label}
                          </span>
                        </div>
                      </a>
                    </m.li>
                  )
                })}
              </m.ul>

              {/* Theme toggle: outline card */}
              <m.button
                type="button"
                onClick={toggleTheme}
                whileTap={{ scale: 0.98 }}
                className="
                  mt-4 w-full rounded-2xl
                  bg-transparent px-4 py-3
                  text-white/90
                  transition-colors
                  hover:bg-white/[0.04]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40
                  flex items-center justify-center gap-2
                "
                style={{
                  boxShadow:
                    'inset 0 0 0 1px rgba(255,255,255,0.18), 0 8px 20px rgba(0,0,0,0.15)',
                }}
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
                <span>{isDark ? 'Light' : 'Dark'} Mode</span>
              </m.button>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </m.nav>
  )
}