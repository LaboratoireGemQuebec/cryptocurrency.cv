import Link from 'next/link';
import type { Tag } from '@/lib/tags';

export function TagChip({ tag }: { tag: Tag }) {
  return (
    <Link
      href={`/tags/${tag.slug}`}
      className="inline-flex items-center gap-1 rounded-full bg-[var(--color-surface-secondary)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-tertiary)] hover:text-[var(--color-text-primary)]"
    >
      {tag.icon && <span>{tag.icon}</span>}
      {tag.name}
    </Link>
  );
}
