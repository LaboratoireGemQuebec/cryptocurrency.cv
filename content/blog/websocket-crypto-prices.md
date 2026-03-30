---
title: "Building Real-Time Crypto Price Feeds with WebSockets"
description: "Learn how to build real-time cryptocurrency price feeds using WebSockets in JavaScript and Python. Covers connection management, reconnection logic, and live data rendering."
date: "2026-03-30"
author: team
category: tutorial
tags: ["websocket", "real-time", "price", "javascript", "python", "developer"]
image: "/images/blog/websocket-crypto-prices.jpg"
imageAlt: "Real-time cryptocurrency price chart updating via WebSocket connection"
---

REST APIs are great for fetching data on demand, but for live cryptocurrency prices you need something better. WebSockets provide a persistent, bidirectional connection between your client and the server, enabling the server to push data to you the moment something changes. This is the technology behind every real-time price ticker you have ever seen.

## How WebSockets Differ from REST

With REST, you poll an endpoint repeatedly: `GET /price/bitcoin` every 5 seconds. This creates unnecessary load, introduces latency, and you still miss changes between polls. WebSockets flip the model: you connect once, and the server sends updates as they happen.

| Feature | REST (polling) | WebSocket |
|---------|---------------|-----------|
| Connection | New per request | Persistent |
| Latency | Poll interval + RTT | Near real-time |
| Server load | High (polling) | Low (push) |
| Complexity | Simple | Moderate |
| Best for | Infrequent data | Streaming data |

## Connecting to a Crypto WebSocket Feed

Most major exchanges and data providers offer WebSocket endpoints. Binance's public feed is a popular choice for learning:

```javascript
// Browser or Node.js (using the native WebSocket API)
const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');

ws.onopen = () => {
  console.log('Connected to Binance WebSocket');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(`BTC Price: $${parseFloat(data.c).toFixed(2)}`);
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = (event) => {
  console.log('Connection closed:', event.code, event.reason);
};
```

## Subscribing to Multiple Symbols

Most WebSocket APIs support multiplexing — subscribing to multiple streams over one connection. With Binance, you can use combined streams:

```javascript
const symbols = ['btcusdt', 'ethusdt', 'solusdt'];
const streams = symbols.map(s => `${s}@ticker`).join('/');
const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

ws.onmessage = (event) => {
  const { stream, data } = JSON.parse(event.data);
  const symbol = stream.split('@')[0].toUpperCase();
  const price = parseFloat(data.c).toFixed(2);
  console.log(`${symbol}: $${price}`);
};
```

## Implementing Reconnection Logic

WebSocket connections drop. Networks fail, servers restart, and idle connections time out. Production-grade implementations need automatic reconnection:

```javascript
class CryptoWebSocket {
  constructor(url, onMessage) {
    this.url = url;
    this.onMessage = onMessage;
    this.reconnectDelay = 1000;
    this.maxDelay = 30000;
    this.connect();
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('Connected');
      this.reconnectDelay = 1000; // reset on successful connection
    };

    this.ws.onmessage = (event) => {
      this.onMessage(JSON.parse(event.data));
    };

    this.ws.onclose = () => {
      console.log(`Disconnected. Reconnecting in ${this.reconnectDelay}ms...`);
      setTimeout(() => this.connect(), this.reconnectDelay);
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, this.maxDelay);
    };

    this.ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      this.ws.close();
    };
  }

  close() {
    this.ws.onclose = null; // prevent reconnection
    this.ws.close();
  }
}

// Usage
const feed = new CryptoWebSocket(
  'wss://stream.binance.com:9443/ws/btcusdt@ticker',
  (data) => console.log(`BTC: $${data.c}`)
);
```

## WebSockets in Python

Python's `websockets` library makes it straightforward to consume crypto price feeds server-side:

```python
import asyncio
import json
import websockets

async def track_bitcoin():
    url = "wss://stream.binance.com:9443/ws/btcusdt@ticker"

    async for websocket in websockets.connect(url):
        try:
            async for message in websocket:
                data = json.loads(message)
                price = float(data["c"])
                change = float(data["P"])
                print(f"BTC: ${price:,.2f} ({change:+.2f}%)")
        except websockets.ConnectionClosed:
            print("Connection closed, reconnecting...")
            await asyncio.sleep(1)
            continue

asyncio.run(track_bitcoin())
```

### Tracking Multiple Assets in Python

```python
import asyncio
import json
import websockets

SYMBOLS = ["btcusdt", "ethusdt", "solusdt", "bnbusdt"]

async def track_prices():
    streams = "/".join(f"{s}@ticker" for s in SYMBOLS)
    url = f"wss://stream.binance.com:9443/stream?streams={streams}"

    prices = {}

    async for websocket in websockets.connect(url):
        try:
            async for message in websocket:
                envelope = json.loads(message)
                data = envelope["data"]
                symbol = envelope["stream"].split("@")[0].upper()
                prices[symbol] = float(data["c"])

                # Print all prices on each update
                display = " | ".join(
                    f"{sym}: ${price:,.2f}"
                    for sym, price in sorted(prices.items())
                )
                print(f"\r{display}", end="", flush=True)
        except websockets.ConnectionClosed:
            await asyncio.sleep(1)
            continue

asyncio.run(track_prices())
```

## Building a React Real-Time Price Component

```jsx
import { useState, useEffect, useRef } from 'react';

function useCryptoPriceFeed(symbol) {
  const [price, setPrice] = useState(null);
  const [change, setChange] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    const url = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}usdt@ticker`;

    function connect() {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setPrice(parseFloat(data.c));
        setChange(parseFloat(data.P));
      };

      ws.onclose = () => {
        setTimeout(connect, 2000);
      };
    }

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
    };
  }, [symbol]);

  return { price, change };
}

function PriceTicker({ symbol }) {
  const { price, change } = useCryptoPriceFeed(symbol);

  if (!price) return <span>Loading...</span>;

  return (
    <div className={`ticker ${change >= 0 ? 'green' : 'red'}`}>
      <strong>{symbol}</strong>
      <span>${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
      <span>{change >= 0 ? '+' : ''}{change.toFixed(2)}%</span>
    </div>
  );
}
```

## Handling WebSocket Heartbeats

Some providers require periodic ping messages to keep the connection alive. Others send pings and expect pongs. Here is how to handle both:

```javascript
// Send a ping every 30 seconds to prevent timeout
function startHeartbeat(ws) {
  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ method: 'ping' }));
    }
  }, 30000);

  ws.onclose = () => clearInterval(interval);
  return interval;
}
```

## Combining WebSocket Prices with News Data

A powerful pattern combines real-time price feeds with live news from the [free-crypto-news API](https://free-crypto-news.com). When a major Bitcoin news item arrives, you can immediately display the current price alongside it:

```javascript
// Poll for latest news while streaming prices
async function fetchLatestNews(symbol) {
  const res = await fetch(
    `https://free-crypto-news.com/api/news?symbols=${symbol}&limit=5`
  );
  return res.json();
}

// Every 60 seconds, refresh the news sidebar
setInterval(() => {
  fetchLatestNews('BTC').then(articles => {
    renderNewsSidebar(articles);
  });
}, 60000);
```

## Production Considerations

### Connection Limits

Most exchanges limit WebSocket connections per IP or API key. Plan your architecture to share connections across users rather than opening one per client.

### Data Normalization

Different providers use different field names. Build a normalization layer early:

```javascript
function normalizeTicker(provider, raw) {
  if (provider === 'binance') {
    return { price: raw.c, volume: raw.v, change: raw.P };
  }
  if (provider === 'coinbase') {
    return { price: raw.price, volume: raw.volume_24h, change: raw.price_percentage_change_24h };
  }
}
```

## Conclusion

WebSockets are the backbone of real-time cryptocurrency applications. With proper reconnection logic, heartbeat handling, and connection pooling, you can build highly responsive price feeds that stay connected even in unreliable network conditions. Pair live prices with news feeds and on-chain data for a complete market intelligence platform.
