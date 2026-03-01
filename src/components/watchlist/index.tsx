"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WatchlistCoin {
  id: string;
  name: string;
  symbol: string;
  addedAt: string;
}

interface WatchlistContextType {
  coins: WatchlistCoin[];
  addCoin: (coin: Pick<WatchlistCoin, "id" | "name" | "symbol">) => boolean;
  removeCoin: (id: string) => void;
  isCoinWatched: (id: string) => boolean;
  reorderCoins: (newOrder: WatchlistCoin[]) => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = "fcn-watchlist";
const MAX_COINS = 50;

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const WatchlistContext = createContext<WatchlistContextType>({
  coins: [],
  addCoin: () => false,
  removeCoin: () => {},
  isCoinWatched: () => false,
  reorderCoins: () => {},
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadFromStorage(): WatchlistCoin[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as WatchlistCoin[];
    return [];
  } catch {
    return [];
  }
}

function saveToStorage(coins: WatchlistCoin[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coins));
  } catch {
    /* quota exceeded – silently ignore */
  }
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [coins, setCoins] = useState<WatchlistCoin[]>([]);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setCoins(loadFromStorage());
  }, []);

  // Sync across browser tabs
  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) {
        setCoins(loadFromStorage());
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const addCoin = useCallback(
    (coin: Pick<WatchlistCoin, "id" | "name" | "symbol">): boolean => {
      let added = false;
      setCoins((prev) => {
        if (prev.some((c) => c.id === coin.id)) return prev;
        if (prev.length >= MAX_COINS) return prev;
        const next = [
          ...prev,
          { id: coin.id, name: coin.name, symbol: coin.symbol, addedAt: new Date().toISOString() },
        ];
        saveToStorage(next);
        added = true;
        return next;
      });
      return added;
    },
    [],
  );

  const removeCoin = useCallback((id: string) => {
    setCoins((prev) => {
      const next = prev.filter((c) => c.id !== id);
      saveToStorage(next);
      return next;
    });
  }, []);

  const isCoinWatched = useCallback(
    (id: string) => coins.some((c) => c.id === id),
    [coins],
  );

  const reorderCoins = useCallback((newOrder: WatchlistCoin[]) => {
    setCoins(newOrder);
    saveToStorage(newOrder);
  }, []);

  return (
    <WatchlistContext value={{ coins, addCoin, removeCoin, isCoinWatched, reorderCoins }}>
      {children}
    </WatchlistContext>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useWatchlist() {
  return useContext(WatchlistContext);
}
