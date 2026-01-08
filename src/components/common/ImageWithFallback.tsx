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
    setError(false)
    setCurrentSrc(src || fallback)
  }, [src, fallback])
  
  const handleError = () => {
    if (!error && currentSrc !== fallback) {
      setError(true)
      setCurrentSrc(fallback)
    }
  }
  
  return (
    <img
      src={currentSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={handleError}
      className={cn('object-cover', className)}
      {...rest}
    />
  )
}