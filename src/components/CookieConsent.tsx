"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "fcn-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Small delay so banner slides in after mount
      const t = setTimeout(() => {
        setVisible(true);
        requestAnimationFrame(() => setAnimateIn(true));
      }, 1000);
      return () => clearTimeout(t);
    }
  }, []);

  const handleChoice = (choice: "accepted" | "declined") => {
    setAnimateIn(false);
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, choice);
      setVisible(false);
    }, 300);
  };

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out",
        animateIn ? "translate-y-0" : "translate-y-full"
      )}
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 shadow-lg sm:px-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <Cookie
            className="hidden size-5 shrink-0 text-[var(--color-accent)] sm:block"
            aria-hidden="true"
          />
          <p className="flex-1 text-center text-sm text-[var(--color-foreground)] sm:text-left">
            We use cookies for analytics and to improve your experience.
          </p>
          <div className="flex shrink-0 gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleChoice("declined")}
            >
              Decline
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleChoice("accepted")}
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
