import { setRequestLocale } from 'next-intl/server';
import { generateSEOMetadata } from '@/lib/seo';
import { ClientOnly } from '@/components/ClientOnly';
import dynamic from 'next/dynamic';
import type { Metadata } from 'next';

const X402Visualizer = dynamic(() => import('@/components/X402Visualizer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 font-mono text-sm">Loading x402 Network...</p>
      </div>
    </div>
  ),
});

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generateSEOMetadata({
    title: 'x402 Payment Protocol Visualizer — Real-Time Network Activity',
    description:
      'Explore x402 payment protocol transactions in real-time with an interactive 3D visualization. See payment flows between protocols like Coinbase, Base, USDC, Stripe, Aave, and more.',
    path: '/x402',
    locale,
  });
}

export default async function X402Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ClientOnly>
      <X402Visualizer />
    </ClientOnly>
  );
}
