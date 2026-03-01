import { generateSEOMetadata } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  title: 'Settings — Customize Your Experience',
  description:
    'Customize your Free Crypto News experience. Configure currency, language, notification preferences, layout, and data display options.',
  path: '/settings',
  tags: ['settings', 'preferences', 'customize', 'crypto news'],
  noindex: true,
});

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
