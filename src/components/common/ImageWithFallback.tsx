import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export default function ImageWithFallback({
  src,
  alt,
  fallback = '/favicon.svg',
  className,
  ...rest
}: React.ImgHTMLAttributes<HTMLImageElement> & { fallback?: string }) {
  const [error, setError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src || fallback)
  
  // Reset error state dan update src ketika src berubah
  useEffect(() => {
    if (src && src.trim() !== '') {
      setError(false)
      setCurrentSrc(src)
    } else {
      setCurrentSrc(fallback)
    }
  }, [src, fallback])
  
  const handleError = () => {
    if (!error && currentSrc !== fallback) {
      setError(true)
      setCurrentSrc(fallback)
    }
  }
  
  // Jika src kosong atau error, pakai fallback
  const displaySrc = error || !src || src.trim() === '' ? fallback : currentSrc
  
  return (
    <img
      src={displaySrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={handleError}
      className={cn('object-cover', className)}
      {...rest}
    />
  )
}