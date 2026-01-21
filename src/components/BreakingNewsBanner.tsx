/**
 * Breaking News Banner
 * Displays breaking news articles in a prominent banner
 */

import { NewsArticle } from '@/lib/crypto-news';

interface BreakingNewsBannerProps {
  articles: NewsArticle[];
}

export default function BreakingNewsBanner({ articles }: BreakingNewsBannerProps) {
  // Filter for breaking news or use the most recent article
  const breakingArticle = articles[0];
  
  if (!breakingArticle) return null;

  return (
    <div 
      className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white relative overflow-hidden"
      role="alert"
      aria-live="polite"
    >
      {/* Animated shine effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-[shimmer_3s_infinite]"
        aria-hidden="true"
      />
      
      <div className="max-w-7xl mx-auto px-4 py-2.5 relative">
        <div className="flex items-center gap-3">
          {/* Breaking badge with ping animation */}
          <span className="relative flex-shrink-0">
            <span className="absolute inset-0 bg-white rounded animate-ping opacity-25" aria-hidden="true" />
            <span className="relative bg-white text-red-600 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide">
              Breaking
            </span>
          </span>
          
          {/* News headline */}
          <a
            href={breakingArticle.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium hover:text-white/90 truncate flex-1 focus:outline-none focus:underline transition-colors"
            aria-label={`Breaking news: ${breakingArticle.title} (opens in new tab)`}
          >
            {breakingArticle.title}
          </a>
          
          {/* Time indicator */}
          <span className="text-red-100 text-xs whitespace-nowrap hidden sm:flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <time>{breakingArticle.timeAgo}</time>
          </span>
          
          {/* External link icon */}
          <svg 
            className="w-4 h-4 text-red-200 flex-shrink-0 hidden sm:block" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
      </div>
    </div>
  );
}
