import { setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getArticleById, type EnrichedArticle } from "@/lib/archive-v2";
import { generateArticleMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const revalidate = 300;

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;

  let article: EnrichedArticle | null = null;
  try {
    article = await getArticleById(id);
  } catch {
    // fall through
  }

  if (!article) {
    return generateArticleMetadata({
      title: "Article Not Found",
      description: "The requested article could not be found.",
      slug: id,
      locale,
      publishedTime: new Date().toISOString(),
    });
  }

  return generateArticleMetadata({
    title: article.title,
    description: article.description || `${article.title} — from ${article.source}`,
    slug: article.slug ?? id,
    locale,
    publishedTime: article.pub_date ?? article.first_seen,
    category: article.category,
    tags: [...article.tickers, ...article.tags].slice(0, 6),
  });
}

function sentimentBadge(label: string): { text: string; className: string } {
  switch (label) {
    case "very_positive":
    case "positive":
      return { text: "Bullish", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" };
    case "very_negative":
    case "negative":
      return { text: "Bearish", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" };
    default:
      return { text: "Neutral", className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200" };
  }
}

export default async function ArticlePage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  let article: EnrichedArticle | null = null;
  try {
    article = await getArticleById(id);
  } catch {
    // fall through
  }

  if (!article) {
    return (
      <>
        <Header />
        <main className="container-main py-10">
          <h1 className="font-serif text-3xl font-bold mb-4 text-[var(--color-text-primary)]">
            Article not found
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            The requested article could not be found. It may have been removed or the link is incorrect.
          </p>
        </main>
        <Footer />
      </>
    );
  }

  const sentiment = sentimentBadge(article.sentiment?.label ?? "neutral");
  const pubDate = article.pub_date ?? article.first_seen;

  return (
    <>
      <Header />
      <main className="container-main py-10 max-w-3xl mx-auto">
        {/* Category & sentiment */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-2 py-0.5 text-xs font-medium rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] capitalize">
            {article.category}
          </span>
          <span className={`px-2 py-0.5 text-xs font-medium rounded ${sentiment.className}`}>
            {sentiment.text}
          </span>
          {article.meta?.is_breaking && (
            <span className="px-2 py-0.5 text-xs font-medium rounded bg-red-600 text-white">
              Breaking
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-[var(--color-text-primary)] leading-tight">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-text-tertiary)] mb-6">
          <span className="font-medium text-[var(--color-text-secondary)]">{article.source}</span>
          <span>·</span>
          <time dateTime={pubDate}>
            {new Date(pubDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {article.meta?.word_count > 0 && (
            <>
              <span>·</span>
              <span>{Math.ceil(article.meta.word_count / 200)} min read</span>
            </>
          )}
        </div>

        {/* Description */}
        {article.description && (
          <div className="mb-6 p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
            <p className="text-[var(--color-text-secondary)] leading-relaxed">
              {article.description}
            </p>
          </div>
        )}

        {/* Tickers */}
        {article.tickers.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-[var(--color-text-tertiary)] mb-2 uppercase tracking-wide">
              Related Assets
            </h2>
            <div className="flex flex-wrap gap-2">
              {article.tickers.map((ticker) => (
                <span
                  key={ticker}
                  className="px-2.5 py-1 text-sm font-mono font-medium rounded bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  ${ticker}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Market context */}
        {article.market_context && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-[var(--color-text-tertiary)] mb-2 uppercase tracking-wide">
              Market Context at Publication
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {article.market_context.btc_price != null && (
                <div className="p-3 rounded border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                  <p className="text-xs text-[var(--color-text-tertiary)]">BTC Price</p>
                  <p className="font-semibold text-[var(--color-text-primary)]">
                    ${article.market_context.btc_price.toLocaleString()}
                  </p>
                </div>
              )}
              {article.market_context.eth_price != null && (
                <div className="p-3 rounded border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                  <p className="text-xs text-[var(--color-text-tertiary)]">ETH Price</p>
                  <p className="font-semibold text-[var(--color-text-primary)]">
                    ${article.market_context.eth_price.toLocaleString()}
                  </p>
                </div>
              )}
              {article.market_context.fear_greed_index != null && (
                <div className="p-3 rounded border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                  <p className="text-xs text-[var(--color-text-tertiary)]">Fear & Greed</p>
                  <p className="font-semibold text-[var(--color-text-primary)]">
                    {article.market_context.fear_greed_index}/100
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Entities */}
        {article.entities && (
          <>
            {article.entities.people?.length > 0 && (
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-[var(--color-text-tertiary)] mb-2 uppercase tracking-wide">
                  People Mentioned
                </h2>
                <div className="flex flex-wrap gap-2">
                  {article.entities.people.map((person) => (
                    <span key={person} className="px-2 py-0.5 text-sm rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]">
                      {person}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {article.entities.companies?.length > 0 && (
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-[var(--color-text-tertiary)] mb-2 uppercase tracking-wide">
                  Companies
                </h2>
                <div className="flex flex-wrap gap-2">
                  {article.entities.companies.map((company) => (
                    <span key={company} className="px-2 py-0.5 text-sm rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]">
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {article.entities.protocols?.length > 0 && (
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-[var(--color-text-tertiary)] mb-2 uppercase tracking-wide">
                  Protocols
                </h2>
                <div className="flex flex-wrap gap-2">
                  {article.entities.protocols.map((protocol) => (
                    <span key={protocol} className="px-2 py-0.5 text-sm rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]">
                      {protocol}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-[var(--color-text-tertiary)] mb-2 uppercase tracking-wide">
              Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-tertiary)]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Read original */}
        <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
          <a
            href={article.canonical_link || article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] font-medium hover:opacity-90 transition-opacity"
          >
            Read full article on {article.source} ↗
          </a>
        </div>

        {/* Metadata footer */}
        <p className="mt-6 text-xs text-[var(--color-text-tertiary)]">
          First seen: {new Date(article.first_seen).toLocaleString()} · ID: {article.id}
        </p>
      </main>
      <Footer />
    </>
  );
}
