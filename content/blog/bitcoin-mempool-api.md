---
title: "Reading the Bitcoin Mempool via API"
description: "Learn how to read the Bitcoin mempool via API using mempool.space and Bitcoin Core RPC. Monitor unconfirmed transactions, fee rates, and transaction acceleration."
date: "2026-03-30"
author: team
category: tutorial
tags: ["bitcoin", "mempool", "api", "fees", "developer", "transaction"]
image: "/images/blog/bitcoin-mempool-api.jpg"
imageAlt: "Bitcoin mempool visualization showing unconfirmed transactions ordered by fee rate"
---

The Bitcoin mempool is the waiting room for unconfirmed transactions. Every transaction broadcast to the network sits in the mempool until a miner includes it in a block. Reading the mempool gives you insight into network congestion, optimal fee rates, and the status of specific transactions — all essential capabilities for Bitcoin application developers.

## What Is the Mempool?

When a Bitcoin user broadcasts a transaction, it propagates to nodes across the network. Each node keeps a local copy of unconfirmed transactions in its mempool. Miners select transactions from the mempool to include in the next block, typically prioritizing those with higher fee rates (satoshis per virtual byte, or sat/vB).

During periods of high demand, the mempool can hold tens of thousands of transactions. During quiet periods, it is nearly empty and even low-fee transactions confirm quickly.

## mempool.space API

[mempool.space](https://mempool.space) provides a free, well-documented REST API for Bitcoin mempool data:

```bash
# No API key required for basic endpoints
BASE_URL=https://mempool.space/api
```

### Current Mempool Statistics

```bash
curl https://mempool.space/api/mempool
```

```javascript
async function getMempoolStats() {
  const response = await fetch('https://mempool.space/api/mempool');
  const data = await response.json();

  return {
    count: data.count,               // Number of unconfirmed transactions
    vsize: data.vsize,               // Total size in virtual bytes
    totalFees: data.total_fee,       // Total fees (in satoshis)
    feeHistogram: data.fee_histogram, // Distribution of fee rates
  };
}

const stats = await getMempoolStats();
console.log(`Mempool: ${stats.count.toLocaleString()} transactions`);
console.log(`Size: ${(stats.vsize / 1e6).toFixed(1)} MB`);
console.log(`Total fees: ${(stats.totalFees / 1e8).toFixed(4)} BTC`);
```

### Recommended Fee Rates

```javascript
async function getRecommendedFees() {
  const response = await fetch('https://mempool.space/api/v1/fees/recommended');
  const fees = await response.json();

  return {
    fastestFee: fees.fastestFee,     // Next block (sat/vB)
    halfHourFee: fees.halfHourFee,   // Within 30 min
    hourFee: fees.hourFee,           // Within 1 hour
    economyFee: fees.economyFee,     // Within a few hours
    minimumFee: fees.minimumFee,     // Minimum to relay
  };
}

const fees = await getRecommendedFees();
console.log('Bitcoin Fee Recommendations:');
console.log(`Fastest (next block): ${fees.fastestFee} sat/vB`);
console.log(`30 minutes:          ${fees.halfHourFee} sat/vB`);
console.log(`1 hour:              ${fees.hourFee} sat/vB`);
console.log(`Economy:             ${fees.economyFee} sat/vB`);
```

### Looking Up a Transaction

```javascript
async function getTransaction(txid) {
  const response = await fetch(`https://mempool.space/api/tx/${txid}`);
  if (!response.ok) return null;

  const tx = await response.json();

  return {
    txid: tx.txid,
    size: tx.size,
    weight: tx.weight,
    fee: tx.fee,
    feeRate: tx.fee / (tx.weight / 4), // sat/vB
    confirmed: tx.status.confirmed,
    blockHeight: tx.status.block_height,
    blockTime: tx.status.block_time
      ? new Date(tx.status.block_time * 1000)
      : null,
    inputs: tx.vin.length,
    outputs: tx.vout.length,
    value: tx.vout.reduce((sum, out) => sum + (out.value ?? 0), 0),
  };
}

const txid = 'YOUR_TXID_HERE';
const tx = await getTransaction(txid);
if (tx) {
  console.log(`Transaction: ${tx.txid}`);
  console.log(`Fee rate: ${tx.feeRate.toFixed(1)} sat/vB`);
  console.log(`Status: ${tx.confirmed ? `Confirmed at block ${tx.blockHeight}` : 'Unconfirmed'}`);
}
```

### Getting Address History and Mempool Transactions

```javascript
async function getAddressData(address) {
  const [stats, utxos, mempool] = await Promise.all([
    fetch(`https://mempool.space/api/address/${address}`).then(r => r.json()),
    fetch(`https://mempool.space/api/address/${address}/utxo`).then(r => r.json()),
    fetch(`https://mempool.space/api/address/${address}/txs/mempool`).then(r => r.json()),
  ]);

  const confirmedBalance = stats.chain_stats.funded_txo_sum - stats.chain_stats.spent_txo_sum;
  const unconfirmedBalance = stats.mempool_stats.funded_txo_sum - stats.mempool_stats.spent_txo_sum;

  return {
    address,
    confirmedBalance: confirmedBalance / 1e8,    // satoshis to BTC
    unconfirmedBalance: unconfirmedBalance / 1e8,
    totalBalance: (confirmedBalance + unconfirmedBalance) / 1e8,
    utxoCount: utxos.length,
    pendingTransactions: mempool.length,
  };
}
```

### Fee Rate Histogram

```javascript
async function getFeeHistogram() {
  const response = await fetch('https://mempool.space/api/mempool');
  const { fee_histogram } = await response.json();

  // fee_histogram is [[fee_rate, size_in_vbytes], ...]
  // Cumulative size above each fee rate
  let cumulative = 0;
  const histogram = fee_histogram.map(([feeRate, size]) => {
    cumulative += size;
    return {
      feeRate,
      size,
      cumulativeSize: cumulative,
      cumulativeMB: cumulative / 1e6,
    };
  });

  return histogram;
}
```

## Bitcoin Core RPC

If you run your own Bitcoin node, you can query the mempool directly:

```bash
# Get raw mempool
bitcoin-cli getrawmempool

# Get detailed mempool info
bitcoin-cli getrawmempool true

# Get mempool entry for a specific transaction
bitcoin-cli getmempoolentry "txid_here"

# Get mempool info summary
bitcoin-cli getmempoolinfo
```

### Using Bitcoin Core JSON-RPC in JavaScript

```javascript
async function bitcoinRpc(method, params = []) {
  const response = await fetch(`http://localhost:8332/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(
        `${process.env.BITCOIN_RPC_USER}:${process.env.BITCOIN_RPC_PASSWORD}`
      ).toString('base64')}`,
    },
    body: JSON.stringify({ jsonrpc: '1.0', id: 1, method, params }),
  });

  const { result, error } = await response.json();
  if (error) throw new Error(error.message);
  return result;
}

async function getMempoolInfo() {
  return bitcoinRpc('getmempoolinfo');
}

async function getMempoolEntry(txid) {
  return bitcoinRpc('getmempoolentry', [txid]);
}

const info = await getMempoolInfo();
console.log(`Mempool: ${info.size} transactions, ${(info.bytes / 1e6).toFixed(1)} MB`);
console.log(`Min fee rate: ${(info.mempoolminfee * 1e8).toFixed(0)} sat/vB`);
```

## Estimating Transaction Confirmation Time

```javascript
async function estimateConfirmationTime(feeRateSatPerVB) {
  const histogram = await getFeeHistogram();

  // Find where this fee rate sits in the queue
  const position = histogram
    .filter(entry => entry.feeRate > feeRateSatPerVB)
    .reduce((sum, entry) => sum + entry.size, 0);

  // Average Bitcoin block is ~1.5 MB, produced every 10 minutes
  const BLOCK_SIZE_BYTES = 1_500_000;
  const BLOCK_TIME_MINUTES = 10;
  const blocksNeeded = Math.ceil(position / BLOCK_SIZE_BYTES);
  const minutesEstimate = blocksNeeded * BLOCK_TIME_MINUTES;

  return {
    feeRate: feeRateSatPerVB,
    bytesAhead: position,
    estimatedBlocks: blocksNeeded,
    estimatedMinutes: minutesEstimate,
  };
}

const estimate = await estimateConfirmationTime(20); // 20 sat/vB
console.log(`At ${estimate.feeRate} sat/vB: ~${estimate.estimatedBlocks} blocks (~${estimate.estimatedMinutes} minutes)`);
```

## Building a Fee Estimation Widget

```tsx
import { useState, useEffect } from 'react';

interface FeeData {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
}

function BitcoinFeeWidget() {
  const [fees, setFees] = useState<FeeData | null>(null);

  useEffect(() => {
    const load = () => {
      fetch('https://mempool.space/api/v1/fees/recommended')
        .then(r => r.json())
        .then(setFees);
    };
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!fees) return <div>Loading fee data...</div>;

  const tiers = [
    { label: 'Fast (~10 min)', fee: fees.fastestFee, color: '#22c55e' },
    { label: 'Normal (~30 min)', fee: fees.halfHourFee, color: '#3b82f6' },
    { label: 'Economy (~1 hr)', fee: fees.hourFee, color: '#f59e0b' },
    { label: 'Low priority', fee: fees.economyFee, color: '#6b7280' },
  ];

  return (
    <div className="border rounded-xl p-4 w-64 shadow-sm">
      <h3 className="font-bold mb-3">Bitcoin Fees</h3>
      {tiers.map(t => (
        <div key={t.label} className="flex justify-between py-1 border-b last:border-0">
          <span className="text-sm">{t.label}</span>
          <span className="font-mono font-semibold" style={{ color: t.color }}>
            {t.fee} sat/vB
          </span>
        </div>
      ))}
    </div>
  );
}
```

## Conclusion

The Bitcoin mempool API gives developers real-time visibility into transaction backlog, fee markets, and confirmation status. The mempool.space API is particularly well-suited for production use — it is free, fast, and covers every use case from simple fee recommendations to detailed transaction analysis. Whether you are building a wallet, a payment processor, or a blockchain analytics tool, mempool data is essential for delivering good user experiences.
