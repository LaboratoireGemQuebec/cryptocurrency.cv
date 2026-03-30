---
title: "How to Use Crypto RSS Feeds in Your App"
description: "Learn how to integrate cryptocurrency RSS and Atom feeds into web apps, Discord bots, and data pipelines. Covers parsing, filtering, and the free-crypto-news RSS API."
date: "2026-03-30"
author: team
category: tutorial
tags: ["rss", "news", "javascript", "python", "developer", "feeds"]
image: "/images/blog/crypto-rss-feed-guide.jpg"
imageAlt: "RSS feed icon with cryptocurrency news flowing into multiple application types"
---

RSS feeds have been the backbone of news distribution for over two decades, and they remain one of the most practical ways to ingest structured content in developer projects. In the crypto space, RSS gives you a standardized way to pull news from dozens of sources — Bitcoin Magazine, CoinDesk, Decrypt, and aggregators like [free-crypto-news](https://free-crypto-news.com) — into your own applications.

## Why RSS Still Matters for Crypto Developers

RSS has several advantages over scraping or custom APIs:

- **Standardized format**: One parser works for all compliant feeds
- **No JavaScript required**: Feeds are plain XML, not dynamic web pages
- **Push-friendly**: Easy to poll for new content on a schedule
- **Widely supported**: Built-in support in most languages and frameworks
- **Historical content**: Feeds typically include the last 20-50 items

The [free-crypto-news RSS feeds](https://free-crypto-news.com/rss) aggregate hundreds of crypto news sources into per-coin and per-category feeds, saving you the work of managing individual source subscriptions.

## RSS Feed URLs

```
# All crypto news
https://free-crypto-news.com/rss

# Bitcoin-specific news
https://free-crypto-news.com/rss/btc

# Ethereum-specific news
https://free-crypto-news.com/rss/eth

# DeFi category
https://free-crypto-news.com/rss/category/defi

# Regulation news
https://free-crypto-news.com/rss/category/regulation
```

## Parsing RSS in Node.js

```bash
npm install rss-parser
```

```javascript
import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media'],
      ['media:thumbnail', 'thumbnail'],
    ],
  },
});

async function fetchCryptoFeed(symbol = 'btc') {
  const feed = await parser.parseURL(
    `https://free-crypto-news.com/rss/${symbol.toLowerCase()}`
  );

  return {
    title: feed.title,
    description: feed.description,
    lastBuildDate: feed.lastBuildDate,
    items: feed.items.map(item => ({
      title: item.title,
      link: item.link,
      pubDate: new Date(item.pubDate),
      summary: item.contentSnippet?.slice(0, 200),
      source: item.creator || extractSource(item.link),
      image: item.thumbnail?.$ ?.url || item.media?.$ ?.url,
    })),
  };
}

function extractSource(url) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return 'unknown';
  }
}

const feed = await fetchCryptoFeed('eth');
console.log(`Feed: ${feed.title} (${feed.items.length} items)`);
feed.items.slice(0, 5).forEach(item => {
  console.log(`\n${item.title}`);
  console.log(`  ${item.source} | ${item.pubDate.toLocaleString()}`);
});
```

## Parsing RSS in Python

```bash
pip install feedparser
```

```python
import feedparser
from datetime import datetime
from dataclasses import dataclass
from typing import Optional
import time

@dataclass
class NewsItem:
    title: str
    link: str
    published: datetime
    summary: str
    source: str
    image_url: Optional[str] = None

def parse_feed(url: str) -> list[NewsItem]:
    """Parse an RSS/Atom feed and return structured items."""
    feed = feedparser.parse(url)

    items = []
    for entry in feed.entries:
        # Parse publish time
        pub_time = datetime.fromtimestamp(
            time.mktime(entry.get("published_parsed", time.gmtime()))
        )

        # Extract image
        image_url = None
        if hasattr(entry, "media_thumbnail") and entry.media_thumbnail:
            image_url = entry.media_thumbnail[0].get("url")
        elif hasattr(entry, "media_content") and entry.media_content:
            image_url = entry.media_content[0].get("url")

        items.append(NewsItem(
            title=entry.get("title", ""),
            link=entry.get("link", ""),
            published=pub_time,
            summary=entry.get("summary", "")[:300],
            source=feed.feed.get("title", "Unknown"),
            image_url=image_url,
        ))

    return items

# Fetch Bitcoin RSS feed
btc_news = parse_feed("https://free-crypto-news.com/rss/btc")
print(f"Found {len(btc_news)} Bitcoin news items")
for item in btc_news[:5]:
    print(f"\n{item.title}")
    print(f"  {item.source} | {item.published.strftime('%Y-%m-%d %H:%M')}")
```

## Building a Multi-Feed Aggregator

```python
import asyncio
import aiohttp
import feedparser
from datetime import datetime, timezone
import time

FEEDS = {
    "bitcoin": "https://free-crypto-news.com/rss/btc",
    "ethereum": "https://free-crypto-news.com/rss/eth",
    "defi": "https://free-crypto-news.com/rss/category/defi",
    "solana": "https://free-crypto-news.com/rss/sol",
}

async def fetch_feed_async(session: aiohttp.ClientSession, name: str, url: str) -> list[dict]:
    async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as response:
        content = await response.text()
        feed = feedparser.parse(content)

        items = []
        for entry in feed.entries[:10]:
            pub = datetime.fromtimestamp(
                time.mktime(entry.get("published_parsed", time.gmtime())),
                tz=timezone.utc
            )
            items.append({
                "category": name,
                "title": entry.get("title", ""),
                "link": entry.get("link", ""),
                "published": pub,
                "source": feed.feed.get("title", name),
            })

        return items

async def aggregate_feeds() -> list[dict]:
    async with aiohttp.ClientSession() as session:
        tasks = [
            fetch_feed_async(session, name, url)
            for name, url in FEEDS.items()
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)

    all_items = []
    for result in results:
        if isinstance(result, list):
            all_items.extend(result)

    # Sort by publish time, newest first
    return sorted(all_items, key=lambda x: x["published"], reverse=True)

items = asyncio.run(aggregate_feeds())
print(f"Aggregated {len(items)} items from {len(FEEDS)} feeds")
for item in items[:10]:
    age_hours = (datetime.now(timezone.utc) - item["published"]).total_seconds() / 3600
    print(f"[{item['category']:10}] ({age_hours:.1f}h ago) {item['title'][:60]}")
```

## RSS to Discord Bot

```javascript
import Parser from 'rss-parser';

const parser = new Parser();
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL;
const POLL_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Track seen items to avoid duplicates
const seenLinks = new Set();

async function pollAndPost(feedUrl, category) {
  const feed = await parser.parseURL(feedUrl);

  for (const item of feed.items.slice(0, 5)) {
    if (seenLinks.has(item.link)) continue;
    seenLinks.add(item.link);

    const embed = {
      title: item.title?.slice(0, 256),
      url: item.link,
      description: item.contentSnippet?.slice(0, 300),
      footer: {
        text: `${category} | ${new Date(item.pubDate).toUTCString()}`,
      },
      color: { bitcoin: 0xF7931A, ethereum: 0x627EEA, defi: 0x00D4AA }[category] ?? 0x888888,
    };

    await fetch(DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    });

    // Rate limit: one message per second
    await new Promise(r => setTimeout(r, 1000));
  }
}

// Initialize with current content (mark as seen without posting)
const initFeed = await parser.parseURL('https://free-crypto-news.com/rss/btc');
initFeed.items.forEach(item => seenLinks.add(item.link));

// Start polling for new content
setInterval(() => {
  pollAndPost('https://free-crypto-news.com/rss/btc', 'bitcoin');
}, POLL_INTERVAL);
```

## Converting RSS to JSON API

Sometimes you need to expose RSS data as JSON for frontend consumption. Here is a lightweight proxy:

```javascript
import express from 'express';
import Parser from 'rss-parser';

const app = express();
const parser = new Parser();

// Cache object
const cache = new Map();

app.get('/api/feed/:symbol', async (req, res) => {
  const { symbol } = req.params;
  const limit = parseInt(req.query.limit) || 20;
  const cacheKey = `${symbol}-${limit}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.ts < 60000) {
    return res.json(cached.data);
  }

  try {
    const feed = await parser.parseURL(
      `https://free-crypto-news.com/rss/${symbol.toLowerCase()}`
    );

    const data = {
      title: feed.title,
      symbol: symbol.toUpperCase(),
      items: feed.items.slice(0, limit).map(item => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        summary: item.contentSnippet?.slice(0, 200),
      })),
    };

    cache.set(cacheKey, { data, ts: Date.now() });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
```

## OPML Export for Feed Readers

If you want to provide a list of feeds for users to import into their RSS reader:

```javascript
function generateOPML(feeds) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<opml version="1.0">',
    '  <head><title>Crypto News Feeds</title></head>',
    '  <body>',
    ...feeds.map(f =>
      `    <outline text="${f.title}" type="rss" xmlUrl="${f.url}" htmlUrl="${f.htmlUrl}"/>`
    ),
    '  </body>',
    '</opml>',
  ];
  return lines.join('\n');
}

const feeds = [
  { title: 'Bitcoin News', url: 'https://free-crypto-news.com/rss/btc', htmlUrl: 'https://free-crypto-news.com' },
  { title: 'Ethereum News', url: 'https://free-crypto-news.com/rss/eth', htmlUrl: 'https://free-crypto-news.com' },
  { title: 'DeFi News', url: 'https://free-crypto-news.com/rss/category/defi', htmlUrl: 'https://free-crypto-news.com' },
];

console.log(generateOPML(feeds));
```

## Conclusion

RSS feeds are an underappreciated but powerful tool for crypto news integration. They are standardized, easy to parse in any language, and require no API keys. The free-crypto-news RSS feeds provide a comprehensive aggregation of crypto news by coin and category, making them an ideal starting point for any application that needs to stay current with the market.
