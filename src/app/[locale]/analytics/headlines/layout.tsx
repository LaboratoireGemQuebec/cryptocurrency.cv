import { generateSEOMetadata } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  title: 'Headline Analytics — Track How Crypto News Evolves',
  description:
    'Track how cryptocurrency news headlines change over time. Detect editorial shifts, sentiment changes, and headline evolution across major crypto publications.',
  path: '/analytics/headlines',
  tags: ['headline analytics', 'news tracking', 'headline changes', 'crypto media', 'sentiment shift'],
});

export default function HeadlinesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
