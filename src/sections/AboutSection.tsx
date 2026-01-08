import Section from '@/components/common/Section'
import SectionHeading from '@/components/common/SectionHeading'
import { m } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/motion/variants'
import ImageWithFallback from '@/components/common/ImageWithFallback'
import Badge from '@/components/common/Badge'
import { Sparkles, ChevronsLeftRight } from 'lucide-react'
import heroImg from '@/assets/images/projects/project-hero.png'

type AboutSectionProps = {
  ready?: boolean
}

export default function AboutSection({ ready = true }: AboutSectionProps) {
  const tags = ['Machine Learning', 'Python', 'MS Word', 'Canva', 'Web Fundamental']

  return (
    <Section id="about">
      {/* Subtitle dihapus sesuai permintaan */}
      <SectionHeading title="About" highlight="Me" />

      {/* md+: samakan tinggi kolom dengan items-stretch */}
      <div className="mt-6 grid gap-8 md:grid-cols-2 md:items-stretch">
        {/* Left: hero image with glass + subtle hover + decorations */}
        <m.div
          variants={fadeInUp}
          initial="initial"
          animate={ready ? "animate" : "initial"}
          whileInView={ready ? undefined : "animate"}
          viewport={{ once: true, amount: 0.3 }}
          className="relative md:h-full"
        >
          <div className="glass relative overflow-hidden rounded-2xl grad-hover group md:h-full">
            {/* soft glow behind image */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[28px] opacity-40"
              style={{ background: 'var(--grad-4)', filter: 'blur(40px)' }}
            />
            <ImageWithFallback
              src={heroImg}
              alt="About visual"
              fallback="/favicon.svg"
              className="h-[420px] md:h-full w-full origin-center transform object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          </div>

          {/* small blue bullet on left */}
          <m.span
            aria-hidden
            className="absolute -left-3 top-1/3 h-4 w-4 rounded-full bg-primary-400 shadow-[0_0_16px_rgba(59,130,246,0.9)]"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* sparkle bottom-left */}
          <m.div
            aria-hidden
            className="absolute -left-4 bottom-6 text-primary-300/90"
            animate={{ rotate: [0, 15, 0, -15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles size={20} />
          </m.div>
          {/* chevrons in the gap (center-left) */}
          <m.div
            aria-hidden
            className="absolute -right-3 top-1/2 -translate-y-1/2 text-white/40"
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronsLeftRight size={18} />
          </m.div>
          {/* Lingkaran di tengah dihilangkan */}
        </m.div>

        {/* Right: content (jadi acuan tinggi di md+) */}
        <div className="md:h-full">
          <m.div
            variants={staggerContainer(0.1)}
            initial="initial"
            animate={ready ? "animate" : "initial"}
            whileInView={ready ? undefined : "animate"}
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Judul dengan gradasi var(--grad-4) */}
            <m.h3 
              variants={fadeInUp}
              className="text-grad-4 text-2xl font-semibold tracking-tight md:text-3xl"
            >
              Code. Design. Inspire.
            </m.h3>

            {/* Tambahkan jarak antar paragraf agar tidak menyatu */}
            <m.div 
              variants={fadeInUp}
              className="prose prose-invert mt-4 max-w-none space-y-4"
            >
              <p>
                I&apos;m a creative developer and aspiring data scientist with a strong passion for turning ideas
                into impactful digital solutions. I specialize in crafting responsive websites, building predictive
                models, and designing user-friendly visuals that combine logic with creativity.
              </p>
              <p>
                My journey started from deep curiosity about how technology shapes the world. That curiosity has led me
                to explore artificial intelligence, machine learning, and modern web technologies like React and CSS
                frameworks.
              </p>
              <p>
                Beyond code, I founded an academic and creative platform that strengthened
                my problem-solving, adaptability, and communication skills.
              </p>
            </m.div>

            <m.div 
              variants={fadeInUp}
              className="mt-6 flex flex-wrap gap-3"
            >
              {tags.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </m.div>
          </m.div>
        </div>
      </div>

      {/* Stats */}
      <m.div 
        className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        variants={staggerContainer(0.1)}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
      >
        {[
          { label: 'Years Learning', value: '5+' },
          { label: 'Projects Completed', value: '6+' },
          { label: 'Competitions Joined', value: '10+' },
          { label: 'Dedication', value: '100%' },
        ].map((s) => (
          <m.div key={s.label} variants={fadeInUp} className="glass grad-hover rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold">{s.value}</div>
            <div className="mt-1 text-sm text-white/70">{s.label}</div>
          </m.div>
        ))}
      </m.div>
    </Section>
  )
}