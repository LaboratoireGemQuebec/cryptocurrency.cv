"use client";

import { useState, useMemo } from "react";
import { Badge, categoryToBadgeVariant } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { SourceInfo } from "@/lib/crypto-news";

interface SourcesGridProps {
  sources: SourceInfo[];
}

const ALL_CATEGORY = "all";

export default function SourcesGrid({ sources }: SourcesGridProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);

  // Derive unique sorted categories
  const categories = useMemo(() => {
    const cats = new Set(sources.map((s) => s.category || "other"));
    return Array.from(cats).sort();
  }, [sources]);

  // Filter sources by search + category
  const filtered = useMemo(() => {
    let result = sources;
    if (activeCategory !== ALL_CATEGORY) {
      result = result.filter(
        (s) => (s.category || "other") === activeCategory
      );
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.url.toLowerCase().includes(q) ||
          s.key.toLowerCase().includes(q)
      );
    }
    return result;
  }, [sources, activeCategory, search]);

  // Group filtered sources by category
  const grouped = useMemo(() => {
    const map: Record<string, SourceInfo[]> = {};
    for (const s of filtered) {
      const cat = s.category || "other";
      if (!map[cat]) map[cat] = [];
      map[cat].push(s);
    }
    return map;
  }, [filtered]);

  const sortedGroups = Object.keys(grouped).sort();

  return (
    <div>
      {/* Search + Filter Bar */}
      <div className="mb-8 space-y-4">
        {/* Search Input */}
        <div className="relative max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-tertiary)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search sources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 pl-10 pr-4 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-colors"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(ALL_CATEGORY)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors border",
              activeCategory === ALL_CATEGORY
                ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                : "bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-border-hover)]"
            )}
          >
            All ({sources.length})
          </button>
          {categories.map((cat) => {
            const count = sources.filter(
              (s) => (s.category || "other") === cat
            ).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors capitalize border",
                  activeCategory === cat
                    ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
                    : "bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-border-hover)]"
                )}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-[var(--color-text-tertiary)] mb-6">
        Showing {filtered.length} of {sources.length} sources
      </p>

      {/* Sources Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-[var(--color-text-tertiary)] text-lg">
            No sources match your search.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setActiveCategory(ALL_CATEGORY);
            }}
            className="mt-3 text-sm text-[var(--color-accent)] hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {sortedGroups.map((cat) => (
            <section key={cat}>
              <h2 className="font-serif text-xl font-bold mb-4 text-[var(--color-text-primary)] capitalize flex items-center gap-2">
                {cat}
                <span className="text-sm font-normal text-[var(--color-text-tertiary)]">
                  ({grouped[cat].length})
                </span>
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {grouped[cat].map((source) => (
                  <SourceCard key={source.key} source={source} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function SourceCard({ source }: { source: SourceInfo }) {
  const domain = (() => {
    try {
      return new URL(
        source.url.startsWith("http") ? source.url : `https://${source.url}`
      ).hostname;
    } catch {
      return source.url;
    }
  })();

  const href = source.url.startsWith("http")
    ? source.url
    : `https://${source.url}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 transition-all hover:border-[var(--color-border-hover)] hover:shadow-md"
    >
      {/* Favicon */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
        alt=""
        width={20}
        height={20}
        className="mt-0.5 shrink-0 rounded"
        loading="lazy"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {/* Status indicator */}
          <span
            className={cn(
              "h-2 w-2 shrink-0 rounded-full",
              source.status === "active"
                ? "bg-green-500"
                : source.status === "unavailable"
                  ? "bg-red-500"
                  : "bg-yellow-500"
            )}
          />
          <p className="text-sm font-medium text-[var(--color-text-primary)] truncate group-hover:text-[var(--color-accent)] transition-colors">
            {source.name}
          </p>
        </div>
        <p className="text-xs text-[var(--color-text-tertiary)] truncate mt-0.5">
          {domain}
        </p>
      </div>

      {/* Category Badge */}
      <Badge
        variant={categoryToBadgeVariant(source.category)}
        className="shrink-0 mt-0.5"
      >
        {source.category}
      </Badge>

      {/* External link icon */}
      <svg
        className="h-3.5 w-3.5 shrink-0 mt-1 text-[var(--color-text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </a>
  );
}
