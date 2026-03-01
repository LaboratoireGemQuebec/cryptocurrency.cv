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


import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Brain,
  Search,
  Loader2,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  AlertTriangle,
  BookOpen,
  Clock,
  Zap,
  Activity,
  CheckCircle2,
  XCircle,
  Users,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

interface AgentResult {
  agentId: string;
  role: string;
  finding: string;
  confidence: number;
  sources: string[];
  durationMs: number;
}

interface ResearchReport {
  id: string;
  query: string;
  depth: 'flash' | 'standard' | 'deep' | 'exhaustive';
  status: 'planning' | 'researching' | 'synthesizing' | 'critiquing' | 'complete' | 'error';
  plan?: { wave: number; agents: string[] }[];
  agentResults: AgentResult[];
  synthesis?: string;
  keyInsights?: string[];
  blindSpots?: string[];
  followUpQuestions?: string[];
  confidenceScore?: number;
  totalDurationMs?: number;
  error?: string;
}

interface ResearchAgentDashboardProps {
  className?: string;
}

// ═══════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════

const DEPTH_OPTIONS = [
  { value: 'flash', label: 'Flash', description: '~5s, quick answers', icon: Zap },
  { value: 'standard', label: 'Standard', description: '~15s, balanced', icon: Search },
  { value: 'deep', label: 'Deep', description: '~30s, thorough', icon: Brain },
  { value: 'exhaustive', label: 'Exhaustive', description: '~60s, comprehensive', icon: BookOpen },
] as const;

const ROLE_COLORS: Record<string, string> = {
  analyst: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  researcher: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  contrarian: 'bg-red-500/20 text-red-400 border-red-500/30',
  historian: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  technician: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  fundamentals: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  sentiment: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  regulatory: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  onchain: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  synthesizer: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Brain }> = {
  planning: { label: 'Planning Research', color: 'text-yellow-400', icon: Lightbulb },
  researching: { label: 'Agents Working', color: 'text-blue-400', icon: Activity },
  synthesizing: { label: 'Synthesizing', color: 'text-purple-400', icon: Brain },
  critiquing: { label: 'Self-Critique', color: 'text-orange-400', icon: AlertTriangle },
  complete: { label: 'Complete', color: 'text-emerald-400', icon: CheckCircle2 },
  error: { label: 'Error', color: 'text-red-400', icon: XCircle },
};

// ═══════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════

export function ResearchAgentDashboard({ className = '' }: ResearchAgentDashboardProps) {
  const [query, setQuery] = useState('');
  const [depth, setDepth] = useState<'flash' | 'standard' | 'deep' | 'exhaustive'>('standard');
  const [report, setReport] = useState<ResearchReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedAgents, setExpandedAgents] = useState<Set<string>>(new Set());
  const [history, setHistory] = useState<ResearchReport[]>([]);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startResearch = useCallback(async () => {
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setReport({ id: '', query, depth, status: 'planning', agentResults: [] });

    try {
      const res = await fetch('/api/ai/agent/orchestrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim(), depth }),
      });

      const data = await res.json();

      if (!res.ok) {
        setReport((prev) => prev ? { ...prev, status: 'error', error: data.error || 'Research failed' } : null);
        return;
      }

      const finalReport: ResearchReport = {
        id: data.result?.id || crypto.randomUUID(),
        query,
        depth,
        status: 'complete',
        agentResults: data.result?.agentResults || [],
        synthesis: data.result?.synthesis || data.result?.answer,
        keyInsights: data.result?.keyInsights || [],
        blindSpots: data.result?.blindSpots || [],
        followUpQuestions: data.result?.followUpQuestions || [],
        confidenceScore: data.result?.confidenceScore,
        totalDurationMs: data.durationMs,
      };

      setReport(finalReport);
      setHistory((prev) => [finalReport, ...prev].slice(0, 10));
    } catch (error) {
      setReport((prev) =>
        prev ? { ...prev, status: 'error', error: error instanceof Error ? error.message : 'Network error' } : null
      );
    } finally {
      setIsLoading(false);
    }
  }, [query, depth, isLoading]);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const toggleAgent = (agentId: string) => {
    setExpandedAgents((prev) => {
      const next = new Set(prev);
      if (next.has(agentId)) next.delete(agentId);
      else next.add(agentId);
      return next;
    });
  };

  return (
    <div className={`bg-white dark:bg-black/80 rounded-2xl shadow-xl border border-slate-200 dark:border-neutral-800/50 ${className}`}>
      {/* ── Header ── */}
      <div className="p-6 border-b border-slate-200 dark:border-neutral-800/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Multi-Agent Research</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">10 specialized AI agents collaborate to research any crypto topic</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && startResearch()}
              placeholder="Ask anything about crypto… e.g., 'What's the impact of spot ETH ETFs on DeFi?'"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-black border border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
            />
          </div>
          <button
            onClick={startResearch}
            disabled={isLoading || !query.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5" />}
            Research
          </button>
        </div>

        {/* Depth Selector */}
        <div className="flex gap-2 mt-3">
          {DEPTH_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.value}
                onClick={() => setDepth(opt.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  depth === opt.value
                    ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                    : 'bg-slate-100 dark:bg-black text-slate-600 dark:text-slate-400 border border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Report ── */}
      {report && (
        <div className="p-6 space-y-6">
          {/* Status Banner */}
          <StatusBanner report={report} />

          {/* Agent Results */}
          {report.agentResults.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Agent Findings ({report.agentResults.length})
              </h3>
              <div className="space-y-2">
                {report.agentResults.map((agent) => (
                  <AgentCard
                    key={agent.agentId}
                    agent={agent}
                    expanded={expandedAgents.has(agent.agentId)}
                    onToggle={() => toggleAgent(agent.agentId)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Synthesis */}
          {report.synthesis && (
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 rounded-xl p-5 border border-slate-200 dark:border-neutral-800/50">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Synthesized Answer
              </h3>
              <div className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                {report.synthesis}
              </div>
            </div>
          )}

          {/* Key Insights */}
          {report.keyInsights && report.keyInsights.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Key Insights
              </h3>
              <div className="grid gap-2">
                {report.keyInsights.map((insight, i) => (
                  <div key={i} className="flex gap-3 items-start p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="text-sm text-slate-700 dark:text-slate-300">{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Blind Spots */}
          {report.blindSpots && report.blindSpots.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Blind Spots &amp; Caveats
              </h3>
              <ul className="space-y-1">
                {report.blindSpots.map((spot, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <span className="text-amber-500">•</span>
                    {spot}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Follow-up Questions */}
          {report.followUpQuestions && report.followUpQuestions.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">
                Follow-up Questions
              </h3>
              <div className="flex flex-wrap gap-2">
                {report.followUpQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => { setQuery(q); }}
                    className="px-3 py-1.5 text-sm rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Confidence + Duration */}
          {report.status === 'complete' && (
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-neutral-800/50">
              {report.confidenceScore !== undefined && (
                <span className="flex items-center gap-1">
                  Confidence: <ConfidenceBadge score={report.confidenceScore} />
                </span>
              )}
              {report.totalDurationMs !== undefined && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {(report.totalDurationMs / 1000).toFixed(1)}s
                </span>
              )}
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {report.agentResults.length} agents
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── History ── */}
      {history.length > 1 && (
        <div className="p-6 border-t border-slate-200 dark:border-neutral-800/50">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Recent Research
          </h3>
          <div className="space-y-2">
            {history.slice(1).map((r) => (
              <button
                key={r.id}
                onClick={() => { setReport(r); setQuery(r.query); }}
                className="w-full text-left p-3 rounded-lg bg-slate-50 dark:bg-black/50 hover:bg-slate-100 dark:hover:bg-neutral-900 border border-slate-200 dark:border-neutral-800/50 transition-colors"
              >
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{r.query}</div>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <span className="capitalize">{r.depth}</span>
                  <span>•</span>
                  <span>{r.agentResults.length} agents</span>
                  {r.totalDurationMs && (
                    <>
                      <span>•</span>
                      <span>{(r.totalDurationMs / 1000).toFixed(1)}s</span>
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════════════════════════════

function StatusBanner({ report }: { report: ResearchReport }) {
  const config = STATUS_CONFIG[report.status] || STATUS_CONFIG.error;
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl ${
      report.status === 'complete'
        ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20'
        : report.status === 'error'
        ? 'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20'
        : 'bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20'
    }`}>
      {report.status !== 'complete' && report.status !== 'error' ? (
        <Loader2 className={`w-5 h-5 animate-spin ${config.color}`} />
      ) : (
        <Icon className={`w-5 h-5 ${config.color}`} />
      )}
      <span className={`font-medium ${config.color}`}>{config.label}</span>
      {report.error && <span className="text-sm text-red-500 ml-2">{report.error}</span>}

      {/* Progress indicators for in-progress states */}
      {report.plan && report.status === 'researching' && (
        <div className="ml-auto flex gap-1">
          {report.plan.map((wave, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i < report.agentResults.length / (report.plan?.[0]?.agents.length || 1)
                  ? 'bg-blue-500'
                  : 'bg-slate-300 dark:bg-black'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AgentCard({
  agent,
  expanded,
  onToggle,
}: {
  agent: AgentResult;
  expanded: boolean;
  onToggle: () => void;
}) {
  const colorClass = ROLE_COLORS[agent.role] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';

  return (
    <div className="rounded-lg border border-slate-200 dark:border-neutral-800/50 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-neutral-900/50 transition-colors"
      >
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
        )}
        <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${colorClass} capitalize`}>
          {agent.role}
        </span>
        <span className="text-sm text-slate-700 dark:text-slate-300 truncate flex-1 text-left">
          {agent.finding.split('\n')[0].slice(0, 80)}
          {agent.finding.length > 80 ? '…' : ''}
        </span>
        <ConfidenceBadge score={agent.confidence} />
        <span className="text-xs text-slate-400">{agent.durationMs}ms</span>
      </button>
      {expanded && (
        <div className="px-10 pb-3 text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap border-t border-slate-100 dark:border-neutral-800 pt-3">
          {agent.finding}
          {agent.sources.length > 0 && (
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-neutral-800">
              <span className="text-xs text-slate-400 font-medium">Sources:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {agent.sources.map((src, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-black text-slate-500">
                    {src}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ConfidenceBadge({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color =
    pct >= 80
      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
      : pct >= 60
      ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10'
      : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10';

  return <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${color}`}>{pct}%</span>;
}
