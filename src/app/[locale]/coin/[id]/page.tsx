import { setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { generateCoinMetadata } from "@/lib/seo";
import { COINGECKO_BASE } from "@/lib/constants";
import type { Metadata } from "next";

export const revalidate = 60;

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image?: { large?: string; small?: string; thumb?: string };
  description?: { en?: string };
  links?: {
    homepage?: string[];
    blockchain_site?: string[];
    twitter_screen_name?: string;
    subreddit_url?: string;
    telegram_channel_identifier?: string;
  };
  categories?: string[];
  market_cap_rank?: number;
  market_data?: {
    current_price?: { usd?: number };
    market_cap?: { usd?: number };
    total_volume?: { usd?: number };
    high_24h?: { usd?: number };
    low_24h?: { usd?: number };
    price_change_24h?: number;
    price_change_percentage_24h?: number;
    price_change_percentage_7d?: number;
    price_change_percentage_30d?: number;
    circulating_supply?: number;
    total_supply?: number;
    max_supply?: number;
    ath?: { usd?: number };
    ath_date?: { usd?: string };
    atl?: { usd?: number };
    atl_date?: { usd?: string };
  };
  last_updated?: string;
}

async function fetchCoinData(coinId: string): Promise<CoinData | null> {
  try {
    const response = await fetch(
      `${COINGECKO_BASE}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "FreeCryptoNews/1.0",
        },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const coin = await fetchCoinData(id);

  if (!coin) {
    return generateCoinMetadata({ name: id, symbol: id, locale });
  }

  return generateCoinMetadata({
    name: coin.name,
    symbol: coin.symbol,
    locale,
    price: coin.market_data?.current_price?.usd,
    priceChange: coin.market_data?.price_change_percentage_24h,
  });
}

function formatNumber(n: number | undefined | null): string {
  if (n == null) return "—";
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  return `$${n.toFixed(2)}`;
}

function formatPrice(n: number | undefined | null): string {
  if (n == null) return "—";
  if (n >= 1) return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${n.toPrecision(4)}`;
}

function formatPercent(n: number | undefined | null): string {
  if (n == null) return "—";
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

function formatSupply(n: number | undefined | null): string {
  if (n == null) return "—";
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(2)}K`;
  return n.toLocaleString();
}

export default async function CoinPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const coin = await fetchCoinData(id);

  if (!coin) {
    return (
      <>
        <Header />
        <main className="container-main py-10">
          <h1 className="font-serif text-3xl font-bold mb-4 text-[var(--color-text-primary)]">
            Coin not found
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Could not find data for &ldquo;{id}&rdquo;. The coin may not exist or the data source is temporarily unavailable.
          </p>
        </main>
        <Footer />
      </>
    );
  }

  const md = coin.market_data;
  const priceChange24h = md?.price_change_percentage_24h;
  const isPositive = priceChange24h != null && priceChange24h >= 0;

  return (
    <>
      <Header />
      <main className="container-main py-10">
        {/* Coin header */}
        <div className="flex items-center gap-4 mb-6">
          {coin.image?.large && (
            <img
              src={coin.image.large}
              alt={coin.name}
              width={64}
              height={64}
              className="rounded-full"
            />
          )}
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[var(--color-text-primary)]">
              {coin.name}{" "}
              <span className="text-[var(--color-text-tertiary)] font-normal text-2xl">
                {coin.symbol.toUpperCase()}
              </span>
            </h1>
            {coin.market_cap_rank && (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]">
                Rank #{coin.market_cap_rank}
              </span>
            )}
          </div>
        </div>

        {/* Price section */}
        <div className="mb-8">
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-4xl font-bold text-[var(--color-text-primary)]">
              {formatPrice(md?.current_price?.usd)}
            </span>
            {priceChange24h != null && (
              <span
                className={`text-lg font-semibold ${
                  isPositive ? "text-green-500" : "text-red-500"
                }`}
              >
                {formatPercent(priceChange24h)}
              </span>
            )}
          </div>
          {md?.price_change_24h != null && (
            <p className="text-sm text-[var(--color-text-tertiary)] mt-1">
              {md.price_change_24h >= 0 ? "+" : ""}
              ${Math.abs(md.price_change_24h).toFixed(4)} today
            </p>
          )}
        </div>

        {/* Market data grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Market Cap" value={formatNumber(md?.market_cap?.usd)} />
          <StatCard label="24h Volume" value={formatNumber(md?.total_volume?.usd)} />
          <StatCard label="24h High" value={formatPrice(md?.high_24h?.usd)} />
          <StatCard label="24h Low" value={formatPrice(md?.low_24h?.usd)} />
          <StatCard label="7d Change" value={formatPercent(md?.price_change_percentage_7d)} />
          <StatCard label="30d Change" value={formatPercent(md?.price_change_percentage_30d)} />
          <StatCard label="Circulating Supply" value={formatSupply(md?.circulating_supply)} />
          <StatCard
            label="Max Supply"
            value={md?.max_supply ? formatSupply(md.max_supply) : "∞"}
          />
        </div>

        {/* ATH / ATL */}
        {(md?.ath?.usd || md?.atl?.usd) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {md?.ath?.usd != null && (
              <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                <p className="text-sm text-[var(--color-text-tertiary)]">All-Time High</p>
                <p className="text-xl font-bold text-green-500">{formatPrice(md.ath.usd)}</p>
                {md.ath_date?.usd && (
                  <p className="text-xs text-[var(--color-text-tertiary)]">
                    {new Date(md.ath_date.usd).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
            {md?.atl?.usd != null && (
              <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                <p className="text-sm text-[var(--color-text-tertiary)]">All-Time Low</p>
                <p className="text-xl font-bold text-red-500">{formatPrice(md.atl.usd)}</p>
                {md.atl_date?.usd && (
                  <p className="text-xs text-[var(--color-text-tertiary)]">
                    {new Date(md.atl_date.usd).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {coin.description?.en && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-3 text-[var(--color-text-primary)]">
              About {coin.name}
            </h2>
            <div
              className="prose prose-sm max-w-none text-[var(--color-text-secondary)] [&_a]:text-blue-500 [&_a]:underline"
              dangerouslySetInnerHTML={{
                __html: coin.description.en.slice(0, 2000),
              }}
            />
          </div>
        )}

        {/* Links */}
        {coin.links && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-3 text-[var(--color-text-primary)]">Links</h2>
            <div className="flex flex-wrap gap-2">
              {coin.links.homepage?.[0] && (
                <LinkPill href={coin.links.homepage[0]} label="Website" />
              )}
              {coin.links.twitter_screen_name && (
                <LinkPill
                  href={`https://twitter.com/${coin.links.twitter_screen_name}`}
                  label="Twitter"
                />
              )}
              {coin.links.subreddit_url && (
                <LinkPill href={coin.links.subreddit_url} label="Reddit" />
              )}
              {coin.links.telegram_channel_identifier && (
                <LinkPill
                  href={`https://t.me/${coin.links.telegram_channel_identifier}`}
                  label="Telegram"
                />
              )}
              {coin.links.blockchain_site
                ?.filter(Boolean)
                .slice(0, 2)
                .map((url) => (
                  <LinkPill key={url} href={url} label="Explorer" />
                ))}
            </div>
          </div>
        )}

        {/* Categories */}
        {coin.categories && coin.categories.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-3 text-[var(--color-text-primary)]">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {coin.categories.filter(Boolean).map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1 text-sm rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Last updated */}
        {coin.last_updated && (
          <p className="mt-8 text-xs text-[var(--color-text-tertiary)]">
            Last updated: {new Date(coin.last_updated).toLocaleString()}
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
      <p className="text-xs text-[var(--color-text-tertiary)] mb-1">{label}</p>
      <p className="text-lg font-semibold text-[var(--color-text-primary)]">{value}</p>
    </div>
  );
}

function LinkPill({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
    >
      {label} ↗
    </a>
  );
}
