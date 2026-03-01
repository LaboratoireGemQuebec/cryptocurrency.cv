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
 * Videos & Podcasts — Crypto Multimedia Hub
 * Curated crypto video content and podcast directory
 */

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE_URL } from '@/lib/constants';
import { VideoPodcastClient } from './VideoPodcastClient';
import type { VideoItem, PodcastShow } from './types';

export type { VideoItem, PodcastShow };

export const metadata: Metadata = {
  title: 'Crypto Videos & Podcasts | Watch & Listen',
  description:
    'Curated crypto videos, podcasts, and multimedia content. Stay informed with top crypto YouTube channels, podcasts, and live streams.',
  openGraph: {
    title: 'Crypto Videos & Podcasts | Free Crypto News',
    description: 'Watch and listen to the best crypto content — videos, podcasts, and live streams.',
    type: 'website',
    images: [{ url: `${SITE_URL}/api/og/videos`, width: 1200, height: 630 }],
  },
  keywords: [
    'crypto videos', 'crypto podcasts', 'bitcoin podcast', 'crypto youtube',
    'blockchain podcast', 'crypto livestream', 'defi podcast', 'web3 video',
  ],
  alternates: { canonical: '/videos' },
};

const FEATURED_CHANNELS = [
  { name: 'Coin Bureau', url: 'https://youtube.com/@CoinBureau', subscribers: '2.4M', emoji: '🎓', description: 'In-depth crypto research & education' },
  { name: 'Bankless', url: 'https://youtube.com/@Bankless', subscribers: '870K', emoji: '🏦', description: 'DeFi, Ethereum & crypto culture' },
  { name: 'Real Vision', url: 'https://youtube.com/@RealVisionFinance', subscribers: '1.1M', emoji: '📊', description: 'Macro & crypto finance interviews' },
  { name: 'Unchained', url: 'https://youtube.com/@UnchainedPodcast', subscribers: '280K', emoji: '⛓️', description: 'In-depth crypto journalism' },
  { name: 'The Defiant', url: 'https://youtube.com/@TheDefiant', subscribers: '145K', emoji: '✊', description: 'DeFi news & analysis' },
  { name: 'Whiteboard Crypto', url: 'https://youtube.com/@WhiteboardCrypto', subscribers: '820K', emoji: '📝', description: 'Crypto explained simply' },
];

const PODCASTS: PodcastShow[] = [
  {
    id: 'unchained',
    name: 'Unchained',
    host: 'Laura Shin',
    description: 'Your no-hype resource for all things crypto. Interviews with industry leaders covering Bitcoin, Ethereum, DeFi, and regulation.',
    logo: '/images/podcasts/unchained.png',
    platforms: [
      { name: 'Apple Podcasts', url: 'https://podcasts.apple.com/podcast/unchained/id1123922160' },
      { name: 'Spotify', url: 'https://open.spotify.com/show/5Glu3jXVFqfyqHPvEbJzNR' },
    ],
    category: 'Interviews',
    frequency: 'Twice weekly',
    rating: 4.8,
  },
  {
    id: 'bankless',
    name: 'Bankless',
    host: 'Ryan Sean Adams & David Hoffman',
    description: 'The ultimate guide to crypto finance. DeFi, Ethereum, and the bankless movement.',
    logo: '/images/podcasts/bankless.png',
    platforms: [
      { name: 'Apple Podcasts', url: 'https://podcasts.apple.com/podcast/bankless/id1499409058' },
      { name: 'Spotify', url: 'https://open.spotify.com/show/41TNnXSv5ExcQSzEGLlGhy' },
    ],
    category: 'DeFi & Ethereum',
    frequency: 'Three times weekly',
    rating: 4.7,
  },
  {
    id: 'what-bitcoin-did',
    name: 'What Bitcoin Did',
    host: 'Peter McCormack',
    description: 'Conversations with leading Bitcoiners about the future of money, privacy, and freedom.',
    logo: '/images/podcasts/wbd.png',
    platforms: [
      { name: 'Apple Podcasts', url: 'https://podcasts.apple.com/podcast/what-bitcoin-did/id1317356120' },
      { name: 'Spotify', url: 'https://open.spotify.com/show/0mWUJuONiilW5JSBBFZ0s7' },
    ],
    category: 'Bitcoin',
    frequency: 'Three times weekly',
    rating: 4.6,
  },
  {
    id: 'the-pomp-podcast',
    name: 'The Pomp Podcast',
    host: 'Anthony Pompliano',
    description: 'Discussions with the most interesting people in business, finance, and Bitcoin.',
    logo: '/images/podcasts/pomp.png',
    platforms: [
      { name: 'Apple Podcasts', url: 'https://podcasts.apple.com/podcast/the-pomp-podcast/id1434060078' },
      { name: 'Spotify', url: 'https://open.spotify.com/show/2QwpFjzJ0ZteqmMqw2xIfA' },
    ],
    category: 'Investing',
    frequency: 'Daily',
    rating: 4.5,
  },
  {
    id: 'up-only',
    name: 'UpOnly',
    host: 'Cobie & Ledger',
    description: 'Casual conversations about crypto markets, culture, and technology with guests from across the industry.',
    logo: '/images/podcasts/uponly.png',
    platforms: [
      { name: 'YouTube', url: 'https://youtube.com/@UpOnly' },
      { name: 'Spotify', url: 'https://open.spotify.com/show/uponly' },
    ],
    category: 'Culture',
    frequency: 'Weekly',
    rating: 4.4,
  },
  {
    id: 'epicenter',
    name: 'Epicenter',
    host: 'Sebastien Couture & Meher Roy',
    description: 'Deep-dive interviews with blockchain and decentralized technology innovators since 2013.',
    logo: '/images/podcasts/epicenter.png',
    platforms: [
      { name: 'Apple Podcasts', url: 'https://podcasts.apple.com/podcast/epicenter/id792338939' },
      { name: 'Spotify', url: 'https://open.spotify.com/show/5bEEBaFFEv3MmXa1MYMWfj' },
    ],
    category: 'Technology',
    frequency: 'Weekly',
    rating: 4.6,
  },
];

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function VideosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Header />
      <main id="main-content" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🎬 Videos & Podcasts
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            The best crypto content across YouTube, podcasts, and live streams — all in one place.
          </p>
        </div>

        <VideoPodcastClient channels={FEATURED_CHANNELS} podcasts={PODCASTS} />
      </main>
      <Footer />
    </div>
  );
}
