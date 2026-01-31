# API Routes Catalog

This document catalogs all API routes in `/src/app/api/` across the news, market, AI, social, and premium directories.

---

## Table of Contents

1. [News API Routes](#news-api-routes)
2. [Market API Routes](#market-api-routes)
3. [AI API Routes](#ai-api-routes)
4. [Social API Routes](#social-api-routes)
5. [Premium API Routes](#premium-api-routes)

---

## News API Routes

### GET `/api/news`

**File:** [src/app/api/news/route.ts](../src/app/api/news/route.ts)

**Description:** Fetches the latest crypto news articles with optional filtering and translation.

**HTTP Methods:** `GET`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 10 | Number of articles to return |
| `source` | string | - | Filter by news source |
| `category` | string | - | Filter by category (general, bitcoin, defi, nft, research, institutional, etf, derivatives, onchain, fintech, macro, quant, journalism, ethereum, asia, tradfi, mainstream, mining, gaming, altl1, stablecoin) |
| `from` | string | - | Start date for date range filter |
| `to` | string | - | End date for date range filter |
| `page` | number | - | Page number for pagination |
| `per_page` | number | - | Items per page |
| `lang` | string | en | Target language for translation |

**Response Format:**
```json
{
  "articles": [...],
  "lang": "en",
  "availableLanguages": ["en", "es", "fr", ...],
  "availableCategories": ["general", "bitcoin", ...],
  "timing": { "requestTime": 123 }
}
```

**Authentication:** None required

**Rate Limits:** Standard (no explicit limit, revalidate every 5 minutes)

---

### GET `/api/news/categories`

**File:** [src/app/api/news/categories/route.ts](../src/app/api/news/categories/route.ts)

**Description:** Returns all available news categories with source counts.

**HTTP Methods:** `GET`

**Query Parameters:** None

**Response Format:**
```json
{
  "categories": [
    { "id": "general", "name": "General", "description": "...", "sourceCount": 25 }
  ],
  "usage": { "example": "/api/news?category=institutional", "description": "..." }
}
```

**Authentication:** None required

**Rate Limits:** Cached for 1 hour

---

### POST `/api/news/extract`

**File:** [src/app/api/news/extract/route.ts](../src/app/api/news/extract/route.ts)

**Description:** Extracts article content from a given URL.

**HTTP Methods:** `POST`

**Request Body:**
```json
{
  "url": "https://example.com/article"
}
```

**Response Format:**
```json
{
  "url": "...",
  "title": "...",
  "content": "...",
  "author": "...",
  "published_date": "...",
  "word_count": 1500,
  "reading_time_minutes": 8
}
```

**Authentication:** None required

**Rate Limits:** None specified

---

### GET `/api/news/international`

**File:** [src/app/api/news/international/route.ts](../src/app/api/news/international/route.ts)

**Description:** Fetches news from 50+ international crypto news sources across 16 languages and 5 regions.

**HTTP Methods:** `GET`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `language` | string | all | Filter by language (ko, zh, ja, es, pt, de, fr, ru, tr, it, nl, pl, id, vi, th, ar, all) |
| `translate` | boolean | false | Enable auto-translation to English |
| `limit` | number | 20 | Number of articles (1-100) |
| `region` | string | all | Filter by region (asia, europe, latam, mena, sea, all) |
| `sources` | boolean | false | Return source list instead of articles |

**Response Format:**
```json
{
  "articles": [...],
  "meta": {
    "total": 100,
    "languages": [...],
    "regions": [...],
    "translationEnabled": false
  },
  "_links": { "self": "...", "sources": "..." },
  "timing": { "requestTime": 123 }
}
```

**Authentication:** None required

**Rate Limits:** Cached for 5 minutes

---

## Market API Routes

### GET `/api/market/coins`

**File:** [src/app/api/market/coins/route.ts](../src/app/api/market/coins/route.ts)

**Description:** Get list of all coins or top coins by market cap.

**HTTP Methods:** `GET`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `type` | string | top | 'list' for all coins, 'top' for top by market cap |
| `limit` | number | 100 | Number of coins for 'top' type (max 250) |

**Response Format:**
```json
{
  "coins": [...],
  "total": 250
}
```

**Authentication:** None required

**Rate Limits:** Cached for 1 hour (list) or 30 seconds (top)

---

### GET `/api/market/compare`

**File:** [src/app/api/market/compare/route.ts](../src/app/api/market/compare/route.ts)

**Description:** Compare multiple cryptocurrencies side by side.

**HTTP Methods:** `GET`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ids` | string | Yes | Comma-separated coin IDs (max 25) |

**Response Format:** Comparison data object

**Authentication:** None required

**Rate Limits:** Cached for 30 seconds

---

### GET `/api/market/categories`

**File:** [src/app/api/market/categories/route.ts](../src/app/api/market/categories/route.ts)

**Description:** Get list of all cryptocurrency categories (DeFi, Gaming, L1, L2, etc.).

**HTTP Methods:** `GET`

**Query Parameters:** None

**Response Format:** Array of categories

**Authentication:** None required

**Rate Limits:** Cached for 1 hour

---

### GET `/api/market/categories/[id]`

**File:** [src/app/api/market/categories/[id]/route.ts](../src/app/api/market/categories/[id]/route.ts)

**Description:** Get coins in a specific category.

**HTTP Methods:** `GET`

**Path Parameters:**
| Parameter | Description |
|-----------|-------------|
| `id` | Category ID (e.g., 'decentralized-finance-defi') |

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `per_page` | number | 100 | Coins per page (max 250) |
| `page` | number | 1 | Page number |

**Response Format:** Array of token prices

**Authentication:** None required

**Rate Limits:** Cached for 5 minutes

---

### GET `/api/market/defi`

**File:** [src/app/api/market/defi/route.ts](../src/app/api/market/defi/route.ts)

**Description:** Get global DeFi market statistics.

**HTTP Methods:** `GET`

**Query Parameters:** None

**Response Format:** GlobalDeFi object with TVL data

**Authentication:** None required

**Rate Limits:** Cached for 5 minutes

---

### GET `/api/market/derivatives`

**File:** [src/app/api/market/derivatives/route.ts](../src/app/api/market/derivatives/route.ts)

**Description:** Get derivatives market tickers (futures, perpetuals).

**HTTP Methods:** `GET`

**Query Parameters:** None

**Response Format:** Array of derivative tickers

**Authentication:** None required

**Rate Limits:** Cached for 2 minutes

---

### GET `/api/market/exchanges`

**File:** [src/app/api/market/exchanges/route.ts](../src/app/api/market/exchanges/route.ts)

**Description:** Get list of all cryptocurrency exchanges.

**HTTP Methods:** `GET`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `per_page` | number | 100 | Exchanges per page (max 250) |
| `page` | number | 1 | Page number |

**Response Format:** Array of exchanges

**Authentication:** None required

**Rate Limits:** Cached for 1 hour

---

### GET `/api/market/exchanges/[id]`

**File:** [src/app/api/market/exchanges/[id]/route.ts](../src/app/api/market/exchanges/[id]/route.ts)

**Description:** Get detailed information about a specific exchange.

**HTTP Methods:** `GET`

**Path Parameters:**
| Parameter | Description |
|-----------|-------------|
| `id` | Exchange ID (e.g., 'binance', 'coinbase-exchange') |

**Response Format:** Exchange details object

**Authentication:** None required

**Rate Limits:** Cached for 2 minutes

---

### GET `/api/market/search`

**File:** [src/app/api/market/search/route.ts](../src/app/api/market/search/route.ts)

**Description:** Search for coins, exchanges, and categories.

**HTTP Methods:** `GET`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Search query (min 2 characters) |

**Response Format:** Search results

**Authentication:** None required

**Rate Limits:** Cached for 5 minutes

---

### GET `/api/market/history/[coinId]`

**File:** [src/app/api/market/history/[coinId]/route.ts](../src/app/api/market/history/[coinId]/route.ts)

**Description:** Get historical price data for a cryptocurrency.

**HTTP Methods:** `GET`

**Path Parameters:**
| Parameter | Description |
|-----------|-------------|
| `coinId` | Coin ID (e.g., 'bitcoin') |

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `days` | number/string | 30 | Days of history (1, 7, 14, 30, 90, 180, 365, 'max') |
| `interval` | string | - | Data interval ('minutely', 'hourly', 'daily') |

**Response Format:** Historical data with prices, market cap, volumes

**Authentication:** None required

**Rate Limits:** 60s cache for 1 day, 5min for 7 days, 15min for longer

---

### GET `/api/market/ohlc/[coinId]`

**File:** [src/app/api/market/ohlc/[coinId]/route.ts](../src/app/api/market/ohlc/[coinId]/route.ts)

**Description:** Get OHLC candlestick data for a cryptocurrency.

**HTTP Methods:** `GET`

**Path Parameters:**
| Parameter | Description |
|-----------|-------------|
| `coinId` | Coin ID (e.g., 'bitcoin') |

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `days` | number | 30 | Number of days (1-365) |

**Response Format:** Array of OHLC data points

**Authentication:** None required

**Rate Limits:** Dynamic caching based on days

---

### GET `/api/market/snapshot/[coinId]`

**File:** [src/app/api/market/snapshot/[coinId]/route.ts](../src/app/api/market/snapshot/[coinId]/route.ts)

**Description:** Get historical price snapshot at a specific date.

**HTTP Methods:** `GET`

**Path Parameters:**
| Parameter | Description |
|-----------|-------------|
| `coinId` | Coin ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `date` | string | Yes | Date in DD-MM-YYYY format |

**Response Format:** Historical snapshot

**Authentication:** None required

**Rate Limits:** Cached for 24 hours (immutable data)

---

### GET `/api/market/tickers/[coinId]`

**File:** [src/app/api/market/tickers/[coinId]/route.ts](../src/app/api/market/tickers/[coinId]/route.ts)

**Description:** Get trading pairs/tickers across exchanges.

**HTTP Methods:** `GET`

**Path Parameters:**
| Parameter | Description |
|-----------|-------------|
| `coinId` | Coin ID |

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |

**Response Format:** Ticker data

**Authentication:** None required

**Rate Limits:** Cached for 2 minutes

---

### GET `/api/market/social/[coinId]`

**File:** [src/app/api/market/social/[coinId]/route.ts](../src/app/api/market/social/[coinId]/route.ts)

**Description:** Get developer and community statistics for a coin.

**HTTP Methods:** `GET`

**Path Parameters:**
| Parameter | Description |
|-----------|-------------|
| `coinId` | Coin ID |

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `type` | string | all | 'all', 'developer', or 'community' |

**Response Format:** Developer and/or community data

**Authentication:** None required

**Rate Limits:** Cached for 30 minutes

---

### GET/POST `/api/market/orderbook`

**File:** [src/app/api/market/orderbook/route.ts](../src/app/api/market/orderbook/route.ts)

**Description:** Multi-exchange order book aggregation and smart routing.

**HTTP Methods:** `GET`, `POST`

#### GET Parameters:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `symbol` | string | Required | Symbol (e.g., 'BTC', 'ETH') |
| `action` | string | aggregate | Action type (see below) |
| `exchanges` | string | binance,coinbase,kraken,okx,bybit | Comma-separated exchanges |
| `depth` | number | 25 | Order book depth (for single action) |
| `limit` | number | 20 | Snapshot limit |

**GET Actions:**
- `aggregate` - Aggregated order book
- `depth` - Depth chart data
- `single` - Single exchange order book
- `nbbo` - National Best Bid/Offer
- `metrics` - Order book metrics
- `whales` - Whale orders and price walls
- `snapshots` - List saved snapshots

#### POST Request Body:
```json
{
  "action": "smart-route | save-snapshot | get-snapshot | compare-exchanges",
  "symbol": "BTC",
  "orderType": "buy | sell",
  "quantity": 1.5,
  "exchanges": ["binance", "coinbase"]
}
```

**Authentication:** None required

**Rate Limits:** Rate limited via `checkRateLimit` middleware

---

## AI API Routes

### GET/POST `/api/ai`

**File:** [src/app/api/ai/route.ts](../src/app/api/ai/route.ts)

**Description:** Multi-action AI endpoint for article analysis.

**HTTP Methods:** `GET`, `POST`

#### GET Response:
Returns configuration info and available actions.

#### POST Request Body:
```json
{
  "action": "summarize | sentiment | facts | factcheck | questions | categorize | translate",
  "title": "Article title",
  "content": "Article content",
  "options": {
    "length": "short | medium | long",
    "targetLanguage": "es"
  }
}
```

**Authentication:** Requires AI API key (OPENAI_API_KEY, ANTHROPIC_API_KEY, GROQ_API_KEY, or OPENROUTER_API_KEY)

**Rate Limits:** None specified

---

### GET/POST `/api/ai/agent`

**File:** [src/app/api/ai/agent/route.ts](../src/app/api/ai/agent/route.ts)

**Description:** AI Market Intelligence Agent for market analysis.

**HTTP Methods:** `GET`, `POST`

#### GET Parameters:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `format` | string | full | Response format (full, summary, signals, opportunities, risks) |

#### POST Request Body:
```json
{
  "question": "What's happening with Bitcoin today?",
  "assets": ["bitcoin", "ethereum"],
  "timeHorizon": "short-term",
  "focusAreas": ["price", "sentiment"]
}
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "overallRegime": "bullish",
    "fearGreedIndex": 65,
    "activeSignals": [...],
    "topOpportunities": [...],
    "riskAlerts": [...]
  }
}
```

**Authentication:** None required (uses server-side AI)

**Rate Limits:** Revalidate every 60 seconds

---

### GET `/api/ai/brief`

**File:** [src/app/api/ai/brief/route.ts](../src/app/api/ai/brief/route.ts)

**Description:** Generate a daily crypto news brief.

**HTTP Methods:** `GET`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `date` | string | today | Date in YYYY-MM-DD format |
| `format` | string | full | 'full' or 'summary' |

**Authentication:** Requires AI API key configured

**Rate Limits:** None specified

---

### GET/POST `/api/ai/counter`

**File:** [src/app/api/ai/counter/route.ts](../src/app/api/ai/counter/route.ts)

**Description:** Generate counter-arguments for a claim.

**HTTP Methods:** `GET` (usage info), `POST`

#### POST Request Body:
```json
{
  "claim": "Bitcoin will replace the US dollar by 2030",
  "context": "Article discusses hyperbitcoinization theory"
}
```

**Response Format:**
```json
{
  "success": true,
  "counter": {
    "originalClaim": "...",
    "counterArguments": [...],
    "assumptions": [...],
    "overallAssessment": {...}
  }
}
```

**Authentication:** Requires AI API key configured

**Rate Limits:** None specified

---

### GET/POST `/api/ai/debate`

**File:** [src/app/api/ai/debate/route.ts](../src/app/api/ai/debate/route.ts)

**Description:** Generate bull vs bear debate on an article or topic.

**HTTP Methods:** `GET` (usage info), `POST`

#### POST Request Body:
```json
{
  "article": { "title": "...", "content": "..." },
  "topic": "Bitcoin reaching $200k in 2026"
}
```

**Response Format:**
```json
{
  "success": true,
  "debate": {
    "topic": "...",
    "bullCase": {...},
    "bearCase": {...},
    "neutralAnalysis": {...}
  }
}
```

**Authentication:** Requires AI API key configured

**Rate Limits:** None specified

---

### GET/POST `/api/ai/entities`

**File:** [src/app/api/ai/entities/route.ts](../src/app/api/ai/entities/route.ts)

**Description:** Extract named entities from text (crypto-focused).

**HTTP Methods:** `GET`, `POST`

#### GET Parameters:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | string | Yes | Text to extract entities from |
| `types` | string | No | Comma-separated entity types |

#### POST Request Body:
```json
{
  "text": "Bitcoin hit $100k after SEC approved ETF",
  "types": ["cryptocurrency", "amount", "organization"]
}
```

**Entity Types:** person, organization, cryptocurrency, exchange, protocol, location, event, amount

**Authentication:** Uses GROQ_API_KEY if available, falls back to pattern matching

**Rate Limits:** None specified

---

### GET/POST `/api/ai/oracle`

**File:** [src/app/api/ai/oracle/route.ts](../src/app/api/ai/oracle/route.ts)

**Description:** Conversational AI assistant for crypto market queries.

**HTTP Methods:** `GET`, `POST`

#### GET Parameters:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Query string |

#### POST Request Body:
```json
{
  "query": "What's the current Bitcoin price?",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Response Format:**
```json
{
  "answer": "Bitcoin is trading at...",
  "sources": [...],
  "data": { "type": "market", "value": {...} }
}
```

**Context Fetched:** Prices (Bitcoin, Ethereum, etc.), Fear & Greed, Top Gainers/Losers, Trending coins, Global market data, Gas prices, DeFi TVL, News

**Authentication:** Uses GROQ_API_KEY if available, falls back to templated responses

**Rate Limits:** Various revalidation times for data sources

---

### POST `/api/ai/relationships`

**File:** [src/app/api/ai/relationships/route.ts](../src/app/api/ai/relationships/route.ts)

**Description:** Extract relationships between entities from text.

**HTTP Methods:** `POST`

**Request Body:**
```json
{
  "text": "Bitcoin surpassed $100K as the SEC approved the ETF"
}
```

**Response Format:**
```json
{
  "text_length": 54,
  "relationships": [
    { "subject": "Bitcoin", "predicate": "surpassed", "object": "$100K", "confidence": 0.95 }
  ],
  "count": 1
}
```

**Authentication:** Requires GROQ_API_KEY

**Rate Limits:** None specified

---

### POST `/api/ai/summarize`

**File:** [src/app/api/ai/summarize/route.ts](../src/app/api/ai/summarize/route.ts)

**Description:** Summarize text or URL content.

**HTTP Methods:** `POST`

**Request Body:**
```json
{
  "text": "Long article content...",
  "url": "https://example.com/article",
  "type": "sentence | paragraph | bullets"
}
```

**Response Format:**
```json
{
  "summary": "...",
  "type": "paragraph",
  "originalLength": 5000,
  "summaryLength": 200
}
```

**Authentication:** Uses GROQ_API_KEY if available, falls back to extractive summary

**Rate Limits:** None specified

---

## Social API Routes

### GET `/api/social`

**File:** [src/app/api/social/route.ts](../src/app/api/social/route.ts)

**Description:** Social Intelligence API aggregating data from Discord, Telegram, LunarCrush, and Santiment.

**HTTP Methods:** `GET`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `view` | string | full | View type (full, trends, metrics, messages, trending) |
| `symbols` | string | - | Comma-separated ticker symbols |
| `limit` | number | 20 | Number of results (max 100) |
| `platform` | string | all | Platform filter (all, discord, telegram, lunarcrush, santiment) |
| `format` | string | json | Response format (json, minimal) |

**Response Format:**
```json
{
  "trends": [...],
  "lunarcrush": [...],
  "santiment": [...],
  "messages": [...],
  "lastUpdated": "...",
  "sources": [...]
}
```

**Authentication:** None required (uses server-side API keys)

**Rate Limits:** Revalidate every 60 seconds

---

### GET `/api/social/discord`

**File:** [src/app/api/social/discord/route.ts](../src/app/api/social/discord/route.ts)

**Description:** Monitor Discord channels for crypto intelligence.

**HTTP Methods:** `GET`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `channel_id` | string | One required | Discord channel ID |
| `guild_id` | string | One required | Discord server ID |
| `limit` | number | 100 | Message limit (max 500) |
| `keyword` | string | No | Filter by keyword |
| `ticker` | string | No | Filter by ticker mention |

**Response Format:**
```json
{
  "messages": [...],
  "channelStats": [...],
  "trending": {...},
  "alerts": [...]
}
```

**Authentication:** Requires DISCORD_BOT_TOKEN environment variable

**Rate Limits:** Revalidate every 60 seconds

---

### GET/POST `/api/social/influencer-score`

**File:** [src/app/api/social/influencer-score/route.ts](../src/app/api/social/influencer-score/route.ts)

**Description:** Track and calculate reliability scores for crypto influencers.

**HTTP Methods:** `GET`, `POST`

#### GET Parameters:
| Parameter | Type | Description |
|-----------|------|-------------|
| `handle` | string | Specific influencer handle |
| `platform` | string | Platform (default: twitter) |
| `min_score` | number | Minimum reliability score filter |

#### POST Request Body:
```json
{
  "handle": "cryptoinfluencer",
  "platform": "twitter",
  "prediction_result": true
}
```

**Response Format:**
```json
{
  "total": 50,
  "leaderboard": [...],
  "methodology": {...}
}
```

**Authentication:** None required (uses Vercel KV)

**Rate Limits:** None specified

---

### GET/POST `/api/social/monitor`

**File:** [src/app/api/social/monitor/route.ts](../src/app/api/social/monitor/route.ts)

**Description:** Social channel monitoring for Discord and Telegram.

**HTTP Methods:** `GET`, `POST`

#### GET Parameters:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `platform` | string | - | Filter by platform |
| `channel` | string | - | Filter by channel name |
| `coin` | string | - | Filter by coin mention |
| `since` | string | - | ISO timestamp filter |
| `limit` | number | 50 | Message limit |

#### POST Actions:
- `add_channel` - Add channel to monitor
- `remove_channel` - Remove channel
- `ingest` - Ingest new message

**Response Format:**
```json
{
  "platform": "all",
  "channels": 5,
  "messages": [...],
  "trending": [...],
  "topInfluencers": [...]
}
```

**Authentication:** None required

**Rate Limits:** None specified

---

### GET `/api/social/x/sentiment`

**File:** [src/app/api/social/x/sentiment/route.ts](../src/app/api/social/x/sentiment/route.ts)

**Description:** Get sentiment analysis from X/Twitter influencer lists (uses Nitter + Groq AI).

**HTTP Methods:** `GET`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `list` | string | default | Influencer list ID |
| `refresh` | boolean | false | Force refresh |
| `tweets` | number | 10 | Tweets per user (max 20) |

**Response Format:**
```json
{
  "success": true,
  "data": {
    "sentiment": { "score": 0.42, "label": "bullish", "confidence": 0.85 },
    "topTickers": [...],
    "userBreakdown": [...],
    "recentTweets": [...]
  }
}
```

**Authentication:** None required (no API key needed)

**Rate Limits:** maxDuration = 60 seconds

---

### GET/POST `/api/social/x/lists`

**File:** [src/app/api/social/x/lists/route.ts](../src/app/api/social/x/lists/route.ts)

**Description:** Manage custom influencer lists for X sentiment tracking.

**HTTP Methods:** `GET`, `POST`

#### POST Request Body:
```json
{
  "name": "ETH Builders",
  "description": "Ethereum core developers",
  "users": [
    { "username": "VitalikButerin", "category": "founder", "weight": 0.9 }
  ]
}
```

**User Categories:** whale, influencer, analyst, developer, founder, trader

**Response Format:**
```json
{
  "success": true,
  "data": {
    "lists": [...],
    "totalLists": 5,
    "totalInfluencers": 100
  }
}
```

**Authentication:** None required

**Rate Limits:** Max 50 users per list

---

## Premium API Routes

All premium routes require **x402 micropayments** unless otherwise noted.

### GET `/api/premium`

**File:** [src/app/api/premium/route.ts](../src/app/api/premium/route.ts)

**Description:** Premium API documentation and pricing information.

**HTTP Methods:** `GET`

**Authentication:** None (public documentation)

**Response:** Full API documentation with pricing tiers, endpoints, and usage examples.

---

### GET/POST `/api/premium/api-keys`

**File:** [src/app/api/premium/api-keys/route.ts](../src/app/api/premium/api-keys/route.ts)

**Description:** API key management for programmatic access.

**HTTP Methods:** `GET` (list keys), `POST` (create key)

**Price:** $1.00/month subscription

**Available Permissions:**
- market:read, market:premium
- defi:read, defi:premium
- portfolio:read, portfolio:analytics
- ai:analyze
- alerts:read, alerts:write
- export:csv, export:json
- streams:subscribe

**Authentication:** x402 payment required

---

### POST `/api/premium/ai/analyze`

**File:** [src/app/api/premium/ai/analyze/route.ts](../src/app/api/premium/ai/analyze/route.ts)

**Description:** AI-powered market analysis with technical and sentiment analysis.

**HTTP Methods:** `POST`

**Price:** $0.05/request

**Request Body:**
```json
{
  "coinId": "bitcoin",
  "analysisType": "technical | sentiment | full",
  "timeframe": "1d | 7d | 30d | 90d"
}
```

**Response Includes:**
- Technical indicators (RSI, SMA, volatility, support/resistance)
- Sentiment data (Fear & Greed, social scores)
- AI insights with buy/hold/sell signals

**Authentication:** x402 payment required

---

### GET `/api/premium/ai/compare`

**File:** [src/app/api/premium/ai/compare/route.ts](../src/app/api/premium/ai/compare/route.ts)

**Description:** AI comparison of multiple cryptocurrencies.

**HTTP Methods:** `GET`

**Price:** $0.03/request

**Authentication:** x402 payment required

---

### GET `/api/premium/ai/sentiment`

**File:** [src/app/api/premium/ai/sentiment/route.ts](../src/app/api/premium/ai/sentiment/route.ts)

**Description:** AI-powered sentiment analysis of crypto news.

**HTTP Methods:** `GET`

**Price:** $0.02/request

**Authentication:** x402 payment required

---

### GET `/api/premium/ai/signals`

**File:** [src/app/api/premium/ai/signals/route.ts](../src/app/api/premium/ai/signals/route.ts)

**Description:** AI-generated buy/sell signals based on market data.

**HTTP Methods:** `GET`

**Price:** $0.05/request

**Authentication:** x402 payment required

---

### GET `/api/premium/ai/summary`

**File:** [src/app/api/premium/ai/summary/route.ts](../src/app/api/premium/ai/summary/route.ts)

**Description:** AI-generated market summary for any cryptocurrency.

**HTTP Methods:** `GET`

**Price:** $0.01/request

**Authentication:** x402 payment required

---

### GET `/api/premium/alerts/whales`

**File:** [src/app/api/premium/alerts/whales/route.ts](../src/app/api/premium/alerts/whales/route.ts)

**Description:** Whale alerts and on-chain analytics.

**HTTP Methods:** `GET`

**Price:** $0.01/request

**Features:**
- Large transaction monitoring
- Exchange inflow/outflow signals
- Wallet concentration analysis

**Authentication:** x402 payment required + WHALE_ALERT_API_KEY (optional)

---

### POST `/api/premium/alerts/custom`

**File:** [src/app/api/premium/alerts/custom/route.ts](../src/app/api/premium/alerts/custom/route.ts)

**Description:** Create custom watchlist alerts.

**HTTP Methods:** `POST`

**Price:** $0.10/month subscription

**Alert Types:**
- `price_above` - Price exceeds threshold
- `price_below` - Price falls below threshold
- `percent_change` - Percentage change alert
- `volume_spike` - Volume spike detection

**Request Body:**
```json
{
  "rules": [
    {
      "coinId": "bitcoin",
      "type": "price_above",
      "threshold": 100000,
      "notifyVia": ["webhook"],
      "webhookUrl": "https://..."
    }
  ]
}
```

**Authentication:** x402 payment required

---

### POST `/api/premium/analytics/screener`

**File:** [src/app/api/premium/analytics/screener/route.ts](../src/app/api/premium/analytics/screener/route.ts)

**Description:** Advanced coin screener with unlimited filters.

**HTTP Methods:** `POST`

**Price:** $0.01/query

**Request Body:**
```json
{
  "filters": [
    { "field": "market_cap", "operator": "gt", "value": 1000000000 },
    { "field": "price_change_percentage_24h", "operator": "between", "value": [5, 20] }
  ],
  "sort": { "field": "total_volume", "direction": "desc" },
  "limit": 50,
  "offset": 0
}
```

**Operators:** gt, lt, gte, lte, eq, between, contains

**Authentication:** x402 payment required

---

### GET `/api/premium/defi/protocols`

**File:** [src/app/api/premium/defi/protocols/route.ts](../src/app/api/premium/defi/protocols/route.ts)

**Description:** Comprehensive DeFi protocols data.

**HTTP Methods:** `GET`

**Price:** $0.01/request

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 500 | Number of protocols (max 1000) |
| `category` | string | - | Filter by category |
| `chain` | string | - | Filter by chain |
| `chains` | boolean | false | Include chain breakdown |
| `minTvl` | number | 0 | Minimum TVL filter |

**Authentication:** x402 payment required

---

### GET `/api/premium/export/portfolio`

**File:** [src/app/api/premium/export/portfolio/route.ts](../src/app/api/premium/export/portfolio/route.ts)

**Description:** Export portfolio data as JSON or CSV.

**HTTP Methods:** `GET`

**Price:** $0.10/export

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `format` | string | json | Export format (json, csv) |
| `portfolio_id` | string | Yes | Portfolio ID to export |

**Authentication:** x402 payment required

---

### GET `/api/premium/market/coins`

**File:** [src/app/api/premium/market/coins/route.ts](../src/app/api/premium/market/coins/route.ts)

**Description:** Extended market coins data (up to 500 coins).

**HTTP Methods:** `GET`

**Price:** $0.001/request

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 100 | Number of coins (max 500) |
| `details` | boolean | false | Include extended metadata for top 20 |

**Authentication:** x402 payment required

---

### GET `/api/premium/market/history`

**File:** [src/app/api/premium/market/history/route.ts](../src/app/api/premium/market/history/route.ts)

**Description:** Extended historical price data (up to 5 years).

**HTTP Methods:** `GET`

**Price:** $0.01/request

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `coinId` | string | Yes | Coin ID |
| `range` | string | 1y | Range (1d, 7d, 30d, 90d, 180d, 1y, 2y, 3y, 5y, max) |
| `currency` | string | usd | Currency |
| `ohlc` | boolean | false | Include OHLC data |

**Authentication:** x402 payment required

---

### POST `/api/premium/portfolio/analytics`

**File:** [src/app/api/premium/portfolio/analytics/route.ts](../src/app/api/premium/portfolio/analytics/route.ts)

**Description:** Advanced portfolio analytics.

**HTTP Methods:** `POST`

**Price:** $0.02/request

**Request Body:**
```json
{
  "holdings": [
    { "coinId": "bitcoin", "amount": 0.5, "entryPrice": 45000 },
    { "coinId": "ethereum", "amount": 10, "entryPrice": 2500 }
  ],
  "currency": "usd",
  "period": "30d"
}
```

**Response Includes:**
- Asset metrics with returns and volatility
- Correlation matrix between assets
- Risk metrics (Sharpe ratio, VaR, max drawdown)
- Rebalancing suggestions

**Authentication:** x402 payment required

---

### GET `/api/premium/screener/advanced`

**File:** [src/app/api/premium/screener/advanced/route.ts](../src/app/api/premium/screener/advanced/route.ts)

**Description:** Powerful crypto screening with unlimited filter combinations.

**HTTP Methods:** `GET`

**Price:** $0.02/request

**Authentication:** x402 payment required

---

### GET `/api/premium/smart-money`

**File:** [src/app/api/premium/smart-money/route.ts](../src/app/api/premium/smart-money/route.ts)

**Description:** Track institutional and smart money movements.

**HTTP Methods:** `GET`

**Price:** $0.05/request

**Authentication:** x402 payment required

---

### GET `/api/premium/streams/prices`

**File:** [src/app/api/premium/streams/prices/route.ts](../src/app/api/premium/streams/prices/route.ts)

**Description:** Real-time price streams via Server-Sent Events (SSE).

**HTTP Methods:** `GET`

**Price:** $0.10/session (1 hour access)

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `coins` | string | bitcoin,ethereum | Comma-separated coin IDs (max 20) |
| `interval` | number | 2000 | Update interval in ms (min 1000) |

**SSE Event Types:**
- `connected` - Initial connection
- `prices` - Price updates
- `heartbeat` - Keep-alive (every 30s)
- `session_ended` - Session terminated

**Authentication:** x402 payment required

---

### POST `/api/premium/whales/alerts`

**File:** [src/app/api/premium/whales/alerts/route.ts](../src/app/api/premium/whales/alerts/route.ts)

**Description:** Subscribe to whale transaction alerts via webhook.

**HTTP Methods:** `POST`

**Price:** $0.05/request

**Authentication:** x402 payment required

---

### GET `/api/premium/whales/transactions`

**File:** [src/app/api/premium/whales/transactions/route.ts](../src/app/api/premium/whales/transactions/route.ts)

**Description:** Track large cryptocurrency transactions.

**HTTP Methods:** `GET`

**Price:** $0.05/request

**Authentication:** x402 payment required

---

## Authentication Summary

### No Authentication Required
- All `/api/news/*` routes
- All `/api/market/*` routes (public tier)
- Some `/api/ai/*` routes with fallbacks
- `/api/social/*` public endpoints

### Environment Variables Required
| Variable | Routes Using It |
|----------|----------------|
| `GROQ_API_KEY` | `/api/ai/*` (enhanced functionality) |
| `OPENAI_API_KEY` | `/api/ai/*` (alternative provider) |
| `ANTHROPIC_API_KEY` | `/api/ai/*` (alternative provider) |
| `OPENROUTER_API_KEY` | `/api/ai/*` (alternative provider) |
| `DISCORD_BOT_TOKEN` | `/api/social/discord` |
| `WHALE_ALERT_API_KEY` | `/api/premium/alerts/whales` |

### x402 Payment Required
- All `/api/premium/*` routes

---

## Rate Limiting Summary

| Route Pattern | Rate Limit Strategy |
|---------------|---------------------|
| `/api/news/*` | Time-based revalidation (5 min - 1 hour) |
| `/api/market/*` | Time-based revalidation (30s - 1 hour) |
| `/api/market/orderbook` | Custom rate limiter |
| `/api/ai/*` | AI provider limits |
| `/api/social/*` | Time-based revalidation (60s) |
| `/api/premium/*` | x402 payment gates access |

---

*Last Updated: January 31, 2026*
