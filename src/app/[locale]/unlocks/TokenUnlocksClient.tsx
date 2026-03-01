'use client';

/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */


import React, { useState, useMemo } from 'react';
import type { TokenUnlock } from './page';

const impactConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  high:   { label: '🔴 High Impact', color: 'text-red-700 dark:text-red-300', bg: 'bg-red-100 dark:bg-red-900/40', border: 'border-l-red-500' },
  medium: { label: '🟡 Medium', color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-100 dark:bg-amber-900/40', border: 'border-l-amber-500' },
  low:    { label: '🟢 Low', color: 'text-green-700 dark:text-green-300', bg: 'bg-green-100 dark:bg-green-900/40', border: 'border-l-green-500' },
};

const vestingLabels: Record<string, string> = {
  cliff: '🧱 Cliff',
  linear: '📐 Linear',
  periodic: '🔄 Periodic',
};

function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function daysUntil(iso: string): number {
  const diff = new Date(iso + 'T00:00:00').getTime() - new Date().setHours(0, 0, 0, 0);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function TokenUnlocksClient({ unlocks }: { unlocks: TokenUnlock[] }) {
  const [impactFilter, setImpactFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'value' | 'percent'>('date');

  const filtered = useMemo(() => {
    let list = unlocks;
    if (impactFilter !== 'all') list = list.filter(u => u.impact === impactFilter);

    return list.sort((a, b) => {
      if (sortBy === 'date') return new Date(a.unlockDate).getTime() - new Date(b.unlockDate).getTime();
      if (sortBy === 'percent') return parseFloat(b.percentOfSupply) - parseFloat(a.percentOfSupply);
      // sort by value — extract number
      const valA = parseFloat(a.unlockValue.replace(/[^0-9.]/g, '')) || 0;
      const valB = parseFloat(b.unlockValue.replace(/[^0-9.]/g, '')) || 0;
      return valB - valA;
    });
  }, [unlocks, impactFilter, sortBy]);

  // Stats
  const totalValue = unlocks.reduce((sum, u) => {
    const val = parseFloat(u.unlockValue.replace(/[^0-9.]/g, '')) || 0;
    return sum + val;
  }, 0);

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Tracked Unlocks', value: unlocks.length, emoji: '🔓' },
          { label: 'Total Value', value: `$${(totalValue / 1000).toFixed(1)}B`, emoji: '💰' },
          { label: 'High Impact', value: unlocks.filter(u => u.impact === 'high').length, emoji: '🔴' },
          { label: 'Next 30 Days', value: unlocks.filter(u => { const d = daysUntil(u.unlockDate); return d >= 0 && d <= 30; }).length, emoji: '📅' },
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-neutral-800 p-4 text-center">
            <span className="text-2xl">{stat.emoji}</span>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {['all', 'high', 'medium', 'low'].map(impact => (
          <button
            key={impact}
            onClick={() => setImpactFilter(impact)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
              impactFilter === impact
                ? 'bg-gray-900 text-white dark:bg-white dark:text-white'
                : 'bg-white dark:bg-black text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-neutral-800 hover:bg-gray-100'
            }`}
          >
            {impact === 'all' ? 'All Impact' : impactConfig[impact].label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-slate-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'date' | 'value' | 'percent')}
            className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-black text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
          >
            <option value="date">Date (soonest)</option>
            <option value="value">Value (highest)</option>
            <option value="percent">% of Supply</option>
          </select>
        </div>
      </div>

      {/* Unlock cards */}
      <div className="space-y-4">
        {filtered.map(unlock => {
          const imp = impactConfig[unlock.impact];
          const days = daysUntil(unlock.unlockDate);
          const isPast = days < 0;
          return (
            <div
              key={unlock.id}
              className={`bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-neutral-800 p-5 border-l-4 ${imp.border} hover:shadow-lg transition ${isPast ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${imp.bg} ${imp.color}`}>{imp.label}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-black text-gray-600 dark:text-slate-300">
                      {vestingLabels[unlock.vestingType]}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                      {unlock.chain}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {unlock.token} <span className="text-gray-400 font-normal">(${unlock.symbol})</span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    Recipient: {unlock.recipient}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  {isPast ? (
                    <span className="text-sm font-medium text-gray-400">Unlocked</span>
                  ) : days === 0 ? (
                    <span className="text-sm font-bold text-red-600 dark:text-red-400">TODAY</span>
                  ) : (
                    <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{days} days</span>
                  )}
                  <p className="text-xs text-gray-400 dark:text-slate-500">{formatDate(unlock.unlockDate)}</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-slate-400 mb-3">{unlock.description}</p>

              {/* Key metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-gray-50 dark:bg-black/50 rounded-lg p-2.5 text-center">
                  <p className="text-xs text-gray-500 dark:text-slate-400 mb-0.5">Amount</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{unlock.unlockAmount}</p>
                </div>
                <div className="bg-gray-50 dark:bg-black/50 rounded-lg p-2.5 text-center">
                  <p className="text-xs text-gray-500 dark:text-slate-400 mb-0.5">Est. Value</p>
                  <p className="text-sm font-bold text-green-600 dark:text-green-400">{unlock.unlockValue}</p>
                </div>
                <div className="bg-gray-50 dark:bg-black/50 rounded-lg p-2.5 text-center">
                  <p className="text-xs text-gray-500 dark:text-slate-400 mb-0.5">% of Supply</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{unlock.percentOfSupply}</p>
                </div>
                <div className="bg-gray-50 dark:bg-black/50 rounded-lg p-2.5 text-center">
                  <p className="text-xs text-gray-500 dark:text-slate-400 mb-0.5">Total Locked</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{unlock.totalLocked}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500 dark:text-slate-400">
          <p className="text-4xl mb-3">🔓</p>
          <p className="font-medium">No token unlocks match your filter</p>
        </div>
      )}
    </>
  );
}
