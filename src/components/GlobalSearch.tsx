'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Search, Loader2, X, ExternalLink } from 'lucide-react';
import { cn, formatTimeAgo } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchResult {
  title: string;
  link: string;
  source: string;
  category: string;
  pubDate: string;
  timeAgo: string;
  description?: string;
}

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  // Fetch search results
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setActiveIndex(0);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    fetch(`/api/news?search=${encodeURIComponent(debouncedQuery)}&limit=10`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        setResults(data.articles ?? []);
        setActiveIndex(0);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setResults([]);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [debouncedQuery]);

  // Reset state when closed
  useEffect(() => {
    if (!open) {
      setQuery('');
      setResults([]);
      setActiveIndex(0);
    }
  }, [open]);

  // Navigate to result
  const navigateToResult = useCallback(
    (result: SearchResult) => {
      onOpenChange(false);
      // External links open in new tab, internal ones navigate
      if (result.link.startsWith('http')) {
        window.open(result.link, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = result.link;
      }
    },
    [onOpenChange],
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[activeIndex]) navigateToResult(results[activeIndex]);
          break;
      }
    },
    [results, activeIndex, navigateToResult],
  );

  // Scroll active item into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.children[activeIndex] as HTMLElement | undefined;
    active?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity duration-150" />
        <Dialog.Content
          className="fixed left-1/2 top-[15%] z-[101] w-full max-w-2xl -translate-x-1/2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl transition-all duration-150"
          onKeyDown={handleKeyDown}
        >
          {/* Search input */}
          <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-3">
            <Search className="h-5 w-5 shrink-0 text-[var(--color-text-tertiary)]" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search news, topics, coins…"
              className="flex-1 bg-transparent text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none"
              autoFocus
            />
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin text-[var(--color-text-tertiary)]" />
            )}
            <Dialog.Close asChild>
              <button
                className="rounded-md p-1 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Results */}
          <div
            ref={listRef}
            className="max-h-[60vh] overflow-y-auto overscroll-contain"
          >
            {/* No query yet */}
            {!debouncedQuery.trim() && (
              <div className="flex flex-col items-center justify-center py-12 text-[var(--color-text-tertiary)]">
                <Search className="h-8 w-8 mb-2 opacity-40" />
                <p className="text-sm">Start typing to search…</p>
                <p className="text-xs mt-1 opacity-60">
                  <kbd className="px-1.5 py-0.5 rounded border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[10px] font-mono">
                    ↑↓
                  </kbd>{' '}
                  navigate{' '}
                  <kbd className="px-1.5 py-0.5 rounded border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[10px] font-mono">
                    ↵
                  </kbd>{' '}
                  select{' '}
                  <kbd className="px-1.5 py-0.5 rounded border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[10px] font-mono">
                    esc
                  </kbd>{' '}
                  close
                </p>
              </div>
            )}

            {/* No results */}
            {debouncedQuery.trim() && !loading && results.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-[var(--color-text-tertiary)]">
                <p className="text-sm">No results for &ldquo;{debouncedQuery}&rdquo;</p>
                <p className="text-xs mt-1 opacity-60">Try a different search term</p>
              </div>
            )}

            {/* Result list */}
            {results.map((result, i) => (
              <button
                key={`${result.link}-${i}`}
                onClick={() => navigateToResult(result)}
                className={cn(
                  'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors cursor-pointer',
                  i === activeIndex
                    ? 'bg-[var(--color-accent)]/10'
                    : 'hover:bg-[var(--color-surface-secondary)]',
                )}
                onMouseEnter={() => setActiveIndex(i)}
              >
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      'text-sm font-medium leading-snug line-clamp-2',
                      i === activeIndex
                        ? 'text-[var(--color-accent)]'
                        : 'text-[var(--color-text-primary)]',
                    )}
                  >
                    {result.title}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-[var(--color-text-tertiary)]">
                    <span>{result.source}</span>
                    <span>·</span>
                    <span>{result.timeAgo || formatTimeAgo(result.pubDate)}</span>
                    <Badge className="ml-1 text-[10px]">
                      {result.category}
                    </Badge>
                  </div>
                </div>
                {result.link.startsWith('http') && (
                  <ExternalLink className="h-3.5 w-3.5 mt-1 shrink-0 text-[var(--color-text-tertiary)]" />
                )}
              </button>
            ))}
          </div>

          {/* Footer */}
          {results.length > 0 && (
            <div className="border-t border-[var(--color-border)] px-4 py-2 text-xs text-[var(--color-text-tertiary)]">
              {results.length} result{results.length !== 1 ? 's' : ''}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
