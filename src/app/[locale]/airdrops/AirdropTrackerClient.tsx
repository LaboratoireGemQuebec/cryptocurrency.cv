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
import type { Airdrop } from './page';

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  upcoming: { label: '⏳ Upcoming', color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-100 dark:bg-amber-900/40' },
  active:   { label: '🟢 Active', color: 'text-green-700 dark:text-green-300', bg: 'bg-green-100 dark:bg-green-900/40' },
  ended:    { label: '⬛ Ended', color: 'text-gray-700 dark:text-gray-300', bg: 'bg-gray-100 dark:bg-gray-800' },
};

const difficultyConfig: Record<string, { label: string; color: string; bg: string }> = {
  easy:   { label: 'Easy', color: 'text-green-700 dark:text-green-300', bg: 'bg-green-100 dark:bg-green-900/40' },
  medium: { label: 'Medium', color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-100 dark:bg-amber-900/40' },
  hard:   { label: 'Hard', color: 'text-red-700 dark:text-red-300', bg: 'bg-red-100 dark:bg-red-900/40' },
};

export function AirdropTrackerClient({ airdrops }: { airdrops: Airdrop[] }) {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    let list = airdrops;
    if (statusFilter !== 'all') list = list.filter(a => a.status === statusFilter);
    // Sort: active first, then upcoming, then ended
    const order: Record<string, number> = { active: 0, upcoming: 1, ended: 2 };
    return list.sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9));
  }, [airdrops, statusFilter]);

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Airdrops', value: airdrops.length, emoji: '🪂' },
          { label: 'Active Now', value: airdrops.filter(a => a.status === 'active').length, emoji: '🟢' },
          { label: 'Upcoming', value: airdrops.filter(a => a.status === 'upcoming').length, emoji: '⏳' },
          { label: 'Verified', value: airdrops.filter(a => a.verified).length, emoji: '✅' },
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4 text-center">
            <span className="text-2xl">{stat.emoji}</span>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'active', 'upcoming', 'ended'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
              statusFilter === status
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-100'
            }`}
          >
            {status === 'all' ? 'All' : statusConfig[status].label}
          </button>
        ))}
      </div>

      {/* Airdrop cards */}
      <div className="space-y-4">
        {filtered.map(airdrop => {
          const st = statusConfig[airdrop.status];
          const diff = difficultyConfig[airdrop.difficulty];
          return (
            <div
              key={airdrop.id}
              className={`bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 hover:shadow-lg transition ${
                airdrop.status === 'ended' ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${st.bg} ${st.color}`}>{st.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${diff.bg} ${diff.color}`}>
                      Difficulty: {diff.label}
                    </span>
                    {airdrop.verified && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                        ✅ Verified
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    <a href={airdrop.url} target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 dark:hover:text-amber-400 transition">
                      {airdrop.name} ↗
                    </a>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    {airdrop.project} • {airdrop.chain} • Token: <strong>${airdrop.token}</strong>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">{airdrop.estimatedValue}</p>
                  <p className="text-xs text-gray-400 dark:text-slate-500">Est. value</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-slate-400 mb-3">{airdrop.description}</p>

              {/* Eligibility */}
              <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-3 mb-3">
                <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-wide">Eligibility Criteria</h4>
                <ul className="space-y-1">
                  {airdrop.eligibility.map((criteria, i) => (
                    <li key={i} className="text-sm text-gray-600 dark:text-slate-400 flex items-start gap-2">
                      <span className="text-amber-500 shrink-0 mt-0.5">○</span>
                      {criteria}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Meta info */}
              <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-slate-400">
                {airdrop.totalAllocation !== 'TBA' && (
                  <span>📊 Allocation: {airdrop.totalAllocation}</span>
                )}
                {airdrop.snapshotDate && <span>📸 Snapshot: {airdrop.snapshotDate}</span>}
                {airdrop.claimDeadline && <span>⏰ Claim by: {airdrop.claimDeadline}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500 dark:text-slate-400">
          <p className="text-4xl mb-3">🪂</p>
          <p className="font-medium">No airdrops match your filter</p>
        </div>
      )}
    </>
  );
}
