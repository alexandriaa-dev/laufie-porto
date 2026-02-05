import Section from '@/components/common/Section'
import SocialButtons from '@/components/common/SocialButtons'
import { m } from 'framer-motion'
import { ArrowUp, Sparkles } from 'lucide-react'
import { contact } from '@/data/socials'

/* Sparkle pemanis: floating + tilt + blink (kedip) */
function BrandWithSparkle() {
  return (
    <div className="relative inline-block">
      <span
        className="title-gradient inline-block"
        style={{ fontSize: 'clamp(22px, 3vw, 28px)' }}
      >
        Lovi Adiva Alexandria
      </span>

      {/* Posisi disetel dekat tapi tidak mepet */}
      <div className="pointer-events-none absolute -right-5 -top-3" aria-hidden>
        <m.span
          className="inline-flex text-primary-300/90 drop-shadow-[0_0_10px_rgba(59,130,246,0.55)]"
          animate={{
            y: [0, -3, 0, -2, 0],
            x: [0, 1, 0, -0.8, 0],
            rotate: [-8, -1, 6, 0, -6],
            scale: [0.98, 1.05, 1, 1.04, 0.98],
            opacity: [0.25, 1, 0.35, 1, 0.25],
          }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sparkles size={18} />
        </m.span>
        <m.span
          className="absolute -left-1 top-0 h-1.5 w-1.5 rounded-full bg-white/90"
          animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        />
      </div>
    </div>
  )
}


/* Back to top link dengan panah memantul + underline gradient saat hover */
function BackToTop() {
  return (
    <m.a
      href="#home"
      className="group relative inline-flex items-center gap-2 hover:text-white"
      aria-label="Back to top"
    >
      <span>Back to top</span>
      <m.span
        className="inline-flex"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ArrowUp size={16} />
      </m.span>
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-1 left-0 h-[2px] w-0 rounded-full transition-all duration-300 group-hover:w-full"
        style={{ background: 'linear-gradient(90deg, var(--c2), var(--c3))' }}
      />
    </m.a>
  )
}

export function FooterContent() {
  return (
    <div className="border-t border-white/10 pt-10">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <div className="text-2xl font-bold">
            <BrandWithSparkle />
          </div>
          <p
            className="mt-3 text-white/70"
            style={{ fontSize: 'clamp(15px, 1.7vw, 18.5px)' }}
          >
            Passionate creator turning ideas into intelligent, user‑centered digital experiences.
          </p>

          <div className="mt-4">
            <SocialButtons />
          </div>
        </div>

        <div>
          <div
            className="font-semibold"
            style={{ fontSize: 'clamp(15px, 2vw, 19px)' }}
          >
            Quick Links
          </div>
          <ul
            className="mt-3 space-y-2 text-white/70"
            style={{ fontSize: 'clamp(15px, 1.7vw, 18px)' }}
          >
            <li><a href="#about" className="hover:text-white">About</a></li>
            <li><a href="#skills" className="hover:text-white">Skills</a></li>
            <li><a href="#projects" className="hover:text-white">Projects</a></li>
            <li><a href="#achievements" className="hover:text-white">Achievements</a></li>
            <li><a href="#contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        <div>
          <div
            className="font-semibold"
            style={{ fontSize: 'clamp(15px, 2vw, 19px)' }}
          >
            Get In Touch
          </div>
          <ul
            className="mt-3 space-y-2 text-white/70"
            style={{ fontSize: 'clamp(15px, 1.7vw, 18px)' }}
          >
            <li>{contact.location}</li>  {/* gunakan location saja */}
            <li>{contact.email}</li>
            <li>{contact.phone}</li>
          </ul>
        </div>
      </div>

      <div
        className="mt-10 flex items-center justify-between text-white/50"
        style={{ fontSize: 'clamp(13px, 1.5vw, 17px)' }}
      >
        <span>© 2025 Lovi Adiva Alexandria.</span>
        <BackToTop />
      </div>
    </div>
  )
}

export default function FooterSection() {
  return (
    <Section id="footer" className="pt-10">
      <FooterContent />
    </Section>
  )
}