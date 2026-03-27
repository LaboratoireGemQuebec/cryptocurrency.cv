# Analytics / On-chain SQL APIs

> On-chain analytics platforms, protocol revenue data, and token vesting schedules.

---

## Dune Analytics

| | |
|---|---|
| **Base URL** | `https://api.dune.com/api/v1` |
| **Env Var** | `DUNE_API_KEY` |
| **Rate Limit** | 40/min |

**Used Endpoints:**

| Endpoint | Purpose |
|---|---|
| `GET /query/{queryId}/results` | Fetch query results |
| `POST /query/{queryId}/execute` | Execute a query |

---

## Token Terminal

| | |
|---|---|
| **Base URL** | `https://api.tokenterminal.com/v2` |
| **Env Var** | `TOKENTERMINAL_API_KEY` |

**Used:** Protocol revenue, earnings, P/E data

---

## Token Unlocks

| | |
|---|---|
| **Base URL** | `https://token.unlocks.app/api` |
| **Key Required** | No |

**Used:** Token vesting schedule data
