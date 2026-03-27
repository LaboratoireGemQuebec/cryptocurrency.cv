# News Aggregation APIs

> Crypto news aggregation services with sentiment analysis and filtering.

---

## CryptoPanic

| | |
|---|---|
| **Base URL** | `https://cryptopanic.com/api/v1` |
| **Env Var** | `CRYPTOPANIC_API_KEY` |

**Used Endpoints:**

| Endpoint | Purpose |
|---|---|
| `GET /posts/` | Aggregated crypto news with sentiment |

---

## NewsAPI.org

| | |
|---|---|
| **Base URL** | `https://newsapi.org/v2` |
| **Env Var** | `NEWSAPI_API_KEY` |

**Used Endpoints:**

| Endpoint | Purpose |
|---|---|
| `GET /everything` | Search all articles |
| `GET /top-headlines` | Top headlines by category |

---

## CryptoCompare News

See [Historical Price / OHLCV](historical-ohlcv.md) — CryptoCompare also provides news endpoints: `/news/latest`, `/news/feeds`, `/news/categories`.
