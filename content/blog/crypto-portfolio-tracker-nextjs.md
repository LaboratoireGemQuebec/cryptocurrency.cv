---
title: "Build a Crypto Portfolio Tracker with Next.js and Free APIs"
description: "Step-by-step guide to building a cryptocurrency portfolio tracker using Next.js App Router, free price APIs, and live news feeds. No paid API keys required."
date: "2026-03-30"
author: team
category: tutorial
tags: ["nextjs", "portfolio", "react", "api", "developer", "tutorial"]
image: "/images/blog/crypto-portfolio-tracker-nextjs.jpg"
imageAlt: "Next.js cryptocurrency portfolio tracker dashboard showing holdings and profit/loss"
---

A crypto portfolio tracker is one of the most useful projects you can build as a developer learning the crypto data ecosystem. It requires price fetching, state management, localStorage persistence, and ideally a live news feed — all skills that transfer directly to production applications. Best of all, you can build a fully functional version using entirely free APIs.

## What We Are Building

By the end of this guide, you will have a Next.js application that:

- Lets users add cryptocurrency holdings (symbol + amount)
- Fetches live prices for each holding
- Calculates total portfolio value and per-asset gain/loss
- Displays relevant crypto news from the free-crypto-news API
- Persists holdings in localStorage

## Project Setup

Start with the Next.js App Router scaffold:

```bash
npx create-next-app@latest crypto-tracker --typescript --tailwind --app
cd crypto-tracker
```

Install a minimal set of dependencies:

```bash
npm install swr
```

SWR (stale-while-revalidate) from Vercel handles data fetching and caching elegantly.

## Project Structure

```
src/
  app/
    page.tsx           # Portfolio dashboard
    layout.tsx
  components/
    HoldingForm.tsx    # Add new holdings
    HoldingRow.tsx     # Display a single holding
    NewsFeed.tsx       # Latest crypto news
  hooks/
    usePortfolio.ts    # localStorage state
    usePrices.ts       # Price fetching hook
  lib/
    api.ts             # API utility functions
```

## Building the Price Fetching Hook

The CoinGecko free API is perfect here — no key required for basic usage:

```typescript
// src/hooks/usePrices.ts
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function usePrices(symbols: string[]) {
  const ids = symbols.join(',');
  const { data, error, isLoading } = useSWR(
    symbols.length > 0
      ? `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
      : null,
    fetcher,
    { refreshInterval: 30000 } // refresh every 30s
  );

  return {
    prices: data ?? {},
    isLoading,
    error,
  };
}
```

## Portfolio State with localStorage

```typescript
// src/hooks/usePortfolio.ts
import { useState, useEffect } from 'react';

export interface Holding {
  id: string;
  coinId: string;
  symbol: string;
  name: string;
  amount: number;
  purchasePrice: number;
}

const STORAGE_KEY = 'crypto-portfolio';

export function usePortfolio() {
  const [holdings, setHoldings] = useState<Holding[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHoldings(JSON.parse(stored));
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  const save = (updated: Holding[]) => {
    setHoldings(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const addHolding = (holding: Omit<Holding, 'id'>) => {
    const updated = [...holdings, { ...holding, id: crypto.randomUUID() }];
    save(updated);
  };

  const removeHolding = (id: string) => {
    save(holdings.filter(h => h.id !== id));
  };

  return { holdings, addHolding, removeHolding };
}
```

## The Add Holding Form

```tsx
// src/components/HoldingForm.tsx
'use client';
import { useState } from 'react';
import { Holding } from '@/hooks/usePortfolio';

const POPULAR_COINS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  { id: 'solana', symbol: 'SOL', name: 'Solana' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
];

interface Props {
  onAdd: (holding: Omit<Holding, 'id'>) => void;
}

export function HoldingForm({ onAdd }: Props) {
  const [coin, setCoin] = useState(POPULAR_COINS[0]);
  const [amount, setAmount] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      coinId: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      amount: parseFloat(amount),
      purchasePrice: parseFloat(purchasePrice),
    });
    setAmount('');
    setPurchasePrice('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 items-end flex-wrap">
      <div>
        <label className="block text-sm font-medium mb-1">Coin</label>
        <select
          value={coin.id}
          onChange={e => setCoin(POPULAR_COINS.find(c => c.id === e.target.value)!)}
          className="border rounded px-3 py-2"
        >
          {POPULAR_COINS.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Amount</label>
        <input
          type="number"
          step="any"
          min="0"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="0.5"
          required
          className="border rounded px-3 py-2 w-32"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Purchase Price (USD)</label>
        <input
          type="number"
          step="any"
          min="0"
          value={purchasePrice}
          onChange={e => setPurchasePrice(e.target.value)}
          placeholder="45000"
          required
          className="border rounded px-3 py-2 w-36"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Holding
      </button>
    </form>
  );
}
```

## The Holdings Table

```tsx
// src/components/HoldingRow.tsx
interface Props {
  holding: Holding;
  currentPrice: number | undefined;
  onRemove: (id: string) => void;
}

export function HoldingRow({ holding, currentPrice, onRemove }: Props) {
  const currentValue = currentPrice ? holding.amount * currentPrice : null;
  const costBasis = holding.amount * holding.purchasePrice;
  const pnl = currentValue !== null ? currentValue - costBasis : null;
  const pnlPercent = pnl !== null ? (pnl / costBasis) * 100 : null;

  return (
    <tr className="border-b">
      <td className="py-3 px-4 font-semibold">{holding.name}</td>
      <td className="py-3 px-4 text-gray-500">{holding.symbol}</td>
      <td className="py-3 px-4">{holding.amount}</td>
      <td className="py-3 px-4">
        {currentPrice ? `$${currentPrice.toLocaleString()}` : '—'}
      </td>
      <td className="py-3 px-4">
        {currentValue ? `$${currentValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}` : '—'}
      </td>
      <td className={`py-3 px-4 ${pnl && pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {pnl !== null ? `${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}` : '—'}
        {pnlPercent !== null ? ` (${pnlPercent.toFixed(1)}%)` : ''}
      </td>
      <td className="py-3 px-4">
        <button onClick={() => onRemove(holding.id)} className="text-red-500 hover:underline text-sm">
          Remove
        </button>
      </td>
    </tr>
  );
}
```

## Adding a Live News Feed

Use the free-crypto-news API to show relevant headlines alongside your portfolio:

```tsx
// src/components/NewsFeed.tsx
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface NewsItem {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

export function NewsFeed({ symbols }: { symbols: string[] }) {
  const query = symbols.slice(0, 5).join(',');
  const { data } = useSWR(
    `https://free-crypto-news.com/api/news?symbols=${query}&limit=8`,
    fetcher,
    { refreshInterval: 120000 }
  );

  if (!data?.articles) return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Latest News</h2>
      <ul className="space-y-3">
        {data.articles.map((item: NewsItem) => (
          <li key={item.url} className="border-l-4 border-blue-500 pl-4">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline"
            >
              {item.title}
            </a>
            <p className="text-sm text-gray-500 mt-1">
              {item.source} &middot; {new Date(item.publishedAt).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## The Main Dashboard Page

```tsx
// src/app/page.tsx
'use client';
import { usePortfolio } from '@/hooks/usePortfolio';
import { usePrices } from '@/hooks/usePrices';
import { HoldingForm } from '@/components/HoldingForm';
import { HoldingRow } from '@/components/HoldingRow';
import { NewsFeed } from '@/components/NewsFeed';

export default function Dashboard() {
  const { holdings, addHolding, removeHolding } = usePortfolio();
  const coinIds = [...new Set(holdings.map(h => h.coinId))];
  const { prices } = usePrices(coinIds);

  const totalValue = holdings.reduce((sum, h) => {
    const price = prices[h.coinId]?.usd ?? 0;
    return sum + h.amount * price;
  }, 0);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Crypto Portfolio</h1>
      <p className="text-2xl font-semibold text-blue-600 mb-8">
        Total: ${totalValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
      </p>

      <HoldingForm onAdd={addHolding} />

      {holdings.length > 0 && (
        <table className="w-full mt-8 text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Symbol</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Value</th>
              <th className="py-3 px-4">P&L</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {holdings.map(h => (
              <HoldingRow
                key={h.id}
                holding={h}
                currentPrice={prices[h.coinId]?.usd}
                onRemove={removeHolding}
              />
            ))}
          </tbody>
        </table>
      )}

      <NewsFeed symbols={holdings.map(h => h.symbol)} />
    </main>
  );
}
```

## Deploying to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

No environment variables are needed since we are using entirely free, open APIs including [free-crypto-news](https://free-crypto-news.com) for the news feed.

## Next Steps

Once your basic tracker is working, consider adding:

- Historical price charts using Chart.js or Recharts
- Multiple portfolio support with user accounts
- CSV import/export for holdings
- Price alerts via email or push notifications
- Exchange integration via API keys for automatic trade tracking

## Conclusion

Building a crypto portfolio tracker with Next.js and free APIs teaches you the fundamentals of the crypto data ecosystem: price fetching, state management, real-time updates, and news integration. The entire stack runs on free tiers — ideal for learning, prototyping, and shipping a side project.
