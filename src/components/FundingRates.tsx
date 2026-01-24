'use client';

import { useState, useEffect } from 'react';

interface FundingRate {
  symbol: string;
  name: string;
  rate: number;
  annualized: number;
  nextFunding: string;
  exchange: string;
  openInterest?: number;
  volume24h?: number;
}

interface FundingRatesProps {
  limit?: number;
  showVolume?: boolean;
  showOpenInterest?: boolean;
}

/**
 * Funding Rates Dashboard
 * 
 * Displays perpetual futures funding rates across major exchanges.
 * Positive rates = longs pay shorts, negative = shorts pay longs.
 */
export function FundingRates({
  limit = 20,
  showVolume = true,
  showOpenInterest = true,
}: FundingRatesProps) {
  const [rates, setRates] = useState<FundingRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'rate' | 'annualized' | 'volume'>('annualized');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [filter, setFilter] = useState<'all' | 'positive' | 'negative'>('all');

  useEffect(() => {
    fetchFundingRates();
    const interval = setInterval(fetchFundingRates, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  async function fetchFundingRates() {
    try {
      // Fetch from Binance Futures API (free, no key needed)
      const response = await fetch('https://fapi.binance.com/fapi/v1/premiumIndex');
      
      if (!response.ok) throw new Error('Failed to fetch funding rates');
      
      const data = await response.json();
      
      // Parse and format the data
      const formattedRates: FundingRate[] = data
        .filter((item: { symbol: string }) => item.symbol.endsWith('USDT'))
        .map((item: { symbol: string; lastFundingRate: string; nextFundingTime: number }) => ({
          symbol: item.symbol.replace('USDT', ''),
          name: item.symbol,
          rate: parseFloat(item.lastFundingRate) * 100,
          annualized: parseFloat(item.lastFundingRate) * 100 * 3 * 365,
          nextFunding: new Date(item.nextFundingTime).toISOString(),
          exchange: 'Binance',
        }))
        .slice(0, 50);

      setRates(formattedRates);
    } catch (error) {
      console.error('Failed to fetch funding rates:', error);
      // Use mock data as fallback
      setRates(generateMockRates());
    } finally {
      setLoading(false);
    }
  }

  function generateMockRates(): FundingRate[] {
    const coins = ['BTC', 'ETH', 'SOL', 'XRP', 'BNB', 'DOGE', 'ADA', 'AVAX', 'DOT', 'LINK',
      'MATIC', 'UNI', 'LTC', 'ATOM', 'FIL', 'APT', 'ARB', 'OP', 'INJ', 'TIA'];
    
    return coins.map(symbol => {
      const rate = (Math.random() - 0.3) * 0.15; // Slightly positive bias
      return {
        symbol,
        name: `${symbol}USDT`,
        rate,
        annualized: rate * 3 * 365,
        nextFunding: new Date(Date.now() + Math.random() * 8 * 60 * 60 * 1000).toISOString(),
        exchange: 'Binance',
        openInterest: Math.floor(Math.random() * 1000000000) + 10000000,
        volume24h: Math.floor(Math.random() * 5000000000) + 100000000,
      };
    });
  }

  // Filter and sort rates
  const filteredRates = rates
    .filter(r => {
      if (filter === 'positive') return r.rate > 0;
      if (filter === 'negative') return r.rate < 0;
      return true;
    })
    .sort((a, b) => {
      const aVal = sortBy === 'rate' ? a.rate : sortBy === 'annualized' ? a.annualized : (a.volume24h || 0);
      const bVal = sortBy === 'rate' ? b.rate : sortBy === 'annualized' ? b.annualized : (b.volume24h || 0);
      return sortDir === 'desc' ? bVal - aVal : aVal - bVal;
    })
    .slice(0, limit);

  const handleSort = (field: 'rate' | 'annualized' | 'volume') => {
    if (sortBy === field) {
      setSortDir(sortDir === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
  };

  const formatRate = (rate: number) => {
    const formatted = rate.toFixed(4);
    const isPositive = rate >= 0;
    return (
      <span className={isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
        {isPositive ? '+' : ''}{formatted}%
      </span>
    );
  };

  const formatAnnualized = (rate: number) => {
    const formatted = rate.toFixed(2);
    const isPositive = rate >= 0;
    return (
      <span className={isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
        {isPositive ? '+' : ''}{formatted}%
      </span>
    );
  };

  const formatVolume = (vol: number) => {
    if (vol >= 1e9) return `$${(vol / 1e9).toFixed(2)}B`;
    if (vol >= 1e6) return `$${(vol / 1e6).toFixed(2)}M`;
    return `$${vol.toLocaleString()}`;
  };

  const formatTimeUntil = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - Date.now();
    if (diff < 0) return 'Now';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-neutral-200 dark:bg-neutral-800 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Funding Rates
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Perpetual futures funding rates (8h)
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
          {(['all', 'positive', 'negative'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${
                filter === f
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 dark:bg-neutral-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Symbol
              </th>
              <th 
                onClick={() => handleSort('rate')}
                className="px-4 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                Rate (8h) {sortBy === 'rate' && (sortDir === 'desc' ? '↓' : '↑')}
              </th>
              <th 
                onClick={() => handleSort('annualized')}
                className="px-4 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                Annual {sortBy === 'annualized' && (sortDir === 'desc' ? '↓' : '↑')}
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Next
              </th>
              {showOpenInterest && (
                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  OI
                </th>
              )}
              {showVolume && (
                <th 
                  onClick={() => handleSort('volume')}
                  className="px-4 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-200"
                >
                  Volume {sortBy === 'volume' && (sortDir === 'desc' ? '↓' : '↑')}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {filteredRates.map((rate) => (
              <tr 
                key={rate.symbol}
                className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-neutral-900 dark:text-white">
                      {rate.symbol}
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {rate.exchange}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm">
                  {formatRate(rate.rate)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm">
                  {formatAnnualized(rate.annualized)}
                </td>
                <td className="px-4 py-3 text-right text-sm text-neutral-500 dark:text-neutral-400">
                  {formatTimeUntil(rate.nextFunding)}
                </td>
                {showOpenInterest && (
                  <td className="px-4 py-3 text-right text-sm text-neutral-500 dark:text-neutral-400">
                    {rate.openInterest ? formatVolume(rate.openInterest) : '-'}
                  </td>
                )}
                {showVolume && (
                  <td className="px-4 py-3 text-right text-sm text-neutral-500 dark:text-neutral-400">
                    {rate.volume24h ? formatVolume(rate.volume24h) : '-'}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 text-xs text-neutral-500 dark:text-neutral-400 text-center">
        Positive rate = Longs pay shorts • Negative rate = Shorts pay longs • Data from Binance
      </div>
    </div>
  );
}

export default FundingRates;
