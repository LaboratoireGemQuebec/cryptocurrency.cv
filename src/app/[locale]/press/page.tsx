/**
 * Press Releases Section
 * Clearly labeled sponsored/PR content and project announcements
 */

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE_URL } from '@/lib/constants';
import { PressReleasesClient } from './PressReleasesClient';

export const metadata: Metadata = {
  title: 'Crypto Press Releases | Project Announcements & PR',
  description:
    'Latest crypto press releases, project announcements, partnership news, and sponsored content — clearly labeled and transparent.',
  openGraph: {
    title: 'Crypto Press Releases | Free Crypto News',
    description: 'Transparent crypto press releases, project launches, and partnership announcements.',
    type: 'website',
  },
  keywords: [
    'crypto press releases', 'crypto PR', 'blockchain announcements', 'crypto project launches',
    'crypto partnerships', 'token launch announcement',
  ],
  alternates: { canonical: '/press' },
};

export interface PressRelease {
  id: string;
  title: string;
  organization: string;
  date: string;
  summary: string;
  url: string;
  category: 'launch' | 'partnership' | 'funding' | 'listing' | 'update' | 'milestone' | 'event';
  tags: string[];
  sponsored: boolean;
}

const PRESS_RELEASES: PressRelease[] = [
  {
    id: '1',
    title: 'Arbitrum Foundation Announces $200M Ecosystem Fund',
    organization: 'Arbitrum Foundation',
    date: '2026-02-28',
    summary: 'The Arbitrum Foundation has launched a $200 million fund to support DeFi, gaming, and infrastructure projects building on Arbitrum One and Arbitrum Nova.',
    url: '#',
    category: 'funding',
    tags: ['arbitrum', 'L2', 'ecosystem', 'grants'],
    sponsored: false,
  },
  {
    id: '2',
    title: 'Chainlink Launches Cross-Chain Interoperability Protocol (CCIP) v2',
    organization: 'Chainlink Labs',
    date: '2026-02-25',
    summary: 'Chainlink CCIP v2 introduces enhanced security features, faster finality, and support for 15 additional blockchain networks.',
    url: '#',
    category: 'update',
    tags: ['chainlink', 'interoperability', 'oracle', 'cross-chain'],
    sponsored: false,
  },
  {
    id: '3',
    title: 'Circle Partners with Deutsche Bank for Euro Stablecoin Expansion',
    organization: 'Circle',
    date: '2026-02-22',
    summary: 'Circle and Deutsche Bank have announced a strategic partnership to expand EURC (Euro Coin) adoption across European financial institutions.',
    url: '#',
    category: 'partnership',
    tags: ['stablecoin', 'EURC', 'circle', 'banking'],
    sponsored: false,
  },
  {
    id: '4',
    title: 'Phantom Wallet Surpasses 30 Million Monthly Active Users',
    organization: 'Phantom',
    date: '2026-02-20',
    summary: 'Multi-chain wallet Phantom has reached 30 million monthly active users across Solana, Ethereum, Bitcoin, and Polygon networks.',
    url: '#',
    category: 'milestone',
    tags: ['phantom', 'wallet', 'solana', 'growth'],
    sponsored: false,
  },
  {
    id: '5',
    title: 'Ondo Finance Receives SEC No-Action Letter for Tokenized Treasuries',
    organization: 'Ondo Finance',
    date: '2026-02-18',
    summary: 'Ondo Finance has received a no-action letter from the SEC, clearing the path for its tokenized US Treasury products to be offered to qualified investors.',
    url: '#',
    category: 'milestone',
    tags: ['RWA', 'treasuries', 'SEC', 'regulation'],
    sponsored: false,
  },
  {
    id: '6',
    title: 'New DeFi Protocol XYZ Launches on Base with $50M TVL',
    organization: 'XYZ Protocol',
    date: '2026-02-15',
    summary: 'XYZ Protocol launches its innovative perpetual DEX on Base L2, reaching $50M in TVL within the first 48 hours. [Sponsored]',
    url: '#',
    category: 'launch',
    tags: ['defi', 'base', 'DEX', 'perpetuals'],
    sponsored: true,
  },
  {
    id: '7',
    title: 'Binance Lists PYTH Token on Spot Market',
    organization: 'Binance',
    date: '2026-02-12',
    summary: 'Binance has listed the Pyth Network (PYTH) token on its spot market, opening PYTH/USDT and PYTH/BTC trading pairs.',
    url: '#',
    category: 'listing',
    tags: ['binance', 'pyth', 'listing', 'oracle'],
    sponsored: false,
  },
  {
    id: '8',
    title: 'ETHGlobal Announces Largest-Ever Hackathon with $1M in Prizes',
    organization: 'ETHGlobal',
    date: '2026-02-10',
    summary: 'ETHGlobal will host its largest hackathon to date with over $1 million in prizes and participation from 50+ sponsor projects.',
    url: '#',
    category: 'event',
    tags: ['ethereum', 'hackathon', 'developers', 'prizes'],
    sponsored: false,
  },
];

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PressReleasesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />
      <main id="main-content" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📢 Press Releases
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            Project announcements, partnership news, and launches — clearly labeled so you always know what&apos;s editorial vs. PR.
          </p>
        </div>

        {/* Transparency notice */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 mb-8">
          <h2 className="font-semibold text-amber-900 dark:text-amber-200 mb-1 flex items-center gap-2">
            <span>⚠️</span> Transparency Notice
          </h2>
          <p className="text-sm text-amber-800 dark:text-amber-300">
            Press releases are submitted by projects and organizations. Sponsored content is clearly labeled with a 
            <span className="inline-flex items-center mx-1 px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-200 text-yellow-800">Sponsored</span>
            badge. This content has not been independently verified by our editorial team. DYOR.
          </p>
        </div>

        <PressReleasesClient releases={PRESS_RELEASES} />
      </main>
      <Footer />
    </div>
  );
}
