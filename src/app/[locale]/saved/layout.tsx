import { generateSEOMetadata } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  title: 'Saved Articles — Your Bookmarked Crypto News',
  description:
    'View and manage your saved cryptocurrency news articles. Bookmark breaking stories, analysis, and market updates to read later.',
  path: '/saved',
  tags: ['saved articles', 'bookmarks', 'crypto news', 'reading list'],
  noindex: true,
});

export default function SavedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
