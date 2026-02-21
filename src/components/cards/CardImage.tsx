/**
 * CardImage Component
 * Handles image display with lazy loading, Unsplash fallback, and gradient fallback.
 *
 * Fallback chain:
 *   1. Article's own imageUrl  →  2. Unsplash nature photo  →  3. Source gradient
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getSourceGradient } from './cardUtils';
import { getNatureUnsplashFallback } from '@/lib/unsplash-fallback';

interface CardImageProps {
  src?: string;
  alt: string;
  source: string;
  className?: string;
  /** Show the source initial as fallback */
  showSourceInitial?: boolean;
  /** Size variant affects the initial font size */
  size?: 'sm' | 'md' | 'lg';
}

export default function CardImage({ 
  src, 
  alt, 
  source, 
  className = '',
  showSourceInitial = true,
  size = 'md'
}: CardImageProps) {
  const unsplashSrc = getNatureUnsplashFallback(src ? source : (source + '_nature'));
  const [imgSrc, setImgSrc] = useState<string | undefined>(src || unsplashSrc);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const gradient = getSourceGradient(source);

  const handleError = () => {
    if (imgSrc !== unsplashSrc) {
      // First failure: try the Unsplash fallback
      setImgSrc(unsplashSrc);
      setIsLoaded(false);
    } else {
      // Second failure: give up and show the gradient
      setHasError(true);
    }
  };

  const initialSizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  };

  const showGradientFallback = !imgSrc || hasError || !isLoaded;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Gradient background (always present as base/fallback) */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-opacity duration-300 ${
          isLoaded && imgSrc && !hasError ? 'opacity-0' : 'opacity-100'
        }`}
        aria-hidden="true"
      >
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4zIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0wLTZoLTJWMTJoMnY0em0wLTZoLTJWNmgydjR6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat" />
        </div>
        
        {/* Source initial */}
        {showSourceInitial && showGradientFallback && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-white/80 font-bold tracking-tight ${initialSizes[size]}`}>
              {source.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Actual image with lazy loading */}
      {imgSrc && !hasError && (
        <Image
          src={imgSrc}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
          className={`object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Loading shimmer overlay */}
      {imgSrc && !isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      )}
    </div>
  );
}
