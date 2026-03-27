/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * Hub — Intelligence-first homepage (prototype)
 * Accessible at /hub while the original homepage remains at /
 */

import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarketBrief from "@/components/hub/MarketBrief";
import LiveDashboard from "@/components/hub/LiveDashboard";
import AskBar from "@/components/hub/AskBar";
import IntelligenceCards from "@/components/hub/IntelligenceCards";
import PlatformCTA from "@/components/hub/PlatformCTA";
import NewsletterCTA from "@/components/NewsletterCTA";
import { SmartFeed } from "@/components/SmartFeed";
import { LiveActivityFeed } from "@/components/LiveActivityFeed";
import { TrendingTopicsWidget } from "@/components/TrendingTopics";
import { SectionHeader } from "@/components/EditorialSection";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  getHomepageNews,
  type NewsResponse,
} from "@/lib/crypto-news";
import { generateSEOMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const revalidate = 300;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generateSEOMetadata({
    title: "Crypto Vision Hub — Live Market Intelligence & Developer Platform",
    description:
      "Real-time crypto intelligence: AI market briefs, whale alerts, trading signals, on-chain analytics, and 477 free API endpoints. Bitcoin, Ethereum, DeFi & more.",
    path: "/hub",
    locale,
    tags: [
      "crypto intelligence",
      "market data",
      "crypto API",
      "whale alerts",
      "trading signals",
      "bitcoin",
      "ethereum",
      "defi",
    ],
  });
}

export default async function HubPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  let latestArticles: NewsResponse["articles"] = [];
  try {
    const data = await getHomepageNews({ latestLimit: 20, trendingLimit: 5 });
    latestArticles = data?.latest?.articles ?? [];
  } catch {
    // Graceful degradation — news feed will be empty
  }

  return (
    <>
      <Header />

      <main id="main-content" className="min-h-screen">
        {/* ── AI Market Brief (Hero) ── */}
        <MarketBrief />

        {/* ── Live Dashboard (Prices + Global Stats) ── */}
        <LiveDashboard />

        {/* ── Ask Anything ── */}
        <AskBar />

        {/* ── Intelligence Cards (Whales, Signals, Movers) ── */}
        <IntelligenceCards />

        {/* ── News + Activity Feed ── */}
        <section className="container-main py-8 lg:py-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
            {/* Smart news feed */}
            <div>
              <SectionHeader title="Latest News" />
              <SmartFeed initialArticles={latestArticles.slice(0, 15)} />
            </div>

            {/* Sidebar — activity + trending */}
            <aside className="space-y-8">
              <Suspense fallback={<Skeleton className="h-64 w-full rounded-lg" />}>
                <LiveActivityFeed maxItems={6} compact />
              </Suspense>

              <Suspense fallback={<Skeleton className="h-48 w-full rounded-lg" />}>
                <TrendingTopicsWidget />
              </Suspense>
            </aside>
          </div>
        </section>

        {/* ── Developer Platform CTA ── */}
        <PlatformCTA />

        {/* ── Newsletter ── */}
        <NewsletterCTA />
      </main>

      <Footer />
    </>
  );
}
