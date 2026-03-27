# Market Price Data APIs

> Real-time and historical cryptocurrency market price data from multiple providers with automatic failover.

---

## CoinGecko

| | |
|---|---|
| **Base URL** | `https://api.coingecko.com/api/v3` |
| **Env Var** | `COINGECKO_API_KEY` (optional — raises rate limit) |
| **Rate Limit** | 30/min free, 500/min with key |
| **Docs** | https://docs.coingecko.com/reference/introduction |

**Used Endpoints:**

| Endpoint | Purpose | Source Files |
|---|---|---|
| `GET /ping` | Health check | `src/lib/constants.ts` |
| `GET /simple/price` | Current price for coin(s) in given currencies | `src/lib/market-data.ts` |
| `GET /coins/markets` | Market data for top coins (price, volume, market cap) | `src/lib/market-data.ts` |
| `GET /coins/list` | Full list of all coins with ids, symbols, names | `src/lib/market-data.ts` |
| `GET /coins/{id}` | Full coin details (description, links, market data) | `src/lib/market-data.ts` |
| `GET /coins/{id}/market_chart` | Historical price, market cap, volume over time | `src/app/api/charts/route.ts` |
| `GET /coins/{id}/ohlc` | OHLC candlestick data | `src/app/api/charts/route.ts` |
| `GET /global` | Global crypto market stats | `src/lib/market-data.ts` |
| `GET /search/trending` | Top 7 trending coins by search volume | `src/lib/market-data.ts` |

**Unused Endpoints (high value):**

| Endpoint | Potential Use |
|---|---|
| `GET /coins/{id}/tickers` | Exchange-level trading pairs, volume, spread — liquidity analysis |
| `GET /coins/{id}/history` | Snapshot of data at a specific date — historical article context |
| `GET /exchanges` | Exchange rankings, volume, trust score |
| `GET /exchanges/{id}/tickers` | All trading pairs on a specific exchange |
| `GET /global/decentralized_finance_defi` | DeFi-specific global stats (market cap, dominance, volume) |
| `GET /coins/categories` | Category-level aggregations (Layer 1, Layer 2, Meme, AI, etc.) |
| `GET /coins/categories/list` | List all categories |
| `GET /search` | Full-text search across coins, exchanges, categories |
| `GET /asset_platforms` | All supported chains/platforms |
| `GET /nfts/{id}` | NFT collection floor price, volume, market cap |
| `GET /nfts/list` | All NFT collections |
| `GET /derivatives` | Futures/perpetuals across exchanges |
| `GET /derivatives/exchanges` | Derivatives exchange rankings |
| `GET /exchange_rates` | BTC-denominated rates for all fiat |
| `GET /companies/public_treasury/{coin_id}` | Public companies holding BTC/ETH (MicroStrategy, Tesla…) |

---

## Binance Spot

| | |
|---|---|
| **Base URL** | `https://api.binance.com/api/v3` |
| **Key Required** | No |
| **Rate Limit** | 1200/min |
| **Docs** | https://binance-docs.github.io/apidocs/spot/en/ |

**Used Endpoints:**

| Endpoint | Purpose | Source Files |
|---|---|---|
| `GET /ping` | Health check | `src/lib/constants.ts` |
| `GET /ticker/24hr` | 24h price change stats for all symbols | `src/lib/data-pipeline.ts` |
| `GET /ticker/bookTicker` | Best bid/ask price and qty | `src/lib/data-pipeline.ts` |
| `GET /klines` | Candlestick/OHLCV data | `src/app/api/v1/ohlcv/route.ts` |
| `GET /depth` | Order book depth | `src/app/api/v1/orderbook/route.ts` |

**Unused Endpoints (high value):**

| Endpoint | Potential Use |
|---|---|
| `GET /trades` | Recent trades — whale trade detection |
| `GET /aggTrades` | Compressed aggregate trades |
| `GET /avgPrice` | Current average price (lightweight) |
| `GET /ticker/price` | Latest price only (lower weight than 24hr) |
| `GET /exchangeInfo` | All trading rules, filters, symbol status |
| WebSocket Streams | Real-time streaming (`@trade`, `@kline`, `@depth`) |

---

## Binance Futures

| | |
|---|---|
| **Base URL** | `https://fapi.binance.com` |
| **Key Required** | No |
| **Docs** | https://binance-docs.github.io/apidocs/futures/en/ |

**Used Endpoints:**

| Endpoint | Purpose | Source Files |
|---|---|---|
| `GET /fapi/v1/ping` | Health check | `src/lib/constants.ts` |
| `GET /fapi/v1/premiumIndex` | Mark price and funding rate | `src/app/api/v1/derivatives/route.ts` |
| `GET /fapi/v1/openInterest` | Open interest for a symbol | `src/app/api/v1/derivatives/route.ts` |
| `GET /fapi/v1/ticker/price` | Latest futures price | `src/lib/trading/arbitrage.ts` |
| `GET /fapi/v1/allForceOrders` | Liquidation orders | `src/app/api/liquidations/route.ts` |
| `GET /fapi/v1/fundingRate` | Funding rate history | `src/lib/trading/funding-rates.ts` |
| `GET /futures/data/openInterestHist` | Historical open interest | `src/app/api/v1/derivatives/route.ts` |

**Unused Endpoints (high value):**

| Endpoint | Potential Use |
|---|---|
| `GET /fapi/v1/longShortAccountRatio` | Long/short ratio — strong sentiment signal |
| `GET /fapi/v1/topLongShortPositionRatio` | Top trader positioning |
| `GET /fapi/v1/globalLongShortAccountRatio` | Global long/short ratio |
| `GET /fapi/v1/takerlongshortRatio` | Taker buy/sell volume ratio |
| `GET /fapi/v1/indexPriceKlines` | Index price candles |
| `GET /fapi/v1/markPriceKlines` | Mark price candles |
| `GET /fapi/v1/lvtKlines` | Leveraged token candles |

---

## CoinCap

| | |
|---|---|
| **Base URL** | `https://api.coincap.io/v2` |
| **Key Required** | No |
| **Rate Limit** | 200/min |
| **Docs** | https://docs.coincap.io/ |

**Used Endpoints:**

| Endpoint | Purpose | Source Files |
|---|---|---|
| `GET /assets` | Top assets by market cap | `src/lib/market-data.ts` |

**Unused Endpoints:**

| Endpoint | Potential Use |
|---|---|
| `GET /assets/{id}` | Single asset details |
| `GET /assets/{id}/history` | Historical price data |
| `GET /assets/{id}/markets` | Markets (exchanges) for an asset |
| `GET /rates` | Fiat & crypto exchange rates |
| `GET /exchanges` | Exchange data |
| `GET /markets` | Market data across exchanges |
| `GET /candles` | OHLCV candles |
| WebSocket | Real-time price stream |

---

## CoinPaprika

| | |
|---|---|
| **Base URL** | `https://api.coinpaprika.com/v1` |
| **Key Required** | No |
| **Rate Limit** | 20/min |
| **Docs** | https://api.coinpaprika.com/ |

**Used Endpoints:**

| Endpoint | Purpose | Source Files |
|---|---|---|
| `GET /tickers` | Market data for all coins | `src/lib/market-data.ts` |
| `GET /coins/{id}` | Coin details | `src/lib/market-data.ts` |

**Unused Endpoints:**

| Endpoint | Potential Use |
|---|---|
| `GET /tickers/{id}/historical` | Historical tickers |
| `GET /coins/{id}/ohlcv/latest` | OHLCV data |
| `GET /coins/{id}/ohlcv/historical` | Historical OHLCV |
| `GET /coins/{id}/exchanges` | Exchanges listing the coin |
| `GET /coins/{id}/markets` | All markets for a coin |
| `GET /coins/{id}/events` | Upcoming events |
| `GET /global` | Global market stats |
| `GET /exchanges` | Exchange listings |
| `GET /tags` | Coin categories/tags |
| `GET /search` | Search coins, exchanges, people |

---

## CoinLore

| | |
|---|---|
| **Base URL** | `https://api.coinlore.net/api` |
| **Key Required** | No |

**Used Endpoints:**

| Endpoint | Purpose |
|---|---|
| `GET /tickers/` | Top 100 coins by market cap |

**Unused:**

| Endpoint | Potential Use |
|---|---|
| `GET /ticker/?id={id}` | Specific coin data |
| `GET /global/` | Global market stats |
| `GET /exchanges/` | Exchange data |
| `GET /coin/markets/?id={id}` | Markets for a coin |

---

## CoinMarketCap

| | |
|---|---|
| **Base URL** | `https://pro-api.coinmarketcap.com/v1` |
| **Env Vars** | `CMC_API_KEY` / `COINMARKETCAP_API_KEY` |
| **Rate Limit** | 10K credits/mo (free tier) |
| **Docs** | https://coinmarketcap.com/api/documentation/v1/ |

**Used Endpoints:**

| Endpoint | Purpose | Source Files |
|---|---|---|
| `GET /cryptocurrency/listings/latest` | Top coins with market data | `src/lib/apis/coinmarketcap.ts` |
| `GET /global-metrics/quotes/latest` | Global market metrics | `src/lib/new-integrations.ts` |

**Unused Endpoints (high value):**

| Endpoint | Potential Use |
|---|---|
| `GET /cryptocurrency/quotes/latest` | Quotes for specific coins |
| `GET /cryptocurrency/quotes/historical` | Historical quotes |
| `GET /cryptocurrency/ohlcv/latest` | Latest OHLCV |
| `GET /cryptocurrency/ohlcv/historical` | Historical OHLCV |
| `GET /cryptocurrency/trending/latest` | Trending coins |
| `GET /cryptocurrency/trending/gainers-losers` | Biggest movers |
| `GET /cryptocurrency/trending/most-visited` | Most visited |
| `GET /cryptocurrency/categories` | Market categories |
| `GET /cryptocurrency/category` | Specific category coins |
| `GET /cryptocurrency/airdrops` | Airdrop listings |
| `GET /exchange/listings/latest` | Exchange rankings |
| `GET /content/latest` | CMC news/content |
| `GET /fear-and-greed/latest` | CMC Fear & Greed Index |
