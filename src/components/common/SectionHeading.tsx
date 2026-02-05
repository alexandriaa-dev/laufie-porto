import { cn } from '@/lib/utils'

export default function SectionHeading({
  title,
  highlight,
  subtitle,
  className,
}: {
  title: string
  highlight?: string
  subtitle?: string
  className?: string
}) {
  const text = highlight ? `${title} ${highlight}` : title

  return (
    <div className={cn('mb-10 text-center', className)}>
      {/* Tidak ada inline-block/inline-flex di wrapper */}
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-tight">
        {/* Matikan inline-block di sini juga */}
        <span className="text-grad-4">{text}</span>
      </h2>

      {/* Underline elemen block biasa (bukan pseudo/absolute), agar tidak terpotong */}
      <div className="mt-3 flex justify-center">
        <div
          className="h-[4px] w-[160px] rounded-full"
          style={{ background: 'var(--grad-4)', opacity: 0.9 }}
        />
      </div>

      {subtitle && (
        <p
          className="mt-4 text-white/70 max-w-3xl mx-auto"
          style={{
            fontSize: 'clamp(16px, 2.05vw, 19px)',
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}