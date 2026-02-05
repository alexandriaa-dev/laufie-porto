import { useState, useEffect } from 'react'
import Badge from '@/components/common/Badge'
import { Trophy, Building2, Calendar } from 'lucide-react'
import { m, AnimatePresence, type Variants } from 'framer-motion'

/* Sheen: langsung mulai saat hover, tidak menyapu balik */
const sheenVariants: Variants = {
  rest: { x: '-120%', opacity: 0, transition: { duration: 0 } },
  hover: {
    x: '120%',
    opacity: 1,
    transition: {
      x: { duration: 1.35, ease: [0.22, 1, 0.36, 1] }, // smooth ease-out
      opacity: { duration: 0 },
    },
  },
}

/* Card lift + scale dengan tween simetris agar in/out halus */
const cardVariants: Variants = {
  rest: {
    y: 0,
    scale: 1,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
  },
  hover: {
    y: -3,          // sedikit lebih tinggi, tetap subtle
    scale: 1.012,   // subtle scale
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
  },
}

/* Glow halus dikontrol motion agar fade-in/out lembut */
const glowVariants: Variants = {
  rest: { opacity: 0, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } },
  hover: { opacity: 1, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
}

export default function AchievementCard({
  title,
  org,
  year,
  badge,
  gradientFrom = 'var(--c2)',
  gradientTo = 'var(--c3)',
  onClick,
}: {
  title: string
  org: string
  year: string
  badge?: string
  gradientFrom?: string
  gradientTo?: string
  onClick?: () => void
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [badgeSize, setBadgeSize] = useState({ fontSize: 12, padding: 'px-2.5 py-1', dot: 'h-1.5 w-1.5' })
  const [iconSize, setIconSize] = useState(16)

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth
      if (width >= 768) {
        setBadgeSize({ fontSize: 13, padding: 'px-3 py-1.5', dot: 'h-2 w-2' })
        setIconSize(18)
      } else {
        setBadgeSize({ fontSize: 12, padding: 'px-2.5 py-1', dot: 'h-1.5 w-1.5' })
        setIconSize(16)
      }
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  return (
    <m.div
      className="
        glass group relative overflow-visible rounded-2xl
        will-change-transform
        transition-[box-shadow,filter] duration-300 ease-out
        hover:ring-1 hover:ring-white/15
        hover:shadow-[0_12px_28px_rgba(0,0,0,0.35),0_18px_60px_rgba(59,130,246,0.18)]
        cursor-pointer
      "
      variants={cardVariants}
      initial="rest"
      animate="rest"
      whileHover="hover"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
      aria-label={`View details for ${title}`}
    >
      {/* Wrapper untuk membatasi glow effect di dalam card */}
      <div className="relative overflow-hidden rounded-2xl">
        {/* Soft glow saat hover (motion-animated) - dibatasi di dalam card */}
        <m.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl blur-2xl"
          style={{
            background:
              'radial-gradient(60% 60% at 50% 45%, rgba(59,130,246,0.22), rgba(59,130,246,0) 60%)',
            mixBlendMode: 'screen',
          }}
          variants={glowVariants}
        />

        {/* Kilau menyapu sekali - dibatasi di dalam card */}
        <m.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background:
              'linear-gradient(110deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0) 60%)',
            filter: 'blur(10px)',
          }}
          variants={sheenVariants}
        />

        {/* Content card */}
        <div className="relative z-[1] p-5">
          <div className="flex items-start gap-4">
            {/* Icon box dengan gradasi */}
            <div
              className="grid h-12 w-12 place-items-center rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 20px rgba(0,0,0,0.25)',
              }}
            >
              <Trophy className="text-white" />
            </div>

            <div className="flex-1">
              {/* Header: title + small status badge (badge di-absolute supaya tidak mengganggu layout judul) */}
              <div className="relative pr-24">
                {/* Title gradasi */}
                <h4
                  className="font-semibold text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})`,
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    fontSize: 'clamp(18px, 2.1vw, 22px)',
                    lineHeight: 1.25,
                  }}
                >
                  {title}
                </h4>

                {badge && (
                  <div className="absolute right-0.5 top-0.5 origin-top-right">
                    <span 
                      className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 ${badgeSize.padding} font-medium text-white/90 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_4px_12px_rgba(0,0,0,0.22)]`}
                      style={{ fontSize: `${badgeSize.fontSize}px` }}
                    >
                      <span className={`${badgeSize.dot} rounded-full bg-[rgba(96,165,250,0.85)] shadow-[0_0_6px_rgba(96,165,250,0.85)]`} />
                      {badge}
                    </span>
                  </div>
                )}
              </div>

              {/* Org + Year (ikon warna khusus: company c2, year c3) */}
              <div
                className="mt-2 space-y-1"
                style={{ fontSize: 'clamp(16px, 2.1vw, 18px)' }}
              >
                <div className="flex gap-2 text-white/85">
                  <span className="mt-[3px] flex-shrink-0">
                    <Building2 size={iconSize} style={{ color: 'var(--c2)' }} />
                  </span>
                  <span className="leading-snug">{org}</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <Calendar size={iconSize} style={{ color: 'var(--c3)' }} />
                  <span>{year}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip "Click to see details" - muncul di atas card saat hover */}
      <AnimatePresence>
        {isHovered && (
          <m.div
            key="tooltip"
            className="pointer-events-none absolute left-1/2 -top-12 z-[100]"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            style={{
              transform: 'translateX(-50%)',
            }}
          >
            <div 
              className="
                px-3 py-1.5 rounded-lg text-xs font-semibold text-white
                bg-gradient-to-b from-black/95 to-black/90 backdrop-blur-md 
                border border-white/30 shadow-[0_4px_16px_rgba(0,0,0,0.8)]
                whitespace-nowrap
              "
              style={{
                textShadow: '0 1px 2px rgba(0,0,0,0.8)',
              }}
            >
              Click to see details
            </div>
            {/* Arrow pointing down */}
            <div 
              className="absolute left-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/95"
              style={{
                transform: 'translateX(-50%)',
              }}
            />
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  )
}