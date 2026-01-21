/**
 * Featured Article Hero
 * Large hero section for the top/featured article
 */

import { NewsArticle } from '@/lib/crypto-news';

interface FeaturedArticleProps {
  article: NewsArticle;
}

const sourceColors: Record<string, string> = {
  'CoinDesk': 'bg-blue-600',
  'The Block': 'bg-purple-600',
  'Decrypt': 'bg-green-600',
  'CoinTelegraph': 'bg-orange-600',
  'Bitcoin Magazine': 'bg-yellow-600',
  'Blockworks': 'bg-indigo-600',
  'The Defiant': 'bg-pink-600',
};

export default function FeaturedArticle({ article }: FeaturedArticleProps) {
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0wLTZoLTJWMTJoMnY0em0wLTZoLTJWNmgydjR6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat"></div>
        </div>
        
        <div className="relative p-8 md:p-12">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs px-3 py-1 rounded-full text-white font-medium ${sourceColors[article.source] || 'bg-gray-600'}`}>
              {article.source}
            </span>
            <span className="text-gray-400 text-sm">
              {article.timeAgo}
            </span>
          </div>
          
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors line-clamp-3">
            {article.title}
          </h2>
          
          {article.description && (
            <p className="text-gray-300 text-lg line-clamp-2 mb-6 max-w-3xl">
              {article.description}
            </p>
          )}
          
          <div className="flex items-center text-yellow-400 font-medium">
            Read full article
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </a>
  );
}
