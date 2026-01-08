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
  
  // Reset error state ketika src berubah
  useEffect(() => {
    setError(false)
  }, [src])
  
  return (
    <img
      src={error ? fallback : (src || fallback)}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setError(true)}
      className={cn('object-cover', className)}
      {...rest}
    />
  )
}