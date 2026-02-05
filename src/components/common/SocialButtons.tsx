import React, { useEffect, useState } from 'react'
import { socials } from '@/data/socials'
import { cn } from '@/lib/utils'

function SocialButton({
  href,
  label,
  children,
}: {
  href: string
  label?: string
  children: React.ReactNode
}) {
  return (
    <div className="group relative inline-block">
      <a
        href={href}
        className="glass grid h-[52px] w-[52px] md:h-[56px] md:w-[56px] place-items-center rounded-2xl transition-transform duration-200 group-hover:rotate-45 relative"
        target="_blank"
        rel="noreferrer"
        aria-label={label}
      >
        {/* Icon counter-rotate agar tetap tegak */}
        <span className="transition-transform duration-200 group-hover:-rotate-45">
          {children}
        </span>

        {/* Border gradient muncul saat hover (mask ke pinggir) */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-[14px] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style={{
            background: 'var(--grad-4)',
            padding: '2px',
            WebkitMask:
              'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            filter: 'blur(0.5px)',
          }}
        />
      </a>
    </div>
  )
}

export default function SocialButtons({
  className,
  items = socials,
}: {
  className?: string
  items?: typeof socials
}) {
  const [iconSize, setIconSize] = useState(22)

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth
      if (width >= 768) {
        setIconSize(26) // tablet & desktop
      } else {
        setIconSize(24) // mobile - diperbesar
      }
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return (
    <div className={cn('flex items-center gap-3.5', className)}>
      {items.map(({ label, icon: Icon, url }) => (
        <SocialButton key={label} href={url} label={label}>
          <Icon size={iconSize} />
        </SocialButton>
      ))}
    </div>
  )
}