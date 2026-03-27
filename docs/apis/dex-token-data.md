# DEX / Token Data APIs

> Decentralized exchange pool data, token analytics, and on-chain trading pair information.

---

## GeckoTerminal

| | |
|---|---|
| **Base URL** | `https://api.geckoterminal.com/api/v2` |
| **Key Required** | No |
| **Rate Limit** | 30/min |
| **Docs** | https://www.geckoterminal.com/dex-api |

**Used Endpoints:**

| Endpoint | Purpose | Source Files |
|---|---|---|
| `GET /networks` | Supported networks | `src/lib/apis/geckoterminal.ts` |
| `GET /networks/{network}/trending_pools` | Trending pools by network | `src/app/api/geckoterminal/route.ts` |
| `GET /networks/{network}/new_pools` | Newly created pools | `src/app/api/v1/dex/route.ts` |
| `GET /networks/{network}/dexes/{dex}/pools` | Pools on a specific DEX | `src/app/api/v1/dex/route.ts` |

**Unused Endpoints (high value):**

| Endpoint | Potential Use |
|---|---|
| `GET /networks/{network}/tokens/{address}` | Token info by contract |
| `GET /networks/{network}/tokens/{address}/pools` | All pools for a token |
| `GET /networks/{network}/pools/{address}` | Specific pool details (price, volume, liquidity) |
| `GET /networks/{network}/pools/{address}/trades` | Recent trades — whale watching |
| `GET /networks/{network}/pools/{address}/ohlcv/{timeframe}` | Pool-level OHLCV candles |
| `GET /networks/{network}/tokens/multi/{addresses}` | Multi-token batch lookup |
| `GET /networks/{network}/pools/multi/{addresses}` | Multi-pool batch lookup |
| `GET /networks/{network}/tokens/{address}/info` | Token trust score, social links |
| `GET /search/pools` | Search pools by query |

---

## DexScreener

| | |
|---|---|
| **Base URL** | `https://api.dexscreener.com` |
| **Key Required** | No |
| **Rate Limit** | 60/min |
| **Docs** | https://docs.dexscreener.com/ |

**Used Endpoints:**

| Endpoint | Purpose | Source Files |
|---|---|---|
| `GET /latest/dex/search` | Search DEX pairs | `src/app/api/v1/dex/route.ts` |
| `GET /latest/dex/tokens/{chain}` | Token pairs by chain | `src/app/api/portfolio/route.ts` |
| `GET /token-boosts/latest/v1` | Boosted/promoted tokens | `src/app/api/v1/dex/route.ts` |

**Unused Endpoints:**

| Endpoint | Potential Use |
|---|---|
| `GET /latest/dex/pairs/{chainId}/{pairAddress}` | Specific pair details |
| `GET /latest/dex/tokens/{tokenAddresses}` | Multi-token batch lookup |
| `GET /token-profiles/latest/v1` | Token profile metadata (description, links, icon) |
| `GET /orders/v1/{chainId}/{pairAddress}` | Active paid orders |

---

## DEX Volume (DefiLlama)

| | |
|---|---|
| **Base URL** | `https://api.llama.fi/overview/dexs` |

**Used Endpoints:**

| Endpoint | Purpose |
|---|---|
| `GET /overview/dexs` | All DEX volume data |
| `GET /overview/dexs/{chain}` | DEX volume by chain |

---

## 1inch

| | |
|---|---|
| **Base URL** | `https://api.1inch.dev` |
| **Key Required** | No |
| **Source** | `src/lib/apis/oneinch.ts` |
