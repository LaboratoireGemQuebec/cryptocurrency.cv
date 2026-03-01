"use client";

import { useCallback, useMemo, useState } from "react";
import { Pencil, Plus, Trash2, Wallet, X, Check } from "lucide-react";
import { usePortfolio, type Holding } from "@/components/portfolio";
import { AddHoldingModal } from "@/components/AddHoldingModal";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function fmtUsd(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtPct(n: number): string {
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}

function pnlColor(v: number): string {
  if (v > 0) return "text-green-500";
  if (v < 0) return "text-red-500";
  return "";
}

/* ------------------------------------------------------------------ */
/*  Allocation Donut Chart (pure CSS conic-gradient)                   */
/* ------------------------------------------------------------------ */

interface Slice {
  label: string;
  value: number;
  pct: number;
  color: string;
}

const CHART_COLORS = [
  "#f59e0b", "#3b82f6", "#8b5cf6", "#10b981", "#ef4444",
  "#ec4899", "#06b6d4", "#f97316", "#6366f1", "#14b8a6",
];

function AllocationChart({ holdings, prices }: { holdings: Holding[]; prices: Record<string, { usd: number }> }) {
  const slices = useMemo<Slice[]>(() => {
    const totals: Record<string, { label: string; value: number }> = {};
    for (const h of holdings) {
      const price = prices[h.coinId]?.usd ?? h.buyPrice;
      const value = h.amount * price;
      if (!totals[h.coinId]) {
        totals[h.coinId] = { label: h.symbol, value: 0 };
      }
      totals[h.coinId].value += value;
    }
    const entries = Object.values(totals).sort((a, b) => b.value - a.value);
    const total = entries.reduce((s, e) => s + e.value, 0);
    if (total === 0) return [];
    return entries.map((e, i) => ({
      label: e.label,
      value: e.value,
      pct: (e.value / total) * 100,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }));
  }, [holdings, prices]);

  if (slices.length === 0) return null;

  /* build conic-gradient stops */
  let cumulative = 0;
  const stops = slices.map((s) => {
    const start = cumulative;
    cumulative += s.pct;
    return `${s.color} ${start}% ${cumulative}%`;
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative h-40 w-40 rounded-full"
        style={{
          background: `conic-gradient(${stops.join(", ")})`,
        }}
      >
        {/* inner circle for donut effect */}
        <div className="absolute inset-4 rounded-full bg-[var(--color-surface)]" />
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
        {slices.map((s) => (
          <span key={s.label} className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
            {s.label} {s.pct.toFixed(1)}%
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Inline Edit Row                                                    */
/* ------------------------------------------------------------------ */

function HoldingRow({ holding, currentPrice }: { holding: Holding; currentPrice: number }) {
  const { removeHolding, updateHolding } = usePortfolio();
  const [editing, setEditing] = useState(false);
  const [editAmount, setEditAmount] = useState(String(holding.amount));
  const [editBuyPrice, setEditBuyPrice] = useState(String(holding.buyPrice));
  const [confirmDelete, setConfirmDelete] = useState(false);

  const value = holding.amount * currentPrice;
  const cost = holding.amount * holding.buyPrice;
  const pnlDollar = value - cost;
  const pnlPct = cost > 0 ? (pnlDollar / cost) * 100 : 0;

  const handleSave = useCallback(() => {
    const a = parseFloat(editAmount);
    const p = parseFloat(editBuyPrice);
    if (!Number.isNaN(a) && a > 0 && !Number.isNaN(p) && p > 0) {
      updateHolding(holding.id, { amount: a, buyPrice: p });
    }
    setEditing(false);
  }, [editAmount, editBuyPrice, holding.id, updateHolding]);

  const handleCancelEdit = useCallback(() => {
    setEditAmount(String(holding.amount));
    setEditBuyPrice(String(holding.buyPrice));
    setEditing(false);
  }, [holding.amount, holding.buyPrice]);

  return (
    <tr className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface-secondary)] transition-colors">
      {/* Coin */}
      <td className="px-4 py-3 font-medium">
        <span>{holding.coinName}</span>
        <span className="ml-1.5 text-xs text-[var(--color-text-secondary)]">{holding.symbol}</span>
      </td>

      {/* Amount */}
      <td className="px-4 py-3 text-right tabular-nums">
        {editing ? (
          <input
            type="number"
            step="any"
            min="0"
            value={editAmount}
            onChange={(e) => setEditAmount(e.target.value)}
            className="w-24 rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
        ) : (
          holding.amount.toLocaleString("en-US", { maximumFractionDigits: 8 })
        )}
      </td>

      {/* Avg Buy Price */}
      <td className="px-4 py-3 text-right tabular-nums">
        {editing ? (
          <input
            type="number"
            step="any"
            min="0"
            value={editBuyPrice}
            onChange={(e) => setEditBuyPrice(e.target.value)}
            className="w-28 rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-sm text-right focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
        ) : (
          fmtUsd(holding.buyPrice)
        )}
      </td>

      {/* Current Price */}
      <td className="px-4 py-3 text-right tabular-nums">{fmtUsd(currentPrice)}</td>

      {/* Value */}
      <td className="px-4 py-3 text-right tabular-nums font-medium">{fmtUsd(value)}</td>

      {/* P&L ($) */}
      <td className={cn("px-4 py-3 text-right tabular-nums font-medium", pnlColor(pnlDollar))}>
        {pnlDollar >= 0 ? "+" : ""}{fmtUsd(pnlDollar)}
      </td>

      {/* P&L (%) */}
      <td className={cn("px-4 py-3 text-right tabular-nums font-medium", pnlColor(pnlPct))}>
        {fmtPct(pnlPct)}
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          {editing ? (
            <>
              <button onClick={handleSave} className="rounded p-1.5 hover:bg-green-500/10 text-green-500 transition-colors" title="Save">
                <Check className="h-4 w-4" />
              </button>
              <button onClick={handleCancelEdit} className="rounded p-1.5 hover:bg-[var(--color-surface-secondary)] transition-colors" title="Cancel">
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="rounded p-1.5 hover:bg-[var(--color-surface-secondary)] transition-colors"
                title="Edit"
              >
                <Pencil className="h-4 w-4" />
              </button>
              {confirmDelete ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => removeHolding(holding.id)}
                    className="rounded p-1.5 hover:bg-red-500/10 text-red-500 transition-colors text-xs font-medium"
                    title="Confirm delete"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="rounded p-1.5 hover:bg-[var(--color-surface-secondary)] transition-colors"
                    title="Cancel"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="rounded p-1.5 hover:bg-red-500/10 text-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty State                                                        */
/* ------------------------------------------------------------------ */

function EmptyState() {
  const { addHolding } = usePortfolio();

  const quickCoins = [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
    { id: "ethereum", name: "Ethereum", symbol: "ETH" },
    { id: "solana", name: "Solana", symbol: "SOL" },
  ] as const;

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Wallet className="h-16 w-16 text-[var(--color-text-secondary)] mb-4" />
      <h2 className="text-xl font-bold mb-2">Start tracking your portfolio</h2>
      <p className="text-[var(--color-text-secondary)] max-w-md mb-6">
        Add your crypto holdings to track performance, P&amp;L, and allocation in real time.
      </p>

      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {quickCoins.map((c) => (
          <Button
            key={c.id}
            variant="outline"
            size="sm"
            onClick={() => addHolding(c.id, c.name, c.symbol, 1, 0)}
          >
            <Plus className="h-3.5 w-3.5" />
            {c.symbol}
          </Button>
        ))}
      </div>

      <AddHoldingModal />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PortfolioPage() {
  const { holdings, prices, totalValue, totalCost, totalPnL, totalPnLPercent } = usePortfolio();

  if (holdings.length === 0) {
    return (
      <main className="container-main py-8">
        <h1 className="font-serif text-3xl font-bold mb-6">Portfolio</h1>
        <EmptyState />
      </main>
    );
  }

  return (
    <main className="container-main py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold">Portfolio</h1>
        <AddHoldingModal />
      </div>

      {/* ── Dashboard ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Value */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-[var(--color-text-secondary)]">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{fmtUsd(totalValue)}</p>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              Cost basis: {fmtUsd(totalCost)}
            </p>
          </CardContent>
        </Card>

        {/* P&L */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-[var(--color-text-secondary)]">Total P&amp;L</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={cn("text-3xl font-bold tabular-nums", pnlColor(totalPnL))}>
              {totalPnL >= 0 ? "+" : ""}{fmtUsd(totalPnL)}
            </p>
            <p className={cn("text-sm mt-1 font-medium", pnlColor(totalPnLPercent))}>
              {fmtPct(totalPnLPercent)}
            </p>
          </CardContent>
        </Card>

        {/* Allocation Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-[var(--color-text-secondary)]">Allocation</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <AllocationChart holdings={holdings} prices={prices} />
          </CardContent>
        </Card>
      </div>

      {/* ── Holdings Table ────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[var(--color-text-secondary)]">
                <th className="px-4 py-3 text-left font-medium">Coin</th>
                <th className="px-4 py-3 text-right font-medium">Amount</th>
                <th className="px-4 py-3 text-right font-medium">Avg Buy Price</th>
                <th className="px-4 py-3 text-right font-medium">Current Price</th>
                <th className="px-4 py-3 text-right font-medium">Value</th>
                <th className="px-4 py-3 text-right font-medium">P&amp;L ($)</th>
                <th className="px-4 py-3 text-right font-medium">P&amp;L (%)</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => (
                <HoldingRow
                  key={h.id}
                  holding={h}
                  currentPrice={prices[h.coinId]?.usd ?? h.buyPrice}
                />
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </main>
  );
}
