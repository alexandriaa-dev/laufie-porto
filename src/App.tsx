import { useEffect, useState } from 'react'
import MotionProvider from '@/providers/MotionProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { ToastProvider } from '@/providers/ToastProvider'
import DockNav from '@/components/nav/DockNav'
import TopProgressBar from '@/components/progress/TopProgressBar'
import CircleProgress from '@/components/progress/CircleProgress'
import ParticleField from '@/components/fx/ParticleField'
import CursorFollower from '@/components/fx/CursorFollower'
import HomeSection from '@/sections/HomeSection'
import AboutSection from '@/sections/AboutSection'
import SkillsSection from '@/sections/SkillsSection'
import ProjectsSection from '@/sections/ProjectsSection'
import AchievementsSection from '@/sections/AchievementsSection'
import ContactSection from '@/sections/ContactSection'
import useSectionObserver from '@/hooks/useSectionObserver'
import useHashSync from '@/hooks/useHashSync'
import { navItems } from '@/data/nav'
import AmbientBackground from '@/components/fx/AmbientBackground'
import MobileTabNav from '@/components/nav/MobileNav'
import Preloader from '@/components/util/Preloader'

export default function App() {
  const ids = navItems.map((n) => n.id)
  const active = useSectionObserver(ids)
  useHashSync(active)

  const [ready, setReady] = useState(false)

  // Setelah preloader selesai, unlock scroll dan paksa ke Home section
  useEffect(() => {
    if (!ready) return
    
    // Pastikan scroll di-unlock
    document.body.style.overflow = ''
    document.body.style.overflowY = ''
    document.body.style.height = ''
    document.documentElement.style.overflow = ''
    document.documentElement.style.overflowY = ''
    
    const t = setTimeout(() => {
      const el = document.getElementById('home')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      try {
        history.replaceState(null, '', '#home')
      } catch {}
    }, 60) // beri jeda singkat agar overlay sempat fade-out
    return () => clearTimeout(t)
  }, [ready])

  return (
    <ThemeProvider>
      <ToastProvider>
        <MotionProvider>
          {!ready && (
            <Preloader
              onDone={() => setReady(true)}
              minDurationMs={3000}  // 3 seconds guaranteed for complete 0-100% progression
              timeoutMs={10000}
              extraHoldMs={800}    // hold at 100% for 800ms before transitioning
              waitFonts
              zIndexClass="z-[999]"
              // ukuran & ketebalan ring + logo yang disesuaikan
              sizeMobile={72}
              sizeDesktop={88}
              strokeMobile={2.8}
              strokeDesktop={3.2}
              logoRatio={0.66}
            />
          )}

          <TopProgressBar />

          {/* Background: animasi jalan, tidak mengikuti kursor */}
          <AmbientBackground pauseAnimation={false} />

          {/* Particle kecil (statis) */}
          <ParticleField />

          <CursorFollower />

          {/* Konten: fade-in setelah preloader selesai */}
          <div
            data-ready={ready ? 'true' : 'false'}
            className={`relative z-10 w-full transition-opacity duration-300 ${ready ? 'opacity-100' : 'opacity-0'}`}
            style={{ 
              pointerEvents: ready ? 'auto' : 'none',
              minHeight: '100vh',
              height: 'auto',
              position: 'relative',
              touchAction: ready ? 'auto' : 'none'
            }}
            aria-hidden={!ready ? true : undefined}
          >
            <main className="relative w-full">
              <HomeSection ready={ready} />
              <AboutSection ready={ready} />
              <SkillsSection />
              <ProjectsSection />
              <AchievementsSection />
              <ContactSection />
            </main>

            {/* Mobile bottom nav */}
            <MobileTabNav activeId={active} className="md:hidden" />

            {/* Desktop dock nav */}
            <div className="hidden md:block">
              <DockNav activeId={active} />
            </div>

            <CircleProgress />
          </div>
        </MotionProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}