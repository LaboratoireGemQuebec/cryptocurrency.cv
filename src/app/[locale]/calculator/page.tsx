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
import { Calculator } from "lucide-react";
import CryptoCalculator from "@/components/CryptoCalculator";
import type { Metadata } from "next";

// ---------- Types ------------------------------------------------------------

type Props = {
  params: Promise<{ locale: string }>;
};

// ---------- Metadata ---------------------------------------------------------

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generateSEOMetadata({
    title: "Crypto Calculator — Free Crypto News",
    description:
      "Convert between cryptocurrencies and fiat currencies. Real-time rates for Bitcoin, Ethereum, Solana, and more.",
    path: "/calculator",
    locale,
    tags: [
      "crypto calculator",
      "bitcoin converter",
      "crypto converter",
      "btc to usd",
      "eth to usd",
    ],
  });
}

// ---------- Page component ---------------------------------------------------

export const revalidate = 120;

export default async function CalculatorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main className="container-main py-8">
        {/* Heading */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Calculator className="h-7 w-7 text-[var(--color-accent)]" />
            <h1 className="font-serif text-3xl font-bold text-[var(--color-text-primary)]">
              Crypto Calculator
            </h1>
          </div>
          <p className="text-[var(--color-text-secondary)] max-w-2xl">
            Convert between popular cryptocurrencies and fiat currencies using
            real-time market prices.
          </p>
        </div>

        <div className="max-w-xl">
          <CryptoCalculator />
        </div>
      </main>
      <Footer />
    </>
  );
}
