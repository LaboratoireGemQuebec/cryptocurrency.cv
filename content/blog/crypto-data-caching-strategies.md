---
title: "Caching Strategies for High-Volume Crypto Data Apps"
description: "Learn caching strategies for cryptocurrency applications including in-memory caches, Redis, CDN edge caching, and SWR patterns for managing high-frequency price and news data."
date: "2026-03-30"
author: team
category: tutorial
tags: ["caching", "redis", "performance", "developer", "api", "architecture"]
image: "/images/blog/crypto-data-caching-strategies.jpg"
imageAlt: "Caching architecture diagram for cryptocurrency data showing Redis, CDN, and in-memory layers"
---

Cryptocurrency data is high-frequency. Bitcoin prices update every few seconds. News articles arrive constantly. Gas prices change with every block. Without caching, your application will exhaust API rate limits, generate unnecessary costs, and deliver a slow user experience. Caching is not optional for production crypto apps — it is essential.

## Why Crypto Apps Need Caching

Consider these typical data freshness requirements:

| Data Type | Update Frequency | Acceptable Cache TTL |
|-----------|-----------------|---------------------|
| Bitcoin price | ~1 second | 10–30 seconds |
| Gas price | ~12 seconds (one block) | 12–30 seconds |
| News headlines | Minutes | 60–120 seconds |
| Market cap | Minutes | 60 seconds |
| Historical OHLCV | Fixed past data | Hours to days |
| Token metadata | Rarely changes | 24 hours |

The right TTL (Time To Live) depends on your use case. A price dashboard needs fresher data than a portfolio statement email.

## In-Memory Caching (Node.js)

For single-process servers, an in-memory cache is fast and zero-dependency:

```javascript
class MemoryCache {
  #store = new Map();

  set(key, value, ttlMs) {
    this.#store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  get(key) {
    const entry = this.#store.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.expiresAt) {
      this.#store.delete(key);
      return undefined;
    }

    return entry.value;
  }

  has(key) {
    return this.get(key) !== undefined;
  }

  delete(key) {
    this.#store.delete(key);
  }

  // Clear expired entries periodically
  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.#store.entries()) {
      if (now > entry.expiresAt) this.#store.delete(key);
    }
  }
}

const cache = new MemoryCache();
setInterval(() => cache.cleanup(), 60000); // Clean up every minute
```

### Cache-Aside Pattern

The most common pattern: check cache first, fetch on miss:

```javascript
async function getCachedPrice(symbol, ttlMs = 15000) {
  const cacheKey = `price:${symbol.toLowerCase()}`;

  // Cache hit
  const cached = cache.get(cacheKey);
  if (cached !== undefined) return cached;

  // Cache miss: fetch fresh data
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`
  );
  const data = await response.json();
  const price = data[symbol]?.usd;

  if (price !== undefined) {
    cache.set(cacheKey, price, ttlMs);
  }

  return price;
}
```

### Preventing Cache Stampede

When the cache expires and many requests arrive simultaneously, they all hit the origin:

```javascript
class StampedeProtectedCache extends MemoryCache {
  #inflight = new Map();

  async getOrFetch(key, fetchFn, ttlMs) {
    const cached = this.get(key);
    if (cached !== undefined) return cached;

    // If a fetch is already in progress, wait for it
    if (this.#inflight.has(key)) {
      return this.#inflight.get(key);
    }

    // Start a new fetch and store the promise
    const promise = fetchFn().then(value => {
      this.set(key, value, ttlMs);
      this.#inflight.delete(key);
      return value;
    }).catch(err => {
      this.#inflight.delete(key);
      throw err;
    });

    this.#inflight.set(key, promise);
    return promise;
  }
}

const cache = new StampedeProtectedCache();

// Multiple simultaneous requests for the same key only trigger one fetch
const price = await cache.getOrFetch(
  'price:bitcoin',
  () => fetchBitcoinPrice(),
  15000
);
```

## Redis Caching for Multi-Process Apps

When you run multiple server instances (horizontal scaling), in-memory caches become inconsistent. Redis provides a shared cache:

```bash
npm install ioredis
```

```javascript
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: 6379,
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

class RedisCache {
  async get(key) {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : undefined;
  }

  async set(key, value, ttlSeconds) {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  async delete(key) {
    await redis.del(key);
  }

  async getOrFetch(key, fetchFn, ttlSeconds) {
    const cached = await this.get(key);
    if (cached !== undefined) return cached;

    // Use Redis SET NX for atomic check-and-set (lock)
    const lockKey = `lock:${key}`;
    const locked = await redis.set(lockKey, '1', 'EX', 5, 'NX');

    if (!locked) {
      // Another process is fetching; wait briefly and retry
      await new Promise(r => setTimeout(r, 100));
      return this.getOrFetch(key, fetchFn, ttlSeconds);
    }

    try {
      const value = await fetchFn();
      await this.set(key, value, ttlSeconds);
      return value;
    } finally {
      await redis.del(lockKey);
    }
  }
}
```

### Redis Caching for News Data

```javascript
const redisCache = new RedisCache();

async function getCachedNews(symbol, limit = 10) {
  return redisCache.getOrFetch(
    `news:${symbol}:${limit}`,
    async () => {
      const response = await fetch(
        `https://free-crypto-news.com/api/news?symbols=${symbol}&limit=${limit}`
      );
      return response.json();
    },
    90 // 90 seconds TTL
  );
}
```

## HTTP Response Caching with Cache-Control

For REST API servers, HTTP cache headers let CDNs and browser clients cache responses:

```javascript
import express from 'express';

const app = express();

// Cache price data at CDN edge for 15 seconds, allow serving stale for 30s while revalidating
app.get('/api/price/:symbol', async (req, res) => {
  try {
    const data = await getCachedPrice(req.params.symbol);
    res
      .set('Cache-Control', 'public, max-age=15, stale-while-revalidate=30')
      .json({ symbol: req.params.symbol, price: data });
  } catch {
    res.status(500).json({ error: 'Failed to fetch price' });
  }
});

// Cache news for 60 seconds
app.get('/api/news/:symbol', async (req, res) => {
  try {
    const news = await getCachedNews(req.params.symbol);
    res
      .set('Cache-Control', 'public, max-age=60, stale-while-revalidate=120')
      .json(news);
  } catch {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Historical data can be cached much longer
app.get('/api/history/:symbol', async (req, res) => {
  try {
    const history = await getHistoricalPrices(req.params.symbol);
    res
      .set('Cache-Control', 'public, max-age=3600') // 1 hour
      .json(history);
  } catch {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});
```

## SWR Pattern for Frontend

`stale-while-revalidate` is a React-first caching strategy popularized by Vercel's SWR library:

```typescript
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

// Price updates every 10 seconds
function useBitcoinPrice() {
  const { data, error, isLoading } = useSWR(
    '/api/price/bitcoin',
    fetcher,
    {
      refreshInterval: 10000,
      revalidateOnFocus: true,
      dedupingInterval: 5000, // Prevent duplicate requests within 5s
    }
  );

  return { price: data?.price, error, isLoading };
}

// News refreshes every 2 minutes
function useCryptoNews(symbol: string) {
  const { data, isLoading } = useSWR(
    `/api/news/${symbol}`,
    fetcher,
    {
      refreshInterval: 120000,
      revalidateOnFocus: false, // Don't refetch just because user switches tabs
    }
  );

  return { news: data?.articles ?? [], isLoading };
}
```

## Tiered Caching Architecture

Production apps use multiple cache layers:

```
Request -> L1 (in-process memory) -> L2 (Redis) -> L3 (API/database)
```

```javascript
class TieredCache {
  #l1 = new MemoryCache();
  #l2 = new RedisCache();
  #l1TTL;
  #l2TTL;

  constructor({ l1TTL = 10000, l2TTL = 60 } = {}) {
    this.#l1TTL = l1TTL;      // milliseconds
    this.#l2TTL = l2TTL;      // seconds
  }

  async get(key) {
    // L1: in-process memory (fastest)
    const l1 = this.#l1.get(key);
    if (l1 !== undefined) return l1;

    // L2: Redis (fast, shared across processes)
    const l2 = await this.#l2.get(key);
    if (l2 !== undefined) {
      this.#l1.set(key, l2, this.#l1TTL); // warm L1
      return l2;
    }

    return undefined;
  }

  async set(key, value) {
    this.#l1.set(key, value, this.#l1TTL);
    await this.#l2.set(key, value, this.#l2TTL);
  }

  async getOrFetch(key, fetchFn) {
    const cached = await this.get(key);
    if (cached !== undefined) return cached;

    const value = await fetchFn();
    await this.set(key, value);
    return value;
  }
}
```

## Cache Invalidation

Sometimes you need to force fresh data, such as after a manual trigger:

```javascript
// WebSocket-triggered invalidation
wsPriceStream.on('priceUpdate', async ({ symbol, price }) => {
  // Push fresh data directly into cache instead of invalidating
  await redisCache.set(`price:${symbol}`, price, 30);
});

// Manual cache clear endpoint (protected by admin auth)
app.delete('/api/admin/cache/:pattern', requireAdmin, async (req, res) => {
  const keys = await redis.keys(req.params.pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
  res.json({ cleared: keys.length });
});
```

## Monitoring Cache Performance

```javascript
class MonitoredCache {
  #inner;
  #hits = 0;
  #misses = 0;

  constructor(inner) {
    this.#inner = inner;
  }

  async get(key) {
    const value = await this.#inner.get(key);
    if (value !== undefined) this.#hits++;
    else this.#misses++;
    return value;
  }

  getStats() {
    const total = this.#hits + this.#misses;
    return {
      hits: this.#hits,
      misses: this.#misses,
      hitRate: total ? ((this.#hits / total) * 100).toFixed(1) + '%' : 'N/A',
    };
  }
}
```

## Conclusion

Effective caching is the difference between a production-ready crypto application and one that collapses under load. Use in-memory caches for single-process apps, Redis for distributed systems, HTTP Cache-Control headers to offload work to CDNs, and the SWR pattern for frontend data freshness. Match your TTL to the data's natural update frequency and your use case's tolerance for staleness.
