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


import { useState, useCallback, useMemo } from 'react';
import {
  Search,
  Loader2,
  FileText,
  Clock,
  Globe,
  Tag,
  Sparkles,
  ChevronRight,
  SlidersHorizontal,
  Layers,
  X,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

interface SearchResult {
  id: string;
  score: number;
  text: string;
  metadata: {
    title: string;
    source?: string;
    publishedAt?: string;
    category?: string;
  };
  highlight?: string;
}

interface TopicCluster {
  centroidLabel: string;
  documents: { id: string; title: string; score: number }[];
  keywords: string[];
}

interface VectorSearchPanelProps {
  className?: string;
  onArticleClick?: (articleId: string) => void;
}

// ═══════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════

export function VectorSearchPanel({ className = '', onArticleClick }: VectorSearchPanelProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [topics, setTopics] = useState<TopicCluster[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [mode, setMode] = useState<'search' | 'topics'>('search');
  const [error, setError] = useState<string | null>(null);
  const [searchMeta, setSearchMeta] = useState<{ count: number; durationMs?: number } | null>(null);

  // Advanced options
  const [alpha, setAlpha] = useState(0.7);
  const [topK, setTopK] = useState(10);
  const [temporalDecay, setTemporalDecay] = useState(0);
  const [minScore, setMinScore] = useState(0.3);

  const doSearch = useCallback(async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);
    setTopics(null);

    try {
      const params = new URLSearchParams({
        q: query.trim(),
        topK: String(topK),
        alpha: String(alpha),
        temporalDecay: String(temporalDecay),
        minScore: String(minScore),
      });

      const res = await fetch(`/api/vector-search?${params}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Search failed');
        return;
      }

      setResults(data.results || []);
      setSearchMeta({
        count: data.count || 0,
        durationMs: data.durationMs,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setIsLoading(false);
    }
  }, [query, topK, alpha, temporalDecay, minScore]);

  const discoverTopics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const res = await fetch('/api/vector-search?action=topics&numTopics=8');
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Topic discovery failed');
        return;
      }

      setTopics(data.clusters || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className={`bg-white dark:bg-black/80 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700/50 ${className}`}>
      {/* ── Header ── */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Semantic Search</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Hybrid BM25 + vector search across 662k+ articles</p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setMode('search')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              mode === 'search'
                ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30'
                : 'bg-slate-100 dark:bg-black text-slate-600 dark:text-slate-400 border border-transparent'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Search
          </button>
          <button
            onClick={() => { setMode('topics'); discoverTopics(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              mode === 'topics'
                ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                : 'bg-slate-100 dark:bg-black text-slate-600 dark:text-slate-400 border border-transparent'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Discover Topics
          </button>
        </div>

        {/* Search Bar */}
        {mode === 'search' && (
          <>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && doSearch()}
                  placeholder="Search with natural language… 'impact of ETH ETF on DeFi volumes'"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-black border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                />
              </div>
              <button
                onClick={doSearch}
                disabled={isLoading || !query.trim()}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`px-3 py-3 rounded-xl border transition-all ${
                  showAdvanced
                    ? 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-300 dark:border-cyan-500/30 text-cyan-600'
                    : 'bg-slate-100 dark:bg-black border-slate-200 dark:border-slate-700 text-slate-500'
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Advanced Options */}
            {showAdvanced && (
              <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-slate-700/50 grid grid-cols-2 gap-4">
                <SliderOption
                  label="Vector Weight (α)"
                  value={alpha}
                  min={0}
                  max={1}
                  step={0.1}
                  onChange={setAlpha}
                  hint="1 = pure vector, 0 = pure keyword"
                />
                <SliderOption
                  label="Recency Bias"
                  value={temporalDecay}
                  min={0}
                  max={1}
                  step={0.1}
                  onChange={setTemporalDecay}
                  hint="Higher = prefer newer articles"
                />
                <SliderOption
                  label="Min Score"
                  value={minScore}
                  min={0}
                  max={1}
                  step={0.05}
                  onChange={setMinScore}
                  hint="Filter out low-relevance results"
                />
                <div>
                  <label htmlFor="vector-search-topk" className="block text-xs text-slate-500 mb-1">Result Count</label>
                  <input
                    id="vector-search-topk"
                    type="number"
                    value={topK}
                    onChange={(e) => setTopK(Math.min(100, Math.max(1, parseInt(e.target.value) || 10)))}
                    min={1}
                    max={100}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Results ── */}
      <div className="p-6">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
            <span className="text-sm text-slate-500">
              {mode === 'search' ? 'Searching embeddings…' : 'Discovering topic clusters…'}
            </span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 text-sm flex items-center gap-2">
            <X className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Search Results */}
        {!isLoading && mode === 'search' && results.length > 0 && (
          <div>
            {searchMeta && (
              <div className="text-xs text-slate-400 mb-3 flex items-center gap-2">
                <span>{searchMeta.count} results</span>
                {searchMeta.durationMs && (
                  <>
                    <span>•</span>
                    <span>{searchMeta.durationMs}ms</span>
                  </>
                )}
              </div>
            )}
            <div className="space-y-3">
              {results.map((result) => (
                <SearchResultCard
                  key={result.id}
                  result={result}
                  onClick={() => onArticleClick?.(result.id)}
                />
              ))}
            </div>
          </div>
        )}

        {!isLoading && mode === 'search' && results.length === 0 && query && !error && (
          <div className="text-center py-8 text-slate-400">
            <Search className="w-10 h-10 mx-auto mb-2" />
            <p className="text-sm">No results found. Try a different query or adjust filters.</p>
          </div>
        )}

        {/* Topic Clusters */}
        {!isLoading && mode === 'topics' && topics && topics.length > 0 && (
          <div className="space-y-4">
            {topics.map((cluster, i) => (
              <TopicClusterCard key={i} cluster={cluster} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════════════════════════════

function SearchResultCard({ result, onClick }: { result: SearchResult; onClick?: () => void }) {
  const scorePct = Math.round(result.score * 100);
  const scoreColor =
    scorePct >= 80 ? 'text-emerald-500' :
    scorePct >= 60 ? 'text-amber-500' : 'text-slate-400';

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-slate-700/50 hover:border-cyan-300 dark:hover:border-cyan-500/30 transition-all group"
    >
      <div className="flex items-start gap-3">
        <FileText className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0 group-hover:text-cyan-500 transition-colors" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
              {result.metadata.title}
            </h4>
            <span className={`text-xs font-bold ${scoreColor} flex-shrink-0`}>{scorePct}%</span>
          </div>
          {result.highlight && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{result.highlight}</p>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
            {result.metadata.source && (
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {result.metadata.source}
              </span>
            )}
            {result.metadata.publishedAt && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(result.metadata.publishedAt).toLocaleDateString()}
              </span>
            )}
            {result.metadata.category && (
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {result.metadata.category}
              </span>
            )}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-cyan-500 transition-colors" />
      </div>
    </button>
  );
}

function TopicClusterCard({ cluster, index }: { cluster: TopicCluster; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const CLUSTER_COLORS = [
    'from-violet-500 to-purple-500',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-pink-500 to-rose-500',
    'from-indigo-500 to-blue-500',
    'from-green-500 to-emerald-500',
    'from-red-500 to-orange-500',
  ];

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-neutral-900/50 transition-colors"
      >
        <div className={`w-2 h-8 rounded-full bg-gradient-to-b ${CLUSTER_COLORS[index % CLUSTER_COLORS.length]}`} />
        <div className="flex-1 text-left">
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {cluster.centroidLabel || `Topic ${index + 1}`}
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {cluster.keywords.slice(0, 5).map((kw) => (
              <span key={kw} className="text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-black text-slate-500">
                {kw}
              </span>
            ))}
          </div>
        </div>
        <span className="text-sm text-slate-400">{cluster.documents.length} articles</span>
        {expanded ? <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-1 mt-2">
            {cluster.documents.slice(0, 10).map((doc) => (
              <div key={doc.id} className="flex items-center gap-2 text-sm py-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-700 dark:text-slate-300 truncate">{doc.title}</span>
                <span className="text-xs text-slate-400 ml-auto">{Math.round(doc.score * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SliderOption({
  label,
  value,
  min,
  max,
  step,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  hint: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-xs text-slate-500">{label}</label>
        <span className="text-xs font-mono text-slate-700 dark:text-slate-300">{value.toFixed(1)}</span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-black appearance-none mt-1 accent-cyan-500"
      />
      <span className="text-[10px] text-slate-400">{hint}</span>
    </div>
  );
}
