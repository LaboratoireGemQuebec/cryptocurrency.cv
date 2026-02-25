# Data Source Operations Runbook

> Operational guide for managing 50+ crypto data APIs.
> Covers API key setup, provider chain configuration, and monitoring.

---

## Quick Reference: API Key Signup

### Free Tier (Sign Up Immediately)

| # | Service | Signup URL | Env Var | Rate Limit |
|---|---------|-----------|---------|------------|
| 1 | **CoinMarketCap** | https://coinmarketcap.com/api/ | `CMC_API_KEY` | 10K credits/mo |
| 2 | **Etherscan** | https://etherscan.io/apis | `ETHERSCAN_API_KEY` | 5 calls/sec |
| 3 | **LunarCrush** | https://lunarcrush.com/developers | `LUNARCRUSH_API_KEY` | 10/min |
| 4 | **Messari** | https://messari.io/api | `MESSARI_API_KEY` | 20/min |
| 5 | **CoinGlass** | https://coinglass.com/pricing | `COINGLASS_API_KEY` | 30/min |
| 6 | **Dune Analytics** | https://dune.com/docs/api/ | `DUNE_API_KEY` | 40/min |
| 7 | **Birdeye** | https://docs.birdeye.so/ | `BIRDEYE_API_KEY` | 100/min |
| 8 | **CoinGecko** | https://www.coingecko.com/en/api | `COINGECKO_API_KEY` | 500/min (vs 30) |

### No Key Required (Already Active)

- Hyperliquid (120/min)
- GeckoTerminal (30/min)
- DefiLlama + Yields + Stablecoins (unlimited)
- L2BEAT (30/min)
- Pyth Network (100/min)
- Blockchain.info (30/min)
- Mempool.space (unlimited)
- Alternative.me Fear & Greed (unlimited)
- CoinCap (200/min)
- CoinPaprika (20/min)
- Binance (1200/min)
- Bybit (120/min)
- OKX (60/min)
- dYdX (100/min)
- DexScreener (60/min)

---

## Provider Chain Registry

After importing `@/lib/providers/setup`, all chains are registered.

### Querying via Registry

```ts
import '@/lib/providers/setup';
import { registry } from '@/lib/providers';

// Fetch from any registered category
const prices = await registry.fetch('market-price', { coinIds: ['bitcoin'] });
const tvl = await registry.fetch('tvl', { limit: 10 });
const oi = await registry.fetch('derivatives', { symbols: ['BTC'] });
const social = await registry.fetch('social-metrics', { limit: 50 });
const chain = await registry.fetch('on-chain', {});
const stables = await registry.fetch('stablecoin-flows', { limit: 20 });
```

### Direct Chain Access

```ts
import {
  marketPriceChain,
  derivativesChain,
  defiYieldsChain,
  onChainChain,
  socialChain,
  stablecoinFlowsChain,
} from '@/lib/providers';

const prices = await marketPriceChain.fetch({ coinIds: ['bitcoin'] });
const derivatives = await derivativesChain.fetch({ symbols: ['BTC'] });
```

---

## Adding a New Data Source

### Step 1: Create Adapter

```ts
// src/lib/providers/adapters/<category>/<name>.adapter.ts
import type { DataProvider, FetchParams, RateLimitConfig } from '../../types';

export const myAdapter: DataProvider<MyType[]> = {
  name: 'my-source',
  description: 'Description',
  priority: 2,
  weight: 0.30,
  rateLimit: { maxRequests: 60, windowMs: 60_000 },
  capabilities: ['my-category'],

  async fetch(params: FetchParams): Promise<MyType[]> {
    const response = await fetch('https://api.example.com/data');
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return (await response.json()).map(normalize);
  },

  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch('https://api.example.com/health', {
        signal: AbortSignal.timeout(5000),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  validate(data: MyType[]): boolean {
    return Array.isArray(data) && data.length > 0;
  },
};
```

### Step 2: Wire into Chain

```ts
// src/lib/providers/adapters/<category>/index.ts
import { myAdapter } from './my-source.adapter';

export function createMyChain() {
  const chain = new ProviderChain<MyType[]>('my-category', config);
  chain.addProvider(existingAdapter);
  chain.addProvider(myAdapter); // Add as fallback
  return chain;
}
```

### Step 3: Register

```ts
// src/lib/providers/setup.ts
import { myChain } from './adapters/my-category';

registry.register('my-category', {
  category: 'my-category',
  name: 'My Category',
  description: 'Description',
  chain: myChain,
});
```

---

## New API Endpoints Reference

| Endpoint | Source | Key Required | Cache |
|----------|--------|-------------|-------|
| `GET /api/hyperliquid` | Hyperliquid | No | 15s |
| `GET /api/hyperliquid?type=funding` | Hyperliquid | No | 15s |
| `GET /api/hyperliquid?type=oi` | Hyperliquid | No | 15s |
| `GET /api/geckoterminal` | GeckoTerminal | No | 30s |
| `GET /api/geckoterminal?network=solana` | GeckoTerminal | No | 30s |
| `GET /api/geckoterminal?type=new` | GeckoTerminal | No | 30s |
| `GET /api/stablecoins` | DefiLlama | No | 300s |
| `GET /api/stablecoins?chains=true` | DefiLlama | No | 300s |
| `GET /api/on-chain` | Blockchain.info / Mempool.space / Etherscan | Etherscan: Yes | 30s |
| `GET /api/on-chain?chain=btc` | Blockchain.info / Mempool.space | No | 30s |
| `GET /api/on-chain?chain=eth` | Etherscan | Yes | 30s |
| `GET /api/providers/status` | Internal | No | 60s |

---

## Degradation Levels

| Level | Trigger | Action |
|-------|---------|--------|
| **NORMAL** | Default | All features active |
| **ELEVATED** | >70% capacity | Shed luxury features (social, AI, chart analysis) |
| **HIGH** | >85% capacity | Also shed enhanced features (AI commentary, podcast) |
| **CRITICAL** | >95% capacity | Only core features (news, prices, search) |

### Manual Override

```ts
import { degradation } from '@/lib/scale';

// Check current level
degradation.getLevel(); // 'normal' | 'elevated' | 'high' | 'critical'

// Force level (e.g., from monitoring alert)
degradation.setLevel('high');

// Check if feature should run
degradation.shouldRun(3); // false if level >= elevated
```

---

## Environment Variables Checklist

Copy to `.env.local`:

```env
# === MARKET DATA ===
COINGECKO_API_KEY=
CMC_API_KEY=

# === DERIVATIVES ===
COINGLASS_API_KEY=

# === ON-CHAIN ===
ETHERSCAN_API_KEY=
GLASSNODE_API_KEY=

# === SOCIAL ===
LUNARCRUSH_API_KEY=

# === RESEARCH ===
MESSARI_API_KEY=
DUNE_API_KEY=

# === SOLANA ===
BIRDEYE_API_KEY=

# === INFRASTRUCTURE ===
REDIS_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# === AI ===
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=
GROQ_API_KEY=
```
