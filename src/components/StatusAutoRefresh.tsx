"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Invisible client component that auto-refreshes the page
 * by calling router.refresh() at a configurable interval.
 */
export default function StatusAutoRefresh({
  intervalMs = 30000,
}: {
  intervalMs?: number;
}) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => {
      router.refresh();
    }, intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs]);

  return null;
}
