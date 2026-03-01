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


/**
 * Sparkline Cell Component — pure black & white
 * Mini chart for displaying 7-day price history in table cells
 */

import { useMemo } from 'react';

interface SparklineCellProps {
  data: number[];
  change: number;
  width?: number;
  height?: number;
}

export default function SparklineCell({ 
  data, 
  change,
  width = 100, 
  height = 32 
}: SparklineCellProps) {
  const pathData = useMemo(() => {
    if (!data || data.length < 2) return '';

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  }, [data, width, height]);

  const strokeColor = '#ffffff';
  const gradientId = `gradient-${Math.random().toString(36).slice(2)}`;

  if (!data || data.length < 2) {
    return (
      <div 
        className="bg-white/5 rounded animate-pulse"
        style={{ width, height }}
      />
    );
  }

  return (
    <svg width={width} height={height} className="flex-shrink-0">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.15" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Fill area under the line */}
      <path
        d={`${pathData} L ${width},${height} L 0,${height} Z`}
        fill={`url(#${gradientId})`}
      />
      {/* Line */}
      <path
        d={pathData}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.5"
      />
    </svg>
  );
}
