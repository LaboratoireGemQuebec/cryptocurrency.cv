---
title: "Consuming a Crypto News API in Node.js"
description: "Learn how to integrate a cryptocurrency news API into your Node.js application. Covers REST fetching, filtering by coin, caching, and building a news aggregator."
date: "2026-03-30"
author: team
category: tutorial
tags: ["nodejs", "api", "news", "javascript", "developer", "aggregator"]
image: "/images/blog/crypto-news-api-nodejs.jpg"
imageAlt: "Node.js terminal showing cryptocurrency news API responses"
---

Crypto news is one of the most important data sources for traders, researchers, and application developers. Whether you are building a Discord bot that posts breaking news, a web app with a live news ticker, or an AI agent that monitors market sentiment, integrating a cryptocurrency news API in Node.js is straightforward once you understand the patterns.

## Choosing a Crypto News API

Several providers offer crypto news APIs. The [free-crypto-news API](https://free-crypto-news.com) stands out because it requires no API key for basic usage, making it ideal for getting started quickly. It aggregates news from hundreds of crypto publications and provides filtering by coin symbol, category, and date range.

Key features to look for in any crypto news API:

- **Symbol filtering**: Get news specifically about BTC, ETH, SOL
- **Category filtering**: DeFi, NFT, regulation, market analysis
- **RSS/Atom feeds**: For standard feed readers and integrations
- **No-key access**: Free tier without authentication overhead
- **Pagination**: Handle large result sets efficiently

## Basic Node.js Fetch Setup

Modern Node.js (18+) includes the fetch API natively:

```javascript
// news-client.js
const BASE_URL = 'https://free-crypto-news.com/api';

async function getLatestNews(options = {}) {
  const params = new URLSearchParams({
    limit: options.limit ?? 10,
    ...(options.symbols && { symbols: options.symbols.join(',') }),
    ...(options.category && { category: options.category }),
    ...(options.page && { page: options.page }),
  });

  const url = `${BASE_URL}/news?${params}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`News API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Fetch top 5 Bitcoin news items
const news = await getLatestNews({ symbols: ['BTC'], limit: 5 });
news.articles.forEach(article => {
  console.log(`[${article.source}] ${article.title}`);
  console.log(`  ${article.url}\n`);
});
```

## Building a Full News Client Class

For production use, encapsulate the API logic:

```javascript
// src/NewsClient.js
export class CryptoNewsClient {
  #baseUrl;
  #cache = new Map();
  #cacheTTL;

  constructor({ baseUrl = 'https://free-crypto-news.com/api', cacheTTL = 60000 } = {}) {
    this.#baseUrl = baseUrl;
    this.#cacheTTL = cacheTTL; // milliseconds
  }

  #getCacheKey(path, params) {
    return `${path}?${new URLSearchParams(params).toString()}`;
  }

  async #fetch(path, params = {}) {
    const cacheKey = this.#getCacheKey(path, params);
    const cached = this.#cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.#cacheTTL) {
      return cached.data;
    }

    const url = `${this.#baseUrl}${path}?${new URLSearchParams(params)}`;
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`API ${response.status}: ${body}`);
    }

    const data = await response.json();
    this.#cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  }

  async getNews({ symbols, category, limit = 20, page = 1 } = {}) {
    return this.#fetch('/news', {
      limit,
      page,
      ...(symbols?.length && { symbols: symbols.join(',') }),
      ...(category && { category }),
    });
  }

  async getTrending({ limit = 10 } = {}) {
    return this.#fetch('/news/trending', { limit });
  }

  async searchNews({ query, limit = 20 }) {
    return this.#fetch('/news/search', { q: query, limit });
  }
}
```

## Filtering News by Coin

One of the most useful features is filtering by cryptocurrency symbol:

```javascript
import { CryptoNewsClient } from './src/NewsClient.js';

const client = new CryptoNewsClient();

// Ethereum news only
const ethNews = await client.getNews({ symbols: ['ETH'], limit: 5 });
ethNews.articles.forEach(a => console.log(`ETH: ${a.title}`));

// Multiple coins
const defiNews = await client.getNews({ symbols: ['ETH', 'UNI', 'AAVE', 'COMP'] });
defiNews.articles.forEach(a => console.log(a.title));

// DeFi category news
const defiCategory = await client.getNews({ category: 'defi', limit: 10 });
```

## Building a News Aggregator Express Server

```javascript
// server.js
import express from 'express';
import { CryptoNewsClient } from './src/NewsClient.js';

const app = express();
const client = new CryptoNewsClient({ cacheTTL: 120000 }); // 2 min cache

// GET /api/news?symbols=BTC,ETH&limit=10
app.get('/api/news', async (req, res) => {
  try {
    const { symbols, category, limit = '20', page = '1' } = req.query;
    const data = await client.getNews({
      symbols: symbols?.split(',').filter(Boolean),
      category,
      limit: parseInt(limit),
      page: parseInt(page),
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/news/trending
app.get('/api/news/trending', async (req, res) => {
  try {
    const data = await client.getTrending();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('News API server running on :3000'));
```

## Consuming RSS Feeds

The free-crypto-news API also provides RSS/Atom feeds. Here is how to parse them in Node.js:

```bash
npm install rss-parser
```

```javascript
import Parser from 'rss-parser';

const parser = new Parser();

async function fetchCryptoRSS(symbol = 'BTC') {
  const feed = await parser.parseURL(
    `https://free-crypto-news.com/rss/${symbol.toLowerCase()}`
  );

  console.log(`Feed: ${feed.title}`);
  feed.items.slice(0, 5).forEach(item => {
    console.log(`\n${item.title}`);
    console.log(`  Link: ${item.link}`);
    console.log(`  Date: ${item.pubDate}`);
    if (item.contentSnippet) {
      console.log(`  ${item.contentSnippet.slice(0, 150)}...`);
    }
  });
}

await fetchCryptoRSS('ETH');
```

## Real-Time News Polling Loop

For applications that need to stay current without WebSockets, a polling loop works well:

```javascript
class NewsPoller {
  #client;
  #symbols;
  #interval;
  #timer = null;
  #seenUrls = new Set();
  #callback;

  constructor({ symbols, intervalMs = 60000, onNewArticle }) {
    this.#client = new CryptoNewsClient();
    this.#symbols = symbols;
    this.#interval = intervalMs;
    this.#callback = onNewArticle;
  }

  async #poll() {
    try {
      const data = await this.#client.getNews({
        symbols: this.#symbols,
        limit: 20,
      });

      for (const article of data.articles) {
        if (!this.#seenUrls.has(article.url)) {
          this.#seenUrls.add(article.url);
          this.#callback(article);
        }
      }
    } catch (error) {
      console.error('Poll error:', error.message);
    }
  }

  start() {
    this.#poll(); // immediate first poll
    this.#timer = setInterval(() => this.#poll(), this.#interval);
    return this;
  }

  stop() {
    if (this.#timer) {
      clearInterval(this.#timer);
      this.#timer = null;
    }
  }
}

// Usage
const poller = new NewsPoller({
  symbols: ['BTC', 'ETH'],
  intervalMs: 60000,
  onNewArticle: (article) => {
    console.log(`NEW: ${article.title}`);
    console.log(`     ${article.url}`);
  },
}).start();
```

## Sending News to Discord

Combine the news client with Discord webhooks for a news bot:

```javascript
async function postToDiscord(webhookUrl, article) {
  const embed = {
    title: article.title,
    url: article.url,
    description: article.description?.slice(0, 200),
    footer: { text: `${article.source} · ${new Date(article.publishedAt).toUTCString()}` },
    color: 0x1DA1F2,
  };

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ embeds: [embed] }),
  });
}

const poller = new NewsPoller({
  symbols: ['BTC'],
  onNewArticle: (article) => postToDiscord(process.env.DISCORD_WEBHOOK, article),
}).start();
```

## Error Handling and Retry Logic

```javascript
async function fetchWithRetry(fn, maxRetries = 3, delayMs = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;

      const isRetryable = error.message.includes('429') ||
                          error.message.includes('503') ||
                          error.name === 'TimeoutError';

      if (!isRetryable) throw error;

      const delay = delayMs * Math.pow(2, attempt - 1); // exponential backoff
      console.warn(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

// Usage
const news = await fetchWithRetry(() => client.getNews({ symbols: ['BTC'] }));
```

## Conclusion

Consuming a crypto news API in Node.js is simple with the modern fetch API and a well-designed client class. The free-crypto-news API eliminates authentication friction for getting started. Whether you are building a news aggregator, a Discord bot, a trading signal system, or an AI context provider, the patterns in this guide give you a solid, production-ready foundation.
