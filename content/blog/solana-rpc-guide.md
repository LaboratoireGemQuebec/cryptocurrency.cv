---
title: "Getting Started with the Solana RPC API"
description: "A developer's guide to the Solana JSON-RPC API. Learn how to query balances, transactions, program accounts, and build Solana data applications with JavaScript and Python."
date: "2026-03-30"
author: team
category: guide
tags: ["solana", "rpc", "api", "javascript", "developer", "blockchain"]
image: "/images/blog/solana-rpc-guide.jpg"
imageAlt: "Solana RPC API connection diagram showing validator nodes and developer queries"
---

Solana processes thousands of transactions per second and has built a vibrant developer ecosystem. If you are building anything on Solana — from a simple wallet viewer to a complex DeFi analytics platform — you will work with the Solana RPC API. This guide covers everything you need to go from first query to production-ready data application.

## Solana RPC Endpoints

Solana nodes expose the same JSON-RPC pattern as Ethereum, with Solana-specific methods. Public endpoints are available, and several providers offer managed nodes:

| Provider | Free Tier | Endpoint |
|----------|-----------|---------|
| Solana Mainnet | Public (rate-limited) | `https://api.mainnet-beta.solana.com` |
| Helius | 1M credits/month | `https://mainnet.helius-rpc.com` |
| QuickNode | 15M credits/month | Custom URL |
| Alchemy | 300M CU/month | Custom URL |
| Triton One | Paid plans | Custom URL |

For development and testing:

```bash
# Test with the public endpoint
export SOLANA_RPC="https://api.mainnet-beta.solana.com"
```

## Core RPC Methods

### getSlot — Current Slot

```bash
curl -X POST $SOLANA_RPC \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getSlot"}'
```

### getBalance — SOL Balance

```bash
curl -X POST $SOLANA_RPC \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getBalance",
    "params": ["vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg"]
  }'
```

Balance is returned in **lamports** (1 SOL = 1,000,000,000 lamports).

### getAccountInfo — Full Account Data

```bash
curl -X POST $SOLANA_RPC \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getAccountInfo",
    "params": [
      "vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg",
      {"encoding": "jsonParsed"}
    ]
  }'
```

## Using @solana/web3.js

The official JavaScript SDK makes Solana RPC much more ergonomic:

```bash
npm install @solana/web3.js
```

```javascript
import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from '@solana/web3.js';

const connection = new Connection(
  process.env.SOLANA_RPC || clusterApiUrl('mainnet-beta'),
  'confirmed'
);

// Get SOL balance
async function getSolBalance(address) {
  const pubkey = new PublicKey(address);
  const lamports = await connection.getBalance(pubkey);
  return lamports / LAMPORTS_PER_SOL;
}

// Get recent transactions
async function getRecentTransactions(address, limit = 10) {
  const pubkey = new PublicKey(address);
  const signatures = await connection.getSignaturesForAddress(pubkey, { limit });

  const transactions = await Promise.all(
    signatures.map(sig =>
      connection.getParsedTransaction(sig.signature, {
        maxSupportedTransactionVersion: 0,
      })
    )
  );

  return transactions.filter(Boolean).map((tx, i) => ({
    signature: signatures[i].signature,
    slot: tx.slot,
    blockTime: tx.blockTime,
    fee: tx.meta?.fee / LAMPORTS_PER_SOL,
    status: tx.meta?.err ? 'failed' : 'success',
  }));
}

// Usage
const address = 'vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg';
const balance = await getSolBalance(address);
console.log(`Balance: ${balance.toFixed(4)} SOL`);

const txns = await getRecentTransactions(address, 5);
txns.forEach(tx => {
  console.log(`${tx.signature.slice(0, 12)}... | ${tx.status} | ${tx.fee} SOL fee`);
});
```

## Getting SPL Token Balances

Solana tokens use the SPL Token program, not the main account like ETH:

```javascript
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

async function getSPLTokenBalances(walletAddress) {
  const pubkey = new PublicKey(walletAddress);

  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubkey, {
    programId: TOKEN_PROGRAM_ID,
  });

  return tokenAccounts.value
    .filter(account => {
      const amount = account.account.data.parsed.info.tokenAmount.uiAmount;
      return amount > 0;
    })
    .map(account => {
      const info = account.account.data.parsed.info;
      return {
        mint: info.mint,
        amount: info.tokenAmount.uiAmount,
        decimals: info.tokenAmount.decimals,
        accountAddress: account.pubkey.toString(),
      };
    });
}

const tokens = await getSPLTokenBalances('YourWalletAddressHere');
console.log(`Found ${tokens.length} SPL tokens`);
tokens.forEach(t => {
  console.log(`  Mint: ${t.mint.slice(0, 8)}... Amount: ${t.amount}`);
});
```

## Querying Program Accounts

One of Solana's most powerful features is the ability to filter accounts by program data:

```javascript
// Get all token accounts for a specific mint (e.g., USDC)
async function getTokenHolders(mintAddress, limit = 20) {
  const mint = new PublicKey(mintAddress);

  const accounts = await connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
    filters: [
      { dataSize: 165 }, // Token account size
      {
        memcmp: {
          offset: 0,
          bytes: mint.toBase58(),
        },
      },
    ],
  });

  return accounts
    .map(account => ({
      address: account.pubkey.toString(),
      amount: account.account.data.parsed?.info?.tokenAmount?.uiAmount ?? 0,
    }))
    .filter(a => a.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}

// USDC on Solana
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const holders = await getTokenHolders(USDC_MINT);
holders.forEach(h => console.log(`${h.address.slice(0, 12)}...: ${h.amount.toLocaleString()} USDC`));
```

## Subscribing to Account Changes via WebSocket

```javascript
const pubkey = new PublicKey('SomeSolanaAddress');

const subscriptionId = connection.onAccountChange(
  pubkey,
  (accountInfo, context) => {
    const solBalance = accountInfo.lamports / LAMPORTS_PER_SOL;
    console.log(`Balance changed: ${solBalance} SOL at slot ${context.slot}`);
  },
  'confirmed'
);

// Unsubscribe when done
connection.removeAccountChangeListener(subscriptionId);
```

## Using the Solana RPC in Python

```bash
pip install solana solders
```

```python
from solana.rpc.api import Client
from solders.pubkey import Pubkey

client = Client("https://api.mainnet-beta.solana.com")

# Get balance
address = Pubkey.from_string("vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg")
response = client.get_balance(address)
sol_balance = response.value / 1_000_000_000
print(f"Balance: {sol_balance:.4f} SOL")

# Get account info
info = client.get_account_info(address)
print(f"Owner: {info.value.owner}")
print(f"Executable: {info.value.executable}")
print(f"Lamports: {info.value.lamports}")
```

## Parsing Solana Transactions

Solana transaction parsing is more complex than Ethereum because of its account-based model:

```javascript
async function parseTransferDetails(signature) {
  const tx = await connection.getParsedTransaction(signature, {
    maxSupportedTransactionVersion: 0,
  });

  if (!tx?.meta) return null;

  const instructions = tx.transaction.message.instructions;

  for (const ix of instructions) {
    if ('parsed' in ix) {
      if (ix.parsed.type === 'transfer') {
        return {
          type: 'SOL transfer',
          from: ix.parsed.info.source,
          to: ix.parsed.info.destination,
          amount: ix.parsed.info.lamports / LAMPORTS_PER_SOL,
        };
      }
      if (ix.parsed.type === 'transferChecked') {
        return {
          type: 'SPL transfer',
          from: ix.parsed.info.source,
          to: ix.parsed.info.destination,
          amount: ix.parsed.info.tokenAmount.uiAmount,
          mint: ix.parsed.info.mint,
        };
      }
    }
  }

  return { type: 'complex', instructionCount: instructions.length };
}
```

## Solana's Unique RPC Advantages

Compared to Ethereum, Solana's RPC has some notable features:

- **`getProgramAccounts` with filters**: Query all accounts owned by a program with custom filters — extremely powerful for DeFi data
- **Parsed transactions**: The `jsonParsed` encoding returns human-readable instruction data
- **Higher throughput**: Public endpoints handle more requests before throttling
- **Cheaper historical data**: Transaction finality is typically under a second

## Conclusion

The Solana RPC API is well-documented, consistent, and powerful. With `@solana/web3.js`, you can query balances, tokens, program accounts, and transactions with minimal code. The ability to filter program accounts client-side makes building DeFi analytics, wallet explorers, and DEX trackers particularly straightforward compared to Ethereum's event log model.
