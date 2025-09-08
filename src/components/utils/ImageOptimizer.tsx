import { useState, useCallback } from 'react';

interface ImageOptimizerProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  placeholder?: string;
  quality?: number;
}

export const ImageOptimizer = ({
  src,
  alt,
  className,
  width,
  height,
  sizes,
  priority = false,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNmMGYwZjAiLz4KPHN2Zz4K',
  quality = 75
}: ImageOptimizerProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(priority ? src : placeholder);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    if (!priority && currentSrc === placeholder) {
      setCurrentSrc(src);
    }
  }, [src, currentSrc, placeholder, priority]);

  const handleError = useCallback(() => {
    setHasError(true);
    setCurrentSrc(placeholder);
  }, [placeholder]);

  // Generate responsive srcset for different screen densities
  const generateSrcSet = useCallback((baseSrc: string) => {
    if (!width || !height) return '';
    
    return [
      `${baseSrc} 1x`,
      `${baseSrc} 2x`,
      `${baseSrc} 3x`
    ].join(', ');
  }, [width, height]);

  return (
    <img
      src={currentSrc}
      srcSet={generateSrcSet(currentSrc)}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
      onLoad={handleLoad}
      onError={handleError}
      style={{
        transition: 'opacity 0.3s ease',
        opacity: isLoaded || priority ? 1 : 0.7
      }}
    />
  );
};