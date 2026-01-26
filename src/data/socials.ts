import { Github, Linkedin, Mail } from 'lucide-react'

export const socials = [
  { label: 'GitHub', icon: Github, url: 'https://github.com/alexandriaa-dev' },
  { label: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/in/lovi-adiva-alexandria-5b621a320/' },
  { label: 'Email', icon: Mail, url: 'mailto:loviadivaaja@gmail.com' },
] as const

// Ambil email dari socials agar tetap sinkron (tanpa duplikasi)
const emailFromSocials = (() => {
  const u = socials.find((s) => s.label.toLowerCase() === 'email')?.url
  if (!u) return ''
  return u.startsWith('mailto:') ? u.slice('mailto:'.length) : u
})()

// Single source of truth untuk info kontak
export const contact = {
  email: emailFromSocials || 'loviadivaaja@gmail.com',
  phone: '+62 851-9819-7296',
  location: 'Indonesia',
} as const

export type Contact = typeof contact