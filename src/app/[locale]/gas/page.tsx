/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

import { setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { generateSEOMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/format";
import { Fuel, Lightbulb } from "lucide-react";
import type { Metadata } from "next";

// ---------- Types ------------------------------------------------------------

type Props = {
  params: Promise<{ locale: string }>;
};

interface GasLevel {
  gwei: number;
  usd: number | null;
}

interface GasData {
  network: string;
  baseFee: number | null;
  low: GasLevel;
  medium: GasLevel;
  high: GasLevel;
  lastBlock: string | null;
  timestamp: string;
  source: string;
}

// ---------- Constants --------------------------------------------------------

/** Typical gas units for common Ethereum operations */
const GAS_ACTIONS = [
  { label: "ETH Transfer", gasUnits: 21_000 },
  { label: "ERC-20 Transfer", gasUnits: 65_000 },
  { label: "Uniswap Swap", gasUnits: 150_000 },
  { label: "NFT Mint", gasUnits: 200_000 },
  { label: "Contract Deploy", gasUnits: 1_500_000 },
] as const;

const SPEED_CARDS = [
  { key: "low" as const, emoji: "🐢", label: "Slow", desc: "~10 min" },
  { key: "medium" as const, emoji: "⚡", label: "Standard", desc: "~3 min" },
  { key: "high" as const, emoji: "🚀", label: "Fast", desc: "~30 sec" },
];

const TIPS = [
  "Gas prices are typically lowest on weekends and between 2–5 AM UTC.",
  "Batch multiple transactions when gas is low to save on fees.",
  "Use Layer 2 networks (Arbitrum, Optimism, Base) for 10–100× cheaper transactions.",
  "Set a max fee you're comfortable with — wallets let you customize this.",
  "Non-urgent transfers can wait for off-peak hours to save significantly.",
];

// ---------- Helpers ----------------------------------------------------------

function estimateUsd(gwei: number, gasUnits: number, baseUsdPerGas: number | null): string {
  if (baseUsdPerGas === null) return "—";
  // usd = gwei * gasUnits * 1e-9 * ethPriceUsd
  // But we already have usd for 21_000 gas, so scale proportionally
  const usd = (baseUsdPerGas / 21_000) * gasUnits;
  if (usd < 0.01) return "<$0.01";
  return formatCurrency(usd);
}

// ---------- Data fetcher -----------------------------------------------------

const BASE = SITE_URL;

async function fetchGas(): Promise<GasData | null> {
  try {
    const res = await fetch(`${BASE}/api/gas`, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    return (await res.json()) as GasData;
  } catch {
    return null;
  }
}

// ---------- Metadata ---------------------------------------------------------

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generateSEOMetadata({
    title: "Ethereum Gas Tracker — Free Crypto News",
    description:
      "Live Ethereum gas prices in gwei with estimated USD costs for transfers, swaps, NFT mints, and contract deployments.",
    path: "/gas",
    locale,
    tags: [
      "ethereum gas",
      "gas tracker",
      "gwei",
      "eth gas fees",
      "gas prices",
    ],
  });
}

// ---------- Page component ---------------------------------------------------

export const revalidate = 30;

export default async function GasPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const gas = await fetchGas();

  return (
    <>
      <Header />
      <main className="container-main py-8">
        {/* Heading */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Fuel className="h-7 w-7 text-[var(--color-accent)]" />
            <h1 className="font-serif text-3xl font-bold text-[var(--color-text-primary)]">
              Ethereum Gas Tracker
            </h1>
          </div>
          <p className="text-[var(--color-text-secondary)] max-w-2xl">
            Live gas prices on Ethereum mainnet. Estimated costs for common
            on-chain actions so you can time your transactions.
          </p>
          {gas && (
            <p className="text-xs text-[var(--color-text-tertiary)] mt-2">
              Source: {gas.source}
              {gas.lastBlock ? ` · Block ${gas.lastBlock}` : ""}
              {gas.baseFee ? ` · Base fee: ${gas.baseFee.toFixed(1)} gwei` : ""}
            </p>
          )}
        </div>

        {!gas ? (
          /* Empty state */
          <Card className="p-10 text-center">
            <Fuel className="h-10 w-10 mx-auto mb-3 text-[var(--color-text-tertiary)]" />
            <p className="text-[var(--color-text-secondary)]">
              Unable to load gas data. Please try again shortly.
            </p>
          </Card>
        ) : (
          <>
            {/* Speed Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {SPEED_CARDS.map(({ key, emoji, label, desc }) => {
                const level = gas[key];
                return (
                  <Card key={key} className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl" role="img" aria-label={label}>
                        {emoji}
                      </span>
                      <div>
                        <h2 className="font-serif text-lg font-semibold text-[var(--color-text-primary)]">
                          {label}
                        </h2>
                        <p className="text-xs text-[var(--color-text-tertiary)]">
                          {desc}
                        </p>
                      </div>
                    </div>

                    <p className="text-3xl font-bold text-[var(--color-accent)] mb-4">
                      {level.gwei}{" "}
                      <span className="text-sm font-normal text-[var(--color-text-tertiary)]">
                        gwei
                      </span>
                    </p>

                    {/* Cost estimates table */}
                    <div className="space-y-2">
                      {GAS_ACTIONS.map((action) => (
                        <div
                          key={action.label}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-[var(--color-text-secondary)]">
                            {action.label}
                          </span>
                          <span className="font-medium text-[var(--color-text-primary)]">
                            {estimateUsd(level.gwei, action.gasUnits, level.usd)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Gas Bar Comparison */}
            <Card className="p-6 mb-8">
              <h2 className="font-serif text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                Gas Price Comparison
              </h2>
              <div className="space-y-3">
                {SPEED_CARDS.map(({ key, label, emoji }) => {
                  const level = gas[key];
                  const maxGwei = Math.max(gas.low.gwei, gas.medium.gwei, gas.high.gwei, 1);
                  const pct = (level.gwei / maxGwei) * 100;
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-[var(--color-text-secondary)]">
                          {emoji} {label}
                        </span>
                        <span className="font-medium text-[var(--color-text-primary)]">
                          {level.gwei} gwei
                          {level.usd !== null && (
                            <span className="text-[var(--color-text-tertiary)] ml-1">
                              ({formatCurrency(level.usd)})
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="h-3 rounded-full bg-[var(--color-surface-secondary)] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[var(--color-accent)] transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <h2 className="font-serif text-lg font-semibold text-[var(--color-text-primary)]">
                  Tips to Save on Gas
                </h2>
              </div>
              <ul className="space-y-2">
                {TIPS.map((tip) => (
                  <li
                    key={tip}
                    className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]"
                  >
                    <span className="text-[var(--color-accent)] mt-0.5 shrink-0">
                      •
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </Card>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
