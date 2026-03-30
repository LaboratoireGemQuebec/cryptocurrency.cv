---
title: "How ChatGPT Plugins Work with Crypto Data"
description: "Learn how ChatGPT plugins and GPT Actions connect AI assistants to live cryptocurrency data. Build custom GPT actions that fetch prices, news, and market data."
date: "2026-03-30"
author: team
category: tutorial
tags: ["chatgpt", "openai", "gpt-actions", "crypto", "ai", "developer"]
image: "/images/blog/chatgpt-plugin-crypto.md.jpg"
imageAlt: "ChatGPT interface showing cryptocurrency data plugin fetching live Bitcoin prices"
---

ChatGPT plugins (now rebranded as GPT Actions) allow ChatGPT to make HTTP requests to external APIs during conversations. This means your custom GPT can fetch live cryptocurrency prices, pull the latest news, and query on-chain data in real time — bridging the gap between the model's static training knowledge and today's market conditions.

## ChatGPT Plugins vs GPT Actions

The original plugin system has evolved into GPT Actions, which is how it works in 2026:

- **Original Plugins**: Required approval from OpenAI, deprecated
- **GPT Actions**: Available to all ChatGPT Plus and Team users, no approval needed
- **Custom GPTs**: You can build a custom GPT with your own name, instructions, and actions

GPT Actions use OpenAPI 3.0 specification to describe your API to the AI.

## Building a Crypto Data API for GPT Actions

Your API needs to be publicly accessible and described with an OpenAPI schema.

### The API Server

```javascript
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Price endpoint
app.get('/api/price', async (req, res) => {
  const { symbol } = req.query;
  if (!symbol) return res.status(400).json({ error: 'symbol required' });

  const coinId = SYMBOL_TO_ID[symbol.toUpperCase()];
  if (!coinId) return res.status(404).json({ error: `Unknown symbol: ${symbol}` });

  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`
  );
  const data = await response.json();
  const coin = data[coinId];

  res.json({
    symbol: symbol.toUpperCase(),
    priceUSD: coin.usd,
    change24h: coin.usd_24h_change,
    marketCapUSD: coin.usd_market_cap,
    timestamp: new Date().toISOString(),
  });
});

// News endpoint
app.get('/api/news', async (req, res) => {
  const { symbol, limit = 5 } = req.query;

  const params = new URLSearchParams({ limit: String(Math.min(parseInt(limit), 10)) });
  if (symbol) params.set('symbols', symbol);

  const response = await fetch(`https://free-crypto-news.com/api/news?${params}`);
  const data = await response.json();

  res.json({
    articles: (data.articles || []).map(a => ({
      title: a.title,
      source: a.source,
      url: a.url,
      publishedAt: a.publishedAt,
      summary: a.description?.slice(0, 200),
    })),
    count: data.articles?.length || 0,
  });
});

// Multi-coin prices
app.get('/api/prices', async (req, res) => {
  const { symbols } = req.query;
  if (!symbols) return res.status(400).json({ error: 'symbols required (comma-separated)' });

  const symbolList = symbols.split(',').map(s => s.trim().toUpperCase());
  const ids = symbolList.map(s => SYMBOL_TO_ID[s]).filter(Boolean);

  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=usd&include_24hr_change=true`
  );
  const data = await response.json();

  const result = symbolList.map(sym => {
    const id = SYMBOL_TO_ID[sym];
    const coin = data[id] || {};
    return { symbol: sym, priceUSD: coin.usd || null, change24h: coin.usd_24h_change || null };
  });

  res.json({ prices: result });
});

const SYMBOL_TO_ID = {
  BTC: 'bitcoin', ETH: 'ethereum', SOL: 'solana', BNB: 'binancecoin',
  ADA: 'cardano', DOT: 'polkadot', LINK: 'chainlink', AVAX: 'avalanche-2',
};

app.listen(3000);
```

### OpenAPI Schema

GPT Actions require an OpenAPI 3.0 specification describing your API:

```yaml
openapi: "3.0.0"
info:
  title: "Crypto Market Data API"
  version: "1.0.0"
  description: "Live cryptocurrency prices and news"

servers:
  - url: "https://your-crypto-api.com"

paths:
  /api/price:
    get:
      operationId: getCryptoPrice
      summary: Get current price for a single cryptocurrency
      parameters:
        - name: symbol
          in: query
          required: true
          schema:
            type: string
          description: "Cryptocurrency symbol (BTC, ETH, SOL, etc.)"
      responses:
        "200":
          description: Current price data
          content:
            application/json:
              schema:
                type: object
                properties:
                  symbol:
                    type: string
                  priceUSD:
                    type: number
                  change24h:
                    type: number
                  marketCapUSD:
                    type: number
                  timestamp:
                    type: string

  /api/prices:
    get:
      operationId: getMultiplePrices
      summary: Get current prices for multiple cryptocurrencies
      parameters:
        - name: symbols
          in: query
          required: true
          schema:
            type: string
          description: "Comma-separated list of symbols, e.g. BTC,ETH,SOL"
      responses:
        "200":
          description: Prices for requested symbols
          content:
            application/json:
              schema:
                type: object
                properties:
                  prices:
                    type: array
                    items:
                      type: object
                      properties:
                        symbol:
                          type: string
                        priceUSD:
                          type: number
                        change24h:
                          type: number

  /api/news:
    get:
      operationId: getCryptoNews
      summary: Get latest cryptocurrency news articles
      parameters:
        - name: symbol
          in: query
          required: false
          schema:
            type: string
          description: "Filter by coin symbol (BTC, ETH, etc.)"
        - name: limit
          in: query
          required: false
          schema:
            type: integer
            minimum: 1
            maximum: 10
            default: 5
          description: "Number of articles to return"
      responses:
        "200":
          description: News articles
          content:
            application/json:
              schema:
                type: object
                properties:
                  articles:
                    type: array
                    items:
                      type: object
                      properties:
                        title:
                          type: string
                        source:
                          type: string
                        url:
                          type: string
                        publishedAt:
                          type: string
                        summary:
                          type: string
                  count:
                    type: integer
```

## Creating the Custom GPT

1. Go to ChatGPT and click "Explore GPTs" then "Create"
2. Name it "Crypto Market Assistant" (or your preferred name)
3. Write system instructions:

```
You are a cryptocurrency market assistant with access to live data tools.

When users ask about prices, always fetch current data using the available tools.
When users ask about news, fetch the latest articles.
Never claim to know current prices from memory — always use the tools.

Be concise and data-driven. Format prices clearly. When sharing news, include
the source and publish date. Offer to analyze or compare data when relevant.

You can:
- Fetch the current price of any major cryptocurrency
- Get the latest news for specific coins
- Compare multiple coin prices side by side
```

4. Under "Actions", click "Add an action"
5. Paste your OpenAPI schema
6. Test with sample queries

## Testing Your GPT Action

Sample queries to test:
- "What's the Bitcoin price right now?"
- "Compare ETH and SOL prices"
- "Show me the latest Ethereum news"
- "Is there any negative news about Binance?"
- "What's the DeFi news this week?"

## Adding Authentication

For private APIs, GPT Actions support API key authentication:

```javascript
// In your Express server, require an API key
app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.GPT_ACTION_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});
```

In the OpenAPI schema, add:

```yaml
components:
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: X-API-Key

security:
  - ApiKeyAuth: []
```

When configuring the action in ChatGPT, add the API key under Authentication.

## Privacy and Data Considerations

ChatGPT's privacy policy applies to all data sent to actions. Consider:

- Do not send personally identifiable information through GPT Actions
- Wallet addresses are potentially sensitive — consider if you want this flowing through OpenAI
- Ensure your API has appropriate rate limiting to prevent abuse

## Deploying to Production

Use Vercel, Railway, or any Node.js host:

```bash
# Deploy to Vercel
npm install -g vercel
vercel

# Your API will be available at https://your-project.vercel.app
# Update the OpenAPI server URL accordingly
```

## Conclusion

GPT Actions transform ChatGPT from a static AI assistant into a live market intelligence tool. By describing your crypto data API with an OpenAPI schema, any ChatGPT user can query your data through natural conversation. The free-crypto-news API makes it easy to provide live news data as the content layer for your GPT Action.
