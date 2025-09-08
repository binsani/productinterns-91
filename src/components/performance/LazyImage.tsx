import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
}

export const LazyImage = ({
  src,
  alt,
  className,
  fallback = '/placeholder.svg',
  width,
  height,
  sizes,
  priority = false
}: LazyImageProps) => {
  const [imageSrc, setImageSrc] = useState(priority ? src : fallback);
  const [isLoading, setIsLoading] = useState(!priority);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    if (imageSrc === fallback && !priority) {
      setImageSrc(src);
    }
  }, [imageSrc, fallback, src, priority]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    if (imageSrc !== fallback) {
      setImageSrc(fallback);
    }
  }, [imageSrc, fallback]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={cn(
        'transition-opacity duration-300',
        isLoading && 'opacity-50',
        hasError && 'opacity-75',
        className
      )}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
};