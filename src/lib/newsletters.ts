/**
 * @copyright 2024-2026 nirholas. All rights reserved.
 * @license SPDX-License-Identifier: SEE LICENSE IN LICENSE
 * @see https://github.com/nirholas/free-crypto-news
 *
 * Newsletter definitions and types
 */

export interface Newsletter {
  id: string;
  name: string;
  slug: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'biweekly';
  icon: string;
  category: 'news' | 'markets' | 'defi' | 'education' | 'developer';
  sampleSubject: string;
  subscriberCount?: number;
  previewUrl?: string;
}

export const NEWSLETTERS: Newsletter[] = [
  {
    id: 'daily-digest',
    name: 'Daily Digest',
    slug: 'daily-digest',
    description:
      'The top crypto stories delivered every morning. Headlines, prices, and market moves — everything you need in 5 minutes.',
    frequency: 'daily',
    icon: 'Newspaper',
    category: 'news',
    sampleSubject: 'BTC breaks $100K, Ethereum L2 TVL hits record, SEC ruling on staking',
  },
  {
    id: 'market-pulse',
    name: 'Market Pulse',
    slug: 'market-pulse',
    description:
      'Weekly market analysis with price charts, on-chain metrics, sentiment indicators, and trading signals from our data pipeline.',
    frequency: 'weekly',
    icon: 'TrendingUp',
    category: 'markets',
    sampleSubject: 'Weekly: BTC funding rates diverge, stablecoin inflows surge 40%',
  },
  {
    id: 'defi-dispatch',
    name: 'DeFi Dispatch',
    slug: 'defi-dispatch',
    description:
      'Weekly deep-dive into DeFi: yield opportunities, protocol updates, TVL shifts, governance votes, and security incidents.',
    frequency: 'weekly',
    icon: 'Layers',
    category: 'defi',
    sampleSubject: 'This week in DeFi: Aave v4 launch, restaking wars heat up',
  },
  {
    id: 'dev-weekly',
    name: 'Developer Weekly',
    slug: 'dev-weekly',
    description:
      'API updates, new endpoints, SDK releases, and developer tips for building on the free-crypto-news platform.',
    frequency: 'weekly',
    icon: 'Code',
    category: 'developer',
    sampleSubject: 'New: Solana DeFi endpoints, Python SDK v2.0, WebSocket improvements',
  },
  {
    id: 'learn-crypto',
    name: 'Learn Crypto',
    slug: 'learn-crypto',
    description:
      'Biweekly educational content: explainers, glossary terms, beginner guides, and how-to articles for crypto newcomers.',
    frequency: 'biweekly',
    icon: 'GraduationCap',
    category: 'education',
    sampleSubject: "What are Layer 2s? A beginner's guide to Ethereum scaling",
  },
];

export function getNewsletterBySlug(slug: string): Newsletter | undefined {
  return NEWSLETTERS.find((n) => n.slug === slug);
}

export function getValidNewsletterIds(): string[] {
  return NEWSLETTERS.map((n) => n.id);
}
