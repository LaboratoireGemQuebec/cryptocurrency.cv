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
 * SentimentBadge Component
 * Displays bullish/bearish/neutral sentiment indicator
 */

import { sentimentColors } from './cardUtils';

interface SentimentBadgeProps {
  sentiment: 'bullish' | 'bearish' | 'neutral';
  size?: 'sm' | 'md';
}

export default function SentimentBadge({ sentiment, size = 'sm' }: SentimentBadgeProps) {
  const colors = sentimentColors[sentiment];
  
  const sizeClasses = size === 'sm' 
    ? 'text-xs px-2 py-0.5 gap-1'
    : 'text-sm px-2.5 py-1 gap-1.5';

  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium ${colors.bg} ${colors.text} ${sizeClasses}`}
      title={`Market sentiment: ${sentiment}`}
    >
      <span aria-hidden="true">{colors.icon}</span>
      <span className="capitalize">{sentiment}</span>
    </span>
  );
}
