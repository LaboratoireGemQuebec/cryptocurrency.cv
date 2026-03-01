/**
 * Exchange Reviews & Comparisons
 * Compare crypto exchanges by fees, features, security, and trust scores
 */

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE_URL } from '@/lib/constants';
import { ExchangeReviewsClient } from './ExchangeReviewsClient';

export const metadata: Metadata = {
  title: 'Crypto Exchange Reviews & Comparison | Best Exchanges 2026',
  description:
    'Compare the best crypto exchanges side-by-side. Fees, security, features, supported coins, and trust scores for Coinbase, Binance, Kraken, and more.',
  openGraph: {
    title: 'Best Crypto Exchanges Compared | Free Crypto News',
    description: 'Side-by-side comparison of top crypto exchanges with fees, security ratings, and trust scores.',
    type: 'website',
    images: [{ url: `${SITE_URL}/api/og/exchanges`, width: 1200, height: 630 }],
  },
  keywords: [
    'crypto exchange review', 'best crypto exchange', 'exchange comparison', 'crypto exchange fees',
    'coinbase review', 'binance review', 'kraken review', 'crypto trading platform',
  ],
  alternates: { canonical: '/exchanges' },
};

export interface Exchange {
  id: string;
  name: string;
  logo: string;
  founded: number;
  headquarters: string;
  trustScore: number;       // 1-10
  overallRating: number;    // 1-5
  tradingFees: { maker: string; taker: string };
  depositFees: string;
  withdrawalFees: string;
  supportedCoins: number;
  volume24h: string;
  kyc: 'required' | 'optional' | 'none';
  features: string[];
  pros: string[];
  cons: string[];
  url: string;
  regulated: boolean;
  proofOfReserves: boolean;
  insuranceFund: boolean;
  categories: string[];
}

const EXCHANGES: Exchange[] = [
  {
    id: 'coinbase',
    name: 'Coinbase',
    logo: '/images/exchanges/coinbase.png',
    founded: 2012,
    headquarters: 'San Francisco, USA',
    trustScore: 10,
    overallRating: 4.5,
    tradingFees: { maker: '0.40%', taker: '0.60%' },
    depositFees: 'Free (bank transfer)',
    withdrawalFees: 'Network fees',
    supportedCoins: 250,
    volume24h: '$2.1B',
    kyc: 'required',
    features: ['Staking', 'Earn', 'Vault', 'Advanced Trading', 'Wallet', 'NFT Marketplace', 'Learning Rewards'],
    pros: ['Publicly traded (NASDAQ: COIN)', 'Strongest regulatory compliance', 'Insurance on USD balances', 'Beginner-friendly UI'],
    cons: ['Higher trading fees', 'Limited altcoin selection vs competitors', 'Customer support can be slow'],
    url: 'https://coinbase.com',
    regulated: true,
    proofOfReserves: true,
    insuranceFund: true,
    categories: ['beginner', 'US-friendly', 'regulated'],
  },
  {
    id: 'binance',
    name: 'Binance',
    logo: '/images/exchanges/binance.png',
    founded: 2017,
    headquarters: 'Multiple jurisdictions',
    trustScore: 8,
    overallRating: 4.3,
    tradingFees: { maker: '0.10%', taker: '0.10%' },
    depositFees: 'Free (crypto)',
    withdrawalFees: 'Varies by coin',
    supportedCoins: 600,
    volume24h: '$12.5B',
    kyc: 'required',
    features: ['Futures', 'Options', 'Staking', 'Launchpad', 'P2P', 'Earn', 'Copy Trading', 'Binance Pay'],
    pros: ['Lowest trading fees', 'Largest coin selection', 'Highest liquidity globally', 'Comprehensive feature set'],
    cons: ['Regulatory issues in some countries', 'Complex for beginners', 'Restricted in US (Binance.US only)'],
    url: 'https://binance.com',
    regulated: true,
    proofOfReserves: true,
    insuranceFund: true,
    categories: ['advanced', 'high-volume', 'altcoins'],
  },
  {
    id: 'kraken',
    name: 'Kraken',
    logo: '/images/exchanges/kraken.png',
    founded: 2011,
    headquarters: 'San Francisco, USA',
    trustScore: 9,
    overallRating: 4.4,
    tradingFees: { maker: '0.16%', taker: '0.26%' },
    depositFees: 'Free (bank transfer)',
    withdrawalFees: 'Low, varies',
    supportedCoins: 200,
    volume24h: '$1.8B',
    kyc: 'required',
    features: ['Futures', 'Margin Trading', 'Staking', 'OTC Desk', 'Kraken Pro'],
    pros: ['Never been hacked', 'Strong security track record', 'Competitive fees', 'Good for US users'],
    cons: ['Fewer coins than Binance', 'UI less polished than Coinbase', 'Slower bank deposits'],
    url: 'https://kraken.com',
    regulated: true,
    proofOfReserves: true,
    insuranceFund: false,
    categories: ['security', 'US-friendly', 'regulated'],
  },
  {
    id: 'bybit',
    name: 'Bybit',
    logo: '/images/exchanges/bybit.png',
    founded: 2018,
    headquarters: 'Dubai, UAE',
    trustScore: 7,
    overallRating: 4.2,
    tradingFees: { maker: '0.10%', taker: '0.10%' },
    depositFees: 'Free (crypto)',
    withdrawalFees: 'Varies',
    supportedCoins: 500,
    volume24h: '$5.2B',
    kyc: 'required',
    features: ['Derivatives', 'Copy Trading', 'Launchpad', 'Earn', 'NFT Marketplace', 'Bot Trading'],
    pros: ['Top derivatives exchange', 'Excellent trading tools', 'Fast execution', 'Good liquidity'],
    cons: ['Not available in US', 'Newer than competitors', 'Complex for beginners'],
    url: 'https://bybit.com',
    regulated: true,
    proofOfReserves: true,
    insuranceFund: true,
    categories: ['derivatives', 'advanced', 'high-volume'],
  },
  {
    id: 'okx',
    name: 'OKX',
    logo: '/images/exchanges/okx.png',
    founded: 2017,
    headquarters: 'Seychelles',
    trustScore: 7,
    overallRating: 4.1,
    tradingFees: { maker: '0.08%', taker: '0.10%' },
    depositFees: 'Free (crypto)',
    withdrawalFees: 'Varies',
    supportedCoins: 350,
    volume24h: '$3.8B',
    kyc: 'optional',
    features: ['Web3 Wallet', 'DEX Aggregator', 'Earn', 'Copy Trading', 'Futures'],
    pros: ['Excellent Web3 wallet', 'Low fees', 'Strong DeFi integration', 'Good mobile app'],
    cons: ['Not available in US', 'Regulatory uncertainty', 'Less known in Western markets'],
    url: 'https://okx.com',
    regulated: true,
    proofOfReserves: true,
    insuranceFund: true,
    categories: ['web3', 'defi', 'advanced'],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    logo: '/images/exchanges/gemini.png',
    founded: 2014,
    headquarters: 'New York, USA',
    trustScore: 9,
    overallRating: 4.0,
    tradingFees: { maker: '0.20%', taker: '0.40%' },
    depositFees: 'Free (bank transfer)',
    withdrawalFees: '10 free/month',
    supportedCoins: 100,
    volume24h: '$200M',
    kyc: 'required',
    features: ['Earn', 'ActiveTrader', 'Staking', 'Credit Card', 'Gemini Dollar (GUSD)'],
    pros: ['NYDFS regulated', 'Insurance on hot wallet', 'Clean interface', 'Gemini Dollar stablecoin'],
    cons: ['Fewer coins', 'Higher fees on standard platform', 'Lower volume'],
    url: 'https://gemini.com',
    regulated: true,
    proofOfReserves: true,
    insuranceFund: true,
    categories: ['beginner', 'US-friendly', 'regulated', 'security'],
  },
];

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ExchangesReviewPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />
      <main id="main-content" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🏦 Exchange Reviews & Comparison
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            Side-by-side comparison of the best crypto exchanges. Fees, security, features, and trust scores — updated for 2026.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl p-4 mb-8">
          <h2 className="font-semibold text-blue-900 dark:text-blue-200 mb-1 flex items-center gap-2">
            <span>ℹ️</span> Editorial Independence
          </h2>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            These reviews are independent and unsponsored. We do not accept payment for rankings or reviews. 
            Ratings are based on publicly available data including security history, regulatory compliance, fees, and user experience. 
            Not financial advice — always DYOR.
          </p>
        </div>

        <ExchangeReviewsClient exchanges={EXCHANGES} />
      </main>
      <Footer />
    </div>
  );
}
