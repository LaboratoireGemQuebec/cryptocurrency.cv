# Derivatives / Funding Rates / Liquidations APIs

> Perpetual futures, funding rates, open interest, liquidation data, and order books from major exchanges.

---

## Bybit

| | |
|---|---|
| **Base URL** | `https://api.bybit.com/v5` |
| **Key Required** | No |
| **Rate Limit** | 120/min |

**Used Endpoints:**

| Endpoint | Purpose | Source Files |
|---|---|---|
| `GET /market/tickers?category=spot` | Spot tickers | `src/lib/trading/arbitrage.ts` |
| `GET /market/tickers?category=linear` | Perpetual tickers | `src/app/api/v1/derivatives/route.ts` |
| `GET /market/funding/history` | Funding rate history | `src/lib/trading/funding-rates.ts` |

---

## OKX

| | |
|---|---|
| **Base URL** | `https://www.okx.com/api/v5` |
| **Key Required** | No |
| **Rate Limit** | 60/min |

**Used Endpoints:**

| Endpoint | Purpose | Source Files |
|---|---|---|
| `GET /public/time` | Server time | `src/lib/constants.ts` |
| `GET /public/funding-rate` | Current funding rates | `src/lib/trading/funding-rates.ts` |
| `GET /market/tickers?instType=SPOT` | Spot tickers | `src/lib/trading/arbitrage.ts` |

---

## dYdX

| | |
|---|---|
| **Base URL** | `https://api.dydx.exchange/v3` |
| **Key Required** | No |
| **Rate Limit** | 100/min |

**Used Endpoints:**

| Endpoint | Purpose |
|---|---|
| Funding rates | Historical funding rates |

---

## Hyperliquid

| | |
|---|---|
| **Base URL** | `https://api.hyperliquid.xyz` |
| **Key Required** | No |
| **Rate Limit** | 120/min |

**Used Endpoints:**

| Endpoint | Purpose | Source Files |
|---|---|---|
| `POST /info` (type: "meta") | Market metadata | `src/app/api/hyperliquid/route.ts` |
| `POST /info` (type: "clearinghouseState") | Account state | `src/lib/new-integrations.ts` |
| `POST /info` (type: "funding") | Funding rate data | `src/lib/trading/funding-rates.ts` |

---

## CoinGlass

| | |
|---|---|
| **Base URL** | `https://open-api-v3.coinglass.com/api` |
| **Env Var** | `COINGLASS_API_KEY` |
| **Rate Limit** | 30/min |

**Used Endpoints:**

| Endpoint | Purpose | Source Files |
|---|---|---|
| `GET /futures/openInterest/chart` | OI chart data | `src/lib/apis/coinglass.ts` |
| `GET /futures/liquidation/chart` | Liquidation chart | `src/lib/apis/coinglass.ts` |
| `GET /futures/funding/info` | Funding rate info | `src/lib/new-integrations.ts` |
| `GET /public/v2/liquidation_history` | Historical liquidations | `src/app/api/liquidations/route.ts` |

---

## Kraken

| | |
|---|---|
| **Base URL** | `https://api.kraken.com/0` |
| **Key Required** | No |

**Used Endpoints:**

| Endpoint | Purpose |
|---|---|
| `GET /public/Ticker` | Asset pair ticker data |
| `GET /public/Depth` | Order book depth |

---

## KuCoin

| | |
|---|---|
| **Base URL** | `https://api.kucoin.com/api/v1` |
| **Key Required** | No |

**Used Endpoints:**

| Endpoint | Purpose |
|---|---|
| `GET /market/allTickers` | All market tickers |
| `GET /market/orderbook/level2_100` | Order book (100 levels) |
