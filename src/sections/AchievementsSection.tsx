import { useState, useRef, useEffect, useMemo } from 'react'
import Section from '@/components/common/Section'
import SectionHeading from '@/components/common/SectionHeading'
import { achievements, achievementsStats, type Achievement } from '@/data/achievements'
import AchievementCard from '@/components/cards/AchievementCard'
import AchievementModal from '@/components/modals/AchievementModal'
import { Trophy, Calendar, Building2, Medal, Award } from 'lucide-react'
import { m, AnimatePresence } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/motion/variants'

function StatIcon({ label, size = 22 }: { label: string; size?: number }) {
  const l = label.toLowerCase()
  if (l.includes('award')) return <Trophy size={size} />
  if (l.includes('year')) return <Calendar size={size} />
  if (l.includes('industry') || l.includes('company')) return <Building2 size={size} />
  if (l.includes('cert')) return <Medal size={size} />
  return <Award size={size} />
}

// Util: hash → number (stabil) dari string
function hashSeed(s: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// RNG seeded (mulberry32)
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Shuffle seeded (Fisher–Yates)
function seededShuffle<T>(arr: T[], seed: number) {
  const rng = mulberry32(seed)
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Satu palet gradasi utama untuk SEMUA card Achievements/Experience
// Disamakan agar tampilan konsisten dan mudah dibaca.
const ACHIEVEMENT_GRADIENT: [string, string] = ['var(--c2)', 'var(--c3)']

type TabKey = 'award' | 'experience'
const TABS: { key: TabKey; label: string }[] = [
  { key: 'award', label: 'Honor & Awards' },
  { key: 'experience', label: 'Experience' },
]

function matchesTab(a: Achievement, tab: TabKey): boolean {
  return a.category === tab
}

export default function AchievementsSection() {
  // Filter state
  const [active, setActive] = useState<TabKey>('award')
  const [pill, setPill] = useState({ left: 0, width: 0 })
  const listRef = useRef<HTMLDivElement>(null)
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Modal state
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const scrollPositionRef = useRef<number>(0)

  const filtered = useMemo(() => {
    return achievements.filter((a) => matchesTab(a, active))
  }, [active])

  const updatePill = () => {
    const idx = TABS.findIndex((t) => t.key === active)
    const btn = btnRefs.current[idx]
    if (btn) {
      setPill({ left: btn.offsetLeft, width: btn.offsetWidth })
    }
  }

  useEffect(() => {
    updatePill()
    const onResize = () => updatePill()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  const handleCardClick = (achievement: Achievement) => {
    // Simpan scroll position sebelum buka modal
    scrollPositionRef.current = window.scrollY
    setSelectedAchievement(achievement)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    // Delay untuk animasi exit, lalu restore scroll position
    setTimeout(() => {
      setSelectedAchievement(null)
      // Restore scroll position setelah modal benar-benar tertutup
      window.scrollTo({
        top: scrollPositionRef.current,
        behavior: 'instant' // Instant untuk tidak trigger smooth scroll
      })
    }, 300)
  }

  return (
    <Section id="achievements">
      <SectionHeading
        title="Achievements &"
        highlight="Experiences"
        subtitle="Awards and experiences received throughout my professional journey, highlighting excellence in development, design, and innovation."
      />

      {/* Top stats (tanpa kilau pada card) */}
      <m.div 
        className="mb-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        variants={staggerContainer(0.1)}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
      >
            {achievementsStats.map((s) => (
            <m.div key={s.label} variants={fadeInUp} className="glass grad-hover group relative overflow-hidden rounded-2xl p-6 text-center">
            {/* Icon bubble */}
            <div className="mb-4 grid place-items-center">
              <div
                className="relative grid h-12 w-12 place-items-center rounded-full"
                style={{
                  background: 'linear-gradient(135deg, var(--c2), var(--c3))',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 20px rgba(0,0,0,0.25)',
                }}
              >
                {/* Radial highlight lembut di atas */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-full"
                  style={{
                    background:
                      'radial-gradient(60% 60% at 50% 35%, rgba(255,255,255,0.35), rgba(255,255,255,0) 60%)',
                  }}
                />
                {/* Base ring tipis */}
                <span className="pointer-events-none absolute inset-[1px] rounded-full border border-white/20" />
                {/* Sweep ring halus (conic gradient) */}
                <m.span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-full"
                  style={{
                    WebkitMask:
                      'radial-gradient(closest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
                    mask:
                      'radial-gradient(closest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
                    background:
                      'conic-gradient(from 0deg, rgba(255,255,255,0) 0deg, rgba(255,255,255,0.55) 25deg, rgba(255,255,255,0) 80deg, rgba(255,255,255,0) 360deg)',
                    filter: 'blur(0.4px)',
                    opacity: 0.9,
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                />
                <div className="relative text-white">
                  <StatIcon label={s.label} />
                </div>
              </div>
            </div>

            <div className="text-3xl font-bold">{s.value}</div>
            <div
              className="mt-1 text-white/70"
              style={{ fontSize: 'clamp(15px, 1.6vw, 18px)' }}
            >
              {s.label}
            </div>
          </m.div>
        ))}
      </m.div>

      {/* Tabs with animated pill */}
      <m.div 
        className="mx-auto mb-12 w-max rounded-2xl border border-white/10 bg-white/[0.02] p-1 backdrop-blur-sm"
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div
          ref={listRef}
          role="tablist"
          aria-label="Achievements filter"
          className="relative flex gap-1"
        >
          {/* moving pill */}
          <m.span
            className="pointer-events-none absolute top-0 bottom-0 rounded-2xl"
            style={{
              background: 'linear-gradient(90deg, rgba(255,255,255,0.35) 0%, var(--c3) 100%)',
              opacity: 0.9,
              backdropFilter: 'blur(6px)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 8px 20px rgba(0,0,0,0.25)',
            }}
            animate={{ left: pill.left + 0, width: Math.max(0, pill.width - 0) }}
            transition={{ type: 'spring', stiffness: 460, damping: 32, mass: 0.6 }}
          />

          {TABS.map((t, i) => {
            const isActive = active === t.key
            return (
              <button
                key={t.key}
                ref={(el) => { btnRefs.current[i] = el }}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(t.key)}
                className="relative rounded-2xl px-6 py-2 text-lg font-medium text-white/85 transition-colors"
              >
                <span className={`relative z-10 ${isActive ? 'font-semibold text-white' : 'hover:text-white'}`}>
                  {t.label}
                </span>
              </button>
            )
          })}
        </div>
      </m.div>

      {/* Grid with fade out/in when switching category */}
      <AnimatePresence mode="wait">
        <m.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {filtered.length === 0 ? (
            <m.div
              className="flex flex-col items-center justify-center py-16 text-center"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <p className="text-lg text-white/60">
                No achievements available for this category yet
              </p>
            </m.div>
          ) : (
            <m.div 
              className="grid gap-6 lg:grid-cols-3"
              variants={staggerContainer(0.1)}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.3 }}
            >
              {filtered.map((a, i) => {
                const [from, to] = ACHIEVEMENT_GRADIENT
                return (
                  <m.div key={a.id} variants={fadeInUp}>
                    <AchievementCard
                      title={a.title}
                      org={a.org}
                      year={a.year}
                      badge={a.badge}
                      gradientFrom={from}
                      gradientTo={to}
                      onClick={() => handleCardClick(a)}
                    />
                  </m.div>
                )
              })}
            </m.div>
          )}
        </m.div>
      </AnimatePresence>

      {/* Achievement Modal */}
      <AchievementModal
        achievement={selectedAchievement}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        gradientFrom={
          selectedAchievement
            ? ACHIEVEMENT_GRADIENT[0]
            : 'var(--c2)'
        }
        gradientTo={
          selectedAchievement
            ? ACHIEVEMENT_GRADIENT[1]
            : 'var(--c3)'
        }
      />
    </Section>
  )
}