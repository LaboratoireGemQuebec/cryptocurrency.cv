---
title: "Building a Crypto Chatbot with LLMs and Live Data"
description: "Learn how to build a cryptocurrency chatbot using large language models (LLMs) and live market data. Combines OpenAI function calling with real-time price and news APIs."
date: "2026-03-30"
author: team
category: tutorial
tags: ["llm", "chatbot", "openai", "ai", "developer", "crypto"]
image: "/images/blog/crypto-chatbot-llm.jpg"
imageAlt: "Crypto chatbot interface showing conversation about Bitcoin price and market analysis"
---

Language models are remarkably good at reasoning about financial data, explaining market concepts, and helping users understand cryptocurrency. The key limitation is that their training data has a cutoff — they don't know today's prices. The solution: give the LLM tools to fetch live data, and let it decide when to use them. This guide shows you how to build a crypto chatbot that combines the reasoning power of GPT-4 or Claude with real-time market data.

## Architecture Overview

The chatbot works in three phases:

1. **User sends message**: "What's the current Bitcoin price and what's the news saying?"
2. **LLM decides to call tools**: It invokes `get_price("BTC")` and `get_news("BTC")`
3. **Tool results fed back to LLM**: It synthesizes the live data into a natural language response

This is the "tool use" or "function calling" pattern, supported by OpenAI's GPT-4, Anthropic's Claude, and Google's Gemini.

## Setup

```bash
npm install openai @free-crypto-news/sdk
```

## Defining Tools for the LLM

```javascript
const tools = [
  {
    type: 'function',
    function: {
      name: 'get_crypto_price',
      description: 'Get the current USD price, 24h change, and market cap for a cryptocurrency',
      parameters: {
        type: 'object',
        properties: {
          symbol: {
            type: 'string',
            description: 'The cryptocurrency symbol, e.g. BTC, ETH, SOL',
          },
        },
        required: ['symbol'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_crypto_news',
      description: 'Get the latest news articles about a cryptocurrency from major crypto media',
      parameters: {
        type: 'object',
        properties: {
          symbol: {
            type: 'string',
            description: 'The cryptocurrency symbol',
          },
          limit: {
            type: 'number',
            description: 'Number of articles to retrieve (1-10)',
            default: 5,
          },
        },
        required: ['symbol'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_gas_price',
      description: 'Get current Ethereum gas prices for slow, standard, and fast transactions',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'compare_prices',
      description: 'Compare prices and performance of multiple cryptocurrencies',
      parameters: {
        type: 'object',
        properties: {
          symbols: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of cryptocurrency symbols to compare',
          },
        },
        required: ['symbols'],
      },
    },
  },
];
```

## Implementing the Tool Functions

```javascript
import fetch from 'node-fetch';

const SYMBOL_TO_ID = {
  BTC: 'bitcoin', ETH: 'ethereum', SOL: 'solana', BNB: 'binancecoin',
  ADA: 'cardano', DOT: 'polkadot', LINK: 'chainlink', AVAX: 'avalanche-2',
  MATIC: 'matic-network', UNI: 'uniswap', ATOM: 'cosmos', LTC: 'litecoin',
};

async function getCryptoPrice(symbol) {
  const coinId = SYMBOL_TO_ID[symbol.toUpperCase()];
  if (!coinId) return { error: `Unknown symbol: ${symbol}` };

  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`
  );
  const data = await response.json();
  const coin = data[coinId];

  return {
    symbol: symbol.toUpperCase(),
    price: coin.usd,
    change24h: coin.usd_24h_change?.toFixed(2),
    marketCap: coin.usd_market_cap?.toLocaleString(),
    timestamp: new Date().toISOString(),
  };
}

async function getCryptoNews(symbol, limit = 5) {
  const response = await fetch(
    `https://free-crypto-news.com/api/news?symbols=${symbol}&limit=${limit}`
  );
  const data = await response.json();

  return (data.articles || []).map(a => ({
    title: a.title,
    source: a.source,
    url: a.url,
    publishedAt: a.publishedAt,
    summary: a.description?.slice(0, 200),
  }));
}

async function getGasPrice() {
  const response = await fetch('https://mempool.space/api/v1/fees/recommended');
  const eth = await (await fetch('https://api.etherscan.io/api?module=gastracker&action=gasoracle')).json();

  return {
    ethereum: {
      slow: eth.result?.SafeGasPrice,
      standard: eth.result?.ProposeGasPrice,
      fast: eth.result?.FastGasPrice,
      unit: 'gwei',
    },
    bitcoin: await response.json(),
  };
}

async function comparePrices(symbols) {
  const ids = symbols.map(s => SYMBOL_TO_ID[s.toUpperCase()]).filter(Boolean);
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=usd&include_24hr_change=true`
  );
  const data = await response.json();

  return symbols.map(sym => {
    const id = SYMBOL_TO_ID[sym.toUpperCase()];
    const coin = data[id] || {};
    return {
      symbol: sym.toUpperCase(),
      price: coin.usd || null,
      change24h: coin.usd_24h_change?.toFixed(2) || null,
    };
  });
}
```

## The Chatbot Core

```javascript
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are a helpful cryptocurrency assistant with access to live market data tools.
You can:
- Look up current prices for any cryptocurrency
- Fetch the latest news articles about specific coins
- Check Ethereum and Bitcoin gas/fee prices
- Compare performance of multiple cryptocurrencies

When asked about prices, news, or market conditions, always use the available tools to get fresh data rather than relying on your training data. After getting data, provide a clear, helpful analysis.

Keep responses concise but informative. Use plain language — avoid excessive technical jargon unless the user is clearly technical.`;

async function executeToolCall(toolName, args) {
  switch (toolName) {
    case 'get_crypto_price':
      return getCryptoPrice(args.symbol);
    case 'get_crypto_news':
      return getCryptoNews(args.symbol, args.limit);
    case 'get_gas_price':
      return getGasPrice();
    case 'compare_prices':
      return comparePrices(args.symbols);
    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}

async function chat(userMessage, conversationHistory = []) {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...conversationHistory,
    { role: 'user', content: userMessage },
  ];

  // First call: let LLM decide if it needs tools
  let response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    tools,
    tool_choice: 'auto',
    temperature: 0.7,
  });

  let message = response.choices[0].message;

  // Handle tool calls in a loop (LLM may call multiple tools)
  while (message.tool_calls && message.tool_calls.length > 0) {
    messages.push(message);

    // Execute all tool calls in parallel
    const toolResults = await Promise.all(
      message.tool_calls.map(async (toolCall) => {
        const args = JSON.parse(toolCall.function.arguments);
        const result = await executeToolCall(toolCall.function.name, args);

        return {
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        };
      })
    );

    messages.push(...toolResults);

    // Call again with tool results
    response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      tools,
      tool_choice: 'auto',
      temperature: 0.7,
    });

    message = response.choices[0].message;
  }

  return {
    response: message.content,
    updatedHistory: [...messages.slice(1), message], // Without system prompt
  };
}
```

## Building the Express API

```javascript
import express from 'express';

const app = express();
app.use(express.json());

// Store conversations (in production, use a database)
const conversations = new Map();

app.post('/api/chat', async (req, res) => {
  const { message, sessionId = 'default' } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'message is required' });
  }

  const history = conversations.get(sessionId) || [];

  try {
    const { response, updatedHistory } = await chat(message, history);

    // Keep last 20 messages to manage context length
    conversations.set(sessionId, updatedHistory.slice(-20));

    res.json({ response, sessionId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
```

## React Chatbot UI

```tsx
import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function CryptoChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, sessionId }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
              msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-gray-400 text-sm">Fetching live data...</div>}
      </div>

      <div className="flex gap-2 mt-4">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about any crypto..."
          className="flex-1 border rounded-xl px-4 py-2"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
```

## Conclusion

Building a crypto chatbot with LLM tool use is surprisingly straightforward. The LLM handles natural language understanding, deciding which tools to call and how to synthesize the results. Real-time data from the [free-crypto-news API](https://free-crypto-news.com) and price APIs fills in the knowledge gap. The result is a conversational assistant that is always current and genuinely useful.
