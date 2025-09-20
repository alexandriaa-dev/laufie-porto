import { m } from 'framer-motion'
import { Sparkles, Star, Palette } from 'lucide-react'
import ImageWithFallback from '@/components/common/ImageWithFallback'
import avatarUrl from '@/assets/images/avatar.jpeg'

type TwinkleProps = {
  size?: number
  duration?: number
  delay?: number
  className?: string
}

/** Small twinkling dot */
function Twinkle({ size = 6, duration = 1.8, delay = 0, className = '' }: TwinkleProps) {
  return (
    <m.span
      className={`absolute rounded-full bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.6)] ${className}`}
      style={{ width: size, height: size }}
      animate={{ opacity: [0.15, 1, 0.15], scale: [1, 1.4, 1] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  )
}

export default function HeroOrbit() {
  return (
    // Pakai aspect-square agar selalu lingkaran (width === height) di semua ukuran, termasuk tablet
    <div className="relative mx-auto grid place-items-center aspect-square w-[min(92vw,420px)] sm:w-[min(92vw,480px)] md:w-[560px]">
      {/* Orbit rings */}
      <div
        className="absolute inset-0 rounded-full border border-white/25 opacity-30 orbit-ring"
        style={{ borderWidth: 2 }}
      />
      <div
        className="absolute inset-[24px] md:inset-[33px] rounded-full border-dashed border-white/35 opacity-20"
        style={{ borderWidth: 2 }}
      />
      <m.div
        className="absolute inset-[48px] md:inset-[66px] rounded-full border-dashed border-white/40"
        style={{ borderWidth: 2 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
      />

      {/* Orbiting dots (satellites) */}
      <m.div
        className="absolute inset-[18px] md:inset-[26px]"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '50% 50%' }}
        aria-hidden="true"
      >
        <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-primary-300 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
      </m.div>
      <m.div
        className="absolute inset-[40px] md:inset-[56px]"
        animate={{ rotate: -360 }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '50% 50%' }}
        aria-hidden="true"
      >
        <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-primary-400 shadow-[0_0_14px_rgba(59,130,246,0.9)]" />
      </m.div>
      <m.div
        className="absolute inset-[72px] md:inset-[96px]"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '50% 50%' }}
        aria-hidden="true"
      >
        <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-primary-200 shadow-[0_0_8px_rgba(59,130,246,0.7)]" />
      </m.div>

      {/* Avatar + glare sweep — kecilkan khusus di lgx (>=1200 & <1280) */}
      <div className="group relative z-10 overflow-hidden rounded-full border border-white/10 shadow-[0_0_26px_rgba(0,0,0,0.3)]">
        <div className="relative">
          <ImageWithFallback
            src={avatarUrl}
            alt="Avatar"
            fallback="/favicon.svg"
            className="
              h-[270px] w-[270px]
              sm:h-[270px] sm:w-[270px]
              md:h-[350px] md:w-[350px]
              lg:h-[300px] lg:w-[300px]
              lgx:h-[340px] lgx:w-[340px]
              xl:h-[340px] xl:w-[340px]
              transform transition-transform duration-700 ease-out will-change-transform group-hover:scale-110
            "
          />

          {/* Kilau (glare sweep) */}
          <m.div
            className="pointer-events-none absolute inset-0 z-[2] rounded-full mix-blend-screen"
            style={{
              filter: 'blur(14px)',
              background:
                'linear-gradient(108deg, rgba(255,255,255,0) 32%, rgba(255,255,255,0.50) 50%, rgba(255,255,255,0) 68%)',
            }}
            animate={{ x: ['-155%', '165%'], opacity: [0, 0.6, 0] }}
            transition={{ duration: 2.6, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.7 }}
          />
        </div>
      </div>

      {/* Floating specks around avatar (twinkling near it) */}
      <Twinkle className="left-10 top-10" size={6} duration={1.8} />
      <Twinkle className="right-12 top-16" size={7} duration={2.2} delay={0.2} />
      <Twinkle className="bottom-12 left-16" size={6} duration={1.9} delay={0.5} />
      <Twinkle className="left-[72%] top-[8%]" size={5} duration={1.6} delay={0.1} />
      <Twinkle className="left-[18%] top-[78%]" size={4} duration={1.7} delay={0.6} />

      {/* Decorative mini-icons around orbit */}
      <m.div
        className="pointer-events-none absolute -right-6 top-8 text-primary-400/70"
        animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Sparkles size={20} />
      </m.div>
      <m.div
        className="pointer-events-none absolute left-4 -top-3 text-primary-300/70"
        animate={{ x: [0, 10, 0], rotate: [0, -12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Palette size={18} />
      </m.div>
      <m.div
        className="pointer-events-none absolute -left-8 bottom-8 text-primary-200/70"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Star size={16} />
      </m.div>

      {/* Elongated bullet near orbit */}
      <m.span
        className="absolute -left-10 top-6 h-4 w-10 rounded-full bg-primary-400/70"
        animate={{ x: [0, 8, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />
    </div>
  )
}