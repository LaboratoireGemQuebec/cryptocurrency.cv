'use client';

import React, { useState, useMemo } from 'react';
import type { GlossaryTerm } from './types';

export function GlossaryClient({ terms }: { terms: GlossaryTerm[] }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = new Set(terms.map(t => t.category));
    return Array.from(cats).sort();
  }, [terms]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return terms
      .filter(t => {
        if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
        if (q && !t.term.toLowerCase().includes(q) && !t.definition.toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [terms, search, selectedCategory]);

  const letters = useMemo(() => {
    const set = new Set(filtered.map(t => t.term[0].toUpperCase()));
    return Array.from(set).sort();
  }, [filtered]);

  return (
    <>
      {/* Search & filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search terms..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Letter quick-nav */}
      <div className="flex flex-wrap gap-1 mb-6">
        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
          <a
            key={letter}
            href={letters.includes(letter) ? `#letter-${letter}` : undefined}
            className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition ${
              letters.includes(letter)
                ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800/40'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-300 dark:text-slate-600 cursor-default'
            }`}
          >
            {letter}
          </a>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">{filtered.length} terms</p>

      {/* Terms grouped by letter */}
      {letters.map(letter => (
        <div key={letter} id={`letter-${letter}`} className="mb-8">
          <h2 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-3 border-b border-gray-200 dark:border-slate-700 pb-2">
            {letter}
          </h2>
          <div className="space-y-3">
            {filtered
              .filter(t => t.term[0].toUpperCase() === letter)
              .map(term => (
                <div key={term.term} className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{term.term}</h3>
                      <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">{term.definition}</p>
                    </div>
                    <span className="shrink-0 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300">
                      {term.category}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500 dark:text-slate-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium">No terms match your search</p>
        </div>
      )}
    </>
  );
}
