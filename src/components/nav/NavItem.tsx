import { cn } from '@/lib/utils'
import React from 'react'

export default function NavItem({
  label,
  href,
  active,
  onClick,
}: {
  label: string
  href: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'relative rounded-lg px-3 py-2 text-white/80 hover:text-white transition-colors',
        active && 'text-white'
      )}
      style={{ fontSize: 'clamp(13px, 1.6vw, 18px)' }}
    >
      {label}
      {active && <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded bg-primary-500" />}
    </a>
  )
}