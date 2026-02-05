import { useEffect, useRef, useMemo } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { X, Trophy, Building2, Calendar, Award } from 'lucide-react'
import { useReducedMotion } from 'framer-motion'
import type { Transition, Variants } from 'framer-motion'
import Badge from '@/components/common/Badge'
import ImageWithFallback from '@/components/common/ImageWithFallback'
import type { Achievement } from '@/data/achievements'

// Import semua gambar sertifikat dari src/assets/images/sertif/
// Menggunakan pattern yang sama seperti projects.ts
const certificateImages = import.meta.glob('/src/assets/images/sertif/*', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>

// Buat mapping dari filename ke URL
const certificateImageMap: Record<string, string> = {}
for (const [path, url] of Object.entries(certificateImages)) {
  const filename = path.split('/').pop()! // contoh: satria.png
  const lowerFilename = filename.toLowerCase()
  certificateImageMap[lowerFilename] = url as string
  // Juga simpan tanpa extension untuk fleksibilitas
  const base = lowerFilename.replace(/\.(png|jpe?g|webp|gif|svg)$/i, '')
  if (base !== lowerFilename) {
    certificateImageMap[base] = url as string
  }
}

// Debug: log mapping untuk memastikan file ter-load
if (import.meta.env.DEV) {
  console.log('Certificate images loaded:', Object.keys(certificateImageMap))
  console.log('Certificate image map:', certificateImageMap)
}

type Props = {
  achievement: Achievement | null
  isOpen: boolean
  onClose: () => void
  gradientFrom?: string
  gradientTo?: string
}

export default function AchievementModal({
  achievement,
  isOpen,
  onClose,
  gradientFrom = 'var(--c2)',
  gradientTo = 'var(--c3)',
}: Props) {
  const shouldReduceMotion = useReducedMotion()
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  // Lock body scroll saat modal terbuka
  useEffect(() => {
    if (!isOpen) {
      // Saat modal ditutup, restore scroll position akan di-handle oleh AchievementsSection
      return
    }
    
    const prevOverflow = document.body.style.overflow
    const prevOverflowY = document.body.style.overflowY
    const prevHeight = document.body.style.height
    const scrollY = window.scrollY
    
    // Lock scroll
    document.body.style.overflow = 'hidden'
    document.body.style.overflowY = 'hidden'
    document.body.style.height = '100vh'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    
    const t = setTimeout(() => closeBtnRef.current?.focus(), 30)
    
    return () => {
      // Restore scroll styles (tapi scroll position akan di-restore oleh parent component)
      document.body.style.overflow = prevOverflow
      document.body.style.overflowY = prevOverflowY
      document.body.style.height = prevHeight
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      clearTimeout(t)
    }
  }, [isOpen])

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  // Helper untuk mendapatkan path image sertifikat dari src/assets/images/sertif/
  const getCertificatePath = (filename?: string): string | null => {
    if (!filename) return null
    // Cari di mapping yang sudah di-import
    const key = filename.toLowerCase()
    const found = certificateImageMap[key] || certificateImageMap[key.replace(/\.(png|jpe?g|webp|gif|svg)$/i, '')]
    
    // Debug di development
    if (import.meta.env.DEV && !found) {
      console.warn(`Certificate image not found: ${filename}`, 'Available:', Object.keys(certificateImageMap))
    }
    
    return found || null
  }

  // PENTING: useMemo harus dipanggil sebelum conditional return untuk mematuhi Rules of Hooks
  const certificatePath = useMemo(() => {
    if (!achievement?.certificateImage) return null
    const path = getCertificatePath(achievement.certificateImage)
    if (import.meta.env.DEV) {
      console.log('Certificate path for', achievement.certificateImage, ':', path)
    }
    return path
  }, [achievement?.certificateImage])

  // Conditional return setelah semua hooks
  if (!achievement) return null

  const overlayTransition: Transition = shouldReduceMotion
    ? { duration: 0.15 }
    : { duration: 0.2 }

  const modalTransition: Transition = shouldReduceMotion
    ? { duration: 0.15, ease: [0.22, 1, 0.36, 1] }
    : { type: 'spring', stiffness: 400, damping: 30, mass: 0.8 }

  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const modalVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.95,
      y: shouldReduceMotion ? 0 : 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
    },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <m.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            transition={overlayTransition}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
            style={{ backdropFilter: 'blur(12px)' }}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <m.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={modalVariants}
              transition={modalTransition}
              className="
                glass relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl
                border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]
                pointer-events-auto backdrop-blur-xl
              "
              style={{ backdropFilter: 'blur(20px) saturate(180%)' }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="achievement-modal-title"
            >
              {/* Close button */}
              <button
                ref={closeBtnRef}
                onClick={(e) => {
                  e.stopPropagation()
                  onClose()
                }}
                className="
                  absolute right-4 top-4 z-[110] grid h-10 w-10 place-items-center rounded-xl
                  bg-white/10 hover:bg-white/15 transition-colors
                  border border-white/20 hover:border-white/30
                  focus:outline-none focus:ring-2 focus:ring-white/30
                  cursor-pointer
                "
                aria-label="Close modal"
                type="button"
              >
                <X size={20} className="text-white/90" />
              </button>

              {/* Content - Scrollable area */}
              <div 
                className="overflow-y-auto max-h-[90vh] overscroll-contain"
                style={{ 
                  scrollbarWidth: 'thin',
                  WebkitOverflowScrolling: 'touch'
                }}
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >
                <div className="p-0">
                  {/* Certificate Image - Di paling atas */}
                  {certificatePath && (
                    <div className="relative w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02] border-b border-white/10">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
                      <ImageWithFallback
                        src={certificatePath}
                        alt={`Certificate for ${achievement.title}`}
                        fallback="/favicon.svg"
                        className="w-full h-full object-contain"
                      />
                      {/* Glass overlay effect */}
                      <div className="absolute inset-0 pointer-events-none" style={{
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)'
                      }} />
                    </div>
                  )}

                  {/* Content Section */}
                  <div className="p-6 md:p-8">
                    {/* Header */}
                    <div className="mb-6">
                      <div className="flex items-start gap-4 mb-4">
                        {/* Icon */}
                        <div
                          className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-xl"
                          style={{
                            background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
                            boxShadow:
                              'inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 20px rgba(0,0,0,0.25)',
                          }}
                        >
                          <Trophy size={24} className="text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <h2
                              id="achievement-modal-title"
                              className="text-2xl md:text-3xl font-bold text-transparent"
                              style={{
                                backgroundImage: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})`,
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                              }}
                            >
                              {achievement?.title || 'Achievement'}
                            </h2>
                            {achievement?.badge && (
                              <Badge className="bg-white/10 flex-shrink-0">
                                {achievement.badge}
                              </Badge>
                            )}
                          </div>

                          {/* Org + Year */}
                          <div
                            className="space-y-2"
                            style={{ fontSize: 'clamp(13px, 1.7vw, 18.5px)' }}
                          >
                            <div className="flex items-center gap-2 text-white/85">
                              <Building2 size={18} style={{ color: 'var(--c2)' }} />
                              <span>{achievement?.org || 'Organization'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/70">
                              <Calendar size={18} style={{ color: 'var(--c3)' }} />
                              <span>{achievement?.year || 'Year'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      {achievement?.description && (
                        <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                          <p className="text-white/80 leading-relaxed whitespace-pre-line">{achievement.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </m.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
