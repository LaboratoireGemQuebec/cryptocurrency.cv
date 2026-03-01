import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { NewsCardCompact } from "@/components/NewsCard";
import DefiTable, { type DefiProtocol } from "@/components/DefiTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getDefiNews, type NewsResponse } from "@/lib/crypto-news";
import { getDefiSummary, type DefiSummary } from "@/lib/apis/defillama";
import { getTopYields } from "@/lib/defi-yields";
import { generateSEOMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const revalidate = 300;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generateSEOMetadata({
    title: "DeFi Dashboard — TVL, Yields, Protocols & News",
    description:
      "Live DeFi dashboard with Total Value Locked, top yield opportunities, protocol rankings, DEX volumes, stablecoin data, and the latest DeFi news.",
    path: "/defi",
    locale,
    tags: [
      "defi",
      "tvl",
      "yield farming",
      "dex",
      "stablecoins",
      "protocols",
      "crypto",
    ],
  });
}

/* ── helpers ── */

function formatLargeNumber(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

function formatPct(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

/* ── stat card ── */

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <Card>
      <CardContent className="p-4 md:p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-1">
          {label}
        </p>
        <p className="text-xl md:text-2xl font-bold tabular-nums text-[var(--color-text-primary)]">
          {value}
        </p>
        {sub && (
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            {sub}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

/* ── yield card ── */

interface YieldCardProps {
  symbol: string;
  project: string;
  chain: string;
  apy: number;
  tvlUsd: number;
}

const CHAIN_BADGE: Record<string, string> = {
  Ethereum: "bg-blue-500/15 text-blue-400",
  BSC: "bg-yellow-500/15 text-yellow-400",
  Solana: "bg-purple-500/15 text-purple-400",
  Arbitrum: "bg-sky-500/15 text-sky-400",
  Polygon: "bg-violet-500/15 text-violet-400",
  Avalanche: "bg-red-500/15 text-red-400",
  Optimism: "bg-rose-500/15 text-rose-400",
  Base: "bg-blue-500/15 text-blue-300",
};

function YieldCard({ symbol, project, chain, apy, tvlUsd }: YieldCardProps) {
  return (
    <Card>
      <CardContent className="p-4 md:p-5 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold text-[var(--color-text-primary)] truncate">
              {symbol}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              {project}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-lg font-bold tabular-nums text-green-500">
              {apy.toFixed(2)}%
            </p>
            <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)]">
              APY
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium",
              CHAIN_BADGE[chain] ?? "bg-gray-500/15 text-gray-400"
            )}
          >
            {chain}
          </span>
          <span className="text-xs text-[var(--color-text-tertiary)] tabular-nums">
            TVL {formatLargeNumber(tvlUsd)}
          </span>
          {apy > 100 && (
            <Badge variant="breaking" className="text-[10px]">
              ⚠ High Risk
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* ── quick links ── */

const QUICK_LINKS = [
  { label: "DEX Volumes", href: "/api/defi/dex-volumes", icon: "📊" },
  { label: "Bridge Stats", href: "/api/defi/bridges", icon: "🌉" },
  { label: "Stablecoin Data", href: "/api/defi/stablecoins", icon: "💵" },
  { label: "Gas Tracker", href: "/gas", icon: "⛽" },
];

/* ── page ── */

export default async function DefiPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  /* fetch all data in parallel */
  const [summaryResult, yieldsResult, newsResult] = await Promise.allSettled([
    getDefiSummary(),
    getTopYields({ limit: 10 }),
    getDefiNews(6),
  ]);

  const summary: DefiSummary | null =
    summaryResult.status === "fulfilled" ? summaryResult.value : null;

  const yields =
    yieldsResult.status === "fulfilled" ? yieldsResult.value : [];

  const newsData: NewsResponse | null =
    newsResult.status === "fulfilled" ? newsResult.value : null;

  const articles = newsData?.articles ?? [];

  /* derive stats */
  const stats = summary
    ? [
        {
          label: "Total DeFi TVL",
          value: formatLargeNumber(summary.totalTvl),
          sub: `${formatPct(summary.totalTvlChange24h)} (24h)`,
        },
        {
          label: "DEX Volume (24h)",
          value: formatLargeNumber(summary.dexVolume24h),
        },
        {
          label: "Stablecoin Market Cap",
          value: formatLargeNumber(summary.stablecoinSupply),
        },
        {
          label: "Active Protocols",
          value: summary.totalProtocols.toLocaleString(),
        },
        {
          label: "Top Yield %",
          value:
            yields.length > 0
              ? `${yields[0].apy.toFixed(1)}%`
              : "—",
          sub: yields.length > 0 ? yields[0].symbol : undefined,
        },
        {
          label: "Number of Chains",
          value: Object.keys(summary.chainDistribution).length.toString(),
        },
      ]
    : [];

  /* protocols for table */
  const protocols: DefiProtocol[] = (summary?.topProtocols ?? [])
    .slice(0, 20)
    .map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      chain: p.chain,
      chains: p.chains,
      category: p.category,
      tvl: p.tvl,
      tvlChange24h: p.tvlChange24h,
      logo: p.logo,
      url: p.url,
    }));

  /* sort yields by apy desc */
  const topYields = [...yields]
    .sort((a, b) => b.apy - a.apy)
    .slice(0, 10);

  return (
    <>
      <Header />
      <main className="container-main py-10 space-y-12">
        {/* ── Hero ── */}
        <section>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2 text-[var(--color-text-primary)]">
            🏦 DeFi Dashboard
          </h1>
          <p className="text-[var(--color-text-secondary)] mb-8 max-w-2xl">
            Real-time decentralized finance overview — Total Value Locked,
            protocol rankings, top yield opportunities, DEX volumes, and the
            latest DeFi news.
          </p>
        </section>

        {/* ── 1. Stats Row ── */}
        {stats.length > 0 && (
          <section>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {stats.map((s) => (
                <StatCard key={s.label} {...s} />
              ))}
            </div>
          </section>
        )}

        {/* ── 2. Top Protocols Table ── */}
        {protocols.length > 0 && (
          <section>
            <h2 className="font-serif text-2xl font-bold mb-4 text-[var(--color-text-primary)]">
              Top Protocols by TVL
            </h2>
            <DefiTable protocols={protocols} />
          </section>
        )}

        {/* ── 3. Top Yields ── */}
        {topYields.length > 0 && (
          <section>
            <h2 className="font-serif text-2xl font-bold mb-4 text-[var(--color-text-primary)]">
              Top Yield Opportunities
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {topYields.map((y) => (
                <YieldCard
                  key={y.pool}
                  symbol={y.symbol}
                  project={y.project}
                  chain={y.chain}
                  apy={y.apy}
                  tvlUsd={y.tvlUsd}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── 4. DeFi News ── */}
        <section>
          <h2 className="font-serif text-2xl font-bold mb-4 text-[var(--color-text-primary)]">
            Latest DeFi News
          </h2>
          {articles.length === 0 ? (
            <p className="text-[var(--color-text-tertiary)] py-8 text-center">
              No DeFi articles available right now. Check back soon.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <NewsCardCompact key={article.link} article={article} />
              ))}
            </div>
          )}
        </section>

        {/* ── 5. Quick Links ── */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">
                Quick Links
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {QUICK_LINKS.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button variant="outline" size="sm">
                    <span className="mr-1.5">{link.icon}</span>
                    {link.label}
                  </Button>
                </Link>
              ))}
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </>
  );
}
