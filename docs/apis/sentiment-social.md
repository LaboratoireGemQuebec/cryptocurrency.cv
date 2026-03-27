# Sentiment / Social / Research APIs

> Market sentiment indicators, social media analytics, and crypto research data.

---

## Alternative.me (Fear & Greed Index)

| | |
|---|---|
| **Base URL** | `https://api.alternative.me` |
| **Key Required** | No |
| **Rate Limit** | Unlimited |

**Used Endpoints:**

| Endpoint | Purpose | Source Files |
|---|---|---|
| `GET /fng/` | Current Fear & Greed Index | `src/app/api/fear-greed/route.ts` |
| `GET /fng/?limit={days}` | Historical F&G data | `src/app/api/v1/fear-greed/route.ts` |

**Unused:**

| Endpoint | Potential Use |
|---|---|
| `GET /v2/ticker/` | Full crypto ticker data |
| `GET /v1/global/` | Global market stats |

---

## LunarCrush

| | |
|---|---|
| **Base URL** | `https://lunarcrush.com/api4/public` |
| **Env Var** | `LUNARCRUSH_API_KEY` |
| **Rate Limit** | 10/min |

**Used Endpoints:**

| Endpoint | Purpose |
|---|---|
| `GET /coins/list/v2?sort=galaxy_score` | Coins ranked by social sentiment |

---

## Messari

| | |
|---|---|
| **Base URL** | `https://data.messari.io/api/v1` (also `/api/v2`) |
| **Env Var** | `MESSARI_API_KEY` |
| **Rate Limit** | 20/min |

**Used Endpoints:**

| Endpoint | Purpose |
|---|---|
| `GET /assets/{slug}/profile` | Asset fundamental profile |
| `GET /assets?limit={n}` | Asset listings |

---

## Santiment

| | |
|---|---|
| **Base URL** | `https://api.santiment.net` |
| **Env Var** | `SANTIMENT_API_KEY` |

**Used:** GraphQL queries for on-chain/social analytics
