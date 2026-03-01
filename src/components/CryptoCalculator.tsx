/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { ArrowUpDown, RefreshCw } from "lucide-react";

// ---------- Types ------------------------------------------------------------

interface CoinPrice {
  usd: number;
  eur?: number;
  gbp?: number;
  usd_24h_change?: number;
}

type PriceMap = Record<string, CoinPrice>;

// ---------- Constants --------------------------------------------------------

const POPULAR_COINS = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum" },
  { id: "solana", symbol: "SOL", name: "Solana" },
  { id: "binancecoin", symbol: "BNB", name: "BNB" },
  { id: "ripple", symbol: "XRP", name: "XRP" },
  { id: "cardano", symbol: "ADA", name: "Cardano" },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin" },
  { id: "polkadot", symbol: "DOT", name: "Polkadot" },
  { id: "avalanche-2", symbol: "AVAX", name: "Avalanche" },
  { id: "chainlink", symbol: "LINK", name: "Chainlink" },
] as const;

const FIAT_CURRENCIES = [
  { code: "usd", symbol: "$", name: "US Dollar" },
  { code: "eur", symbol: "€", name: "Euro" },
  { code: "gbp", symbol: "£", name: "British Pound" },
] as const;

const QUICK_SELECT = ["bitcoin", "ethereum", "solana", "binancecoin"] as const;

// ---------- Component --------------------------------------------------------

export default function CryptoCalculator() {
  const [prices, setPrices] = useState<PriceMap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [fromCoin, setFromCoin] = useState("bitcoin");
  const [toCurrency, setToCurrency] = useState<"usd" | "eur" | "gbp">("usd");
  const [cryptoAmount, setCryptoAmount] = useState("1");
  const [fiatAmount, setFiatAmount] = useState("");
  const [activeField, setActiveField] = useState<"crypto" | "fiat">("crypto");

  // Fetch prices
  const fetchPrices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const coinIds = POPULAR_COINS.map((c) => c.id).join(",");
      const res = await fetch(`/api/prices?coins=${coinIds}`);
      if (!res.ok) throw new Error("Failed to fetch prices");
      const data = (await res.json()) as PriceMap;
      setPrices(data);
    } catch {
      setError("Unable to load prices. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  // Current rate
  const rate = useMemo(() => {
    if (!prices || !prices[fromCoin]) return null;
    const coinData = prices[fromCoin];
    return coinData[toCurrency] ?? coinData.usd ?? null;
  }, [prices, fromCoin, toCurrency]);

  // Compute conversion when inputs change
  useEffect(() => {
    if (rate === null) return;
    if (activeField === "crypto") {
      const val = parseFloat(cryptoAmount);
      if (!isNaN(val) && val >= 0) {
        setFiatAmount((val * rate).toFixed(2));
      } else {
        setFiatAmount("");
      }
    } else {
      const val = parseFloat(fiatAmount);
      if (!isNaN(val) && val >= 0 && rate > 0) {
        setCryptoAmount((val / rate).toFixed(8).replace(/0+$/, "").replace(/\.$/, ""));
      } else {
        setCryptoAmount("");
      }
    }
  }, [cryptoAmount, fiatAmount, rate, activeField]);

  // Swap direction
  const handleSwap = () => {
    setActiveField((prev) => (prev === "crypto" ? "fiat" : "crypto"));
  };

  const selectedCoin = POPULAR_COINS.find((c) => c.id === fromCoin);
  const selectedFiat = FIAT_CURRENCIES.find((c) => c.code === toCurrency);
  const change24h = prices?.[fromCoin]?.usd_24h_change ?? null;

  return (
    <div className="space-y-6">
      {/* Calculator Card */}
      <Card className="p-6">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-6 w-48" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-[var(--color-text-secondary)] mb-3">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchPrices}>
              <RefreshCw className="h-4 w-4 mr-1" /> Retry
            </Button>
          </div>
        ) : (
          <>
            {/* Quick select */}
            <div className="flex flex-wrap gap-2 mb-6">
              {QUICK_SELECT.map((coinId) => {
                const coin = POPULAR_COINS.find((c) => c.id === coinId);
                if (!coin) return null;
                return (
                  <Button
                    key={coinId}
                    variant={fromCoin === coinId ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setFromCoin(coinId);
                      setActiveField("crypto");
                    }}
                  >
                    {coin.symbol}
                  </Button>
                );
              })}
            </div>

            {/* Crypto input */}
            <div className="space-y-2 mb-4">
              <label className="text-sm font-medium text-[var(--color-text-secondary)]">
                Cryptocurrency
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={cryptoAmount}
                  onFocus={() => setActiveField("crypto")}
                  onChange={(e) => {
                    setActiveField("crypto");
                    setCryptoAmount(e.target.value);
                  }}
                  className={cn(
                    "flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]",
                    "px-4 py-3 text-lg font-medium text-[var(--color-text-primary)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent",
                    "placeholder:text-[var(--color-text-tertiary)]"
                  )}
                  placeholder="0.00"
                />
                <select
                  value={fromCoin}
                  onChange={(e) => setFromCoin(e.target.value)}
                  className={cn(
                    "w-36 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]",
                    "px-3 py-3 font-medium text-[var(--color-text-primary)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  )}
                >
                  {POPULAR_COINS.map((coin) => (
                    <option key={coin.id} value={coin.id}>
                      {coin.symbol}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap button */}
            <div className="flex justify-center my-2">
              <button
                onClick={handleSwap}
                className={cn(
                  "p-2 rounded-full border border-[var(--color-border)]",
                  "bg-[var(--color-surface-secondary)] hover:bg-[var(--color-surface-tertiary)]",
                  "transition-colors"
                )}
                aria-label="Swap conversion direction"
              >
                <ArrowUpDown className="h-5 w-5 text-[var(--color-accent)]" />
              </button>
            </div>

            {/* Fiat input */}
            <div className="space-y-2 mt-4">
              <label className="text-sm font-medium text-[var(--color-text-secondary)]">
                Fiat Currency
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={fiatAmount}
                  onFocus={() => setActiveField("fiat")}
                  onChange={(e) => {
                    setActiveField("fiat");
                    setFiatAmount(e.target.value);
                  }}
                  className={cn(
                    "flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]",
                    "px-4 py-3 text-lg font-medium text-[var(--color-text-primary)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent",
                    "placeholder:text-[var(--color-text-tertiary)]"
                  )}
                  placeholder="0.00"
                />
                <select
                  value={toCurrency}
                  onChange={(e) =>
                    setToCurrency(e.target.value as "usd" | "eur" | "gbp")
                  }
                  className={cn(
                    "w-36 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]",
                    "px-3 py-3 font-medium text-[var(--color-text-primary)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  )}
                >
                  {FIAT_CURRENCIES.map((fiat) => (
                    <option key={fiat.code} value={fiat.code}>
                      {fiat.code.toUpperCase()} ({fiat.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rate display */}
            {rate !== null && selectedCoin && selectedFiat && (
              <div className="mt-6 p-4 rounded-lg bg-[var(--color-surface-secondary)] border border-[var(--color-border)]">
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Current Rate
                </p>
                <p className="text-lg font-semibold text-[var(--color-text-primary)]">
                  1 {selectedCoin.symbol} = {selectedFiat.symbol}
                  {rate.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: rate < 1 ? 6 : 2,
                  })}
                </p>
                {change24h !== null && (
                  <p
                    className={cn(
                      "text-sm font-medium mt-1",
                      change24h > 0
                        ? "text-green-500 dark:text-green-400"
                        : change24h < 0
                          ? "text-red-500 dark:text-red-400"
                          : "text-[var(--color-text-secondary)]"
                    )}
                  >
                    {change24h > 0 ? "+" : ""}
                    {change24h.toFixed(2)}% (24h)
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </Card>

      {/* Rates table */}
      {prices && (
        <Card className="p-6">
          <h2 className="font-serif text-lg font-semibold text-[var(--color-text-primary)] mb-4">
            Quick Rates ({toCurrency.toUpperCase()})
          </h2>
          <div className="divide-y divide-[var(--color-border)]">
            {POPULAR_COINS.map((coin) => {
              const coinData = prices[coin.id];
              if (!coinData) return null;
              const price = coinData[toCurrency] ?? coinData.usd ?? 0;
              const fiatSym =
                FIAT_CURRENCIES.find((f) => f.code === toCurrency)?.symbol ??
                "$";
              return (
                <button
                  key={coin.id}
                  onClick={() => {
                    setFromCoin(coin.id);
                    setActiveField("crypto");
                  }}
                  className={cn(
                    "flex items-center justify-between w-full py-3 px-2 text-left rounded-lg",
                    "hover:bg-[var(--color-surface-secondary)] transition-colors",
                    fromCoin === coin.id && "bg-[var(--color-surface-secondary)]"
                  )}
                >
                  <span className="font-medium text-[var(--color-text-primary)]">
                    {coin.symbol}{" "}
                    <span className="text-[var(--color-text-tertiary)] font-normal text-sm">
                      {coin.name}
                    </span>
                  </span>
                  <span className="font-medium text-[var(--color-text-primary)]">
                    {fiatSym}
                    {price.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: price < 1 ? 6 : 2,
                    })}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
