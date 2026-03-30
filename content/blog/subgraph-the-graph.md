---
title: "Building and Querying Subgraphs with The Graph Protocol"
description: "Learn how to build, deploy, and query subgraphs using The Graph Protocol. Step-by-step guide covering schema design, event handlers, and GraphQL queries."
date: "2026-03-30"
author: team
category: tutorial
tags: ["thegraph", "subgraph", "graphql", "ethereum", "defi", "developer"]
image: "/images/blog/subgraph-the-graph.jpg"
imageAlt: "The Graph Protocol subgraph architecture with smart contract events and GraphQL queries"
---

The Graph Protocol has become the standard way to access indexed blockchain data. Over 70,000 subgraphs have been deployed, powering data for Uniswap, Aave, Compound, and hundreds of other protocols. Learning to build and query subgraphs is one of the most valuable skills for a Web3 developer.

## What Is a Subgraph?

A subgraph is a custom API that indexes specific smart contract events and makes them queryable via GraphQL. You define what data to index, how to transform it, and what schema to expose — The Graph's decentralized network does the rest.

## Prerequisites

```bash
npm install -g @graphprotocol/graph-cli
```

You also need a free account at [thegraph.com/studio](https://thegraph.com/studio) to deploy.

## Step 1: Initialize the Subgraph

```bash
graph init --studio my-token-subgraph
```

Follow the prompts to select:
- Protocol: Ethereum
- Network: mainnet
- Contract address: your token contract
- The CLI will fetch the ABI from Etherscan automatically

## Step 2: Define the Schema

The schema defines the entities your subgraph exposes. Think of entities as database tables:

```graphql
# schema.graphql
type Token @entity {
  id: ID!
  name: String!
  symbol: String!
  decimals: Int!
  totalSupply: BigInt!
  transferCount: BigInt!
  holderCount: BigInt!
}

type Transfer @entity {
  id: ID!
  token: Token!
  from: Account!
  to: Account!
  amount: BigInt!
  blockNumber: BigInt!
  timestamp: BigInt!
  transactionHash: Bytes!
}

type Account @entity {
  id: ID! # wallet address
  transfersFrom: [Transfer!]! @derivedFrom(field: "from")
  transfersTo: [Transfer!]! @derivedFrom(field: "to")
  balance: BigInt!
  transferCount: BigInt!
}
```

## Step 3: Configure the Manifest

```yaml
# subgraph.yaml
specVersion: 0.0.5
schema:
  file: ./schema.graphql
dataSources:
  - kind: ethereum
    name: MyToken
    network: mainnet
    source:
      address: "0xYourContractAddress"
      abi: MyToken
      startBlock: 15000000
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.7
      language: wasm/assemblyscript
      entities:
        - Token
        - Transfer
        - Account
      abis:
        - name: MyToken
          file: ./abis/MyToken.json
      eventHandlers:
        - event: Transfer(indexed address,indexed address,uint256)
          handler: handleTransfer
      file: ./src/mapping.ts
```

## Step 4: Write the Mapping

Mappings are AssemblyScript functions that transform events into entities:

```typescript
// src/mapping.ts
import { BigInt, log } from '@graphprotocol/graph-ts';
import { Transfer as TransferEvent } from '../generated/MyToken/MyToken';
import { Token, Transfer, Account } from '../generated/schema';

const ZERO_BI = BigInt.fromI32(0);
const ONE_BI = BigInt.fromI32(1);

function getOrCreateAccount(address: string): Account {
  let account = Account.load(address);
  if (account === null) {
    account = new Account(address);
    account.balance = ZERO_BI;
    account.transferCount = ZERO_BI;
    account.save();
  }
  return account;
}

export function handleTransfer(event: TransferEvent): void {
  // Create transfer entity
  const transferId = event.transaction.hash.toHex() + '-' + event.logIndex.toString();
  const transfer = new Transfer(transferId);
  transfer.token = event.address.toHex();
  transfer.from = event.params.from.toHex();
  transfer.to = event.params.to.toHex();
  transfer.amount = event.params.value;
  transfer.blockNumber = event.block.number;
  transfer.timestamp = event.block.timestamp;
  transfer.transactionHash = event.transaction.hash;
  transfer.save();

  // Update sender account
  const from = getOrCreateAccount(event.params.from.toHex());
  from.balance = from.balance.minus(event.params.value);
  from.transferCount = from.transferCount.plus(ONE_BI);
  from.save();

  // Update recipient account
  const to = getOrCreateAccount(event.params.to.toHex());
  to.balance = to.balance.plus(event.params.value);
  to.transferCount = to.transferCount.plus(ONE_BI);
  to.save();

  // Update token stats
  let token = Token.load(event.address.toHex());
  if (token !== null) {
    token.transferCount = token.transferCount.plus(ONE_BI);
    token.save();
  }
}
```

## Step 5: Build and Deploy

```bash
# Generate types from schema and ABI
graph codegen

# Build the subgraph
graph build

# Authenticate with Graph Studio
graph auth --studio YOUR_DEPLOY_KEY

# Deploy to Studio
graph deploy --studio my-token-subgraph
```

## Querying Your Subgraph

Once deployed, your subgraph exposes a GraphQL endpoint:

```javascript
const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/YOUR_ID/my-token-subgraph/version/latest';

async function querySubgraph(query, variables = {}) {
  const response = await fetch(SUBGRAPH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const { data, errors } = await response.json();
  if (errors) throw new Error(errors[0].message);
  return data;
}

// Get recent large transfers
const data = await querySubgraph(`
  query LargeTransfers($minAmount: BigInt!) {
    transfers(
      first: 20,
      orderBy: timestamp,
      orderDirection: desc,
      where: { amount_gt: $minAmount }
    ) {
      id
      from { id }
      to { id }
      amount
      timestamp
      transactionHash
    }
  }
`, {
  minAmount: '10000000000000000000000', // 10,000 tokens (18 decimals)
});
```

### Pagination with The Graph

```javascript
async function getAllTransfers(minTimestamp) {
  const transfers = [];
  let skip = 0;
  const pageSize = 1000; // Max is 1000

  while (true) {
    const data = await querySubgraph(`
      {
        transfers(
          first: ${pageSize},
          skip: ${skip},
          orderBy: timestamp,
          orderDirection: asc,
          where: { timestamp_gte: "${minTimestamp}" }
        ) {
          id
          from { id }
          to { id }
          amount
          timestamp
        }
      }
    `);

    if (!data.transfers.length) break;
    transfers.push(...data.transfers);
    if (data.transfers.length < pageSize) break;
    skip += pageSize;
  }

  return transfers;
}
```

## Advanced: Time-Travel Queries

The Graph supports querying historical state at specific blocks:

```graphql
# Get account balance at block 18,000,000
{
  account(id: "0xabc...", block: { number: 18000000 }) {
    id
    balance
    transferCount
  }
}
```

## Advanced: Full-Text Search

```graphql
# schema.graphql addition
type Token @entity {
  id: ID!
  name: String!
  symbol: String!
  _searchIndex: String! # used for full-text search
}

type TokenSearch @fullTextSearch {
  text: String!
}
```

## Monitoring Subgraph Health

```javascript
async function checkSubgraphHealth(subgraphId) {
  const response = await fetch('https://api.thegraph.com/index-node/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `{
        indexingStatusForCurrentVersion(subgraphName: "${subgraphId}") {
          synced
          health
          fatalError { message }
          chains {
            latestBlock { number }
            chainHeadBlock { number }
          }
        }
      }`,
    }),
  });

  const { data } = await response.json();
  const status = data.indexingStatusForCurrentVersion;

  const latestBlock = parseInt(status.chains[0].latestBlock.number);
  const headBlock = parseInt(status.chains[0].chainHeadBlock.number);
  const behind = headBlock - latestBlock;

  return {
    synced: status.synced,
    health: status.health,
    blocksBehind: behind,
    error: status.fatalError?.message,
  };
}
```

## Querying Public Subgraphs

Many major protocols have deployed public subgraphs you can query immediately:

| Protocol | Subgraph Name |
|---------|--------------|
| Uniswap V3 | `uniswap/uniswap-v3` |
| Aave V3 | `aave/protocol-v3` |
| Compound V3 | `messari/compound-v3-ethereum` |
| ENS | `ensdomains/ens` |
| Curve | `curvefi/curve-pools` |

```javascript
// Query ENS registrations
const ensData = await querySubgraph(
  'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
  `{
    registrations(first: 10, orderBy: registrationDate, orderDirection: desc) {
      id
      labelName
      expiryDate
      registrant { id }
    }
  }`
);
```

## Conclusion

The Graph Protocol makes blockchain data accessible via a familiar GraphQL interface. Once you understand the three-component structure (schema, manifest, mappings), you can index any smart contract's events and expose them as a queryable API. With thousands of public subgraphs already available, you can also skip building your own and query the community's work directly.
