# Historical Price / OHLCV APIs

> Historical candlestick data, price history, and time-series market data.

---

## CryptoCompare

| | |
|---|---|
| **Base URL** | `https://min-api.cryptocompare.com/data` |
| **Env Var** | `CRYPTOCOMPARE_API_KEY` (optional) |
| **Docs** | https://min-api.cryptocompare.com/documentation |

**Used Endpoints:**

| Endpoint | Purpose | Source Files |
|---|---|---|
| `GET /price` | Simple price lookup | `src/lib/apis/cryptocompare.ts` |
| `GET /v2/histominute` | Minute-level OHLCV | `src/app/api/v1/ohlcv/route.ts` |
| `GET /v2/histohour` | Hourly OHLCV | `src/app/api/v1/ohlcv/route.ts` |
| `GET /v2/histoday` | Daily OHLCV | `src/app/api/v1/ohlcv/route.ts` |
| `GET /news/latest` | Latest crypto news | `src/lib/apis/cryptocompare.ts` |
| `GET /news/feeds` | News feed sources | `src/lib/apis/cryptocompare.ts` |
| `GET /news/categories` | News categories | `src/lib/apis/cryptocompare.ts` |
| `GET /top/totalvolfull` | Top coins by volume | `src/lib/apis/cryptocompare.ts` |
| `GET /top/mktcapfull` | Top coins by market cap | `src/lib/apis/cryptocompare.ts` |
| `GET /social/coin/latest` | Social stats for a coin | `src/lib/apis/cryptocompare.ts` |
| `GET /trading/signals/intotheblock` | On-chain signals | `src/lib/apis/cryptocompare.ts` |
| `GET /pricemultifull` | Multi-pair full price data | `src/lib/apis/cryptocompare.ts` |
| `GET /exchange/top/volume` | Top exchanges by volume | `src/lib/apis/cryptocompare.ts` |
| `GET /v2/pair/mapping/exchange` | Trading pair mappings | `src/lib/apis/cryptocompare.ts` |

**Unused Endpoints:**

| Endpoint | Potential Use |
|---|---|
| `GET /blockchain/histo/day` | On-chain metrics over time (active addresses, tx count, hashrate) |
| `GET /blockchain/latest` | Latest on-chain snapshot |
| `GET /blockchain/mining/calculator` | Mining profitability |
| `GET /top/exchanges/full` | Top exchanges with full data |
| `GET /exchange/histoday` | Historical exchange volume |
| `GET /ob/l2/snapshot` | Level 2 order book snapshots |
