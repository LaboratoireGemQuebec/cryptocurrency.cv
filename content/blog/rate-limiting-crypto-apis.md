---
title: "Handling Rate Limits When Using Crypto APIs"
description: "Learn how to handle rate limits when consuming cryptocurrency APIs. Covers retry logic, exponential backoff, request queuing, and staying within free tier limits."
date: "2026-03-30"
author: team
category: tutorial
tags: ["api", "rate-limiting", "developer", "performance", "javascript", "python"]
image: "/images/blog/rate-limiting-crypto-apis.jpg"
imageAlt: "API rate limit error response handling with retry queue and backoff timer"
---

Rate limiting is the most common obstacle developers encounter when working with cryptocurrency APIs. Every major data provider — CoinGecko, Binance, Alchemy, Etherscan — imposes limits on how many requests you can make per second, minute, or day. Getting this wrong costs you reliability, money, and potentially a banned API key.

## Understanding Rate Limit Types

Different providers implement different rate limit structures:

| Limit Type | Example | How It Works |
|------------|---------|-------------|
| Requests per second | 10 RPS | Rolling window; too fast and you're rejected |
| Requests per minute | 300 RPM | Resets each minute |
| Requests per day | 10,000/day | Hard daily quota |
| Compute units | 300M CU/month (Alchemy) | Different methods cost different amounts |
| Credits | 50 calls/min (CoinGecko free) | Points-based system |

## Recognizing Rate Limit Responses

Most APIs use HTTP 429 (Too Many Requests) for rate limit errors:

```javascript
async function fetchWithErrorHandling(url, options = {}) {
  const response = await fetch(url, options);

  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    const resetTime = response.headers.get('X-RateLimit-Reset');

    throw new RateLimitError({
      retryAfterSeconds: retryAfter ? parseInt(retryAfter) : null,
      resetTime: resetTime ? new Date(parseInt(resetTime) * 1000) : null,
    });
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }

  return response.json();
}

class RateLimitError extends Error {
  constructor({ retryAfterSeconds, resetTime }) {
    super('Rate limit exceeded');
    this.name = 'RateLimitError';
    this.retryAfterSeconds = retryAfterSeconds;
    this.resetTime = resetTime;
  }
}
```

## Exponential Backoff with Jitter

The standard retry strategy for rate limits combines exponential backoff (doubling wait times) with jitter (random offset to prevent synchronized retries):

```javascript
async function withRetry(fn, options = {}) {
  const {
    maxRetries = 5,
    initialDelayMs = 1000,
    maxDelayMs = 60000,
    jitter = 0.25,
    retryOn = [429, 503, 502, 504],
  } = options;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      // Check if error is retryable
      const statusCode = error.status || error.statusCode;
      const isRateLimit = error instanceof RateLimitError || retryOn.includes(statusCode);

      if (!isRateLimit || attempt === maxRetries) throw error;

      // Calculate delay
      let delayMs;
      if (error instanceof RateLimitError && error.retryAfterSeconds) {
        delayMs = error.retryAfterSeconds * 1000;
      } else {
        // Exponential backoff with jitter
        const base = initialDelayMs * Math.pow(2, attempt);
        const jitterAmount = base * jitter * (Math.random() * 2 - 1);
        delayMs = Math.min(base + jitterAmount, maxDelayMs);
      }

      console.warn(`Rate limited. Retrying in ${(delayMs / 1000).toFixed(1)}s... (attempt ${attempt + 1}/${maxRetries})`);
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
}

// Usage
const data = await withRetry(() =>
  fetchWithErrorHandling('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
);
```

## Request Queue with Rate Limiting

For applications that make many API calls, a request queue ensures you stay within limits:

```javascript
class RateLimitedQueue {
  #queue = [];
  #running = 0;
  #maxConcurrent;
  #minIntervalMs;
  #lastRequestTime = 0;

  constructor({ maxConcurrent = 3, requestsPerSecond = 5 }) {
    this.#maxConcurrent = maxConcurrent;
    this.#minIntervalMs = 1000 / requestsPerSecond;
  }

  async add(fn) {
    return new Promise((resolve, reject) => {
      this.#queue.push({ fn, resolve, reject });
      this.#processQueue();
    });
  }

  async #processQueue() {
    if (this.#running >= this.#maxConcurrent || !this.#queue.length) return;

    // Enforce minimum interval between requests
    const now = Date.now();
    const timeSinceLast = now - this.#lastRequestTime;
    if (timeSinceLast < this.#minIntervalMs) {
      setTimeout(() => this.#processQueue(), this.#minIntervalMs - timeSinceLast);
      return;
    }

    const { fn, resolve, reject } = this.#queue.shift();
    this.#running++;
    this.#lastRequestTime = Date.now();

    try {
      const result = await fn();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.#running--;
      this.#processQueue();
    }
  }
}

// CoinGecko free tier: 10-15 requests/minute
const coinGeckoQueue = new RateLimitedQueue({
  maxConcurrent: 1,
  requestsPerSecond: 0.2, // 12/minute = 0.2/second
});

// Fetch prices for many coins without hitting rate limits
const coinIds = ['bitcoin', 'ethereum', 'solana', 'cardano', 'polkadot', 'chainlink'];
const prices = await Promise.all(
  coinIds.map(id =>
    coinGeckoQueue.add(() =>
      fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`)
        .then(r => r.json())
    )
  )
);
```

## Batching Requests

Many APIs support batch requests that count as one API call:

```javascript
// CoinGecko: get all prices in one call instead of one per coin
async function getBatchPrices(coinIds) {
  const ids = coinIds.join(',');
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
  );
  return response.json();
}

// One request for all coins instead of 6
const allPrices = await getBatchPrices([
  'bitcoin', 'ethereum', 'solana', 'cardano', 'polkadot', 'chainlink'
]);
```

### Ethereum Batch RPC

```javascript
async function batchRpcCalls(rpcUrl, calls) {
  const requests = calls.map((call, i) => ({
    jsonrpc: '2.0',
    id: i,
    method: call.method,
    params: call.params,
  }));

  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requests), // Array = batch request
  });

  const results = await response.json();
  return results.sort((a, b) => a.id - b.id).map(r => r.result);
}

// Get balances for 10 addresses in one RPC call
const addresses = ['0xabc...', '0xdef...', /* ... */];
const balances = await batchRpcCalls('https://eth.llamarpc.com',
  addresses.map(addr => ({
    method: 'eth_getBalance',
    params: [addr, 'latest'],
  }))
);
```

## Rate Limit Monitoring

Track your usage to prevent hitting limits unexpectedly:

```javascript
class RateLimitTracker {
  #windows = new Map();

  track(apiName, limit, windowMs) {
    if (!this.#windows.has(apiName)) {
      this.#windows.set(apiName, { requests: [], limit, windowMs });
    }
  }

  checkAndRecord(apiName) {
    const window = this.#windows.get(apiName);
    if (!window) return true; // Unknown API, allow

    const now = Date.now();
    const cutoff = now - window.windowMs;

    // Remove old requests outside the window
    window.requests = window.requests.filter(t => t > cutoff);

    // Check if we're at the limit
    if (window.requests.length >= window.limit) {
      const oldestInWindow = window.requests[0];
      const waitMs = oldestInWindow + window.windowMs - now;
      console.warn(`Rate limit approaching for ${apiName}. Wait ${(waitMs/1000).toFixed(1)}s`);
      return false;
    }

    window.requests.push(now);
    return true;
  }

  getUsage(apiName) {
    const window = this.#windows.get(apiName);
    if (!window) return null;

    const now = Date.now();
    const active = window.requests.filter(t => t > now - window.windowMs);

    return {
      used: active.length,
      limit: window.limit,
      remaining: window.limit - active.length,
      resetIn: active.length > 0 ? active[0] + window.windowMs - now : 0,
    };
  }
}

const tracker = new RateLimitTracker();
tracker.track('coingecko', 10, 60000); // 10 per minute
tracker.track('etherscan', 5, 1000);   // 5 per second
```

## Python Rate Limiting

```python
import asyncio
import time
from collections import deque
from typing import Callable, Any
import httpx

class AsyncRateLimiter:
    def __init__(self, calls_per_second: float = 1.0):
        self.min_interval = 1.0 / calls_per_second
        self.last_call = 0.0
        self._lock = asyncio.Lock()

    async def acquire(self):
        async with self._lock:
            now = time.monotonic()
            elapsed = now - self.last_call
            if elapsed < self.min_interval:
                await asyncio.sleep(self.min_interval - elapsed)
            self.last_call = time.monotonic()

# Limit to 10 calls per minute (0.167/s)
coingecko_limiter = AsyncRateLimiter(calls_per_second=0.167)

async def fetch_price_limited(coin_id: str) -> dict:
    await coingecko_limiter.acquire()
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.coingecko.com/api/v3/simple/price",
            params={"ids": coin_id, "vs_currencies": "usd"},
        )
        response.raise_for_status()
        return response.json()

# Fetch multiple coins with rate limiting
async def fetch_all_prices(coin_ids: list[str]) -> dict:
    tasks = [fetch_price_limited(coin) for coin in coin_ids]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    prices = {}
    for coin_id, result in zip(coin_ids, results):
        if isinstance(result, dict) and coin_id in result:
            prices[coin_id] = result[coin_id].get("usd")
    return prices
```

## No-Key APIs for Prototyping

Avoid rate limit problems entirely when prototyping by using APIs that don't require keys. The [free-crypto-news API](https://free-crypto-news.com) provides news data without API key requirements for basic usage, making it perfect for development and small-scale production use.

## Conclusion

Rate limiting is a first-class concern for crypto API consumers. Use exponential backoff with jitter for retries, batch requests wherever possible, implement request queuing for high-throughput applications, and monitor your usage proactively. With these patterns, you can build reliable applications that stay within API limits even under unexpected load.
