import Section from '@/components/common/Section'
import { m } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/motion/variants'
import { Download, ArrowRight, Sparkles, Star, Palette, ChevronDown } from 'lucide-react'
import HeroOrbit from '@/components/fx/HeroOrbit'
import TypewriterTitle from '@/components/common/TypewriterTitle'
import { useState } from 'react'
import SocialButtons from '@/components/common/SocialButtons'
import { useToast } from '@/providers/ToastProvider'

type CTAButtonProps = {
  href: string
  label: string
  icon: React.ReactNode
  variant: 'primary' | 'outline'
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
  downloadName?: string
}

function CTAButton({ href, label, icon, variant, onClick, downloadName }: CTAButtonProps) {
  const [hovered, setHovered] = useState(false)
  const isSolid = variant === 'primary' ? !hovered : hovered

  return (
    <a
      href={href}
      onClick={onClick}
      download={downloadName ? downloadName : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium
                  overflow-hidden transition-all duration-200
                  md:rounded-xl md:px-5 md:py-3 md:text-base
                  ${isSolid ? 'text-white' : 'border border-white/15 bg-white/5 text-white'}`}
      style={isSolid ? { background: 'transparent' } : undefined}
    >
      <m.span
        aria-hidden
        className="absolute inset-y-0 left-0 rounded-lg md:rounded-xl"
        style={{ background: 'var(--c3)' }}
        animate={{ width: isSolid ? '100%' : '0%' }}
        transition={{ duration: 0.28, ease: 'easeInOut' }}
      />
      <span className="relative z-10">{label}</span>
      <m.span
        className="relative z-10"
        animate={{ x: hovered ? 4 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      >
        {icon}
      </m.span>
    </a>
  )
}

type HomeSectionProps = {
  ready?: boolean
}

export default function HomeSection({ ready = true }: HomeSectionProps) {
  const { toast } = useToast()
  const cvUrl = `${import.meta.env.BASE_URL}laufie-cv.pdf`

  const handleDownloadCV = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    try {
      const resp = await fetch(cvUrl, { method: 'GET', cache: 'no-store' })
      if (!resp.ok) {
        toast('File not available.', { variant: 'error' })
        return
      }
      const ct = (resp.headers.get('content-type') || '').toLowerCase()
      const buf = await resp.arrayBuffer()
      const sig = new Uint8Array(buf.slice(0, 4))
      const isPDFSig = sig[0] === 0x25 && sig[1] === 0x50 && sig[2] === 0x44 && sig[3] === 0x46
      const isPDFType = ct.includes('pdf')
      if (!isPDFSig && !isPDFType) {
        toast('File not available.', { variant: 'error' })
        return
      }
      const blob = new Blob([buf], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Laufie-Alexandria-CV.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 2000)
    } catch {
      toast('File not available.', { variant: 'error' })
    }
  }

  return (
    <Section id="home" className="relative pt-28 sm:pt-32 lg:pt-36">
      <div className="flex flex-col items-center justify-center gap-6 sm:gap-8 lg:gap-10 lg:grid lg:grid-cols-2 lg:items-center lg:justify-items-stretch">
        <m.div
          variants={staggerContainer()}
          initial="initial"
          animate={ready ? "animate" : "initial"}
          className="
            relative order-2 transform-gpu text-center
            w-full max-w-[320px] px-4 sm:max-w-[420px] sm:px-0 md:max-w-[560px]
            mx-auto flex flex-col items-center justify-center
            lg:order-1 lg:max-w-none lg:text-left lg:items-start lg:justify-start
            lg:-translate-y-6 xl:-translate-y-8
          "
        >
          <m.h1
            variants={fadeInUp}
            className="font-bold"
            style={{ fontSize: 'clamp(28px, 7vw, 74px)', lineHeight: 1.06 }}
          >
            <span className="title-gradient inline-block">Laufie</span>
            <br />
            <span className="title-gradient inline-block">Alexandria</span>
          </m.h1>

          <m.p
            variants={fadeInUp}
            className="mt-4 font-mono sm:mt-6"
            style={{ fontSize: 'clamp(16px, 5.2vw, 32px)' }}
          >
            <TypewriterTitle start={ready} />
          </m.p>

          <m.p
            variants={fadeInUp}
            className="mx-auto mt-4 max-w-[58ch] text-pretty text-white/70 sm:mt-6 lg:mx-0"
          >
            I blend logic and creativity to craft smart, data-driven, and user-friendly solutions—whether
            through clean code, insightful analysis, or intuitive design.
          </m.p>

          <m.div
            variants={fadeInUp}
            className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 lg:justify-start"
          >
            <CTAButton href="#about" label="View More" variant="primary" icon={<ArrowRight size={16} />} />
            <CTAButton
              href={cvUrl}
              label="Download CV"
              variant="outline"
              icon={<Download size={16} />}
              downloadName="Laufie-Alexandria-CV.pdf"
              onClick={handleDownloadCV}
            />
          </m.div>

          <m.div variants={fadeInUp} className="mt-5 flex justify-center lg:block">
            <div className="origin-top scale-90 sm:scale-100">
              <SocialButtons />
            </div>
          </m.div>

          <div className="pointer-events-none absolute inset-0 -z-10 hidden lg:block" aria-hidden="true">
            {/* ... floats tetap ... */}
            <m.span className="absolute left-[62%] top-[-12px] h-2.5 w-2.5 rounded-full bg-primary-300/80 shadow-[0_0_20px_rgba(59,130,246,0.8)]" animate={{ y: [0, -10, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }} />
            <m.span className="absolute right-[-22px] top-[8%] h-6 w-6 rounded-lg border border-white/10 bg-primary-500/20 backdrop-blur-[2px]" animate={{ rotate: [0, 25, 0, -25, 0], y: [0, -8, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
            {/* ... dst ... */}
          </div>
        </m.div>

        {/* Right column (avatar + orbit) — responsif & center di mobile */}
        <div
          className="
            order-1 transform-gpu flex items-center justify-center
            w-full px-4 sm:px-0
            -mt-2 sm:-mt-4 md:-mt-6 lg:mt-0
            lg:order-2 lg:justify-self-end lg:items-start lg:justify-start
            lg:-translate-y-6 xl:-translate-y-12 lg:translate-x-6 xl:translate-x-12 2xl:translate-x-16
          "
        >
          <m.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center w-full"
          >
            <HeroOrbit />
          </m.div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-20 hidden flex-col items-center justify-center md:bottom-24 lg:flex">
        <m.a
          href="#about"
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="pointer-events-auto group flex flex-col items-center text-sm text-white/60 hover:text-white"
          aria-label="Scroll to explore"
        >
          <span>Scroll to explore</span>
          <m.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-1 text-white/70 group-hover:text-white"
            aria-hidden="true"
          >
            <ChevronDown size={18} />
          </m.span>
        </m.a>
      </div>
    </Section>
  )
}