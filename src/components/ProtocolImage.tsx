'use client';

/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */


import { useState } from 'react';
import Image from 'next/image';

interface ProtocolImageProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * Protocol Image with error handling
 * Uses next/image onError for fallback display
 */
export default function ProtocolImage({ src, alt, className = '' }: ProtocolImageProps) {
  const [showFallback, setShowFallback] = useState(false);

  if (!src || showFallback) {
    return (
      <div 
        className={`${className} bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center`}
        role="img"
        aria-label={alt}
      >
        <span className="text-gray-500 text-xs font-bold">
          {alt?.charAt(0)?.toUpperCase() || '?'}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={40}
      height={40}
      className={className}
      onError={() => setShowFallback(true)}
    />
  );
}
