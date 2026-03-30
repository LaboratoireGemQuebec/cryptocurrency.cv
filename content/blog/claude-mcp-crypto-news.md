---
title: "Querying Live Crypto News with Claude and MCP"
description: "Learn how to use the Model Context Protocol with Claude to query real-time cryptocurrency news, prices, and market data directly from your AI conversations."
date: "2026-03-30"
author: team
category: tutorial
tags: ["claude", "mcp", "crypto-news", "ai", "developer", "anthropic"]
image: "/images/blog/claude-mcp-crypto-news.jpg"
imageAlt: "Claude AI assistant interface showing live cryptocurrency news query via MCP server"
---

Claude is Anthropic's AI assistant, and like all modern language models, its training data has a knowledge cutoff. When you ask Claude "What is the latest Bitcoin news?" it can only answer from its training data, not from live sources. The Model Context Protocol (MCP) fixes this by connecting Claude to live data servers at query time.

The [free-crypto-news MCP server](https://free-crypto-news.com) makes it trivially easy to give Claude access to real-time cryptocurrency news, prices, and market data. This guide shows you how to set it up and use it effectively.

## What Happens Without MCP

Without live data tools, Claude's answers about crypto markets are static:

- Prices from training data (potentially months or years stale)
- News stories that have long since faded
- Market conditions that no longer apply
- Missing information about recent protocol updates, hacks, and regulatory changes

With MCP, Claude can fetch current data at the moment you ask.

## Installing the free-crypto-news MCP Server

The MCP server is distributed as an npm package:

```bash
# Test it immediately with npx
npx -y @free-crypto-news/mcp-server

# Or install globally
npm install -g @free-crypto-news/mcp-server
```

## Configuring Claude Desktop

Claude Desktop supports MCP servers through its configuration file.

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Add the crypto news server:

```json
{
  "mcpServers": {
    "free-crypto-news": {
      "command": "npx",
      "args": ["-y", "@free-crypto-news/mcp-server"],
      "env": {}
    }
  }
}
```

After saving this file, restart Claude Desktop. You will see a tools icon indicating MCP is active.

## What You Can Ask Claude Now

With the MCP server connected, Claude has access to:

- **Latest news** for any cryptocurrency or DeFi protocol
- **Current prices** for major coins
- **Market summaries** across the crypto ecosystem
- **Category news** for DeFi, NFTs, regulation, and more

Example prompts that now work with live data:

```
"What are the top 5 Bitcoin news stories right now?"
"Has there been any negative news about Ethereum in the last 24 hours?"
"Summarize the DeFi news from today"
"What is the current sentiment around Solana?"
"Give me a daily crypto market briefing"
```

## Building a Custom MCP Server for Claude

If you want to extend what Claude can do, building a custom MCP server is straightforward. Here is a complete server with crypto data tools:

```javascript
#!/usr/bin/env node
// crypto-claude-server.js

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
  { name: 'crypto-claude-server', version: '1.0.0' },
  { capabilities: { tools: {}, prompts: {} } }
);

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_latest_crypto_news',
      description: 'Fetch the most recent cryptocurrency news articles. Can filter by coin symbol.',
      inputSchema: {
        type: 'object',
        properties: {
          symbol: {
            type: 'string',
            description: 'Optional: coin symbol to filter news (BTC, ETH, SOL, etc.)',
          },
          limit: {
            type: 'number',
            description: 'Number of articles (1-20, default 10)',
          },
          category: {
            type: 'string',
            enum: ['defi', 'nft', 'regulation', 'markets', 'technology'],
            description: 'Optional: filter by news category',
          },
        },
      },
    },
    {
      name: 'get_crypto_prices',
      description: 'Get current prices for one or more cryptocurrencies',
      inputSchema: {
        type: 'object',
        properties: {
          symbols: {
            type: 'array',
            items: { type: 'string' },
            description: 'Cryptocurrency symbols, e.g. ["BTC", "ETH", "SOL"]',
          },
        },
        required: ['symbols'],
      },
    },
    {
      name: 'search_crypto_news',
      description: 'Search for cryptocurrency news articles by keyword or topic',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query, e.g. "ethereum merge" or "bitcoin halving"',
          },
          limit: { type: 'number', description: 'Number of results' },
        },
        required: ['query'],
      },
    },
  ],
}));

// Register prompts (templates for Claude)
server.setRequestHandler(ListPromptsRequestSchema, async () => ({
  prompts: [
    {
      name: 'daily_briefing',
      description: 'Generate a daily crypto market briefing',
      arguments: [],
    },
    {
      name: 'coin_analysis',
      description: 'Analyze a specific cryptocurrency with current news and price',
      arguments: [
        { name: 'symbol', description: 'Cryptocurrency symbol', required: true },
      ],
    },
  ],
}));

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  if (request.params.name === 'daily_briefing') {
    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: 'Please fetch the latest cryptocurrency news and current prices for BTC, ETH, and SOL, then give me a concise daily briefing covering: 1) Major market movements 2) Top news stories 3) Key things to watch today.',
          },
        },
      ],
    };
  }

  if (request.params.name === 'coin_analysis') {
    const symbol = request.params.arguments?.symbol || 'BTC';
    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Please fetch the current price and latest news for ${symbol}, then provide a brief market analysis covering recent price action, major news, and overall sentiment.`,
          },
        },
      ],
    };
  }

  throw new Error(`Unknown prompt: ${request.params.name}`);
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'get_latest_crypto_news') {
    const params = new URLSearchParams({ limit: String(args?.limit ?? 10) });
    if (args?.symbol) params.set('symbols', args.symbol);
    if (args?.category) params.set('category', args.category);

    const response = await fetch(`https://free-crypto-news.com/api/news?${params}`);
    const data = await response.json();

    const formatted = data.articles
      .map((a, i) => `${i + 1}. **${a.title}**\n   ${a.source} | ${a.publishedAt}\n   ${a.url}`)
      .join('\n\n');

    return { content: [{ type: 'text', text: formatted || 'No news found' }] };
  }

  if (name === 'get_crypto_prices') {
    const symbolToId = {
      BTC: 'bitcoin', ETH: 'ethereum', SOL: 'solana', BNB: 'binancecoin',
      ADA: 'cardano', DOT: 'polkadot', AVAX: 'avalanche-2',
    };

    const symbols = args.symbols as string[];
    const ids = symbols.map(s => symbolToId[s.toUpperCase()] || s.toLowerCase());

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=usd&include_24hr_change=true`
    );
    const data = await response.json();

    const lines = symbols.map(sym => {
      const id = symbolToId[sym.toUpperCase()] || sym.toLowerCase();
      const coin = data[id] || {};
      return `${sym.toUpperCase()}: $${(coin.usd || 0).toLocaleString()} (${(coin.usd_24h_change || 0).toFixed(2)}% 24h)`;
    });

    return { content: [{ type: 'text', text: lines.join('\n') }] };
  }

  if (name === 'search_crypto_news') {
    const response = await fetch(
      `https://free-crypto-news.com/api/news/search?q=${encodeURIComponent(args.query)}&limit=${args.limit || 10}`
    );
    const data = await response.json();

    const formatted = data.articles
      .map((a, i) => `${i + 1}. ${a.title} (${a.source})`)
      .join('\n');

    return { content: [{ type: 'text', text: formatted || 'No results found' }] };
  }

  throw new Error(`Unknown tool: ${name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

## Using Claude's API with MCP in Your App

For programmatic access, use the Anthropic SDK with tool definitions:

```python
import anthropic
import httpx

client = anthropic.Anthropic()

tools = [
    {
        "name": "get_crypto_news",
        "description": "Get latest cryptocurrency news articles",
        "input_schema": {
            "type": "object",
            "properties": {
                "symbol": {"type": "string", "description": "Coin symbol like BTC or ETH"},
                "limit": {"type": "integer", "default": 5},
            },
        },
    },
    {
        "name": "get_crypto_price",
        "description": "Get current cryptocurrency price",
        "input_schema": {
            "type": "object",
            "properties": {
                "symbol": {"type": "string", "description": "Coin symbol"},
            },
            "required": ["symbol"],
        },
    },
]

def process_tool_call(tool_name: str, tool_input: dict) -> str:
    if tool_name == "get_crypto_news":
        response = httpx.get(
            "https://free-crypto-news.com/api/news",
            params={"symbols": tool_input.get("symbol", ""), "limit": tool_input.get("limit", 5)},
        )
        articles = response.json().get("articles", [])
        return "\n".join(f"- {a['title']} ({a['source']})" for a in articles)

    if tool_name == "get_crypto_price":
        # ... price fetch
        pass

    return "Tool not found"

def ask_claude_with_crypto_data(question: str) -> str:
    messages = [{"role": "user", "content": question}]

    while True:
        response = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=1024,
            tools=tools,
            messages=messages,
        )

        if response.stop_reason == "tool_use":
            tool_calls = [b for b in response.content if b.type == "tool_use"]
            messages.append({"role": "assistant", "content": response.content})

            tool_results = [
                {
                    "type": "tool_result",
                    "tool_use_id": tc.id,
                    "content": process_tool_call(tc.name, tc.input),
                }
                for tc in tool_calls
            ]
            messages.append({"role": "user", "content": tool_results})
        else:
            text_block = next((b for b in response.content if b.type == "text"), None)
            return text_block.text if text_block else ""
```

## Conclusion

MCP transforms Claude from a static knowledge base into a dynamic research assistant that can query live crypto data on demand. The free-crypto-news MCP server makes this setup effortless — install it, configure Claude Desktop, and you immediately gain access to real-time news, prices, and market context in every conversation. For developers building custom applications, the MCP protocol makes it straightforward to connect any data source to any MCP-compatible AI client.
