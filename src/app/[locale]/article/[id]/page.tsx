/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 */

import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ReadingProgressBar } from "@/components/ReadingProgress";
import { getArticleById, getRelatedArticles, toNewsArticle, type EnrichedArticle } from "@/lib/archive-v2";
import { generateArticleMetadata } from "@/lib/seo";
import { Link } from "@/i18n/navigation";
import { Badge, categoryToBadgeVariant } from "@/components/ui/Badge";
import NewsCard from "@/components/NewsCard";
import ShareBar from "@/components/ShareBar";
import { ArticleStructuredData } from "@/components/StructuredData";
import NewsletterCTA from "@/components/NewsletterCTA";
import { getUnsplashFallback } from "@/lib/unsplash-fallback";
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

function sentimentBadge(label: string): { text: string; className: string; icon: string } {
  switch (label) {
    case "very_positive":
    case "positive":
      return { text: "Bullish", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", icon: "trending_up" };
    case "very_negative":
    case "negative":
      return { text: "Bearish", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", icon: "trending_down" };
    default:
      return { text: "Neutral", className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200", icon: "trending_flat" };
  }
}

function estimateReadingTime(wordCount: number | undefined, description: string): number {
  if (wordCount && wordCount > 0) return Math.ceil(wordCount / 200);
  const words = description?.split(/\s+/).length ?? 0;
  return Math.max(1, Math.ceil(words / 200));
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).replace(/\s+\S*$/, "") + "…";
}

function formatFearGreed(value: number): { label: string; color: string } {
  if (value <= 25) return { label: "Extreme Fear", color: "text-red-600 dark:text-red-400" };
  if (value <= 45) return { label: "Fear", color: "text-orange-600 dark:text-orange-400" };
  if (value <= 55) return { label: "Neutral", color: "text-yellow-600 dark:text-yellow-400" };
  if (value <= 75) return { label: "Greed", color: "text-green-600 dark:text-green-400" };
  return { label: "Extreme Greed", color: "text-green-700 dark:text-green-300" };
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
          <h1 className="font-serif text-3xl font-bold mb-4 text-text-primary">
            Article not found
          </h1>
          <p className="text-text-secondary">
            The requested article could not be found. It may have been removed or the link is incorrect.
          </p>
        </main>
        <Footer />
      </>
    );
  }

  const sentiment = sentimentBadge(article.sentiment?.label ?? "neutral");
  const pubDate = article.pub_date ?? article.first_seen;
  const readingTime = estimateReadingTime(article.meta?.word_count, article.description);
  const articleUrl = `https://cryptocurrency.cv/${locale}/article/${article.slug ?? id}`;
  const heroImage = getUnsplashFallback(article.title || article.source || "crypto", 1200, 630);
  const ogImage = `https://cryptocurrency.cv/api/og?title=${encodeURIComponent(article.title)}&tags=${encodeURIComponent([...article.tickers, ...article.tags].slice(0, 3).join(","))}&source=${encodeURIComponent(article.source)}`;

  const hasEntities = article.entities && (
    (article.entities.people?.length ?? 0) > 0 ||
    (article.entities.companies?.length ?? 0) > 0 ||
    (article.entities.protocols?.length ?? 0) > 0
  );

  // Fetch related articles (more for the rich layout)
  let relatedArticles: EnrichedArticle[] = [];
  try {
    relatedArticles = await getRelatedArticles(article, 8);
  } catch {
    // fall through — related articles are optional
  }

  const sidebarArticles = relatedArticles.slice(0, 4);
  const bottomArticles = relatedArticles.slice(0, 6);

  return (
    <>
      <ReadingProgressBar />
      <Header />
      <ArticleStructuredData
        headline={article.title}
        description={article.description || `${article.title} — from ${article.source}`}
        url={articleUrl}
        image={ogImage}
        datePublished={pubDate}
        dateModified={article.last_seen || pubDate}
        author={article.source}
        section={article.category}
        keywords={[...article.tickers, ...article.tags].slice(0, 10)}
      />

      {/* ── Hero Image ── */}
      <div className="relative w-full bg-surface-tertiary">
        <div className="container-main">
          <div className="relative aspect-[21/9] md:aspect-[3/1] w-full overflow-hidden rounded-b-xl md:rounded-b-2xl">
            <Image
              src={heroImage}
              alt={article.title}
              fill
              sizes="100vw"
              quality={85}
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <div className="max-w-4xl">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant={categoryToBadgeVariant(article.category)}>
                    {article.category}
                  </Badge>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${sentiment.className}`}>
                    {sentiment.text}
                  </span>
                  {article.meta?.is_breaking && (
                    <Badge variant="breaking">Breaking</Badge>
                  )}
                  {article.meta?.is_opinion && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      Opinion
                    </span>
                  )}
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3 drop-shadow-lg">
                  {article.title}
                </h1>
                {article.description && article.description.length <= 200 && (
                  <p className="text-base md:text-lg text-gray-200 leading-relaxed max-w-3xl drop-shadow">
                    {article.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container-main py-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 text-sm text-text-tertiary">
            <li>
              <Link href="/" className="hover:text-accent transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronIcon />
            </li>
            <li>
              <Link href={`/?category=${article.category}`} className="hover:text-accent transition-colors capitalize">
                {article.category}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronIcon />
            </li>
            <li className="text-text-secondary truncate max-w-[300px]">
              {truncate(article.title, 60)}
            </li>
          </ol>
        </nav>

        {/* ── Two-Column Layout ── */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* ── Main Content Column ── */}
          <article className="flex-1 min-w-0 max-w-[720px]">
            {/* Byline — editorial style */}
            <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
              <div className="flex items-center gap-3">
                <Link
                  href={`/source/${article.source_key}`}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent font-bold text-base shrink-0 hover:bg-accent/20 transition-colors"
                >
                  {article.source.charAt(0).toUpperCase()}
                </Link>
                <div className="flex flex-col">
                  <Link
                    href={`/source/${article.source_key}`}
                    className="font-semibold text-sm text-text-primary hover:text-accent transition-colors"
                  >
                    {article.source}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-text-tertiary">
                    <time dateTime={pubDate}>
                      {new Date(pubDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </time>
                    <span>·</span>
                    <span>{readingTime} min read</span>
                  </div>
                </div>
              </div>
              <ShareBar url={articleUrl} title={article.title} compact />
            </div>

            {/* ── AI Summary Box ── */}
            {article.description && article.description.length > 100 && (
              <div className="mb-8 p-5 rounded-xl border border-blue-200 bg-blue-50/60 dark:border-blue-800 dark:bg-blue-950/40">
                <div className="flex items-center gap-2 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-600 dark:text-blue-400">
                    <path d="M12 3l1.912 5.813a2 2 0 001.272 1.272L21 12l-5.813 1.912a2 2 0 00-1.272 1.272L12 21l-1.912-5.813a2 2 0 00-1.272-1.272L3 12l5.813-1.912a2 2 0 001.272-1.272z" />
                  </svg>
                  <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                    AI Summary
                  </span>
                </div>
                <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed">
                  {article.description}
                </p>
              </div>
            )}

            {/* ── Key Facts Box ── */}
            {(article.tickers.length > 0 || hasEntities) && (
              <div className="mb-8 p-5 rounded-xl border border-border bg-(--color-surface)">
                <h2 className="text-sm font-bold text-text-primary mb-3 uppercase tracking-wide flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-accent">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                  </svg>
                  Key Facts
                </h2>
                <ul className="space-y-2 text-sm text-text-secondary">
                  {article.tickers.length > 0 && (
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold mt-0.5">&#8226;</span>
                      <span>
                        <span className="font-medium text-text-primary">Assets mentioned:</span>{" "}
                        {article.tickers.map((ticker, i) => (
                          <span key={ticker}>
                            <Link
                              href={`/coin/${ticker.toLowerCase()}`}
                              className="font-mono font-medium text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              ${ticker}
                            </Link>
                            {i < article.tickers.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </span>
                    </li>
                  )}
                  {article.entities?.companies?.length > 0 && (
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold mt-0.5">&#8226;</span>
                      <span>
                        <span className="font-medium text-text-primary">Companies:</span>{" "}
                        {article.entities.companies.join(", ")}
                      </span>
                    </li>
                  )}
                  {article.entities?.people?.length > 0 && (
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold mt-0.5">&#8226;</span>
                      <span>
                        <span className="font-medium text-text-primary">People:</span>{" "}
                        {article.entities.people.join(", ")}
                      </span>
                    </li>
                  )}
                  {article.entities?.protocols?.length > 0 && (
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold mt-0.5">&#8226;</span>
                      <span>
                        <span className="font-medium text-text-primary">Protocols:</span>{" "}
                        {article.entities.protocols.join(", ")}
                      </span>
                    </li>
                  )}
                  {article.sentiment && (
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold mt-0.5">&#8226;</span>
                      <span>
                        <span className="font-medium text-text-primary">Sentiment:</span>{" "}
                        <span className={sentiment.className.replace(/bg-\S+/g, "").trim()}>
                          {sentiment.text}
                        </span>
                        {article.sentiment.confidence > 0 && (
                          <span className="text-text-tertiary"> ({Math.round(article.sentiment.confidence * 100)}% confidence)</span>
                        )}
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* ── Content Area (prose) ── */}
            <div className="mb-8">
              {article.description && article.description.length > 200 && (
                <div className="prose dark:prose-invert prose-headings:font-serif prose-lg max-w-none mb-6">
                  <p className="text-text-secondary leading-relaxed">
                    {article.description}
                  </p>
                </div>
              )}

              {/* Read full article CTA */}
              <div className="mt-8 p-6 rounded-xl border-2 border-dashed border-border bg-(--color-surface) text-center">
                <p className="text-sm text-text-tertiary mb-3">
                  This article was originally published on {article.source}
                </p>
                <a
                  href={article.canonical_link || article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-white font-semibold hover:opacity-90 transition-opacity text-base"
                >
                  Read full article on {article.source}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                    <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            {/* ── Market Context at Publication ── */}
            {article.market_context && (
              <div className="mb-8 p-5 rounded-xl border border-border bg-(--color-surface)">
                <h2 className="text-sm font-bold text-text-primary mb-4 uppercase tracking-wide flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-accent">
                    <path fillRule="evenodd" d="M1 2.75A.75.75 0 011.75 2h16.5a.75.75 0 010 1.5H18v8.75A2.75 2.75 0 0115.25 15h-1.072l.798 3.06a.75.75 0 01-1.452.38L13.41 18H6.59l-.114.44a.75.75 0 01-1.452-.38L5.822 15H4.75A2.75 2.75 0 012 12.25V3.5h-.25A.75.75 0 011 2.75zM7.373 15l-.391 1.5h6.037l-.392-1.5H7.373zm.462-4a.75.75 0 01.75-.75h2.83a.75.75 0 010 1.5H8.585a.75.75 0 01-.75-.75zm.75-3.75a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z" clipRule="evenodd" />
                  </svg>
                  Market Context at Publication
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {article.market_context.btc_price != null && (
                    <MarketContextCard
                      label="Bitcoin"
                      value={`$${article.market_context.btc_price.toLocaleString()}`}
                      icon="B"
                      iconBg="bg-orange-500"
                    />
                  )}
                  {article.market_context.eth_price != null && (
                    <MarketContextCard
                      label="Ethereum"
                      value={`$${article.market_context.eth_price.toLocaleString()}`}
                      icon="E"
                      iconBg="bg-blue-500"
                    />
                  )}
                  {article.market_context.sol_price != null && (
                    <MarketContextCard
                      label="Solana"
                      value={`$${article.market_context.sol_price.toLocaleString()}`}
                      icon="S"
                      iconBg="bg-purple-500"
                    />
                  )}
                  {article.market_context.fear_greed_index != null && (() => {
                    const fg = formatFearGreed(article.market_context!.fear_greed_index!);
                    return (
                      <MarketContextCard
                        label="Fear & Greed"
                        value={`${article.market_context!.fear_greed_index}`}
                        subValue={fg.label}
                        icon="F"
                        iconBg="bg-yellow-500"
                      />
                    );
                  })()}
                  {article.market_context.total_market_cap != null && (
                    <MarketContextCard
                      label="Total Market Cap"
                      value={`$${(article.market_context.total_market_cap / 1e12).toFixed(2)}T`}
                      icon="M"
                      iconBg="bg-green-500"
                    />
                  )}
                  {article.market_context.btc_dominance != null && (
                    <MarketContextCard
                      label="BTC Dominance"
                      value={`${article.market_context.btc_dominance.toFixed(1)}%`}
                      icon="D"
                      iconBg="bg-orange-400"
                    />
                  )}
                </div>
              </div>
            )}

            {/* ── Tags ── */}
            {article.tags.length > 0 && (
              <div className="mb-8 pt-6 border-t border-border">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wide mr-1">Tags:</span>
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs rounded-full bg-surface-tertiary text-text-secondary hover:bg-surface-secondary transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ── Share Bar (full) ── */}
            <div className="mb-8 pt-6 border-t border-border">
              <ShareBar url={articleUrl} title={article.title} description={article.description} />
            </div>

            {/* Metadata footer */}
            <div className="flex items-center justify-between text-xs text-text-tertiary py-4 border-t border-border">
              <p>
                Originally published by{" "}
                <Link href={`/source/${article.source_key}`} className="hover:text-accent transition-colors font-medium">
                  {article.source}
                </Link>
              </p>
              <p>
                Indexed: {new Date(article.first_seen).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </article>

          {/* ── Sidebar ── */}
          <aside className="w-full lg:w-[340px] xl:w-[380px] shrink-0 space-y-6">
            {/* Related Assets Widget */}
            {article.tickers.length > 0 && (
              <div className="rounded-xl border border-border bg-(--color-surface) p-5">
                <h3 className="text-sm font-bold text-text-primary mb-4 uppercase tracking-wide">
                  Related Assets
                </h3>
                <div className="space-y-3">
                  {article.tickers.slice(0, 6).map((ticker) => (
                    <Link
                      key={ticker}
                      href={`/coin/${ticker.toLowerCase()}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-tertiary transition-colors group"
                    >
                      <span className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-sm shrink-0">
                        {ticker.charAt(0)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-text-primary group-hover:text-accent transition-colors">
                          {ticker}
                        </p>
                        <p className="text-xs text-text-tertiary">View price & news</p>
                      </div>
                      <ChevronIcon />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Market Snapshot Widget */}
            {article.market_context && (
              <div className="rounded-xl border border-border bg-(--color-surface) p-5 lg:block hidden">
                <h3 className="text-sm font-bold text-text-primary mb-4 uppercase tracking-wide">
                  Market Snapshot
                </h3>
                <div className="space-y-3">
                  {article.market_context.btc_price != null && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">B</span>
                        <span className="text-sm text-text-primary font-medium">BTC</span>
                      </div>
                      <span className="text-sm font-semibold text-text-primary tabular-nums">
                        ${article.market_context.btc_price.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {article.market_context.eth_price != null && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">E</span>
                        <span className="text-sm text-text-primary font-medium">ETH</span>
                      </div>
                      <span className="text-sm font-semibold text-text-primary tabular-nums">
                        ${article.market_context.eth_price.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {article.market_context.fear_greed_index != null && (() => {
                    const fg = formatFearGreed(article.market_context!.fear_greed_index!);
                    return (
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="text-xs text-text-tertiary">Fear & Greed</span>
                        <span className={`text-sm font-semibold ${fg.color}`}>
                          {article.market_context!.fear_greed_index} — {fg.label}
                        </span>
                      </div>
                    );
                  })()}
                </div>
                <p className="text-[10px] text-text-tertiary mt-3 pt-2 border-t border-border">
                  Prices at time of publication
                </p>
              </div>
            )}

            {/* More Stories Widget */}
            {sidebarArticles.length > 0 && (
              <div className="rounded-xl border border-border bg-(--color-surface) p-5">
                <h3 className="text-sm font-bold text-text-primary mb-4 uppercase tracking-wide">
                  More Stories
                </h3>
                <div className="space-y-4">
                  {sidebarArticles.map((related, idx) => (
                    <SidebarArticle key={related.id} article={related} showBorder={idx < sidebarArticles.length - 1} />
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter CTA */}
            <div className="rounded-xl border border-border overflow-hidden">
              <NewsletterCTA />
            </div>

            {/* Source Info Widget */}
            <div className="rounded-xl border border-border bg-(--color-surface) p-5">
              <h3 className="text-sm font-bold text-text-primary mb-3 uppercase tracking-wide">
                About the Source
              </h3>
              <div className="flex items-center gap-3 mb-3">
                <Link
                  href={`/source/${article.source_key}`}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent font-bold text-lg shrink-0"
                >
                  {article.source.charAt(0).toUpperCase()}
                </Link>
                <div>
                  <Link
                    href={`/source/${article.source_key}`}
                    className="font-semibold text-text-primary hover:text-accent transition-colors"
                  >
                    {article.source}
                  </Link>
                  <p className="text-xs text-text-tertiary">News source</p>
                </div>
              </div>
              <Link
                href={`/source/${article.source_key}`}
                className="inline-flex items-center gap-1 text-sm text-accent hover:underline font-medium"
              >
                View all articles from {article.source}
                <ChevronIcon />
              </Link>
            </div>
          </aside>
        </div>

        {/* ── Read More Section (Full Width) ── */}
        {bottomArticles.length > 0 && (
          <section className="mt-12 pt-8 border-t-2 border-text-primary">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-text-primary">
                Read More
              </h2>
              <Link
                href={`/?category=${article.category}`}
                className="text-sm font-medium text-accent hover:underline"
              >
                More {article.category} news &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bottomArticles.map((related) => (
                <NewsCard
                  key={related.id}
                  article={toNewsArticle(related)}
                  variant="default"
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Newsletter CTA (Bottom, Full Width) ── */}
        <section className="mt-12 pt-8 border-t border-border">
          <NewsletterCTA />
        </section>
      </main>
      <Footer />
    </>
  );
}

/* ── Helper Components ── */

function ChevronIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-text-tertiary shrink-0">
      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
    </svg>
  );
}

function MarketContextCard({
  label,
  value,
  subValue,
  icon,
  iconBg,
}: {
  label: string;
  value: string;
  subValue?: string;
  icon: string;
  iconBg: string;
}) {
  return (
    <div className="p-3 rounded-lg border border-border bg-(--color-bg-secondary) flex items-center gap-3">
      <span className={`w-8 h-8 rounded-full ${iconBg} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] text-text-tertiary leading-tight">{label}</p>
        <p className="font-semibold text-sm text-text-primary tabular-nums">{value}</p>
        {subValue && <p className="text-[10px] text-text-tertiary">{subValue}</p>}
      </div>
    </div>
  );
}

function SidebarArticle({ article, showBorder }: { article: EnrichedArticle; showBorder: boolean }) {
  const pubDate = article.pub_date ?? article.first_seen;
  const slug = article.slug ?? article.id;

  return (
    <div className={showBorder ? "pb-4 border-b border-border" : ""}>
      <Link
        href={`/article/${slug}`}
        className="group block"
      >
        <div className="flex items-center gap-2 mb-1.5">
          <Badge variant={categoryToBadgeVariant(article.category)} className="text-[10px] px-1.5 py-0">
            {article.category}
          </Badge>
          <span className="text-[11px] text-text-tertiary">
            {new Date(pubDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>
        <h4 className="text-sm font-semibold text-text-primary leading-snug group-hover:text-accent transition-colors line-clamp-3">
          {article.title}
        </h4>
        <p className="text-xs text-text-tertiary mt-1">
          {article.source}
        </p>
      </Link>
    </div>
  );
}
