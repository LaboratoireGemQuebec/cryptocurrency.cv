import { generateSEOMetadata } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  title: 'Card Components — Design Examples',
  description:
    'Interactive showcase of Free Crypto News article card components. Browse large, medium, small, and list card layouts with live previews.',
  path: '/examples/cards',
  tags: ['components', 'cards', 'design', 'examples'],
  noindex: true,
});

export default function CardsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
