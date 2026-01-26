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
    
    // Pastikan scroll di-unlock dengan cara yang lebih agresif
    const unlockScroll = () => {
      // Unlock body dan html
      document.body.style.overflow = ''
      document.body.style.overflowY = ''
      document.body.style.height = ''
      document.body.style.position = ''
      document.documentElement.style.overflow = ''
      document.documentElement.style.overflowY = ''
      document.documentElement.style.height = ''
      
      // Pastikan main element bisa menerima scroll dengan inline style (untuk production)
      const mainEl = document.querySelector('main[data-ready="true"]')
      if (mainEl) {
        const main = mainEl as HTMLElement
        // Force dengan inline style untuk memastikan bekerja di production
        main.style.setProperty('pointer-events', 'auto', 'important')
        main.style.setProperty('z-index', '100', 'important')
        main.style.setProperty('position', 'relative', 'important')
        main.style.setProperty('touch-action', 'pan-y pan-x pinch-zoom', 'important')
        
        // Force semua elemen fixed di bawah main tidak menghalangi
        const fixedElements = document.querySelectorAll('.fixed, [class*="fixed"]')
        fixedElements.forEach((el) => {
          const htmlEl = el as HTMLElement
          const zIndex = parseInt(getComputedStyle(htmlEl).zIndex || '0')
          const hasPointerEventsNone = htmlEl.classList.contains('pointer-events-none') || 
                                       getComputedStyle(htmlEl).pointerEvents === 'none'
          
          // Jika z-index < 100 dan tidak memiliki pointer-events-none, force none
          if (zIndex < 100 && !hasPointerEventsNone) {
            htmlEl.style.setProperty('pointer-events', 'none', 'important')
            htmlEl.style.setProperty('touch-action', 'none', 'important')
          }
        })
      }
    }
    
    unlockScroll()
    
    const t = setTimeout(() => {
      unlockScroll() // Pastikan lagi setelah delay
      const el = document.getElementById('home')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      try {
        history.replaceState(null, '', '#home')
      } catch {}
    }, 100) // sedikit lebih lama untuk memastikan unlock
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
          <ParticleField zIndexClass="-z-10" />

          <CursorFollower />

          {/* Konten: fade-in setelah preloader selesai */}
          <main
            data-ready={ready ? 'true' : 'false'}
            className={`relative z-[100] w-full transition-opacity duration-300 ${ready ? 'opacity-100' : 'opacity-0'}`}
            style={{ 
              pointerEvents: ready ? 'auto' : 'none',
              minHeight: '100vh',
              height: 'auto',
              position: 'relative',
              isolation: 'isolate',
              zIndex: 100
            }}
            aria-hidden={!ready ? true : undefined}
          >
            <HomeSection ready={ready} />
            <AboutSection ready={ready} />
            <SkillsSection />
            <ProjectsSection />
            <AchievementsSection />
            <ContactSection />

            {/* Mobile bottom nav */}
            <MobileTabNav activeId={active} className="md:hidden" />

            {/* Desktop dock nav */}
            <div className="hidden md:block">
              <DockNav activeId={active} />
            </div>

            <CircleProgress />
          </main>
        </MotionProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}