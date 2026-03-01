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


import { useState, useEffect, useCallback, useRef } from 'react';
import {
  AlertTriangle,
  Activity,
  Bell,
  BellOff,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Signal,
  Eye,
  ChevronDown,
  ChevronRight,
  Loader2,
  RefreshCw,
  Zap,
  ShieldAlert,
  BarChart3,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

interface Anomaly {
  id: string;
  signal: string;
  value: number;
  expectedRange: { low: number; high: number };
  severity: 'low' | 'medium' | 'high' | 'critical';
  algorithms: string[];
  fusedScore: number;
  interpretation?: string;
  detectedAt: string;
  acknowledged: boolean;
  falsePositive: boolean;
}

interface SignalStats {
  signal: string;
  dataPoints: number;
  anomalyCount: number;
  lastValue: number;
  mean: number;
  std: number;
  lastAnomaly?: string;
}

interface DashboardData {
  signals: SignalStats[];
  recentAnomalies: Anomaly[];
  totalSignals: number;
  totalAnomalies: number;
  criticalCount: number;
  unacknowledgedCount: number;
}

interface AnomalyMonitorProps {
  className?: string;
  refreshInterval?: number;
}

// ═══════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════

const SEVERITY_CONFIG = {
  critical: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30', ring: 'ring-red-500/20', icon: ShieldAlert, label: 'CRITICAL' },
  high: { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30', ring: 'ring-orange-500/20', icon: AlertTriangle, label: 'HIGH' },
  medium: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30', ring: 'ring-amber-500/20', icon: Activity, label: 'MEDIUM' },
  low: { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30', ring: 'ring-blue-500/20', icon: Signal, label: 'LOW' },
};

// ═══════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════

export function AnomalyMonitor({ className = '', refreshInterval = 30000 }: AnomalyMonitorProps) {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedAnomaly, setExpandedAnomaly] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'unack'>('all');
  const [selectedSignal, setSelectedSignal] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      const params = selectedSignal ? `?signal=${encodeURIComponent(selectedSignal)}` : '';
      const res = await fetch(`/api/anomalies?action=dashboard${params}`);
      const data = await res.json();

      if (res.ok) {
        setDashboard(data);
      }
    } catch {
      // Silently retry on next interval
    } finally {
      setIsLoading(false);
    }
  }, [selectedSignal]);

  useEffect(() => {
    fetchDashboard();
    intervalRef.current = setInterval(fetchDashboard, refreshInterval);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchDashboard, refreshInterval]);

  const handleAcknowledge = async (anomalyId: string) => {
    await fetch('/api/anomalies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'acknowledge', anomalyId }),
    });
    await fetchDashboard();
  };

  const handleFalsePositive = async (anomalyId: string) => {
    await fetch('/api/anomalies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'false-positive', anomalyId }),
    });
    await fetchDashboard();
  };

  const filteredAnomalies = dashboard?.recentAnomalies?.filter((a) => {
    if (filter === 'critical') return a.severity === 'critical';
    if (filter === 'high') return a.severity === 'critical' || a.severity === 'high';
    if (filter === 'unack') return !a.acknowledged;
    return true;
  }) || [];

  return (
    <div className={`bg-white dark:bg-black/80 rounded-2xl shadow-xl border border-slate-200 dark:border-neutral-800/50 ${className}`}>
      {/* ── Header ── */}
      <div className="p-6 border-b border-slate-200 dark:border-neutral-800/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 text-white relative">
              <Activity className="w-6 h-6" />
              {dashboard && dashboard.criticalCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {dashboard.criticalCount}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Anomaly Monitor</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                ML-enhanced detection across {dashboard?.totalSignals || 0} signals
              </p>
            </div>
          </div>
          <button
            onClick={fetchDashboard}
            disabled={isLoading}
            className="p-2 rounded-lg bg-slate-100 dark:bg-black text-slate-500 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Stats Row */}
        {dashboard && (
          <div className="grid grid-cols-4 gap-3 mb-4">
            <StatCard label="Total Signals" value={dashboard.totalSignals} icon={Signal} color="text-blue-500" />
            <StatCard label="Anomalies" value={dashboard.totalAnomalies} icon={AlertTriangle} color="text-amber-500" />
            <StatCard label="Critical" value={dashboard.criticalCount} icon={ShieldAlert} color="text-red-500" />
            <StatCard label="Unack'd" value={dashboard.unacknowledgedCount} icon={Bell} color="text-orange-500" />
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2">
          {(['all', 'critical', 'high', 'unack'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30'
                  : 'bg-slate-100 dark:bg-black text-slate-600 dark:text-slate-400 border border-transparent hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {f === 'all' ? 'All' : f === 'unack' ? 'Unacknowledged' : f.charAt(0).toUpperCase() + f.slice(1) + '+'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-6">
        {isLoading && !dashboard ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            <span className="text-sm text-slate-500">Loading anomaly data…</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Signal Overview */}
            {dashboard?.signals && dashboard.signals.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Monitored Signals
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {dashboard.signals.map((signal) => (
                    <SignalCard
                      key={signal.signal}
                      signal={signal}
                      selected={selectedSignal === signal.signal}
                      onClick={() => setSelectedSignal(
                        selectedSignal === signal.signal ? null : signal.signal
                      )}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Anomaly List */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Detected Anomalies ({filteredAnomalies.length})
              </h3>

              {filteredAnomalies.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-400" />
                  <p className="text-sm">No anomalies detected matching your filter</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredAnomalies.map((anomaly) => (
                    <AnomalyCard
                      key={anomaly.id}
                      anomaly={anomaly}
                      expanded={expandedAnomaly === anomaly.id}
                      onToggle={() => setExpandedAnomaly(expandedAnomaly === anomaly.id ? null : anomaly.id)}
                      onAcknowledge={() => handleAcknowledge(anomaly.id)}
                      onFalsePositive={() => handleFalsePositive(anomaly.id)}
                    />
                  ))}
                </div>
              )}
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

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: typeof Signal;
  color: string;
}) {
  return (
    <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-neutral-800/50">
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
      </div>
      <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
    </div>
  );
}

function SignalCard({
  signal,
  selected,
  onClick,
}: {
  signal: SignalStats;
  selected: boolean;
  onClick: () => void;
}) {
  const deviation = signal.std > 0
    ? Math.abs(signal.lastValue - signal.mean) / signal.std
    : 0;
  const isHot = deviation > 2;

  return (
    <button
      onClick={onClick}
      className={`text-left p-3 rounded-lg border transition-all ${
        selected
          ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-300 dark:border-blue-500/30'
          : 'bg-slate-50 dark:bg-black/50 border-slate-200 dark:border-neutral-800/50 hover:border-slate-300 dark:hover:border-slate-600'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{signal.signal}</span>
        {isHot && <Zap className="w-3.5 h-3.5 text-amber-500" />}
      </div>
      <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
        <span>{signal.dataPoints} pts</span>
        <span>•</span>
        <span>{signal.anomalyCount} anomalies</span>
      </div>
      <div className="mt-1 text-xs">
        <span className="text-slate-500">Last: </span>
        <span className="font-mono text-slate-700 dark:text-slate-300">
          {signal.lastValue.toLocaleString()}
        </span>
      </div>
    </button>
  );
}

function AnomalyCard({
  anomaly,
  expanded,
  onToggle,
  onAcknowledge,
  onFalsePositive,
}: {
  anomaly: Anomaly;
  expanded: boolean;
  onToggle: () => void;
  onAcknowledge: () => void;
  onFalsePositive: () => void;
}) {
  const severity = SEVERITY_CONFIG[anomaly.severity];
  const SeverityIcon = severity.icon;

  return (
    <div className={`rounded-lg border overflow-hidden ${severity.border} ${anomaly.acknowledged ? 'opacity-60' : ''}`}>
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-3 p-3 ${severity.bg} hover:brightness-95 dark:hover:brightness-110 transition-all`}
      >
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-slate-400" />
        )}
        <SeverityIcon className={`w-4 h-4 ${severity.color} flex-shrink-0`} />
        <span className={`text-xs font-bold ${severity.color} w-16`}>{severity.label}</span>
        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{anomaly.signal}</span>
        <span className="text-sm font-mono text-slate-600 dark:text-slate-400 ml-auto">
          {anomaly.value.toLocaleString()}
        </span>
        <span className="text-xs text-slate-400">
          {new Date(anomaly.detectedAt).toLocaleTimeString()}
        </span>
        {anomaly.acknowledged && (
          <Eye className="w-3.5 h-3.5 text-slate-400" />
        )}
      </button>

      {expanded && (
        <div className="p-4 bg-white dark:bg-black/50 border-t border-slate-100 dark:border-neutral-800 space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-xs text-slate-400 block">Expected Range</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {anomaly.expectedRange.low.toLocaleString()} – {anomaly.expectedRange.high.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Fused Score</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {(anomaly.fusedScore * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Detection algorithms */}
          <div>
            <span className="text-xs text-slate-400 block mb-1">Detection Algorithms</span>
            <div className="flex flex-wrap gap-1">
              {anomaly.algorithms.map((algo) => (
                <span
                  key={algo}
                  className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-black text-slate-500 font-mono"
                >
                  {algo}
                </span>
              ))}
            </div>
          </div>

          {/* AI Interpretation */}
          {anomaly.interpretation && (
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-neutral-800/50">
              <span className="text-xs text-slate-400 block mb-1">AI Interpretation</span>
              <p className="text-sm text-slate-700 dark:text-slate-300">{anomaly.interpretation}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {!anomaly.acknowledged && (
              <button
                onClick={onAcknowledge}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 hover:bg-blue-100 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                Acknowledge
              </button>
            )}
            {!anomaly.falsePositive && (
              <button
                onClick={onFalsePositive}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-slate-50 dark:bg-black text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-neutral-800 hover:bg-slate-100 transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
                False Positive
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
