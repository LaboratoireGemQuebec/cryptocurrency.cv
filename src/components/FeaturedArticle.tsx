/**
 * Featured Article Hero
 * Large hero section for the top/featured article
 */

import { NewsArticle } from '@/lib/crypto-news';

interface FeaturedArticleProps {
  article: NewsArticle;
}

const sourceColors: Record<string, { bg: string; glow: string }> = {
  'CoinDesk': { bg: 'bg-blue-500', glow: 'shadow-blue-500/25' },
  'The Block': { bg: 'bg-purple-500', glow: 'shadow-purple-500/25' },
  'Decrypt': { bg: 'bg-emerald-500', glow: 'shadow-emerald-500/25' },
  'CoinTelegraph': { bg: 'bg-orange-500', glow: 'shadow-orange-500/25' },
  'Bitcoin Magazine': { bg: 'bg-amber-500', glow: 'shadow-amber-500/25' },
  'Blockworks': { bg: 'bg-indigo-500', glow: 'shadow-indigo-500/25' },
  'The Defiant': { bg: 'bg-pink-500', glow: 'shadow-pink-500/25' },
};

const defaultSourceStyle = { bg: 'bg-gray-500', glow: 'shadow-gray-500/25' };

export default function FeaturedArticle({ article }: FeaturedArticleProps) {
  const sourceStyle = sourceColors[article.source] || defaultSourceStyle;
  
  return (
    <article className="group">
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block focus-ring rounded-3xl"
      >
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
          
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4zIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0wLTZoLTJWMTJoMnY0em0wLTZoLTJWNmgydjR6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat" />
          </div>
          
          {/* Glow effect */}
          <div className={`absolute -top-20 -right-20 w-60 h-60 ${sourceStyle.bg} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity`} aria-hidden="true" />
          
          <div className="relative p-8 md:p-10 lg:p-12">
            {/* Top Row: Featured badge + Source + Time */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="inline-flex items-center gap-1.5 bg-brand-500 text-black text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Featured
              </span>
              <span className={`text-xs px-3 py-1.5 rounded-full text-white font-medium ${sourceStyle.bg} shadow-lg ${sourceStyle.glow}`}>
                {article.source}
              </span>
              <time className="text-gray-400 text-sm" dateTime={article.pubDate}>
                {article.timeAgo}
              </time>
            </div>
            
            {/* Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-brand-400 transition-colors duration-300 line-clamp-3 leading-tight">
              {article.title}
            </h2>
            
            {/* Description */}
            {article.description && (
              <p className="text-gray-300 text-base md:text-lg line-clamp-2 mb-6 max-w-3xl leading-relaxed">
                {article.description}
              </p>
            )}
            
            {/* CTA */}
            <div className="inline-flex items-center text-brand-400 font-semibold group-hover:text-brand-300 transition-colors">
              <span>Read full article</span>
              <svg 
                className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </a>
    </article>
  );
}
