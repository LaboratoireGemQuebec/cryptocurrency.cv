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


import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  Globe,
  Users,
  Link2,
  Filter,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Loader2,
  RefreshCw,
  Info,
  ChevronRight,
  Building2,
  Coins,
  User,
  Scale,
  MapPin,
  Calendar,
  Lightbulb,
  TrendingUp,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

interface GraphEntity {
  id: string;
  name: string;
  type: string;
  mentions: number;
  avgConfidence: number;
  x?: number;
  y?: number;
}

interface GraphRelationship {
  source: string;
  target: string;
  type: string;
  strength: number;
  count: number;
}

interface GraphEvent {
  id: string;
  event: string;
  type: string;
  entities: string[];
  date?: string;
  significance: number;
}

interface KnowledgeGraphViewerProps {
  className?: string;
}

// ═══════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════

const ENTITY_TYPE_CONFIG: Record<string, { icon: typeof Globe; color: string; bg: string }> = {
  cryptocurrency: { icon: Coins, color: 'text-amber-500', bg: 'bg-amber-500' },
  exchange: { icon: Building2, color: 'text-blue-500', bg: 'bg-blue-500' },
  person: { icon: User, color: 'text-emerald-500', bg: 'bg-emerald-500' },
  organization: { icon: Building2, color: 'text-purple-500', bg: 'bg-purple-500' },
  protocol: { icon: Globe, color: 'text-cyan-500', bg: 'bg-cyan-500' },
  regulator: { icon: Scale, color: 'text-red-500', bg: 'bg-red-500' },
  location: { icon: MapPin, color: 'text-pink-500', bg: 'bg-pink-500' },
  event: { icon: Calendar, color: 'text-orange-500', bg: 'bg-orange-500' },
  concept: { icon: Lightbulb, color: 'text-indigo-500', bg: 'bg-indigo-500' },
  metric: { icon: TrendingUp, color: 'text-teal-500', bg: 'bg-teal-500' },
};

const DEFAULT_CONFIG = ENTITY_TYPE_CONFIG.cryptocurrency;

const RELATIONSHIP_COLORS: Record<string, string> = {
  partnership: '#22c55e',
  investment: '#3b82f6',
  regulation: '#ef4444',
  competition: '#f59e0b',
  acquisition: '#8b5cf6',
  integration: '#06b6d4',
  lawsuit: '#dc2626',
  adoption: '#10b981',
};

// ═══════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════

export function KnowledgeGraphViewer({ className = '' }: KnowledgeGraphViewerProps) {
  const [entities, setEntities] = useState<GraphEntity[]>([]);
  const [relationships, setRelationships] = useState<GraphRelationship[]>([]);
  const [events, setEvents] = useState<GraphEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<GraphEntity | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'graph' | 'entities' | 'events'>('graph');
  const canvasRef = useRef<HTMLDivElement>(null);

  const fetchGraph = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [entitiesRes, relationshipsRes, eventsRes] = await Promise.all([
        fetch('/api/ai/entities/extract?action=aggregate-entities&topN=50'),
        fetch('/api/ai/entities/extract?action=aggregate-relationships'),
        fetch('/api/ai/entities/extract?action=aggregate-events'),
      ]);

      const [entitiesData, relationshipsData, eventsData] = await Promise.all([
        entitiesRes.json(),
        relationshipsRes.json(),
        eventsRes.json(),
      ]);

      if (entitiesRes.ok && entitiesData.entities) {
        // Assign positions using force-directed-ish layout
        const positioned = layoutEntities(entitiesData.entities);
        setEntities(positioned);
      }

      if (relationshipsRes.ok && relationshipsData.relationships) {
        setRelationships(relationshipsData.relationships);
      }

      if (eventsRes.ok && eventsData.events) {
        setEvents(eventsData.events);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load knowledge graph');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGraph();
  }, [fetchGraph]);

  // Filter entities by type
  const filteredEntities = useMemo(() => {
    if (!filterType) return entities;
    return entities.filter((e) => e.type === filterType);
  }, [entities, filterType]);

  const filteredRelationships = useMemo(() => {
    const entityIds = new Set(filteredEntities.map((e) => e.id));
    return relationships.filter((r) => entityIds.has(r.source) && entityIds.has(r.target));
  }, [relationships, filteredEntities]);

  // Entity types present in data
  const entityTypes = useMemo(() => {
    const types = new Map<string, number>();
    entities.forEach((e) => types.set(e.type, (types.get(e.type) || 0) + 1));
    return Array.from(types.entries()).sort((a, b) => b[1] - a[1]);
  }, [entities]);

  // Selected entity relationships
  const selectedRelationships = useMemo(() => {
    if (!selectedEntity) return [];
    return relationships.filter(
      (r) => r.source === selectedEntity.id || r.target === selectedEntity.id
    );
  }, [selectedEntity, relationships]);

  return (
    <div className={`bg-white dark:bg-black/80 rounded-2xl shadow-xl border border-slate-200 dark:border-neutral-800/50 ${className}`}>
      {/* ── Header ── */}
      <div className="p-6 border-b border-slate-200 dark:border-neutral-800/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Knowledge Graph</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {entities.length} entities • {relationships.length} relationships • {events.length} events
              </p>
            </div>
          </div>
          <button
            onClick={fetchGraph}
            disabled={isLoading}
            className="p-2 rounded-lg bg-slate-100 dark:bg-black text-slate-500"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-3">
          {(['graph', 'entities', 'events'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                tab === t
                  ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
                  : 'bg-slate-100 dark:bg-black text-slate-600 dark:text-slate-400 border border-transparent'
              }`}
            >
              {t === 'graph' && <Globe className="w-3.5 h-3.5" />}
              {t === 'entities' && <Users className="w-3.5 h-3.5" />}
              {t === 'events' && <Calendar className="w-3.5 h-3.5" />}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Type Filter */}
        {entityTypes.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilterType(null)}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                !filterType
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  : 'bg-slate-100 dark:bg-black text-slate-500 border border-transparent'
              }`}
            >
              All ({entities.length})
            </button>
            {entityTypes.map(([type, count]) => {
              const config = ENTITY_TYPE_CONFIG[type] || DEFAULT_CONFIG;
              return (
                <button
                  key={type}
                  onClick={() => setFilterType(filterType === type ? null : type)}
                  className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition-all ${
                    filterType === type
                      ? `${config.color} bg-opacity-20 border border-current`
                      : 'bg-slate-100 dark:bg-black text-slate-500 border border-transparent'
                  }`}
                >
                  {type} ({count})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="p-6">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <span className="text-sm text-slate-500">Loading knowledge graph…</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 text-sm">
            {error}
          </div>
        )}

        {!isLoading && !error && tab === 'graph' && (
          <div>
            {/* SVG Graph View */}
            <div
              ref={canvasRef}
              className="relative w-full bg-slate-50 dark:bg-black/30 rounded-xl border border-slate-200 dark:border-neutral-800/50 overflow-hidden"
              style={{ height: 500 }}
            >
              <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${800 / zoom} ${500 / zoom}`}
                className="select-none"
              >
                {/* Relationship lines */}
                {filteredRelationships.map((rel, i) => {
                  const source = filteredEntities.find((e) => e.id === rel.source);
                  const target = filteredEntities.find((e) => e.id === rel.target);
                  if (!source?.x || !target?.x) return null;
                  const color = RELATIONSHIP_COLORS[rel.type] || '#64748b';
                  return (
                    <line
                      key={`rel-${i}`}
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={color}
                      strokeWidth={Math.max(1, rel.strength * 3)}
                      strokeOpacity={0.4}
                    />
                  );
                })}

                {/* Entity nodes */}
                {filteredEntities.map((entity) => {
                  if (!entity.x || !entity.y) return null;
                  const config = ENTITY_TYPE_CONFIG[entity.type] || DEFAULT_CONFIG;
                  const radius = Math.max(6, Math.min(20, entity.mentions * 2));
                  const isSelected = selectedEntity?.id === entity.id;
                  return (
                    <g
                      key={entity.id}
                      onClick={() => setSelectedEntity(isSelected ? null : entity)}
                      className="cursor-pointer"
                    >
                      {isSelected && (
                        <circle
                          cx={entity.x}
                          cy={entity.y}
                          r={radius + 4}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          className="text-indigo-500 animate-pulse"
                        />
                      )}
                      <circle
                        cx={entity.x}
                        cy={entity.y}
                        r={radius}
                        className={config.bg}
                        fillOpacity={0.8}
                      />
                      <text
                        x={entity.x}
                        y={entity.y + radius + 12}
                        textAnchor="middle"
                        className="fill-slate-600 dark:fill-slate-400 text-[10px]"
                      >
                        {entity.name.length > 12 ? entity.name.slice(0, 12) + '…' : entity.name}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Zoom controls */}
              <div className="absolute bottom-3 right-3 flex gap-1">
                <button
                  onClick={() => setZoom((z) => Math.min(3, z + 0.2))}
                  className="p-1.5 rounded bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 text-slate-600 shadow-sm"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoom((z) => Math.max(0.3, z - 0.2))}
                  className="p-1.5 rounded bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 text-slate-600 shadow-sm"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoom(1)}
                  className="p-1.5 rounded bg-white dark:bg-black border border-slate-200 dark:border-neutral-800 text-slate-600 shadow-sm"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Legend */}
              <div className="absolute top-3 left-3 p-2 rounded-lg bg-white/90 dark:bg-black/90 border border-slate-200 dark:border-neutral-800 text-xs space-y-1">
                {Object.entries(RELATIONSHIP_COLORS).slice(0, 5).map(([type, color]) => (
                  <div key={type} className="flex items-center gap-1.5">
                    <div className="w-3 h-0.5 rounded" style={{ backgroundColor: color }} />
                    <span className="text-slate-500 capitalize">{type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Entity Detail */}
            {selectedEntity && (
              <SelectedEntityDetail
                entity={selectedEntity}
                relationships={selectedRelationships}
                entities={entities}
              />
            )}
          </div>
        )}

        {/* Entity List Tab */}
        {!isLoading && !error && tab === 'entities' && (
          <div className="space-y-2">
            {filteredEntities.map((entity) => {
              const config = ENTITY_TYPE_CONFIG[entity.type] || DEFAULT_CONFIG;
              const Icon = config.icon;
              return (
                <button
                  key={entity.id}
                  onClick={() => { setSelectedEntity(entity); setTab('graph'); }}
                  className="w-full text-left flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-neutral-800/50 hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-all"
                >
                  <div className={`p-1.5 rounded ${config.color} bg-opacity-10`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{entity.name}</div>
                    <div className="text-xs text-slate-400 capitalize">{entity.type}</div>
                  </div>
                  <span className="text-xs text-slate-400">{entity.mentions} mentions</span>
                  <span className="text-xs font-mono text-slate-500">
                    {Math.round(entity.avgConfidence * 100)}%
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </button>
              );
            })}
          </div>
        )}

        {/* Events Tab */}
        {!isLoading && !error && tab === 'events' && (
          <div className="space-y-2">
            {events.map((event) => (
              <div
                key={event.id}
                className="p-3 rounded-lg bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-neutral-800/50"
              >
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-orange-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{event.event}</div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <span className="capitalize">{event.type}</span>
                      {event.date && (
                        <>
                          <span>•</span>
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>Significance: {Math.round(event.significance * 100)}%</span>
                    </div>
                    {event.entities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {event.entities.map((eid) => (
                          <span
                            key={eid}
                            className="text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-black text-slate-500"
                          >
                            {entities.find((e) => e.id === eid)?.name || eid}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-sm">
                No events extracted yet. Run entity extraction on articles first.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════════════════════════════

function SelectedEntityDetail({
  entity,
  relationships,
  entities,
}: {
  entity: GraphEntity;
  relationships: GraphRelationship[];
  entities: GraphEntity[];
}) {
  const config = ENTITY_TYPE_CONFIG[entity.type] || DEFAULT_CONFIG;
  const Icon = config.icon;

  return (
    <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-black/50 border border-indigo-200 dark:border-indigo-500/20">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${config.color} bg-opacity-10`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">{entity.name}</h3>
          <div className="text-xs text-slate-400 capitalize">
            {entity.type} • {entity.mentions} mentions • {Math.round(entity.avgConfidence * 100)}% confidence
          </div>
        </div>
      </div>

      {relationships.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Relationships ({relationships.length})
          </h4>
          <div className="space-y-1">
            {relationships.map((rel, i) => {
              const other = rel.source === entity.id
                ? entities.find((e) => e.id === rel.target)
                : entities.find((e) => e.id === rel.source);
              const color = RELATIONSHIP_COLORS[rel.type] || '#64748b';

              return (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-slate-500 capitalize text-xs w-24">{rel.type}</span>
                  <Link2 className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-700 dark:text-slate-300">{other?.name || 'Unknown'}</span>
                  <span className="text-xs text-slate-400 ml-auto">×{rel.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Layout helper
// ═══════════════════════════════════════════════════════════════

function layoutEntities(entities: GraphEntity[]): GraphEntity[] {
  const width = 800;
  const height = 500;
  const padding = 40;

  return entities.map((entity, i) => {
    // Spiral layout based on index, with jitter
    const angle = i * 0.7;
    const radius = 40 + i * 8;
    const x = width / 2 + Math.cos(angle) * Math.min(radius, width / 2 - padding);
    const y = height / 2 + Math.sin(angle) * Math.min(radius, height / 2 - padding);

    return {
      ...entity,
      x: Math.max(padding, Math.min(width - padding, x)),
      y: Math.max(padding, Math.min(height - padding, y)),
    };
  });
}
