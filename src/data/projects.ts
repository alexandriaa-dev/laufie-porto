import type { Project } from '@/types/project'

// Ambil semua gambar sebagai URL bundling Vite (update sesuai deprecation)
const images = import.meta.glob('/src/assets/images/projects/*', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>

// Map: filename & basename → URL
const imageByKey: Record<string, string> = {}
for (const [path, url] of Object.entries(images)) {
  const file = path.split('/').pop()! // contoh: project-2.jpg
  const base = file.replace(/\.(png|jpe?g|webp|gif|svg)$/i, '').toLowerCase()
  imageByKey[file.toLowerCase()] = url
  imageByKey[base] = url
}

// Get default image (project-hero.png) jika ada
export const DEFAULT_PROJECT_IMAGE = imageByKey['project-hero.png'] || imageByKey['project-hero'] || ''

export function normalizeUrl(url?: string): string {
  if (!url || url.trim() === '') return ''
  
  const trimmed = url.trim()
  
  // Jika sudah ada protocol, return as is
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  
  // Jika tidak ada protocol, tambahkan https://
  // Pastikan tidak ada double slash
  const cleanUrl = trimmed.startsWith('//') ? trimmed.slice(2) : trimmed
  return `https://${cleanUrl}`
}

/**
 * Generate screenshot URL dari website (fallback jika gambar manual tidak ada)
 * Menggunakan service gratis: screenshot.rocks atau microlink.io
 * Export untuk digunakan di komponen
 */
export function getScreenshotUrl(demoUrl?: string): string {
  if (!demoUrl || demoUrl.trim() === '') return ''
  
  const url = normalizeUrl(demoUrl)
  
  // Opsi 1: screenshot.rocks (gratis, no API key, lebih reliable)
  return `https://screenshot.rocks/api?url=${encodeURIComponent(url)}&width=1200&height=675`
  
  // Opsi 2: microlink.io (gratis tier, kadang 404)
  // return `https://api.microlink.io/screenshot?url=${encodeURIComponent(url)}&width=1200&height=675`
  
  // Opsi 3: screenshotapi.net (gratis tier dengan limit)
  // return `https://api.screenshotapi.net/screenshot?url=${encodeURIComponent(url)}&width=1200&height=675`
  
  // Opsi 4: thum.io (gratis tapi terbatas)
  // return `https://image.thum.io/get/width/1200/crop/600/noanimate/${encodeURIComponent(url)}`
}

function resolveImage(input?: string, id?: string): string {
  // Cek apakah ada gambar di imageByKey
  const availableImages = Object.keys(imageByKey)
  const defaultImage = availableImages.length > 0 ? imageByKey[availableImages[0]] : ''
  
  if (input) {
    const file = input.split('/').pop()!.toLowerCase()
    const base = file.replace(/\.(png|jpe?g|webp|gif|svg)$/i, '')
    const found = imageByKey[file] ?? imageByKey[base]
    // Jika tidak ditemukan, return string kosong (bukan input asli)
    return found || ''
  }
  if (id) {
    const base = id.toLowerCase()
    return imageByKey[base] ?? ''
  }
  return ''
}

export const projects: Project[] = [
  {
    id: 'face-recognition',
    title: 'AURA (Automated Unfound Recognition & Alert)',
    description:
      'An AI-powered face recognition program that utilizes pre-trained models to generate and compare face embeddings from input images and CCTV footage, assisting in identifying and locating missing persons in public areas.',
    status: 'Completed',
    techs: ['Python', 'InsightFace', 'MiniFASNet', 'FFmpeg'],
    categories: ['web'],
    links: [
      { type: 'demo', url: '', label: 'View Project' },
      { type: 'repo', url: '', label: 'Source Code' },
    ],
    images: [{ src: resolveImage('project-1.png', 'face-recognition'), alt: 'AURA Project' }],
  },
  {
    id: 'attendence-app',
    title: 'UIN Attendence App',
    description:
      'A web application for managing attendance of TAs, featuring meeting material uploads, documentation tracking, and responsive design for ease of use.',
    status: 'In Progress',
    techs: ['React', 'Tailwind CSS', 'JavaScript', 'Next.js'],
    categories: ['web'],
    links: [
      { type: 'demo', url: '' },
      { type: 'repo', url: '' },
    ],
    images: [{ src: resolveImage('project-2.jpg', 'attendence-app'), alt: 'UIN Attendance App' }],
  },
  {
    id: 'classifier-model',
    title: 'Hate Speech Detector',
    description:
      'A web application for hate speech detection using a multinomial naive bayes classifier implemented from scratch in python.',
    status: 'Completed',
    techs: ['Python', 'React', 'Tailwind CSS'],
    categories: ['web'],
    links: [
      { type: 'demo', url: 'nb-hate-speech-detector.vercel.app' },
      { type: 'repo', url: '' },
    ],
    images: [{ src: resolveImage('project-3.png', 'classifier-model'), alt: 'Hate Speech Detector' }],
  },
  {
    id: 'portfolio',
    title: 'Portfolio Website',
    description:
      'A personal portfolio website showcasing creative work with smooth animations and responsive design.',
    status: 'Coming Soon',
    techs: ['React', 'Motion', 'Tailwind CSS', 'Vite'],
    categories: ['web'],
    links: [
      { type: 'demo', url: 'laufie.vercel.app' },
      { type: 'repo', url: '' },
    ],
    images: [{ src: resolveImage('project-4.png', 'portfolio'), alt: 'Portfolio Website' }],
  },
]