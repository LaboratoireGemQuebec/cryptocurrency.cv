---
title: "On-Chain Data Analysis for Developers"
description: "Learn how to analyze on-chain blockchain data using Dune Analytics, Flipside, The Graph, and direct node queries. Covers SQL, GraphQL, and Python techniques."
date: "2026-03-30"
author: team
category: research
tags: ["on-chain", "analytics", "dune", "sql", "blockchain", "developer"]
image: "/images/blog/on-chain-data-analysis.jpg"
imageAlt: "On-chain blockchain data analysis dashboard with transaction flow charts"
---

On-chain data is the most transparent financial dataset in existence. Every transaction, every swap, every liquidation is recorded permanently on-chain and available for anyone to analyze. Developers who understand how to query and interpret this data have a significant edge in building tools, research products, and trading systems.

## The On-Chain Data Ecosystem

Several platforms and approaches let you query blockchain data:

| Platform | Query Language | Best For |
|----------|---------------|---------|
| Dune Analytics | SQL (DuneSQL) | Ad-hoc analysis, dashboards |
| Flipside Crypto | SQL | Research, historical queries |
| The Graph | GraphQL | Protocol-specific data |
| Allium | SQL | Enterprise, high volume |
| Direct RPC | JSON-RPC | Real-time, specific queries |
| Nansen | Dashboard | Wallet labeling, tracking |

## Dune Analytics: SQL on Blockchain Data

Dune Analytics is the most popular on-chain analytics platform. You write SQL queries that run against indexed blockchain tables.

### Key Tables

```sql
-- ethereum.transactions: All ETH transactions
SELECT
  block_time,
  hash,
  from,
  to,
  value / 1e18 AS eth_value,
  gas_used,
  gas_price / 1e9 AS gwei
FROM ethereum.transactions
WHERE block_time >= NOW() - INTERVAL '1' day
  AND value > 0
ORDER BY value DESC
LIMIT 20;
```

```sql
-- DEX trades across all protocols
SELECT
  block_time,
  project,
  token_bought_symbol,
  token_sold_symbol,
  amount_usd,
  tx_hash
FROM dex.trades
WHERE block_time >= NOW() - INTERVAL '7' days
  AND amount_usd > 100000
ORDER BY amount_usd DESC
LIMIT 50;
```

### Analyzing Uniswap Volume Over Time

```sql
SELECT
  DATE_TRUNC('day', block_time) AS day,
  COUNT(*) AS num_trades,
  SUM(amount_usd) AS volume_usd
FROM dex.trades
WHERE project = 'uniswap'
  AND block_time >= NOW() - INTERVAL '90' days
GROUP BY 1
ORDER BY 1;
```

## The Graph Protocol: GraphQL for DeFi Data

The Graph indexes smart contract events and makes them queryable via GraphQL. Many major protocols have public subgraphs.

### Querying Uniswap V3 Token Data

```javascript
async function getTokenData(tokenAddress) {
  const query = `
    {
      token(id: "${tokenAddress.toLowerCase()}") {
        name
        symbol
        decimals
        totalSupply
        tradeVolumeUSD
        totalLiquidity
        txCount
        derivedETH
      }
    }
  `;

  const response = await fetch(
    'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    }
  );

  const { data } = await response.json();
  return data.token;
}

// WETH address
const weth = await getTokenData('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2');
console.log(`WETH Volume: $${parseFloat(weth.tradeVolumeUSD).toLocaleString()}`);
```

### Historical Pool Data with Pagination

```javascript
async function getAllPoolSwaps(poolAddress, maxSwaps = 1000) {
  const swaps = [];
  let skip = 0;

  while (swaps.length < maxSwaps) {
    const query = `
      {
        swaps(
          first: 100,
          skip: ${skip},
          where: { pool: "${poolAddress.toLowerCase()}" },
          orderBy: timestamp,
          orderDirection: desc
        ) {
          timestamp
          amount0
          amount1
          amountUSD
          sender
          recipient
        }
      }
    `;

    const response = await fetch(
      'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      }
    );

    const { data } = await response.json();
    if (!data.swaps.length) break;

    swaps.push(...data.swaps);
    skip += 100;

    // Avoid rate limiting
    await new Promise(r => setTimeout(r, 200));
  }

  return swaps;
}
```

## Analyzing Wallet Activity with Python

```python
import httpx
import pandas as pd
from datetime import datetime

ETHERSCAN_API = "https://api.etherscan.io/api"

def get_wallet_transactions(address: str, api_key: str) -> pd.DataFrame:
    """Fetch all transactions for an Ethereum wallet."""
    response = httpx.get(ETHERSCAN_API, params={
        "module": "account",
        "action": "txlist",
        "address": address,
        "startblock": 0,
        "endblock": 99999999,
        "sort": "desc",
        "apikey": api_key,
    })
    data = response.json()

    if data["status"] != "1":
        return pd.DataFrame()

    df = pd.DataFrame(data["result"])
    df["value_eth"] = df["value"].astype(float) / 1e18
    df["timestamp"] = pd.to_datetime(df["timeStamp"].astype(int), unit="s")
    df["gas_cost_eth"] = df["gasUsed"].astype(float) * df["gasPrice"].astype(float) / 1e18

    return df

def analyze_wallet(address: str, api_key: str):
    df = get_wallet_transactions(address, api_key)

    # Separate incoming and outgoing
    incoming = df[df["to"].str.lower() == address.lower()]
    outgoing = df[df["from"].str.lower() == address.lower()]

    total_received = incoming["value_eth"].sum()
    total_sent = outgoing["value_eth"].sum()
    total_gas = outgoing["gas_cost_eth"].sum()

    print(f"Total received: {total_received:.4f} ETH")
    print(f"Total sent:     {total_sent:.4f} ETH")
    print(f"Total gas:      {total_gas:.4f} ETH")
    print(f"Transaction count: {len(df)}")
    print(f"\nFirst tx: {df['timestamp'].min()}")
    print(f"Last tx:  {df['timestamp'].max()}")
```

## Tracking Whale Wallets

Monitoring large wallet movements is a common on-chain analysis use case:

```python
def find_whale_transactions(
    min_eth: float = 1000,
    block_range: int = 100
) -> list[dict]:
    """Find large ETH transfers in recent blocks."""
    w3 = Web3(Web3.HTTPProvider('https://eth.llamarpc.com'))

    latest = w3.eth.block_number
    whales = []

    for block_num in range(latest - block_range, latest):
        block = w3.eth.get_block(block_num, full_transactions=True)

        for tx in block.transactions:
            value_eth = w3.from_wei(tx.value, 'ether')
            if value_eth >= min_eth:
                whales.append({
                    "block": block_num,
                    "hash": tx.hash.hex(),
                    "from": tx["from"],
                    "to": tx.to,
                    "value_eth": float(value_eth),
                })

    return sorted(whales, key=lambda x: x["value_eth"], reverse=True)
```

## On-Chain Metrics That Matter

### Network Activity Metrics

- **Active addresses**: Unique addresses transacting per day — a measure of adoption
- **Transaction count**: Volume of on-chain activity
- **Fee revenue**: How much miners/validators earned — correlates with network demand
- **Mean transaction value**: Average USD moved per transaction

### Token Flow Metrics

- **Exchange inflows/outflows**: Net movement of tokens to/from exchanges (inflow = potential sell pressure)
- **Stablecoin flows**: Large stablecoin movements to exchanges often precede buying
- **Miner/validator outflows**: Selling behavior of block reward recipients

### DeFi Metrics

- **Total Value Locked (TVL)**: Assets deposited in DeFi protocols
- **Liquidations**: Forced position closures in lending protocols
- **DEX volume vs CEX volume**: Decentralization trend indicator

## Building an On-Chain Alert System

```javascript
import { ethers } from 'ethers';

const provider = new ethers.WebSocketProvider(
  `wss://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
);

const ALERT_THRESHOLD_ETH = 500n * 10n ** 18n; // 500 ETH

provider.on('block', async (blockNumber) => {
  const block = await provider.getBlock(blockNumber, true);
  if (!block?.prefetchedTransactions) return;

  for (const tx of block.prefetchedTransactions) {
    if (tx.value >= ALERT_THRESHOLD_ETH) {
      const ethValue = ethers.formatEther(tx.value);
      console.log(`WHALE ALERT: ${ethValue} ETH moved`);
      console.log(`  From: ${tx.from}`);
      console.log(`  To: ${tx.to}`);
      console.log(`  Tx: https://etherscan.io/tx/${tx.hash}`);
    }
  }
});
```

## Combining On-Chain Data with News

On-chain events become more meaningful with context. Pair whale alerts and TVL changes with news from the [free-crypto-news API](https://free-crypto-news.com) to understand the narrative driving each move:

```javascript
async function enrichOnChainEvent(event) {
  const newsResponse = await fetch(
    `https://free-crypto-news.com/api/news?symbols=${event.token}&limit=3`
  );
  const news = await newsResponse.json();

  return {
    ...event,
    relatedNews: news.articles.slice(0, 3),
  };
}
```

## Conclusion

On-chain data analysis is one of the most powerful capabilities available to crypto developers. From SQL queries on Dune to real-time whale tracking with ethers.js, the tools are accessible and the data is public. Mastering on-chain analysis turns raw blockchain transactions into actionable insights for trading, research, and product development.
