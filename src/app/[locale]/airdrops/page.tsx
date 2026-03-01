/**
 * Airdrop Tracker
 * Track upcoming, active, and past crypto airdrops with eligibility and deadlines
 */

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE_URL } from '@/lib/constants';
import { AirdropTrackerClient } from './AirdropTrackerClient';

export const metadata: Metadata = {
  title: 'Crypto Airdrop Tracker | Upcoming Airdrops & Eligibility',
  description:
    'Track upcoming, active, and past crypto airdrops. Check eligibility criteria, deadlines, estimated values, and claim instructions.',
  openGraph: {
    title: 'Crypto Airdrop Tracker | Free Crypto News',
    description: 'Never miss a free crypto airdrop. Track eligibility, deadlines, and estimated values.',
    type: 'website',
    images: [{ url: `${SITE_URL}/api/og/airdrops`, width: 1200, height: 630 }],
  },
  keywords: [
    'crypto airdrop', 'free crypto', 'airdrop tracker', 'upcoming airdrops',
    'crypto airdrop eligibility', 'token airdrop', 'defi airdrop',
  ],
  alternates: { canonical: '/airdrops' },
};

export interface Airdrop {
  id: string;
  name: string;
  token: string;
  project: string;
  chain: string;
  status: 'upcoming' | 'active' | 'ended';
  estimatedValue: string;
  totalAllocation: string;
  snapshotDate?: string;
  claimDeadline?: string;
  eligibility: string[];
  url: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  verified: boolean;
}

const AIRDROPS: Airdrop[] = [
  {
    id: '1',
    name: 'LayerZero Season 2',
    token: 'ZRO',
    project: 'LayerZero',
    chain: 'Multi-chain',
    status: 'upcoming',
    estimatedValue: '$200-2,000',
    totalAllocation: 'TBA',
    eligibility: [
      'Bridge assets via LayerZero-powered bridges (Stargate, etc.)',
      'Use LayerZero on multiple chains',
      'Maintain consistent activity over 6+ months',
    ],
    url: 'https://layerzero.network',
    description: 'Expected second airdrop from the cross-chain messaging protocol. Season 1 distributed 85M ZRO tokens.',
    difficulty: 'medium',
    verified: false,
  },
  {
    id: '2',
    name: 'Berachain',
    token: 'BERA',
    project: 'Berachain',
    chain: 'Berachain',
    status: 'upcoming',
    estimatedValue: '$500-5,000',
    totalAllocation: '~15% of supply',
    snapshotDate: '2026-Q2 (est.)',
    eligibility: [
      'Participate in Berachain testnet (Artio & bArtio)',
      'Provide liquidity on Berachain DEX',
      'Delegate BGT to validators',
      'Active participation in governance',
    ],
    url: 'https://berachain.com',
    description: 'Novel Proof-of-Liquidity L1 with strong community. Testnet has been live since early 2024.',
    difficulty: 'medium',
    verified: false,
  },
  {
    id: '3',
    name: 'Monad',
    token: 'MON',
    project: 'Monad',
    chain: 'Monad',
    status: 'upcoming',
    estimatedValue: '$1,000-10,000',
    totalAllocation: 'TBA',
    eligibility: [
      'Join the Monad community (Discord, Twitter)',
      'Participate in testnet when live',
      'Engage with ecosystem dApps',
    ],
    url: 'https://monad.xyz',
    description: 'High-performance EVM-compatible L1 that raised $225M. Community expects a significant airdrop at mainnet.',
    difficulty: 'easy',
    verified: false,
  },
  {
    id: '4',
    name: 'Scroll Airdrop',
    token: 'SCR',
    project: 'Scroll',
    chain: 'Scroll (L2)',
    status: 'active',
    estimatedValue: '$100-1,000',
    totalAllocation: '7% of total supply',
    claimDeadline: '2026-04-30',
    eligibility: [
      'Bridge ETH to Scroll',
      'Interact with Scroll DeFi protocols',
      'Hold Scroll Canvas profile NFT',
      'Active usage during specified period',
    ],
    url: 'https://scroll.io/airdrop',
    description: 'zkEVM Layer 2 airdrop for early users and ecosystem participants.',
    difficulty: 'easy',
    verified: true,
  },
  {
    id: '5',
    name: 'Hyperliquid Season 2',
    token: 'HYPE',
    project: 'Hyperliquid',
    chain: 'Hyperliquid L1',
    status: 'upcoming',
    estimatedValue: '$500-5,000',
    totalAllocation: 'TBA',
    eligibility: [
      'Trade on Hyperliquid perpetuals',
      'Provide liquidity in HLP vault',
      'Use Hyperliquid spot market',
      'Participate in auctions',
    ],
    url: 'https://hyperliquid.xyz',
    description: 'Community-first perp DEX. Season 1 was one of the largest airdrops in crypto history ($1.2B+).',
    difficulty: 'medium',
    verified: false,
  },
  {
    id: '6',
    name: 'Starknet STRK Round 2',
    token: 'STRK',
    project: 'StarkNet',
    chain: 'StarkNet (L2)',
    status: 'upcoming',
    estimatedValue: '$100-500',
    totalAllocation: '~9% of supply remaining',
    eligibility: [
      'Bridge to StarkNet and use dApps',
      'Deploy or interact with smart contracts',
      'Participate in governance',
    ],
    url: 'https://starknet.io',
    description: 'Expected second distribution for active StarkNet users. First round distributed 700M STRK.',
    difficulty: 'hard',
    verified: false,
  },
  {
    id: '7',
    name: 'Arbitrum DAO Grant',
    token: 'ARB',
    project: 'Arbitrum',
    chain: 'Arbitrum',
    status: 'ended',
    estimatedValue: '$50-200',
    totalAllocation: '100M ARB',
    eligibility: [
      'Was an active Arbitrum user (completed)',
      'Participated in DAO votes',
    ],
    url: 'https://arbitrum.io',
    description: 'Community airdrop for DAO governance participants. Claim period ended.',
    difficulty: 'easy',
    verified: true,
  },
];

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AirdropsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />
      <main id="main-content" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🪂 Airdrop Tracker
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            Track upcoming, active, and past crypto airdrops. Check eligibility and never miss free tokens.
          </p>
        </div>

        {/* Safety warning */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-4 mb-8">
          <h2 className="font-semibold text-red-900 dark:text-red-200 mb-1 flex items-center gap-2">
            <span>🛡️</span> Airdrop Safety
          </h2>
          <div className="grid md:grid-cols-3 gap-3 text-sm text-red-800 dark:text-red-300">
            <div><strong>Never share your seed phrase</strong> — no legitimate airdrop requires it.</div>
            <div><strong>Verify official links</strong> — scammers create fake claim sites. Always check official project channels.</div>
            <div><strong>Be cautious of &quot;connect wallet&quot;</strong> — only interact with trusted dApps. Revoke unused approvals.</div>
          </div>
        </div>

        <AirdropTrackerClient airdrops={AIRDROPS} />
      </main>
      <Footer />
    </div>
  );
}
