---
title: "How to Build an Ethereum Gas Price Tracker"
description: "Step-by-step guide to building a real-time Ethereum gas price tracker using the ETH JSON-RPC API, ethers.js, and a simple frontend. Monitor gas in your apps."
date: "2026-03-30"
author: team
category: tutorial
tags: ["ethereum", "gas", "api", "javascript", "developer", "ethers"]
image: "/images/blog/gas-price-tracker-build.jpg"
imageAlt: "Ethereum gas price tracker showing slow, standard, and fast transaction costs"
---

Ethereum gas fees are a fundamental part of using and building on the network. Any app that submits transactions needs to know the current gas price to offer users accurate estimates. Even informational apps benefit from showing users when it is cheap or expensive to transact. Building a gas price tracker is a great first Ethereum project.

## Understanding Ethereum Gas

Since EIP-1559 (August 2021), Ethereum uses a two-part fee structure:

- **Base fee**: Burned by the network, set algorithmically based on block utilization. You have no choice but to pay this.
- **Priority fee (tip)**: Paid to validators to incentivize transaction inclusion. You choose this.
- **Max fee**: The maximum you are willing to pay total (base fee + tip). Excess is refunded.

The actual fee you pay = `base fee + priority fee`, capped at `max fee`.

Gas prices are measured in **gwei** (1 gwei = 0.000000001 ETH, or 10^-9 ETH).

## Fetching Gas Data with JSON-RPC

### Basic Gas Price

```bash
# Legacy gas price (pre-EIP-1559 style)
curl -X POST https://eth.llamarpc.com \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_gasPrice","params":[],"id":1}'
```

### EIP-1559 Fee Data

```bash
# Get current base fee from the latest block
curl -X POST https://eth.llamarpc.com \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":["latest",false],"id":1}'
```

The `baseFeePerGas` field in the block response gives you the current base fee.

## Fetching Gas with ethers.js

```javascript
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com');

async function getGasInfo() {
  const feeData = await provider.getFeeData();

  const toGwei = (value) =>
    value ? parseFloat(ethers.formatUnits(value, 'gwei')).toFixed(2) : null;

  return {
    gasPrice: toGwei(feeData.gasPrice),         // legacy
    maxFeePerGas: toGwei(feeData.maxFeePerGas), // EIP-1559 max
    maxPriorityFeePerGas: toGwei(feeData.maxPriorityFeePerGas), // tip
  };
}

const gas = await getGasInfo();
console.log(`Base fee + tip max:  ${gas.maxFeePerGas} gwei`);
console.log(`Priority fee (tip):  ${gas.maxPriorityFeePerGas} gwei`);
```

## Getting Fee History for Speed Tiers

The `eth_feeHistory` method lets you compute suggested slow/standard/fast prices:

```javascript
async function getGasTiers() {
  // Get fee history for last 10 blocks
  // Percentiles: 10th (slow), 50th (standard), 90th (fast)
  const feeHistory = await provider.send('eth_feeHistory', [
    '0xA', // 10 blocks
    'latest',
    [10, 50, 90], // percentiles
  ]);

  const rewards = feeHistory.reward.filter(r => r.every(v => v !== '0x0'));
  if (!rewards.length) return null;

  const avgByPercentile = [0, 1, 2].map(i => {
    const sum = rewards.reduce((acc, r) => acc + BigInt(r[i]), 0n);
    return parseFloat(ethers.formatUnits(sum / BigInt(rewards.length), 'gwei'));
  });

  const baseFee = parseFloat(
    ethers.formatUnits(
      BigInt(feeHistory.baseFeePerGas[feeHistory.baseFeePerGas.length - 1]),
      'gwei'
    )
  );

  return {
    baseFee: baseFee.toFixed(2),
    tiers: {
      slow: {
        maxPriorityFee: avgByPercentile[0].toFixed(2),
        maxFee: (baseFee * 1.2 + avgByPercentile[0]).toFixed(2),
        estimatedTime: '5-10 min',
      },
      standard: {
        maxPriorityFee: avgByPercentile[1].toFixed(2),
        maxFee: (baseFee * 1.2 + avgByPercentile[1]).toFixed(2),
        estimatedTime: '1-3 min',
      },
      fast: {
        maxPriorityFee: avgByPercentile[2].toFixed(2),
        maxFee: (baseFee * 1.2 + avgByPercentile[2]).toFixed(2),
        estimatedTime: '< 30 sec',
      },
    },
  };
}
```

## Building a Node.js Gas API Server

```javascript
import express from 'express';
import { ethers } from 'ethers';

const app = express();
const provider = new ethers.JsonRpcProvider(
  process.env.ETH_RPC_URL || 'https://eth.llamarpc.com'
);

// Cache to avoid hammering the node
let gasCache = null;
let lastFetch = 0;
const CACHE_TTL = 12000; // 12 seconds (roughly one block)

async function refreshGas() {
  const now = Date.now();
  if (gasCache && now - lastFetch < CACHE_TTL) return gasCache;

  const tiers = await getGasTiers();
  gasCache = tiers;
  lastFetch = now;
  return tiers;
}

app.get('/api/gas', async (req, res) => {
  try {
    const gas = await refreshGas();
    res.json(gas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Estimate transaction cost
app.get('/api/gas/estimate', async (req, res) => {
  try {
    const { gasLimit = 21000 } = req.query;
    const gas = await refreshGas();

    const limits = { transfer: 21000, erc20: 65000, swap: 200000, complex: 500000 };
    const ethPrice = 3000; // Would fetch from price API in production

    const estimates = Object.entries(limits).map(([type, gas_units]) => {
      const costGwei = parseFloat(gas.tiers.standard.maxFee) * gas_units;
      const costEth = costGwei / 1e9;
      return {
        type,
        gasUnits: gas_units,
        costEth: costEth.toFixed(6),
        costUsd: (costEth * ethPrice).toFixed(2),
      };
    });

    res.json({ baseFee: gas.baseFee, estimates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001);
```

## React Gas Price Widget

```tsx
import { useState, useEffect } from 'react';

interface GasTier {
  maxPriorityFee: string;
  maxFee: string;
  estimatedTime: string;
}

interface GasData {
  baseFee: string;
  tiers: {
    slow: GasTier;
    standard: GasTier;
    fast: GasTier;
  };
}

function GasWidget() {
  const [gas, setGas] = useState<GasData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchGas = async () => {
    const res = await fetch('/api/gas');
    const data = await res.json();
    setGas(data);
    setLastUpdated(new Date());
  };

  useEffect(() => {
    fetchGas();
    const interval = setInterval(fetchGas, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!gas) return <div className="animate-pulse">Loading gas data...</div>;

  const tiers = [
    { key: 'slow', label: 'Slow', color: 'text-gray-500' },
    { key: 'standard', label: 'Standard', color: 'text-blue-600' },
    { key: 'fast', label: 'Fast', color: 'text-green-600' },
  ] as const;

  return (
    <div className="bg-white rounded-xl border p-4 shadow-sm w-72">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">Gas Tracker</h3>
        <span className="text-xs text-gray-400">
          {lastUpdated?.toLocaleTimeString()}
        </span>
      </div>

      <div className="text-sm text-gray-500 mb-3">
        Base fee: <span className="font-medium text-black">{gas.baseFee} gwei</span>
      </div>

      <div className="space-y-2">
        {tiers.map(({ key, label, color }) => (
          <div key={key} className="flex justify-between items-center">
            <div>
              <span className={`font-medium ${color}`}>{label}</span>
              <span className="text-xs text-gray-400 ml-2">
                {gas.tiers[key].estimatedTime}
              </span>
            </div>
            <div className="text-right">
              <div className="font-mono text-sm">{gas.tiers[key].maxFee}</div>
              <div className="text-xs text-gray-400">gwei</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Tracking Gas History

Monitor gas trends with a historical chart:

```javascript
async function getGasHistory(blocks = 100) {
  const history = [];
  const latest = await provider.getBlockNumber();

  for (let i = latest - blocks; i <= latest; i += 10) {
    const block = await provider.getBlock(i);
    if (block?.baseFeePerGas) {
      history.push({
        block: i,
        timestamp: block.timestamp,
        baseFee: parseFloat(ethers.formatUnits(block.baseFeePerGas, 'gwei')),
      });
    }
  }

  return history;
}
```

## Gas Alerts

```javascript
async function monitorGas(targetGwei, callback) {
  const poll = async () => {
    const gas = await getGasTiers();
    const current = parseFloat(gas.baseFee);
    if (current <= targetGwei) {
      callback({ message: `Gas is low! Currently ${current} gwei`, gas });
    }
  };

  poll();
  return setInterval(poll, 30000);
}

// Alert when gas drops below 10 gwei
const alertId = await monitorGas(10, ({ message }) => {
  console.log(message);
  // Send push notification, email, etc.
});
```

## Conclusion

Gas tracking is a must-have feature for any Ethereum-focused application. With ethers.js, the `eth_feeHistory` RPC method, and proper caching, you can deliver accurate slow/standard/fast tier estimates with minimal node load. Add a real-time widget to your frontend and your users will always know the right time to transact.
