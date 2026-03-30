---
title: "What Is a Blockchain Indexer and Why Do Developers Need One"
description: "Learn what blockchain indexers are, why raw RPC nodes are insufficient for most apps, and how tools like The Graph, Subsquid, and Ponder solve the indexing problem."
date: "2026-03-30"
author: team
category: guide
tags: ["indexer", "blockchain", "thegraph", "developer", "ethereum", "data"]
image: "/images/blog/blockchain-indexer-explained.jpg"
imageAlt: "Blockchain indexer architecture diagram showing raw chain data being transformed into queryable database"
---

Every developer who builds on Ethereum eventually runs into the same problem: querying raw blockchain data is slow, expensive, and limited. You cannot efficiently ask a node "show me all swaps in this Uniswap pool over the past 30 days" — at least not without an indexer. Understanding what blockchain indexers are and why they exist is fundamental to serious crypto development.

## The Problem with Raw RPC Queries

Ethereum nodes expose data through JSON-RPC methods designed for real-time operations: check a balance, submit a transaction, read a contract state. They are not designed for analytical queries.

Consider these common application requirements:

- "Get the trading history for this wallet over the past year"
- "Show me all ERC-20 transfers above $10,000 in the last 24 hours"
- "What are the top liquidity providers in this Uniswap pool?"

To answer the first question via raw RPC, you would need to:
1. Get the current block number (~20 million)
2. Iterate backwards through ~2 million blocks (~1 year)
3. For each block, scan every transaction
4. Filter for transactions involving your wallet

That is millions of RPC calls, taking hours, and costing significant money on paid providers. A blockchain indexer solves this by pre-processing and storing chain data in a queryable format.

## What a Blockchain Indexer Does

An indexer is a background service that:

1. **Ingests** blocks and transactions from a node in real-time
2. **Parses** smart contract events using ABIs
3. **Transforms** raw data into structured tables
4. **Stores** it in a database optimized for queries
5. **Exposes** a query API (usually GraphQL or SQL)

The result is a database where answering "all USDC transfers in the last 7 days" takes milliseconds, not hours.

## The Graph Protocol

The Graph is the most widely adopted indexing protocol. Developers write "subgraphs" that define which contract events to index and how to transform them.

### Subgraph Structure

A subgraph has three components:

**1. Schema** (`schema.graphql`): Defines the data model

```graphql
type Token @entity {
  id: ID!
  symbol: String!
  name: String!
  decimals: BigInt!
  totalSupply: BigDecimal!
  tradeVolumeUSD: BigDecimal!
  txCount: BigInt!
}

type Swap @entity {
  id: ID!
  timestamp: BigInt!
  pool: Pool!
  sender: Bytes!
  recipient: Bytes!
  amount0: BigDecimal!
  amount1: BigDecimal!
  amountUSD: BigDecimal!
  sqrtPriceX96: BigInt!
  tick: BigInt!
}
```

**2. Manifest** (`subgraph.yaml`): Defines which contracts and events to track

```yaml
specVersion: 0.0.5
schema:
  file: ./schema.graphql
dataSources:
  - kind: ethereum
    name: UniswapV3Factory
    network: mainnet
    source:
      address: "0x1F98431c8aD98523631AE4a59f267346ea31F984"
      abi: Factory
      startBlock: 12369621
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.7
      language: wasm/assemblyscript
      entities:
        - Pool
        - Token
      abis:
        - name: Factory
          file: ./abis/factory.json
      eventHandlers:
        - event: PoolCreated(indexed address,indexed address,indexed uint24,int24,address)
          handler: handlePoolCreated
      file: ./src/mappings/factory.ts
```

**3. Mappings** (`src/mappings/*.ts`): AssemblyScript handlers that transform events into entities

```typescript
import { PoolCreated } from '../generated/UniswapV3Factory/UniswapV3Factory';
import { Pool, Token } from '../generated/schema';

export function handlePoolCreated(event: PoolCreated): void {
  let pool = new Pool(event.params.pool.toHexString());
  pool.token0 = event.params.token0.toHexString();
  pool.token1 = event.params.token1.toHexString();
  pool.feeTier = BigInt.fromI32(event.params.fee);
  pool.createdAtTimestamp = event.block.timestamp;
  pool.createdAtBlockNumber = event.block.number;
  pool.totalValueLockedUSD = BigDecimal.fromString('0');
  pool.save();
}
```

## Deploying and Querying a Subgraph

```bash
# Install Graph CLI
npm install -g @graphprotocol/graph-cli

# Initialize a new subgraph
graph init --studio my-subgraph

# Build
graph build

# Deploy to The Graph Studio
graph deploy my-subgraph
```

### Querying the Deployed Subgraph

```javascript
async function querySubgraph(endpoint, query, variables = {}) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });

  const { data, errors } = await response.json();
  if (errors) throw new Error(errors.map(e => e.message).join(', '));
  return data;
}

// Query the Uniswap V3 subgraph
const data = await querySubgraph(
  'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  `{
    swaps(
      first: 20,
      orderBy: timestamp,
      orderDirection: desc,
      where: { amountUSD_gt: "10000" }
    ) {
      id
      timestamp
      amountUSD
      pool {
        token0 { symbol }
        token1 { symbol }
      }
    }
  }`
);

data.swaps.forEach(swap => {
  console.log(`${swap.pool.token0.symbol}/${swap.pool.token1.symbol}: $${parseFloat(swap.amountUSD).toFixed(0)}`);
});
```

## Ponder: A Modern Indexer for TypeScript Developers

Ponder is a newer indexer that uses TypeScript directly instead of AssemblyScript:

```bash
npm create ponder@latest my-indexer
cd my-indexer
npm install
```

```typescript
// ponder.schema.ts
import { createSchema } from '@ponder/core';

export default createSchema((p) => ({
  TransferEvent: p.createTable({
    id: p.string(),
    from: p.hex(),
    to: p.hex(),
    amount: p.bigint(),
    timestamp: p.int(),
    token: p.string(),
  }),
}));
```

```typescript
// src/index.ts
import { ponder } from '@/generated';

ponder.on('ERC20:Transfer', async ({ event, context }) => {
  await context.db.TransferEvent.create({
    id: event.log.id,
    data: {
      from: event.args.from,
      to: event.args.to,
      amount: event.args.value,
      timestamp: event.block.timestamp,
      token: event.log.address,
    },
  });
});
```

## Subsquid: High-Performance Indexing

Subsquid offers a high-performance alternative with a data lake architecture:

```typescript
// processor.ts
import { EvmBatchProcessor } from '@subsquid/evm-processor';
import { TypeormDatabase } from '@subsquid/typeorm-store';

const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: 'https://v2.archive.subsquid.io/network/ethereum-mainnet',
    chain: process.env.ETH_RPC_URL,
  })
  .addLog({
    address: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'], // USDC
    topic0: [Transfer.topic], // ERC-20 Transfer event
  });

processor.run(new TypeormDatabase(), async (ctx) => {
  const transfers = [];

  for (const block of ctx.blocks) {
    for (const log of block.logs) {
      const { from, to, value } = Transfer.decode(log);
      transfers.push({
        id: log.id,
        from,
        to,
        amount: value,
        blockNumber: block.header.height,
        timestamp: new Date(block.header.timestamp),
      });
    }
  }

  await ctx.store.insert(transfers);
});
```

## Building a Simple Custom Indexer

For simple use cases, you can build a lightweight indexer without a framework:

```javascript
import { ethers } from 'ethers';
import sqlite3 from 'better-sqlite3';

const provider = new ethers.JsonRpcProvider(process.env.ETH_RPC_URL);
const db = new sqlite3('transfers.db');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS transfers (
    id TEXT PRIMARY KEY,
    block_number INTEGER,
    timestamp INTEGER,
    from_address TEXT,
    to_address TEXT,
    value TEXT,
    tx_hash TEXT
  )
`);

const insertTransfer = db.prepare(
  'INSERT OR IGNORE INTO transfers VALUES (?, ?, ?, ?, ?, ?, ?)'
);

const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
const TRANSFER_TOPIC = ethers.id('Transfer(address,address,uint256)');

// Process blocks
async function processBlock(blockNumber) {
  const block = await provider.getBlock(blockNumber);
  const logs = await provider.getLogs({
    fromBlock: blockNumber,
    toBlock: blockNumber,
    address: USDC_ADDRESS,
    topics: [TRANSFER_TOPIC],
  });

  for (const log of logs) {
    const from = ethers.getAddress('0x' + log.topics[1].slice(26));
    const to = ethers.getAddress('0x' + log.topics[2].slice(26));
    const value = BigInt(log.data).toString();

    insertTransfer.run(
      log.transactionHash + log.logIndex,
      blockNumber,
      block?.timestamp ?? 0,
      from,
      to,
      value,
      log.transactionHash,
    );
  }

  console.log(`Block ${blockNumber}: ${logs.length} USDC transfers`);
}

// Catch up to current block
const latestBlock = await provider.getBlockNumber();
const startBlock = latestBlock - 100; // last 100 blocks

for (let i = startBlock; i <= latestBlock; i++) {
  await processBlock(i);
}
```

## Choosing Your Indexing Approach

| Approach | Best For | Trade-offs |
|----------|---------|-----------|
| The Graph | Protocol-level data, community subgraphs | AssemblyScript, deployment complexity |
| Ponder | TypeScript shops, custom schemas | Newer, smaller community |
| Subsquid | High-volume, complex transformations | More infrastructure to manage |
| Custom | Simple use cases, full control | No framework support |
| Hosted APIs (Alchemy, Moralis) | Quick integration, no infra | API rate limits, cost |

## Conclusion

Blockchain indexers are the infrastructure layer between raw chain data and useful applications. Without them, most DeFi analytics, wallet explorers, and trading dashboards would be impossible at scale. Understanding the indexing stack — from The Graph's subgraphs to custom TypeScript indexers with Ponder — makes you a substantially more capable crypto developer.
