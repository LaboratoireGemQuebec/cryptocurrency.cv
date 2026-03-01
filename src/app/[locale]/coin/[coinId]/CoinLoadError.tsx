/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

/**
 * CoinLoadError — shown when coin data APIs are unavailable.
 * Auto-retries by refreshing the page after a short delay.
 * Unlike the not-found page, this communicates a *temporary* failure.
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface CoinLoadErrorProps {
  coinId: string;
  coinName?: string;
}

export default function CoinLoadError({ coinId, coinName }: CoinLoadErrorProps) {
  const router = useRouter();
  const [retryCount, setRetryCount] = useState(0);
  const [countdown, setCountdown] = useState(5);
  const [isRetrying, setIsRetrying] = useState(false);
  const maxRetries = 3;

  const doRetry = useCallback(() => {
    setIsRetrying(true);
    setRetryCount((c) => c + 1);
    router.refresh();
    // Reset state after a delay in case the refresh completes
    setTimeout(() => {
      setIsRetrying(false);
      setCountdown(10); // Longer wait on subsequent retries
    }, 3000);
  }, [router]);

  useEffect(() => {
    if (retryCount >= maxRetries || isRetrying) return;

    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          doRetry();
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [retryCount, isRetrying, doRetry]);

  const displayName = coinName || coinId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <main className="px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <div className="max-w-md w-full text-center">
        {/* Loading/Error Icon */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
          {isRetrying ? (
            <svg
              className="w-12 h-12 text-brand-400 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <span className="text-5xl">⏳</span>
          )}
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">
          {isRetrying ? 'Loading...' : 'Temporarily Unavailable'}
        </h1>

        <p className="text-gray-400 mb-4">
          {isRetrying
            ? `Fetching ${displayName} data...`
            : `Market data for ${displayName} is temporarily unavailable. This usually resolves in a few seconds.`}
        </p>

        {!isRetrying && retryCount < maxRetries && (
          <p className="text-sm text-gray-500 mb-6">
            Auto-retrying in {countdown}s...
          </p>
        )}

        {retryCount >= maxRetries && !isRetrying && (
          <p className="text-sm text-amber-400/80 mb-6">
            The market data APIs appear to be temporarily overloaded.
            Please try again in a minute.
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={doRetry}
            disabled={isRetrying}
            className="px-6 py-3 bg-brand-500 hover:bg-brand-400 disabled:opacity-50 text-black font-semibold rounded-xl transition-colors"
          >
            {isRetrying ? 'Retrying...' : 'Retry Now'}
          </button>

          <a
            href="/markets"
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors"
          >
            Browse Markets
          </a>
        </div>

        {/* Popular coins */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-500 mb-4">
            Popular cryptocurrencies:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { id: 'bitcoin', symbol: 'BTC' },
              { id: 'ethereum', symbol: 'ETH' },
              { id: 'solana', symbol: 'SOL' },
              { id: 'binancecoin', symbol: 'BNB' },
              { id: 'ripple', symbol: 'XRP' },
              { id: 'cardano', symbol: 'ADA' },
            ].map((coin) => (
              <a
                key={coin.id}
                href={`/coin/${coin.id}`}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition-colors"
              >
                {coin.symbol}
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
