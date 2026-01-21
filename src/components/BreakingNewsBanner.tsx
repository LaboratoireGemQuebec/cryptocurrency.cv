/**
 * Breaking News Banner
 * Displays breaking news articles in a prominent banner
 */

import Link from 'next/link';
import { NewsArticle } from '@/lib/crypto-news';

interface BreakingNewsBannerProps {
  articles: NewsArticle[];
}

export default function BreakingNewsBanner({ articles }: BreakingNewsBannerProps) {
  // Filter for breaking news or use the most recent article
  const breakingArticle = articles[0];
  
  if (!breakingArticle) return null;

  return (
    <div className="bg-red-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center gap-3">
          <span className="bg-white text-red-600 px-2 py-0.5 rounded text-xs font-bold uppercase animate-pulse">
            Breaking
          </span>
          <a
            href={breakingArticle.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium hover:underline truncate flex-1"
          >
            {breakingArticle.title}
          </a>
          <span className="text-red-200 text-xs whitespace-nowrap hidden sm:inline">
            {breakingArticle.timeAgo}
          </span>
        </div>
      </div>
    </div>
  );
}
