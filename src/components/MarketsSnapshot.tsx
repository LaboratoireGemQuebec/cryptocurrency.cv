"use client";

import { useState, useEffect, useCallback } from "react";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

interface CoinPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
}

const COINS = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum" },
  { id: "solana", symbol: "SOL", name: "Solana" },
  { id: "binancecoin", symbol: "BNB", name: "BNB" },
  { id: "ripple", symbol: "XRP", name: "XRP" },
  { id: "cardano", symbol: "ADA", name: "Cardano" },
] as const;

function formatPrice(price: number): string {
  if (price >= 1000) return `$${price.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (price >= 1) return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${price.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`;
}

export default function MarketsSnapshot() {
  const [coins, setCoins] = useState<CoinPrice[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrices = useCallback(async () => {
    try {
      const ids = COINS.map((c) => c.id).join(",");
      const res = await fetch(`/api/prices?coins=${ids}`);
      if (!res.ok) return;
      const data = await res.json();

      const parsed: CoinPrice[] = COINS.map((coin) => {
        const d = data[coin.id];
        return {
          symbol: coin.symbol,
          name: coin.name,
          price: d?.usd ?? 0,
          change24h: d?.usd_24h_change ?? 0,
        };
      }).filter((c) => c.price > 0);

      setCoins(parsed);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60_000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-surface-secondary)]">
      <div className="container-main py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-serif">Markets</h2>
          <Link
            href="/markets"
            className="flex items-center gap-1 text-sm text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 animate-pulse"
                >
                  <div className="h-4 w-10 bg-[var(--color-border)] rounded mb-2" />
                  <div className="h-5 w-16 bg-[var(--color-border)] rounded mb-1" />
                  <div className="h-3 w-12 bg-[var(--color-border)] rounded" />
                </div>
              ))
            : coins.map((coin) => {
                const isPositive = coin.change24h >= 0;
                return (
                  <Link
                    key={coin.symbol}
                    href={`/coin/${coin.symbol.toLowerCase()}`}
                    className={cn(
                      "rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3",
                      "hover:shadow-md hover:border-[var(--color-accent)] transition-all group"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                        {coin.symbol}
                      </span>
                      {isPositive ? (
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                      )}
                    </div>
                    <div className="text-base font-bold text-[var(--color-text-primary)]">
                      {formatPrice(coin.price)}
                    </div>
                    <div
                      className={cn(
                        "text-xs font-mono mt-0.5",
                        isPositive ? "text-emerald-500" : "text-red-500"
                      )}
                    >
                      {isPositive ? "+" : ""}
                      {coin.change24h.toFixed(2)}%
                    </div>
                  </Link>
                );
              })}
        </div>
      </div>
    </section>
  );
}
