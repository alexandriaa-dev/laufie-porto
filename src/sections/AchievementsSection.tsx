import Section from '@/components/common/Section'
import SectionHeading from '@/components/common/SectionHeading'
import { achievements, achievementsStats } from '@/data/achievements'
import AchievementCard from '@/components/cards/AchievementCard'
import { Trophy, Calendar, Building2, Medal, Award } from 'lucide-react'
import { m } from 'framer-motion'
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

const COLORS = ['var(--c1)', 'var(--c2)', 'var(--c3)', 'var(--c4)'] as const
// Semua pasangan terurut yang berbeda (12 kombinasi)
const ALL_PAIRS: [string, string][] = COLORS.flatMap((cA) =>
  COLORS.filter((cB) => cB !== cA).map((cB) => [cA, cB] as [string, string])
)

export default function AchievementsSection() {
  // Seed stabil berdasar daftar achievements (judul)
  const seed = hashSeed(achievements.map((a) => a.title).join('|'))
  const PAIRS = seededShuffle(ALL_PAIRS, seed)

  return (
    <Section id="achievements">
      <SectionHeading
        title="Achievements &"
        highlight="Recognition"
        subtitle="Recognition and awards received throughout my professional journey, highlighting excellence in development, design, and innovation."
      />

      {/* Top stats (tanpa kilau pada card) */}
      <m.div 
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
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
            <div className="mt-1 text-sm text-white/70">{s.label}</div>
          </m.div>
        ))}
      </m.div>

      {/* List achievements */}
      <m.div 
        className="mt-8 grid gap-6 lg:grid-cols-3"
        variants={staggerContainer(0.1)}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
      >
        {achievements.map((a, i) => {
          const [from, to] = PAIRS[i % PAIRS.length] // tidak akan sama berurutan
          return (
            <m.div key={a.id} variants={fadeInUp}>
              <AchievementCard
                title={a.title}
                org={a.org}
                year={a.year}
                badge={a.badge}
                gradientFrom={from}
                gradientTo={to}
              />
            </m.div>
          )
        })}
      </m.div>
    </Section>
  )
}