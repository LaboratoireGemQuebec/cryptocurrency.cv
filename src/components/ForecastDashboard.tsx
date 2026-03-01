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


import { useState, useCallback, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Activity,
  Target,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Loader2,
  RefreshCw,
  Layers,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

interface ModelSignal {
  model: string;
  direction: 'bullish' | 'bearish' | 'neutral';
  magnitude: number;
  confidence: number;
  rationale: string;
  weight: number;
}

interface ForecastResult {
  asset: string;
  horizon: string;
  composite: {
    direction: 'bullish' | 'bearish' | 'neutral';
    magnitude: number;
    confidence: number;
    summary: string;
  };
  models: ModelSignal[];
  contrarian?: {
    scenario: string;
    probability: number;
    trigger: string;
  };
  narratives?: string[];
  generatedAt: string;
}

interface ForecastDashboardProps {
  className?: string;
  defaultAsset?: string;
}

// ═══════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════

const POPULAR_ASSETS = ['BTC', 'ETH', 'SOL', 'AVAX', 'LINK', 'DOT', 'MATIC', 'ARB'];
const HORIZONS = ['1d', '1w', '1m', '3m'] as const;

const DIRECTION_CONFIG = {
  bullish: { icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Bullish' },
  bearish: { icon: TrendingDown, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Bearish' },
  neutral: { icon: Minus, color: 'text-slate-400', bg: 'bg-slate-500/10', label: 'Neutral' },
};

const MODEL_NAMES: Record<string, { label: string; description: string; color: string }> = {
  narrativeMomentum: { label: 'Narrative Momentum', description: 'Tracks crypto narrative cycles & adoption waves', color: 'from-violet-500 to-purple-500' },
  sentimentTrajectory: { label: 'Sentiment Trajectory', description: 'Maps social/media sentiment momentum', color: 'from-pink-500 to-rose-500' },
  historicalAnalogue: { label: 'Historical Analogue', description: 'Pattern matching against past market cycles', color: 'from-amber-500 to-orange-500' },
  regimeDetection: { label: 'Regime Detection', description: 'Detects market regime shifts & inflection points', color: 'from-cyan-500 to-blue-500' },
};

// ═══════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════

export function ForecastDashboard({ className = '', defaultAsset = 'BTC' }: ForecastDashboardProps) {
  const [asset, setAsset] = useState(defaultAsset);
  const [horizon, setHorizon] = useState<string>('1w');
  const [forecast, setForecast] = useState<ForecastResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedModel, setExpandedModel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchForecast = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/forecast?asset=${encodeURIComponent(asset)}&horizon=${horizon}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Forecast generation failed');
        return;
      }

      setForecast(data.result || data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setIsLoading(false);
    }
  }, [asset, horizon]);

  useEffect(() => {
    fetchForecast();
  }, [fetchForecast]);

  return (
    <div className={`bg-white dark:bg-black/80 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700/50 ${className}`}>
      {/* ── Header ── */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Predictive Intelligence</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">4-model ensemble AI forecasting engine</p>
            </div>
          </div>
          <button
            onClick={fetchForecast}
            disabled={isLoading}
            className="p-2 rounded-lg bg-slate-100 dark:bg-black text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Asset Selector */}
        <div className="flex flex-wrap gap-2 mb-3">
          {POPULAR_ASSETS.map((a) => (
            <button
              key={a}
              onClick={() => setAsset(a)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                asset === a
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  : 'bg-slate-100 dark:bg-black text-slate-600 dark:text-slate-400 border border-transparent hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {a}
            </button>
          ))}
          <input
            type="text"
            value={asset}
            onChange={(e) => setAsset(e.target.value.toUpperCase())}
            className="w-20 px-3 py-1.5 rounded-lg text-sm bg-slate-100 dark:bg-black border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-center uppercase"
            placeholder="Other"
          />
        </div>

        {/* Horizon Selector */}
        <div className="flex gap-2">
          {HORIZONS.map((h) => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                horizon === h
                  ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                  : 'bg-slate-100 dark:bg-black text-slate-600 dark:text-slate-400 border border-transparent hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {h}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-6">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            <span className="text-sm text-slate-500">Running 4 prediction models…</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {!isLoading && forecast && (
          <div className="space-y-6">
            {/* Composite Signal */}
            <CompositeSignalCard forecast={forecast} />

            {/* Model Breakdown */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Model Signals
              </h3>
              <div className="space-y-2">
                {forecast.models.map((model) => (
                  <ModelSignalCard
                    key={model.model}
                    model={model}
                    expanded={expandedModel === model.model}
                    onToggle={() => setExpandedModel(expandedModel === model.model ? null : model.model)}
                  />
                ))}
              </div>
            </div>

            {/* Contrarian View */}
            {forecast.contrarian && (
              <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20">
                <h3 className="text-sm font-semibold text-orange-600 dark:text-orange-400 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Contrarian Scenario ({Math.round(forecast.contrarian.probability * 100)}% probability)
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300">{forecast.contrarian.scenario}</p>
                <p className="text-xs text-slate-500 mt-1">
                  <span className="font-medium">Trigger:</span> {forecast.contrarian.trigger}
                </p>
              </div>
            )}

            {/* Active Narratives */}
            {forecast.narratives && forecast.narratives.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Active Narratives
                </h3>
                <div className="flex flex-wrap gap-2">
                  {forecast.narratives.map((n, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-xs rounded-full bg-slate-100 dark:bg-black text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Generated At */}
            <div className="text-xs text-slate-400 flex items-center gap-1 pt-2 border-t border-slate-200 dark:border-slate-700/50">
              <Clock className="w-3 h-3" />
              Generated {new Date(forecast.generatedAt).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════════════════════════════

function CompositeSignalCard({ forecast }: { forecast: ForecastResult }) {
  const { composite } = forecast;
  const dirConfig = DIRECTION_CONFIG[composite.direction];
  const Icon = dirConfig.icon;
  const magnitudePct = Math.round(composite.magnitude * 100);
  const confidencePct = Math.round(composite.confidence * 100);

  return (
    <div className={`rounded-xl p-5 ${dirConfig.bg} border ${
      composite.direction === 'bullish' ? 'border-emerald-200 dark:border-emerald-500/20' :
      composite.direction === 'bearish' ? 'border-red-200 dark:border-red-500/20' :
      'border-slate-200 dark:border-slate-500/20'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Icon className={`w-8 h-8 ${dirConfig.color}`} />
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {forecast.asset} <span className={dirConfig.color}>{dirConfig.label}</span>
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {forecast.horizon} forecast • Composite signal
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{magnitudePct}%</div>
          <div className="text-xs text-slate-500">magnitude</div>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Confidence</span>
          <span>{confidencePct}%</span>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-black rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              confidencePct >= 70 ? 'bg-emerald-500' :
              confidencePct >= 50 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${confidencePct}%` }}
          />
        </div>
      </div>

      {composite.summary && (
        <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {composite.summary}
        </p>
      )}
    </div>
  );
}

function ModelSignalCard({
  model,
  expanded,
  onToggle,
}: {
  model: ModelSignal;
  expanded: boolean;
  onToggle: () => void;
}) {
  const dirConfig = DIRECTION_CONFIG[model.direction];
  const Icon = dirConfig.icon;
  const meta = MODEL_NAMES[model.model] || { label: model.model, description: '', color: 'from-slate-500 to-slate-600' };

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700/50 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-neutral-900/50 transition-colors"
      >
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-slate-400" />
        )}
        <div className={`w-1 h-8 rounded-full bg-gradient-to-b ${meta.color}`} />
        <div className="flex-1 text-left">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{meta.label}</div>
          <div className="text-xs text-slate-400">{meta.description}</div>
        </div>
        <Icon className={`w-4 h-4 ${dirConfig.color}`} />
        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${dirConfig.color} ${dirConfig.bg}`}>
          {Math.round(model.magnitude * 100)}%
        </span>
        <span className="text-xs text-slate-400 w-12 text-right">
          w:{Math.round(model.weight * 100)}%
        </span>
      </button>
      {expanded && model.rationale && (
        <div className="px-12 pb-3 text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
          {model.rationale}
          <div className="mt-2 flex gap-4 text-xs">
            <span>Confidence: {Math.round(model.confidence * 100)}%</span>
            <span>Weight: {Math.round(model.weight * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
