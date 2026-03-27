# DeFi / TVL / Yields APIs

> Decentralized finance protocol data including TVL, yield farming, stablecoin flows, bridge volumes, and fee revenue.

---

## DefiLlama (Main)

| | |
|---|---|
| **Base URL** | `https://api.llama.fi` |
| **Key Required** | No |
| **Rate Limit** | Unlimited |
| **Docs** | https://defillama.com/docs/api |

**Used Endpoints:**

| Endpoint | Purpose | Source Files |
|---|---|---|
| `GET /protocols` | All protocols with TVL | `src/lib/apis/defillama.ts` |
| `GET /v2/chains` | Chain TVL data | `src/app/api/v1/defi/route.ts` |
| `GET /protocol/{name}` | Single protocol TVL history | `src/lib/apis/defillama.ts` |
| `GET /charts` | Historical total TVL | `src/app/api/v1/fundamentals/route.ts` |
| `GET /overview/dexs` | DEX volume overview | `src/app/api/flows/route.ts` |
| `GET /overview/fees` | Protocol fee revenue | `src/lib/apis/defillama.ts` |
| `GET /bridges` | Cross-chain bridge data | `src/app/api/flows/route.ts` |
| `GET /unlocks` | Token unlock schedules | `src/app/api/unlocks/route.ts` |
| `GET /v2/historicalChainTvl` | Historical TVL | `src/app/api/ai/oracle/route.ts` |

**Unused Endpoints (high value):**

| Endpoint | Potential Use |
|---|---|
| `GET /v2/historicalChainTvl/{chain}` | Per-chain TVL history |
| `GET /overview/options` | Options DEX volume |
| `GET /overview/dexs/{chain}` | DEX volume by chain |
| `GET /overview/fees/{chain}` | Fee revenue by chain |
| `GET /bridges/{id}` | Individual bridge stats |
| `GET /bridgevolume/{chain}` | Bridge in/out flow per chain — capital flow tracking |
| `GET /raises` | VC fundraising rounds (deal size, investors, stage) |
| `GET /hacks` | Exploit/hack history (amounts, protocols affected) |
| `GET /liquidations` | Lending liquidation data |
| `GET /emissions` | Token emission schedules |
| `GET /treasuries` | Protocol treasury holdings |

---

## DefiLlama Yields

| | |
|---|---|
| **Base URL** | `https://yields.llama.fi` |
| **Key Required** | No |

**Used Endpoints:**

| Endpoint | Purpose |
|---|---|
| `GET /pools` | All yield pools with APY data |

**Unused:**

| Endpoint | Potential Use |
|---|---|
| `GET /chart/{pool}` | Historical yield for a specific pool |

---

## DefiLlama Stablecoins

| | |
|---|---|
| **Base URL** | `https://stablecoins.llama.fi` |
| **Key Required** | No |

**Used Endpoints:**

| Endpoint | Purpose |
|---|---|
| `GET /stablecoinchains` | Stablecoin distribution by chain |
| `GET /stablecoins?includePrices=true` | All stablecoins with market data |

**Unused:**

| Endpoint | Potential Use |
|---|---|
| `GET /stablecoincharts/{chain}` | Stablecoin TVL over time per chain |
| `GET /stablecoinprices` | Current stablecoin prices |

---

## DefiLlama Fees

| | |
|---|---|
| **Base URL** | `https://fees.llama.fi` |

**Used Endpoints:**

| Endpoint | Purpose |
|---|---|
| `GET /overview/fees` | Fee revenue across protocols |

---

## DefiLlama Coins

| | |
|---|---|
| **Base URL** | `https://coins.llama.fi` |

**Used Endpoints:**

| Endpoint | Purpose |
|---|---|
| `GET /prices/current/{coins}` | Current prices via DefiLlama |

**Unused:**

| Endpoint | Potential Use |
|---|---|
| `GET /prices/historical/{timestamp}/{coins}` | Historical prices at timestamp |
| `GET /percentage/{coins}` | Price percentage changes |
| `GET /chart/{coins}` | Price chart data |
| `GET /block/{chain}/{timestamp}` | Block at timestamp |

---

## DefiLlama Bridges

| | |
|---|---|
| **Base URL** | `https://bridges.llama.fi` |

**Used Endpoints:**

| Endpoint | Purpose |
|---|---|
| `GET /bridges` | All bridge data |
| `GET /bridge/{id}` | Single bridge details |
