'use client';

import React, { useState, useMemo } from 'react';
import type { Exchange } from './page';

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} className={star <= Math.round(rating) ? 'text-amber-400' : 'text-gray-300 dark:text-slate-600'}>
          ★
        </span>
      ))}
      <span className="text-sm font-medium text-gray-900 dark:text-white ml-1">{rating.toFixed(1)}</span>
    </span>
  );
}

function TrustBadge({ score }: { score: number }) {
  const color = score >= 9 ? 'text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-900/40'
    : score >= 7 ? 'text-amber-600 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/40'
    : 'text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-900/40';
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${color}`}>
      Trust: {score}/10
    </span>
  );
}

export function ExchangeReviewsClient({ exchanges }: { exchanges: Exchange[] }) {
  const [view, setView] = useState<'cards' | 'table'>('cards');
  const [sortBy, setSortBy] = useState<'trust' | 'rating' | 'fees' | 'coins'>('trust');

  const sorted = useMemo(() => {
    return [...exchanges].sort((a, b) => {
      if (sortBy === 'trust') return b.trustScore - a.trustScore;
      if (sortBy === 'rating') return b.overallRating - a.overallRating;
      if (sortBy === 'coins') return b.supportedCoins - a.supportedCoins;
      // fees — compare taker fees
      const feeA = parseFloat(a.tradingFees.taker);
      const feeB = parseFloat(b.tradingFees.taker);
      return feeA - feeB;
    });
  }, [exchanges, sortBy]);

  return (
    <>
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-white"
          >
            <option value="trust">Sort: Trust Score</option>
            <option value="rating">Sort: Rating</option>
            <option value="fees">Sort: Lowest Fees</option>
            <option value="coins">Sort: Most Coins</option>
          </select>
        </div>
        <div className="flex bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
          <button onClick={() => setView('cards')} className={`px-3 py-1.5 text-sm ${view === 'cards' ? 'bg-gray-100 dark:bg-slate-700 font-medium' : ''}`}>
            Cards
          </button>
          <button onClick={() => setView('table')} className={`px-3 py-1.5 text-sm ${view === 'table' ? 'bg-gray-100 dark:bg-slate-700 font-medium' : ''}`}>
            Table
          </button>
        </div>
      </div>

      {view === 'cards' ? (
        <div className="space-y-6">
          {sorted.map((exchange, i) => (
            <div
              key={exchange.id}
              className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-xl font-bold text-gray-900 dark:text-white shrink-0">
                    #{i + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      <a href={exchange.url} target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 dark:hover:text-amber-400 transition">
                        {exchange.name} ↗
                      </a>
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Founded {exchange.founded} • {exchange.headquarters}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Stars rating={exchange.overallRating} />
                      <TrustBadge score={exchange.trustScore} />
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{exchange.volume24h}</p>
                  <p className="text-xs text-gray-400 dark:text-slate-500">24h Volume</p>
                </div>
              </div>

              {/* Key metrics */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 dark:text-slate-400">Maker Fee</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{exchange.tradingFees.maker}</p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 dark:text-slate-400">Taker Fee</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{exchange.tradingFees.taker}</p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 dark:text-slate-400">Coins</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{exchange.supportedCoins}+</p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 dark:text-slate-400">KYC</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white capitalize">{exchange.kyc}</p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 dark:text-slate-400">Security</p>
                  <div className="flex items-center justify-center gap-1 text-xs mt-0.5">
                    {exchange.regulated && <span title="Regulated" className="text-green-500">🏛️</span>}
                    {exchange.proofOfReserves && <span title="Proof of Reserves" className="text-blue-500">📊</span>}
                    {exchange.insuranceFund && <span title="Insurance Fund" className="text-amber-500">🛡️</span>}
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {exchange.features.map(f => (
                  <span key={f} className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-xs text-gray-600 dark:text-slate-300">
                    {f}
                  </span>
                ))}
              </div>

              {/* Pros and Cons */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold text-green-700 dark:text-green-300 uppercase tracking-wide mb-2">✅ Pros</h4>
                  <ul className="space-y-1">
                    {exchange.pros.map((pro, j) => (
                      <li key={j} className="text-sm text-gray-600 dark:text-slate-400 flex items-start gap-2">
                        <span className="text-green-500 shrink-0">+</span> {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-red-700 dark:text-red-300 uppercase tracking-wide mb-2">❌ Cons</h4>
                  <ul className="space-y-1">
                    {exchange.cons.map((con, j) => (
                      <li key={j} className="text-sm text-gray-600 dark:text-slate-400 flex items-start gap-2">
                        <span className="text-red-500 shrink-0">−</span> {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table view */
        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
            <thead className="bg-gray-50 dark:bg-slate-900/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">#</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">Exchange</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">Trust</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">Rating</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">Maker</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">Taker</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">Coins</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">24h Vol</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">KYC</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">Security</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {sorted.map((ex, i) => (
                <tr key={ex.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                  <td className="px-4 py-3 text-sm font-bold text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3">
                    <a href={ex.url} target="_blank" rel="noopener noreferrer" className="font-bold text-gray-900 dark:text-white hover:text-amber-600 transition text-sm">
                      {ex.name} ↗
                    </a>
                  </td>
                  <td className="px-4 py-3 text-center"><TrustBadge score={ex.trustScore} /></td>
                  <td className="px-4 py-3 text-center text-sm font-medium text-gray-900 dark:text-white">{ex.overallRating}</td>
                  <td className="px-4 py-3 text-center text-sm text-gray-700 dark:text-slate-300">{ex.tradingFees.maker}</td>
                  <td className="px-4 py-3 text-center text-sm text-gray-700 dark:text-slate-300">{ex.tradingFees.taker}</td>
                  <td className="px-4 py-3 text-center text-sm text-gray-700 dark:text-slate-300">{ex.supportedCoins}+</td>
                  <td className="px-4 py-3 text-center text-sm font-medium text-gray-900 dark:text-white">{ex.volume24h}</td>
                  <td className="px-4 py-3 text-center text-xs capitalize text-gray-600 dark:text-slate-400">{ex.kyc}</td>
                  <td className="px-4 py-3 text-center">
                    {ex.regulated && <span title="Regulated">🏛️</span>}
                    {ex.proofOfReserves && <span title="PoR">📊</span>}
                    {ex.insuranceFund && <span title="Insurance">🛡️</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
