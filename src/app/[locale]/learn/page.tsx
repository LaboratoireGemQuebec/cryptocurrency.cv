/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * This file is part of free-crypto-news.
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * For licensing inquiries: nirholas@users.noreply.github.com
 */

/**
 * Learn / Crypto Education Hub
 * Guides, tutorials, and educational content for all skill levels
 */

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Learn Crypto | Beginner Guides, Tutorials & Education',
  description:
    'Free crypto education — learn about Bitcoin, Ethereum, DeFi, NFTs, trading, security, and more. Beginner to advanced guides.',
  openGraph: {
    title: 'Learn Crypto | Free Crypto News',
    description: 'Free guides, tutorials, and resources to learn about cryptocurrency and blockchain.',
    type: 'website',
    images: [{ url: `${SITE_URL}/api/og/learn`, width: 1200, height: 630 }],
  },
  keywords: [
    'learn crypto', 'crypto education', 'what is bitcoin', 'how to buy crypto',
    'defi explained', 'blockchain tutorial', 'crypto glossary', 'crypto for beginners',
  ],
  alternates: { canonical: '/learn' },
};

interface LearningTrack {
  id: string;
  emoji: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  lessons: { title: string; href: string; duration: string }[];
}

const tracks: LearningTrack[] = [
  {
    id: 'getting-started',
    emoji: '🚀',
    title: 'Getting Started with Crypto',
    description: 'Everything you need to know to begin your crypto journey.',
    level: 'beginner',
    lessons: [
      { title: 'What Is Cryptocurrency?', href: '/learn/what-is-cryptocurrency', duration: '5 min' },
      { title: 'What Is Bitcoin?', href: '/learn/what-is-bitcoin', duration: '7 min' },
      { title: 'What Is Ethereum?', href: '/learn/what-is-ethereum', duration: '6 min' },
      { title: 'How to Buy Your First Crypto', href: '/learn/how-to-buy-crypto', duration: '8 min' },
      { title: 'Crypto Wallets Explained', href: '/learn/crypto-wallets', duration: '6 min' },
      { title: 'Keeping Your Crypto Safe', href: '/learn/crypto-security', duration: '10 min' },
    ],
  },
  {
    id: 'defi',
    emoji: '🏦',
    title: 'DeFi (Decentralized Finance)',
    description: 'Understand lending, borrowing, yield farming, and more.',
    level: 'intermediate',
    lessons: [
      { title: 'What Is DeFi?', href: '/learn/what-is-defi', duration: '6 min' },
      { title: 'Decentralized Exchanges (DEXs)', href: '/learn/decentralized-exchanges', duration: '7 min' },
      { title: 'Yield Farming & Liquidity Mining', href: '/learn/yield-farming', duration: '8 min' },
      { title: 'Stablecoins Explained', href: '/learn/stablecoins', duration: '5 min' },
      { title: 'Impermanent Loss', href: '/learn/impermanent-loss', duration: '7 min' },
    ],
  },
  {
    id: 'trading',
    emoji: '📈',
    title: 'Trading & Technical Analysis',
    description: 'Learn to read charts, use indicators, and manage risk.',
    level: 'intermediate',
    lessons: [
      { title: 'How to Read Crypto Charts', href: '/learn/reading-charts', duration: '10 min' },
      { title: 'Candlestick Patterns', href: '/learn/candlestick-patterns', duration: '8 min' },
      { title: 'Support & Resistance', href: '/learn/support-resistance', duration: '6 min' },
      { title: 'Risk Management', href: '/learn/risk-management', duration: '7 min' },
      { title: 'Dollar-Cost Averaging (DCA)', href: '/learn/dca-strategy', duration: '5 min' },
    ],
  },
  {
    id: 'advanced',
    emoji: '🔬',
    title: 'Advanced Topics',
    description: 'Deep dives into Layer 2s, MEV, ZK proofs, and more.',
    level: 'advanced',
    lessons: [
      { title: 'Layer 2 Scaling Solutions', href: '/learn/layer-2-scaling', duration: '10 min' },
      { title: 'Zero-Knowledge Proofs', href: '/learn/zero-knowledge-proofs', duration: '12 min' },
      { title: 'MEV (Maximal Extractable Value)', href: '/learn/mev-explained', duration: '9 min' },
      { title: 'Tokenomics & Token Design', href: '/learn/tokenomics', duration: '8 min' },
      { title: 'Smart Contract Security', href: '/learn/smart-contract-security', duration: '11 min' },
    ],
  },
  {
    id: 'nfts',
    emoji: '🎨',
    title: 'NFTs & Digital Collectibles',
    description: 'Understand non-fungible tokens, marketplaces, and use cases.',
    level: 'beginner',
    lessons: [
      { title: 'What Are NFTs?', href: '/learn/what-are-nfts', duration: '5 min' },
      { title: 'How to Buy & Sell NFTs', href: '/learn/buy-sell-nfts', duration: '7 min' },
      { title: 'NFT Marketplaces Compared', href: '/learn/nft-marketplaces', duration: '6 min' },
      { title: 'NFT Use Cases Beyond Art', href: '/learn/nft-use-cases', duration: '8 min' },
    ],
  },
  {
    id: 'security',
    emoji: '🔒',
    title: 'Security & Self-Custody',
    description: 'Protect your assets from hacks, scams, and phishing.',
    level: 'beginner',
    lessons: [
      { title: 'Hardware Wallets Guide', href: '/learn/hardware-wallets', duration: '8 min' },
      { title: 'Seed Phrase Safety', href: '/learn/seed-phrase-safety', duration: '5 min' },
      { title: 'Common Crypto Scams', href: '/learn/crypto-scams', duration: '7 min' },
      { title: 'Two-Factor Authentication', href: '/learn/2fa-guide', duration: '4 min' },
    ],
  },
];

const levelConfig = {
  beginner:     { label: 'Beginner', color: 'text-green-700 dark:text-green-300', bg: 'bg-green-100 dark:bg-green-900/40' },
  intermediate: { label: 'Intermediate', color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-100 dark:bg-amber-900/40' },
  advanced:     { label: 'Advanced', color: 'text-red-700 dark:text-red-300', bg: 'bg-red-100 dark:bg-red-900/40' },
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LearnPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Header />
      <main id="main-content" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            📚 Learn Crypto
          </h1>
          <p className="text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
            Free, comprehensive guides for beginners and experts. No jargon, no gatekeeping — just clear crypto education.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Link
              href="/learn/glossary"
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition text-sm"
            >
              📖 Glossary (200+ terms)
            </Link>
            <Link
              href="/learn/what-is-cryptocurrency"
              className="px-5 py-2.5 rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-neutral-900 transition text-sm"
            >
              Start from scratch →
            </Link>
          </div>
        </div>

        {/* Tracks grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map(track => {
            const lvl = levelConfig[track.level];
            return (
              <div key={track.id} className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-neutral-800 p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{track.emoji}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${lvl.bg} ${lvl.color}`}>
                    {lvl.label}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{track.title}</h2>
                <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">{track.description}</p>
                <ul className="space-y-2">
                  {track.lessons.map(lesson => (
                    <li key={lesson.href}>
                      <Link
                        href={lesson.href}
                        className="flex items-center justify-between group text-sm text-gray-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition"
                      >
                        <span className="group-hover:translate-x-1 transition-transform">→ {lesson.title}</span>
                        <span className="text-xs text-gray-400 dark:text-slate-500">{lesson.duration}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-3">{track.lessons.length} lessons</p>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
