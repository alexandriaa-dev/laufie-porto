import Badge from '@/components/common/Badge'
import ExternalLink from '@/components/common/ExternalLink'
import ImageWithFallback from '@/components/common/ImageWithFallback'
import { normalizeUrl } from '@/data/projects'
import { cn } from '@/lib/utils'
import {
  ExternalLink as Ext,
  Github,
  CheckCircle2,
  Clock,
  Hourglass,
  Archive,
} from 'lucide-react'
import React from 'react'

type Props = {
  title: string
  description: string
  image: string
  techs: string[]
  status?: string
  demo?: string
  repo?: string
  className?: string
  techBadgeClassName?: string
  onUnavailable?: () => void // show toast when link is empty
}

function FancyLink({
  href,
  onUnavailable,
  children,
}: {
  href?: string
  onUnavailable?: () => void
  children: React.ReactNode
}) {
  const hasUrl = Boolean(href && href.trim() !== '')

  const commonClass =
    'group/btn inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-white/90 backdrop-blur-md transition-colors duration-200 hover:bg-white/[0.12]'

  // Pisahkan ikon (anak pertama) agar bisa diberi anim rotate
  const nodes = React.Children.toArray(children)
  const first = nodes[0]
  const rest = nodes.slice(1)

  const inner = (
    <span className="inline-flex items-center gap-2">
      <span className="transform-gpu transition-transform duration-700 ease-in-out group-hover/btn:rotate-[360deg]">
        {first}
      </span>
      {rest}
    </span>
  )

  if (hasUrl) {
    return (
      <ExternalLink href={href!} className={commonClass}>
        {inner}
      </ExternalLink>
    )
  }

  return (
    <button type="button" onClick={onUnavailable} className={commonClass} aria-label="Unavailable">
      {inner}
    </button>
  )
}

/* ================= Status badge (semua status: background gradient sama, icon putih) ================= */
function StatusBadge({ status }: { status?: string }) {
  if (!status) return null
  const s = status.toLowerCase()

  // Wrapper: border tipis abu, backdrop blur, shadow halus; teks & border tajam
  const wrapperClass =
    'absolute right-3 top-3 z-20 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium text-white overflow-hidden backdrop-blur-md border-[0.5px] border-white/20 shadow-[0_6px_14px_rgba(0,0,0,0.22),0_0_0_1px_rgba(255,255,255,0.05)]'

  // Overlay background: sama untuk semua status (c2 → c3), opacity agak kuat, blur lembut
  const overlayStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, var(--c2), var(--c3))',
    opacity: 0.55,
    filter: 'blur(0.55px)',
  }

  // Pilih ikon sesuai status, SEMUA warna putih
  let icon: React.ReactNode = null
  if (s === 'completed') icon = <CheckCircle2 size={14} className="text-white" />
  else if (s === 'in progress' || s === 'progress' || s === 'ongoing')
    icon = <Clock size={14} className="text-white" />
  else if (s === 'coming soon' || s === 'planned' || s === 'preview')
    icon = <Hourglass size={14} className="text-white" />
  else if (s === 'archived' || s === 'deprecated')
    icon = <Archive size={14} className="text-white" />

  return (
    <span className={wrapperClass}>
      {/* Background overlay (opacity + blur) */}
      <span aria-hidden className="pointer-events-none absolute inset-0" style={overlayStyle} />
      {/* Konten tajam di atas overlay */}
      <span className="relative z-10 inline-flex items-center gap-1">
        {icon}
        {status}
      </span>
    </span>
  )
}

/* ================= Project card ================= */
export default function ProjectCard({
  title,
  description,
  image,
  techs,
  status,
  demo,
  repo,
  className,
  techBadgeClassName,
  onUnavailable,
}: Props) {
  // Overlay: tetap ada jika demo/repo terdefinisi (meski kosong)
  const hasOverlay = typeof demo !== 'undefined' || typeof repo !== 'undefined'

  return (
    <div className={cn('glass overflow-hidden rounded-2xl', className)}>
      {/* Image area */}
      <div className="group relative aspect-[16/9] overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={title}
          className="h-full w-full object-cover"
          fallback="/favicon.svg"
        />

        {/* Status pill */}
        <StatusBadge status={status} />

        {/* Bottom overlay: Live Demo + GitHub icon */}
        {hasOverlay && (
          <div
            className="
              absolute inset-x-3 bottom-3 z-10
              flex items-center gap-2
              opacity-0 translate-y-1
              transition-all duration-300 ease-out
              pointer-events-none
              group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto
            "
          >
            {/* Live Demo button (flex-1) */}
            {(() => {
              const available = Boolean(demo && demo.trim() !== '')
              const content = (
                <>
                  <span className="transform-gpu transition-transform duration-700 ease-in-out group-hover/btn:rotate-[360deg]">
                    <Ext size={18} />
                  </span>
                  Live Demo
                </>
              )

              const common =
                'group/btn inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-[6px] text-[14px] font-medium text-white ring-1 ring-white/18 transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99] backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.14)]'

              return available ? (
                <a
                  href={normalizeUrl(demo)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${title} – Live Demo`}
                  className={common}
                  style={{
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.35) 0%, var(--c3) 100%)',
                  }}
                >
                  {content}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={onUnavailable}
                  aria-label={`${title} – Live Demo (unavailable)`}
                  className={common}
                  style={{
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.35) 0%, var(--c3) 100%)',
                  }}
                >
                  {content}
                </button>
              )
            })()}

            {/* Source Code icon button (kanan) */}
            {(() => {
              const available = Boolean(repo && repo.trim() !== '')
              const inner = (
                <span className="transform-gpu transition-transform duration-700 ease-in-out group-hover/btn:rotate-[360deg]">
                  <Github size={18} className="text-black" />
                </span>
              )

              // UPDATED: background putih opacity rendah + backdrop blur
              const common =
                'group/btn grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/20 bg-white/20 text-white/90 backdrop-blur-md transition-colors duration-200 hover:bg-white/30 ring-1 ring-white/12 shadow-[0_10px_30px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.12)]'

              return available ? (
                <a
                  href={normalizeUrl(repo)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${title} – Source Code`}
                  className={common}
                >
                  {inner}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={onUnavailable}
                  aria-label={`${title} – Source Code (unavailable)`}
                  className={common}
                >
                  {inner}
                </button>
              )
            })()}
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-5">
        <h4 className="text-xl font-semibold">{title}</h4>
        <p className="mt-2 text-white/70">{description}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {techs.map((t) => (
            <Badge key={t} className={cn('text-white/80', techBadgeClassName)}>
              {t}
            </Badge>
          ))}
        </div>

        {/* CTA bawah card (selalu tampil; kalau URL kosong → toast); ikon ikut rotate */}
        <div className="mt-4 flex flex-wrap gap-3">
          <FancyLink href={demo ? normalizeUrl(demo) : undefined} onUnavailable={onUnavailable}>
            <Ext size={18} /> View Project
          </FancyLink>
          <FancyLink href={repo ? normalizeUrl(repo) : undefined} onUnavailable={onUnavailable}>
            <Github size={18} /> Source Code
          </FancyLink>
        </div>
      </div>
    </div>
  )
}