---
title: "Using MCP Servers for Live Crypto Data in AI Apps"
description: "Learn how to use the Model Context Protocol (MCP) to bring real-time crypto prices, news, and market data into AI applications like Claude and other LLM-based tools."
date: "2026-03-30"
author: team
category: tutorial
tags: ["mcp", "ai", "claude", "crypto", "developer", "llm"]
image: "/images/blog/mcp-server-crypto.jpg"
imageAlt: "MCP server connecting AI language models to live cryptocurrency data feeds"
---

The Model Context Protocol (MCP) is an open standard that lets AI applications connect to external data sources and tools. Instead of baking static knowledge into a language model's training data, MCP lets the model reach out to live APIs at query time. For cryptocurrency applications, this is transformative: your AI assistant can check real Bitcoin prices, pull today's news, and query DeFi rates — all without you writing custom tool integrations.

## What Is MCP?

MCP defines a client-server protocol where:

- **MCP Servers** expose tools, resources, and prompts to AI clients
- **MCP Clients** are AI applications (like Claude Desktop, custom LLM apps) that call those servers
- **Tools** are callable functions (check price, fetch news, get gas)
- **Resources** are readable data sources (live price feed, news stream)

The protocol is transport-agnostic but most servers communicate via stdin/stdout (for local processes) or HTTP/SSE (for remote servers).

## The free-crypto-news MCP Server

The [free-crypto-news](https://free-crypto-news.com) project ships an MCP server that gives AI models access to:

- Live cryptocurrency news from hundreds of sources
- Current crypto prices
- Market data including volume and market cap
- RSS feed access for any coin

### Installing the MCP Server

```bash
# Using npm
npm install -g @free-crypto-news/mcp-server

# Or using npx (no global install)
npx @free-crypto-news/mcp-server
```

### Configuring in Claude Desktop

Add the server to your Claude Desktop configuration at `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS):

```json
{
  "mcpServers": {
    "crypto-news": {
      "command": "npx",
      "args": ["-y", "@free-crypto-news/mcp-server"],
      "env": {}
    }
  }
}
```

After restarting Claude Desktop, you can ask questions like:

- "What are the latest Bitcoin news headlines?"
- "What is the current ETH price?"
- "Show me DeFi news from the past hour"

## Building a Custom MCP Server

If you need custom crypto tools, building an MCP server from scratch is straightforward:

```bash
npm install @modelcontextprotocol/sdk
```

```javascript
// crypto-mcp-server.js
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
  { name: 'crypto-data-server', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_crypto_price',
      description: 'Get the current price of a cryptocurrency in USD',
      inputSchema: {
        type: 'object',
        properties: {
          symbol: {
            type: 'string',
            description: 'Cryptocurrency symbol, e.g. BTC, ETH, SOL',
          },
        },
        required: ['symbol'],
      },
    },
    {
      name: 'get_crypto_news',
      description: 'Get the latest news articles about a cryptocurrency',
      inputSchema: {
        type: 'object',
        properties: {
          symbol: {
            type: 'string',
            description: 'Cryptocurrency symbol',
          },
          limit: {
            type: 'number',
            description: 'Number of articles to return (max 20)',
            default: 5,
          },
        },
        required: ['symbol'],
      },
    },
    {
      name: 'get_gas_price',
      description: 'Get current Ethereum gas prices in gwei',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  ],
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'get_crypto_price': {
      const symbol = args.symbol.toLowerCase();
      const coinId = SYMBOL_TO_ID[symbol.toUpperCase()] || symbol;

      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`
      );
      const data = await response.json();
      const coinData = data[coinId];

      if (!coinData) {
        return { content: [{ type: 'text', text: `Could not find price for ${args.symbol}` }] };
      }

      return {
        content: [{
          type: 'text',
          text: `${args.symbol.toUpperCase()} price: $${coinData.usd.toLocaleString()} (${coinData.usd_24h_change?.toFixed(2)}% 24h)`,
        }],
      };
    }

    case 'get_crypto_news': {
      const response = await fetch(
        `https://free-crypto-news.com/api/news?symbols=${args.symbol}&limit=${args.limit || 5}`
      );
      const data = await response.json();

      const articles = data.articles?.slice(0, args.limit || 5) ?? [];
      const text = articles.map((a, i) =>
        `${i + 1}. ${a.title}\n   Source: ${a.source}\n   URL: ${a.url}`
      ).join('\n\n');

      return {
        content: [{ type: 'text', text: text || 'No news found' }],
      };
    }

    case 'get_gas_price': {
      const response = await fetch('https://eth.llamarpc.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0', method: 'eth_gasPrice', params: [], id: 1
        }),
      });
      const data = await response.json();
      const gweiPrice = parseInt(data.result, 16) / 1e9;

      return {
        content: [{
          type: 'text',
          text: `Current Ethereum gas price: ${gweiPrice.toFixed(1)} gwei`,
        }],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Symbol to CoinGecko ID mapping
const SYMBOL_TO_ID = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  BNB: 'binancecoin',
  ADA: 'cardano',
  MATIC: 'matic-network',
  DOT: 'polkadot',
  LINK: 'chainlink',
  UNI: 'uniswap',
  AVAX: 'avalanche-2',
};

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);
console.error('Crypto MCP server running');
```

## Adding Resources

MCP Resources let the AI model read structured data:

```javascript
import { ListResourcesRequestSchema, ReadResourceRequestSchema } from '@modelcontextprotocol/sdk/types.js';

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: 'crypto://prices/top10',
      name: 'Top 10 Crypto Prices',
      description: 'Current prices for the top 10 cryptocurrencies by market cap',
      mimeType: 'application/json',
    },
    {
      uri: 'crypto://news/latest',
      name: 'Latest Crypto News',
      description: 'Most recent cryptocurrency news headlines',
      mimeType: 'text/plain',
    },
  ],
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  if (uri === 'crypto://prices/top10') {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10'
    );
    const coins = await response.json();
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(coins.map(c => ({
          symbol: c.symbol.toUpperCase(),
          name: c.name,
          price: c.current_price,
          change_24h: c.price_change_percentage_24h,
        })), null, 2),
      }],
    };
  }

  if (uri === 'crypto://news/latest') {
    const response = await fetch('https://free-crypto-news.com/api/news?limit=10');
    const data = await response.json();
    const text = data.articles.map(a => `- ${a.title} (${a.source})`).join('\n');
    return {
      contents: [{ uri, mimeType: 'text/plain', text }],
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
});
```

## Using MCP with LangChain

If you are using LangChain in Python, you can call MCP tools as LangChain tools:

```python
from langchain_core.tools import tool
import httpx

@tool
def get_crypto_price(symbol: str) -> str:
    """Get the current USD price of a cryptocurrency by symbol (e.g. BTC, ETH)."""
    coin_ids = {"BTC": "bitcoin", "ETH": "ethereum", "SOL": "solana"}
    coin_id = coin_ids.get(symbol.upper(), symbol.lower())

    response = httpx.get(
        "https://api.coingecko.com/api/v3/simple/price",
        params={"ids": coin_id, "vs_currencies": "usd", "include_24hr_change": "true"},
    )
    data = response.json().get(coin_id, {})
    if not data:
        return f"Could not find price for {symbol}"

    return f"{symbol.upper()}: ${data['usd']:,.2f} ({data.get('usd_24h_change', 0):+.2f}% 24h)"

@tool
def get_crypto_news(symbol: str, limit: int = 5) -> str:
    """Get recent cryptocurrency news headlines for a given coin symbol."""
    response = httpx.get(
        "https://free-crypto-news.com/api/news",
        params={"symbols": symbol, "limit": limit},
    )
    articles = response.json().get("articles", [])
    return "\n".join(f"- {a['title']} ({a['source']})" for a in articles)
```

## Real-World MCP Use Cases

- **Trading assistants**: "Should I sell my ETH given today's news and current price?"
- **Portfolio analysis**: "Summarize the performance of my holdings this week"
- **News briefings**: "Give me a 5-sentence crypto market summary for today"
- **Alert investigation**: "Why did Bitcoin drop 3% in the last hour?"
- **Research**: "What are the main risks discussed in Solana news this month?"

## Conclusion

MCP is rapidly becoming the standard for connecting AI models to live data. The free-crypto-news MCP server makes it easy to inject real-time crypto intelligence into Claude and any other MCP-compatible AI. For developers, building custom MCP servers is a low-effort way to dramatically expand what your AI applications can do with live market data.
