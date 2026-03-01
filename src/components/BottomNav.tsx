"use client";

import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/i18n/navigation";
import {
  Home,
  BarChart3,
  Search,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/markets", label: "Markets", icon: BarChart3 },
  { href: "/search", label: "Search", icon: Search },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/more", label: "More", icon: MoreHorizontal },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-surface)]",
        "pb-[env(safe-area-inset-bottom)] md:hidden"
      )}
      aria-label="Mobile navigation"
    >
      <ul className="flex items-center justify-around">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-2 text-[10px] transition-colors",
                  isActive
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="size-5" aria-hidden="true" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
