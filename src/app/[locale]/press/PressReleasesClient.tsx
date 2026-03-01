'use client';

import React, { useState, useMemo } from 'react';
import type { PressRelease } from './page';

const categoryConfig: Record<string, { emoji: string; label: string; color: string; bg: string }> = {
  launch:      { emoji: '🚀', label: 'Launch', color: 'text-green-700 dark:text-green-300', bg: 'bg-green-100 dark:bg-green-900/40' },
  partnership: { emoji: '🤝', label: 'Partnership', color: 'text-blue-700 dark:text-blue-300', bg: 'bg-blue-100 dark:bg-blue-900/40' },
  funding:     { emoji: '💰', label: 'Funding', color: 'text-purple-700 dark:text-purple-300', bg: 'bg-purple-100 dark:bg-purple-900/40' },
  listing:     { emoji: '📋', label: 'Listing', color: 'text-cyan-700 dark:text-cyan-300', bg: 'bg-cyan-100 dark:bg-cyan-900/40' },
  update:      { emoji: '⬆️', label: 'Update', color: 'text-indigo-700 dark:text-indigo-300', bg: 'bg-indigo-100 dark:bg-indigo-900/40' },
  milestone:   { emoji: '🎯', label: 'Milestone', color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-100 dark:bg-amber-900/40' },
  event:       { emoji: '📅', label: 'Event', color: 'text-rose-700 dark:text-rose-300', bg: 'bg-rose-100 dark:bg-rose-900/40' },
};

function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function PressReleasesClient({ releases }: { releases: PressRelease[] }) {
  const [filter, setFilter] = useState<string>('all');
  const [hideSponsored, setHideSponsored] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(releases.map(r => r.category));
    return Array.from(cats).sort();
  }, [releases]);

  const filtered = useMemo(() => {
    let list = releases;
    if (filter !== 'all') list = list.filter(r => r.category === filter);
    if (hideSponsored) list = list.filter(r => !r.sponsored);
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [releases, filter, hideSponsored]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
            filter === 'all'
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
              : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-100'
          }`}
        >
          All
        </button>
        {categories.map(cat => {
          const cfg = categoryConfig[cat] || categoryConfig.launch;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition inline-flex items-center gap-1.5 ${
                filter === cat
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-100'
              }`}
            >
              <span>{cfg.emoji}</span> {cfg.label}
            </button>
          );
        })}
        <label className="ml-auto inline-flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 cursor-pointer">
          <input
            type="checkbox"
            checked={hideSponsored}
            onChange={() => setHideSponsored(!hideSponsored)}
            className="rounded border-gray-300 dark:border-slate-600 text-amber-500 focus:ring-amber-500"
          />
          Hide sponsored
        </label>
      </div>

      <div className="space-y-4">
        {filtered.map(pr => {
          const cfg = categoryConfig[pr.category] || categoryConfig.launch;
          return (
            <article
              key={pr.id}
              className={`bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 hover:shadow-lg transition ${
                pr.sponsored ? 'border-l-4 border-l-yellow-400' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                    {cfg.emoji} {cfg.label}
                  </span>
                  {pr.sponsored && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-200 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
                      Sponsored
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500 dark:text-slate-400 shrink-0">{formatDate(pr.date)}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                <a href={pr.url} className="hover:text-amber-600 dark:hover:text-amber-400 transition">
                  {pr.title}
                </a>
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">By <strong>{pr.organization}</strong></p>
              <p className="text-sm text-gray-600 dark:text-slate-400">{pr.summary}</p>
              {pr.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {pr.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-xs text-gray-600 dark:text-slate-300">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500 dark:text-slate-400">
          <p className="text-4xl mb-3">📢</p>
          <p className="font-medium">No press releases match your filters</p>
        </div>
      )}
    </>
  );
}
