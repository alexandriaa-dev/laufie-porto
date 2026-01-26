import useScrollProgress from '@/hooks/useScrollProgress'
import { m } from 'framer-motion'

export default function TopProgressBar() {
  const p = useScrollProgress()
  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-[60] h-1 bg-transparent">
      <m.div
        style={{ scaleX: p }}
        className="origin-left h-full w-full bg-grad-4"
      />
    </div>
  )
}