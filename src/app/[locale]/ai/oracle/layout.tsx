import { generateSEOMetadata } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  title: 'AI Oracle — Ask Anything About Crypto',
  description:
    'AI-powered crypto oracle. Ask questions about Bitcoin, Ethereum, DeFi, market trends, and get instant answers backed by real-time news and data.',
  path: '/ai/oracle',
  tags: ['AI oracle', 'crypto AI', 'ask AI', 'bitcoin AI', 'crypto assistant', 'market analysis'],
});

export default function OracleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
