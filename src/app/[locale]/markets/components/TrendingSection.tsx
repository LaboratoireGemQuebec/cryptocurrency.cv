'use client';

/**
 * Trending Section Component
 * CoinGecko-style 3-card layout: Market Overview + Trending + Top Gainers/Losers
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { TrendingCoin, TokenPrice, GlobalMarketData, FearGreedIndex } from '@/lib/market-data';
import { formatPrice, formatNumber } from '@/lib/market-data';

interface TrendingSectionProps {
  trending: TrendingCoin[];
  coins: TokenPrice[];
  global?: GlobalMarketData | null;
  fearGreed?: FearGreedIndex | null;
}

/** Tiny inline sparkline SVG */
function MiniSparkline({ prices, positive }: { prices: number[]; positive: boolean }) {
  if (!prices || prices.length < 2) return null;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const w = 120;
  const h = 40;
  const step = w / (prices.length - 1);
  const pts = prices
    .map((p, i) => `${(i * step).toFixed(1)},${(h - ((p - min) / range) * (h - 4) - 2).toFixed(1)}`)
    .join(' ');
  const color = positive ? '#10b981' : '#ef4444';
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id="sfGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon fill="url(#sfGrad)" points={`0,${h} ${pts} ${w},${h}`} />
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={pts} />
    </svg>
  );
}

/** Single trending coin row */
function TrendingRow({ coin, rank }: { coin: TrendingCoin; rank: number }) {
  const change = coin.data?.price_change_percentage_24h?.usd;
  const price = coin.data?.price;
  const positive = (change ?? 0) >= 0;
  return (
    <Link
      href={`/coin/${coin.id}`}
      className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg px-2 py-2 -mx-2 transition-colors group"
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs text-gray-400 w-4 shrink-0">{rank}</span>
        <div className="relative w-6 h-6 shrink-0">
          {coin.thumb && (
            <Image src={coin.thumb} alt={coin.name} fill className="rounded-full object-cover" unoptimized />
          )}
        </div>
        <span className="font-medium text-sm text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {coin.symbol?.toUpperCase() || coin.name}
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-2">
        {price != null && (
          <span className="text-xs text-gray-600 dark:text-gray-400">{formatPrice(price)}</span>
        )}
        {change != null && (
          <span className={`text-xs font-semibold w-[54px] text-right ${positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {positive ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
          </span>
        )}
      </div>
    </Link>
  );
}

/** Single coin row for gainers/losers */
function CoinRow({ coin }: { coin: TokenPrice }) {
  const change = coin.price_change_percentage_24h;
  const positive = (change ?? 0) >= 0;
  return (
    <Link
      href={`/coin/${coin.id}`}
      className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg px-2 py-2 -mx-2 transition-colors group"
    >
      <div className="flex items-center gap-2 min-w-0">
        <div className="relative w-6 h-6 shrink-0">
          {coin.image && (
            <Image src={coin.image} alt={coin.name} fill className="rounded-full object-cover" unoptimized />
          )}
        </div>
        <div className="min-w-0">
          <span className="font-medium text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {coin.symbol?.toUpperCase()}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1.5 hidden sm:inline">{coin.name}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-2">
        <span className="text-xs text-gray-600 dark:text-gray-400">{formatPrice(coin.current_price)}</span>
        <span className={`text-xs font-semibold w-[58px] text-right ${positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
          {positive ? '▲' : '▼'} {Math.abs(change ?? 0).toFixed(2)}%
        </span>
      </div>
    </Link>
  );
}

export default function TrendingSection({ trending, coins, global, fearGreed }: TrendingSectionProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const sorted = [...coins].sort((a, b) => (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0));
  const topGainers = sorted.slice(0, 3);
  const topLosers = sorted.slice(-3).reverse();

  const mcap = global?.total_market_cap?.usd;
  const mcapChange = global?.market_cap_change_percentage_24h_usd;
  const vol = global?.total_volume?.usd;
  const btcDom = global?.market_cap_percentage?.btc;
  const ethDom = global?.market_cap_percentage?.eth;
  const fearVal = fearGreed ? Number(fearGreed.value) : null;
  const upMarket = (mcapChange ?? 0) >= 0;

  // Use BTC spark as market proxy
  const btcCoin = coins.find(c => c.id === 'bitcoin');
  const sparkPrices = btcCoin?.sparkline_in_7d?.price?.slice(-48) ?? [];

  return (
    <div className="grid md:grid-cols-3 gap-3 mb-6">

      {/* ── Card 1: Market Overview ────────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-sm transition-shadow">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-gray-100 dark:border-gray-800">
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Global Market</span>
          <Link href="/markets" className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">View chart →</Link>
        </div>

        <div className="flex items-end justify-between mb-1">
          <div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-0.5 uppercase tracking-wide font-medium">Total Market Cap</p>
            <p className="text-[22px] font-bold text-gray-900 dark:text-white leading-none">
              {mcap ? `$${formatNumber(mcap)}` : '—'}
            </p>
          </div>
          {mcapChange != null && (
            <span className={`text-sm font-bold flex items-center gap-0.5 mb-0.5 ${upMarket ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {upMarket ? '▲' : '▼'} {Math.abs(mcapChange).toFixed(2)}%
            </span>
          )}
        </div>

        {mounted && sparkPrices.length > 1 && (
          <div className="mt-1 mb-3">
            <MiniSparkline prices={sparkPrices} positive={upMarket} />
          </div>
        )}

        <div className="space-y-2 mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">24h Volume</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {vol ? `$${formatNumber(vol)}` : '—'}
            </span>
          </div>
          {btcDom != null && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">₿ BTC Dominance</span>
              <div className="flex items-center gap-1.5">
                <div className="w-14 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-400 rounded-full" style={{ width: `${btcDom}%` }} />
                </div>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{btcDom.toFixed(1)}%</span>
              </div>
            </div>
          )}
          {ethDom != null && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">Ξ ETH Dominance</span>
              <div className="flex items-center gap-1.5">
                <div className="w-14 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${ethDom}%` }} />
                </div>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{ethDom.toFixed(1)}%</span>
              </div>
            </div>
          )}
          {mounted && fearVal != null && fearGreed && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Fear &amp; Greed</span>
              <div className="flex items-center gap-1.5">
                <div className="w-14 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${fearVal <= 25 ? 'bg-red-500' : fearVal <= 45 ? 'bg-orange-400' : fearVal <= 55 ? 'bg-yellow-400' : 'bg-emerald-500'}`}
                    style={{ width: `${fearVal}%` }}
                  />
                </div>
                <span className={`font-semibold ${fearVal <= 30 ? 'text-red-600 dark:text-red-400' : fearVal <= 50 ? 'text-orange-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {fearVal}
                </span>
                <span className="text-gray-500 dark:text-gray-500 hidden sm:inline">{fearGreed.value_classification}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Card 2: Trending ──────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-sm transition-shadow">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-gray-100 dark:border-gray-800">
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
            🔥 Trending
          </span>
          <Link href="/markets/trending" className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">View more →</Link>
        </div>
        <div className="space-y-0.5">
          {trending.slice(0, 5).map((coin, i) => (
            <TrendingRow key={coin.id} coin={coin} rank={i + 1} />
          ))}
        </div>
      </div>

      {/* ── Card 3: Top Gainers + Losers ─────────────────────── */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-sm transition-shadow">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-gray-100 dark:border-gray-800">
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
            🚀 Top Gainers
          </span>
          <Link href="/markets/gainers" className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">View more →</Link>
        </div>
        <div className="space-y-0.5 mb-2">
          {mounted
            ? topGainers.map(c => <CoinRow key={c.id} coin={c} />)
            : Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-9 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
              ))}
        </div>

        <div className="flex items-center gap-2 my-2">
          <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
          <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium flex items-center gap-1">📉 Top Losers</span>
          <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
        </div>

        <div className="space-y-0.5">
          {mounted
            ? topLosers.map(c => <CoinRow key={c.id} coin={c} />)
            : Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-9 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
              ))}
        </div>
        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
          <Link href="/markets/losers" className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">View all losers →</Link>
        </div>
      </div>

    </div>
  );
}
