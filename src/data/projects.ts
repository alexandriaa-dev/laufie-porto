import type { Project } from '@/types/project'

const images = import.meta.glob('/src/assets/images/projects/*', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>

const imageByKey: Record<string, string> = {}
for (const [path, url] of Object.entries(images)) {
  const file = path.split('/').pop()! // contoh: project-2.jpg
  const base = file.replace(/\.(png|jpe?g|webp|gif|svg)$/i, '').toLowerCase()
  imageByKey[file.toLowerCase()] = url
  imageByKey[base] = url
}

export const DEFAULT_PROJECT_IMAGE = imageByKey['project-hero.png'] || imageByKey['project-hero'] || ''

export function normalizeUrl(url?: string): string {
  if (!url || url.trim() === '') return ''
  
  const trimmed = url.trim()
  
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  
  const cleanUrl = trimmed.startsWith('//') ? trimmed.slice(2) : trimmed
  return `https://${cleanUrl}`
}

export function getScreenshotUrl(demoUrl?: string): string {
  if (!demoUrl || demoUrl.trim() === '') return ''
  
  const url = normalizeUrl(demoUrl)
  
  return `https://screenshot.rocks/api?url=${encodeURIComponent(url)}&width=1200&height=675`
}

function resolveImage(input?: string, id?: string): string {
  const availableImages = Object.keys(imageByKey)
  const defaultImage = availableImages.length > 0 ? imageByKey[availableImages[0]] : ''
  
  if (input) {
    const file = input.split('/').pop()!.toLowerCase()
    const base = file.replace(/\.(png|jpe?g|webp|gif|svg)$/i, '')
    const found = imageByKey[file] ?? imageByKey[base]
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
    status: 'Coming Soon',
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
    status: 'Completed',
    techs: ['React', 'Motion', 'Tailwind CSS', 'Vite'],
    categories: ['web'],
    links: [
      { type: 'demo', url: 'laufie.vercel.app' },
      { type: 'repo', url: '' },
    ],
    images: [{ src: resolveImage('project-4.png', 'portfolio'), alt: 'Portfolio Website' }],
  },
]