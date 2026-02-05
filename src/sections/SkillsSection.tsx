import Section from '@/components/common/Section'
import SectionHeading from '@/components/common/SectionHeading'
import { skillGroups, techStack } from '@/data/skills'
import { m } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/motion/variants'
import {
  Code2,
  Palette,
  Wrench,
  Code,
  Layers,
  Brain,
  Lightbulb,
  Sparkles,
  LayoutTemplate,
  Braces,
  FileText,
} from 'lucide-react'

// Ikon untuk 4 grup teratas (disesuaikan dengan data terbaru)
function GroupIcon({ title, size = 22 }: { title: string; size?: number }) {
  const t = title.toLowerCase()
  if (t.includes('data')) return <Brain size={size} />                        // Data Science
  if (t.includes('front')) return <Code2 size={size} />                       // Frontend Development
  if (t.includes('design') || t.includes('ui')) return <Palette size={size} />// Graphic Design & UI/UX
  if (t.includes('soft')) return <Lightbulb size={size} />                    // Core Soft Skills
  if (t.includes('devops') || t.includes('tool')) return <Wrench size={size} />
  return <Code2 size={size} />
}

// Ikon untuk Technology Stack (line/simple) — disesuaikan dengan daftar baru
function TechIcon({ name, size = 30 }: { name: string; size?: number }) {
  const n = name.toLowerCase()

  if (n.includes('microsoft word')) return <FileText size={size} />
  if (n.includes('machine learning')) return <Brain size={size} />
  if (n.includes('python')) return <Code size={size} />
  if (n.includes('canva')) return <Palette size={size} />
  if (n.includes('figma')) return <Palette size={size} />
  if (n === 'html') return <Code2 size={size} />
  if (n === 'css') return <Layers size={size} />
  if (n.includes('javascript')) return <Braces size={size} />
  if (n.includes('ui/ux') || n.includes('uiux')) return <LayoutTemplate size={size} />
  if (n.includes('creativity')) return <Sparkles size={size} />

  // fallback
  return <Code size={size} />
}

// Bubble logo gradient untuk grup
function LogoBubble({
  children,
  size = 48,
  gradient,
}: React.PropsWithChildren<{ size?: number; gradient: string }>) {
  return (
    <div
      className="grid place-items-center rounded-xl shadow-glow"
      style={{ width: size, height: size, background: gradient }}
    >
      <div className="text-white">{children}</div>
    </div>
  )
}

export default function SkillsSection() {
  // Gradient berantai card: 1) c1→c2, 2) c2→c3, 3) c3→c4, 4) c4→c1
  const chainGrads = [
    'linear-gradient(135deg, var(--c1), var(--c2))',
    'linear-gradient(135deg, var(--c2), var(--c3))',
    'linear-gradient(135deg, var(--c3), var(--c4))',
    'linear-gradient(135deg, var(--c4), var(--c1))',
  ]

  return (
    <Section id="skills">
      <SectionHeading
        title="Skills &"
        highlight="Expertise"
        subtitle="A comprehensive set of technical skills and creative abilities that I've developed throughout my journey."
      />

      {/* Top 4 skill group cards */}
      <m.div 
        className="grid gap-6 md:grid-cols-2"
        variants={staggerContainer(0.1)}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
      >
        {skillGroups.map((group, idx) => {
          const grad = chainGrads[idx % 4]
          return (
            <m.div
              key={group.title}
              variants={fadeInUp}
              className="group relative rounded-2xl"
              whileHover={{ scale: 1.015 }}
              transition={{ type: 'spring', stiffness: 250, damping: 20 }}
            >
              {/* Ring tegas (muncul saat hover saja) */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-80"
                style={{
                  background: grad,
                  padding: '2px',
                  WebkitMask:
                    'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
              />
              {/* Glow ring (juga hanya saat hover) */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: grad,
                  padding: '2px',
                  WebkitMask:
                    'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  filter: 'blur(8px)',
                }}
              />

              {/* Card glass: blur meningkat saat hover (isi card) */}
              <div className="glass relative rounded-2xl p-6 overflow-hidden backdrop-blur-sm transition-[backdrop-filter] duration-300 group-hover:backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-3">
                  <LogoBubble size={48} gradient={grad}>
                    <GroupIcon title={group.title} />
                  </LogoBubble>
                  <h3 className="text-xl font-semibold">{group.title}</h3>
                </div>

                <ul className="space-y-4">
                  {group.items.map((it) => (
                  <li key={it.name} className="space-y-1">
                    <div
                      className="flex items-center justify-between"
                      style={{ fontSize: 'clamp(13px, 1.7vw, 18px)' }}
                    >
                      <span className="text-white/90">{it.name}</span>
                      <span className="text-white/60">{it.level}%</span>
                    </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          // progress mengikuti gradient card
                          style={{ background: grad, width: `${it.level}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </m.div>
          )
        })}
      </m.div>

      {/* Technology Stack */}
      <m.div 
        className="mt-12"
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <h4 className="mb-6 text-center font-semibold">
          <span
            className="text-grad-4 inline-block"
            style={{ fontSize: 'clamp(22px, 3.2vw, 32px)' }}
          >
            Technology Stack
          </span>
        </h4>

        <m.div 
          className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
        variants={staggerContainer(0.05)}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        >
          {techStack.map((t) => (
            <m.div
              key={t}
              variants={fadeInUp}
              className="glass group rounded-2xl p-6 text-center grad-hover transition-shadow"
              whileHover={{ y: -6, rotate: -2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {/* Ikon */}
              <div className="mb-3 flex items-center justify-center text-white/80 group-hover:text-white transition-colors">
                <TechIcon name={t} />
              </div>

              {/* Label */}
              <div className="text-white/80" style={{ fontSize: 'clamp(14px, 1.9vw, 18.5px)' }}>
                <span className="transition-all duration-150 group-hover:font-semibold">
                  {t}
                </span>
              </div>

              {/* Titik pojok hidup */}
              <m.span
                aria-hidden
                className="pointer-events-none absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary-300/80"
                animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0], scale: [1, 1.15, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              />
            </m.div>
          ))}
        </m.div>
      </m.div>
    </Section>
  )
}