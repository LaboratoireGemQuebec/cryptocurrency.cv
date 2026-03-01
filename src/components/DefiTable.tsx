"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export interface DefiProtocol {
  id: string;
  name: string;
  slug: string;
  chain: string;
  chains: string[];
  category: string;
  tvl: number;
  tvlChange24h: number;
  logo?: string;
  url?: string;
}

type SortKey = "tvl" | "tvlChange24h" | "name" | "category";
type SortDir = "asc" | "desc";

const CHAIN_COLORS: Record<string, string> = {
  Ethereum: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  BSC: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  Solana: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  Arbitrum: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  Polygon: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  Avalanche: "bg-red-500/15 text-red-400 border-red-500/30",
  Optimism: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  Base: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  Fantom: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  Tron: "bg-red-500/15 text-red-300 border-red-500/30",
};

function getChainColor(chain: string): string {
  return CHAIN_COLORS[chain] ?? "bg-gray-500/15 text-gray-400 border-gray-500/30";
}

function formatTvl(value: number): string {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

function formatPercentage(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

const SORT_ICON_UP = "↑";
const SORT_ICON_DOWN = "↓";

export default function DefiTable({ protocols }: { protocols: DefiProtocol[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("tvl");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(() => {
    const copy = [...protocols];
    copy.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "tvl":
          cmp = a.tvl - b.tvl;
          break;
        case "tvlChange24h":
          cmp = a.tvlChange24h - b.tvlChange24h;
          break;
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "category":
          cmp = a.category.localeCompare(b.category);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [protocols, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "name" || key === "category" ? "asc" : "desc");
    }
  }

  function SortHeader({ label, colKey }: { label: string; colKey: SortKey }) {
    const active = sortKey === colKey;
    return (
      <button
        onClick={() => handleSort(colKey)}
        className={cn(
          "flex items-center gap-1 text-xs font-semibold uppercase tracking-wider transition-colors",
          active
            ? "text-[var(--color-accent)]"
            : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
        )}
      >
        {label}
        {active && (
          <span className="text-[10px]">
            {sortDir === "asc" ? SORT_ICON_UP : SORT_ICON_DOWN}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            <th className="px-4 py-3 text-left w-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                #
              </span>
            </th>
            <th className="px-4 py-3 text-left">
              <SortHeader label="Protocol" colKey="name" />
            </th>
            <th className="px-4 py-3 text-left hidden md:table-cell">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                Chain(s)
              </span>
            </th>
            <th className="px-4 py-3 text-right">
              <SortHeader label="TVL" colKey="tvl" />
            </th>
            <th className="px-4 py-3 text-right hidden sm:table-cell">
              <SortHeader label="24h Change" colKey="tvlChange24h" />
            </th>
            <th className="px-4 py-3 text-left hidden lg:table-cell">
              <SortHeader label="Category" colKey="category" />
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((protocol, i) => (
            <tr
              key={protocol.id}
              className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-hover)] transition-colors"
            >
              <td className="px-4 py-3 text-[var(--color-text-tertiary)] tabular-nums font-medium">
                {i + 1}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {protocol.logo && (
                    <img
                      src={protocol.logo}
                      alt={protocol.name}
                      className="w-6 h-6 rounded-full"
                      loading="lazy"
                    />
                  )}
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    {protocol.name}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                <div className="flex flex-wrap gap-1">
                  {protocol.chains.slice(0, 3).map((chain) => (
                    <span
                      key={chain}
                      className={cn(
                        "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border",
                        getChainColor(chain)
                      )}
                    >
                      {chain}
                    </span>
                  ))}
                  {protocol.chains.length > 3 && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border bg-gray-500/15 text-gray-400 border-gray-500/30">
                      +{protocol.chains.length - 3}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-right font-semibold tabular-nums text-[var(--color-text-primary)]">
                {formatTvl(protocol.tvl)}
              </td>
              <td className="px-4 py-3 text-right hidden sm:table-cell tabular-nums font-medium">
                <span
                  className={cn(
                    protocol.tvlChange24h >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  )}
                >
                  {formatPercentage(protocol.tvlChange24h)}
                </span>
              </td>
              <td className="px-4 py-3 hidden lg:table-cell">
                <Badge variant="defi" className="text-xs">
                  {protocol.category}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
