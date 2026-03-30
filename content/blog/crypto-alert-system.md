---
title: "How to Build a Crypto Price Alert System"
description: "Learn how to build a cryptocurrency price alert system that sends notifications via email, SMS, Discord, and Telegram when price thresholds are crossed."
date: "2026-03-30"
author: team
category: tutorial
tags: ["alerts", "notifications", "developer", "javascript", "python", "automation"]
image: "/images/blog/crypto-alert-system.jpg"
imageAlt: "Crypto price alert system diagram showing threshold monitoring and multi-channel notifications"
---

Price alerts are one of the most practical tools in a crypto investor's or developer's toolkit. Whether you want to know when Bitcoin breaks $100K or when your favorite altcoin drops 10%, a price alert system gives you leverage over information without constant screen-watching. Building your own gives you full control over the data source, delivery channels, and alert logic.

## System Architecture

A crypto alert system has three components:

1. **Alert store**: Saved thresholds (symbol, target price, direction, user contact)
2. **Price monitor**: Polls price data on a schedule
3. **Notification dispatcher**: Sends alerts via email, SMS, Discord, Telegram

## Setting Up the Alert Store

For a simple system, use a JSON file or SQLite. For production, use PostgreSQL or Redis:

```javascript
// Simple JSON-based alert store
import { readFileSync, writeFileSync, existsSync } from 'fs';

class AlertStore {
  #filePath;
  #alerts;

  constructor(filePath = './alerts.json') {
    this.#filePath = filePath;
    this.#alerts = existsSync(filePath)
      ? JSON.parse(readFileSync(filePath, 'utf-8'))
      : [];
  }

  add({ symbol, targetPrice, direction, channel, contact, label }) {
    const alert = {
      id: Date.now().toString(),
      symbol: symbol.toUpperCase(),
      targetPrice: parseFloat(targetPrice),
      direction, // 'above' or 'below'
      channel,   // 'discord', 'email', 'telegram'
      contact,   // webhook URL, email, or chat ID
      label: label || `${symbol} ${direction} $${targetPrice}`,
      createdAt: new Date().toISOString(),
      triggered: false,
    };

    this.#alerts.push(alert);
    this.#save();
    return alert;
  }

  getActive() {
    return this.#alerts.filter(a => !a.triggered);
  }

  markTriggered(id) {
    const alert = this.#alerts.find(a => a.id === id);
    if (alert) {
      alert.triggered = true;
      alert.triggeredAt = new Date().toISOString();
      this.#save();
    }
  }

  #save() {
    writeFileSync(this.#filePath, JSON.stringify(this.#alerts, null, 2));
  }
}
```

## Fetching Prices for Multiple Symbols

```javascript
async function fetchPrices(symbols) {
  // CoinGecko symbol to ID mapping
  const symbolToId = {
    BTC: 'bitcoin', ETH: 'ethereum', SOL: 'solana',
    BNB: 'binancecoin', ADA: 'cardano', DOT: 'polkadot',
    LINK: 'chainlink', AVAX: 'avalanche-2', MATIC: 'matic-network',
  };

  const uniqueIds = [...new Set(symbols.map(s => symbolToId[s.toUpperCase()]).filter(Boolean))];
  if (!uniqueIds.length) return {};

  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${uniqueIds.join(',')}&vs_currencies=usd`
  );
  const data = await response.json();

  // Map back from ID to symbol
  const idToSymbol = Object.entries(symbolToId).reduce((acc, [sym, id]) => {
    acc[id] = sym;
    return acc;
  }, {});

  return Object.entries(data).reduce((acc, [id, prices]) => {
    const sym = idToSymbol[id];
    if (sym) acc[sym] = prices.usd;
    return acc;
  }, {});
}
```

## Notification Dispatchers

### Discord Webhook

```javascript
async function sendDiscordAlert(webhookUrl, alert, currentPrice) {
  const isAbove = alert.direction === 'above';
  const color = isAbove ? 0x00FF00 : 0xFF0000; // green for above, red for below

  const embed = {
    title: `Price Alert Triggered: ${alert.symbol}`,
    description: alert.label,
    color,
    fields: [
      { name: 'Trigger Price', value: `$${alert.targetPrice.toLocaleString()}`, inline: true },
      { name: 'Current Price', value: `$${currentPrice.toLocaleString()}`, inline: true },
      { name: 'Direction', value: isAbove ? 'Above threshold' : 'Below threshold', inline: true },
    ],
    timestamp: new Date().toISOString(),
    footer: { text: 'Crypto Alert System' },
  };

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ embeds: [embed] }),
  });
}
```

### Telegram Bot

```javascript
async function sendTelegramAlert(chatId, alert, currentPrice, botToken) {
  const direction = alert.direction === 'above' ? 'rose above' : 'fell below';
  const message =
    `Price Alert: ${alert.symbol} has ${direction} $${alert.targetPrice.toLocaleString()}\n` +
    `Current price: $${currentPrice.toLocaleString()}\n` +
    `Alert: ${alert.label}`;

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
    }),
  });
}
```

### Email via Resend

```bash
npm install resend
```

```javascript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmailAlert(toEmail, alert, currentPrice) {
  await resend.emails.send({
    from: 'alerts@yourdomain.com',
    to: toEmail,
    subject: `Alert: ${alert.symbol} ${alert.direction} $${alert.targetPrice}`,
    html: `
      <h2>Crypto Price Alert</h2>
      <p><strong>${alert.symbol}</strong> has ${
        alert.direction === 'above' ? 'risen above' : 'fallen below'
      } your target of <strong>$${alert.targetPrice.toLocaleString()}</strong>.</p>
      <p>Current price: <strong>$${currentPrice.toLocaleString()}</strong></p>
      <p>Alert: ${alert.label}</p>
      <hr>
      <small>You set this alert on ${new Date(alert.createdAt).toLocaleDateString()}</small>
    `,
  });
}
```

## The Alert Monitor Loop

```javascript
async function dispatchAlert(alert, currentPrice) {
  const handlers = {
    discord: () => sendDiscordAlert(alert.contact, alert, currentPrice),
    telegram: () => sendTelegramAlert(alert.contact, alert, currentPrice, process.env.TELEGRAM_BOT_TOKEN),
    email: () => sendEmailAlert(alert.contact, alert, currentPrice),
  };

  const handler = handlers[alert.channel];
  if (!handler) {
    console.warn(`Unknown channel: ${alert.channel}`);
    return;
  }

  await handler();
  console.log(`Alert sent: ${alert.label} @ $${currentPrice}`);
}

async function checkAlerts(store) {
  const activeAlerts = store.getActive();
  if (!activeAlerts.length) return;

  const symbols = [...new Set(activeAlerts.map(a => a.symbol))];
  const prices = await fetchPrices(symbols);

  for (const alert of activeAlerts) {
    const currentPrice = prices[alert.symbol];
    if (!currentPrice) continue;

    const triggered =
      (alert.direction === 'above' && currentPrice >= alert.targetPrice) ||
      (alert.direction === 'below' && currentPrice <= alert.targetPrice);

    if (triggered) {
      try {
        await dispatchAlert(alert, currentPrice);
        store.markTriggered(alert.id);
      } catch (error) {
        console.error(`Failed to send alert ${alert.id}:`, error.message);
      }
    }
  }
}

// Run the monitor
const store = new AlertStore('./alerts.json');
const POLL_INTERVAL = 60000; // 1 minute

console.log('Alert monitor started');
await checkAlerts(store); // Immediate first check

setInterval(() => checkAlerts(store), POLL_INTERVAL);
```

## Adding Percentage-Based Alerts

Price alerts based on percentage change from current price are often more useful than absolute targets:

```javascript
class PercentageAlert {
  constructor({ symbol, percentChange, basePrice, channel, contact }) {
    this.symbol = symbol;
    this.targetPrice = basePrice * (1 + percentChange / 100);
    this.direction = percentChange > 0 ? 'above' : 'below';
    this.percentChange = percentChange;
    this.basePrice = basePrice;
    this.channel = channel;
    this.contact = contact;
  }
}

// Alert if ETH drops 10% from current price of $3000
const ethAlert = new PercentageAlert({
  symbol: 'ETH',
  percentChange: -10,
  basePrice: 3000,  // current price
  channel: 'discord',
  contact: process.env.DISCORD_WEBHOOK,
});
// This creates an alert: ETH below $2700
```

## REST API for Alert Management

```javascript
import express from 'express';

const app = express();
app.use(express.json());

const store = new AlertStore('./alerts.json');

// Create alert
app.post('/alerts', (req, res) => {
  const alert = store.add(req.body);
  res.status(201).json(alert);
});

// List active alerts
app.get('/alerts', (req, res) => {
  res.json(store.getActive());
});

// Delete alert
app.delete('/alerts/:id', (req, res) => {
  store.markTriggered(req.params.id);
  res.json({ success: true });
});

// Manual trigger check
app.post('/alerts/check', async (req, res) => {
  await checkAlerts(store);
  res.json({ checked: true });
});

app.listen(3000);
```

## Python Version

```python
import asyncio
import httpx
import json
from pathlib import Path
from dataclasses import dataclass, asdict

@dataclass
class Alert:
    id: str
    symbol: str
    target_price: float
    direction: str  # 'above' or 'below'
    channel: str
    contact: str
    triggered: bool = False

async def check_alert(alert: Alert, price: float) -> bool:
    if alert.direction == 'above' and price >= alert.target_price:
        return True
    if alert.direction == 'below' and price <= alert.target_price:
        return True
    return False

async def monitor_alerts(alerts: list[Alert], interval: int = 60):
    """Monitor price alerts indefinitely."""
    async with httpx.AsyncClient() as client:
        while True:
            symbols = list({a.symbol for a in alerts if not a.triggered})
            if not symbols:
                print("All alerts triggered. Exiting.")
                break

            # Fetch prices
            ids = ",".join(symbols).lower()  # simplification
            response = await client.get(
                "https://api.coingecko.com/api/v3/simple/price",
                params={"ids": ids, "vs_currencies": "usd"},
            )
            prices = response.json()

            for alert in alerts:
                if alert.triggered:
                    continue
                price = prices.get(alert.symbol.lower(), {}).get("usd")
                if price and await check_alert(alert, price):
                    print(f"ALERT: {alert.symbol} is ${price} ({alert.direction} ${alert.target_price})")
                    alert.triggered = True

            await asyncio.sleep(interval)
```

## Conclusion

A crypto alert system is a practical project that combines price data fetching, threshold logic, and multi-channel notification delivery. Start with Discord webhooks for simplicity, add email for professional use, and expand to Telegram for mobile reach. The patterns in this guide scale from a personal script to a multi-user SaaS with minimal architectural changes.
