/**
 * Token Unlocks Calendar
 * Vesting schedules, upcoming supply events, and unlock impact analysis
 */

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE_URL } from '@/lib/constants';
import { TokenUnlocksClient } from './TokenUnlocksClient';

export const metadata: Metadata = {
  title: 'Token Unlocks Calendar | Vesting Schedules & Supply Events',
  description:
    'Track upcoming token unlocks, vesting schedules, and supply events. Know when tokens hit the market to anticipate price impact.',
  openGraph: {
    title: 'Token Unlocks Calendar | Free Crypto News',
    description: 'Track token vesting schedules and upcoming supply events that can impact prices.',
    type: 'website',
    images: [{ url: `${SITE_URL}/api/og/unlocks`, width: 1200, height: 630 }],
  },
  keywords: [
    'token unlocks', 'crypto vesting schedule', 'token unlock calendar', 'supply events',
    'token vesting', 'crypto unlock', 'circulating supply', 'token release schedule',
  ],
  alternates: { canonical: '/unlocks' },
};

export interface TokenUnlock {
  id: string;
  token: string;
  symbol: string;
  unlockDate: string;
  unlockAmount: string;
  unlockValue: string;
  percentOfSupply: string;
  recipient: string;
  vestingType: 'linear' | 'cliff' | 'periodic';
  chain: string;
  totalLocked: string;
  nextUnlock?: string;
  impact: 'high' | 'medium' | 'low';
  description: string;
}

const TOKEN_UNLOCKS: TokenUnlock[] = [
  {
    id: '1',
    token: 'Arbitrum',
    symbol: 'ARB',
    unlockDate: '2026-03-16',
    unlockAmount: '92.65M ARB',
    unlockValue: '~$120M',
    percentOfSupply: '0.93%',
    recipient: 'Team & Advisors',
    vestingType: 'cliff',
    chain: 'Arbitrum',
    totalLocked: '3.7B ARB',
    impact: 'high',
    description: 'Monthly cliff unlock for team and early contributors. One of the larger scheduled unlocks.',
  },
  {
    id: '2',
    token: 'Optimism',
    symbol: 'OP',
    unlockDate: '2026-03-31',
    unlockAmount: '31.34M OP',
    unlockValue: '~$85M',
    percentOfSupply: '0.73%',
    recipient: 'Core Contributors',
    vestingType: 'periodic',
    chain: 'Optimism',
    totalLocked: '2.1B OP',
    impact: 'medium',
    description: 'Core contributor vesting release. Part of the ongoing distribution to the Optimism Collective.',
  },
  {
    id: '3',
    token: 'Aptos',
    symbol: 'APT',
    unlockDate: '2026-03-12',
    unlockAmount: '11.31M APT',
    unlockValue: '~$130M',
    percentOfSupply: '1.03%',
    recipient: 'Foundation, Investors, Core Contributors',
    vestingType: 'periodic',
    chain: 'Aptos',
    totalLocked: '550M APT',
    impact: 'high',
    description: 'Monthly unlock for investors and core contributors. Represents significant supply increase.',
  },
  {
    id: '4',
    token: 'Sui',
    symbol: 'SUI',
    unlockDate: '2026-04-01',
    unlockAmount: '64.19M SUI',
    unlockValue: '~$95M',
    percentOfSupply: '0.64%',
    recipient: 'Series A & B Investors',
    vestingType: 'cliff',
    chain: 'Sui',
    totalLocked: '4.2B SUI',
    impact: 'medium',
    description: 'Investor vesting cliff unlock. Early investors begin receiving tokens.',
  },
  {
    id: '5',
    token: 'Worldcoin',
    symbol: 'WLD',
    unlockDate: '2026-07-24',
    unlockAmount: '600M WLD',
    unlockValue: '~$1.5B',
    percentOfSupply: '6.0%',
    recipient: 'Community & TFH',
    vestingType: 'cliff',
    chain: 'Optimism',
    totalLocked: '7.5B WLD',
    impact: 'high',
    description: 'Major cliff unlock for the Worldcoin community allocation and Tools for Humanity reserves.',
  },
  {
    id: '6',
    token: 'Celestia',
    symbol: 'TIA',
    unlockDate: '2026-10-31',
    unlockAmount: '175.6M TIA',
    unlockValue: '~$700M',
    percentOfSupply: '17.56%',
    recipient: 'Early Backers & Core Contributors',
    vestingType: 'cliff',
    chain: 'Celestia',
    totalLocked: '530M TIA',
    impact: 'high',
    description: 'Massive cliff unlock for initial investors and contributors. One of the biggest unlocks in 2026.',
  },
  {
    id: '7',
    token: 'Starknet',
    symbol: 'STRK',
    unlockDate: '2026-04-15',
    unlockAmount: '127M STRK',
    unlockValue: '~$180M',
    percentOfSupply: '1.27%',
    recipient: 'Early Contributors',
    vestingType: 'linear',
    chain: 'StarkNet',
    totalLocked: '3.5B STRK',
    impact: 'medium',
    description: 'Linear vesting release for StarkNet early contributors and developers.',
  },
  {
    id: '8',
    token: 'Jito',
    symbol: 'JTO',
    unlockDate: '2026-12-07',
    unlockAmount: '135M JTO',
    unlockValue: '~$400M',
    percentOfSupply: '13.5%',
    recipient: 'Core Contributors & Investors',
    vestingType: 'cliff',
    chain: 'Solana',
    totalLocked: '700M JTO',
    impact: 'high',
    description: 'Year-one cliff unlock for core contributors and seed investors in the Solana MEV protocol.',
  },
];

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function TokenUnlocksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />
      <main id="main-content" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🔓 Token Unlocks
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            Upcoming vesting cliffs, linear unlocks, and supply events — know when tokens hit the market.
          </p>
        </div>

        {/* Educational banner */}
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50 rounded-xl p-4 mb-8">
          <h2 className="font-semibold text-purple-900 dark:text-purple-200 mb-2 flex items-center gap-2">
            <span>📊</span> Why Token Unlocks Matter
          </h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-purple-800 dark:text-purple-300">
            <div>
              <strong>Supply Pressure:</strong> Large unlocks increase circulating supply, which can create selling pressure if recipients liquidate.
            </div>
            <div>
              <strong>Cliff vs Linear:</strong> Cliff unlocks release a lump sum at once (higher impact). Linear unlocks distribute gradually over time.
            </div>
            <div>
              <strong>Recipient Matters:</strong> Team/investor unlocks often create more selling pressure than community or ecosystem unlocks.
            </div>
          </div>
        </div>

        <TokenUnlocksClient unlocks={TOKEN_UNLOCKS} />
      </main>
      <Footer />
    </div>
  );
}
