/**
 * Authors / Journalists Directory
 * Journalist profiles with bylines, bios, social links, and article history
 */

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Crypto Journalists & Authors | Free Crypto News',
  description:
    'Meet the journalists and analysts behind crypto news. Bylines, bios, track records, and social links for every author.',
  openGraph: {
    title: 'Crypto Authors & Journalists | Free Crypto News',
    description: 'Profiles and track records for leading crypto journalists and analysts.',
    type: 'website',
  },
  keywords: [
    'crypto journalists', 'crypto authors', 'blockchain reporters', 'crypto analysts',
    'crypto media', 'crypto writers',
  ],
  alternates: { canonical: '/authors' },
};

interface Author {
  id: string;
  name: string;
  role: string;
  outlet: string;
  bio: string;
  avatar: string;
  social: { twitter?: string; linkedin?: string; website?: string };
  expertise: string[];
  articleCount: number;
  featured: boolean;
}

const AUTHORS: Author[] = [
  {
    id: 'michael-casey',
    name: 'Michael J. Casey',
    role: 'Chief Content Officer',
    outlet: 'CoinDesk',
    bio: 'Author of "The Truth Machine" and former Wall Street Journal columnist covering crypto, blockchain, and the future of money.',
    avatar: '/images/authors/default.png',
    social: { twitter: 'https://twitter.com/mikaboriek' },
    expertise: ['Bitcoin', 'Regulation', 'Macro'],
    articleCount: 850,
    featured: true,
  },
  {
    id: 'laura-shin',
    name: 'Laura Shin',
    role: 'Host & Journalist',
    outlet: 'Unchained',
    bio: 'Former Forbes senior editor covering crypto. Host of Unchained podcast and author of "The Cryptopians."',
    avatar: '/images/authors/default.png',
    social: { twitter: 'https://twitter.com/laurashin' },
    expertise: ['Ethereum', 'Investigations', 'DeFi'],
    articleCount: 620,
    featured: true,
  },
  {
    id: 'frank-chaparro',
    name: 'Frank Chaparro',
    role: 'Director of News',
    outlet: 'The Block',
    bio: 'Former Business Insider reporter covering institutional crypto adoption and market structure.',
    avatar: '/images/authors/default.png',
    social: { twitter: 'https://twitter.com/faboriej' },
    expertise: ['Institutional', 'Trading', 'Exchanges'],
    articleCount: 1200,
    featured: true,
  },
  {
    id: 'jeff-john-roberts',
    name: 'Jeff John Roberts',
    role: 'Executive Editor',
    outlet: 'Decrypt',
    bio: 'Former Fortune journalist covering crypto, law, and technology. Author of "Kings of Crypto."',
    avatar: '/images/authors/default.png',
    social: { twitter: 'https://twitter.com/jeffjohnroberts' },
    expertise: ['Regulation', 'Law', 'Coinbase'],
    articleCount: 530,
    featured: true,
  },
  {
    id: 'sam-kessler',
    name: 'Sam Kessler',
    role: 'Reporter',
    outlet: 'CoinDesk',
    bio: 'Covers DeFi, governance, and Ethereum ecosystem for CoinDesk.',
    avatar: '/images/authors/default.png',
    social: { twitter: 'https://twitter.com/samskessler' },
    expertise: ['DeFi', 'Governance', 'Ethereum'],
    articleCount: 380,
    featured: false,
  },
  {
    id: 'yogita-khatri',
    name: 'Yogita Khatri',
    role: 'Reporter',
    outlet: 'The Block',
    bio: 'Covers breaking crypto news, exchange developments, and market-moving events.',
    avatar: '/images/authors/default.png',
    social: { twitter: 'https://twitter.com/yogaboriek' },
    expertise: ['Exchanges', 'Breaking News', 'Markets'],
    articleCount: 920,
    featured: false,
  },
  {
    id: 'tim-copeland',
    name: 'Tim Copeland',
    role: 'Editor-at-Large',
    outlet: 'DL News',
    bio: 'Former Decrypt editor covering Ethereum, DeFi hacks, and protocol security.',
    avatar: '/images/authors/default.png',
    social: { twitter: 'https://twitter.com/timcopeland' },
    expertise: ['Security', 'Hacks', 'Ethereum'],
    articleCount: 410,
    featured: false,
  },
  {
    id: 'ryan-sean-adams',
    name: 'Ryan Sean Adams',
    role: 'Co-founder',
    outlet: 'Bankless',
    bio: 'Crypto investor and co-host of the Bankless podcast. Evangelist for DeFi and Ethereum.',
    avatar: '/images/authors/default.png',
    social: { twitter: 'https://twitter.com/RyanSAdams' },
    expertise: ['DeFi', 'Ethereum', 'Investment'],
    articleCount: 280,
    featured: true,
  },
];

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AuthorsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const featured = AUTHORS.filter(a => a.featured);
  const others = AUTHORS.filter(a => !a.featured);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />
      <main id="main-content" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ✍️ Authors & Journalists
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            The people behind the headlines. Bylines, expertise, and track records for leading crypto journalists.
          </p>
        </div>

        {/* Info banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl p-4 mb-8">
          <h2 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">🔍 Why Author Transparency Matters</h2>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Knowing who writes the news helps you evaluate credibility, detect biases, and track the accuracy of specific journalists over time.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Authors', value: AUTHORS.length, emoji: '✍️' },
            { label: 'Outlets', value: new Set(AUTHORS.map(a => a.outlet)).size, emoji: '📰' },
            { label: 'Featured', value: featured.length, emoji: '⭐' },
            { label: 'Total Articles', value: AUTHORS.reduce((s, a) => s + a.articleCount, 0).toLocaleString(), emoji: '📝' },
          ].map(stat => (
            <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4 text-center">
              <span className="text-2xl">{stat.emoji}</span>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Featured authors */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">⭐ Featured Journalists</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {featured.map(author => (
            <div key={author.id} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 hover:shadow-lg transition">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl font-bold text-white shrink-0">
                  {author.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{author.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{author.role} at <strong>{author.outlet}</strong></p>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">{author.bio}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {author.expertise.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-xs font-medium text-amber-700 dark:text-amber-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-slate-400">
                    <span>📝 {author.articleCount} articles</span>
                    {author.social.twitter && (
                      <a href={author.social.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 transition">
                        𝕏 Twitter ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* All authors */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">All Journalists</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {others.map(author => (
            <div key={author.id} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {author.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{author.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400">{author.role} • {author.outlet}</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-slate-400 line-clamp-2">{author.bio}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {author.expertise.map(tag => (
                  <span key={tag} className="px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-xs text-gray-500 dark:text-slate-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
