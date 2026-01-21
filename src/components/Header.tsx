import Link from 'next/link';
import { MobileNav } from './MobileNav';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-soft">
      <div className="flex justify-between items-center px-4 py-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-6">
          <Link 
            href="/" 
            className="text-xl font-bold flex items-center gap-2.5 focus-ring rounded-lg px-1 -mx-1"
          >
            <span className="text-2xl" aria-hidden="true">📰</span>
            <span className="hidden sm:inline bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent">
              Crypto News
            </span>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
            <Link 
              href="/category/bitcoin" 
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 focus-ring"
            >
              <span aria-hidden="true">₿</span> Bitcoin
            </Link>
            <Link 
              href="/category/ethereum" 
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 focus-ring"
            >
              <span aria-hidden="true">Ξ</span> Ethereum
            </Link>
            <Link 
              href="/category/defi" 
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 focus-ring"
            >
              <span aria-hidden="true">🏦</span> DeFi
            </Link>
            <Link 
              href="/markets" 
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 focus-ring"
            >
              <span aria-hidden="true">📈</span> Markets
            </Link>
            <Link 
              href="/defi" 
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 focus-ring"
            >
              <span aria-hidden="true">🔗</span> DeFi Data
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-1.5">
          <Link 
            href="/search" 
            className="p-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 focus-ring"
            aria-label="Search articles"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>
          
          <div className="hidden md:flex items-center gap-0.5">
            <Link 
              href="/trending" 
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 focus-ring"
            >
              <span aria-hidden="true">🔥</span> Trending
            </Link>
            <Link 
              href="/movers" 
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 focus-ring"
            >
              <span aria-hidden="true">🚀</span> Movers
            </Link>
            <Link 
              href="/sources" 
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 focus-ring"
            >
              <span aria-hidden="true">📚</span> Sources
            </Link>
            <Link 
              href="/topics" 
              className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 focus-ring"
            >
              <span aria-hidden="true">🏷️</span> Topics
            </Link>
          </div>
          
          <a
            href="https://github.com/nirholas/free-crypto-news"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-800 hover:shadow-lg active:scale-95 transition-all duration-200 text-sm font-medium focus-ring ml-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            <span>Star</span>
          </a>
          
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
