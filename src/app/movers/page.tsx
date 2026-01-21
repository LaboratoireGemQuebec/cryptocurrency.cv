/**
 * Top Gainers and Losers Page
 * Real-time price movers in crypto
 */

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getTopCoins, formatPrice, formatPercent, formatNumber } from '@/lib/market-data';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Top Gainers & Losers',
  description: 'Real-time crypto price movers. See which coins are pumping and dumping in the last 24 hours.',
};

export const revalidate = 60;

export default async function MoversPage() {
  const coins = await getTopCoins(100);
  
  // Sort by 24h change
  const sortedByChange = [...coins].sort((a, b) => 
    (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0)
  );
  
  const gainers = sortedByChange.slice(0, 20);
  const losers = sortedByChange.slice(-20).reverse();
  
  // Calculate market stats
  const totalGainers = coins.filter(c => (c.price_change_percentage_24h || 0) > 0).length;
  const totalLosers = coins.filter(c => (c.price_change_percentage_24h || 0) < 0).length;
  const avgChange = coins.reduce((sum, c) => sum + (c.price_change_percentage_24h || 0), 0) / coins.length;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <Header />
        
        <main className="px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">📈 Top Movers</h1>
            <p className="text-gray-600">
              Biggest price changes in the last 24 hours
            </p>
          </div>

          {/* Market Sentiment */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 border">
              <p className="text-gray-500 text-sm">Gainers (24h)</p>
              <p className="text-2xl font-bold text-green-600">{totalGainers}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border">
              <p className="text-gray-500 text-sm">Losers (24h)</p>
              <p className="text-2xl font-bold text-red-600">{totalLosers}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border">
              <p className="text-gray-500 text-sm">Avg Change</p>
              <p className={`text-2xl font-bold ${avgChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercent(avgChange)}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border">
              <p className="text-gray-500 text-sm">Sentiment</p>
              <p className={`text-2xl font-bold ${totalGainers > totalLosers ? 'text-green-600' : 'text-red-600'}`}>
                {totalGainers > totalLosers ? 'Bullish 🐂' : 'Bearish 🐻'}
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top Gainers */}
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="p-4 border-b bg-green-50">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚀</span>
                  <div>
                    <h2 className="font-bold text-lg text-green-800">Top Gainers</h2>
                    <p className="text-sm text-green-600">Best performers in 24h</p>
                  </div>
                </div>
              </div>
              <div className="divide-y max-h-[600px] overflow-y-auto">
                {gainers.map((coin, index) => (
                  <Link
                    key={coin.id}
                    href={`/coin/${coin.id}`}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 text-sm w-6">{index + 1}</span>
                      {coin.image && (
                        <img 
                          src={coin.image} 
                          alt={coin.name}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <div>
                        <span className="font-medium">{coin.name}</span>
                        <span className="text-gray-500 text-sm ml-2">{coin.symbol.toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(coin.current_price)}</p>
                      <p className="text-green-600 font-bold">
                        +{formatPercent(coin.price_change_percentage_24h)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Top Losers */}
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="p-4 border-b bg-red-50">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📉</span>
                  <div>
                    <h2 className="font-bold text-lg text-red-800">Top Losers</h2>
                    <p className="text-sm text-red-600">Worst performers in 24h</p>
                  </div>
                </div>
              </div>
              <div className="divide-y max-h-[600px] overflow-y-auto">
                {losers.map((coin, index) => (
                  <Link
                    key={coin.id}
                    href={`/coin/${coin.id}`}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 text-sm w-6">{index + 1}</span>
                      {coin.image && (
                        <img 
                          src={coin.image} 
                          alt={coin.name}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <div>
                        <span className="font-medium">{coin.name}</span>
                        <span className="text-gray-500 text-sm ml-2">{coin.symbol.toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(coin.current_price)}</p>
                      <p className="text-red-600 font-bold">
                        {formatPercent(coin.price_change_percentage_24h)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-center gap-4">
            <Link 
              href="/markets" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Full Markets Dashboard
            </Link>
            <Link 
              href="/category/markets" 
              className="bg-white border text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Market News
            </Link>
          </div>

          {/* Attribution */}
          <p className="text-center text-gray-500 text-sm mt-8">
            Data from{' '}
            <a href="https://www.coingecko.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              CoinGecko
            </a>
            . Updated every minute.
          </p>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
