import Link from 'next/link';
import { categories } from '@/lib/categories';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16" role="contentinfo">
      {/* Gradient divider */}
      <div className="h-1 bg-gradient-to-r from-brand-500 via-amber-500 to-orange-500" aria-hidden="true" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold mb-4 focus-ring rounded">
              <span aria-hidden="true">📰</span>
              <span className="bg-gradient-to-r from-brand-400 to-amber-400 bg-clip-text text-transparent">
                Crypto News
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed max-w-xs">
              100% free crypto news aggregator. No API keys required. Built for developers, traders & AI agents.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com/nirholas/free-crypto-news"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-gray-800 rounded-xl hover:bg-gray-700 hover:scale-105 active:scale-95 transition-all focus-ring"
                aria-label="View on GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Categories */}
          <nav aria-label="Categories">
            <h3 className="font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-2.5">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link 
                    href={`/category/${cat.slug}`} 
                    className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 focus-ring rounded px-1 -mx-1"
                  >
                    <span aria-hidden="true">{cat.icon}</span>
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Resources */}
          <nav aria-label="Resources">
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/markets" className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 focus-ring rounded px-1 -mx-1">
                  <span aria-hidden="true">📈</span> Markets
                </Link>
              </li>
              <li>
                <Link href="/defi" className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 focus-ring rounded px-1 -mx-1">
                  <span aria-hidden="true">🏦</span> DeFi Dashboard
                </Link>
              </li>
              <li>
                <Link href="/movers" className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 focus-ring rounded px-1 -mx-1">
                  <span aria-hidden="true">🚀</span> Top Movers
                </Link>
              </li>
              <li>
                <Link href="/trending" className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 focus-ring rounded px-1 -mx-1">
                  <span aria-hidden="true">🔥</span> Trending
                </Link>
              </li>
              <li>
                <Link href="/sources" className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 focus-ring rounded px-1 -mx-1">
                  <span aria-hidden="true">📚</span> Sources
                </Link>
              </li>
              <li>
                <Link href="/topics" className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 focus-ring rounded px-1 -mx-1">
                  <span aria-hidden="true">🏷️</span> Topics
                </Link>
              </li>
            </ul>
          </nav>

          {/* API */}
          <nav aria-label="API Endpoints">
            <h3 className="font-semibold text-white mb-4">API</h3>
            <ul className="space-y-2.5">
              <li>
                <a href="/api/news" className="text-sm text-gray-400 hover:text-brand-400 transition-colors font-mono focus-ring rounded px-1 -mx-1">
                  /api/news
                </a>
              </li>
              <li>
                <a href="/api/bitcoin" className="text-sm text-gray-400 hover:text-brand-400 transition-colors font-mono focus-ring rounded px-1 -mx-1">
                  /api/bitcoin
                </a>
              </li>
              <li>
                <a href="/api/defi" className="text-sm text-gray-400 hover:text-brand-400 transition-colors font-mono focus-ring rounded px-1 -mx-1">
                  /api/defi
                </a>
              </li>
              <li>
                <a href="/api/breaking" className="text-sm text-gray-400 hover:text-brand-400 transition-colors font-mono focus-ring rounded px-1 -mx-1">
                  /api/breaking
                </a>
              </li>
              <li>
                <a href="/api/sources" className="text-sm text-gray-400 hover:text-brand-400 transition-colors font-mono focus-ring rounded px-1 -mx-1">
                  /api/sources
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>
            <span className="text-brand-500">MIT Licensed</span> • Made by{' '}
            <a 
              href="https://github.com/nirholas" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors focus-ring rounded"
            >
              nich
            </a>
          </p>
          <p className="text-center md:text-right text-gray-600">
            Data from CoinDesk, The Block, Decrypt & more
          </p>
        </div>
      </div>
    </footer>
  );
}
