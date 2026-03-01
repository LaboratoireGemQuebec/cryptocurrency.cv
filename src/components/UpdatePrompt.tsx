"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { RefreshCw } from "lucide-react";
import { usePWA } from "@/components/PWAProvider";

export function UpdatePrompt() {
  const { isUpdateAvailable, applyUpdate } = usePWA();

  if (!isUpdateAvailable) return null;

  return (
    <div
      role="alert"
      className={cn(
        "fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-md sm:left-auto sm:right-4 sm:bottom-4",
        "flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-lg"
      )}
    >
      <RefreshCw
        className="size-5 shrink-0 text-[var(--color-accent)]"
        aria-hidden="true"
      />
      <p className="flex-1 text-sm">A new version is available!</p>
      <Button variant="primary" size="sm" onClick={applyUpdate}>
        Update
      </Button>
    </div>
  );
}
