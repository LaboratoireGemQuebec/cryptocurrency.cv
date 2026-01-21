/**
 * Market Stats Widget
 * Displays key market statistics in a compact widget
 */

import { getMarketOverview, formatNumber, formatPercent, getFearGreedColor, getFearGreedBgColor } from '@/lib/market-data';
import Link from 'next/link';

export default async function MarketStats() {
  const market = await getMarketOverview();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">📊 Market Overview</h3>
        <Link href="/markets" className="text-sm text-blue-600 hover:underline">
          View All →
        </Link>
      </div>

      <div className="space-y-4">
        {/* Market Cap */}
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-sm">Total Market Cap</span>
          <div className="text-right">
            <span className="font-semibold">${formatNumber(market.global.total_market_cap?.usd)}</span>
            <span className={`ml-2 text-xs ${market.global.market_cap_change_percentage_24h_usd >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercent(market.global.market_cap_change_percentage_24h_usd)}
            </span>
          </div>
        </div>

        {/* 24h Volume */}
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-sm">24h Volume</span>
          <span className="font-semibold">${formatNumber(market.global.total_volume?.usd)}</span>
        </div>

        {/* BTC Dominance */}
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-sm">BTC Dominance</span>
          <span className="font-semibold">{market.global.market_cap_percentage?.btc?.toFixed(1)}%</span>
        </div>

        {/* Fear & Greed */}
        {market.fearGreed && (
          <div className="pt-3 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">Fear & Greed Index</span>
              <span className={`font-bold ${getFearGreedColor(Number(market.fearGreed.value))}`}>
                {market.fearGreed.value}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getFearGreedBgColor(Number(market.fearGreed.value))} transition-all`}
                style={{ width: `${market.fearGreed.value}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 text-right">
              {market.fearGreed.value_classification}
            </p>
          </div>
        )}

        {/* Trending */}
        {market.trending.length > 0 && (
          <div className="pt-3 border-t">
            <p className="text-gray-500 text-sm mb-2">🔥 Trending</p>
            <div className="flex flex-wrap gap-2">
              {market.trending.slice(0, 5).map((coin) => (
                <span 
                  key={coin.id}
                  className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1 text-xs"
                >
                  <img src={coin.thumb} alt={coin.name} className="w-4 h-4 rounded-full" />
                  {coin.symbol.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
